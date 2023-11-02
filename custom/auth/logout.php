<?php
require __DIR__ . '/../../_init.php';

$api = new \Tribe\API;

if ($_SERVER['REQUEST_METHOD'] === 'POST')
  $_POST = $api->requestBody;

if ($_POST['user']) {
	session_destroy();
}

?>