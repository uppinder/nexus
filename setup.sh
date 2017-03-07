# importing public key and setting up source list for MongoDB
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list

# installing NodeJS and mongo DB
sudo apt-get update && sudo apt-get install -y nodejs npm mongodb-org

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
# sudo systemctl status mongodb

# using nexus Database
mongo < mongosetup.js

echo
echo '----------------------------------------------------------------'
echo

# generating SSL certificates
openssl genrsa 2048 > ssl.pem
openssl req -new -key ssl.pem -out csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey ssl.pem -out ssl.crt

#launching nexus
sudo npm install --save
sudo npm install -g nodemon
nodemon server.js