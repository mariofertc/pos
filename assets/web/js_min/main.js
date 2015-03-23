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
		var ult = $('.features_items .product-image-wrapper:last');
		filters.ultimo = ult.index('.product-image-wrapper');
		console.log(filters.toSource());
		return filters;
	},
	load_destacados : function(){
		$('#market-destacados').load(utils.getBasePath()+'/web/market/destacados');
	},
	reload_catalogo :function (){
		var filtros = this.get_filters();
		filtros.ultimo=-1;
		$.get(utils.getBasePath()+'/web/market/catalogo',filtros, function(data) {
			if(data!=""){
				$('#market-catalogo').html(data).animate({opaccity:0.8}, 500);
			}
		});
	},
	refresh_catalogo :function (){
		var filtros = this.get_filters();
		$.get(utils.getBasePath()+'/web/market/catalogo',filtros, function(data) {
			if(data!=""){
				if(filtros.ultimo == -1){
					$('#market-catalogo').html(data).animate({opaccity:0.8}, 500);
				}else{
					$('#market-catalogo').append(data).animate({opaccity:0.8}, 500);
				}
			}
		});
	},
	handle_add_to_wlist: function(item){
		$producto = $(item);
		var id_producto = $producto.attr('href');
		$.post(utils.getBasePath()+'/web/Wlist/add_to_wlist',{'producto':id_producto},function(data){
			alert(data.msg);
		},'json');
	},
	handle_remove_from_wlist: function(item){
		$this=this;
		$producto = $(item);
		var id_producto = $producto.attr('href');
		$.post(utils.getBasePath()+'/web/Wlist/remove_from_wlist',{'producto':id_producto},function(data){
			if(!data.error){
				$producto.parents('tr').fadeOut('slow').remove();
			}
		},'json');
	},
	handle_add_to_cart: function(item){
		$producto = $(item);
		var id_producto = $producto.attr('href');
		$.post(utils.getBasePath()+'/web/Carts/add_to_cart',{'producto':id_producto},function(data){
			alert(data.msg);
		},'json');
	},
	handle_remove_from_cart: function(item){
		$this=this;
		$producto = $(item);
		var id_producto = $producto.attr('href');
		$.post(utils.getBasePath()+'/web/Carts/remove_from_cart',{'producto':id_producto},function(data){
			if(!data.error){
				$producto.parents('tr').fadeOut('slow').remove();
				$this.subtotal_cart();
			}
		},'json');
	},
	subtotal_item:function(tr){
		$tr =  $(tr);
		var precio = parseFloat($tr.find('.cart_price p span').html());
		var cantidad = parseInt($tr.find('.cart_quantity_input').val());
		var resultado = $tr.find('.cart_total_price span');
		resultado.html(precio*cantidad);
	},
	subtotal_cart:function(){
		var acumulador=0;
		$.each($('#items-carrito tr'), function(index, val) {
			 $item = $(val);

			 var subtotal = parseFloat($item.find('.cart_total_price span').html());
			 acumulador+=subtotal;
		});
		
		var subtotal_cart = $('#cart-subtotal span');
		subtotal_cart.html(acumulador);

		var total_cart = $('#cart-total span');
		total_cart.html(acumulador);
	},
	update_cantidad_item: function(item){
		$this=this;
		$producto = $(item);
		var id_producto = $producto.attr('href');
		var cantidad = parseInt($producto.attr('val'));

		$input = $producto.siblings('.cart_quantity_input');
		var valor = parseInt($input.val());
		var total = valor+cantidad;
		if(total>0)
		$.post(utils.getBasePath()+'/web/Carts/add_to_cart',{'producto':id_producto,'cantidad':total},function(data){
			$input.val(total);
			$this.subtotal_item($input.parents('tr'));
			$this.subtotal_cart();
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

$(document).on('click','.add-to-wlist',function(e){
	e.preventDefault();
	catalogo.handle_add_to_wlist($(this));    
});

$(document).on('click','.remove-from-wlist',function(e){
	e.preventDefault();
	catalogo.handle_remove_from_wlist($(this));    
});

$(document).on('click','.cart_quantity_up, .cart_quantity_down',function(e){
	e.preventDefault();
	catalogo.update_cantidad_item($(this));    
	
});


//on scroll gets when bottom of the page is reached and calls the function do load more content
$(window).scroll(function(e){
	//Not always the pos == h statement is verified, expecially on mobile devices, that's why a 300px of margin are assumed.
	if($(window).scrollTop() + $(window).height() >= $(document).height() - 300) {
		utils.log("Final de página alcanzado");
		if($('#market-catalogo').length)
			catalogo.refresh_catalogo();
	}
});

function main(){
	catalogo.reload_catalogo();
	frms.handle_login_submit();
	frms.handle_register_submit();
	catalogo.load_destacados();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi92YXIvd3d3L2h0bWwvcG9zL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi92YXIvd3d3L2h0bWwvcG9zL2Fzc2V0cy93ZWIvanMvZGV2L2NhdGFsb2dvLmpzIiwiL3Zhci93d3cvaHRtbC9wb3MvYXNzZXRzL3dlYi9qcy9kZXYvZmFrZV84M2NiMTI2NS5qcyIsIi92YXIvd3d3L2h0bWwvcG9zL2Fzc2V0cy93ZWIvanMvZGV2L2Zvcm11bGFyaW9zLmpzIiwiL3Zhci93d3cvaHRtbC9wb3MvYXNzZXRzL3dlYi9qcy9kZXYvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbm1vZHVsZS5leHBvcnRzPXtcblx0YWRkX2ZpbHRlcl90b19tYXJrZWQgOiBmdW5jdGlvbiAoZmlsdHJvKXtcblx0XHQkYnRuICA9ICQoZmlsdHJvKTtcblx0ICAgICRidG4udG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpXG5cdFx0aWYoJGJ0bi5jc3MoJ29wYWNpdHknKT09MSl7XG5cdFx0XHQkYnRuLmFuaW1hdGUoeydvcGFjaXR5JzowLjV9LCAyMDApO1xuXHRcdH1lbHNleyBcblx0XHRcdCRidG4uYW5pbWF0ZSh7J29wYWNpdHknOjF9LCAyMDApO1xuXHRcdH1cblx0ICAgIC8vQcOxYWRlIGxhIGNhdGVnb3JpYSBzZWxlY2Npb25hZGEgYWwgZGl2IGRlIGZpbHRybyBhcGxpY2Fkb3Ncblx0XHQvKiRmaWx0cm9zID0gJCgnLm1hcmtldC1hcHBsaWVkLWZpbHRlcnMnKTtcblx0XHQkZmlsdHJvcy5maW5kKCdbZmlsdGVyPVwiJyskKGZpbHRybykuYXR0cignZmlsdGVyJykrJ1wiXScpLnJlbW92ZSgpO1xuXHRcdCRsaSA9JCgnPGxpPjwvbGk+Jyk7XG5cdFx0JGxpLmF0dHIoJ3RpcG8nLCQoZmlsdHJvKS5hdHRyKCd0aXBvJykpO1xuXHRcdCRsaS5hdHRyKCdmaWx0ZXInLCQoZmlsdHJvKS5hdHRyKCdmaWx0ZXInKSk7XG5cdFx0JGxpLmh0bWwoJChmaWx0cm8pLmF0dHIoJ2ZpbHRlcicpKTtcblx0XHQkZmlsdHJvcy5hcHBlbmQoJGxpKTsqL1xuXHR9LFxuXHRnZXRfZmlsdGVycyA6ZnVuY3Rpb24gKCl7XG5cdFx0dmFyIGZpbHRlcnM9eydjYXRlZ29yaWEnOltdLCdwcmVjaW9zJzpbXX07XG5cdFx0JC5lYWNoKCQoJy5tYXJrZXQtZmlsdGVyJyksZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG5cdFx0XHRpZigkKGVsKS5oYXNDbGFzcygnYWN0aXZlJykpXG5cdFx0XHRcdGZpbHRlcnNbJChlbCkuYXR0cigndGlwbycpXS5wdXNoKCQoZWwpLmF0dHIoJ2ZpbHRlcicpKTtcblx0XHR9KTtcblx0XHRmaWx0ZXJzLnByZWNpb3M9JCgnI3NsMicpLnZhbCgpO1xuXHRcdHZhciB1bHQgPSAkKCcuZmVhdHVyZXNfaXRlbXMgLnByb2R1Y3QtaW1hZ2Utd3JhcHBlcjpsYXN0Jyk7XG5cdFx0ZmlsdGVycy51bHRpbW8gPSB1bHQuaW5kZXgoJy5wcm9kdWN0LWltYWdlLXdyYXBwZXInKTtcblx0XHRjb25zb2xlLmxvZyhmaWx0ZXJzLnRvU291cmNlKCkpO1xuXHRcdHJldHVybiBmaWx0ZXJzO1xuXHR9LFxuXHRsb2FkX2Rlc3RhY2Fkb3MgOiBmdW5jdGlvbigpe1xuXHRcdCQoJyNtYXJrZXQtZGVzdGFjYWRvcycpLmxvYWQodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9tYXJrZXQvZGVzdGFjYWRvcycpO1xuXHR9LFxuXHRyZWxvYWRfY2F0YWxvZ28gOmZ1bmN0aW9uICgpe1xuXHRcdHZhciBmaWx0cm9zID0gdGhpcy5nZXRfZmlsdGVycygpO1xuXHRcdGZpbHRyb3MudWx0aW1vPS0xO1xuXHRcdCQuZ2V0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0L2NhdGFsb2dvJyxmaWx0cm9zLCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRpZihkYXRhIT1cIlwiKXtcblx0XHRcdFx0JCgnI21hcmtldC1jYXRhbG9nbycpLmh0bWwoZGF0YSkuYW5pbWF0ZSh7b3BhY2NpdHk6MC44fSwgNTAwKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblx0cmVmcmVzaF9jYXRhbG9nbyA6ZnVuY3Rpb24gKCl7XG5cdFx0dmFyIGZpbHRyb3MgPSB0aGlzLmdldF9maWx0ZXJzKCk7XG5cdFx0JC5nZXQodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9tYXJrZXQvY2F0YWxvZ28nLGZpbHRyb3MsIGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdGlmKGRhdGEhPVwiXCIpe1xuXHRcdFx0XHRpZihmaWx0cm9zLnVsdGltbyA9PSAtMSl7XG5cdFx0XHRcdFx0JCgnI21hcmtldC1jYXRhbG9nbycpLmh0bWwoZGF0YSkuYW5pbWF0ZSh7b3BhY2NpdHk6MC44fSwgNTAwKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0JCgnI21hcmtldC1jYXRhbG9nbycpLmFwcGVuZChkYXRhKS5hbmltYXRlKHtvcGFjY2l0eTowLjh9LCA1MDApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cdGhhbmRsZV9hZGRfdG9fd2xpc3Q6IGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XG5cdFx0dmFyIGlkX3Byb2R1Y3RvID0gJHByb2R1Y3RvLmF0dHIoJ2hyZWYnKTtcblx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9XbGlzdC9hZGRfdG9fd2xpc3QnLHsncHJvZHVjdG8nOmlkX3Byb2R1Y3RvfSxmdW5jdGlvbihkYXRhKXtcblx0XHRcdGFsZXJ0KGRhdGEubXNnKTtcblx0XHR9LCdqc29uJyk7XG5cdH0sXG5cdGhhbmRsZV9yZW1vdmVfZnJvbV93bGlzdDogZnVuY3Rpb24oaXRlbSl7XG5cdFx0JHRoaXM9dGhpcztcblx0XHQkcHJvZHVjdG8gPSAkKGl0ZW0pO1xuXHRcdHZhciBpZF9wcm9kdWN0byA9ICRwcm9kdWN0by5hdHRyKCdocmVmJyk7XG5cdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvV2xpc3QvcmVtb3ZlX2Zyb21fd2xpc3QnLHsncHJvZHVjdG8nOmlkX3Byb2R1Y3RvfSxmdW5jdGlvbihkYXRhKXtcblx0XHRcdGlmKCFkYXRhLmVycm9yKXtcblx0XHRcdFx0JHByb2R1Y3RvLnBhcmVudHMoJ3RyJykuZmFkZU91dCgnc2xvdycpLnJlbW92ZSgpO1xuXHRcdFx0fVxuXHRcdH0sJ2pzb24nKTtcblx0fSxcblx0aGFuZGxlX2FkZF90b19jYXJ0OiBmdW5jdGlvbihpdGVtKXtcblx0XHQkcHJvZHVjdG8gPSAkKGl0ZW0pO1xuXHRcdHZhciBpZF9wcm9kdWN0byA9ICRwcm9kdWN0by5hdHRyKCdocmVmJyk7XG5cdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvQ2FydHMvYWRkX3RvX2NhcnQnLHsncHJvZHVjdG8nOmlkX3Byb2R1Y3RvfSxmdW5jdGlvbihkYXRhKXtcblx0XHRcdGFsZXJ0KGRhdGEubXNnKTtcblx0XHR9LCdqc29uJyk7XG5cdH0sXG5cdGhhbmRsZV9yZW1vdmVfZnJvbV9jYXJ0OiBmdW5jdGlvbihpdGVtKXtcblx0XHQkdGhpcz10aGlzO1xuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XG5cdFx0dmFyIGlkX3Byb2R1Y3RvID0gJHByb2R1Y3RvLmF0dHIoJ2hyZWYnKTtcblx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9DYXJ0cy9yZW1vdmVfZnJvbV9jYXJ0Jyx7J3Byb2R1Y3RvJzppZF9wcm9kdWN0b30sZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRpZighZGF0YS5lcnJvcil7XG5cdFx0XHRcdCRwcm9kdWN0by5wYXJlbnRzKCd0cicpLmZhZGVPdXQoJ3Nsb3cnKS5yZW1vdmUoKTtcblx0XHRcdFx0JHRoaXMuc3VidG90YWxfY2FydCgpO1xuXHRcdFx0fVxuXHRcdH0sJ2pzb24nKTtcblx0fSxcblx0c3VidG90YWxfaXRlbTpmdW5jdGlvbih0cil7XG5cdFx0JHRyID0gICQodHIpO1xuXHRcdHZhciBwcmVjaW8gPSBwYXJzZUZsb2F0KCR0ci5maW5kKCcuY2FydF9wcmljZSBwIHNwYW4nKS5odG1sKCkpO1xuXHRcdHZhciBjYW50aWRhZCA9IHBhcnNlSW50KCR0ci5maW5kKCcuY2FydF9xdWFudGl0eV9pbnB1dCcpLnZhbCgpKTtcblx0XHR2YXIgcmVzdWx0YWRvID0gJHRyLmZpbmQoJy5jYXJ0X3RvdGFsX3ByaWNlIHNwYW4nKTtcblx0XHRyZXN1bHRhZG8uaHRtbChwcmVjaW8qY2FudGlkYWQpO1xuXHR9LFxuXHRzdWJ0b3RhbF9jYXJ0OmZ1bmN0aW9uKCl7XG5cdFx0dmFyIGFjdW11bGFkb3I9MDtcblx0XHQkLmVhY2goJCgnI2l0ZW1zLWNhcnJpdG8gdHInKSwgZnVuY3Rpb24oaW5kZXgsIHZhbCkge1xuXHRcdFx0ICRpdGVtID0gJCh2YWwpO1xuXG5cdFx0XHQgdmFyIHN1YnRvdGFsID0gcGFyc2VGbG9hdCgkaXRlbS5maW5kKCcuY2FydF90b3RhbF9wcmljZSBzcGFuJykuaHRtbCgpKTtcblx0XHRcdCBhY3VtdWxhZG9yKz1zdWJ0b3RhbDtcblx0XHR9KTtcblx0XHRcblx0XHR2YXIgc3VidG90YWxfY2FydCA9ICQoJyNjYXJ0LXN1YnRvdGFsIHNwYW4nKTtcblx0XHRzdWJ0b3RhbF9jYXJ0Lmh0bWwoYWN1bXVsYWRvcik7XG5cblx0XHR2YXIgdG90YWxfY2FydCA9ICQoJyNjYXJ0LXRvdGFsIHNwYW4nKTtcblx0XHR0b3RhbF9jYXJ0Lmh0bWwoYWN1bXVsYWRvcik7XG5cdH0sXG5cdHVwZGF0ZV9jYW50aWRhZF9pdGVtOiBmdW5jdGlvbihpdGVtKXtcblx0XHQkdGhpcz10aGlzO1xuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XG5cdFx0dmFyIGlkX3Byb2R1Y3RvID0gJHByb2R1Y3RvLmF0dHIoJ2hyZWYnKTtcblx0XHR2YXIgY2FudGlkYWQgPSBwYXJzZUludCgkcHJvZHVjdG8uYXR0cigndmFsJykpO1xuXG5cdFx0JGlucHV0ID0gJHByb2R1Y3RvLnNpYmxpbmdzKCcuY2FydF9xdWFudGl0eV9pbnB1dCcpO1xuXHRcdHZhciB2YWxvciA9IHBhcnNlSW50KCRpbnB1dC52YWwoKSk7XG5cdFx0dmFyIHRvdGFsID0gdmFsb3IrY2FudGlkYWQ7XG5cdFx0aWYodG90YWw+MClcblx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9DYXJ0cy9hZGRfdG9fY2FydCcseydwcm9kdWN0byc6aWRfcHJvZHVjdG8sJ2NhbnRpZGFkJzp0b3RhbH0sZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHQkaW5wdXQudmFsKHRvdGFsKTtcblx0XHRcdCR0aGlzLnN1YnRvdGFsX2l0ZW0oJGlucHV0LnBhcmVudHMoJ3RyJykpO1xuXHRcdFx0JHRoaXMuc3VidG90YWxfY2FydCgpO1xuXHRcdH0sJ2pzb24nKTtcblx0fVxufSIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKSxcclxuIGNhdGFsb2dvID0gcmVxdWlyZSgnLi9jYXRhbG9nbycpLFxyXG4gZnJtcyA9IHJlcXVpcmUoJy4vZm9ybXVsYXJpb3MnKTtcclxuXHJcbnV0aWxzLmxvZyh1dGlscy5nZXRCYXNlUGF0aCgpKTsgXHJcbi8qcHJpY2UgcmFuZ2UqL1xyXG4kKCcjc2wyJykuc2xpZGVyKCkub24oJ3NsaWRlJyxmdW5jdGlvbigpe2NhdGFsb2dvLnJlbG9hZF9jYXRhbG9nbygpfSk7XHJcblxyXG4vKnNjcm9sbCB0byB0b3AqL1xyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG5cdCQoZnVuY3Rpb24gKCkge1xyXG5cdFx0JC5zY3JvbGxVcCh7XHJcblx0ICAgICAgICBzY3JvbGxOYW1lOiAnc2Nyb2xsVXAnLCAvLyBFbGVtZW50IElEXHJcblx0ICAgICAgICBzY3JvbGxEaXN0YW5jZTogMzAwLCAvLyBEaXN0YW5jZSBmcm9tIHRvcC9ib3R0b20gYmVmb3JlIHNob3dpbmcgZWxlbWVudCAocHgpXHJcblx0ICAgICAgICBzY3JvbGxGcm9tOiAndG9wJywgLy8gJ3RvcCcgb3IgJ2JvdHRvbSdcclxuXHQgICAgICAgIHNjcm9sbFNwZWVkOiAzMDAsIC8vIFNwZWVkIGJhY2sgdG8gdG9wIChtcylcclxuXHQgICAgICAgIGVhc2luZ1R5cGU6ICdsaW5lYXInLCAvLyBTY3JvbGwgdG8gdG9wIGVhc2luZyAoc2VlIGh0dHA6Ly9lYXNpbmdzLm5ldC8pXHJcblx0ICAgICAgICBhbmltYXRpb246ICdmYWRlJywgLy8gRmFkZSwgc2xpZGUsIG5vbmVcclxuXHQgICAgICAgIGFuaW1hdGlvblNwZWVkOiAyMDAsIC8vIEFuaW1hdGlvbiBpbiBzcGVlZCAobXMpXHJcblx0ICAgICAgICBzY3JvbGxUcmlnZ2VyOiBmYWxzZSwgLy8gU2V0IGEgY3VzdG9tIHRyaWdnZXJpbmcgZWxlbWVudC4gQ2FuIGJlIGFuIEhUTUwgc3RyaW5nIG9yIGpRdWVyeSBvYmplY3RcclxuXHRcdFx0XHRcdC8vc2Nyb2xsVGFyZ2V0OiBmYWxzZSwgLy8gU2V0IGEgY3VzdG9tIHRhcmdldCBlbGVtZW50IGZvciBzY3JvbGxpbmcgdG8gdGhlIHRvcFxyXG5cdCAgICAgICAgc2Nyb2xsVGV4dDogJzxpIGNsYXNzPVwiZmEgZmEtYW5nbGUtdXBcIj48L2k+JywgLy8gVGV4dCBmb3IgZWxlbWVudCwgY2FuIGNvbnRhaW4gSFRNTFxyXG5cdCAgICAgICAgc2Nyb2xsVGl0bGU6IGZhbHNlLCAvLyBTZXQgYSBjdXN0b20gPGE+IHRpdGxlIGlmIHJlcXVpcmVkLlxyXG5cdCAgICAgICAgc2Nyb2xsSW1nOiBmYWxzZSwgLy8gU2V0IHRydWUgdG8gdXNlIGltYWdlXHJcblx0ICAgICAgICBhY3RpdmVPdmVybGF5OiBmYWxzZSwgLy8gU2V0IENTUyBjb2xvciB0byBkaXNwbGF5IHNjcm9sbFVwIGFjdGl2ZSBwb2ludCwgZS5nICcjMDBGRkZGJ1xyXG5cdCAgICAgICAgekluZGV4OiAyMTQ3NDgzNjQ3IC8vIFotSW5kZXggZm9yIHRoZSBvdmVybGF5XHJcblx0XHR9KTtcclxuXHR9KTtcclxufSk7XHJcblxyXG5cclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5tYXJrZXQtZmlsdGVyJyxmdW5jdGlvbihlKXtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0Y2F0YWxvZ28uYWRkX2ZpbHRlcl90b19tYXJrZWQoJCh0aGlzKSk7ICAgIFxyXG5cdGNhdGFsb2dvLnJlbG9hZF9jYXRhbG9nbygpO1xyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5hZGQtdG8tY2FydCcsZnVuY3Rpb24oZSl7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGNhdGFsb2dvLmhhbmRsZV9hZGRfdG9fY2FydCgkKHRoaXMpKTsgICAgXHJcbn0pO1xyXG5cclxuJChkb2N1bWVudCkub24oJ2NsaWNrJywnLnJlbW92ZS1mcm9tLWNhcnQnLGZ1bmN0aW9uKGUpe1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRjYXRhbG9nby5oYW5kbGVfcmVtb3ZlX2Zyb21fY2FydCgkKHRoaXMpKTsgICAgXHJcbn0pO1xyXG5cclxuJChkb2N1bWVudCkub24oJ2NsaWNrJywnLmFkZC10by13bGlzdCcsZnVuY3Rpb24oZSl7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGNhdGFsb2dvLmhhbmRsZV9hZGRfdG9fd2xpc3QoJCh0aGlzKSk7ICAgIFxyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5yZW1vdmUtZnJvbS13bGlzdCcsZnVuY3Rpb24oZSl7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGNhdGFsb2dvLmhhbmRsZV9yZW1vdmVfZnJvbV93bGlzdCgkKHRoaXMpKTsgICAgXHJcbn0pO1xyXG5cclxuJChkb2N1bWVudCkub24oJ2NsaWNrJywnLmNhcnRfcXVhbnRpdHlfdXAsIC5jYXJ0X3F1YW50aXR5X2Rvd24nLGZ1bmN0aW9uKGUpe1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRjYXRhbG9nby51cGRhdGVfY2FudGlkYWRfaXRlbSgkKHRoaXMpKTsgICAgXHJcblx0XHJcbn0pO1xyXG5cclxuXHJcbi8vb24gc2Nyb2xsIGdldHMgd2hlbiBib3R0b20gb2YgdGhlIHBhZ2UgaXMgcmVhY2hlZCBhbmQgY2FsbHMgdGhlIGZ1bmN0aW9uIGRvIGxvYWQgbW9yZSBjb250ZW50XHJcbiQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oZSl7XHJcblx0Ly9Ob3QgYWx3YXlzIHRoZSBwb3MgPT0gaCBzdGF0ZW1lbnQgaXMgdmVyaWZpZWQsIGV4cGVjaWFsbHkgb24gbW9iaWxlIGRldmljZXMsIHRoYXQncyB3aHkgYSAzMDBweCBvZiBtYXJnaW4gYXJlIGFzc3VtZWQuXHJcblx0aWYoJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgJCh3aW5kb3cpLmhlaWdodCgpID49ICQoZG9jdW1lbnQpLmhlaWdodCgpIC0gMzAwKSB7XHJcblx0XHR1dGlscy5sb2coXCJGaW5hbCBkZSBww6FnaW5hIGFsY2FuemFkb1wiKTtcclxuXHRcdGlmKCQoJyNtYXJrZXQtY2F0YWxvZ28nKS5sZW5ndGgpXHJcblx0XHRcdGNhdGFsb2dvLnJlZnJlc2hfY2F0YWxvZ28oKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gbWFpbigpe1xyXG5cdGNhdGFsb2dvLnJlbG9hZF9jYXRhbG9nbygpO1xyXG5cdGZybXMuaGFuZGxlX2xvZ2luX3N1Ym1pdCgpO1xyXG5cdGZybXMuaGFuZGxlX3JlZ2lzdGVyX3N1Ym1pdCgpO1xyXG5cdGNhdGFsb2dvLmxvYWRfZGVzdGFjYWRvcygpO1xyXG59XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShtYWluKTtcclxuIiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xubW9kdWxlLmV4cG9ydHM9e1xuXHRoYW5kbGVfbG9naW5fc3VibWl0IDpmdW5jdGlvbiAoKXtcblx0XHQgJCgnI2Zvcm0tbG9naW5tYXJrZXQnKS5maW5kKCcuZXJyb3JzJykuaGlkZSgpO1xuXHRcdCAkKCcjZm9ybS1sb2dpbm1hcmtldCcpLnZhbGlkYXRlKHtcblx0ICAgICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoZm9ybSlcblx0ICAgICAgICB7XG5cdCAgICAgICAgICAgICAkKCcjZm9ybS1sb2dpbm1hcmtldCcpLnN1Ym1pdChmdW5jdGlvbiAoZXZlbnQpIHtcblx0ICAgICAgICAgICAgICAgICQuYWpheCh7XG5cdCAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLCBcblx0ICAgICAgICAgICAgICAgICAgICB1cmw6ICAkKCcjZm9ybS1sb2dpbm1hcmtldCcpLmF0dHIoIFwiYWN0aW9uXCIgKSxcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhOiAgJCggJyNmb3JtLWxvZ2lubWFya2V0JyApLnNlcmlhbGl6ZSgpLCBcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCBcblx0XHRcdCAgICAgICAgICAgIGJlZm9yZVNlbmQ6ZnVuY3Rpb24oKXtcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdQcm9jZXNhbmRvLi4uJyk7XG5cdFx0XHQgICAgICAgICAgICB9LFxuXHRcdFx0ICAgICAgICAgICAgc3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0ICAgICAgICAgICAgICBpZighZGF0YS5lcnJvcil7XG5cdFx0XHQgICAgICAgICAgICAgICB3aW5kb3cub3Blbih1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL21hcmtldCcsJ19zZWxmJyk7XG5cdFx0XHQgICAgICAgICAgICAgIFxuXHRcdFx0ICAgICAgICAgICAgICB9ZWxzZXtcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjZm9ybS1sb2dpbm1hcmtldCcpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGRhdGEubXNnKTsgXG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnZhbCgnR3VhcmRhcicpO1xuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdCAgICAgICAgICAgICAgfVxuXHRcdFx0ICAgICAgICAgICAgfSxcblx0XHRcdCAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKGpxWEhSLHRleHRTdGF0dXMsZXJyb3JUaHJvd24pe1xuXHRcdFx0ICAgICAgICAgICAgICAkKCcjZm9ybS1sb2dpbm1hcmtldCcpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGpxWEhSLnN0YXR1cysnICcrdGV4dFN0YXR1cyk7XG5cdFx0XHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9KVxuXHQgICAgICAgICAgICAgIFxuXHQgICAgICAgICAgICB9KTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0ICAgICAgICB9LFxuXHQgICAgICAgIGVycm9yTGFiZWxDb250YWluZXI6IFwiI2Vycm9yX21lc3NhZ2VfYm94XCIsXG5cdCAgICAgICAgd3JhcHBlcjogXCJsaVwiLFxuXHQgICAgICAgIHJ1bGVzOlxuXHQgICAgICAgICAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgIH0pO1xuXHR9LFxuXHRoYW5kbGVfcmVnaXN0ZXJfc3VibWl0IDpmdW5jdGlvbiAoKXtcblx0XHQgJCgnI2Zvcm0tcmVnaXN0ZXJtYXJrZXQnKS5maW5kKCcuZXJyb3JzJykuaGlkZSgpO1xuXHRcdCAkKCcjZm9ybS1yZWdpc3Rlcm1hcmtldCcpLnZhbGlkYXRlKHtcblx0ICAgICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoZm9ybSlcblx0ICAgICAgICB7XG5cdCAgICAgICAgICAgICAkKCcjZm9ybS1yZWdpc3Rlcm1hcmtldCcpLnN1Ym1pdChmdW5jdGlvbiAoZXZlbnQpIHtcblx0ICAgICAgICAgICAgICAgICQuYWpheCh7XG5cdCAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLCBcblx0ICAgICAgICAgICAgICAgICAgICB1cmw6ICAkKCcjZm9ybS1yZWdpc3Rlcm1hcmtldCcpLmF0dHIoIFwiYWN0aW9uXCIgKSxcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhOiAgJCggJyNmb3JtLXJlZ2lzdGVybWFya2V0JyApLnNlcmlhbGl6ZSgpLCBcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCBcblx0XHRcdCAgICAgICAgICAgIGJlZm9yZVNlbmQ6ZnVuY3Rpb24oKXtcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdQcm9jZXNhbmRvLi4uJyk7XG5cdFx0XHQgICAgICAgICAgICB9LFxuXHRcdFx0ICAgICAgICAgICAgc3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0ICAgICAgICAgICAgICBpZighZGF0YS5lcnJvcil7XG5cdFx0XHQgICAgICAgICAgICAgICB3aW5kb3cub3Blbih1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL21hcmtldCcsJ19zZWxmJyk7XG5cdFx0XHQgICAgICAgICAgICAgIFxuXHRcdFx0ICAgICAgICAgICAgICB9ZWxzZXtcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjZm9ybS1yZWdpc3Rlcm1hcmtldCcpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGRhdGEubXNnKTsgXG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnZhbCgnR3VhcmRhcicpO1xuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdCAgICAgICAgICAgICAgfVxuXHRcdFx0ICAgICAgICAgICAgfSxcblx0XHRcdCAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKGpxWEhSLHRleHRTdGF0dXMsZXJyb3JUaHJvd24pe1xuXHRcdFx0ICAgICAgICAgICAgICAgJCgnI2Zvcm0tcmVnaXN0ZXJtYXJrZXQnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChqcVhIUi5zdGF0dXMrJyAnK3RleHRTdGF0dXMpO1xuXHRcdFx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgfSlcblx0ICAgICAgICAgICAgICBcblx0ICAgICAgICAgICAgfSk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdCAgICAgICAgfSxcblx0ICAgICAgICBlcnJvckxhYmVsQ29udGFpbmVyOiBcIiNlcnJvcl9tZXNzYWdlX2JveFwiLFxuXHQgICAgICAgIHdyYXBwZXI6IFwibGlcIixcblx0ICAgICAgICBydWxlczpcblx0ICAgICAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgICAgICBmaXJzdF9uYW1lOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgZW1haWw6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgfSk7XG5cdH1cblxufSIsIm1vZHVsZS5leHBvcnRzPXtcblx0bG9nOiBmdW5jdGlvbihzdHJpbmcpe1xuXHRcdGlmKGNvbnNvbGUpIGNvbnNvbGUubG9nKHN0cmluZyk7XG5cdH0sXG5cdC8vT2J0aWVuZSB1biBhcnJheSBjb24gdG9kb3MgbG9zIHNlZ21ldG9zIGRlIGxhIFVSTFxuXHRnZXRCYXNlUGF0aCA6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHBvcnQgPSB3aW5kb3cubG9jYXRpb24ucG9ydDtcblx0XHR2YXIgcGF0aEFycmF5ID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCcvJyk7XG5cdFx0dmFyIGFwcGxpY2FjaW9uID0gKHdpbmRvdy5sb2NhdGlvbi5ob3N0ID09PSBcIjEyNy4wLjAuMVwiIHx8IHdpbmRvdy5sb2NhdGlvbi5ob3N0ID09PSBcImxvY2FsaG9zdFwiIHx8IHdpbmRvdy5sb2NhdGlvbi5ob3N0LmluZGV4T2YoJzE5Mi4xNjguJykgIT09IC0xKSA/IHBhdGhBcnJheVsxXSA6ICcnO1xuXHRcdGlmKHBvcnQ9PT1cIjMwMDBcIil7XG5cdFx0XHRhcHBsaWNhY2lvbiA9IGFwcGxpY2FjaW9uKydwb3MvJztcblx0XHR9XG5cdFx0aWYgKCF3aW5kb3cubG9jYXRpb24ub3JpZ2luKVxuXHRcdFx0cmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIHdpbmRvdy5sb2NhdGlvbi5ob3N0ICsgXCIvXCIgKyBhcHBsaWNhY2lvbjtcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgYXBwbGljYWNpb247XG5cdH1cbn0iXX0=