#!/bin/bash

# check sudo rights
if [ $EUID -ne 0 ]; then
	echo "Please run as root"
	exit
fi

# check net connectivity
wget -q --tries=10 --timeout=20 --spider http://google.com

if [[ $? -eq 0 ]]; then
	echo "Net connection successful."
else
	echo "You need to be connected to net to proceed."
	echo "Check you environment variables if you are using a proxy."
	exit
fi

set -e
# Any subsequent(*) commands which fail will cause the shell script to exit immediately

# importing public key and setting up source list for MongoDB
sudo -E apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list

# installing NodeJS and mongo DB
sudo apt-get update && sudo apt-get install -y nodejs npm mongodb-org

echo
echo	

# set proxy configuration for NPM
read -p "Are you on proxy? (Y/N) : " -n 1 response
echo
echo
case $response in
		y|Y)
			echo
			echo
			echo
			echo " Use the following commands to set up your proxy settings first!"
			echo
			echo -e "\e[33m  sudo npm config set proxy http://<username>:<password>@<proxy>:<port> \e[0m"
			echo -e "\e[33m  sudo npm config set https-proxy http://<username>:<password>@<proxy>:<port> \e[0m"
			echo
			echo " Then rerun the setup script"
			echo
			echo
			exit

			;;
		*)	
			;;
	esac

#configure Mongo database
sudo touch /etc/systemd/system/mongodb.service
echo "[Unit]
Description=High-performance, schema-free document-oriented database
After=network.target

[Service]
User=mongodb
ExecStart=/usr/bin/mongod --quiet --config /etc/mongod.conf

[Install]
WantedBy=multi-user.target
" > /etc/systemd/system/mongodb.service

#starting up the mongo db service
sudo systemctl enable mongodb
sudo systemctl start mongodb

# check status of the mongodb
# sudo systemctl status mongodb

# using nexus Database
mongo < mongosetup.js

echo
echo
echo

# generating SSL certificates
openssl genrsa 2048 > ssl.pem
openssl req -new -key ssl.pem -out csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey ssl.pem -out ssl.crt

echo
echo
echo
echo "Following operation might take a lot of time!"
echo "Please wait"

#launching nexus
npm config set strict-ssl false


sudo npm install --save

sudo npm install -g nodemon


# Final display message
echo
echo
echo
echo "Use the following command to run the server."
echo -e "\e[33m 'sudo nodemon server.js' \e[0m"
echo
echo -e "Then open \e[33mhttps://localhost:4000/\e[0m in your browser"