(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var utils = require('./utils');
	frms=require('./formularios');
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
			if(!data.error){
			 new PNotify({
                    title: 'Producto agregado!',
                    text: data.msg,
                    type: 'info',
		            delay: 200
                });
			}else{
				 Custombox.open({
	                target: data.msg,
	                effect: 'fadein',
	                complete: function(){
					 frms.handle_login_submit();
					 frms.handle_register_submit();
	                }
	            });
			}
		},'json');
	},
	handle_remove_from_wlist: function(item){
		$this=this;
		$producto = $(item);
		var id_producto = $producto.attr('href');
		$.post(utils.getBasePath()+'/web/Wlist/remove_from_wlist',{'producto':id_producto},function(data){
			if(!data.error){
				$producto.parents('tr').fadeOut('slow').remove();
				 new PNotify({
                    title: 'Productor retirado!',
                    text: data.msg,
                    type: 'info',
		            delay: 200
                });
			}
		},'json');
	},
	handle_add_to_cart: function(item){
		$producto = $(item);
		var id_producto = $producto.attr('href');
		$.post(utils.getBasePath()+'/web/Carts/add_to_cart',{'producto':id_producto},function(data){
			if(!data.error){
			 new PNotify({
                    title: 'Producto agregado!',
                    text: data.msg,
                    type: 'info',
		            delay: 200
                });
			}else{
				 Custombox.open({
	                target: data.msg,
	                effect: 'fadein',
	                complete: function(){
					 frms.handle_login_submit();
					 frms.handle_register_submit();
	                }
	            });
			}

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
				new PNotify({
                    title: 'Productor retirado!',
                    text: data.msg,
                    type: 'info',
		            delay: 200
                });
			}
		},'json');
	},
	clear_cart:function(){
		$this=this;
		$.post(utils.getBasePath()+'/web/Carts/clear_cart',{},function(data){
			if(!data.error){
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
},{"./formularios":3,"./utils":4}],2:[function(require,module,exports){
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
	frms.handle_pago_cc();
	catalogo.load_destacados();
}

$(document).ready(main);

},{"./catalogo":1,"./formularios":3,"./utils":4}],3:[function(require,module,exports){
var utils = require('./utils'),
	ctlg=require('./catalogo');
module.exports={
	handle_login_submit :function (){
		 $('form#form-loginmarket').find('.errors').hide();
		 $('#form-loginmarket').validate({
	        submitHandler: function (form)
	        {
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
		              	new PNotify({
		                    title: 'Bienvenido!',
		                    text: data.msg,
		                    type: 'info',
		                    delay: 500
		                });
		              
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
			              	new PNotify({
			                    title: 'Bienvenido!',
			                    text: data.msg,
			                    type: 'info'
			                });
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
	},
	handle_pago_cc :function (){
		 $('#form-pago-cc').find('.errors').hide();
		 $('#form-pago-cc').validate({
	        submitHandler: function (form)
	        {

	                $.ajax({
	                    type: 'POST', 
	                    url:  $('#form-pago-cc').attr( "action" ),
	                    data:  $( '#form-pago-cc' ).serialize(), 
	                    dataType: 'json', 
	                    async:false,
			            beforeSend:function(){
			              $('#submit_cc').addClass('disabled');
			              $('#submit_cc').val('Procesando...');
			            },
			            success : function(data){
			              if(!data.error){
			              	ctlg.clear_cart();
			               window.open(utils.getBasePath()+'/web/Carts/finalizar','_self');
			              
			              }else{
			                $('#form-pago-cc').find('.errors').fadeIn('slow').html(data.msg); 
			                $('#submit_cc').val('Guardar');
			                $('#submit_cc').removeClass('disabled');
			              }
			            },
			            error:function(jqXHR,textStatus,errorThrown){
			               $('#form-pago-cc').find('.errors').fadeIn('slow').html(jqXHR.status+' '+textStatus);
			            }
	                })
	        },
	        errorLabelContainer: "#error_message_box",
	        wrapper: "li",
	        rules:
	                {
	                    credit_card: "required",
	                    "card-number": "required",
	                    "expiry-month": "required",
	                    "expiry-year": "required",
	                }
	    });
	}
}
},{"./catalogo":1,"./utils":4}],4:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi92YXIvd3d3L2h0bWwvcG9zL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi92YXIvd3d3L2h0bWwvcG9zL2Fzc2V0cy93ZWIvanMvZGV2L2NhdGFsb2dvLmpzIiwiL3Zhci93d3cvaHRtbC9wb3MvYXNzZXRzL3dlYi9qcy9kZXYvZmFrZV80YzA2NGM2OS5qcyIsIi92YXIvd3d3L2h0bWwvcG9zL2Fzc2V0cy93ZWIvanMvZGV2L2Zvcm11bGFyaW9zLmpzIiwiL3Zhci93d3cvaHRtbC9wb3MvYXNzZXRzL3dlYi9qcy9kZXYvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblx0ZnJtcz1yZXF1aXJlKCcuL2Zvcm11bGFyaW9zJyk7XG5tb2R1bGUuZXhwb3J0cz17XG5cdGFkZF9maWx0ZXJfdG9fbWFya2VkIDogZnVuY3Rpb24gKGZpbHRybyl7XG5cdFx0JGJ0biAgPSAkKGZpbHRybyk7XG5cdCAgICAkYnRuLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKVxuXHRcdGlmKCRidG4uY3NzKCdvcGFjaXR5Jyk9PTEpe1xuXHRcdFx0JGJ0bi5hbmltYXRlKHsnb3BhY2l0eSc6MC41fSwgMjAwKTtcblx0XHR9ZWxzZXsgXG5cdFx0XHQkYnRuLmFuaW1hdGUoeydvcGFjaXR5JzoxfSwgMjAwKTtcblx0XHR9XG5cdCAgICAvL0HDsWFkZSBsYSBjYXRlZ29yaWEgc2VsZWNjaW9uYWRhIGFsIGRpdiBkZSBmaWx0cm8gYXBsaWNhZG9zXG5cdFx0LyokZmlsdHJvcyA9ICQoJy5tYXJrZXQtYXBwbGllZC1maWx0ZXJzJyk7XG5cdFx0JGZpbHRyb3MuZmluZCgnW2ZpbHRlcj1cIicrJChmaWx0cm8pLmF0dHIoJ2ZpbHRlcicpKydcIl0nKS5yZW1vdmUoKTtcblx0XHQkbGkgPSQoJzxsaT48L2xpPicpO1xuXHRcdCRsaS5hdHRyKCd0aXBvJywkKGZpbHRybykuYXR0cigndGlwbycpKTtcblx0XHQkbGkuYXR0cignZmlsdGVyJywkKGZpbHRybykuYXR0cignZmlsdGVyJykpO1xuXHRcdCRsaS5odG1sKCQoZmlsdHJvKS5hdHRyKCdmaWx0ZXInKSk7XG5cdFx0JGZpbHRyb3MuYXBwZW5kKCRsaSk7Ki9cblx0fSxcblx0Z2V0X2ZpbHRlcnMgOmZ1bmN0aW9uICgpe1xuXHRcdHZhciBmaWx0ZXJzPXsnY2F0ZWdvcmlhJzpbXSwncHJlY2lvcyc6W119O1xuXHRcdCQuZWFjaCgkKCcubWFya2V0LWZpbHRlcicpLGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuXHRcdFx0aWYoJChlbCkuaGFzQ2xhc3MoJ2FjdGl2ZScpKVxuXHRcdFx0XHRmaWx0ZXJzWyQoZWwpLmF0dHIoJ3RpcG8nKV0ucHVzaCgkKGVsKS5hdHRyKCdmaWx0ZXInKSk7XG5cdFx0fSk7XG5cdFx0ZmlsdGVycy5wcmVjaW9zPSQoJyNzbDInKS52YWwoKTtcblx0XHR2YXIgdWx0ID0gJCgnLmZlYXR1cmVzX2l0ZW1zIC5wcm9kdWN0LWltYWdlLXdyYXBwZXI6bGFzdCcpO1xuXHRcdGZpbHRlcnMudWx0aW1vID0gdWx0LmluZGV4KCcucHJvZHVjdC1pbWFnZS13cmFwcGVyJyk7XG5cdFx0Y29uc29sZS5sb2coZmlsdGVycy50b1NvdXJjZSgpKTtcblx0XHRyZXR1cm4gZmlsdGVycztcblx0fSxcblx0bG9hZF9kZXN0YWNhZG9zIDogZnVuY3Rpb24oKXtcblx0XHQkKCcjbWFya2V0LWRlc3RhY2Fkb3MnKS5sb2FkKHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0L2Rlc3RhY2Fkb3MnKTtcblx0fSxcblx0cmVsb2FkX2NhdGFsb2dvIDpmdW5jdGlvbiAoKXtcblx0XHR2YXIgZmlsdHJvcyA9IHRoaXMuZ2V0X2ZpbHRlcnMoKTtcblx0XHRmaWx0cm9zLnVsdGltbz0tMTtcblx0XHQkLmdldCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL21hcmtldC9jYXRhbG9nbycsZmlsdHJvcywgZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0aWYoZGF0YSE9XCJcIil7XG5cdFx0XHRcdCQoJyNtYXJrZXQtY2F0YWxvZ28nKS5odG1sKGRhdGEpLmFuaW1hdGUoe29wYWNjaXR5OjAuOH0sIDUwMCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cdHJlZnJlc2hfY2F0YWxvZ28gOmZ1bmN0aW9uICgpe1xuXHRcdHZhciBmaWx0cm9zID0gdGhpcy5nZXRfZmlsdGVycygpO1xuXHRcdCQuZ2V0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0L2NhdGFsb2dvJyxmaWx0cm9zLCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRpZihkYXRhIT1cIlwiKXtcblx0XHRcdFx0aWYoZmlsdHJvcy51bHRpbW8gPT0gLTEpe1xuXHRcdFx0XHRcdCQoJyNtYXJrZXQtY2F0YWxvZ28nKS5odG1sKGRhdGEpLmFuaW1hdGUoe29wYWNjaXR5OjAuOH0sIDUwMCk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdCQoJyNtYXJrZXQtY2F0YWxvZ28nKS5hcHBlbmQoZGF0YSkuYW5pbWF0ZSh7b3BhY2NpdHk6MC44fSwgNTAwKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXHRoYW5kbGVfYWRkX3RvX3dsaXN0OiBmdW5jdGlvbihpdGVtKXtcblx0XHQkcHJvZHVjdG8gPSAkKGl0ZW0pO1xuXHRcdHZhciBpZF9wcm9kdWN0byA9ICRwcm9kdWN0by5hdHRyKCdocmVmJyk7XG5cdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvV2xpc3QvYWRkX3RvX3dsaXN0Jyx7J3Byb2R1Y3RvJzppZF9wcm9kdWN0b30sZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRpZighZGF0YS5lcnJvcil7XG5cdFx0XHQgbmV3IFBOb3RpZnkoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Byb2R1Y3RvIGFncmVnYWRvIScsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEubXNnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5mbycsXG5cdFx0ICAgICAgICAgICAgZGVsYXk6IDIwMFxuICAgICAgICAgICAgICAgIH0pO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdCBDdXN0b21ib3gub3Blbih7XG5cdCAgICAgICAgICAgICAgICB0YXJnZXQ6IGRhdGEubXNnLFxuXHQgICAgICAgICAgICAgICAgZWZmZWN0OiAnZmFkZWluJyxcblx0ICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdCBmcm1zLmhhbmRsZV9sb2dpbl9zdWJtaXQoKTtcblx0XHRcdFx0XHQgZnJtcy5oYW5kbGVfcmVnaXN0ZXJfc3VibWl0KCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0pO1xuXHRcdFx0fVxuXHRcdH0sJ2pzb24nKTtcblx0fSxcblx0aGFuZGxlX3JlbW92ZV9mcm9tX3dsaXN0OiBmdW5jdGlvbihpdGVtKXtcblx0XHQkdGhpcz10aGlzO1xuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XG5cdFx0dmFyIGlkX3Byb2R1Y3RvID0gJHByb2R1Y3RvLmF0dHIoJ2hyZWYnKTtcblx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9XbGlzdC9yZW1vdmVfZnJvbV93bGlzdCcseydwcm9kdWN0byc6aWRfcHJvZHVjdG99LGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0aWYoIWRhdGEuZXJyb3Ipe1xuXHRcdFx0XHQkcHJvZHVjdG8ucGFyZW50cygndHInKS5mYWRlT3V0KCdzbG93JykucmVtb3ZlKCk7XG5cdFx0XHRcdCBuZXcgUE5vdGlmeSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvZHVjdG9yIHJldGlyYWRvIScsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEubXNnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5mbycsXG5cdFx0ICAgICAgICAgICAgZGVsYXk6IDIwMFxuICAgICAgICAgICAgICAgIH0pO1xuXHRcdFx0fVxuXHRcdH0sJ2pzb24nKTtcblx0fSxcblx0aGFuZGxlX2FkZF90b19jYXJ0OiBmdW5jdGlvbihpdGVtKXtcblx0XHQkcHJvZHVjdG8gPSAkKGl0ZW0pO1xuXHRcdHZhciBpZF9wcm9kdWN0byA9ICRwcm9kdWN0by5hdHRyKCdocmVmJyk7XG5cdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvQ2FydHMvYWRkX3RvX2NhcnQnLHsncHJvZHVjdG8nOmlkX3Byb2R1Y3RvfSxmdW5jdGlvbihkYXRhKXtcblx0XHRcdGlmKCFkYXRhLmVycm9yKXtcblx0XHRcdCBuZXcgUE5vdGlmeSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvZHVjdG8gYWdyZWdhZG8hJyxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJyxcblx0XHQgICAgICAgICAgICBkZWxheTogMjAwXG4gICAgICAgICAgICAgICAgfSk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0IEN1c3RvbWJveC5vcGVuKHtcblx0ICAgICAgICAgICAgICAgIHRhcmdldDogZGF0YS5tc2csXG5cdCAgICAgICAgICAgICAgICBlZmZlY3Q6ICdmYWRlaW4nLFxuXHQgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0IGZybXMuaGFuZGxlX2xvZ2luX3N1Ym1pdCgpO1xuXHRcdFx0XHRcdCBmcm1zLmhhbmRsZV9yZWdpc3Rlcl9zdWJtaXQoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSk7XG5cdFx0XHR9XG5cblx0XHR9LCdqc29uJyk7XG5cdH0sXG5cdGhhbmRsZV9yZW1vdmVfZnJvbV9jYXJ0OiBmdW5jdGlvbihpdGVtKXtcblx0XHQkdGhpcz10aGlzO1xuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XG5cdFx0dmFyIGlkX3Byb2R1Y3RvID0gJHByb2R1Y3RvLmF0dHIoJ2hyZWYnKTtcblx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9DYXJ0cy9yZW1vdmVfZnJvbV9jYXJ0Jyx7J3Byb2R1Y3RvJzppZF9wcm9kdWN0b30sZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRpZighZGF0YS5lcnJvcil7XG5cdFx0XHRcdCRwcm9kdWN0by5wYXJlbnRzKCd0cicpLmZhZGVPdXQoJ3Nsb3cnKS5yZW1vdmUoKTtcblx0XHRcdFx0JHRoaXMuc3VidG90YWxfY2FydCgpO1xuXHRcdFx0XHRuZXcgUE5vdGlmeSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvZHVjdG9yIHJldGlyYWRvIScsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEubXNnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5mbycsXG5cdFx0ICAgICAgICAgICAgZGVsYXk6IDIwMFxuICAgICAgICAgICAgICAgIH0pO1xuXHRcdFx0fVxuXHRcdH0sJ2pzb24nKTtcblx0fSxcblx0Y2xlYXJfY2FydDpmdW5jdGlvbigpe1xuXHRcdCR0aGlzPXRoaXM7XG5cdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvQ2FydHMvY2xlYXJfY2FydCcse30sZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRpZighZGF0YS5lcnJvcil7XG5cdFx0XHRcdCR0aGlzLnN1YnRvdGFsX2NhcnQoKTtcblx0XHRcdH1cblx0XHR9LCdqc29uJyk7XG5cdH0sXG5cdHN1YnRvdGFsX2l0ZW06ZnVuY3Rpb24odHIpe1xuXHRcdCR0ciA9ICAkKHRyKTtcblx0XHR2YXIgcHJlY2lvID0gcGFyc2VGbG9hdCgkdHIuZmluZCgnLmNhcnRfcHJpY2UgcCBzcGFuJykuaHRtbCgpKTtcblx0XHR2YXIgY2FudGlkYWQgPSBwYXJzZUludCgkdHIuZmluZCgnLmNhcnRfcXVhbnRpdHlfaW5wdXQnKS52YWwoKSk7XG5cdFx0dmFyIHJlc3VsdGFkbyA9ICR0ci5maW5kKCcuY2FydF90b3RhbF9wcmljZSBzcGFuJyk7XG5cdFx0cmVzdWx0YWRvLmh0bWwocHJlY2lvKmNhbnRpZGFkKTtcblx0fSxcblx0c3VidG90YWxfY2FydDpmdW5jdGlvbigpe1xuXHRcdHZhciBhY3VtdWxhZG9yPTA7XG5cdFx0JC5lYWNoKCQoJyNpdGVtcy1jYXJyaXRvIHRyJyksIGZ1bmN0aW9uKGluZGV4LCB2YWwpIHtcblx0XHRcdCAkaXRlbSA9ICQodmFsKTtcblxuXHRcdFx0IHZhciBzdWJ0b3RhbCA9IHBhcnNlRmxvYXQoJGl0ZW0uZmluZCgnLmNhcnRfdG90YWxfcHJpY2Ugc3BhbicpLmh0bWwoKSk7XG5cdFx0XHQgYWN1bXVsYWRvcis9c3VidG90YWw7XG5cdFx0fSk7XG5cdFx0XG5cdFx0dmFyIHN1YnRvdGFsX2NhcnQgPSAkKCcjY2FydC1zdWJ0b3RhbCBzcGFuJyk7XG5cdFx0c3VidG90YWxfY2FydC5odG1sKGFjdW11bGFkb3IpO1xuXG5cdFx0dmFyIHRvdGFsX2NhcnQgPSAkKCcjY2FydC10b3RhbCBzcGFuJyk7XG5cdFx0dG90YWxfY2FydC5odG1sKGFjdW11bGFkb3IpO1xuXHR9LFxuXHR1cGRhdGVfY2FudGlkYWRfaXRlbTogZnVuY3Rpb24oaXRlbSl7XG5cdFx0JHRoaXM9dGhpcztcblx0XHQkcHJvZHVjdG8gPSAkKGl0ZW0pO1xuXHRcdHZhciBpZF9wcm9kdWN0byA9ICRwcm9kdWN0by5hdHRyKCdocmVmJyk7XG5cdFx0dmFyIGNhbnRpZGFkID0gcGFyc2VJbnQoJHByb2R1Y3RvLmF0dHIoJ3ZhbCcpKTtcblxuXHRcdCRpbnB1dCA9ICRwcm9kdWN0by5zaWJsaW5ncygnLmNhcnRfcXVhbnRpdHlfaW5wdXQnKTtcblx0XHR2YXIgdmFsb3IgPSBwYXJzZUludCgkaW5wdXQudmFsKCkpO1xuXHRcdHZhciB0b3RhbCA9IHZhbG9yK2NhbnRpZGFkO1xuXHRcdGlmKHRvdGFsPjApXG5cdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvQ2FydHMvYWRkX3RvX2NhcnQnLHsncHJvZHVjdG8nOmlkX3Byb2R1Y3RvLCdjYW50aWRhZCc6dG90YWx9LGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0JGlucHV0LnZhbCh0b3RhbCk7XG5cdFx0XHQkdGhpcy5zdWJ0b3RhbF9pdGVtKCRpbnB1dC5wYXJlbnRzKCd0cicpKTtcblx0XHRcdCR0aGlzLnN1YnRvdGFsX2NhcnQoKTtcblx0XHR9LCdqc29uJyk7XG5cdH1cbn0iLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyksXHJcbiBjYXRhbG9nbyA9IHJlcXVpcmUoJy4vY2F0YWxvZ28nKSxcclxuIGZybXMgPSByZXF1aXJlKCcuL2Zvcm11bGFyaW9zJyk7XHJcblxyXG51dGlscy5sb2codXRpbHMuZ2V0QmFzZVBhdGgoKSk7IFxyXG4vKnByaWNlIHJhbmdlKi9cclxuJCgnI3NsMicpLnNsaWRlcigpLm9uKCdzbGlkZScsZnVuY3Rpb24oKXtjYXRhbG9nby5yZWxvYWRfY2F0YWxvZ28oKX0pO1xyXG5cclxuLypzY3JvbGwgdG8gdG9wKi9cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuXHQkKGZ1bmN0aW9uICgpIHtcclxuXHRcdCQuc2Nyb2xsVXAoe1xyXG5cdCAgICAgICAgc2Nyb2xsTmFtZTogJ3Njcm9sbFVwJywgLy8gRWxlbWVudCBJRFxyXG5cdCAgICAgICAgc2Nyb2xsRGlzdGFuY2U6IDMwMCwgLy8gRGlzdGFuY2UgZnJvbSB0b3AvYm90dG9tIGJlZm9yZSBzaG93aW5nIGVsZW1lbnQgKHB4KVxyXG5cdCAgICAgICAgc2Nyb2xsRnJvbTogJ3RvcCcsIC8vICd0b3AnIG9yICdib3R0b20nXHJcblx0ICAgICAgICBzY3JvbGxTcGVlZDogMzAwLCAvLyBTcGVlZCBiYWNrIHRvIHRvcCAobXMpXHJcblx0ICAgICAgICBlYXNpbmdUeXBlOiAnbGluZWFyJywgLy8gU2Nyb2xsIHRvIHRvcCBlYXNpbmcgKHNlZSBodHRwOi8vZWFzaW5ncy5uZXQvKVxyXG5cdCAgICAgICAgYW5pbWF0aW9uOiAnZmFkZScsIC8vIEZhZGUsIHNsaWRlLCBub25lXHJcblx0ICAgICAgICBhbmltYXRpb25TcGVlZDogMjAwLCAvLyBBbmltYXRpb24gaW4gc3BlZWQgKG1zKVxyXG5cdCAgICAgICAgc2Nyb2xsVHJpZ2dlcjogZmFsc2UsIC8vIFNldCBhIGN1c3RvbSB0cmlnZ2VyaW5nIGVsZW1lbnQuIENhbiBiZSBhbiBIVE1MIHN0cmluZyBvciBqUXVlcnkgb2JqZWN0XHJcblx0XHRcdFx0XHQvL3Njcm9sbFRhcmdldDogZmFsc2UsIC8vIFNldCBhIGN1c3RvbSB0YXJnZXQgZWxlbWVudCBmb3Igc2Nyb2xsaW5nIHRvIHRoZSB0b3BcclxuXHQgICAgICAgIHNjcm9sbFRleHQ6ICc8aSBjbGFzcz1cImZhIGZhLWFuZ2xlLXVwXCI+PC9pPicsIC8vIFRleHQgZm9yIGVsZW1lbnQsIGNhbiBjb250YWluIEhUTUxcclxuXHQgICAgICAgIHNjcm9sbFRpdGxlOiBmYWxzZSwgLy8gU2V0IGEgY3VzdG9tIDxhPiB0aXRsZSBpZiByZXF1aXJlZC5cclxuXHQgICAgICAgIHNjcm9sbEltZzogZmFsc2UsIC8vIFNldCB0cnVlIHRvIHVzZSBpbWFnZVxyXG5cdCAgICAgICAgYWN0aXZlT3ZlcmxheTogZmFsc2UsIC8vIFNldCBDU1MgY29sb3IgdG8gZGlzcGxheSBzY3JvbGxVcCBhY3RpdmUgcG9pbnQsIGUuZyAnIzAwRkZGRidcclxuXHQgICAgICAgIHpJbmRleDogMjE0NzQ4MzY0NyAvLyBaLUluZGV4IGZvciB0aGUgb3ZlcmxheVxyXG5cdFx0fSk7XHJcblx0fSk7XHJcbn0pO1xyXG5cclxuXHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcubWFya2V0LWZpbHRlcicsZnVuY3Rpb24oZSl7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGNhdGFsb2dvLmFkZF9maWx0ZXJfdG9fbWFya2VkKCQodGhpcykpOyAgICBcclxuXHRjYXRhbG9nby5yZWxvYWRfY2F0YWxvZ28oKTtcclxufSk7XHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcuYWRkLXRvLWNhcnQnLGZ1bmN0aW9uKGUpe1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRjYXRhbG9nby5oYW5kbGVfYWRkX3RvX2NhcnQoJCh0aGlzKSk7ICAgIFxyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5yZW1vdmUtZnJvbS1jYXJ0JyxmdW5jdGlvbihlKXtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0Y2F0YWxvZ28uaGFuZGxlX3JlbW92ZV9mcm9tX2NhcnQoJCh0aGlzKSk7ICAgIFxyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5hZGQtdG8td2xpc3QnLGZ1bmN0aW9uKGUpe1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRjYXRhbG9nby5oYW5kbGVfYWRkX3RvX3dsaXN0KCQodGhpcykpOyAgICBcclxufSk7XHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcucmVtb3ZlLWZyb20td2xpc3QnLGZ1bmN0aW9uKGUpe1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRjYXRhbG9nby5oYW5kbGVfcmVtb3ZlX2Zyb21fd2xpc3QoJCh0aGlzKSk7ICAgIFxyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5jYXJ0X3F1YW50aXR5X3VwLCAuY2FydF9xdWFudGl0eV9kb3duJyxmdW5jdGlvbihlKXtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0Y2F0YWxvZ28udXBkYXRlX2NhbnRpZGFkX2l0ZW0oJCh0aGlzKSk7ICAgIFxyXG5cdFxyXG59KTtcclxuXHJcblxyXG4vL29uIHNjcm9sbCBnZXRzIHdoZW4gYm90dG9tIG9mIHRoZSBwYWdlIGlzIHJlYWNoZWQgYW5kIGNhbGxzIHRoZSBmdW5jdGlvbiBkbyBsb2FkIG1vcmUgY29udGVudFxyXG4kKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKGUpe1xyXG5cdC8vTm90IGFsd2F5cyB0aGUgcG9zID09IGggc3RhdGVtZW50IGlzIHZlcmlmaWVkLCBleHBlY2lhbGx5IG9uIG1vYmlsZSBkZXZpY2VzLCB0aGF0J3Mgd2h5IGEgMzAwcHggb2YgbWFyZ2luIGFyZSBhc3N1bWVkLlxyXG5cdGlmKCQod2luZG93KS5zY3JvbGxUb3AoKSArICQod2luZG93KS5oZWlnaHQoKSA+PSAkKGRvY3VtZW50KS5oZWlnaHQoKSAtIDMwMCkge1xyXG5cdFx0dXRpbHMubG9nKFwiRmluYWwgZGUgcMOhZ2luYSBhbGNhbnphZG9cIik7XHJcblx0XHRpZigkKCcjbWFya2V0LWNhdGFsb2dvJykubGVuZ3RoKVxyXG5cdFx0XHRjYXRhbG9nby5yZWZyZXNoX2NhdGFsb2dvKCk7XHJcblx0fVxyXG59KTtcclxuXHJcbmZ1bmN0aW9uIG1haW4oKXtcclxuXHRjYXRhbG9nby5yZWxvYWRfY2F0YWxvZ28oKTtcclxuXHRmcm1zLmhhbmRsZV9sb2dpbl9zdWJtaXQoKTtcclxuXHRmcm1zLmhhbmRsZV9yZWdpc3Rlcl9zdWJtaXQoKTtcclxuXHRmcm1zLmhhbmRsZV9wYWdvX2NjKCk7XHJcblx0Y2F0YWxvZ28ubG9hZF9kZXN0YWNhZG9zKCk7XHJcbn1cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KG1haW4pO1xyXG4iLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyksXG5cdGN0bGc9cmVxdWlyZSgnLi9jYXRhbG9nbycpO1xubW9kdWxlLmV4cG9ydHM9e1xuXHRoYW5kbGVfbG9naW5fc3VibWl0IDpmdW5jdGlvbiAoKXtcblx0XHQgJCgnZm9ybSNmb3JtLWxvZ2lubWFya2V0JykuZmluZCgnLmVycm9ycycpLmhpZGUoKTtcblx0XHQgJCgnI2Zvcm0tbG9naW5tYXJrZXQnKS52YWxpZGF0ZSh7XG5cdCAgICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKGZvcm0pXG5cdCAgICAgICAge1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJywgXG4gICAgICAgICAgICAgICAgICAgIHVybDogICQoJyNmb3JtLWxvZ2lubWFya2V0JykuYXR0ciggXCJhY3Rpb25cIiApLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiAgJCggJyNmb3JtLWxvZ2lubWFya2V0JyApLnNlcmlhbGl6ZSgpLCBcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJywgXG5cdFx0ICAgICAgICAgICAgYmVmb3JlU2VuZDpmdW5jdGlvbigpe1xuXHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnZhbCgnUHJvY2VzYW5kby4uLicpO1xuXHRcdCAgICAgICAgICAgIH0sXG5cdFx0ICAgICAgICAgICAgc3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdCAgICAgICAgICAgICAgaWYoIWRhdGEuZXJyb3Ipe1xuXHRcdCAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0JywnX3NlbGYnKTtcblx0XHQgICAgICAgICAgICAgIFx0bmV3IFBOb3RpZnkoe1xuXHRcdCAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdCaWVudmVuaWRvIScsXG5cdFx0ICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1zZyxcblx0XHQgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJyxcblx0XHQgICAgICAgICAgICAgICAgICAgIGRlbGF5OiA1MDBcblx0XHQgICAgICAgICAgICAgICAgfSk7XG5cdFx0ICAgICAgICAgICAgICBcblx0XHQgICAgICAgICAgICAgIH1lbHNle1xuXHRcdCAgICAgICAgICAgICAgICAkKCcjZm9ybS1sb2dpbm1hcmtldCcpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGRhdGEubXNnKTsgXG5cdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS52YWwoJ0d1YXJkYXInKTtcblx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdCAgICAgICAgICAgICAgfVxuXHRcdCAgICAgICAgICAgIH0sXG5cdFx0ICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24oanFYSFIsdGV4dFN0YXR1cyxlcnJvclRocm93bil7XG5cdFx0ICAgICAgICAgICAgICAkKCcjZm9ybS1sb2dpbm1hcmtldCcpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGpxWEhSLnN0YXR1cysnICcrdGV4dFN0YXR1cyk7XG5cdFx0ICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG5cblx0ICAgICAgICB9LFxuXHQgICAgICAgIGVycm9yTGFiZWxDb250YWluZXI6IFwiI2Vycm9yX21lc3NhZ2VfYm94XCIsXG5cdCAgICAgICAgd3JhcHBlcjogXCJsaVwiLFxuXHQgICAgICAgIHJ1bGVzOlxuXHQgICAgICAgICAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgIH0pO1xuXHR9LFxuXHRoYW5kbGVfcmVnaXN0ZXJfc3VibWl0IDpmdW5jdGlvbiAoKXtcblx0XHQgJCgnI2Zvcm0tcmVnaXN0ZXJtYXJrZXQnKS5maW5kKCcuZXJyb3JzJykuaGlkZSgpO1xuXHRcdCAkKCcjZm9ybS1yZWdpc3Rlcm1hcmtldCcpLnZhbGlkYXRlKHtcblx0ICAgICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoZm9ybSlcblx0ICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICAkLmFqYXgoe1xuXHQgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJywgXG5cdCAgICAgICAgICAgICAgICAgICAgdXJsOiAgJCgnI2Zvcm0tcmVnaXN0ZXJtYXJrZXQnKS5hdHRyKCBcImFjdGlvblwiICksXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YTogICQoICcjZm9ybS1yZWdpc3Rlcm1hcmtldCcgKS5zZXJpYWxpemUoKSwgXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJywgXG5cdFx0XHQgICAgICAgICAgICBiZWZvcmVTZW5kOmZ1bmN0aW9uKCl7XG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnZhbCgnUHJvY2VzYW5kby4uLicpO1xuXHRcdFx0ICAgICAgICAgICAgfSxcblx0XHRcdCAgICAgICAgICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdCAgICAgICAgICAgICAgaWYoIWRhdGEuZXJyb3Ipe1xuXHRcdFx0ICAgICAgICAgICAgICBcdG5ldyBQTm90aWZ5KHtcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdCaWVudmVuaWRvIScsXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEubXNnLFxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5mbydcblx0XHRcdCAgICAgICAgICAgICAgICB9KTtcblx0XHRcdCAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0JywnX3NlbGYnKTtcblx0XHRcdCAgICAgICAgICAgICAgXG5cdFx0XHQgICAgICAgICAgICAgIH1lbHNle1xuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNmb3JtLXJlZ2lzdGVybWFya2V0JykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoZGF0YS5tc2cpOyBcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdHdWFyZGFyJyk7XG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0ICAgICAgICAgICAgICB9XG5cdFx0XHQgICAgICAgICAgICB9LFxuXHRcdFx0ICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24oanFYSFIsdGV4dFN0YXR1cyxlcnJvclRocm93bil7XG5cdFx0XHQgICAgICAgICAgICAgICAkKCcjZm9ybS1yZWdpc3Rlcm1hcmtldCcpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGpxWEhSLnN0YXR1cysnICcrdGV4dFN0YXR1cyk7XG5cdFx0XHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9KVxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgZXJyb3JMYWJlbENvbnRhaW5lcjogXCIjZXJyb3JfbWVzc2FnZV9ib3hcIixcblx0ICAgICAgICB3cmFwcGVyOiBcImxpXCIsXG5cdCAgICAgICAgcnVsZXM6XG5cdCAgICAgICAgICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICAgICAgZmlyc3RfbmFtZTogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIGVtYWlsOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgIH0pO1xuXHR9LFxuXHRoYW5kbGVfcGFnb19jYyA6ZnVuY3Rpb24gKCl7XG5cdFx0ICQoJyNmb3JtLXBhZ28tY2MnKS5maW5kKCcuZXJyb3JzJykuaGlkZSgpO1xuXHRcdCAkKCcjZm9ybS1wYWdvLWNjJykudmFsaWRhdGUoe1xuXHQgICAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uIChmb3JtKVxuXHQgICAgICAgIHtcblxuXHQgICAgICAgICAgICAgICAgJC5hamF4KHtcblx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsIFxuXHQgICAgICAgICAgICAgICAgICAgIHVybDogICQoJyNmb3JtLXBhZ28tY2MnKS5hdHRyKCBcImFjdGlvblwiICksXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YTogICQoICcjZm9ybS1wYWdvLWNjJyApLnNlcmlhbGl6ZSgpLCBcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCBcblx0ICAgICAgICAgICAgICAgICAgICBhc3luYzpmYWxzZSxcblx0XHRcdCAgICAgICAgICAgIGJlZm9yZVNlbmQ6ZnVuY3Rpb24oKXtcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdF9jYycpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0X2NjJykudmFsKCdQcm9jZXNhbmRvLi4uJyk7XG5cdFx0XHQgICAgICAgICAgICB9LFxuXHRcdFx0ICAgICAgICAgICAgc3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0ICAgICAgICAgICAgICBpZighZGF0YS5lcnJvcil7XG5cdFx0XHQgICAgICAgICAgICAgIFx0Y3RsZy5jbGVhcl9jYXJ0KCk7XG5cdFx0XHQgICAgICAgICAgICAgICB3aW5kb3cub3Blbih1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL0NhcnRzL2ZpbmFsaXphcicsJ19zZWxmJyk7XG5cdFx0XHQgICAgICAgICAgICAgIFxuXHRcdFx0ICAgICAgICAgICAgICB9ZWxzZXtcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjZm9ybS1wYWdvLWNjJykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoZGF0YS5tc2cpOyBcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0X2NjJykudmFsKCdHdWFyZGFyJyk7XG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdF9jYycpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0ICAgICAgICAgICAgICB9XG5cdFx0XHQgICAgICAgICAgICB9LFxuXHRcdFx0ICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24oanFYSFIsdGV4dFN0YXR1cyxlcnJvclRocm93bil7XG5cdFx0XHQgICAgICAgICAgICAgICAkKCcjZm9ybS1wYWdvLWNjJykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoanFYSFIuc3RhdHVzKycgJyt0ZXh0U3RhdHVzKTtcblx0XHRcdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH0pXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBlcnJvckxhYmVsQ29udGFpbmVyOiBcIiNlcnJvcl9tZXNzYWdlX2JveFwiLFxuXHQgICAgICAgIHdyYXBwZXI6IFwibGlcIixcblx0ICAgICAgICBydWxlczpcblx0ICAgICAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgICAgICBjcmVkaXRfY2FyZDogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIFwiY2FyZC1udW1iZXJcIjogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIFwiZXhwaXJ5LW1vbnRoXCI6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgICAgICBcImV4cGlyeS15ZWFyXCI6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgIH0pO1xuXHR9XG59IiwibW9kdWxlLmV4cG9ydHM9e1xuXHRsb2c6IGZ1bmN0aW9uKHN0cmluZyl7XG5cdFx0aWYoY29uc29sZSkgY29uc29sZS5sb2coc3RyaW5nKTtcblx0fSxcblx0Ly9PYnRpZW5lIHVuIGFycmF5IGNvbiB0b2RvcyBsb3Mgc2VnbWV0b3MgZGUgbGEgVVJMXG5cdGdldEJhc2VQYXRoIDogZnVuY3Rpb24oKXtcblx0XHR2YXIgcG9ydCA9IHdpbmRvdy5sb2NhdGlvbi5wb3J0O1xuXHRcdHZhciBwYXRoQXJyYXkgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoJy8nKTtcblx0XHR2YXIgYXBwbGljYWNpb24gPSAod2luZG93LmxvY2F0aW9uLmhvc3QgPT09IFwiMTI3LjAuMC4xXCIgfHwgd2luZG93LmxvY2F0aW9uLmhvc3QgPT09IFwibG9jYWxob3N0XCIgfHwgd2luZG93LmxvY2F0aW9uLmhvc3QuaW5kZXhPZignMTkyLjE2OC4nKSAhPT0gLTEpID8gcGF0aEFycmF5WzFdIDogJyc7XG5cdFx0aWYocG9ydD09PVwiMzAwMFwiKXtcblx0XHRcdGFwcGxpY2FjaW9uID0gYXBwbGljYWNpb24rJ3Bvcy8nO1xuXHRcdH1cblx0XHRpZiAoIXdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pXG5cdFx0XHRyZXR1cm4gd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyBcIi9cIiArIGFwcGxpY2FjaW9uO1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBhcHBsaWNhY2lvbjtcblx0fVxufSJdfQ==
