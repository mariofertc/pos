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
	handle_zoom_imagen: function(item){
		$this=this;
		$producto = $(item);
		Custombox.open({
                target: '#main-imagen-producto',
                effect: 'fadein'
            });
	},
	handle_replace_imagen: function(item){
		$this=this;
		$producto = $(item);
		$contenedor = $('#main-imagen-producto');
		$imagen = $producto.find('img');
		//$contenedor.find('img')=$imagen;

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
			if(!data.error){
				if(cantidad==0){
					new PNotify({
		                title: 'Producto agregado!',
		                text: data.msg,
		                type: 'info',
			            delay: 200
		            });
				}else{
					$input.val(total);
					$this.subtotal_item($input.parents('tr'));
					$this.subtotal_cart();
				}
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

$(document).on('click','.cart_quantity_up, .cart_quantity_down, .add-to-cart2',function(e){
	e.preventDefault();
	catalogo.update_cantidad_item($(this));    
	
});

$(document).on('click','#main-imagen-producto h3',function(e){
	e.preventDefault();
	catalogo.handle_zoom_imagen($(this));    
});

$(document).on('click','.imagen-producto',function(e){
	e.preventDefault();
	catalogo.handle_replace_imagen($(this));    
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
	frms.handle_entrega_submit();
	frms.handle_product_review_submit();
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
			            	utils.log(jqXHR);
			            	utils.log(textStatus);
			            	utils.log(errorThrown);
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
	},
	handle_entrega_submit :function (){
		 $('#form-entrega').find('.errors').hide();
		 $('#form-entrega').validate({
	        submitHandler: function (form)
	        {
	                $.ajax({
	                    type: 'POST', 
	                    url:  $('#form-entrega').attr( "action" ),
	                    data:  $( '#form-entrega' ).serialize(), 
	                    dataType: 'json', 
			            beforeSend:function(){
			              $('#submit').addClass('disabled');
			              $('#submit').val('Procesando...');
			            },
			            success : function(data){
			              if(!data.error){
			              	new PNotify({
			                    title: 'Información actualizada!',
			                    text: data.msg,
			                    type: 'info'
			                });
			               window.open(utils.getBasePath()+'/web/Carts/pago','_self');
			              
			              }else{
			                $('#form-entrega').find('.errors').fadeIn('slow').html(data.msg); 
			                $('#submit').val('Guardar');
			                $('#submit').removeClass('disabled');
			              }
			            },
			            error:function(jqXHR,textStatus,errorThrown){
			               $('#form-entrega').find('.errors').fadeIn('slow').html(jqXHR.status+' '+textStatus);
			            }
	                })
	        },
	        errorLabelContainer: "#error_message_box",
	        wrapper: "li",
	        rules:
	                {
	                    first_name: "required",
	                    last_name: "required",
	                    address_1: "required",
	                    phone_number: "required",
	                    email: "required",
	                    password: "required",
	                }
	    });
	},
	handle_product_review_submit :function (){
		 $('#form-productreview').find('.errors').hide();
		 $('#form-productreview').validate({
	        submitHandler: function (form)
	        {
	                $.ajax({
	                    type: 'POST', 
	                    url:  $('#form-productreview').attr( "action" ),
	                    data:  $( '#form-productreview' ).serialize(), 
	                    dataType: 'json', 
			            beforeSend:function(){
			              $('#submit').addClass('disabled');
			              $('#submit').val('Procesando...');
			            },
			            success : function(data){
			              if(!data.error){
			              	$contenedor = $('#productreviews');
							$.post(utils.getBasePath()+'/web/market/get_review',{'ID':data.ID},function(data){
									$contenedor.prepend(data);
							},'text');
							$('#form-productreview').trigger('reset');
			              }else{
			                $('#form-productreview').find('.errors').fadeIn('slow').html(data.msg); 
			              }
			            },
			            error:function(jqXHR,textStatus,errorThrown){
			               $('#form-entrega').find('.errors').fadeIn('slow').html(jqXHR.status+' '+textStatus);
			            },
			            complete:function(){
			            	$('#submit').val('Guardar');
			                $('#submit').removeClass('disabled');
			            }
	                })
	        },
	        errorLabelContainer: "#error_message_box",
	        wrapper: "li",
	        rules:
	                {
	                    nombre: "required",
	                    email: "required",
	                    detalle: "required",
	                }
	    });
	},
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxmZXJcXFByb3llY3Rvc1xcUE9TXFxwb3NcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkQ6L2Zlci9Qcm95ZWN0b3MvUE9TL3Bvcy9hc3NldHMvd2ViL2pzL2Rldi9jYXRhbG9nby5qcyIsIkQ6L2Zlci9Qcm95ZWN0b3MvUE9TL3Bvcy9hc3NldHMvd2ViL2pzL2Rldi9mYWtlXzdkYjBjYWFkLmpzIiwiRDovZmVyL1Byb3llY3Rvcy9QT1MvcG9zL2Fzc2V0cy93ZWIvanMvZGV2L2Zvcm11bGFyaW9zLmpzIiwiRDovZmVyL1Byb3llY3Rvcy9QT1MvcG9zL2Fzc2V0cy93ZWIvanMvZGV2L3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XHJcblx0ZnJtcz1yZXF1aXJlKCcuL2Zvcm11bGFyaW9zJyk7XHJcbm1vZHVsZS5leHBvcnRzPXtcclxuXHRhZGRfZmlsdGVyX3RvX21hcmtlZCA6IGZ1bmN0aW9uIChmaWx0cm8pe1xyXG5cdFx0JGJ0biAgPSAkKGZpbHRybyk7XHJcblx0ICAgICRidG4udG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpXHJcblx0XHRpZigkYnRuLmNzcygnb3BhY2l0eScpPT0xKXtcclxuXHRcdFx0JGJ0bi5hbmltYXRlKHsnb3BhY2l0eSc6MC41fSwgMjAwKTtcclxuXHRcdH1lbHNleyBcclxuXHRcdFx0JGJ0bi5hbmltYXRlKHsnb3BhY2l0eSc6MX0sIDIwMCk7XHJcblx0XHR9XHJcblx0ICAgIC8vQcOxYWRlIGxhIGNhdGVnb3JpYSBzZWxlY2Npb25hZGEgYWwgZGl2IGRlIGZpbHRybyBhcGxpY2Fkb3NcclxuXHRcdC8qJGZpbHRyb3MgPSAkKCcubWFya2V0LWFwcGxpZWQtZmlsdGVycycpO1xyXG5cdFx0JGZpbHRyb3MuZmluZCgnW2ZpbHRlcj1cIicrJChmaWx0cm8pLmF0dHIoJ2ZpbHRlcicpKydcIl0nKS5yZW1vdmUoKTtcclxuXHRcdCRsaSA9JCgnPGxpPjwvbGk+Jyk7XHJcblx0XHQkbGkuYXR0cigndGlwbycsJChmaWx0cm8pLmF0dHIoJ3RpcG8nKSk7XHJcblx0XHQkbGkuYXR0cignZmlsdGVyJywkKGZpbHRybykuYXR0cignZmlsdGVyJykpO1xyXG5cdFx0JGxpLmh0bWwoJChmaWx0cm8pLmF0dHIoJ2ZpbHRlcicpKTtcclxuXHRcdCRmaWx0cm9zLmFwcGVuZCgkbGkpOyovXHJcblx0fSxcclxuXHRnZXRfZmlsdGVycyA6ZnVuY3Rpb24gKCl7XHJcblx0XHR2YXIgZmlsdGVycz17J2NhdGVnb3JpYSc6W10sJ3ByZWNpb3MnOltdfTtcclxuXHRcdCQuZWFjaCgkKCcubWFya2V0LWZpbHRlcicpLGZ1bmN0aW9uKGluZGV4LCBlbCkge1xyXG5cdFx0XHRpZigkKGVsKS5oYXNDbGFzcygnYWN0aXZlJykpXHJcblx0XHRcdFx0ZmlsdGVyc1skKGVsKS5hdHRyKCd0aXBvJyldLnB1c2goJChlbCkuYXR0cignZmlsdGVyJykpO1xyXG5cdFx0fSk7XHJcblx0XHRmaWx0ZXJzLnByZWNpb3M9JCgnI3NsMicpLnZhbCgpO1xyXG5cdFx0dmFyIHVsdCA9ICQoJy5mZWF0dXJlc19pdGVtcyAucHJvZHVjdC1pbWFnZS13cmFwcGVyOmxhc3QnKTtcclxuXHRcdGZpbHRlcnMudWx0aW1vID0gdWx0LmluZGV4KCcucHJvZHVjdC1pbWFnZS13cmFwcGVyJyk7XHJcblx0XHRjb25zb2xlLmxvZyhmaWx0ZXJzLnRvU291cmNlKCkpO1xyXG5cdFx0cmV0dXJuIGZpbHRlcnM7XHJcblx0fSxcclxuXHRsb2FkX2Rlc3RhY2Fkb3MgOiBmdW5jdGlvbigpe1xyXG5cdFx0JCgnI21hcmtldC1kZXN0YWNhZG9zJykubG9hZCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL21hcmtldC9kZXN0YWNhZG9zJyk7XHJcblx0fSxcclxuXHRyZWxvYWRfY2F0YWxvZ28gOmZ1bmN0aW9uICgpe1xyXG5cdFx0dmFyIGZpbHRyb3MgPSB0aGlzLmdldF9maWx0ZXJzKCk7XHJcblx0XHRmaWx0cm9zLnVsdGltbz0tMTtcclxuXHRcdCQuZ2V0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0L2NhdGFsb2dvJyxmaWx0cm9zLCBmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdGlmKGRhdGEhPVwiXCIpe1xyXG5cdFx0XHRcdCQoJyNtYXJrZXQtY2F0YWxvZ28nKS5odG1sKGRhdGEpLmFuaW1hdGUoe29wYWNjaXR5OjAuOH0sIDUwMCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0cmVmcmVzaF9jYXRhbG9nbyA6ZnVuY3Rpb24gKCl7XHJcblx0XHR2YXIgZmlsdHJvcyA9IHRoaXMuZ2V0X2ZpbHRlcnMoKTtcclxuXHRcdCQuZ2V0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0L2NhdGFsb2dvJyxmaWx0cm9zLCBmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdGlmKGRhdGEhPVwiXCIpe1xyXG5cdFx0XHRcdGlmKGZpbHRyb3MudWx0aW1vID09IC0xKXtcclxuXHRcdFx0XHRcdCQoJyNtYXJrZXQtY2F0YWxvZ28nKS5odG1sKGRhdGEpLmFuaW1hdGUoe29wYWNjaXR5OjAuOH0sIDUwMCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHQkKCcjbWFya2V0LWNhdGFsb2dvJykuYXBwZW5kKGRhdGEpLmFuaW1hdGUoe29wYWNjaXR5OjAuOH0sIDUwMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGhhbmRsZV9hZGRfdG9fd2xpc3Q6IGZ1bmN0aW9uKGl0ZW0pe1xyXG5cdFx0JHByb2R1Y3RvID0gJChpdGVtKTtcclxuXHRcdHZhciBpZF9wcm9kdWN0byA9ICRwcm9kdWN0by5hdHRyKCdocmVmJyk7XHJcblx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9XbGlzdC9hZGRfdG9fd2xpc3QnLHsncHJvZHVjdG8nOmlkX3Byb2R1Y3RvfSxmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0aWYoIWRhdGEuZXJyb3Ipe1xyXG5cdFx0XHQgbmV3IFBOb3RpZnkoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvZHVjdG8gYWdyZWdhZG8hJyxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1zZyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5mbycsXHJcblx0XHQgICAgICAgICAgICBkZWxheTogMjAwXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0IEN1c3RvbWJveC5vcGVuKHtcclxuXHQgICAgICAgICAgICAgICAgdGFyZ2V0OiBkYXRhLm1zZyxcclxuXHQgICAgICAgICAgICAgICAgZWZmZWN0OiAnZmFkZWluJyxcclxuXHQgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHQgZnJtcy5oYW5kbGVfbG9naW5fc3VibWl0KCk7XHJcblx0XHRcdFx0XHQgZnJtcy5oYW5kbGVfcmVnaXN0ZXJfc3VibWl0KCk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICB9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSwnanNvbicpO1xyXG5cdH0sXHJcblx0aGFuZGxlX3JlbW92ZV9mcm9tX3dsaXN0OiBmdW5jdGlvbihpdGVtKXtcclxuXHRcdCR0aGlzPXRoaXM7XHJcblx0XHQkcHJvZHVjdG8gPSAkKGl0ZW0pO1xyXG5cdFx0dmFyIGlkX3Byb2R1Y3RvID0gJHByb2R1Y3RvLmF0dHIoJ2hyZWYnKTtcclxuXHRcdCQucG9zdCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL1dsaXN0L3JlbW92ZV9mcm9tX3dsaXN0Jyx7J3Byb2R1Y3RvJzppZF9wcm9kdWN0b30sZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdGlmKCFkYXRhLmVycm9yKXtcclxuXHRcdFx0XHQkcHJvZHVjdG8ucGFyZW50cygndHInKS5mYWRlT3V0KCdzbG93JykucmVtb3ZlKCk7XHJcblx0XHRcdFx0IG5ldyBQTm90aWZ5KHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Byb2R1Y3RvciByZXRpcmFkbyEnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEubXNnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJyxcclxuXHRcdCAgICAgICAgICAgIGRlbGF5OiAyMDBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9LCdqc29uJyk7XHJcblx0fSxcclxuXHRoYW5kbGVfYWRkX3RvX2NhcnQ6IGZ1bmN0aW9uKGl0ZW0pe1xyXG5cdFx0JHByb2R1Y3RvID0gJChpdGVtKTtcclxuXHRcdHZhciBpZF9wcm9kdWN0byA9ICRwcm9kdWN0by5hdHRyKCdocmVmJyk7XHJcblx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9DYXJ0cy9hZGRfdG9fY2FydCcseydwcm9kdWN0byc6aWRfcHJvZHVjdG99LGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRpZighZGF0YS5lcnJvcil7XHJcblx0XHRcdCBuZXcgUE5vdGlmeSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQcm9kdWN0byBhZ3JlZ2FkbyEnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEubXNnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJyxcclxuXHRcdCAgICAgICAgICAgIGRlbGF5OiAyMDBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQgQ3VzdG9tYm94Lm9wZW4oe1xyXG5cdCAgICAgICAgICAgICAgICB0YXJnZXQ6IGRhdGEubXNnLFxyXG5cdCAgICAgICAgICAgICAgICBlZmZlY3Q6ICdmYWRlaW4nLFxyXG5cdCAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdCBmcm1zLmhhbmRsZV9sb2dpbl9zdWJtaXQoKTtcclxuXHRcdFx0XHRcdCBmcm1zLmhhbmRsZV9yZWdpc3Rlcl9zdWJtaXQoKTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSwnanNvbicpO1xyXG5cdH0sXHJcblx0aGFuZGxlX3JlbW92ZV9mcm9tX2NhcnQ6IGZ1bmN0aW9uKGl0ZW0pe1xyXG5cdFx0JHRoaXM9dGhpcztcclxuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XHJcblx0XHR2YXIgaWRfcHJvZHVjdG8gPSAkcHJvZHVjdG8uYXR0cignaHJlZicpO1xyXG5cdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvQ2FydHMvcmVtb3ZlX2Zyb21fY2FydCcseydwcm9kdWN0byc6aWRfcHJvZHVjdG99LGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRpZighZGF0YS5lcnJvcil7XHJcblx0XHRcdFx0JHByb2R1Y3RvLnBhcmVudHMoJ3RyJykuZmFkZU91dCgnc2xvdycpLnJlbW92ZSgpO1xyXG5cdFx0XHRcdCR0aGlzLnN1YnRvdGFsX2NhcnQoKTtcclxuXHRcdFx0XHRuZXcgUE5vdGlmeSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQcm9kdWN0b3IgcmV0aXJhZG8hJyxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1zZyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5mbycsXHJcblx0XHQgICAgICAgICAgICBkZWxheTogMjAwXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSwnanNvbicpO1xyXG5cdH0sXHJcblx0aGFuZGxlX3pvb21faW1hZ2VuOiBmdW5jdGlvbihpdGVtKXtcclxuXHRcdCR0aGlzPXRoaXM7XHJcblx0XHQkcHJvZHVjdG8gPSAkKGl0ZW0pO1xyXG5cdFx0Q3VzdG9tYm94Lm9wZW4oe1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiAnI21haW4taW1hZ2VuLXByb2R1Y3RvJyxcclxuICAgICAgICAgICAgICAgIGVmZmVjdDogJ2ZhZGVpbidcclxuICAgICAgICAgICAgfSk7XHJcblx0fSxcclxuXHRoYW5kbGVfcmVwbGFjZV9pbWFnZW46IGZ1bmN0aW9uKGl0ZW0pe1xyXG5cdFx0JHRoaXM9dGhpcztcclxuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XHJcblx0XHQkY29udGVuZWRvciA9ICQoJyNtYWluLWltYWdlbi1wcm9kdWN0bycpO1xyXG5cdFx0JGltYWdlbiA9ICRwcm9kdWN0by5maW5kKCdpbWcnKTtcclxuXHRcdC8vJGNvbnRlbmVkb3IuZmluZCgnaW1nJyk9JGltYWdlbjtcclxuXHJcblx0fSxcclxuXHRjbGVhcl9jYXJ0OmZ1bmN0aW9uKCl7XHJcblx0XHQkdGhpcz10aGlzO1xyXG5cdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvQ2FydHMvY2xlYXJfY2FydCcse30sZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdGlmKCFkYXRhLmVycm9yKXtcclxuXHRcdFx0XHQkdGhpcy5zdWJ0b3RhbF9jYXJ0KCk7XHJcblx0XHRcdH1cclxuXHRcdH0sJ2pzb24nKTtcclxuXHR9LFxyXG5cdHN1YnRvdGFsX2l0ZW06ZnVuY3Rpb24odHIpe1xyXG5cdFx0JHRyID0gICQodHIpO1xyXG5cdFx0dmFyIHByZWNpbyA9IHBhcnNlRmxvYXQoJHRyLmZpbmQoJy5jYXJ0X3ByaWNlIHAgc3BhbicpLmh0bWwoKSk7XHJcblx0XHR2YXIgY2FudGlkYWQgPSBwYXJzZUludCgkdHIuZmluZCgnLmNhcnRfcXVhbnRpdHlfaW5wdXQnKS52YWwoKSk7XHJcblx0XHR2YXIgcmVzdWx0YWRvID0gJHRyLmZpbmQoJy5jYXJ0X3RvdGFsX3ByaWNlIHNwYW4nKTtcclxuXHRcdHJlc3VsdGFkby5odG1sKHByZWNpbypjYW50aWRhZCk7XHJcblx0fSxcclxuXHRzdWJ0b3RhbF9jYXJ0OmZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgYWN1bXVsYWRvcj0wO1xyXG5cdFx0JC5lYWNoKCQoJyNpdGVtcy1jYXJyaXRvIHRyJyksIGZ1bmN0aW9uKGluZGV4LCB2YWwpIHtcclxuXHRcdFx0ICRpdGVtID0gJCh2YWwpO1xyXG5cclxuXHRcdFx0IHZhciBzdWJ0b3RhbCA9IHBhcnNlRmxvYXQoJGl0ZW0uZmluZCgnLmNhcnRfdG90YWxfcHJpY2Ugc3BhbicpLmh0bWwoKSk7XHJcblx0XHRcdCBhY3VtdWxhZG9yKz1zdWJ0b3RhbDtcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHR2YXIgc3VidG90YWxfY2FydCA9ICQoJyNjYXJ0LXN1YnRvdGFsIHNwYW4nKTtcclxuXHRcdHN1YnRvdGFsX2NhcnQuaHRtbChhY3VtdWxhZG9yKTtcclxuXHJcblx0XHR2YXIgdG90YWxfY2FydCA9ICQoJyNjYXJ0LXRvdGFsIHNwYW4nKTtcclxuXHRcdHRvdGFsX2NhcnQuaHRtbChhY3VtdWxhZG9yKTtcclxuXHR9LFxyXG5cdHVwZGF0ZV9jYW50aWRhZF9pdGVtOiBmdW5jdGlvbihpdGVtKXtcclxuXHRcdCR0aGlzPXRoaXM7XHJcblx0XHQkcHJvZHVjdG8gPSAkKGl0ZW0pO1xyXG5cdFx0dmFyIGlkX3Byb2R1Y3RvID0gJHByb2R1Y3RvLmF0dHIoJ2hyZWYnKTtcclxuXHRcdHZhciBjYW50aWRhZCA9IHBhcnNlSW50KCRwcm9kdWN0by5hdHRyKCd2YWwnKSk7XHJcblxyXG5cdFx0JGlucHV0ID0gJHByb2R1Y3RvLnNpYmxpbmdzKCcuY2FydF9xdWFudGl0eV9pbnB1dCcpO1xyXG5cdFx0dmFyIHZhbG9yID0gcGFyc2VJbnQoJGlucHV0LnZhbCgpKTtcclxuXHRcdHZhciB0b3RhbCA9IHZhbG9yK2NhbnRpZGFkO1xyXG5cdFx0aWYodG90YWw+MClcclxuXHRcdCQucG9zdCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL0NhcnRzL2FkZF90b19jYXJ0Jyx7J3Byb2R1Y3RvJzppZF9wcm9kdWN0bywnY2FudGlkYWQnOnRvdGFsfSxmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0aWYoIWRhdGEuZXJyb3Ipe1xyXG5cdFx0XHRcdGlmKGNhbnRpZGFkPT0wKXtcclxuXHRcdFx0XHRcdG5ldyBQTm90aWZ5KHtcclxuXHRcdCAgICAgICAgICAgICAgICB0aXRsZTogJ1Byb2R1Y3RvIGFncmVnYWRvIScsXHJcblx0XHQgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXHJcblx0XHQgICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nLFxyXG5cdFx0XHQgICAgICAgICAgICBkZWxheTogMjAwXHJcblx0XHQgICAgICAgICAgICB9KTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdCRpbnB1dC52YWwodG90YWwpO1xyXG5cdFx0XHRcdFx0JHRoaXMuc3VidG90YWxfaXRlbSgkaW5wdXQucGFyZW50cygndHInKSk7XHJcblx0XHRcdFx0XHQkdGhpcy5zdWJ0b3RhbF9jYXJ0KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQgQ3VzdG9tYm94Lm9wZW4oe1xyXG5cdCAgICAgICAgICAgICAgICB0YXJnZXQ6IGRhdGEubXNnLFxyXG5cdCAgICAgICAgICAgICAgICBlZmZlY3Q6ICdmYWRlaW4nLFxyXG5cdCAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdCBmcm1zLmhhbmRsZV9sb2dpbl9zdWJtaXQoKTtcclxuXHRcdFx0XHRcdCBmcm1zLmhhbmRsZV9yZWdpc3Rlcl9zdWJtaXQoKTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9LCdqc29uJyk7XHJcblx0fVxyXG59IiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpLFxyXG4gY2F0YWxvZ28gPSByZXF1aXJlKCcuL2NhdGFsb2dvJyksXHJcbiBmcm1zID0gcmVxdWlyZSgnLi9mb3JtdWxhcmlvcycpO1xyXG5cclxudXRpbHMubG9nKHV0aWxzLmdldEJhc2VQYXRoKCkpOyBcclxuLypwcmljZSByYW5nZSovXHJcbiQoJyNzbDInKS5zbGlkZXIoKS5vbignc2xpZGUnLGZ1bmN0aW9uKCl7Y2F0YWxvZ28ucmVsb2FkX2NhdGFsb2dvKCl9KTtcclxuXHJcbi8qc2Nyb2xsIHRvIHRvcCovXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcblx0JChmdW5jdGlvbiAoKSB7XHJcblx0XHQkLnNjcm9sbFVwKHtcclxuXHQgICAgICAgIHNjcm9sbE5hbWU6ICdzY3JvbGxVcCcsIC8vIEVsZW1lbnQgSURcclxuXHQgICAgICAgIHNjcm9sbERpc3RhbmNlOiAzMDAsIC8vIERpc3RhbmNlIGZyb20gdG9wL2JvdHRvbSBiZWZvcmUgc2hvd2luZyBlbGVtZW50IChweClcclxuXHQgICAgICAgIHNjcm9sbEZyb206ICd0b3AnLCAvLyAndG9wJyBvciAnYm90dG9tJ1xyXG5cdCAgICAgICAgc2Nyb2xsU3BlZWQ6IDMwMCwgLy8gU3BlZWQgYmFjayB0byB0b3AgKG1zKVxyXG5cdCAgICAgICAgZWFzaW5nVHlwZTogJ2xpbmVhcicsIC8vIFNjcm9sbCB0byB0b3AgZWFzaW5nIChzZWUgaHR0cDovL2Vhc2luZ3MubmV0LylcclxuXHQgICAgICAgIGFuaW1hdGlvbjogJ2ZhZGUnLCAvLyBGYWRlLCBzbGlkZSwgbm9uZVxyXG5cdCAgICAgICAgYW5pbWF0aW9uU3BlZWQ6IDIwMCwgLy8gQW5pbWF0aW9uIGluIHNwZWVkIChtcylcclxuXHQgICAgICAgIHNjcm9sbFRyaWdnZXI6IGZhbHNlLCAvLyBTZXQgYSBjdXN0b20gdHJpZ2dlcmluZyBlbGVtZW50LiBDYW4gYmUgYW4gSFRNTCBzdHJpbmcgb3IgalF1ZXJ5IG9iamVjdFxyXG5cdFx0XHRcdFx0Ly9zY3JvbGxUYXJnZXQ6IGZhbHNlLCAvLyBTZXQgYSBjdXN0b20gdGFyZ2V0IGVsZW1lbnQgZm9yIHNjcm9sbGluZyB0byB0aGUgdG9wXHJcblx0ICAgICAgICBzY3JvbGxUZXh0OiAnPGkgY2xhc3M9XCJmYSBmYS1hbmdsZS11cFwiPjwvaT4nLCAvLyBUZXh0IGZvciBlbGVtZW50LCBjYW4gY29udGFpbiBIVE1MXHJcblx0ICAgICAgICBzY3JvbGxUaXRsZTogZmFsc2UsIC8vIFNldCBhIGN1c3RvbSA8YT4gdGl0bGUgaWYgcmVxdWlyZWQuXHJcblx0ICAgICAgICBzY3JvbGxJbWc6IGZhbHNlLCAvLyBTZXQgdHJ1ZSB0byB1c2UgaW1hZ2VcclxuXHQgICAgICAgIGFjdGl2ZU92ZXJsYXk6IGZhbHNlLCAvLyBTZXQgQ1NTIGNvbG9yIHRvIGRpc3BsYXkgc2Nyb2xsVXAgYWN0aXZlIHBvaW50LCBlLmcgJyMwMEZGRkYnXHJcblx0ICAgICAgICB6SW5kZXg6IDIxNDc0ODM2NDcgLy8gWi1JbmRleCBmb3IgdGhlIG92ZXJsYXlcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG59KTtcclxuXHJcblxyXG5cclxuJChkb2N1bWVudCkub24oJ2NsaWNrJywnLm1hcmtldC1maWx0ZXInLGZ1bmN0aW9uKGUpe1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRjYXRhbG9nby5hZGRfZmlsdGVyX3RvX21hcmtlZCgkKHRoaXMpKTsgICAgXHJcblx0Y2F0YWxvZ28ucmVsb2FkX2NhdGFsb2dvKCk7XHJcbn0pO1xyXG5cclxuJChkb2N1bWVudCkub24oJ2NsaWNrJywnLmFkZC10by1jYXJ0JyxmdW5jdGlvbihlKXtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0Y2F0YWxvZ28uaGFuZGxlX2FkZF90b19jYXJ0KCQodGhpcykpOyAgICBcclxufSk7XHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcucmVtb3ZlLWZyb20tY2FydCcsZnVuY3Rpb24oZSl7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGNhdGFsb2dvLmhhbmRsZV9yZW1vdmVfZnJvbV9jYXJ0KCQodGhpcykpOyAgICBcclxufSk7XHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcuYWRkLXRvLXdsaXN0JyxmdW5jdGlvbihlKXtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0Y2F0YWxvZ28uaGFuZGxlX2FkZF90b193bGlzdCgkKHRoaXMpKTsgICAgXHJcbn0pO1xyXG5cclxuJChkb2N1bWVudCkub24oJ2NsaWNrJywnLnJlbW92ZS1mcm9tLXdsaXN0JyxmdW5jdGlvbihlKXtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0Y2F0YWxvZ28uaGFuZGxlX3JlbW92ZV9mcm9tX3dsaXN0KCQodGhpcykpOyAgICBcclxufSk7XHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcuY2FydF9xdWFudGl0eV91cCwgLmNhcnRfcXVhbnRpdHlfZG93biwgLmFkZC10by1jYXJ0MicsZnVuY3Rpb24oZSl7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGNhdGFsb2dvLnVwZGF0ZV9jYW50aWRhZF9pdGVtKCQodGhpcykpOyAgICBcclxuXHRcclxufSk7XHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcjbWFpbi1pbWFnZW4tcHJvZHVjdG8gaDMnLGZ1bmN0aW9uKGUpe1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRjYXRhbG9nby5oYW5kbGVfem9vbV9pbWFnZW4oJCh0aGlzKSk7ICAgIFxyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5pbWFnZW4tcHJvZHVjdG8nLGZ1bmN0aW9uKGUpe1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRjYXRhbG9nby5oYW5kbGVfcmVwbGFjZV9pbWFnZW4oJCh0aGlzKSk7ICAgIFxyXG59KTtcclxuXHJcbi8vb24gc2Nyb2xsIGdldHMgd2hlbiBib3R0b20gb2YgdGhlIHBhZ2UgaXMgcmVhY2hlZCBhbmQgY2FsbHMgdGhlIGZ1bmN0aW9uIGRvIGxvYWQgbW9yZSBjb250ZW50XHJcbiQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oZSl7XHJcblx0Ly9Ob3QgYWx3YXlzIHRoZSBwb3MgPT0gaCBzdGF0ZW1lbnQgaXMgdmVyaWZpZWQsIGV4cGVjaWFsbHkgb24gbW9iaWxlIGRldmljZXMsIHRoYXQncyB3aHkgYSAzMDBweCBvZiBtYXJnaW4gYXJlIGFzc3VtZWQuXHJcblx0aWYoJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgJCh3aW5kb3cpLmhlaWdodCgpID49ICQoZG9jdW1lbnQpLmhlaWdodCgpIC0gMzAwKSB7XHJcblx0XHR1dGlscy5sb2coXCJGaW5hbCBkZSBww6FnaW5hIGFsY2FuemFkb1wiKTtcclxuXHRcdGlmKCQoJyNtYXJrZXQtY2F0YWxvZ28nKS5sZW5ndGgpXHJcblx0XHRcdGNhdGFsb2dvLnJlZnJlc2hfY2F0YWxvZ28oKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gbWFpbigpe1xyXG5cdGNhdGFsb2dvLnJlbG9hZF9jYXRhbG9nbygpO1xyXG5cdGZybXMuaGFuZGxlX2xvZ2luX3N1Ym1pdCgpO1xyXG5cdGZybXMuaGFuZGxlX3JlZ2lzdGVyX3N1Ym1pdCgpO1xyXG5cdGZybXMuaGFuZGxlX3BhZ29fY2MoKTtcclxuXHRmcm1zLmhhbmRsZV9lbnRyZWdhX3N1Ym1pdCgpO1xyXG5cdGZybXMuaGFuZGxlX3Byb2R1Y3RfcmV2aWV3X3N1Ym1pdCgpO1xyXG5cdGNhdGFsb2dvLmxvYWRfZGVzdGFjYWRvcygpO1xyXG59XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShtYWluKTtcclxuIiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpLFxyXG5cdGN0bGc9cmVxdWlyZSgnLi9jYXRhbG9nbycpO1xyXG5tb2R1bGUuZXhwb3J0cz17XHJcblx0aGFuZGxlX2xvZ2luX3N1Ym1pdCA6ZnVuY3Rpb24gKCl7XHJcblx0XHQgJCgnZm9ybSNmb3JtLWxvZ2lubWFya2V0JykuZmluZCgnLmVycm9ycycpLmhpZGUoKTtcclxuXHRcdCAkKCcjZm9ybS1sb2dpbm1hcmtldCcpLnZhbGlkYXRlKHtcclxuXHQgICAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uIChmb3JtKVxyXG5cdCAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsIFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogICQoJyNmb3JtLWxvZ2lubWFya2V0JykuYXR0ciggXCJhY3Rpb25cIiApLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6ICAkKCAnI2Zvcm0tbG9naW5tYXJrZXQnICkuc2VyaWFsaXplKCksIFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsIFxyXG5cdFx0ICAgICAgICAgICAgYmVmb3JlU2VuZDpmdW5jdGlvbigpe1xyXG5cdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS52YWwoJ1Byb2Nlc2FuZG8uLi4nKTtcclxuXHRcdCAgICAgICAgICAgIH0sXHJcblx0XHQgICAgICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XHJcblx0XHQgICAgICAgICAgICAgIGlmKCFkYXRhLmVycm9yKXtcclxuXHRcdCAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0JywnX3NlbGYnKTtcclxuXHRcdCAgICAgICAgICAgICAgXHRuZXcgUE5vdGlmeSh7XHJcblx0XHQgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQmllbnZlbmlkbyEnLFxyXG5cdFx0ICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1zZyxcclxuXHRcdCAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nLFxyXG5cdFx0ICAgICAgICAgICAgICAgICAgICBkZWxheTogNTAwXHJcblx0XHQgICAgICAgICAgICAgICAgfSk7XHJcblx0XHQgICAgICAgICAgICAgIFxyXG5cdFx0ICAgICAgICAgICAgICB9ZWxzZXtcclxuXHRcdCAgICAgICAgICAgICAgICAkKCcjZm9ybS1sb2dpbm1hcmtldCcpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGRhdGEubXNnKTsgXHJcblx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnZhbCgnR3VhcmRhcicpO1xyXG5cdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdCAgICAgICAgICAgICAgfVxyXG5cdFx0ICAgICAgICAgICAgfSxcclxuXHRcdCAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKGpxWEhSLHRleHRTdGF0dXMsZXJyb3JUaHJvd24pe1xyXG5cdFx0ICAgICAgICAgICAgICAkKCcjZm9ybS1sb2dpbm1hcmtldCcpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGpxWEhSLnN0YXR1cysnICcrdGV4dFN0YXR1cyk7XHJcblx0XHQgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuXHQgICAgICAgIH0sXHJcblx0ICAgICAgICBlcnJvckxhYmVsQ29udGFpbmVyOiBcIiNlcnJvcl9tZXNzYWdlX2JveFwiLFxyXG5cdCAgICAgICAgd3JhcHBlcjogXCJsaVwiLFxyXG5cdCAgICAgICAgcnVsZXM6XHJcblx0ICAgICAgICAgICAgICAgIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiBcInJlcXVpcmVkXCIsXHJcblx0ICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogXCJyZXF1aXJlZFwiLFxyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgIH0pO1xyXG5cdH0sXHJcblx0aGFuZGxlX3JlZ2lzdGVyX3N1Ym1pdCA6ZnVuY3Rpb24gKCl7XHJcblx0XHQgJCgnI2Zvcm0tcmVnaXN0ZXJtYXJrZXQnKS5maW5kKCcuZXJyb3JzJykuaGlkZSgpO1xyXG5cdFx0ICQoJyNmb3JtLXJlZ2lzdGVybWFya2V0JykudmFsaWRhdGUoe1xyXG5cdCAgICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKGZvcm0pXHJcblx0ICAgICAgICB7XHJcblx0ICAgICAgICAgICAgICAgICQuYWpheCh7XHJcblx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsIFxyXG5cdCAgICAgICAgICAgICAgICAgICAgdXJsOiAgJCgnI2Zvcm0tcmVnaXN0ZXJtYXJrZXQnKS5hdHRyKCBcImFjdGlvblwiICksXHJcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhOiAgJCggJyNmb3JtLXJlZ2lzdGVybWFya2V0JyApLnNlcmlhbGl6ZSgpLCBcclxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsIFxyXG5cdFx0XHQgICAgICAgICAgICBiZWZvcmVTZW5kOmZ1bmN0aW9uKCl7XHJcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS52YWwoJ1Byb2Nlc2FuZG8uLi4nKTtcclxuXHRcdFx0ICAgICAgICAgICAgfSxcclxuXHRcdFx0ICAgICAgICAgICAgc3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHQgICAgICAgICAgICAgIGlmKCFkYXRhLmVycm9yKXtcclxuXHRcdFx0ICAgICAgICAgICAgICBcdG5ldyBQTm90aWZ5KHtcclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0JpZW52ZW5pZG8hJyxcclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1zZyxcclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5mbydcclxuXHRcdFx0ICAgICAgICAgICAgICAgIH0pO1xyXG5cdFx0XHQgICAgICAgICAgICAgICB3aW5kb3cub3Blbih1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL21hcmtldCcsJ19zZWxmJyk7XHJcblx0XHRcdCAgICAgICAgICAgICAgXHJcblx0XHRcdCAgICAgICAgICAgICAgfWVsc2V7XHJcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjZm9ybS1yZWdpc3Rlcm1hcmtldCcpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGRhdGEubXNnKTsgXHJcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdHdWFyZGFyJyk7XHJcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdCAgICAgICAgICAgICAgfVxyXG5cdFx0XHQgICAgICAgICAgICB9LFxyXG5cdFx0XHQgICAgICAgICAgICBlcnJvcjpmdW5jdGlvbihqcVhIUix0ZXh0U3RhdHVzLGVycm9yVGhyb3duKXtcclxuXHRcdFx0ICAgICAgICAgICAgICAgJCgnI2Zvcm0tcmVnaXN0ZXJtYXJrZXQnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChqcVhIUi5zdGF0dXMrJyAnK3RleHRTdGF0dXMpO1xyXG5cdFx0XHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIH0pXHJcblx0ICAgICAgICB9LFxyXG5cdCAgICAgICAgZXJyb3JMYWJlbENvbnRhaW5lcjogXCIjZXJyb3JfbWVzc2FnZV9ib3hcIixcclxuXHQgICAgICAgIHdyYXBwZXI6IFwibGlcIixcclxuXHQgICAgICAgIHJ1bGVzOlxyXG5cdCAgICAgICAgICAgICAgICB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBmaXJzdF9uYW1lOiBcInJlcXVpcmVkXCIsXHJcblx0ICAgICAgICAgICAgICAgICAgICBlbWFpbDogXCJyZXF1aXJlZFwiLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6IFwicmVxdWlyZWRcIixcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICB9KTtcclxuXHR9LFxyXG5cdGhhbmRsZV9wYWdvX2NjIDpmdW5jdGlvbiAoKXtcclxuXHRcdCAkKCcjZm9ybS1wYWdvLWNjJykuZmluZCgnLmVycm9ycycpLmhpZGUoKTtcclxuXHRcdCAkKCcjZm9ybS1wYWdvLWNjJykudmFsaWRhdGUoe1xyXG5cdCAgICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKGZvcm0pXHJcblx0ICAgICAgICB7XHJcblxyXG5cdCAgICAgICAgICAgICAgICAkLmFqYXgoe1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLCBcclxuXHQgICAgICAgICAgICAgICAgICAgIHVybDogICQoJyNmb3JtLXBhZ28tY2MnKS5hdHRyKCBcImFjdGlvblwiICksXHJcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhOiAgJCggJyNmb3JtLXBhZ28tY2MnICkuc2VyaWFsaXplKCksIFxyXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJywgXHJcblx0ICAgICAgICAgICAgICAgICAgICBhc3luYzpmYWxzZSxcclxuXHRcdFx0ICAgICAgICAgICAgYmVmb3JlU2VuZDpmdW5jdGlvbigpe1xyXG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXRfY2MnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0X2NjJykudmFsKCdQcm9jZXNhbmRvLi4uJyk7XHJcblx0XHRcdCAgICAgICAgICAgIH0sXHJcblx0XHRcdCAgICAgICAgICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0ICAgICAgICAgICAgICBpZighZGF0YS5lcnJvcil7XHJcblx0XHRcdCAgICAgICAgICAgICAgXHRjdGxnLmNsZWFyX2NhcnQoKTtcclxuXHRcdFx0ICAgICAgICAgICAgICAgd2luZG93Lm9wZW4odXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9DYXJ0cy9maW5hbGl6YXInLCdfc2VsZicpO1xyXG5cdFx0XHQgICAgICAgICAgICAgIFxyXG5cdFx0XHQgICAgICAgICAgICAgIH1lbHNle1xyXG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI2Zvcm0tcGFnby1jYycpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGRhdGEubXNnKTsgXHJcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0X2NjJykudmFsKCdHdWFyZGFyJyk7XHJcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0X2NjJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdCAgICAgICAgICAgICAgfVxyXG5cdFx0XHQgICAgICAgICAgICB9LFxyXG5cdFx0XHQgICAgICAgICAgICBlcnJvcjpmdW5jdGlvbihqcVhIUix0ZXh0U3RhdHVzLGVycm9yVGhyb3duKXtcclxuXHRcdFx0ICAgICAgICAgICAgXHR1dGlscy5sb2coanFYSFIpO1xyXG5cdFx0XHQgICAgICAgICAgICBcdHV0aWxzLmxvZyh0ZXh0U3RhdHVzKTtcclxuXHRcdFx0ICAgICAgICAgICAgXHR1dGlscy5sb2coZXJyb3JUaHJvd24pO1xyXG5cdFx0XHQgICAgICAgICAgICAgICAkKCcjZm9ybS1wYWdvLWNjJykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoanFYSFIuc3RhdHVzKycgJyt0ZXh0U3RhdHVzKTtcclxuXHRcdFx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICB9KVxyXG5cdCAgICAgICAgfSxcclxuXHQgICAgICAgIGVycm9yTGFiZWxDb250YWluZXI6IFwiI2Vycm9yX21lc3NhZ2VfYm94XCIsXHJcblx0ICAgICAgICB3cmFwcGVyOiBcImxpXCIsXHJcblx0ICAgICAgICBydWxlczpcclxuXHQgICAgICAgICAgICAgICAge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgY3JlZGl0X2NhcmQ6IFwicmVxdWlyZWRcIixcclxuXHQgICAgICAgICAgICAgICAgICAgIFwiY2FyZC1udW1iZXJcIjogXCJyZXF1aXJlZFwiLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgXCJleHBpcnktbW9udGhcIjogXCJyZXF1aXJlZFwiLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgXCJleHBpcnkteWVhclwiOiBcInJlcXVpcmVkXCIsXHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgfSk7XHJcblx0fSxcclxuXHRoYW5kbGVfZW50cmVnYV9zdWJtaXQgOmZ1bmN0aW9uICgpe1xyXG5cdFx0ICQoJyNmb3JtLWVudHJlZ2EnKS5maW5kKCcuZXJyb3JzJykuaGlkZSgpO1xyXG5cdFx0ICQoJyNmb3JtLWVudHJlZ2EnKS52YWxpZGF0ZSh7XHJcblx0ICAgICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoZm9ybSlcclxuXHQgICAgICAgIHtcclxuXHQgICAgICAgICAgICAgICAgJC5hamF4KHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJywgXHJcblx0ICAgICAgICAgICAgICAgICAgICB1cmw6ICAkKCcjZm9ybS1lbnRyZWdhJykuYXR0ciggXCJhY3Rpb25cIiApLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YTogICQoICcjZm9ybS1lbnRyZWdhJyApLnNlcmlhbGl6ZSgpLCBcclxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsIFxyXG5cdFx0XHQgICAgICAgICAgICBiZWZvcmVTZW5kOmZ1bmN0aW9uKCl7XHJcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS52YWwoJ1Byb2Nlc2FuZG8uLi4nKTtcclxuXHRcdFx0ICAgICAgICAgICAgfSxcclxuXHRcdFx0ICAgICAgICAgICAgc3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHQgICAgICAgICAgICAgIGlmKCFkYXRhLmVycm9yKXtcclxuXHRcdFx0ICAgICAgICAgICAgICBcdG5ldyBQTm90aWZ5KHtcclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0luZm9ybWFjacOzbiBhY3R1YWxpemFkYSEnLFxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEubXNnLFxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJ1xyXG5cdFx0XHQgICAgICAgICAgICAgICAgfSk7XHJcblx0XHRcdCAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvQ2FydHMvcGFnbycsJ19zZWxmJyk7XHJcblx0XHRcdCAgICAgICAgICAgICAgXHJcblx0XHRcdCAgICAgICAgICAgICAgfWVsc2V7XHJcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjZm9ybS1lbnRyZWdhJykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoZGF0YS5tc2cpOyBcclxuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS52YWwoJ0d1YXJkYXInKTtcclxuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0ICAgICAgICAgICAgICB9XHJcblx0XHRcdCAgICAgICAgICAgIH0sXHJcblx0XHRcdCAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKGpxWEhSLHRleHRTdGF0dXMsZXJyb3JUaHJvd24pe1xyXG5cdFx0XHQgICAgICAgICAgICAgICAkKCcjZm9ybS1lbnRyZWdhJykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoanFYSFIuc3RhdHVzKycgJyt0ZXh0U3RhdHVzKTtcclxuXHRcdFx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICB9KVxyXG5cdCAgICAgICAgfSxcclxuXHQgICAgICAgIGVycm9yTGFiZWxDb250YWluZXI6IFwiI2Vycm9yX21lc3NhZ2VfYm94XCIsXHJcblx0ICAgICAgICB3cmFwcGVyOiBcImxpXCIsXHJcblx0ICAgICAgICBydWxlczpcclxuXHQgICAgICAgICAgICAgICAge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgZmlyc3RfbmFtZTogXCJyZXF1aXJlZFwiLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgbGFzdF9uYW1lOiBcInJlcXVpcmVkXCIsXHJcblx0ICAgICAgICAgICAgICAgICAgICBhZGRyZXNzXzE6IFwicmVxdWlyZWRcIixcclxuXHQgICAgICAgICAgICAgICAgICAgIHBob25lX251bWJlcjogXCJyZXF1aXJlZFwiLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgZW1haWw6IFwicmVxdWlyZWRcIixcclxuXHQgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBcInJlcXVpcmVkXCIsXHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgfSk7XHJcblx0fSxcclxuXHRoYW5kbGVfcHJvZHVjdF9yZXZpZXdfc3VibWl0IDpmdW5jdGlvbiAoKXtcclxuXHRcdCAkKCcjZm9ybS1wcm9kdWN0cmV2aWV3JykuZmluZCgnLmVycm9ycycpLmhpZGUoKTtcclxuXHRcdCAkKCcjZm9ybS1wcm9kdWN0cmV2aWV3JykudmFsaWRhdGUoe1xyXG5cdCAgICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKGZvcm0pXHJcblx0ICAgICAgICB7XHJcblx0ICAgICAgICAgICAgICAgICQuYWpheCh7XHJcblx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsIFxyXG5cdCAgICAgICAgICAgICAgICAgICAgdXJsOiAgJCgnI2Zvcm0tcHJvZHVjdHJldmlldycpLmF0dHIoIFwiYWN0aW9uXCIgKSxcclxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGE6ICAkKCAnI2Zvcm0tcHJvZHVjdHJldmlldycgKS5zZXJpYWxpemUoKSwgXHJcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCBcclxuXHRcdFx0ICAgICAgICAgICAgYmVmb3JlU2VuZDpmdW5jdGlvbigpe1xyXG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdQcm9jZXNhbmRvLi4uJyk7XHJcblx0XHRcdCAgICAgICAgICAgIH0sXHJcblx0XHRcdCAgICAgICAgICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0ICAgICAgICAgICAgICBpZighZGF0YS5lcnJvcil7XHJcblx0XHRcdCAgICAgICAgICAgICAgXHQkY29udGVuZWRvciA9ICQoJyNwcm9kdWN0cmV2aWV3cycpO1xyXG5cdFx0XHRcdFx0XHRcdCQucG9zdCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL21hcmtldC9nZXRfcmV2aWV3Jyx7J0lEJzpkYXRhLklEfSxmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0JGNvbnRlbmVkb3IucHJlcGVuZChkYXRhKTtcclxuXHRcdFx0XHRcdFx0XHR9LCd0ZXh0Jyk7XHJcblx0XHRcdFx0XHRcdFx0JCgnI2Zvcm0tcHJvZHVjdHJldmlldycpLnRyaWdnZXIoJ3Jlc2V0Jyk7XHJcblx0XHRcdCAgICAgICAgICAgICAgfWVsc2V7XHJcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjZm9ybS1wcm9kdWN0cmV2aWV3JykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoZGF0YS5tc2cpOyBcclxuXHRcdFx0ICAgICAgICAgICAgICB9XHJcblx0XHRcdCAgICAgICAgICAgIH0sXHJcblx0XHRcdCAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKGpxWEhSLHRleHRTdGF0dXMsZXJyb3JUaHJvd24pe1xyXG5cdFx0XHQgICAgICAgICAgICAgICAkKCcjZm9ybS1lbnRyZWdhJykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoanFYSFIuc3RhdHVzKycgJyt0ZXh0U3RhdHVzKTtcclxuXHRcdFx0ICAgICAgICAgICAgfSxcclxuXHRcdFx0ICAgICAgICAgICAgY29tcGxldGU6ZnVuY3Rpb24oKXtcclxuXHRcdFx0ICAgICAgICAgICAgXHQkKCcjc3VibWl0JykudmFsKCdHdWFyZGFyJyk7XHJcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgfSlcclxuXHQgICAgICAgIH0sXHJcblx0ICAgICAgICBlcnJvckxhYmVsQ29udGFpbmVyOiBcIiNlcnJvcl9tZXNzYWdlX2JveFwiLFxyXG5cdCAgICAgICAgd3JhcHBlcjogXCJsaVwiLFxyXG5cdCAgICAgICAgcnVsZXM6XHJcblx0ICAgICAgICAgICAgICAgIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIG5vbWJyZTogXCJyZXF1aXJlZFwiLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgZW1haWw6IFwicmVxdWlyZWRcIixcclxuXHQgICAgICAgICAgICAgICAgICAgIGRldGFsbGU6IFwicmVxdWlyZWRcIixcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICB9KTtcclxuXHR9LFxyXG59IiwibW9kdWxlLmV4cG9ydHM9e1xyXG5cdGxvZzogZnVuY3Rpb24oc3RyaW5nKXtcclxuXHRcdGlmKGNvbnNvbGUpIGNvbnNvbGUubG9nKHN0cmluZyk7XHJcblx0fSxcclxuXHQvL09idGllbmUgdW4gYXJyYXkgY29uIHRvZG9zIGxvcyBzZWdtZXRvcyBkZSBsYSBVUkxcclxuXHRnZXRCYXNlUGF0aCA6IGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgcG9ydCA9IHdpbmRvdy5sb2NhdGlvbi5wb3J0O1xyXG5cdFx0dmFyIHBhdGhBcnJheSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnLycpO1xyXG5cdFx0dmFyIGFwcGxpY2FjaW9uID0gKHdpbmRvdy5sb2NhdGlvbi5ob3N0ID09PSBcIjEyNy4wLjAuMVwiIHx8IHdpbmRvdy5sb2NhdGlvbi5ob3N0ID09PSBcImxvY2FsaG9zdFwiIHx8IHdpbmRvdy5sb2NhdGlvbi5ob3N0LmluZGV4T2YoJzE5Mi4xNjguJykgIT09IC0xKSA/IHBhdGhBcnJheVsxXSA6ICcnO1xyXG5cdFx0aWYocG9ydD09PVwiMzAwMFwiKXtcclxuXHRcdFx0YXBwbGljYWNpb24gPSBhcHBsaWNhY2lvbisncG9zLyc7XHJcblx0XHR9XHJcblx0XHRpZiAoIXdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pXHJcblx0XHRcdHJldHVybiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArIFwiL1wiICsgYXBwbGljYWNpb247XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBhcHBsaWNhY2lvbjtcclxuXHR9XHJcbn0iXX0=
