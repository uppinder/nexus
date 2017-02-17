# nexus
IITG Intranet Chat Web App

[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/IITGSocialIntranet/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link)

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

Generate SSL Certificate:
```
$ openssl genrsa 2048 > ssl.pem
$ openssl req -new -key ssl.pem -out csr.pem
$ openssl x509 -req -days 365 -in csr.pem -signkey ssl.pem -out ssl.crt
```

Launching Nexus:
```
$ sudo npm install --save
$ sudo npm install -g nodemon
$ nodemon server.js
```

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
