//Obtiene un array con todos los segmetos de la URL
var pathArray = window.location.pathname.split('/');
var applicacion = (window.location.host === "127.0.0.1" || window.location.host === "localhost" || window.location.host.indexOf('192.168.') !== -1) ? pathArray[1] : '';
function getBasePath() {
	if (!window.location.origin)
		return window.location.protocol + "//" + window.location.host + "/" + applicacion;
	else
		return window.location.origin + "/" + applicacion;
}

/*price range*/

 $('#sl2').slider();

	var RGBChange = function() {
	  $('#RGB').css('background', 'rgb('+r.getValue()+','+g.getValue()+','+b.getValue()+')')
	};	
		
/*scroll to top*/

$(document).ready(function(){
	$(function () {
		$.scrollUp({
	        scrollName: 'scrollUp', // Element ID
	        scrollDistance: 300, // Distance from top/bottom before showing element (px)
	        scrollFrom: 'top', // 'top' or 'bottom'
	        scrollSpeed: 300, // Speed back to top (ms)
	        easingType: 'linear', // Scroll to top easing (see http://easings.net/)
	        animation: 'fade', // Fade, slide, none
	        animationSpeed: 200, // Animation in speed (ms)
	        scrollTrigger: false, // Set a custom triggering element. Can be an HTML string or jQuery object
					//scrollTarget: false, // Set a custom target element for scrolling to the top
	        scrollText: '<i class="fa fa-angle-up"></i>', // Text for element, can contain HTML
	        scrollTitle: false, // Set a custom <a> title if required.
	        scrollImg: false, // Set true to use image
	        activeOverlay: false, // Set CSS color to display scrollUp active point, e.g '#00FFFF'
	        zIndex: 2147483647 // Z-Index for the overlay
		});
	});
});

function add_filter_to_marked(filtro){
	$filtros = $('.market-applied-filters');
	$filtros.find('[filter="'+$(filtro).attr('filter')+'"]').remove();
	$li =$('<li></li>');
	$li.attr('tipo',$(filtro).attr('tipo'));
	$li.attr('filter',$(filtro).attr('filter'));
	$li.html($(filtro).attr('filter'));
	$filtros.append($li);
}

function get_filters(){
	var filters={'categoria':[]};
	$.each($('.market-applied-filters li'),function(index, el) {
		filters[$(el).attr('tipo')].push($(el).attr('filter'));
	});
	console.log(filters.toSource());
	return filters;
}

$(document).on('click','.market-filter',function(e){
	e.preventDefault();

	add_filter_to_marked($(this));
	var filtros = get_filters();
	
	$.get(getBasePath()+'/web/market/catalogo',filtros, function(data) {
		$('#market-catalogo').html(data);
	});
});

function main(){

}

$(document).ready(main);
