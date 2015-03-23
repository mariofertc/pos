(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var utils = require('./utils');
module.exports={
	add_filter_to_marked : function (filtro){
		$btn  = $(filtro);
	    $btn.toggleClass('active')
		if($btn.css('opacity')==1){
			$btn.animate({'opacity':0.5}, 200);
		}else{ 
			$btn.animate({'opacity':1}, 200);
		}
	    //Añade la categoria seleccionada al div de filtro aplicados
		/*$filtros = $('.market-applied-filters');
		$filtros.find('[filter="'+$(filtro).attr('filter')+'"]').remove();
		$li =$('<li></li>');
		$li.attr('tipo',$(filtro).attr('tipo'));
		$li.attr('filter',$(filtro).attr('filter'));
		$li.html($(filtro).attr('filter'));
		$filtros.append($li);*/
	},
	get_filters :function (){
		var filters={'categoria':[],'precios':[]};
		$.each($('.market-filter'),function(index, el) {
			if($(el).hasClass('active'))
				filters[$(el).attr('tipo')].push($(el).attr('filter'));
		});
		filters.precios=$('#sl2').val();
		console.log(filters.toSource());
		return filters;
	},

	reload_catalogo :function (){
		var filtros = this.get_filters();
		$.get(utils.getBasePath()+'/web/market/catalogo',filtros, function(data) {
			$('#market-catalogo').html(data).animate({opaccity:0.8}, 500);
		});
	},
	handle_add_to_cart: function(item){
		$producto = $(item);
		var id_producto = $producto.attr('href');
		$.post(utils.getBasePath()+'/web/Carts/add_to_cart',{'producto':id_producto},function(data){
			alert(data.msg);
		},'json');
	},
	handle_remove_from_cart: function(item){
		$producto = $(item);
		var id_producto = $producto.attr('href');
		$.post(utils.getBasePath()+'/web/Carts/remove_from_cart',{'producto':id_producto},function(data){
			alert(data.msg);
		},'json');
	}
}
},{"./utils":4}],2:[function(require,module,exports){
var utils = require('./utils'),
 catalogo = require('./catalogo'),
 frms = require('./formularios');

utils.log(utils.getBasePath()); 
/*price range*/
$('#sl2').slider().on('slide',function(){catalogo.reload_catalogo()});

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



$(document).on('click','.market-filter',function(e){
	e.preventDefault();
	catalogo.add_filter_to_marked($(this));    
	catalogo.reload_catalogo();
});

$(document).on('click','.add-to-cart',function(e){
	e.preventDefault();
	catalogo.handle_add_to_cart($(this));    
	
});

$(document).on('click','.remove-from-cart',function(e){
	e.preventDefault();
	catalogo.handle_remove_from_cart($(this));    
	
});

function main(){
	catalogo.reload_catalogo();
	frms.handle_login_submit();
	frms.handle_register_submit();
}

$(document).ready(main);

},{"./catalogo":1,"./formularios":3,"./utils":4}],3:[function(require,module,exports){
var utils = require('./utils');
module.exports={
	handle_login_submit :function (){
		 $('#form-loginmarket').find('.errors').hide();
		 $('#form-loginmarket').validate({
	        submitHandler: function (form)
	        {
	             $('#form-loginmarket').submit(function (event) {
	                $.ajax({
	                    type: 'POST', 
	                    url:  $('#form-loginmarket').attr( "action" ),
	                    data:  $( '#form-loginmarket' ).serialize(), 
	                    dataType: 'json', 
			            beforeSend:function(){
			              $('#submit').addClass('disabled');
			              $('#submit').val('Procesando...');
			            },
			            success : function(data){
			              if(!data.error){
			               window.open(utils.getBasePath()+'/web/market','_self');
			              
			              }else{
			                $('#form-loginmarket').find('.errors').fadeIn('slow').html(data.msg); 
			                $('#submit').val('Guardar');
			                $('#submit').removeClass('disabled');
			              }
			            },
			            error:function(jqXHR,textStatus,errorThrown){
			              $('#form-loginmarket').find('.errors').fadeIn('slow').html(jqXHR.status+' '+textStatus);
			            }
	                })
	              
	            });
			return false;
	        },
	        errorLabelContainer: "#error_message_box",
	        wrapper: "li",
	        rules:
	                {
	                    username: "required",
	                    password: "required",
	                }
	    });
	},
	handle_register_submit :function (){
		 $('#form-registermarket').find('.errors').hide();
		 $('#form-registermarket').validate({
	        submitHandler: function (form)
	        {
	             $('#form-registermarket').submit(function (event) {
	                $.ajax({
	                    type: 'POST', 
	                    url:  $('#form-registermarket').attr( "action" ),
	                    data:  $( '#form-registermarket' ).serialize(), 
	                    dataType: 'json', 
			            beforeSend:function(){
			              $('#submit').addClass('disabled');
			              $('#submit').val('Procesando...');
			            },
			            success : function(data){
			              if(!data.error){
			               window.open(utils.getBasePath()+'/web/market','_self');
			              
			              }else{
			                $('#form-registermarket').find('.errors').fadeIn('slow').html(data.msg); 
			                $('#submit').val('Guardar');
			                $('#submit').removeClass('disabled');
			              }
			            },
			            error:function(jqXHR,textStatus,errorThrown){
			               $('#form-registermarket').find('.errors').fadeIn('slow').html(jqXHR.status+' '+textStatus);
			            }
	                })
	              
	            });
			return false;
	        },
	        errorLabelContainer: "#error_message_box",
	        wrapper: "li",
	        rules:
	                {
	                    first_name: "required",
	                    email: "required",
	                    password: "required",
	                }
	    });
	}

}
},{"./utils":4}],4:[function(require,module,exports){
module.exports={
	log: function(string){
		if(console) console.log(string);
	},
	//Obtiene un array con todos los segmetos de la URL
	getBasePath : function(){
		var port = window.location.port;
		var pathArray = window.location.pathname.split('/');
		var applicacion = (window.location.host === "127.0.0.1" || window.location.host === "localhost" || window.location.host.indexOf('192.168.') !== -1) ? pathArray[1] : '';
		if(port==="3000"){
			applicacion = applicacion+'pos/';
		}
		if (!window.location.origin)
			return window.location.protocol + "//" + window.location.host + "/" + applicacion;
		else
			return window.location.origin + "/" + applicacion;
	}
}
},{}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi92YXIvd3d3L2h0bWwvcG9zL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi92YXIvd3d3L2h0bWwvcG9zL2Fzc2V0cy93ZWIvanMvZGV2L2NhdGFsb2dvLmpzIiwiL3Zhci93d3cvaHRtbC9wb3MvYXNzZXRzL3dlYi9qcy9kZXYvZmFrZV9iNDkxZjVhOS5qcyIsIi92YXIvd3d3L2h0bWwvcG9zL2Fzc2V0cy93ZWIvanMvZGV2L2Zvcm11bGFyaW9zLmpzIiwiL3Zhci93d3cvaHRtbC9wb3MvYXNzZXRzL3dlYi9qcy9kZXYvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xubW9kdWxlLmV4cG9ydHM9e1xuXHRhZGRfZmlsdGVyX3RvX21hcmtlZCA6IGZ1bmN0aW9uIChmaWx0cm8pe1xuXHRcdCRidG4gID0gJChmaWx0cm8pO1xuXHQgICAgJGJ0bi50b2dnbGVDbGFzcygnYWN0aXZlJylcblx0XHRpZigkYnRuLmNzcygnb3BhY2l0eScpPT0xKXtcblx0XHRcdCRidG4uYW5pbWF0ZSh7J29wYWNpdHknOjAuNX0sIDIwMCk7XG5cdFx0fWVsc2V7IFxuXHRcdFx0JGJ0bi5hbmltYXRlKHsnb3BhY2l0eSc6MX0sIDIwMCk7XG5cdFx0fVxuXHQgICAgLy9Bw7FhZGUgbGEgY2F0ZWdvcmlhIHNlbGVjY2lvbmFkYSBhbCBkaXYgZGUgZmlsdHJvIGFwbGljYWRvc1xuXHRcdC8qJGZpbHRyb3MgPSAkKCcubWFya2V0LWFwcGxpZWQtZmlsdGVycycpO1xuXHRcdCRmaWx0cm9zLmZpbmQoJ1tmaWx0ZXI9XCInKyQoZmlsdHJvKS5hdHRyKCdmaWx0ZXInKSsnXCJdJykucmVtb3ZlKCk7XG5cdFx0JGxpID0kKCc8bGk+PC9saT4nKTtcblx0XHQkbGkuYXR0cigndGlwbycsJChmaWx0cm8pLmF0dHIoJ3RpcG8nKSk7XG5cdFx0JGxpLmF0dHIoJ2ZpbHRlcicsJChmaWx0cm8pLmF0dHIoJ2ZpbHRlcicpKTtcblx0XHQkbGkuaHRtbCgkKGZpbHRybykuYXR0cignZmlsdGVyJykpO1xuXHRcdCRmaWx0cm9zLmFwcGVuZCgkbGkpOyovXG5cdH0sXG5cdGdldF9maWx0ZXJzIDpmdW5jdGlvbiAoKXtcblx0XHR2YXIgZmlsdGVycz17J2NhdGVnb3JpYSc6W10sJ3ByZWNpb3MnOltdfTtcblx0XHQkLmVhY2goJCgnLm1hcmtldC1maWx0ZXInKSxmdW5jdGlvbihpbmRleCwgZWwpIHtcblx0XHRcdGlmKCQoZWwpLmhhc0NsYXNzKCdhY3RpdmUnKSlcblx0XHRcdFx0ZmlsdGVyc1skKGVsKS5hdHRyKCd0aXBvJyldLnB1c2goJChlbCkuYXR0cignZmlsdGVyJykpO1xuXHRcdH0pO1xuXHRcdGZpbHRlcnMucHJlY2lvcz0kKCcjc2wyJykudmFsKCk7XG5cdFx0Y29uc29sZS5sb2coZmlsdGVycy50b1NvdXJjZSgpKTtcblx0XHRyZXR1cm4gZmlsdGVycztcblx0fSxcblxuXHRyZWxvYWRfY2F0YWxvZ28gOmZ1bmN0aW9uICgpe1xuXHRcdHZhciBmaWx0cm9zID0gdGhpcy5nZXRfZmlsdGVycygpO1xuXHRcdCQuZ2V0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0L2NhdGFsb2dvJyxmaWx0cm9zLCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHQkKCcjbWFya2V0LWNhdGFsb2dvJykuaHRtbChkYXRhKS5hbmltYXRlKHtvcGFjY2l0eTowLjh9LCA1MDApO1xuXHRcdH0pO1xuXHR9LFxuXHRoYW5kbGVfYWRkX3RvX2NhcnQ6IGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XG5cdFx0dmFyIGlkX3Byb2R1Y3RvID0gJHByb2R1Y3RvLmF0dHIoJ2hyZWYnKTtcblx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9DYXJ0cy9hZGRfdG9fY2FydCcseydwcm9kdWN0byc6aWRfcHJvZHVjdG99LGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0YWxlcnQoZGF0YS5tc2cpO1xuXHRcdH0sJ2pzb24nKTtcblx0fSxcblx0aGFuZGxlX3JlbW92ZV9mcm9tX2NhcnQ6IGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XG5cdFx0dmFyIGlkX3Byb2R1Y3RvID0gJHByb2R1Y3RvLmF0dHIoJ2hyZWYnKTtcblx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9DYXJ0cy9yZW1vdmVfZnJvbV9jYXJ0Jyx7J3Byb2R1Y3RvJzppZF9wcm9kdWN0b30sZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRhbGVydChkYXRhLm1zZyk7XG5cdFx0fSwnanNvbicpO1xuXHR9XG59IiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpLFxyXG4gY2F0YWxvZ28gPSByZXF1aXJlKCcuL2NhdGFsb2dvJyksXHJcbiBmcm1zID0gcmVxdWlyZSgnLi9mb3JtdWxhcmlvcycpO1xyXG5cclxudXRpbHMubG9nKHV0aWxzLmdldEJhc2VQYXRoKCkpOyBcclxuLypwcmljZSByYW5nZSovXHJcbiQoJyNzbDInKS5zbGlkZXIoKS5vbignc2xpZGUnLGZ1bmN0aW9uKCl7Y2F0YWxvZ28ucmVsb2FkX2NhdGFsb2dvKCl9KTtcclxuXHJcbi8qc2Nyb2xsIHRvIHRvcCovXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcblx0JChmdW5jdGlvbiAoKSB7XHJcblx0XHQkLnNjcm9sbFVwKHtcclxuXHQgICAgICAgIHNjcm9sbE5hbWU6ICdzY3JvbGxVcCcsIC8vIEVsZW1lbnQgSURcclxuXHQgICAgICAgIHNjcm9sbERpc3RhbmNlOiAzMDAsIC8vIERpc3RhbmNlIGZyb20gdG9wL2JvdHRvbSBiZWZvcmUgc2hvd2luZyBlbGVtZW50IChweClcclxuXHQgICAgICAgIHNjcm9sbEZyb206ICd0b3AnLCAvLyAndG9wJyBvciAnYm90dG9tJ1xyXG5cdCAgICAgICAgc2Nyb2xsU3BlZWQ6IDMwMCwgLy8gU3BlZWQgYmFjayB0byB0b3AgKG1zKVxyXG5cdCAgICAgICAgZWFzaW5nVHlwZTogJ2xpbmVhcicsIC8vIFNjcm9sbCB0byB0b3AgZWFzaW5nIChzZWUgaHR0cDovL2Vhc2luZ3MubmV0LylcclxuXHQgICAgICAgIGFuaW1hdGlvbjogJ2ZhZGUnLCAvLyBGYWRlLCBzbGlkZSwgbm9uZVxyXG5cdCAgICAgICAgYW5pbWF0aW9uU3BlZWQ6IDIwMCwgLy8gQW5pbWF0aW9uIGluIHNwZWVkIChtcylcclxuXHQgICAgICAgIHNjcm9sbFRyaWdnZXI6IGZhbHNlLCAvLyBTZXQgYSBjdXN0b20gdHJpZ2dlcmluZyBlbGVtZW50LiBDYW4gYmUgYW4gSFRNTCBzdHJpbmcgb3IgalF1ZXJ5IG9iamVjdFxyXG5cdFx0XHRcdFx0Ly9zY3JvbGxUYXJnZXQ6IGZhbHNlLCAvLyBTZXQgYSBjdXN0b20gdGFyZ2V0IGVsZW1lbnQgZm9yIHNjcm9sbGluZyB0byB0aGUgdG9wXHJcblx0ICAgICAgICBzY3JvbGxUZXh0OiAnPGkgY2xhc3M9XCJmYSBmYS1hbmdsZS11cFwiPjwvaT4nLCAvLyBUZXh0IGZvciBlbGVtZW50LCBjYW4gY29udGFpbiBIVE1MXHJcblx0ICAgICAgICBzY3JvbGxUaXRsZTogZmFsc2UsIC8vIFNldCBhIGN1c3RvbSA8YT4gdGl0bGUgaWYgcmVxdWlyZWQuXHJcblx0ICAgICAgICBzY3JvbGxJbWc6IGZhbHNlLCAvLyBTZXQgdHJ1ZSB0byB1c2UgaW1hZ2VcclxuXHQgICAgICAgIGFjdGl2ZU92ZXJsYXk6IGZhbHNlLCAvLyBTZXQgQ1NTIGNvbG9yIHRvIGRpc3BsYXkgc2Nyb2xsVXAgYWN0aXZlIHBvaW50LCBlLmcgJyMwMEZGRkYnXHJcblx0ICAgICAgICB6SW5kZXg6IDIxNDc0ODM2NDcgLy8gWi1JbmRleCBmb3IgdGhlIG92ZXJsYXlcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG59KTtcclxuXHJcblxyXG5cclxuJChkb2N1bWVudCkub24oJ2NsaWNrJywnLm1hcmtldC1maWx0ZXInLGZ1bmN0aW9uKGUpe1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRjYXRhbG9nby5hZGRfZmlsdGVyX3RvX21hcmtlZCgkKHRoaXMpKTsgICAgXHJcblx0Y2F0YWxvZ28ucmVsb2FkX2NhdGFsb2dvKCk7XHJcbn0pO1xyXG5cclxuJChkb2N1bWVudCkub24oJ2NsaWNrJywnLmFkZC10by1jYXJ0JyxmdW5jdGlvbihlKXtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0Y2F0YWxvZ28uaGFuZGxlX2FkZF90b19jYXJ0KCQodGhpcykpOyAgICBcclxuXHRcclxufSk7XHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcucmVtb3ZlLWZyb20tY2FydCcsZnVuY3Rpb24oZSl7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGNhdGFsb2dvLmhhbmRsZV9yZW1vdmVfZnJvbV9jYXJ0KCQodGhpcykpOyAgICBcclxuXHRcclxufSk7XHJcblxyXG5mdW5jdGlvbiBtYWluKCl7XHJcblx0Y2F0YWxvZ28ucmVsb2FkX2NhdGFsb2dvKCk7XHJcblx0ZnJtcy5oYW5kbGVfbG9naW5fc3VibWl0KCk7XHJcblx0ZnJtcy5oYW5kbGVfcmVnaXN0ZXJfc3VibWl0KCk7XHJcbn1cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KG1haW4pO1xyXG4iLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5tb2R1bGUuZXhwb3J0cz17XG5cdGhhbmRsZV9sb2dpbl9zdWJtaXQgOmZ1bmN0aW9uICgpe1xuXHRcdCAkKCcjZm9ybS1sb2dpbm1hcmtldCcpLmZpbmQoJy5lcnJvcnMnKS5oaWRlKCk7XG5cdFx0ICQoJyNmb3JtLWxvZ2lubWFya2V0JykudmFsaWRhdGUoe1xuXHQgICAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uIChmb3JtKVxuXHQgICAgICAgIHtcblx0ICAgICAgICAgICAgICQoJyNmb3JtLWxvZ2lubWFya2V0Jykuc3VibWl0KGZ1bmN0aW9uIChldmVudCkge1xuXHQgICAgICAgICAgICAgICAgJC5hamF4KHtcblx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsIFxuXHQgICAgICAgICAgICAgICAgICAgIHVybDogICQoJyNmb3JtLWxvZ2lubWFya2V0JykuYXR0ciggXCJhY3Rpb25cIiApLFxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGE6ICAkKCAnI2Zvcm0tbG9naW5tYXJrZXQnICkuc2VyaWFsaXplKCksIFxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsIFxuXHRcdFx0ICAgICAgICAgICAgYmVmb3JlU2VuZDpmdW5jdGlvbigpe1xuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS52YWwoJ1Byb2Nlc2FuZG8uLi4nKTtcblx0XHRcdCAgICAgICAgICAgIH0sXG5cdFx0XHQgICAgICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHQgICAgICAgICAgICAgIGlmKCFkYXRhLmVycm9yKXtcblx0XHRcdCAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0JywnX3NlbGYnKTtcblx0XHRcdCAgICAgICAgICAgICAgXG5cdFx0XHQgICAgICAgICAgICAgIH1lbHNle1xuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNmb3JtLWxvZ2lubWFya2V0JykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoZGF0YS5tc2cpOyBcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdHdWFyZGFyJyk7XG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0ICAgICAgICAgICAgICB9XG5cdFx0XHQgICAgICAgICAgICB9LFxuXHRcdFx0ICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24oanFYSFIsdGV4dFN0YXR1cyxlcnJvclRocm93bil7XG5cdFx0XHQgICAgICAgICAgICAgICQoJyNmb3JtLWxvZ2lubWFya2V0JykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoanFYSFIuc3RhdHVzKycgJyt0ZXh0U3RhdHVzKTtcblx0XHRcdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH0pXG5cdCAgICAgICAgICAgICAgXG5cdCAgICAgICAgICAgIH0pO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgZXJyb3JMYWJlbENvbnRhaW5lcjogXCIjZXJyb3JfbWVzc2FnZV9ib3hcIixcblx0ICAgICAgICB3cmFwcGVyOiBcImxpXCIsXG5cdCAgICAgICAgcnVsZXM6XG5cdCAgICAgICAgICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgfSk7XG5cdH0sXG5cdGhhbmRsZV9yZWdpc3Rlcl9zdWJtaXQgOmZ1bmN0aW9uICgpe1xuXHRcdCAkKCcjZm9ybS1yZWdpc3Rlcm1hcmtldCcpLmZpbmQoJy5lcnJvcnMnKS5oaWRlKCk7XG5cdFx0ICQoJyNmb3JtLXJlZ2lzdGVybWFya2V0JykudmFsaWRhdGUoe1xuXHQgICAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uIChmb3JtKVxuXHQgICAgICAgIHtcblx0ICAgICAgICAgICAgICQoJyNmb3JtLXJlZ2lzdGVybWFya2V0Jykuc3VibWl0KGZ1bmN0aW9uIChldmVudCkge1xuXHQgICAgICAgICAgICAgICAgJC5hamF4KHtcblx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsIFxuXHQgICAgICAgICAgICAgICAgICAgIHVybDogICQoJyNmb3JtLXJlZ2lzdGVybWFya2V0JykuYXR0ciggXCJhY3Rpb25cIiApLFxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGE6ICAkKCAnI2Zvcm0tcmVnaXN0ZXJtYXJrZXQnICkuc2VyaWFsaXplKCksIFxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsIFxuXHRcdFx0ICAgICAgICAgICAgYmVmb3JlU2VuZDpmdW5jdGlvbigpe1xuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS52YWwoJ1Byb2Nlc2FuZG8uLi4nKTtcblx0XHRcdCAgICAgICAgICAgIH0sXG5cdFx0XHQgICAgICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHQgICAgICAgICAgICAgIGlmKCFkYXRhLmVycm9yKXtcblx0XHRcdCAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0JywnX3NlbGYnKTtcblx0XHRcdCAgICAgICAgICAgICAgXG5cdFx0XHQgICAgICAgICAgICAgIH1lbHNle1xuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNmb3JtLXJlZ2lzdGVybWFya2V0JykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoZGF0YS5tc2cpOyBcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdHdWFyZGFyJyk7XG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0ICAgICAgICAgICAgICB9XG5cdFx0XHQgICAgICAgICAgICB9LFxuXHRcdFx0ICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24oanFYSFIsdGV4dFN0YXR1cyxlcnJvclRocm93bil7XG5cdFx0XHQgICAgICAgICAgICAgICAkKCcjZm9ybS1yZWdpc3Rlcm1hcmtldCcpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGpxWEhSLnN0YXR1cysnICcrdGV4dFN0YXR1cyk7XG5cdFx0XHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9KVxuXHQgICAgICAgICAgICAgIFxuXHQgICAgICAgICAgICB9KTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0ICAgICAgICB9LFxuXHQgICAgICAgIGVycm9yTGFiZWxDb250YWluZXI6IFwiI2Vycm9yX21lc3NhZ2VfYm94XCIsXG5cdCAgICAgICAgd3JhcHBlcjogXCJsaVwiLFxuXHQgICAgICAgIHJ1bGVzOlxuXHQgICAgICAgICAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgICAgIGZpcnN0X25hbWU6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgICAgICBlbWFpbDogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICB9KTtcblx0fVxuXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuXHRsb2c6IGZ1bmN0aW9uKHN0cmluZyl7XG5cdFx0aWYoY29uc29sZSkgY29uc29sZS5sb2coc3RyaW5nKTtcblx0fSxcblx0Ly9PYnRpZW5lIHVuIGFycmF5IGNvbiB0b2RvcyBsb3Mgc2VnbWV0b3MgZGUgbGEgVVJMXG5cdGdldEJhc2VQYXRoIDogZnVuY3Rpb24oKXtcblx0XHR2YXIgcG9ydCA9IHdpbmRvdy5sb2NhdGlvbi5wb3J0O1xuXHRcdHZhciBwYXRoQXJyYXkgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoJy8nKTtcblx0XHR2YXIgYXBwbGljYWNpb24gPSAod2luZG93LmxvY2F0aW9uLmhvc3QgPT09IFwiMTI3LjAuMC4xXCIgfHwgd2luZG93LmxvY2F0aW9uLmhvc3QgPT09IFwibG9jYWxob3N0XCIgfHwgd2luZG93LmxvY2F0aW9uLmhvc3QuaW5kZXhPZignMTkyLjE2OC4nKSAhPT0gLTEpID8gcGF0aEFycmF5WzFdIDogJyc7XG5cdFx0aWYocG9ydD09PVwiMzAwMFwiKXtcblx0XHRcdGFwcGxpY2FjaW9uID0gYXBwbGljYWNpb24rJ3Bvcy8nO1xuXHRcdH1cblx0XHRpZiAoIXdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pXG5cdFx0XHRyZXR1cm4gd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyBcIi9cIiArIGFwcGxpY2FjaW9uO1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBhcHBsaWNhY2lvbjtcblx0fVxufSJdfQ==
