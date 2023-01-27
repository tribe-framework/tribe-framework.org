<?php
require __DIR__ . '/_init.php';

use alsvanzelf\jsonapi\CollectionDocument;
use alsvanzelf\jsonapi\ResourceDocument;

$config = new \Tribe\Config;
$core = new \Tribe\Core;
$api = new \Tribe\API;
$auth = new \Tribe\Auth;

$url_parts = explode('/', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$type = (string) ($url_parts[2] ?? '');
$id = (int) ($url_parts[3] ?? 0);



if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
	if ($id) {
		$core->deleteObject($id);
	    $document = new ResourceDocument();
		$document->sendResponse();
	}
	else {
			$document = new ResourceDocument();
			$document->sendResponse();
	}
}

else if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    $object = $api->requestBody;
	$object = array_merge($core->getObject($object['data']['id']), $object['data'], $object['data']['attributes']['modules']);
	unset($object['attributes']);
	
	$object = $core->getObject($core->pushObject($object));

    $document = new ResourceDocument($type, $object['id']);
    $document->add('modules', $object);
	$document->sendResponse();
}

else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$object = $api->requestBody;
	$object = array_merge($object['data'], $object['data']['attributes']['modules']);
	unset($object['attributes']);

	if ($object['type'] == 'user')
		$object['user_id'] = $auth->getUniqueUserID();

	$object = $core->getObject($core->pushObject($object));

    $document = new ResourceDocument($type, $object['id']);
    $document->add('modules', $object);
	$document->sendResponse();
}

else {

	if ($type == 'webapp') {
		$object = $config->getTypes();

		if ( ($_GET['include'] ?? false) && in_array('total_objects', $_GET['include']) ) {
			foreach ($object as $key => $value) {
				$object[$key]['total_objects'] = $core->getTypeObjectsCount($key);
			}
		}

		$document = new ResourceDocument($type, 0);
		$document->add('modules', $object);
		$document->sendResponse();
	}

	else if (($type ?? false) && !($id ?? false)) {
		$show_public_objects_only = ($_GET['show_public_objects_only'] ?? false);

		//FILTERING
		$limit = "0, 25";
		if ($_GET['page']['limit'] != '-1') {
			if (!($_GET['page']['offset'] ?? false))
				$_GET['page']['offset'] = 0;
			if (!($_GET['page']['limit'] ?? false))
				$_GET['page']['limit'] = 25;

			if (($_GET['page']['limit'] ?? false) !== null && ($_GET['page']['offset'] ?? false) !== null)
				$limit = "{$_GET['page']['offset']}, {$_GET['page']['limit']}";
			else if (($_GET['page']['limit'] ?? false) !== null)
				$limit = $_GET['page']['limit'];
		} else {
			$limit = "";
		}

		//SORTING
		//code to be written

		//getting IDs
		if ($ids = $core->getIDs(
				$search_array = array_merge(
					($_GET['search_modules'] ?? []), 
					($_GET['modules'] ?? []), 
					array('type'=>$type)
				), 
				$limit,
				$sort_field = 'id', 
				$sort_order = 'DESC',
				$show_public_objects_only, 
				$show_partial_search_results = ($_GET['search_modules'] ? true : false)
			))
		{
			$objects = $core->getObjects($ids);
			$i = 0;
			foreach ($objects as $object) {
				$documents[$i] = new ResourceDocument($type, $object['id']);
				$documents[$i]->add('modules', $object);
				$i++;
			}
			$document = CollectionDocument::fromResources(...$documents);
			$document->sendResponse();
		} 

		else {
			$document = new ResourceDocument();
			$document->sendResponse();
		}
	}

	else if (($type ?? false) && ($id ?? false)) {
		if ($object = $core->getObject($id)) {
			$document = new ResourceDocument($type, $object['id']);
			$document->add('modules', $object);
			$document->sendResponse();
		} else {
			$document = new ResourceDocument();
			$document->sendResponse();
		}
	}

	else {
			$document = new ResourceDocument();
			$document->sendResponse();
	}
}