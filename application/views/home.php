<?php $this->load->view("partial/header"); ?>
<br />
<h3><?php
    echo $this->lang->line('common_welcome_message');
    $idx = 0;
    ?></h3>
<!--<div id="home_module_list">-->
<?php foreach ($allowed_modules->result() as $module) { ?>
    <!--<div class="module_item">-->
    <?php $idx++; if ($idx % 4 == 0) { ?> <div class = "row"> <?php } ?>
        <div class="col-sm-6 col-md-3">
            <div class="thumbnail">
                <a href="<?php echo site_url("$module->module_id"); ?>">
                    <img src="<?php echo base_url() . 'images/menubar/' . $module->module_id . '.png'; ?>" border="0" alt="Menubar Image" /></a>
                <div class="caption">
                    <h3><a href="<?php echo site_url("$module->module_id"); ?>"><?php echo $this->lang->line("module_" . $module->module_id) ?></a></h3>
                    <p><?php echo $this->lang->line('module_' . $module->module_id . '_desc'); ?></p>
                </div>
            </div>
        </div>
    <?php if ($idx % 4 == 0) { ?> </div> <?php } ?>
<?php } ?>
</div>
<?php $this->load->view("partial/footer"); ?>