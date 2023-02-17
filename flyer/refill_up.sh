#!/bin/sh
# To run this script: sh fill_up.sh

#####################
# Prepare source code
#####################

# ssh keys for gitlab account is embedded in the same directory of this script


flyerdir=$PWD
termdir="$HOME/dfk/autodeploy/xcaller"
# gitroot="git@gitlab.spacenet.vn"
# bexcaller="longnkh/xcaller-api.git -b xcaller-stable"
# fexcaller="hungnv/XCAL-React.git -b xcaller-stable"
# berepo=$gitroot:$bexcaller
# ferepo=$gitroot:$fexcaller
behome="$termdir/xcaller-api"
fehome="$termdir/XCAL-React"
xrobothome="$termdir/xcaller-api/serialsport-demo"
sshkey="$flyerdir/flyer"

# Remove old code
# echo "==========>Removing old code in: $termdir"
# rm -rf $termdir

# Cloning source code
# echo "==========>Creating directories: $termdir"
# mkdir -p $termdir
# cd $termdir

# Setting SSH Key
echo "==========>Using ssh key $sshkey"
# GIT_SSH_COMMAND='ssh -i $sshkey'

# echo "==========>Cloning code from $berepo"
# GIT_SSH_COMMAND="ssh -i $sshkey" git clone $berepo
# ssh-agent bash -c "ssh-add $sshkey; git clone $berepo"

# echo "==========>Cloning code from $ferepo"
# GIT_SSH_COMMAND="ssh -i $sshkey" git clone $ferepo
# ssh-agent bash -c "ssh-add $sshkey; git clone $ferepo"

# Install dependencies for BE
echo "==========>Fetching code & Installing dependencies for backend at $behome"
cd $behome
git reset --hard HEAD
GIT_SSH_COMMAND="ssh -i $sshkey" git pull
# We need to install bcrypt alone because it sometimes failed with unknown reason
npm install bcrypt
npm install

# Install dependencies for FE
echo "==========>Fetching code & Installing dependencies for frontend at $fehome"
cd $fehome
git reset --hard HEAD
GIT_SSH_COMMAND="ssh -i $sshkey" git pull
npm install

# Install dependencies for xrobot
echo "==========>Fetching code & Installing dependencies for frontend at $xrobothome"
cd $xrobothome
git reset --hard HEAD
GIT_SSH_COMMAND="ssh -i $sshkey" git pull
npm install

# Generate ssh key pairs
echo "==========>Checking pem file"
pemdir="$behome/pem"
if [ -f "$pemdir/id_rsa" ]; then
  echo "Using existing pem file for server at $pemdir"
else 
  echo "Creating new $pemdir/id_rsa"
  mkdir -p $pemdir
  yes y | ssh-keygen -t rsa -b 1024 -m PEM -N "" -f $pemdir/id_rsa
  ssh-keygen -e -m PEM -f $pemdir/id_rsa > $pemdir/id_rsa.pub.cert
fi