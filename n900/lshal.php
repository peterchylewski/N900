<?


$lshal = explode('udi =', shell_exec('lshal'));

print json_encode($lshal[1]);