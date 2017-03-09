#!/bin/bash

# Test for net connectivity:

# For Mongo Setup:
sudo -E apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
sudo apt-get update 
sudo apt-get install -y mongodb-org nodejs npm
sudo service mongod restart

# Prompt for username and password for mongodb

# mongo -u username -p password admin --eval "db.getSiblingDB('nexus').addUser('new_user', 'new_password');"

openssl genrsa 2048 > ssl.pem
openssl req -new -key ssl.pem -out csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey ssl.pem -out ssl.crt

sudo -E npm install --save
sudo -E npm install -g nodemon

