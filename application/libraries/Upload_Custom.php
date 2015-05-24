<?php

require_once ("Upload_Handler.php");

class Upload_Custom extends Upload_Handler {

    protected $item_id = "";

    function __construct($params) {
        $this->item_id = $params['item_id'];
        parent::__construct();
    }

    protected function initialize() {
        $this->options['item_id'] = $this->item_id;
        parent::initialize();
    }

    protected function handle_form_data($file, $index) {
        $file->title = @$_REQUEST['title'][$index];
        $file->description = @$_REQUEST['description'][$index];
    }

    protected function handle_file_upload($uploaded_file, $name, $size, $type, $error, $index = null, $content_range = null) {
        $file = parent::handle_file_upload(
                        $uploaded_file, $name, $size, $type, $error, $index, $content_range
        );
        if (empty($file->error)) {
            $CI = & get_instance();
            $CI->load->model('file_model');
            $data = array('name' => $file->name, 'size' => $file->size, 'type' => $file->type, 'title' => $file->title, 'description' => $file->description, 'url' => $file->url, 'item_id' => $CI->input->post('item_id'));
            $file->id = $CI->file_model->insert($data);
        }
        return $file;
    }

    protected function set_additional_file_properties($file) {
        parent::set_additional_file_properties($file);
        $CI = & get_instance();
        $CI->load->model('file_model');
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $result = $CI->file_model->get_file_by_name($file->name);
            foreach ($result->result() as $file_db) {
                $file->id = $file_db->id;
                $file->item_id = $file_db->item_id;
                $file->type = $file_db->type;
                $file->title = $file_db->title;
                $file->description = $file_db->description;
            }
        }
    }

    public function get($print_response = true) {
        $file_name = $this->get_file_name_param();
        if (!$file_name) {
            $CI = & get_instance();
            $CI->load->model('file_model');
            $result = $CI->file_model->get_all_by_item($this->options['item_id']);
            $this->options['files_db'] = array();
            foreach ($result->result() as $file_db) {
                $file = $this->get_file_object($file_db->name);
                $file->id = $file_db->id;
                $this->options['files_db'][] = $file;
            }
        }
        parent::get($print_response);
    }

    public function delete($print_response = true) {
        $response = parent::delete(false);
        $CI = & get_instance();
        $CI->load->model('file_model');
        foreach ($response as $name => $deleted) {
            if ($deleted) {
                $CI->file_model->delete($name);
            }
        }
        return $this->generate_response($response, $print_response);
    }

}
