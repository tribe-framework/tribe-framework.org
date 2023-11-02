<?php
session_start();
require __DIR__ . '/../../_init.php';

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;
header('Content-Type: application/json');

$api = new \Tribe\API;

if ($_SERVER['REQUEST_METHOD'] === 'POST')
  $_POST = $api->requestBody;

if ($_POST['user']) {
	$key = 'user';
	$payload = [
	    'iss' => $_ENV['WEB_URL'],
	    'aud' => $_ENV['WEB_URL'],
	    'iat' => time(),
	    'nbf' => time(),
	    'user' => $_POST['user']
	];

	$jwt = JWT::encode($payload, $key, 'HS256');
	$_SESSION['jwt'] = $jwt;
	echo json_encode(array('jwt'=>$_SESSION['jwt']));
}
?>