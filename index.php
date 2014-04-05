<?php
require_once 'vendor/autoload.php';

Twig_Autoloader::register();

$loader = new Twig_Loader_Filesystem('templates');

$twig = new Twig_Environment($loader, array('auto_reload' => TRUE));

$template = $twig->loadTemplate('index.html');
$template->display(array());