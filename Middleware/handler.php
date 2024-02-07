<?php

include 'db.php';

$_POST = json_decode(file_get_contents('php://input'), true);

class DbHandler {

    private $conn = NULL;

    public function __construct()
    {
        $temp = new dbConnection();
        $this->conn = $temp->db;
    }

    public function queryCurrentValues ($limit) {
        $query = $this->conn->prepare("SELECT * FROM measurements ORDER BY id DESC LIMIT ?");
        $query->bind_param('s', $limit);
        $query-> execute();

        $result = $query->get_result(); 
        $query->close(); 

        if ($result->num_rows > 0) {
            $rows = array();
            while($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }
            echo json_encode($rows);
        } else {
            echo json_encode(["error" => "No entries found."]);
        }
    }
}

$instance = new DbHandler();

if(isset($_GET['limit'])) {
    $limit = $_GET['limit'];
    echo $instance->queryCurrentValues($limit);
} else {
    echo $instance->queryCurrentValues(5);
}

if($_POST['action']=='request') {
    echo 'etst1';
    $instance->queryCurrentValues(5);
}
