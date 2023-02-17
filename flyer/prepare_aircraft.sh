#!/bin/sh
# To run this script: sh prepare_aircraft.sh

##########################
# Installing required libs
##########################
# node v8.15.1 (stable) or v8.16.0 (latest)
# npm 6.9.0 (aws) or 6.4.1 (orange pi)
# sails 0.12.14

# TODO: add sudo without password required manually, refer to this docs:
# https://phpraxis.wordpress.com/2016/09/27/enable-sudo-without-password-in-ubuntudebian/

# Download node 8 installer
echo "==========>Downloading node8 installer..."
curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh
sudo apt-get update
sudo bash nodesource_setup.sh

echo "==========>Installing nodejs..."
sudo apt-get install nodejs

echo "==========>Installing sails@0.12.14"
sudo npm install sails@0.12.14 -g
sudo npm install jwt-cli -g

echo "==========>Installing screen jq tree"
sudo apt-get install -y screen jq tree

echo "==========>Installing build-essential for node-gyp"
sudo apt-get install -y build-essential
# NOTE: for windows, install buildtool
# npm install --global --production windows-build-tools

echo "==========>Installing mongodb"
sudo apt-get install -y mongodb


# # TODO: update another method to install mongodb
# # Guidelines: https://docs.mongodb.com/v3.6/tutorial/install-mongodb-on-ubuntu/
# # Import the public key used by the package management system
# wget -qO - https://www.mongodb.org/static/pgp/server-3.6.asc | sudo apt-key add -

# # Create a list file for MongoDB
# echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list

# sudo apt-get update
# # reconfigure package dispatcher
# sudo dpkg --configure -a
# # force to update required packages
# sudo apt-get install -y
# # install mongodb 3.6
# sudo apt-get install -y mongodb-org
# # sudo apt-get install -y mongodb-org=3.6.14 mongodb-org-server=3.6.14 mongodb-org-shell=3.6.14 mongodb-org-mongos=3.6.14 mongodb-org-tools=3.6.14

# # Created symlink from /etc/systemd/system/multi-user.target.wants/mongod.service to /lib/systemd/system/mongod.service.
# sudo systemctl enable mongod.service
# sudo service mongodb start

# # NOTES:
# Installation mongodb 2.6 in windows 10
# * Download installer from
# http://downloads.mongodb.org/win32/mongodb-win32-x86_64-v2.6-latest-signed.msi
# * Do installation from downloaded file
# * Installed binaries are saved at: C:\Program Files\MongoDB 2.6 Standard Legacy\bin
# * Add these binaries into windows PATH
# * Add default mongodb port 27017 to windows firewall:
# Go to Windows Firewall --> Advanced Settings --> Add new rule in Inbound Rules --> Add port 27017 --> OK
# * Then can start mongod.exe (server) from installation path: e.g: C:\Program Files\MongoDB 2.6 Standard Legacy\bin\mongod.exe --dbpath D:\mongo-data
# * TODO: how to start mongodb service on startup?
# TUTORIAL REFERENCE: http://www.dba86.com/docs/mongo/2.6/tutorial/install-mongodb-on-windows.html
# This guideline is also applied for MongoDB 3.6s