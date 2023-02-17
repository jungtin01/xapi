#!/bin/sh

USERNAME="admin"
PASSWORD="123456789"
URLBASE="http://ec2-3-0-55-46.ap-southeast-1.compute.amazonaws.com:3003/api"
URLLOGIN="$URLBASE/authorization"
URLXCALLER="$URLBASE/xcaller"
URLREQUEST="$URLBASE/request"

sendRequest() {
  # Authorizing
  echo "Authorizing..."
  token=$(curl --request POST --url $URLLOGIN --form username=$USERNAME --form password=$PASSWORD | jq '.result.token' | sed "s/\"//g")
  echo "New token: $token"

  # Setup xcaller devices
  callers=(10010101000001101000 01010100100110011010 11000111011001001010 11000111011001001111 11000111011001001110 10010101000001101001 10010101000001101010 10010101000001101011 10010101000001101100 10010101000001101101)
  sizecallers=${#callers[@]}
  echo "sizecallers $sizecallers"

  # Create xcaller devices
  kindex=1
  for callerid in "${callers[@]}";
  do
    curl --request POST   \
        --url $URLXCALLER   \
        --header "authorization: Bearer $token"  \
        --form xcallerName="D$kindex" \
        --form xcallerId="$callerid" 
    kindex=$(( $kindex + 1 ))
  done

  # Set up requests types
  reqtypes=(C M B) # (C M B W)
  sizereqtypes=${#reqtypes[@]}
  echo "sizereqtypes $sizereqtypes"
  for i in "${reqtypes[@]}"; do echo "$i"; done

  # Sending requests
  counter=$1
  while [ $counter -gt 0 ]
  do
    echo "\nRemaining requests $counter..."
    if [ $(($counter%1000)) == 0 ]; then
      echo "Authorizing..."
      token=$(curl --request POST --url $URLLOGIN --form username=$USERNAME --form password=$PASSWORD | jq '.result.token' | sed "s/\"//g")
      echo "New token: $token"
    fi

    let "icaller = $counter % $sizecallers"
    let "ireqtypes = $counter % $sizereqtypes"

    curl --request POST   \
         --url $URLREQUEST   \
         --header "authorization: Bearer $token" \
         --form xcallerId=${callers[$icaller]} \
         --form requestType=${reqtypes[$ireqtypes]}
    sleep 0.5
    counter=$(( $counter - 1 ))
  done
}

sendRequest 100000
