<?php
namespace Agence104\LiveKit;

require __DIR__ . '/../../_init.php';
header('Content-Type: application/json');

$api = new \Tribe\API;
$core = new \Tribe\Core;

if ($_SERVER['REQUEST_METHOD'] === 'POST')
  $_POST = $api->requestBody;

if ($_ENV['LIVEKIT_WS_URL'] && $_ENV['LIVEKIT_API_KEY'] && $_ENV['LIVEKIT_SECRET_KEY'] && ($_POST['user_id'] ?? false) && ($_POST['room_name'] ?? false)) {

	// If this room doesn't exist, it'll be automatically created when the first
	// client joins.
	$roomName = $_POST['room_name'];

	// The identifier to be used for participant.
	//$user = $core->getObject($_POST['user_id']);
	$participantName = $_POST['user_id'];

	// Define the token options.
	$tokenOptions = (new AccessTokenOptions())
  		->setIdentity($participantName);

	// Define the video grants.
	$videoGrant = (new VideoGrant())
	  ->setRoomJoin()
	  ->setRoomName($roomName);

	// Initialize and fetch the JWT Token. 
	$token = (new AccessToken($_ENV['LIVEKIT_API_KEY'], $_ENV['LIVEKIT_SECRET_KEY']))
	  ->init($tokenOptions)
	  ->setGrant($videoGrant)
	  ->toJwt();

  	echo json_encode(array("roomName"=>$roomName, "token"=>$token));

} else {

	echo json_encode(array("error"=>true));

}
?>