<?php
session_start();
echo session_id();
echo $_SESSION['jwt'].'<br>';
echo $_SESSION['something'].'<br>';
echo $_SESSION['else'].'<br>';
?>