<?

$cmd = 'cat /sys/class/i2c-adapter/i2c-2/2-0029/lux';
print exec($cmd);