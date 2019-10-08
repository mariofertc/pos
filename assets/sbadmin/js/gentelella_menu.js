/*To enable second search on menú. Reeplace on gentelella\buils\js\custom.js line:118*/
TEMP_CURRENT_URL = CURRENT_URL
    if($SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').length == 0){
        TEMP_CURRENT_URL = CURRENT_URL.substring(0,CURRENT_URL.lastIndexOf("/"));
    }
    // check active menu
        $SIDEBAR_MENU.find('a[href="' + TEMP_CURRENT_URL + '"]').parent('li').addClass('current-page');
        $SIDEBAR_MENU.find('a').filter(function () {
            return this.href == TEMP_CURRENT_URL;