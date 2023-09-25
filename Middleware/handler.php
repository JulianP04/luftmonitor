<?php

include 'db.php';

class handleRequest extends dbConnection {

    private $conn = NULL;

    public function __construct()
    {
        $temp = new dbConnection();
        $this->conn = $temp->db;
    }

    public function queryCurrentValues () {
        $result = $this->conn->query("SELECT * FROM measurements LIMIT 5");

        if ($result->num_rows > 0) {
            $rows = array();
            while($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }
            var_dump(json_encode($rows));
        } else {
            var_dump("Error - No data found.");
        }
    }
}

function instantiate () {
    $instance = new handleRequest();
    $instance->queryCurrentValues();
}
