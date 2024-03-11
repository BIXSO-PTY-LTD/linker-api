# CyberSkill Nodejs Express Graphql

## OS: Ubuntu 19.10 x64

## Install nodejs

```
apt install nodejs
```

## Install npm

```
apt install npm
```

## Install yarn

```
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
```

```
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
```

```
sudo apt update && sudo apt install yarn
```

## Intall pm2

```
npm install pm2 -g
```

## Intall mongodb

```
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
```

echo "deb [ arch=amd64,arm64 ] <https://repo.mongodb.org/apt/ubuntu> focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

```
sudo apt-get update
```

sudo apt-get install -y mongodb-org

## Start mongodb

```
sudo service mongod start
```

or

```
sudo systemctl start mongod
```

verify mongodb started successfully

```
sudo systemctl status mongod
```

ensure mongodb start following a system reboot

```
sudo systemctl enable mongod
```

stop mongodb

```
sudo systemctl stop mongod
```

restart mongodb

```
sudo systemctl restart mongod
```

## Install nginx

```
apt-get install nginx
```

## Copy default nginx config to new file

Use your own hostname (staging: linker)

```
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/linker-api-staging
```

## Edit config file

Use your own hostname (staging: linker)

```
nano /etc/nginx/sites-available/linker
```

Use your own server name (staging: linker) and port (7001)

```
server {
    listen 80;
    server_name apistaging.orderhanquoc.com;

    location / {
        proxy_pass http://localhost:7001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Save config file and enable config

Use your own hostname (staging: linker)

```
ln -s /etc/nginx/sites-available/linker-api-staging /etc/nginx/sites-enabled/linker-api-staging
```

## Test config

```
service nginx configtest
```

## Restart nginx

```
service nginx restart
```

## Startup default run nginx

```
update-rc.d nginx defaults
```

## Create SSH key for Gitlab CI/CD

Use your own email (<devop@cyberskill.tech>)

```
ssh-keygen -t rsa -b 4096 -C "devop@cyberskill.tech"
```

Enter three times when it asks

```
copy “id_rsa.pub” file into root/.ssh/ and rename it authorized_keys
cp ~/.ssh/id_rsa.pub ~/.ssh/authorized_keys
```

Use your own keyName (SSH_PRIVATE_KEY)

```
go into Gitlab => Settings => CI/CD => Environment variables => SSH_PRIVATE_KEY
create new variable STAGING_TARGET_SERVER_PRIVATE_KEY_BASE64 with “id_rsa” file’s content
to get content of file
cat ~/.ssh/id_rsa
```

Use your own hostname (SERVER_HOST)

```
go into Gitlab => Settings => CI/CD => Environment variables =>
create new variable STAGING_TARGET_SERVER_USER_HOST with username@hostIP ex: root@apistaging.orderhanquoc.com
```

```
copy “id_rsa.pub” file content into [Github SSH Keys](https://gitlab.com/profile/keys)
to get content of file
cat ~/.ssh/id_rsa.pub
```

```
add github to known_host
```

ssh-keyscan -H 'gitlab.com' >> ~/.ssh/known_hosts

<!-- chmod 644 ~/.ssh/known_hosts -->

```

```

## Setup SSL for domain

Enable firewall

```
sudo ufw enable
```

Enable SSH

```
sudo ufw allow ssh
```

Install cerbot

```
add-apt-repository ppa:certbot/certbot
```

```
apt-get update
```

```
apt-get install python3-certbot-nginx
```

Test nginx config

```
nginx -t
```

Reload nginx

```
systemctl reload nginx
```

Check firewall status

```
ufw status
```

Allow SSL in nginx

```
ufw allow 'Nginx Full'
ufw delete allow 'Nginx HTTP'
```

Apply cerbot to domain (api.cyberskill.tech)

```
certbot --nginx -d api.cyberskill.tech
```

Choose 1 (no redirect) or 2 (redirect) base on your need
Auto renew SSL certificate

```
certbot renew --dry-run
```

## fix when ssh show WARNING: POSSIBLE DNS SPOOFING DETECTED

```
ssh-keygen -R "you server hostname or ip"
```

## update ubuntu

### Try

```
cp /etc/apt/sources.list /etc/apt/sources.list.bak

sudo sed -i -re 's/([a-z]{2}.)?archive.ubuntu.com|security.ubuntu.com/old-releases.ubuntu.com/g' /etc/apt/sources.list

sudo apt-get update && sudo apt-get dist-upgrade
```

### If above not work try

```
sudo apt-get clean

sudo mv /var/lib/apt/lists /tmp

sudo mkdir -p /var/lib/apt/lists/partial

sudo apt-get clean

sudo apt-get update
```

## sendy config

```
server {
        root /var/www/html/sendy;

        index index.php index.html index.htm index.nginx-debian.html;

        server_name sendy-staging.orderhanquoc.com;

        autoindex off;

        add_header X-Robots-Tag "noindex, noarchive";

        location = /favicon.ico { log_not_found off; access_log off; }
        location = /robots.txt { log_not_found off; access_log off; allow all; }
        location ~ /\.  { deny all; log_not_found off; access_log off; return 404; }

        location / {
                try_files $uri $uri/ /$uri.php$is_args$args; # $is_args converts to a ? if true
        }

        location /l/ {
                rewrite ^/l/([a-zA-Z0-9/]+)$ /l.php?i=$1 last;
        }

        location /t/ {
                rewrite ^/t/([a-zA-Z0-9/]+)$ /t.php?i=$1 last;
        }

        location /w/ {
                rewrite ^/w/([a-zA-Z0-9/]+)$ /w.php?i=$1 last;
        }

        location /unsubscribe/ {
                rewrite ^/unsubscribe/(.*)$ /unsubscribe.php?i=$1 last;
        }

        location /subscribe/ {
                rewrite ^/subscribe/(.*)$ /subscribe.php?i=$1 last;
        }

        location /confirm/ {
                rewrite ^/confirm/(.*)$ /confirm.php?i=$1 last;
        }

        location ~ \.php$ {
                try_files $uri =404;
                fastcgi_split_path_info ^(.+\.php)(/.+)$;
                fastcgi_pass unix:/var/run/php/php7.3-fpm.sock;
                fastcgi_index index.php;
                fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
                include fastcgi_params;
        }

        location ~* ^.+\.(jpg|jpeg|gif|css|png|js|ico|xml)$ {
                access_log off;
                log_not_found off;
                expires 30d;
        }
}
```

```
ln -s /etc/nginx/sites-available/sendy /etc/nginx/sites-enabled/sendy
```

## Redis cache

### Install redis

```
sudo apt update

sudo apt install redis-server

sudo nano /etc/redis/redis.conf

find `supervised` then change to `systemd`

sudo systemctl restart redis.service
```

### Check redis status

```
systemctl status redis

redis-cli
```

### Drop duplicate index

```
db.sessions.getIndexes()
db.sessions.dropIndex("expires_1")
```
