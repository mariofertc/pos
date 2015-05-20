/**
 * Para coger los parámetros de un string url
 * @param {type} ref
 * @param {type} name
 * @returns {$.urlParam.results|Array|Number}
 */
$.urlParam = function (ref, name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(ref);
    if (results == null) {
        return null;
    }
    else {
        return results[1] || 0;
    }
}
//$('.thickbox').on('click', function (e) {
/**
 * Dialogo JqueryUI
 * @param {type} param1
 * @param {type} param2
 * @param {type} param3
 */
$('body').on('click', '.thickbox', function (e) {
    ref = this.href;
    $(function () {
        //title = $.urlParam(ref,'title')===null?"":$.urlParam(ref,'title');
        width = $.urlParam(ref, 'width') === null ? 400 : $.urlParam(ref, 'width');
        height = $.urlParam(ref, 'height') === null ? 400 : $.urlParam(ref, 'height');
        $('<div id="dialog">').dialog({
            modal: true,
            open: function () {
                $(this).load(ref, function () {
                    $(this).dialog("option", "title", $(this).find("legend").text());
                    $(this).find("legend").remove();
                });
            },
            height: height,
            width: width,
            maxWidth: 600,
            title: "Cargando...",
            close: function (event, ui) {
                $(this).dialog("destroy").remove();
            }
        });
    });
    return false;
});

function tb_remove() {
    $("#dialog").dialog('close');
    return false;
}

function get_dimensions()
{
    var dims = {width: 0, height: 0};

    if (typeof (window.innerWidth) == 'number') {
        //Non-IE
        dims.width = window.innerWidth;
        dims.height = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        //IE 6+ in 'standards compliant mode'
        dims.width = document.documentElement.clientWidth;
        dims.height = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        //IE 4 compatible
        dims.width = document.body.clientWidth;
        dims.height = document.body.clientHeight;
    }

    return dims;
}

function set_feedback(text, classname, keep_displayed)
{
    if (text != '')
    {
        $('#feedback_bar').removeClass();
        $('#feedback_bar').addClass(classname);
        $('#feedback_bar').text(text);
        $('#feedback_bar').css('opacity', '1');

        if (!keep_displayed)
        {
            $('#feedback_bar').fadeTo(5000, 1);
            $('#feedback_bar').fadeTo("fast", 0);
        }
    }
    else
    {
        $('#feedback_bar').css('opacity', '0');
    }
}
