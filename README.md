centos 7
- system user
  sudo groupadd --system nodeapps
  sudo useradd --system --gid nodeapps --shell /bin/bash --home /var/nodeapps/paywaysapp paywaysapp

  sudo mkdir -p /var/nodeapps/paywaysapp/
  sudo chown paywaysapp /var/nodeapps/paywaysapp/

- mongodb  https://docs.mongodb.com/manual/installation/?jmp=footer
- install dev tools

  yum group install "Development Tools"

- python
Check if python installed (install python if missing https://www.liquidweb.com/kb/how-to-install-pip-on-centos-7/)
  python -V

- login as paywaysapp
  sudo su - paywaysapp

- install nvm
  curl https://raw.githubusercontent.com/creationix/nvm/v0.25.0/install.sh | bash
#Close and reopen your terminal to start using nvm
  source ~/.bashrc

- check nvm version
 nvm --version

- install nodejs
  nvm install v4.4.0
  npm install bower -g
  npm install grunt -g

- unpack source code to directori ~/current
- restrore db dump
  mongorestore --db payways ~/current/dump

  cd ~/current
  nvm use v4.4.0
  bower install ace-min-noconflict
  bower install --config.interactive=false
  npm install
  grunt prod --froce

- install nginx + passenger https://www.phusionpassenger.com/library/walkthroughs/deploy/nodejs/ownserver/nginx/oss/el7/install_passenger.html

- create /etc/nginx/sites-enabled/hedia.conf
####################### for https
server {
       listen 443;
       ssl on;
       ssl_certificate  /<cert_dir_path>/fullchain.pem;
       ssl_certificate_key /<cert_dir_path>/privkey.pem;

       server_name hedia.net;

       root /var/nodeapps/hediaapp/current/public;

       location / {
          passenger_enabled on;
          passenger_app_root /var/nodeapps/hediaapp/current;
          passenger_nodejs /var/nodeapps/hediaapp/.nvm/versions/node/v4.4.0/bin/node;
          passenger_app_type node;
          passenger_startup_file server.js;
          passenger_min_instances 2;
       }
}

####################### for http

server {
       listen 80;

       server_name hedia.net;

       root /var/nodeapps/hediaapp/current/public;

       location / {
          passenger_enabled on;
          passenger_app_root /var/nodeapps/hediaapp/current;
          passenger_nodejs /var/nodeapps/hediaapp/.nvm/versions/node/v4.4.0/bin/node;
          passenger_app_type node;
          passenger_startup_file server.js;
          passenger_min_instances 2;
       }
}

