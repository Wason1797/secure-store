#!/bin/bash
apt-get update
apt-get install -y \
  ca-certificates \
  curl \
  gnupg \
  lsb-release

mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list >/dev/null

echo "Install Docker and AWS CLI"
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
apt-get update
apt-get install -y awscli
