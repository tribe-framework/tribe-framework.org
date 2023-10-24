<?php
require __DIR__ . '/../../_init.php';
header('Content-Type: application/json');

$options = array(
	'cluster' => 'ap2',
	'useTLS' => true
);

$pusher = new Pusher\Pusher(
	'b51a408e93891e70b902',
	'1c60fa565fe48e08f625',
	'1693366',
	$options
);

$data['uniqid'] = uniqid();
$data['message'] = 'hello world pusher';
$pusher->trigger('user-slug-comes-here', 'notify', $data);
?>