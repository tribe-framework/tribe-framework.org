<?php
if (file_exists('dist/index.html') !== false)
	echo 'exists';
else
	echo 'Run "ember build -prod" before syncing with php.';
?>