#!/bin/sh
# To run this script: sh take_off.sh


# Customized sleep
informative_sleep () {
  echo "==========>Sleeping $1s..."
  counter=$1
  while [ $counter -gt 0 ]
  do
    echo "Waiting for $counter..."
    sleep 1
    counter=$(( $counter - 1 ))
  done
}

#####################
# Prepare source code
#####################

# ssh keys for gitlab account is embedded in the same directory of this script

# flyerdir=$PWD
flyerdir=$(dirname "$0")
echo "Script path: $flyerdir"
termdir="$HOME/dfk/autodeploy/xcaller"
# gitroot="git@gitlab.spacenet.vn"
# bexcaller="longnkh/xcaller-api.git -b xcaller-stable"
# fexcaller="hungnv/XCAL-React.git -b xcaller-stable"
# berepo=$gitroot:$bexcaller
# ferepo=$gitroot:$fexcaller
behome="$termdir/xcaller-api"
fehome="$termdir/XCAL-React"
xrobothome="$termdir/xcaller-api/serialsport-demo"

# IP address and port deployment
# Get local IP address
# ipaddr=$(/sbin/ifconfig eth0 | grep 'inet addr' | cut -d: -f2 | awk '{print $1}')
echo "==========>Resolving ipaddr from OpenDNS..."
ipaddr=$(dig +short myip.opendns.com @resolver1.opendns.com)
if [ -z "$ipaddr" ]
then
  echo "==========>Resolving ipaddr from Google Service..."
  ipaddr=$(dig TXT +short o-o.myaddr.l.google.com @ns1.google.com | awk -F'"' '{ print $2}')
fi
echo "==========>My public IP: '$ipaddr'"
beport=1248
feport=8080

# Kill all existing processes
# echo "==========>Kill all node processes..."
# killall node
# informative_sleep 10

echo "==========>Killing screens..."
screen -X -S server_xcaller quit
screen -X -S web_xcaller quit
screen -X -S xrobot_xcaller quit
informative_sleep 10

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

# Deploy FE
echo "==========>Starting Web at http://$ipaddr:$feport"
cd $fehome
sed -i "s/baseURL.*/baseURL: \"http:\/\/$ipaddr:$beport\"/g" $fehome/src/common/api/api.js
sed -i "s/3000/$feport/g" $fehome/config/server/server.js
screen -dmS web_xcaller
sleep 1
screen -r web_xcaller -X stuff "npm run prod \n"
informative_sleep 60

# Deploy BE
echo "==========>Starting server at http://$ipaddr:$beport"
cd $behome
screen -dmS server_xcaller
sleep 1
screen -r server_xcaller -X stuff "sails lift --port $beport \n"
informative_sleep 30

# Deploy xrobot
echo "==========>Starting xrobot..."
# cp $flyerdir/config/xrobot-config.js $xrobothome/config.js
cd $xrobothome
sed -i "s/const URLBASE.*/const URLBASE = \"http:\/\/localhost:$beport\";/g" $xrobothome/xrobot.js
screen -dmS xrobot_xcaller
sleep 1
screen -r xrobot_xcaller -X stuff "npm run start \n"
informative_sleep 2

echo "==========>DONE"

