#!/bin/sh
# To run this script: sh fill_up.sh

#######################
# Arguments processing
#######################
show_help () {
  echo "usage: sh fill_up.sh [arguments]
        Arguments:
          -m    environment mode (allow mode: production, dev)
          -h    show this help"
}

#ENV_MODE=production
ENV_MODE=pro
while getopts m:h option; do
  case "${option}" in
    m)  ENV_MODE=$OPTARG
        ;;
    h)  show_help
        exit 1
        ;;
    *)  show_help
        exit 1
        ;;
  esac
done

if [ $ENV_MODE == "dev" ]; then
  echo "==========>Starting for DEVELOPMENT"
  bebranch=master
  febranch=dev
elif [ $ENV_MODE == "production" ]; then
  echo "==========>Starting with PRODUCTION"
  bebranch=xcaller-stable
  febranch=xcaller-stable
else
  echo "Invalid environment mode"
  show_help
  exit 1
fi
echo "==========>BE code branch: $bebranch"
echo "==========>FE code branch: $febranch"


#####################
# Prepare source code
#####################

# ssh keys for gitlab account is embedded in the same directory of this script


flyerdir=$PWD
termdir="$HOME/dfk/autodeploy/xcaller"
gitroot="git@gitlab.spacenet.vn"
bexcaller="longnkh/xcaller-api.git -b $bebranch"
fexcaller="hungnv/XCAL-React.git -b $febranch"
berepo=$gitroot:$bexcaller
ferepo=$gitroot:$fexcaller
behome="$termdir/xcaller-api"
fehome="$termdir/XCAL-React"
xrobothome="$termdir/xcaller-api/serialsport-demo"
sshkey="$flyerdir/flyer"

# Remove old code
echo "==========>Removing old code in: $termdir"
rm -rf $termdir

# Cloning source code
echo "==========>Creating directories: $termdir"
mkdir -p $termdir
cd $termdir

# Setting SSH Key
echo "==========>Using ssh key $sshkey"
# GIT_SSH_COMMAND="ssh -i $sshkey"

echo "==========>Cloning code from $berepo"
GIT_SSH_COMMAND="ssh -i $sshkey" git clone $berepo
# ssh-agent bash -c "ssh-add $sshkey; git clone $berepo"

echo "==========>Cloning code from $ferepo"
GIT_SSH_COMMAND="ssh -i $sshkey" git clone $ferepo
# ssh-agent bash -c "ssh-add $sshkey; git clone $ferepo"

# Install dependencies for BE
echo "==========>Installing dependencies for backend at $behome"
cd $behome
# We need to install bcrypt alone because it sometimes failed with unknown reason
npm install bcrypt
npm install

# Install dependencies for FE
echo "==========>Installing dependencies for frontend at $fehome"
cd $fehome
npm install

# Install dependencies for xrobot
echo "==========>Installing dependencies for xrobot at $xrobothome"
cd $xrobothome
npm install
# Full fill xrobot config files
cp $flyerdir/config/xrobot-config.js $xrobothome/config.js


#################################
# Full fill xcaller config files
#################################
beconfig=$behome/config/xconfig.js
unixtime=$(date +%s)
ss=$(($unixtime % 60))
mm=$(($unixtime % 3600 / 60))
hh=$(($unixtime % 86400 / 3600))
# TODO: should not use the same hh mm ss for all sync time, should increase by 1 for each time
echo "unixtime $unixtime -> $hh:$mm:$ss UTC"
# Replacing xconfig cron times!
sed -i "s/STPTOKEN_SYNC_TIME.*/STPTOKEN_SYNC_TIME = \'$ss $mm *\/8 * * *\';/g" $beconfig
sed -i "s/DEMO_PROFILE_TIME.*/DEMO_PROFILE_TIME = \'$ss $mm *\/15 * * *\';/g" $beconfig
sed -i "s/DAILY_DATA_STATS_SYNC_TIME.*/DAILY_DATA_STATS_SYNC_TIME = \'$ss $mm 23 * * *\';/g" $beconfig

# Port and url
configport="config.PORT = "
configurl="config.URL = "
if [ $ENV_MODE == "dev" ]; then
  sed -i "s/$configport.*/$configport 8008;/g" $beconfig
  sed -i "s/$configurl.*/$configurl \"http:\/\/dev.dfksoft.com:\" + config.PORT;/g" $beconfig
elif [ $ENV_MODE == "production" ]; then
  sed -i "s/$configport.*/$configport 1248;/g" $beconfig
  sed -i "s/$configurl.*/$configurl \"http:\/\/spacenet.vn:\" + config.PORT;/g" $beconfig
else
  echo "Invalid environment mode"
fi


#########################
# Generate ssh key pairs
#########################
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

# Command for generate 512 bits rsa ssh keys
# openssl genrsa -out test.private.pem 512
# openssl rsa -in test.private.pem -pubout -out test.public.pem.cert

echo "==========>Configuring autostart on reboot"
autostartCmd="@reboot sleep 60 && bash $flyerdir/take_off.sh > $termdir/deployment.log 2>&1 &"
# Remove old entry if exists
crontab -l | grep -v "$autostartCmd" | crontab
# Add new entry
(crontab -l ; echo "$autostartCmd") | crontab
# If these settings are failed, try with `crontab -` at the end
