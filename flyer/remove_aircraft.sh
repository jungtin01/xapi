#!/bin/sh
# To run this script: sh remove_aircraft.sh

##########################
# Uninstall required libs
##########################
# node v8.15.1 (stable) or v8.16.0 (latest)
# npm 6.9.0 (aws) or 6.4.1 (orange pi)
# sails 0.12.14

# TODO: add sudo without password required manually, refer to this docs:
# https://phpraxis.wordpress.com/2016/09/27/enable-sudo-without-password-in-ubuntudebian/

echo "==========>Uninstalling sails@0.12.14"
sudo npm uninstall sailsjs -g

echo "==========>Uninstalling nodejs..."
sudo apt-get remove -y nodejs

echo "==========>Uninstalling build-essential for node-gyp..."
sudo apt-get remove -y build-essential
