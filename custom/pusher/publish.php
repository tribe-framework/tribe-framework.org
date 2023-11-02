<?php
require __DIR__ . '/../../_init.php';
header('Content-Type: application/json');

$api = new \Tribe\API;

if ($_SERVER['REQUEST_METHOD'] === 'POST')
  $_POST = $api->requestBody;

if ($_ENV['PUSHER_API_KEY'] && $_ENV['PUSHER_API_SECRET'] && $_ENV['PUSHER_APP_ID'] && $_ENV['PUSHER_CLUSTER'] && $_POST['user_slugs'] && $_POST['event'] && $_POST['message'] && $_POST['sender_id'] && $_POST['sender_type']) {

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

	$data['message'] = $_POST['message'];
	$data['sender_id'] = $_POST['sender_id'];
	$data['sender_type'] = $_POST['sender_type'];
	$data['action_route'] = $_POST['action_route'];
	$data['action_message'] = $_POST['action_message'];

	if (is_array($_POST['user_slugs'])) {
		foreach ($_POST['user_slugs'] as $user_slug) {
			$data['uniqid'] = time().uniqid();
			$pusher->trigger($user_slug, $_POST['event'], $data);
		}
	}
	else {
		$data['uniqid'] = time().uniqid();
		$pusher->trigger($_POST['user_slugs'], $_POST['event'], $data);
	}

	echo json_encode(array("success"=>true));

} else {

	echo json_encode(array("error"=>true));

}
?>