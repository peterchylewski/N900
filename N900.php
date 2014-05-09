<?

class N900 {

/* -------------------- CELLULAR -------------------- */

public static function getIMEI() {
	$cmd = 'dbus-send --system --type=method_call --print-reply --dest=com.nokia.phone.SIM /com/nokia/phone/SIM/security Phone.Sim.Security.get_imei|awk -F "\"" \'/g/ {print $2}\'';
	return trim(shell_exec($cmd));
}

public static function getIMSI() {
	$cmd = 'dbus-send --system --type=method_call --print-reply --dest=com.nokia.phone.SIM /com/nokia/phone/SIM Phone.Sim.get_imsi|awk -F "\"" \'/g/ {print $2}\'';
	return trim(shell_exec($cmd));
}

public static function getICCID() {
	$cmd = 'dbus-send --system --type=method_call --print-reply --dest=com.nokia.phone.SSC /com/nokia/phone/SSC com.nokia.phone.SSC.get_iccid|awk -F "\"" \'/g/ {print $2}\'';
	return trim(shell_exec($cmd));
}

public static function getSignalStrength() {
	$cmd = 'dbus-send --print-reply --system --type=method_call --dest=com.nokia.phone.net /com/nokia/phone/net Phone.Net.get_signal_strength';
	$array = explode(PHP_EOL, shell_exec($cmd));
	$out = new stdclass();
	$out->percentage = str_replace('byte ', '', $array[1]);
	$out->dBm = '-' . str_replace('byte ', '', $array[2]);
	return $out;
}

public static function getProviderName() {
	$cmd = 'dbus-send --system --print-reply --dest=com.nokia.phone.SIM /com/nokia/phone/SIM Phone.Sim.get_service_provider_name';
	$array = explode(PHP_EOL, shell_exec($cmd));
	return trim(str_replace('string ', '', $array[1]), ' "');
}

public static function getRegistrationStatus() {
	$cmd = 'dbus-send --system --print-reply --dest=com.nokia.phone.net /com/nokia/phone/net Phone.Net.get_registration_status';
	$array = explode(PHP_EOL, shell_exec($cmd));
	$out = new stdclass();
	$out->LAC = str_replace('uint16 ', '', $array[2]);
	$out->CID = str_replace('uint32 ', '', $array[3]);
	$out->MNC = str_replace('uint32 ', '', $array[4]);
	$out->MCC = str_replace('uint32 ', '', $array[5]);
	$out->networkType = str_replace('byte ', '', $array[6]);
	$out->supportedServices = str_replace('byte ', '', $array[7]);
	$out->netError = str_replace('int32 ', '', $array[8]);
	return $out;
}

/* -------------------- WLAN -------------------- */

public static function getIPs() {
	$out->WAN = exec('wget -t 2 -T 3 -q -O - api.myiptest.com | awk -F "\"" \'{print $4}\'');
	$out->LAN = exec('/sbin/ifconfig wlan0 | awk -F "[: ]" \'/Bc/ {print $13}\'');
	return $out;
	
	
/*
	to do:
	
	http://wiki.maemo.org/Desktop_Command_Execution_Widget_scripts#Percentage.2C_current_and_last_full_charge
	
	> External (WAN) and internal (LAN)
	
*/
}

public static function getWLANSignal() {
	$out = new stdclass();
	$out->quality = exec('awk -F "[. ]" \'/0/ {print $6"%"}\' /proc/net/wireless');
	$out->RSSI = exec('awk \'/0/ {print $4"dBm"}\' /proc/net/wireless');
	$out->noise = exec('awk -F "[. ]" \'/0/ {print $12" dBm"}\' /proc/net/wireless');
	return $out;
}

/* -------------------- DEVICE -------------------- */

public static function getDeviceLockedState() {
	$cmd = 'dbus-send --system --type=method_call --dest="com.nokia.mce" --print-reply "/com/nokia/mce/request" com.nokia.mce.request.get_devicelock_mode |awk -F "\"" \'/g/ {print $2}\'';
	return shell_exec($cmd);
}

public static function getDeviceOrientation() {
	$cmd = 'dbus-send --system --print-reply --dest=com.nokia.mce /com/nokia/mce/request com.nokia.mce.request.get_device_orientation';
	$array = explode(PHP_EOL, shell_exec($cmd));
	$out = new stdclass();
	$out->orientation = trim(str_replace('string ', '', $array[1]), ' "');
	$out->standState = trim(str_replace('string ', '', $array[2]), ' "');
	$out->faceState = trim(str_replace('string ', '', $array[3]), ' "');
	$out->xAxis = str_replace('int32 ', '', $array[4]);
	$out->yAxis = str_replace('int32 ', '', $array[5]);
	$out->zAxis = str_replace('int32 ', '', $array[6]);
	return $out;
}

/* -------------------- CPU -------------------- */

public static function getCPUInfo() {
	$cmd = 'cat /proc/cpuinfo';
	$array = explode(PHP_EOL, shell_exec($cmd));
	$out = array();
	foreach($array as $item) {
		if ($item === '') { continue; }
		$parts = explode(':', $item);
		$key = trim($parts[0]);
		$value = trim($parts[1]);
		$out[$key] = $value;
	}
	return $out;
}

public static function getCPUAvailableFrequencies() {
	$cmd = 'cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_available_frequencies';
	$array = explode(' ', exec($cmd));	
	return $array;
}

public static function vibrate($bool) {
	$cmd = $bool === true
		? 'dbus-send --system --print-reply --dest=com.nokia.mce /com/nokia/mce/request com.nokia.mce.request.req_vibrator_pattern_activate string:PatternIncomingCall'
		: 'dbus-send --system --print-reply --dest=com.nokia.mce /com/nokia/mce/request com.nokia.mce.request.req_vibrator_pattern_deactivate string:PatternIncomingCall';
	print shell_exec($cmd);
}

public static function getBatteryInfo() {
	$cmd = 'lshal -u /org/freedesktop/Hal/devices/bme';
	$lines = explode(PHP_EOL, shell_exec($cmd));
	$out = array();
	foreach($lines as $line) {
		$parts = preg_split('/ = /', $line);
		$key = $parts[0];
		$value = trim(preg_replace('/\(.*\)/', ' ', $parts[1]), " '");
		$out[$key] = $value;
	}
	return $out;
}

/* -------------------- FILESYSTEM -------------------- */

public static function getFSUsage() {
	$cmd = 'df -h';
	$array = explode(PHP_EOL, shell_exec($cmd));
	return $array;
}


/* -------------------- GSM RADIO -------------------- */

public static function enableRadio($bool) {
	$cmd = $bool === true
		? 'dbus-send --system --type=method_call --dest=com.nokia.phone.SSC /com/nokia/phone/SSC com.nokia.phone.SSC.set_radio boolean:true'
		: 'dbus-send --system --type=method_call --dest=com.nokia.phone.SSC /com/nokia/phone/SSC com.nokia.phone.SSC.set_radio boolean:false';
	return shell_exec($cmd);
}

public static function getRadioMode() {
	$cmd = 'dbus-send --system --print-reply --dest=com.nokia.phone.net /com/nokia/phone/net Phone.Net.get_radio_access_technology';
	$res = explode(PHP_EOL, shell_exec($cmd));
	switch(trim($res[1])) {
		case 'byte 0':
			return 'dual';
		break;
		case 'byte 1':
			return '2G';
		break;
		case 'byte 2':
			return '3G';
		break;
	};
}

public static function setRadioMode($mode) {
	$bytes = array('2G' => '1', '3G' => '2', 'dual' => '3');
	$cmd = 'dbus-send --system --type=method_call --dest=com.nokia.phone.net /com/nokia/phone/net Phone.Net.set_selected_radio_access_technology byte:' . $bytes[$mode] ;
	return shell_exec($cmd);
	
}

/* -------------------- AUDIO (doesn't work) -------------------- */

public static function getVolume() {
	#       'dbus-send --system --type=method_call --print-reply --dest=com.nokia.phone.SIM /com/nokia/phone/SIM/security Phone.Sim.Security.get_imei|awk -F "\"" \'/g/ {print $2}\''
	
	$cmd = 'dbus-send --print-reply --type=method_call --dest=com.nokia.mafw.renderer.Mafw-Gst-Renderer-Plugin.gstrenderer /com/nokia/mafw/renderer/gstrenderer com.nokia.mafw.extension.get_extension_property string:volume|awk \'/nt/ {print $3}\'';
	#print escapeshellarg($cmd);
	return shell_exec($cmd);
}

public static function setVolume($vol) {
	// $vol: 0 - 100
	$cmd = 'dbus-send --type=method_call --dest=com.nokia.mafw.renderer.Mafw-Gst-Renderer-Plugin.gstrenderer /com/nokia/mafw/renderer/gstrenderer com.nokia.mafw.extension.set_extension_property string:volume variant:uint32:' . $vol;
	print $cmd;
	return exec($cmd);
}

public static function getHeadphoneState() {
	$cmd = 'cat /sys/devices/platform/gpio-switch/headphone/state';
	return exec($cmd);
}

/* -------------------- SENSORS -------------------- */

public static function getAccelerometerCoords() {
	$cmd = 'cat /sys/class/i2c-adapter/i2c-3/3-001d/coord';
	$coords = explode(' ', exec($cmd)); 
	return array(
		'x' => $coords[0],
		'y' => $coords[1],
		'z' => $coords[2]
	);
}

public static function getProximity() {
	$cmd = 'cat /sys/devices/platform/gpio-switch/proximity/state';
	return exec($cmd);
}

public static function getLux() {
	$cmd = 'cat /sys/class/i2c-adapter/i2c-2/2-0029/lux';
	return exec($cmd);
}

public static function getKeyboardSlideState() {
	$cmd = 'cat /sys/devices/platform/gpio-switch/slide/state';
	return exec($cmd);
}

public static function getCamShutterState() {
	$cmd = 'cat /sys/devices/platform/gpio-switch/cam_shutter/state';
	return exec($cmd);
}

/* -------------------- APPS -------------------- */

/*
to do:
	openURL()
	
dbus-send --system --type=method_call --dest="com.nokia.osso_browser" --print-reply /com/nokia/osso_browser/request com.nokia.osso_browser.load_url string:"nzz.ch"


*/

/*
to do:
	sendMessageToScreen()
	
dbus-send --print-reply  --type=method_call --dest=org.freedesktop.Notifications /org/freedesktop/Notifications org.freedesktop.Notifications.SystemNoteDialog string:'Hello, world!' uint32:0 string:'NAO OK!'



*/

/* -------------------- MISC -------------------- */


} // class N900

/*
N900::enableRadio(false);
#N900::vibrate(false);
#print N900::setRadioMode('3G');
#print json_encode(N900::getVolume());
*/

$output = new stdclass();

$output->cellular = new stdclass();
$output->cellular->IMEI = N900::getIMEI();
$output->cellular->IMSI = N900::getIMSI();
$output->cellular->ICCID = N900::getICCID();
$output->cellular->radioMode = N900::getRadioMode();
$output->cellular->provider = N900::getProviderName();
$output->cellular->registrationStatus = N900::getRegistrationStatus();
$output->cellular->signalStrength = N900::getSignalStrength();

$output->WLAN = new stdclass();
$output->WLAN->IP = N900::getIPs();
$output->WLAN->signal = N900::getWLANSignal();

$output->device = new stdclass();
$output->device->orientation = N900::getDeviceOrientation();
$output->device->lockedState = N900::getDeviceLockedState();
$output->device->battery = N900::getBatteryInfo();

$output->CPU = new stdclass();
$output->CPU->info = N900::getCPUInfo();
$output->CPU->availableFrequencies = N900::getCPUAvailableFrequencies();

#$output->Filesystem = new stdclass();
#$output->Filesystem->usage = N900::getFSUsage();

$output->sensors = new stdclass();
$output->sensors->accelerometer = N900::getAccelerometerCoords();
$output->sensors->lux = N900::getLux();
$output->sensors->proximity = N900::getProximity();
$output->sensors->headphones = N900::getHeadphoneState();
$output->sensors->cameraShutter = N900::getCamShutterState();
$output->sensors->keyboard = N900::getKeyboardSlideState();

$output->general = new stdclass();
$output->general->phpVersion = phpversion();
$output->general->time = date('c');



header('Content-Type: application/json');
print json_encode($output);
