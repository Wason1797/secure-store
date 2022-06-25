#!/bin/sh

green="\033[0;32m"
no_color="\033[0m"

# Create api virtualenv and install requirements
echo -e "${green}Create api virtualenv${no_color}\n"
cd ./api
python3 -m venv venv
source venv/bin/activate
echo -e "${green}Install api requirements${no_color}\n"
python3 -m pip install --upgrade pip
pip install -r requirements.txt
deactivate

# Create localstack virtualenv and install requirements
echo -e "${green}Create localstack virtualenv${no_color}\n"
python3 -m venv .localStackVenv
source .localStackVenv/bin/activate
echo -e "${green}Install localstack requirements${no_color}\n"
python3 -m pip install --upgrade pip
pip install -r localstack-requirements.txt
deactivate

# Create terraform local virtualenv and install requirements
echo -e "${green}Create tflocal virtualenv${no_color}\n"
cd ..
cd ./infrastructure/local
python3 -m venv .tflocal
source .tflocal/bin/activate
echo -e "${green}Install tflocal requirements${no_color}\n"
python3 -m pip install --upgrade pip
pip install -r tflocal-requirements.txt
deactivate

# Install ui dependencies
echo -e "${green}Install ui dependencies${no_color}\n"
cd ..
cd ..
cd ./ui
npm install
cd ..
