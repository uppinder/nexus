# nexus
IITG Intranet Chat Web App

Steps for setting up Nexus:

Installing Npm and Node.js:
```
$ sudo apt-get update
$ sudo apt-get install nodejs
$ sudo apt-get install npm
```

Installing and configuring MongoDB  [here](https://www.howtoforge.com/tutorial/install-mongodb-on-ubuntu-16.04/)(till step 4).
```
$ mongo
> use nexus
```

Launching Nexus:
```
$ sudo npm install --save
$ sudo npm install -g nodemon
$ nodemon server.js
```
