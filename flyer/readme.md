# Go to inside flyer folder

# To install all required tools and libs for the app:
sh prepare_aircraft.sh

# To get the source code
# this script will automatically create a crontab that will start the app on system reboot
sh fill_up.sh

# To fetch the lastest code (use in case repos have been cloned, this can save a lot of time)
sh refill_up.sh

# To deploy app
sh take_off.sh

# If you want to uninstall this app
sh remove_aircraft.sh

# To create ssh keys which you need to run app manually (without deploying by take_off.sh)
sh gen_pem.sh

# Auto start on startup
# if you has execute fill_up.sh, then no need to do this step
Add @reboot to crontab, e.g: @reboot sleep 60 && bash /root/flyer/take_off.sh > /root/flyer/deployment.log 2>&1 &

# To get latest flyer from spacenet
Go to destination folder and execute: scp -r space@spacenet.vn:/home/space/DO_NOT_DELETE/xcaller/flyer .