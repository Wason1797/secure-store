from app.config.env_manager import EnvManager
from app.security.oauth import oauth_client
from fastapi import APIRouter, Request, Response
from starlette.responses import RedirectResponse

router = APIRouter()


@router.get('/login')
async def login(request: Request):
    redirect_uri = request.url_for('google_auth')
    return await oauth_client.google.authorize_redirect(request, redirect_uri)


@router.route('/google')
async def google_auth(request: Request):
    # Perform Google OAuth
    token = await oauth_client.google.authorize_access_token(request)

    if (user := token.get('userinfo')):
        request.session['user'] = user

    return RedirectResponse(url=f'{EnvManager.SECURE_STORE_UI_URL}/dashboard')


@router.get('/logout')
async def logout(request: Request, response: Response):
    request.session.pop('user', None)
    return {'status': 'logout ok'}
