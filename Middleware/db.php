<?php

class dbConnection {
    
    public $db;

    # Establish connection to database
    public function __construct() {

        $this->db = new mysqli('192.168.2.125', 'web_monitor', 'Monitor#2023', 'monitor');
    
        if($this->db->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
    }
}

