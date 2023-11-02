<?php
require __DIR__ . '/../../_init.php';
header('Content-Type: application/json');
http_response_code(200);
$core = new \Tribe\Core;

if ($_ENV['PUSHER_API_KEY'] && $_ENV['PUSHER_API_SECRET'] && $_ENV['PUSHER_APP_ID'] && $_ENV['PUSHER_CLUSTER'] && ($_POST['channel_name'] ?? false) && ($_POST['socket_id'] ?? false) && ($_POST['user_id'] ?? false)) {

	$user = $core->getObject($_POST['user_id']);
	$object['id'] = (string) $user['id'];
	$object['user_info'] = $user;
	$object['watchlist'] = $user['friends'] ?? [];

	$options = array(
		'cluster' => $_ENV['PUSHER_CLUSTER'],
		'useTLS' => true
	);

	$pusher = new Pusher\Pusher(
		$_ENV['PUSHER_API_KEY'],
		$_ENV['PUSHER_API_SECRET'],
		$_ENV['PUSHER_APP_ID'],
		$options
	);

  echo $pusher->presence_auth($_POST['channel_name'], $_POST['socket_id'], $object['id'], $object);

} else {

	echo json_encode(array("error"=>true));

}
?>