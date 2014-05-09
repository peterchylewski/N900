#!/bin/sh

# Simple shell script created in order to preserve battery power in your N900

# Actions taken:
# 1. Sets internet connection mode 'Always ask' /(available under Settings -> Internet connections -> Connect automatically).
# 2. Disconnects current internet connection.
# 3. Switches cellular radio into 2G-only mode.
# 4. Disables automatic email send&receive in Modest email client.

# Created by Dawid Lorenz aka evad, http://adl.pl

if [ "$1" == "off" ]
 then
  echo "Restoring power suckers..."
  gconftool-2 --set --type list --list-type string /system/osso/connectivity/network_type/auto_connect [*]
  gconftool-2 --set --type bool /apps/modest/auto_update true
  run-standalone.sh dbus-send --system --type=method_call --dest=com.nokia.phone.net /com/nokia/phone/net Phone.Net.set_selected_radio_access_technology byte:0
 else
  echo "Going into power saving mode..."
  gconftool-2 --set --type list --list-type string /system/osso/connectivity/network_type/auto_connect []
  gconftool-2 --set --type bool /apps/modest/auto_update false
  run-standalone.sh dbus-send --system --dest=com.nokia.icd /com/nokia/icd_ui com.nokia.icd_ui.disconnect boolean:true
  run-standalone.sh dbus-send --system --type=method_call --dest=com.nokia.phone.net /com/nokia/phone/net Phone.Net.set_selected_radio_access_technology byte:1
fi

