from typing import List, Optional

from app.crypto import (AESEncryption, ECDHExchange, FernetEncryption,
                        RSAEncryption)
from app.repositories.database.connectors import (DynamoDBConnector,
                                                  RedisConnector)
from app.repositories.database.managers import (CachedKeyManager,
                                                SecretManager, UserManager)
from app.repositories.filesystem import LocalFileManager
from app.repositories.object_storage.connectors import S3Connector
from app.repositories.object_storage.managers import S3Manager
from app.security.validators import get_user
from app.serializers.secrets import KeyAgreementPayload, KeyAgreementResponse
from app.serializers.secrets import SecretBase as SecretBasicSerializer
from app.serializers.secrets import SecretFull as SecretFullSerializer
from app.serializers.secrets import ShareSecretsPayload
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException

router = APIRouter()


@router.get('/user/current', response_model=List[SecretFullSerializer])
async def get_secrets_shared_with_current_user(user: Optional[dict] = Depends(get_user), db=Depends(DynamoDBConnector.get_db)):
    secrets = await SecretManager.shared_with_me(db, user.get('sub'))
    return secrets


@router.post('/share', response_model=List[SecretBasicSerializer])
async def share_secrets(background_tasks: BackgroundTasks, payload: ShareSecretsPayload, db=Depends(DynamoDBConnector.get_db),
                        cache=Depends(RedisConnector.get_db), s3=Depends(S3Connector.get_storage), user: Optional[dict] = Depends(get_user)):

    if (not (shared_key := await CachedKeyManager.get_key_for_user(cache, user.get('sub'), FernetEncryption.decrypt))):
        raise HTTPException(status_code=409, detail='Key Agreement is required prior to sharing secrets')

    user_emails_to_share = set(payload.users)
    current_users = await UserManager.get_all(db)
    users_to_share = [user for user in current_users if user.user_email in user_emails_to_share]

    result, paths_to_clean = await SecretManager.share_secrets(db, user.get('email'), user.get('sub'), users_to_share, shared_key.derived_key,
                                                               payload.secrets, RSAEncryption, AESEncryption, (S3Manager, s3))

    background_tasks.add_task(LocalFileManager.clean_files, paths_to_clean)
    await CachedKeyManager.delete_key_for_user(cache, user.get('sub'))

    return result


@router.post('/agree/key', response_model=KeyAgreementResponse)
async def perform_key_agreement(payload: KeyAgreementPayload, cache=Depends(RedisConnector.get_db), user: Optional[dict] = Depends(get_user)):

    if (await CachedKeyManager.get_key_for_user(cache, user.get('sub'))):
        raise HTTPException(status_code=409, detail='There is an agreement already for this user, use the current secret or wait until expires')

    server_private_key, server_public_key = ECDHExchange.generate_keys()
    derived_key = ECDHExchange.derive_shared_hkdf_key(payload.public_key, server_private_key, raw=True)

    await CachedKeyManager.set_key_for_user(cache, user.get('sub'), derived_key, FernetEncryption.encrypt)

    return KeyAgreementResponse(server_public_key=server_public_key)
