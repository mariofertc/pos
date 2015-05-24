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
		var filters={'categoria':[],'precios':[],'talla':[],'color':[],'tag':[]};
		$.each($('.market-filter'),function(index, el) {
			if($(el).hasClass('active')){
				filters[$(el).attr('tipo')].push($(el).attr('filter'));
			}
		});
		filters.precios=$('#sl2').val();
		var ult = $('.features_items .product-image-wrapper:last');
		filters.ultimo = ult.index('.product-image-wrapper');
		filters.nombre = $('#search_input').val();
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
			utils.setEstaCargando(false);
		});
	},
	refresh_catalogo :function (){
		var filtros = this.get_filters();
		$.get(utils.getBasePath()+'/web/market/catalogo',filtros, function(data) {
			if(data!=""){
				if(filtros.ultimo == -1){
					$('#market-catalogo').html(data).animate({opaccity:0.8}, 500);
				}else{
					$('#market-catalogo').animate({opacity:0.6}, 500).append(data).animate({opacity:1}, 200);
				}
			}
			utils.setEstaCargando(false);
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

utils.setEstaCargando(false);
//on scroll gets when bottom of the page is reached and calls the function do load more content
$(window).scroll(function(e){
	//Not always the pos == h statement is verified, expecially on mobile devices, that's why a 300px of margin are assumed.
	if($(window).scrollTop() + $(window).height() >= $(document).height() - 300) {
		utils.log("Final de página alcanzado");
		if($('#market-catalogo').length && (!utils.estaCargando())){
			catalogo.refresh_catalogo();
		}
		utils.setEstaCargando(true);
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

	$('#search_input').keyup(function(e) {
		catalogo.reload_catalogo();
	});
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
			                    text: data.message,
			                    type: 'info'
			                });
			               window.open(utils.getBasePath()+'/web/Carts/pago','_self');
			              
			              }else{
			                $('#form-entrega').find('.errors').fadeIn('slow').html(data.message); 
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
var esta_cargando=false;
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
	},
	estaCargando:function(){
		return esta_cargando;
	},
	setEstaCargando:function(valor){
		esta_cargando=valor;
	}
}
},{}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxmZXJcXFByb3llY3Rvc1xcUE9TXFxwb3NcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkQ6L2Zlci9Qcm95ZWN0b3MvUE9TL3Bvcy9hc3NldHMvd2ViL2pzL2Rldi9jYXRhbG9nby5qcyIsIkQ6L2Zlci9Qcm95ZWN0b3MvUE9TL3Bvcy9hc3NldHMvd2ViL2pzL2Rldi9mYWtlX2M0MDgwNWMzLmpzIiwiRDovZmVyL1Byb3llY3Rvcy9QT1MvcG9zL2Fzc2V0cy93ZWIvanMvZGV2L2Zvcm11bGFyaW9zLmpzIiwiRDovZmVyL1Byb3llY3Rvcy9QT1MvcG9zL2Fzc2V0cy93ZWIvanMvZGV2L3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG5cdGZybXM9cmVxdWlyZSgnLi9mb3JtdWxhcmlvcycpO1xyXG5tb2R1bGUuZXhwb3J0cz17XHJcblx0YWRkX2ZpbHRlcl90b19tYXJrZWQgOiBmdW5jdGlvbiAoZmlsdHJvKXtcclxuXHRcdCRidG4gID0gJChmaWx0cm8pO1xyXG5cdCAgICAkYnRuLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKVxyXG5cdFx0aWYoJGJ0bi5jc3MoJ29wYWNpdHknKT09MSl7XHJcblx0XHRcdCRidG4uYW5pbWF0ZSh7J29wYWNpdHknOjAuNX0sIDIwMCk7XHJcblx0XHR9ZWxzZXsgXHJcblx0XHRcdCRidG4uYW5pbWF0ZSh7J29wYWNpdHknOjF9LCAyMDApO1xyXG5cdFx0fVxyXG5cdCAgICAvL0HDsWFkZSBsYSBjYXRlZ29yaWEgc2VsZWNjaW9uYWRhIGFsIGRpdiBkZSBmaWx0cm8gYXBsaWNhZG9zXHJcblx0XHQvKiRmaWx0cm9zID0gJCgnLm1hcmtldC1hcHBsaWVkLWZpbHRlcnMnKTtcclxuXHRcdCRmaWx0cm9zLmZpbmQoJ1tmaWx0ZXI9XCInKyQoZmlsdHJvKS5hdHRyKCdmaWx0ZXInKSsnXCJdJykucmVtb3ZlKCk7XHJcblx0XHQkbGkgPSQoJzxsaT48L2xpPicpO1xyXG5cdFx0JGxpLmF0dHIoJ3RpcG8nLCQoZmlsdHJvKS5hdHRyKCd0aXBvJykpO1xyXG5cdFx0JGxpLmF0dHIoJ2ZpbHRlcicsJChmaWx0cm8pLmF0dHIoJ2ZpbHRlcicpKTtcclxuXHRcdCRsaS5odG1sKCQoZmlsdHJvKS5hdHRyKCdmaWx0ZXInKSk7XHJcblx0XHQkZmlsdHJvcy5hcHBlbmQoJGxpKTsqL1xyXG5cdH0sXHJcblx0Z2V0X2ZpbHRlcnMgOmZ1bmN0aW9uICgpe1xyXG5cdFx0dmFyIGZpbHRlcnM9eydjYXRlZ29yaWEnOltdLCdwcmVjaW9zJzpbXSwndGFsbGEnOltdLCdjb2xvcic6W10sJ3RhZyc6W119O1xyXG5cdFx0JC5lYWNoKCQoJy5tYXJrZXQtZmlsdGVyJyksZnVuY3Rpb24oaW5kZXgsIGVsKSB7XHJcblx0XHRcdGlmKCQoZWwpLmhhc0NsYXNzKCdhY3RpdmUnKSl7XHJcblx0XHRcdFx0ZmlsdGVyc1skKGVsKS5hdHRyKCd0aXBvJyldLnB1c2goJChlbCkuYXR0cignZmlsdGVyJykpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdGZpbHRlcnMucHJlY2lvcz0kKCcjc2wyJykudmFsKCk7XHJcblx0XHR2YXIgdWx0ID0gJCgnLmZlYXR1cmVzX2l0ZW1zIC5wcm9kdWN0LWltYWdlLXdyYXBwZXI6bGFzdCcpO1xyXG5cdFx0ZmlsdGVycy51bHRpbW8gPSB1bHQuaW5kZXgoJy5wcm9kdWN0LWltYWdlLXdyYXBwZXInKTtcclxuXHRcdGZpbHRlcnMubm9tYnJlID0gJCgnI3NlYXJjaF9pbnB1dCcpLnZhbCgpO1xyXG5cdFx0Y29uc29sZS5sb2coZmlsdGVycy50b1NvdXJjZSgpKTtcclxuXHRcdHJldHVybiBmaWx0ZXJzO1xyXG5cdH0sXHJcblx0bG9hZF9kZXN0YWNhZG9zIDogZnVuY3Rpb24oKXtcclxuXHRcdCQoJyNtYXJrZXQtZGVzdGFjYWRvcycpLmxvYWQodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9tYXJrZXQvZGVzdGFjYWRvcycpO1xyXG5cdH0sXHJcblx0cmVsb2FkX2NhdGFsb2dvIDpmdW5jdGlvbiAoKXtcclxuXHRcdHZhciBmaWx0cm9zID0gdGhpcy5nZXRfZmlsdGVycygpO1xyXG5cdFx0ZmlsdHJvcy51bHRpbW89LTE7XHJcblx0XHQkLmdldCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL21hcmtldC9jYXRhbG9nbycsZmlsdHJvcywgZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0XHRpZihkYXRhIT1cIlwiKXtcclxuXHRcdFx0XHQkKCcjbWFya2V0LWNhdGFsb2dvJykuaHRtbChkYXRhKS5hbmltYXRlKHtvcGFjY2l0eTowLjh9LCA1MDApO1xyXG5cdFx0XHR9XHJcblx0XHRcdHV0aWxzLnNldEVzdGFDYXJnYW5kbyhmYWxzZSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdHJlZnJlc2hfY2F0YWxvZ28gOmZ1bmN0aW9uICgpe1xyXG5cdFx0dmFyIGZpbHRyb3MgPSB0aGlzLmdldF9maWx0ZXJzKCk7XHJcblx0XHQkLmdldCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL21hcmtldC9jYXRhbG9nbycsZmlsdHJvcywgZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0XHRpZihkYXRhIT1cIlwiKXtcclxuXHRcdFx0XHRpZihmaWx0cm9zLnVsdGltbyA9PSAtMSl7XHJcblx0XHRcdFx0XHQkKCcjbWFya2V0LWNhdGFsb2dvJykuaHRtbChkYXRhKS5hbmltYXRlKHtvcGFjY2l0eTowLjh9LCA1MDApO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0JCgnI21hcmtldC1jYXRhbG9nbycpLmFuaW1hdGUoe29wYWNpdHk6MC42fSwgNTAwKS5hcHBlbmQoZGF0YSkuYW5pbWF0ZSh7b3BhY2l0eToxfSwgMjAwKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0dXRpbHMuc2V0RXN0YUNhcmdhbmRvKGZhbHNlKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0aGFuZGxlX2FkZF90b193bGlzdDogZnVuY3Rpb24oaXRlbSl7XHJcblx0XHQkcHJvZHVjdG8gPSAkKGl0ZW0pO1xyXG5cdFx0dmFyIGlkX3Byb2R1Y3RvID0gJHByb2R1Y3RvLmF0dHIoJ2hyZWYnKTtcclxuXHRcdCQucG9zdCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL1dsaXN0L2FkZF90b193bGlzdCcseydwcm9kdWN0byc6aWRfcHJvZHVjdG99LGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRpZighZGF0YS5lcnJvcil7XHJcblx0XHRcdCBuZXcgUE5vdGlmeSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQcm9kdWN0byBhZ3JlZ2FkbyEnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEubXNnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJyxcclxuXHRcdCAgICAgICAgICAgIGRlbGF5OiAyMDBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQgQ3VzdG9tYm94Lm9wZW4oe1xyXG5cdCAgICAgICAgICAgICAgICB0YXJnZXQ6IGRhdGEubXNnLFxyXG5cdCAgICAgICAgICAgICAgICBlZmZlY3Q6ICdmYWRlaW4nLFxyXG5cdCAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdCBmcm1zLmhhbmRsZV9sb2dpbl9zdWJtaXQoKTtcclxuXHRcdFx0XHRcdCBmcm1zLmhhbmRsZV9yZWdpc3Rlcl9zdWJtaXQoKTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9LCdqc29uJyk7XHJcblx0fSxcclxuXHRoYW5kbGVfcmVtb3ZlX2Zyb21fd2xpc3Q6IGZ1bmN0aW9uKGl0ZW0pe1xyXG5cdFx0JHRoaXM9dGhpcztcclxuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XHJcblx0XHR2YXIgaWRfcHJvZHVjdG8gPSAkcHJvZHVjdG8uYXR0cignaHJlZicpO1xyXG5cdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvV2xpc3QvcmVtb3ZlX2Zyb21fd2xpc3QnLHsncHJvZHVjdG8nOmlkX3Byb2R1Y3RvfSxmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0aWYoIWRhdGEuZXJyb3Ipe1xyXG5cdFx0XHRcdCRwcm9kdWN0by5wYXJlbnRzKCd0cicpLmZhZGVPdXQoJ3Nsb3cnKS5yZW1vdmUoKTtcclxuXHRcdFx0XHQgbmV3IFBOb3RpZnkoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvZHVjdG9yIHJldGlyYWRvIScsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nLFxyXG5cdFx0ICAgICAgICAgICAgZGVsYXk6IDIwMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblx0XHRcdH1cclxuXHRcdH0sJ2pzb24nKTtcclxuXHR9LFxyXG5cdGhhbmRsZV9hZGRfdG9fY2FydDogZnVuY3Rpb24oaXRlbSl7XHJcblx0XHQkcHJvZHVjdG8gPSAkKGl0ZW0pO1xyXG5cdFx0dmFyIGlkX3Byb2R1Y3RvID0gJHByb2R1Y3RvLmF0dHIoJ2hyZWYnKTtcclxuXHRcdCQucG9zdCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL0NhcnRzL2FkZF90b19jYXJ0Jyx7J3Byb2R1Y3RvJzppZF9wcm9kdWN0b30sZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdGlmKCFkYXRhLmVycm9yKXtcclxuXHRcdFx0IG5ldyBQTm90aWZ5KHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Byb2R1Y3RvIGFncmVnYWRvIScsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nLFxyXG5cdFx0ICAgICAgICAgICAgZGVsYXk6IDIwMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdCBDdXN0b21ib3gub3Blbih7XHJcblx0ICAgICAgICAgICAgICAgIHRhcmdldDogZGF0YS5tc2csXHJcblx0ICAgICAgICAgICAgICAgIGVmZmVjdDogJ2ZhZGVpbicsXHJcblx0ICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0IGZybXMuaGFuZGxlX2xvZ2luX3N1Ym1pdCgpO1xyXG5cdFx0XHRcdFx0IGZybXMuaGFuZGxlX3JlZ2lzdGVyX3N1Ym1pdCgpO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9LCdqc29uJyk7XHJcblx0fSxcclxuXHRoYW5kbGVfcmVtb3ZlX2Zyb21fY2FydDogZnVuY3Rpb24oaXRlbSl7XHJcblx0XHQkdGhpcz10aGlzO1xyXG5cdFx0JHByb2R1Y3RvID0gJChpdGVtKTtcclxuXHRcdHZhciBpZF9wcm9kdWN0byA9ICRwcm9kdWN0by5hdHRyKCdocmVmJyk7XHJcblx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9DYXJ0cy9yZW1vdmVfZnJvbV9jYXJ0Jyx7J3Byb2R1Y3RvJzppZF9wcm9kdWN0b30sZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdGlmKCFkYXRhLmVycm9yKXtcclxuXHRcdFx0XHQkcHJvZHVjdG8ucGFyZW50cygndHInKS5mYWRlT3V0KCdzbG93JykucmVtb3ZlKCk7XHJcblx0XHRcdFx0JHRoaXMuc3VidG90YWxfY2FydCgpO1xyXG5cdFx0XHRcdG5ldyBQTm90aWZ5KHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Byb2R1Y3RvciByZXRpcmFkbyEnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEubXNnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJyxcclxuXHRcdCAgICAgICAgICAgIGRlbGF5OiAyMDBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9LCdqc29uJyk7XHJcblx0fSxcclxuXHRoYW5kbGVfem9vbV9pbWFnZW46IGZ1bmN0aW9uKGl0ZW0pe1xyXG5cdFx0JHRoaXM9dGhpcztcclxuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XHJcblx0XHRDdXN0b21ib3gub3Blbih7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ6ICcjbWFpbi1pbWFnZW4tcHJvZHVjdG8nLFxyXG4gICAgICAgICAgICAgICAgZWZmZWN0OiAnZmFkZWluJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHR9LFxyXG5cdGhhbmRsZV9yZXBsYWNlX2ltYWdlbjogZnVuY3Rpb24oaXRlbSl7XHJcblx0XHQkdGhpcz10aGlzO1xyXG5cdFx0JHByb2R1Y3RvID0gJChpdGVtKTtcclxuXHRcdCRjb250ZW5lZG9yID0gJCgnI21haW4taW1hZ2VuLXByb2R1Y3RvJyk7XHJcblx0XHQkaW1hZ2VuID0gJHByb2R1Y3RvLmZpbmQoJ2ltZycpO1xyXG5cdFx0Ly8kY29udGVuZWRvci5maW5kKCdpbWcnKT0kaW1hZ2VuO1xyXG5cclxuXHR9LFxyXG5cdGNsZWFyX2NhcnQ6ZnVuY3Rpb24oKXtcclxuXHRcdCR0aGlzPXRoaXM7XHJcblx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9DYXJ0cy9jbGVhcl9jYXJ0Jyx7fSxmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0aWYoIWRhdGEuZXJyb3Ipe1xyXG5cdFx0XHRcdCR0aGlzLnN1YnRvdGFsX2NhcnQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSwnanNvbicpO1xyXG5cdH0sXHJcblx0c3VidG90YWxfaXRlbTpmdW5jdGlvbih0cil7XHJcblx0XHQkdHIgPSAgJCh0cik7XHJcblx0XHR2YXIgcHJlY2lvID0gcGFyc2VGbG9hdCgkdHIuZmluZCgnLmNhcnRfcHJpY2UgcCBzcGFuJykuaHRtbCgpKTtcclxuXHRcdHZhciBjYW50aWRhZCA9IHBhcnNlSW50KCR0ci5maW5kKCcuY2FydF9xdWFudGl0eV9pbnB1dCcpLnZhbCgpKTtcclxuXHRcdHZhciByZXN1bHRhZG8gPSAkdHIuZmluZCgnLmNhcnRfdG90YWxfcHJpY2Ugc3BhbicpO1xyXG5cdFx0cmVzdWx0YWRvLmh0bWwocHJlY2lvKmNhbnRpZGFkKTtcclxuXHR9LFxyXG5cdHN1YnRvdGFsX2NhcnQ6ZnVuY3Rpb24oKXtcclxuXHRcdHZhciBhY3VtdWxhZG9yPTA7XHJcblx0XHQkLmVhY2goJCgnI2l0ZW1zLWNhcnJpdG8gdHInKSwgZnVuY3Rpb24oaW5kZXgsIHZhbCkge1xyXG5cdFx0XHQgJGl0ZW0gPSAkKHZhbCk7XHJcblxyXG5cdFx0XHQgdmFyIHN1YnRvdGFsID0gcGFyc2VGbG9hdCgkaXRlbS5maW5kKCcuY2FydF90b3RhbF9wcmljZSBzcGFuJykuaHRtbCgpKTtcclxuXHRcdFx0IGFjdW11bGFkb3IrPXN1YnRvdGFsO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHZhciBzdWJ0b3RhbF9jYXJ0ID0gJCgnI2NhcnQtc3VidG90YWwgc3BhbicpO1xyXG5cdFx0c3VidG90YWxfY2FydC5odG1sKGFjdW11bGFkb3IpO1xyXG5cclxuXHRcdHZhciB0b3RhbF9jYXJ0ID0gJCgnI2NhcnQtdG90YWwgc3BhbicpO1xyXG5cdFx0dG90YWxfY2FydC5odG1sKGFjdW11bGFkb3IpO1xyXG5cdH0sXHJcblx0dXBkYXRlX2NhbnRpZGFkX2l0ZW06IGZ1bmN0aW9uKGl0ZW0pe1xyXG5cdFx0JHRoaXM9dGhpcztcclxuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XHJcblx0XHR2YXIgaWRfcHJvZHVjdG8gPSAkcHJvZHVjdG8uYXR0cignaHJlZicpO1xyXG5cdFx0dmFyIGNhbnRpZGFkID0gcGFyc2VJbnQoJHByb2R1Y3RvLmF0dHIoJ3ZhbCcpKTtcclxuXHJcblx0XHQkaW5wdXQgPSAkcHJvZHVjdG8uc2libGluZ3MoJy5jYXJ0X3F1YW50aXR5X2lucHV0Jyk7XHJcblx0XHR2YXIgdmFsb3IgPSBwYXJzZUludCgkaW5wdXQudmFsKCkpO1xyXG5cdFx0dmFyIHRvdGFsID0gdmFsb3IrY2FudGlkYWQ7XHJcblx0XHRpZih0b3RhbD4wKVxyXG5cdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvQ2FydHMvYWRkX3RvX2NhcnQnLHsncHJvZHVjdG8nOmlkX3Byb2R1Y3RvLCdjYW50aWRhZCc6dG90YWx9LGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRpZighZGF0YS5lcnJvcil7XHJcblx0XHRcdFx0aWYoY2FudGlkYWQ9PTApe1xyXG5cdFx0XHRcdFx0bmV3IFBOb3RpZnkoe1xyXG5cdFx0ICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvZHVjdG8gYWdyZWdhZG8hJyxcclxuXHRcdCAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1zZyxcclxuXHRcdCAgICAgICAgICAgICAgICB0eXBlOiAnaW5mbycsXHJcblx0XHRcdCAgICAgICAgICAgIGRlbGF5OiAyMDBcclxuXHRcdCAgICAgICAgICAgIH0pO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0JGlucHV0LnZhbCh0b3RhbCk7XHJcblx0XHRcdFx0XHQkdGhpcy5zdWJ0b3RhbF9pdGVtKCRpbnB1dC5wYXJlbnRzKCd0cicpKTtcclxuXHRcdFx0XHRcdCR0aGlzLnN1YnRvdGFsX2NhcnQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdCBDdXN0b21ib3gub3Blbih7XHJcblx0ICAgICAgICAgICAgICAgIHRhcmdldDogZGF0YS5tc2csXHJcblx0ICAgICAgICAgICAgICAgIGVmZmVjdDogJ2ZhZGVpbicsXHJcblx0ICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0IGZybXMuaGFuZGxlX2xvZ2luX3N1Ym1pdCgpO1xyXG5cdFx0XHRcdFx0IGZybXMuaGFuZGxlX3JlZ2lzdGVyX3N1Ym1pdCgpO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfSk7XHJcblx0XHRcdH1cclxuXHRcdH0sJ2pzb24nKTtcclxuXHR9XHJcbn0iLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyksXHJcbiBjYXRhbG9nbyA9IHJlcXVpcmUoJy4vY2F0YWxvZ28nKSxcclxuIGZybXMgPSByZXF1aXJlKCcuL2Zvcm11bGFyaW9zJyk7XHJcblxyXG51dGlscy5sb2codXRpbHMuZ2V0QmFzZVBhdGgoKSk7IFxyXG4vKnByaWNlIHJhbmdlKi9cclxuJCgnI3NsMicpLnNsaWRlcigpLm9uKCdzbGlkZScsZnVuY3Rpb24oKXtjYXRhbG9nby5yZWxvYWRfY2F0YWxvZ28oKX0pO1xyXG5cclxuLypzY3JvbGwgdG8gdG9wKi9cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuXHQkKGZ1bmN0aW9uICgpIHtcclxuXHRcdCQuc2Nyb2xsVXAoe1xyXG5cdCAgICAgICAgc2Nyb2xsTmFtZTogJ3Njcm9sbFVwJywgLy8gRWxlbWVudCBJRFxyXG5cdCAgICAgICAgc2Nyb2xsRGlzdGFuY2U6IDMwMCwgLy8gRGlzdGFuY2UgZnJvbSB0b3AvYm90dG9tIGJlZm9yZSBzaG93aW5nIGVsZW1lbnQgKHB4KVxyXG5cdCAgICAgICAgc2Nyb2xsRnJvbTogJ3RvcCcsIC8vICd0b3AnIG9yICdib3R0b20nXHJcblx0ICAgICAgICBzY3JvbGxTcGVlZDogMzAwLCAvLyBTcGVlZCBiYWNrIHRvIHRvcCAobXMpXHJcblx0ICAgICAgICBlYXNpbmdUeXBlOiAnbGluZWFyJywgLy8gU2Nyb2xsIHRvIHRvcCBlYXNpbmcgKHNlZSBodHRwOi8vZWFzaW5ncy5uZXQvKVxyXG5cdCAgICAgICAgYW5pbWF0aW9uOiAnZmFkZScsIC8vIEZhZGUsIHNsaWRlLCBub25lXHJcblx0ICAgICAgICBhbmltYXRpb25TcGVlZDogMjAwLCAvLyBBbmltYXRpb24gaW4gc3BlZWQgKG1zKVxyXG5cdCAgICAgICAgc2Nyb2xsVHJpZ2dlcjogZmFsc2UsIC8vIFNldCBhIGN1c3RvbSB0cmlnZ2VyaW5nIGVsZW1lbnQuIENhbiBiZSBhbiBIVE1MIHN0cmluZyBvciBqUXVlcnkgb2JqZWN0XHJcblx0XHRcdFx0XHQvL3Njcm9sbFRhcmdldDogZmFsc2UsIC8vIFNldCBhIGN1c3RvbSB0YXJnZXQgZWxlbWVudCBmb3Igc2Nyb2xsaW5nIHRvIHRoZSB0b3BcclxuXHQgICAgICAgIHNjcm9sbFRleHQ6ICc8aSBjbGFzcz1cImZhIGZhLWFuZ2xlLXVwXCI+PC9pPicsIC8vIFRleHQgZm9yIGVsZW1lbnQsIGNhbiBjb250YWluIEhUTUxcclxuXHQgICAgICAgIHNjcm9sbFRpdGxlOiBmYWxzZSwgLy8gU2V0IGEgY3VzdG9tIDxhPiB0aXRsZSBpZiByZXF1aXJlZC5cclxuXHQgICAgICAgIHNjcm9sbEltZzogZmFsc2UsIC8vIFNldCB0cnVlIHRvIHVzZSBpbWFnZVxyXG5cdCAgICAgICAgYWN0aXZlT3ZlcmxheTogZmFsc2UsIC8vIFNldCBDU1MgY29sb3IgdG8gZGlzcGxheSBzY3JvbGxVcCBhY3RpdmUgcG9pbnQsIGUuZyAnIzAwRkZGRidcclxuXHQgICAgICAgIHpJbmRleDogMjE0NzQ4MzY0NyAvLyBaLUluZGV4IGZvciB0aGUgb3ZlcmxheVxyXG5cdFx0fSk7XHJcblx0fSk7XHJcbn0pO1xyXG5cclxuXHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcubWFya2V0LWZpbHRlcicsZnVuY3Rpb24oZSl7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGNhdGFsb2dvLmFkZF9maWx0ZXJfdG9fbWFya2VkKCQodGhpcykpOyAgICBcclxuXHRjYXRhbG9nby5yZWxvYWRfY2F0YWxvZ28oKTtcclxufSk7XHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcuYWRkLXRvLWNhcnQnLGZ1bmN0aW9uKGUpe1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRjYXRhbG9nby5oYW5kbGVfYWRkX3RvX2NhcnQoJCh0aGlzKSk7ICAgIFxyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5yZW1vdmUtZnJvbS1jYXJ0JyxmdW5jdGlvbihlKXtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0Y2F0YWxvZ28uaGFuZGxlX3JlbW92ZV9mcm9tX2NhcnQoJCh0aGlzKSk7ICAgIFxyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5hZGQtdG8td2xpc3QnLGZ1bmN0aW9uKGUpe1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRjYXRhbG9nby5oYW5kbGVfYWRkX3RvX3dsaXN0KCQodGhpcykpOyAgICBcclxufSk7XHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcucmVtb3ZlLWZyb20td2xpc3QnLGZ1bmN0aW9uKGUpe1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRjYXRhbG9nby5oYW5kbGVfcmVtb3ZlX2Zyb21fd2xpc3QoJCh0aGlzKSk7ICAgIFxyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5jYXJ0X3F1YW50aXR5X3VwLCAuY2FydF9xdWFudGl0eV9kb3duLCAuYWRkLXRvLWNhcnQyJyxmdW5jdGlvbihlKXtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0Y2F0YWxvZ28udXBkYXRlX2NhbnRpZGFkX2l0ZW0oJCh0aGlzKSk7ICAgIFxyXG5cdFxyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJyNtYWluLWltYWdlbi1wcm9kdWN0byBoMycsZnVuY3Rpb24oZSl7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGNhdGFsb2dvLmhhbmRsZV96b29tX2ltYWdlbigkKHRoaXMpKTsgICAgXHJcbn0pO1xyXG5cclxuJChkb2N1bWVudCkub24oJ2NsaWNrJywnLmltYWdlbi1wcm9kdWN0bycsZnVuY3Rpb24oZSl7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGNhdGFsb2dvLmhhbmRsZV9yZXBsYWNlX2ltYWdlbigkKHRoaXMpKTsgICAgXHJcbn0pO1xyXG5cclxudXRpbHMuc2V0RXN0YUNhcmdhbmRvKGZhbHNlKTtcclxuLy9vbiBzY3JvbGwgZ2V0cyB3aGVuIGJvdHRvbSBvZiB0aGUgcGFnZSBpcyByZWFjaGVkIGFuZCBjYWxscyB0aGUgZnVuY3Rpb24gZG8gbG9hZCBtb3JlIGNvbnRlbnRcclxuJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbihlKXtcclxuXHQvL05vdCBhbHdheXMgdGhlIHBvcyA9PSBoIHN0YXRlbWVudCBpcyB2ZXJpZmllZCwgZXhwZWNpYWxseSBvbiBtb2JpbGUgZGV2aWNlcywgdGhhdCdzIHdoeSBhIDMwMHB4IG9mIG1hcmdpbiBhcmUgYXNzdW1lZC5cclxuXHRpZigkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyAkKHdpbmRvdykuaGVpZ2h0KCkgPj0gJChkb2N1bWVudCkuaGVpZ2h0KCkgLSAzMDApIHtcclxuXHRcdHV0aWxzLmxvZyhcIkZpbmFsIGRlIHDDoWdpbmEgYWxjYW56YWRvXCIpO1xyXG5cdFx0aWYoJCgnI21hcmtldC1jYXRhbG9nbycpLmxlbmd0aCAmJiAoIXV0aWxzLmVzdGFDYXJnYW5kbygpKSl7XHJcblx0XHRcdGNhdGFsb2dvLnJlZnJlc2hfY2F0YWxvZ28oKTtcclxuXHRcdH1cclxuXHRcdHV0aWxzLnNldEVzdGFDYXJnYW5kbyh0cnVlKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gbWFpbigpe1xyXG5cdGNhdGFsb2dvLnJlbG9hZF9jYXRhbG9nbygpO1xyXG5cdGZybXMuaGFuZGxlX2xvZ2luX3N1Ym1pdCgpO1xyXG5cdGZybXMuaGFuZGxlX3JlZ2lzdGVyX3N1Ym1pdCgpO1xyXG5cdGZybXMuaGFuZGxlX3BhZ29fY2MoKTtcclxuXHRmcm1zLmhhbmRsZV9lbnRyZWdhX3N1Ym1pdCgpO1xyXG5cdGZybXMuaGFuZGxlX3Byb2R1Y3RfcmV2aWV3X3N1Ym1pdCgpO1xyXG5cdGNhdGFsb2dvLmxvYWRfZGVzdGFjYWRvcygpO1xyXG5cclxuXHQkKCcjc2VhcmNoX2lucHV0Jykua2V5dXAoZnVuY3Rpb24oZSkge1xyXG5cdFx0Y2F0YWxvZ28ucmVsb2FkX2NhdGFsb2dvKCk7XHJcblx0fSk7XHJcbn1cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KG1haW4pOyIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKSxcclxuXHRjdGxnPXJlcXVpcmUoJy4vY2F0YWxvZ28nKTtcclxubW9kdWxlLmV4cG9ydHM9e1xyXG5cdGhhbmRsZV9sb2dpbl9zdWJtaXQgOmZ1bmN0aW9uICgpe1xyXG5cdFx0ICQoJ2Zvcm0jZm9ybS1sb2dpbm1hcmtldCcpLmZpbmQoJy5lcnJvcnMnKS5oaWRlKCk7XHJcblx0XHQgJCgnI2Zvcm0tbG9naW5tYXJrZXQnKS52YWxpZGF0ZSh7XHJcblx0ICAgICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoZm9ybSlcclxuXHQgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLCBcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICAkKCcjZm9ybS1sb2dpbm1hcmtldCcpLmF0dHIoIFwiYWN0aW9uXCIgKSxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiAgJCggJyNmb3JtLWxvZ2lubWFya2V0JyApLnNlcmlhbGl6ZSgpLCBcclxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCBcclxuXHRcdCAgICAgICAgICAgIGJlZm9yZVNlbmQ6ZnVuY3Rpb24oKXtcclxuXHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdQcm9jZXNhbmRvLi4uJyk7XHJcblx0XHQgICAgICAgICAgICB9LFxyXG5cdFx0ICAgICAgICAgICAgc3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0ICAgICAgICAgICAgICBpZighZGF0YS5lcnJvcil7XHJcblx0XHQgICAgICAgICAgICAgICB3aW5kb3cub3Blbih1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL21hcmtldCcsJ19zZWxmJyk7XHJcblx0XHQgICAgICAgICAgICAgIFx0bmV3IFBOb3RpZnkoe1xyXG5cdFx0ICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0JpZW52ZW5pZG8hJyxcclxuXHRcdCAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXHJcblx0XHQgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJyxcclxuXHRcdCAgICAgICAgICAgICAgICAgICAgZGVsYXk6IDUwMFxyXG5cdFx0ICAgICAgICAgICAgICAgIH0pO1xyXG5cdFx0ICAgICAgICAgICAgICBcclxuXHRcdCAgICAgICAgICAgICAgfWVsc2V7XHJcblx0XHQgICAgICAgICAgICAgICAgJCgnI2Zvcm0tbG9naW5tYXJrZXQnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChkYXRhLm1zZyk7IFxyXG5cdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS52YWwoJ0d1YXJkYXInKTtcclxuXHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHQgICAgICAgICAgICAgIH1cclxuXHRcdCAgICAgICAgICAgIH0sXHJcblx0XHQgICAgICAgICAgICBlcnJvcjpmdW5jdGlvbihqcVhIUix0ZXh0U3RhdHVzLGVycm9yVGhyb3duKXtcclxuXHRcdCAgICAgICAgICAgICAgJCgnI2Zvcm0tbG9naW5tYXJrZXQnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChqcVhIUi5zdGF0dXMrJyAnK3RleHRTdGF0dXMpO1xyXG5cdFx0ICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcblx0ICAgICAgICB9LFxyXG5cdCAgICAgICAgZXJyb3JMYWJlbENvbnRhaW5lcjogXCIjZXJyb3JfbWVzc2FnZV9ib3hcIixcclxuXHQgICAgICAgIHdyYXBwZXI6IFwibGlcIixcclxuXHQgICAgICAgIHJ1bGVzOlxyXG5cdCAgICAgICAgICAgICAgICB7XHJcblx0ICAgICAgICAgICAgICAgICAgICB1c2VybmFtZTogXCJyZXF1aXJlZFwiLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6IFwicmVxdWlyZWRcIixcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICB9KTtcclxuXHR9LFxyXG5cdGhhbmRsZV9yZWdpc3Rlcl9zdWJtaXQgOmZ1bmN0aW9uICgpe1xyXG5cdFx0ICQoJyNmb3JtLXJlZ2lzdGVybWFya2V0JykuZmluZCgnLmVycm9ycycpLmhpZGUoKTtcclxuXHRcdCAkKCcjZm9ybS1yZWdpc3Rlcm1hcmtldCcpLnZhbGlkYXRlKHtcclxuXHQgICAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uIChmb3JtKVxyXG5cdCAgICAgICAge1xyXG5cdCAgICAgICAgICAgICAgICAkLmFqYXgoe1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLCBcclxuXHQgICAgICAgICAgICAgICAgICAgIHVybDogICQoJyNmb3JtLXJlZ2lzdGVybWFya2V0JykuYXR0ciggXCJhY3Rpb25cIiApLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YTogICQoICcjZm9ybS1yZWdpc3Rlcm1hcmtldCcgKS5zZXJpYWxpemUoKSwgXHJcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCBcclxuXHRcdFx0ICAgICAgICAgICAgYmVmb3JlU2VuZDpmdW5jdGlvbigpe1xyXG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdQcm9jZXNhbmRvLi4uJyk7XHJcblx0XHRcdCAgICAgICAgICAgIH0sXHJcblx0XHRcdCAgICAgICAgICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0ICAgICAgICAgICAgICBpZighZGF0YS5lcnJvcil7XHJcblx0XHRcdCAgICAgICAgICAgICAgXHRuZXcgUE5vdGlmeSh7XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdCaWVudmVuaWRvIScsXHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nXHJcblx0XHRcdCAgICAgICAgICAgICAgICB9KTtcclxuXHRcdFx0ICAgICAgICAgICAgICAgd2luZG93Lm9wZW4odXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9tYXJrZXQnLCdfc2VsZicpO1xyXG5cdFx0XHQgICAgICAgICAgICAgIFxyXG5cdFx0XHQgICAgICAgICAgICAgIH1lbHNle1xyXG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI2Zvcm0tcmVnaXN0ZXJtYXJrZXQnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChkYXRhLm1zZyk7IFxyXG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnZhbCgnR3VhcmRhcicpO1xyXG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHQgICAgICAgICAgICAgIH1cclxuXHRcdFx0ICAgICAgICAgICAgfSxcclxuXHRcdFx0ICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24oanFYSFIsdGV4dFN0YXR1cyxlcnJvclRocm93bil7XHJcblx0XHRcdCAgICAgICAgICAgICAgICQoJyNmb3JtLXJlZ2lzdGVybWFya2V0JykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoanFYSFIuc3RhdHVzKycgJyt0ZXh0U3RhdHVzKTtcclxuXHRcdFx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICB9KVxyXG5cdCAgICAgICAgfSxcclxuXHQgICAgICAgIGVycm9yTGFiZWxDb250YWluZXI6IFwiI2Vycm9yX21lc3NhZ2VfYm94XCIsXHJcblx0ICAgICAgICB3cmFwcGVyOiBcImxpXCIsXHJcblx0ICAgICAgICBydWxlczpcclxuXHQgICAgICAgICAgICAgICAge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgZmlyc3RfbmFtZTogXCJyZXF1aXJlZFwiLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgZW1haWw6IFwicmVxdWlyZWRcIixcclxuXHQgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBcInJlcXVpcmVkXCIsXHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgfSk7XHJcblx0fSxcclxuXHRoYW5kbGVfcGFnb19jYyA6ZnVuY3Rpb24gKCl7XHJcblx0XHQgJCgnI2Zvcm0tcGFnby1jYycpLmZpbmQoJy5lcnJvcnMnKS5oaWRlKCk7XHJcblx0XHQgJCgnI2Zvcm0tcGFnby1jYycpLnZhbGlkYXRlKHtcclxuXHQgICAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uIChmb3JtKVxyXG5cdCAgICAgICAge1xyXG5cclxuXHQgICAgICAgICAgICAgICAgJC5hamF4KHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJywgXHJcblx0ICAgICAgICAgICAgICAgICAgICB1cmw6ICAkKCcjZm9ybS1wYWdvLWNjJykuYXR0ciggXCJhY3Rpb25cIiApLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YTogICQoICcjZm9ybS1wYWdvLWNjJyApLnNlcmlhbGl6ZSgpLCBcclxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsIFxyXG5cdCAgICAgICAgICAgICAgICAgICAgYXN5bmM6ZmFsc2UsXHJcblx0XHRcdCAgICAgICAgICAgIGJlZm9yZVNlbmQ6ZnVuY3Rpb24oKXtcclxuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0X2NjJykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdF9jYycpLnZhbCgnUHJvY2VzYW5kby4uLicpO1xyXG5cdFx0XHQgICAgICAgICAgICB9LFxyXG5cdFx0XHQgICAgICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdCAgICAgICAgICAgICAgaWYoIWRhdGEuZXJyb3Ipe1xyXG5cdFx0XHQgICAgICAgICAgICAgICB3aW5kb3cub3Blbih1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL0NhcnRzL2ZpbmFsaXphcicsJ19zZWxmJyk7XHJcblx0XHRcdCAgICAgICAgICAgICAgXHJcblx0XHRcdCAgICAgICAgICAgICAgfWVsc2V7XHJcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjZm9ybS1wYWdvLWNjJykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoZGF0YS5tc2cpOyBcclxuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXRfY2MnKS52YWwoJ0d1YXJkYXInKTtcclxuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXRfY2MnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0ICAgICAgICAgICAgICB9XHJcblx0XHRcdCAgICAgICAgICAgIH0sXHJcblx0XHRcdCAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKGpxWEhSLHRleHRTdGF0dXMsZXJyb3JUaHJvd24pe1xyXG5cdFx0XHQgICAgICAgICAgICBcdHV0aWxzLmxvZyhqcVhIUik7XHJcblx0XHRcdCAgICAgICAgICAgIFx0dXRpbHMubG9nKHRleHRTdGF0dXMpO1xyXG5cdFx0XHQgICAgICAgICAgICBcdHV0aWxzLmxvZyhlcnJvclRocm93bik7XHJcblx0XHRcdCAgICAgICAgICAgICAgICQoJyNmb3JtLXBhZ28tY2MnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChqcVhIUi5zdGF0dXMrJyAnK3RleHRTdGF0dXMpO1xyXG5cdFx0XHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIH0pXHJcblx0ICAgICAgICB9LFxyXG5cdCAgICAgICAgZXJyb3JMYWJlbENvbnRhaW5lcjogXCIjZXJyb3JfbWVzc2FnZV9ib3hcIixcclxuXHQgICAgICAgIHdyYXBwZXI6IFwibGlcIixcclxuXHQgICAgICAgIHJ1bGVzOlxyXG5cdCAgICAgICAgICAgICAgICB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBjcmVkaXRfY2FyZDogXCJyZXF1aXJlZFwiLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgXCJjYXJkLW51bWJlclwiOiBcInJlcXVpcmVkXCIsXHJcblx0ICAgICAgICAgICAgICAgICAgICBcImV4cGlyeS1tb250aFwiOiBcInJlcXVpcmVkXCIsXHJcblx0ICAgICAgICAgICAgICAgICAgICBcImV4cGlyeS15ZWFyXCI6IFwicmVxdWlyZWRcIixcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICB9KTtcclxuXHR9LFxyXG5cdGhhbmRsZV9lbnRyZWdhX3N1Ym1pdCA6ZnVuY3Rpb24gKCl7XHJcblx0XHQgJCgnI2Zvcm0tZW50cmVnYScpLmZpbmQoJy5lcnJvcnMnKS5oaWRlKCk7XHJcblx0XHQgJCgnI2Zvcm0tZW50cmVnYScpLnZhbGlkYXRlKHtcclxuXHQgICAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uIChmb3JtKVxyXG5cdCAgICAgICAge1xyXG5cdCAgICAgICAgICAgICAgICAkLmFqYXgoe1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLCBcclxuXHQgICAgICAgICAgICAgICAgICAgIHVybDogICQoJyNmb3JtLWVudHJlZ2EnKS5hdHRyKCBcImFjdGlvblwiICksXHJcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhOiAgJCggJyNmb3JtLWVudHJlZ2EnICkuc2VyaWFsaXplKCksIFxyXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJywgXHJcblx0XHRcdCAgICAgICAgICAgIGJlZm9yZVNlbmQ6ZnVuY3Rpb24oKXtcclxuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnZhbCgnUHJvY2VzYW5kby4uLicpO1xyXG5cdFx0XHQgICAgICAgICAgICB9LFxyXG5cdFx0XHQgICAgICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XHJcblxyXG5cdFx0XHQgICAgICAgICAgICAgIGlmKCFkYXRhLmVycm9yKXtcclxuXHRcdFx0ICAgICAgICAgICAgICBcdG5ldyBQTm90aWZ5KHtcclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0luZm9ybWFjacOzbiBhY3R1YWxpemFkYSEnLFxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEubWVzc2FnZSxcclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5mbydcclxuXHRcdFx0ICAgICAgICAgICAgICAgIH0pO1xyXG5cdFx0XHQgICAgICAgICAgICAgICB3aW5kb3cub3Blbih1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL0NhcnRzL3BhZ28nLCdfc2VsZicpO1xyXG5cdFx0XHQgICAgICAgICAgICAgIFxyXG5cdFx0XHQgICAgICAgICAgICAgIH1lbHNle1xyXG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI2Zvcm0tZW50cmVnYScpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGRhdGEubWVzc2FnZSk7IFxyXG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnZhbCgnR3VhcmRhcicpO1xyXG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHQgICAgICAgICAgICAgIH1cclxuXHRcdFx0ICAgICAgICAgICAgfSxcclxuXHRcdFx0ICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24oanFYSFIsdGV4dFN0YXR1cyxlcnJvclRocm93bil7XHJcblx0XHRcdCAgICAgICAgICAgICAgICQoJyNmb3JtLWVudHJlZ2EnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChqcVhIUi5zdGF0dXMrJyAnK3RleHRTdGF0dXMpO1xyXG5cdFx0XHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIH0pXHJcblx0ICAgICAgICB9LFxyXG5cdCAgICAgICAgZXJyb3JMYWJlbENvbnRhaW5lcjogXCIjZXJyb3JfbWVzc2FnZV9ib3hcIixcclxuXHQgICAgICAgIHdyYXBwZXI6IFwibGlcIixcclxuXHQgICAgICAgIHJ1bGVzOlxyXG5cdCAgICAgICAgICAgICAgICB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBmaXJzdF9uYW1lOiBcInJlcXVpcmVkXCIsXHJcblx0ICAgICAgICAgICAgICAgICAgICBsYXN0X25hbWU6IFwicmVxdWlyZWRcIixcclxuXHQgICAgICAgICAgICAgICAgICAgIGFkZHJlc3NfMTogXCJyZXF1aXJlZFwiLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgcGhvbmVfbnVtYmVyOiBcInJlcXVpcmVkXCIsXHJcblx0ICAgICAgICAgICAgICAgICAgICBlbWFpbDogXCJyZXF1aXJlZFwiLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6IFwicmVxdWlyZWRcIixcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICB9KTtcclxuXHR9LFxyXG5cdGhhbmRsZV9wcm9kdWN0X3Jldmlld19zdWJtaXQgOmZ1bmN0aW9uICgpe1xyXG5cdFx0ICQoJyNmb3JtLXByb2R1Y3RyZXZpZXcnKS5maW5kKCcuZXJyb3JzJykuaGlkZSgpO1xyXG5cdFx0ICQoJyNmb3JtLXByb2R1Y3RyZXZpZXcnKS52YWxpZGF0ZSh7XHJcblx0ICAgICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoZm9ybSlcclxuXHQgICAgICAgIHtcclxuXHQgICAgICAgICAgICAgICAgJC5hamF4KHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJywgXHJcblx0ICAgICAgICAgICAgICAgICAgICB1cmw6ICAkKCcjZm9ybS1wcm9kdWN0cmV2aWV3JykuYXR0ciggXCJhY3Rpb25cIiApLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YTogICQoICcjZm9ybS1wcm9kdWN0cmV2aWV3JyApLnNlcmlhbGl6ZSgpLCBcclxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsIFxyXG5cdFx0XHQgICAgICAgICAgICBiZWZvcmVTZW5kOmZ1bmN0aW9uKCl7XHJcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS52YWwoJ1Byb2Nlc2FuZG8uLi4nKTtcclxuXHRcdFx0ICAgICAgICAgICAgfSxcclxuXHRcdFx0ICAgICAgICAgICAgc3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHQgICAgICAgICAgICAgIGlmKCFkYXRhLmVycm9yKXtcclxuXHRcdFx0ICAgICAgICAgICAgICBcdCRjb250ZW5lZG9yID0gJCgnI3Byb2R1Y3RyZXZpZXdzJyk7XHJcblx0XHRcdFx0XHRcdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0L2dldF9yZXZpZXcnLHsnSUQnOmRhdGEuSUR9LGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQkY29udGVuZWRvci5wcmVwZW5kKGRhdGEpO1xyXG5cdFx0XHRcdFx0XHRcdH0sJ3RleHQnKTtcclxuXHRcdFx0XHRcdFx0XHQkKCcjZm9ybS1wcm9kdWN0cmV2aWV3JykudHJpZ2dlcigncmVzZXQnKTtcclxuXHRcdFx0ICAgICAgICAgICAgICB9ZWxzZXtcclxuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNmb3JtLXByb2R1Y3RyZXZpZXcnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChkYXRhLm1zZyk7IFxyXG5cdFx0XHQgICAgICAgICAgICAgIH1cclxuXHRcdFx0ICAgICAgICAgICAgfSxcclxuXHRcdFx0ICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24oanFYSFIsdGV4dFN0YXR1cyxlcnJvclRocm93bil7XHJcblx0XHRcdCAgICAgICAgICAgICAgICQoJyNmb3JtLWVudHJlZ2EnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChqcVhIUi5zdGF0dXMrJyAnK3RleHRTdGF0dXMpO1xyXG5cdFx0XHQgICAgICAgICAgICB9LFxyXG5cdFx0XHQgICAgICAgICAgICBjb21wbGV0ZTpmdW5jdGlvbigpe1xyXG5cdFx0XHQgICAgICAgICAgICBcdCQoJyNzdWJtaXQnKS52YWwoJ0d1YXJkYXInKTtcclxuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICB9KVxyXG5cdCAgICAgICAgfSxcclxuXHQgICAgICAgIGVycm9yTGFiZWxDb250YWluZXI6IFwiI2Vycm9yX21lc3NhZ2VfYm94XCIsXHJcblx0ICAgICAgICB3cmFwcGVyOiBcImxpXCIsXHJcblx0ICAgICAgICBydWxlczpcclxuXHQgICAgICAgICAgICAgICAge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgbm9tYnJlOiBcInJlcXVpcmVkXCIsXHJcblx0ICAgICAgICAgICAgICAgICAgICBlbWFpbDogXCJyZXF1aXJlZFwiLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgZGV0YWxsZTogXCJyZXF1aXJlZFwiLFxyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgIH0pO1xyXG5cdH0sXHJcbn0iLCJ2YXIgZXN0YV9jYXJnYW5kbz1mYWxzZTtcclxubW9kdWxlLmV4cG9ydHM9e1xyXG5cdGxvZzogZnVuY3Rpb24oc3RyaW5nKXtcclxuXHRcdGlmKGNvbnNvbGUpIGNvbnNvbGUubG9nKHN0cmluZyk7XHJcblx0fSxcclxuXHQvL09idGllbmUgdW4gYXJyYXkgY29uIHRvZG9zIGxvcyBzZWdtZXRvcyBkZSBsYSBVUkxcclxuXHRnZXRCYXNlUGF0aCA6IGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgcG9ydCA9IHdpbmRvdy5sb2NhdGlvbi5wb3J0O1xyXG5cdFx0dmFyIHBhdGhBcnJheSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnLycpO1xyXG5cdFx0dmFyIGFwcGxpY2FjaW9uID0gKHdpbmRvdy5sb2NhdGlvbi5ob3N0ID09PSBcIjEyNy4wLjAuMVwiIHx8IHdpbmRvdy5sb2NhdGlvbi5ob3N0ID09PSBcImxvY2FsaG9zdFwiIHx8IHdpbmRvdy5sb2NhdGlvbi5ob3N0LmluZGV4T2YoJzE5Mi4xNjguJykgIT09IC0xKSA/IHBhdGhBcnJheVsxXSA6ICcnO1xyXG5cdFx0aWYocG9ydD09PVwiMzAwMFwiKXtcclxuXHRcdFx0YXBwbGljYWNpb24gPSBhcHBsaWNhY2lvbisncG9zLyc7XHJcblx0XHR9XHJcblx0XHRpZiAoIXdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pXHJcblx0XHRcdHJldHVybiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArIFwiL1wiICsgYXBwbGljYWNpb247XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBhcHBsaWNhY2lvbjtcclxuXHR9LFxyXG5cdGVzdGFDYXJnYW5kbzpmdW5jdGlvbigpe1xyXG5cdFx0cmV0dXJuIGVzdGFfY2FyZ2FuZG87XHJcblx0fSxcclxuXHRzZXRFc3RhQ2FyZ2FuZG86ZnVuY3Rpb24odmFsb3Ipe1xyXG5cdFx0ZXN0YV9jYXJnYW5kbz12YWxvcjtcclxuXHR9XHJcbn0iXX0=
