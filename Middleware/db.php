<?php

class dbConnection {
    
    public $db;

    # Establish connection to database
    public function __construct() {

        $this->db = new mysqli('172.16.129.103', 'web_monitor', 'Monitor#2023', 'monitor');
    
        if($this->db->connect_error) {
            die("Connection failed: " . $this->db->connect_error);
        }
    }
}

