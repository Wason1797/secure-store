import json

if __name__ == '__main__':
    with open('./secrets.json') as secrets_file:
        secrets = json.load(secrets_file)

    lines = [f'{name}={value}'for name, value in secrets.items()]
    with open('./.env', 'w') as env_file:
        env_file.write('\n'.join(lines))
