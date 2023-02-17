#!/bin/sh
# To run this script: sh fill_up.sh

# Generate ssh key pairs
echo "==========>Checking pem file"
pemdir="./pem"
if [ -f "$pemdir/id_rsa" ]; then
  echo "Using existing pem file for server at $pemdir"
else 
  echo "Creating new $pemdir/id_rsa"
  mkdir -p $pemdir
  yes y | ssh-keygen -t rsa -b 1024 -m PEM -N "" -f $pemdir/id_rsa
  ssh-keygen -e -m PEM -f $pemdir/id_rsa > $pemdir/id_rsa.pub.cert
fi

# Command for generate 512 bits rsa ssh keys
# openssl genrsa -out test.private.pem 512
# openssl rsa -in test.private.pem -pubout -out test.public.pem.cert
