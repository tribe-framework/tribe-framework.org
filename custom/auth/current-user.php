<?php
session_start();

require __DIR__ . '/../../_init.php';
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

header('Content-Type: application/json');
echo json_encode(array('jwt'=>$_SESSION['jwt'], 'session_id'=>session_id()));
//echo json_encode(JWT::decode($_SESSION['jwt'], new Key('user', 'HS256')));
?>