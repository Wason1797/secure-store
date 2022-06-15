# Secure Store

A secure vault that makes secret sharing easy.

## Objective

---

The primary objective is to provide a secure and convenient app to share secrets within our organization.

## Roadmap

---

Initially the project will be organized in 3 week [milestones](./doc/milestones.md). New features will be pushed to a rolling release environment for testing and preview. After a week of stabilization work, they will be pushed to the main environment.

## Developer Guidance

---

## Prerequisites

- You need to install [Python 3.8.x](https://www.python.org/downloads/) or later for Backend work
- You need to install [Node v14.19.1](https://github.com/nvm-sh/nvm) (Using nvm is recomended)
- You will need [Docker](https://docs.docker.com/get-docker/)
- You will need [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli)

## Configuring your dev environment

Using [VSCode](https://code.visualstudio.com/download) is recomended since most commands are automated with tasks

### For MacOS and nix users

- In the root folder run the bootstrap script to create all the necesary python virtual environments and install all dependencies.

```sh
source tooling/environments/bootstrap.sh
```

- If for some reason the bootstrap script does not work:

  - In `/api` create two python virtual environments:

  ```sh
    # api virtual environment
    python3 -m venv venv
    source venv/bin/activate
    python3 -m pip install --upgrade pip
    pip install -r requirements.txt
    deactivate
  ```

  ```sh
    # localstack virtual environment
    python3 -m venv .localStackVenv
    source .localStackVenv/bin/activate
    python3 -m pip install --upgrade pip
    pip install -r localstack-requirements.txt
    deactivate
  ```

  - In `/infrastructure` create a virtual environment:

  ```sh
    # terraform local virtual environment
    python3 -m venv .tflocal
    source .tflocal/bin/activate
    python3 -m pip install --upgrade pip
    pip install -r tflocal-requirements.txt
    deactivate
  ```

  - In `/ui` install dependencies with `npm install`

- Ask someone in the team for the `patches` folder, this folder contains `.patch` files with all environment variables (credentials and secrets).

```json
{
  "OAUTH_CONFIG_URL": "Value from the google cloud console",
  "GOOGLE_CLIENT_ID": "Value from the google cloud console",
  "GOOGLE_CLIENT_SECRET": "Value from the google cloud console",
  "SESSION_SECRET": "Random string",
  "SERVER_SECRET": "Random string",
  "SERVER_SALT": "generated through os.urandom(16).hex()",
  "SECURE_STORE_UI_URL": "frontend url http://localhost:3000",
  "AWS_ACCESS_KEY_ID": "AKI**************** aws credential",
  "AWS_SECRET_ACCESS_KEY": "gL************************ aws credential",
  "AWS_DYNAMODB_REGION": "aws region",
  "S3_BUCKET_NAME": "aws bucket name",
  "AWS_ENDPOINT": "localstack endpoint http://localhost:4566",
  "MEMORY_DB_URL": "local redis database url redis://localhost"
}
```

- For the create a .env file in `/ui` and add the backend url

```plaintext
REACT_APP_SAFE_STORE_BACKEND_URL=http://localhost:5000
```

- Run the task `Patch Tasks And Launch` if you have the patch files, if not, fill the env variables manualy in `.vscode/tasks.json` and `.vscode/launch.json`

- Run the task `Start Localstack` to start the localstack service to mock aws (You only need to do this the first timne or if you reboot your pc)

- Run the task `Create Infra` to create all necesary aws services in localstack (You only need to do this the first timne or if you reboot your pc)

- Run the task `Run` to start both the `api` and `ui`

- You can run each service individually with the tasks `Run API` and `Run UI`
