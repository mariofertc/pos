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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi92YXIvd3d3L2h0bWwvcG9zL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi92YXIvd3d3L2h0bWwvcG9zL2Fzc2V0cy93ZWIvanMvZGV2L2NhdGFsb2dvLmpzIiwiL3Zhci93d3cvaHRtbC9wb3MvYXNzZXRzL3dlYi9qcy9kZXYvZmFrZV80ZDE2MGNjOS5qcyIsIi92YXIvd3d3L2h0bWwvcG9zL2Fzc2V0cy93ZWIvanMvZGV2L2Zvcm11bGFyaW9zLmpzIiwiL3Zhci93d3cvaHRtbC9wb3MvYXNzZXRzL3dlYi9qcy9kZXYvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXHRmcm1zPXJlcXVpcmUoJy4vZm9ybXVsYXJpb3MnKTtcbm1vZHVsZS5leHBvcnRzPXtcblx0YWRkX2ZpbHRlcl90b19tYXJrZWQgOiBmdW5jdGlvbiAoZmlsdHJvKXtcblx0XHQkYnRuICA9ICQoZmlsdHJvKTtcblx0ICAgICRidG4udG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpXG5cdFx0aWYoJGJ0bi5jc3MoJ29wYWNpdHknKT09MSl7XG5cdFx0XHQkYnRuLmFuaW1hdGUoeydvcGFjaXR5JzowLjV9LCAyMDApO1xuXHRcdH1lbHNleyBcblx0XHRcdCRidG4uYW5pbWF0ZSh7J29wYWNpdHknOjF9LCAyMDApO1xuXHRcdH1cblx0ICAgIC8vQcOxYWRlIGxhIGNhdGVnb3JpYSBzZWxlY2Npb25hZGEgYWwgZGl2IGRlIGZpbHRybyBhcGxpY2Fkb3Ncblx0XHQvKiRmaWx0cm9zID0gJCgnLm1hcmtldC1hcHBsaWVkLWZpbHRlcnMnKTtcblx0XHQkZmlsdHJvcy5maW5kKCdbZmlsdGVyPVwiJyskKGZpbHRybykuYXR0cignZmlsdGVyJykrJ1wiXScpLnJlbW92ZSgpO1xuXHRcdCRsaSA9JCgnPGxpPjwvbGk+Jyk7XG5cdFx0JGxpLmF0dHIoJ3RpcG8nLCQoZmlsdHJvKS5hdHRyKCd0aXBvJykpO1xuXHRcdCRsaS5hdHRyKCdmaWx0ZXInLCQoZmlsdHJvKS5hdHRyKCdmaWx0ZXInKSk7XG5cdFx0JGxpLmh0bWwoJChmaWx0cm8pLmF0dHIoJ2ZpbHRlcicpKTtcblx0XHQkZmlsdHJvcy5hcHBlbmQoJGxpKTsqL1xuXHR9LFxuXHRnZXRfZmlsdGVycyA6ZnVuY3Rpb24gKCl7XG5cdFx0dmFyIGZpbHRlcnM9eydjYXRlZ29yaWEnOltdLCdwcmVjaW9zJzpbXX07XG5cdFx0JC5lYWNoKCQoJy5tYXJrZXQtZmlsdGVyJyksZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG5cdFx0XHRpZigkKGVsKS5oYXNDbGFzcygnYWN0aXZlJykpXG5cdFx0XHRcdGZpbHRlcnNbJChlbCkuYXR0cigndGlwbycpXS5wdXNoKCQoZWwpLmF0dHIoJ2ZpbHRlcicpKTtcblx0XHR9KTtcblx0XHRmaWx0ZXJzLnByZWNpb3M9JCgnI3NsMicpLnZhbCgpO1xuXHRcdHZhciB1bHQgPSAkKCcuZmVhdHVyZXNfaXRlbXMgLnByb2R1Y3QtaW1hZ2Utd3JhcHBlcjpsYXN0Jyk7XG5cdFx0ZmlsdGVycy51bHRpbW8gPSB1bHQuaW5kZXgoJy5wcm9kdWN0LWltYWdlLXdyYXBwZXInKTtcblx0XHRjb25zb2xlLmxvZyhmaWx0ZXJzLnRvU291cmNlKCkpO1xuXHRcdHJldHVybiBmaWx0ZXJzO1xuXHR9LFxuXHRsb2FkX2Rlc3RhY2Fkb3MgOiBmdW5jdGlvbigpe1xuXHRcdCQoJyNtYXJrZXQtZGVzdGFjYWRvcycpLmxvYWQodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9tYXJrZXQvZGVzdGFjYWRvcycpO1xuXHR9LFxuXHRyZWxvYWRfY2F0YWxvZ28gOmZ1bmN0aW9uICgpe1xuXHRcdHZhciBmaWx0cm9zID0gdGhpcy5nZXRfZmlsdGVycygpO1xuXHRcdGZpbHRyb3MudWx0aW1vPS0xO1xuXHRcdCQuZ2V0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0L2NhdGFsb2dvJyxmaWx0cm9zLCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRpZihkYXRhIT1cIlwiKXtcblx0XHRcdFx0JCgnI21hcmtldC1jYXRhbG9nbycpLmh0bWwoZGF0YSkuYW5pbWF0ZSh7b3BhY2NpdHk6MC44fSwgNTAwKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblx0cmVmcmVzaF9jYXRhbG9nbyA6ZnVuY3Rpb24gKCl7XG5cdFx0dmFyIGZpbHRyb3MgPSB0aGlzLmdldF9maWx0ZXJzKCk7XG5cdFx0JC5nZXQodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9tYXJrZXQvY2F0YWxvZ28nLGZpbHRyb3MsIGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdGlmKGRhdGEhPVwiXCIpe1xuXHRcdFx0XHRpZihmaWx0cm9zLnVsdGltbyA9PSAtMSl7XG5cdFx0XHRcdFx0JCgnI21hcmtldC1jYXRhbG9nbycpLmh0bWwoZGF0YSkuYW5pbWF0ZSh7b3BhY2NpdHk6MC44fSwgNTAwKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0JCgnI21hcmtldC1jYXRhbG9nbycpLmFwcGVuZChkYXRhKS5hbmltYXRlKHtvcGFjY2l0eTowLjh9LCA1MDApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cdGhhbmRsZV9hZGRfdG9fd2xpc3Q6IGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XG5cdFx0dmFyIGlkX3Byb2R1Y3RvID0gJHByb2R1Y3RvLmF0dHIoJ2hyZWYnKTtcblx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9XbGlzdC9hZGRfdG9fd2xpc3QnLHsncHJvZHVjdG8nOmlkX3Byb2R1Y3RvfSxmdW5jdGlvbihkYXRhKXtcblx0XHRcdGlmKCFkYXRhLmVycm9yKXtcblx0XHRcdCBuZXcgUE5vdGlmeSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvZHVjdG8gYWdyZWdhZG8hJyxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJyxcblx0XHQgICAgICAgICAgICBkZWxheTogMjAwXG4gICAgICAgICAgICAgICAgfSk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0IEN1c3RvbWJveC5vcGVuKHtcblx0ICAgICAgICAgICAgICAgIHRhcmdldDogZGF0YS5tc2csXG5cdCAgICAgICAgICAgICAgICBlZmZlY3Q6ICdmYWRlaW4nLFxuXHQgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0IGZybXMuaGFuZGxlX2xvZ2luX3N1Ym1pdCgpO1xuXHRcdFx0XHRcdCBmcm1zLmhhbmRsZV9yZWdpc3Rlcl9zdWJtaXQoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSk7XG5cdFx0XHR9XG5cdFx0fSwnanNvbicpO1xuXHR9LFxuXHRoYW5kbGVfcmVtb3ZlX2Zyb21fd2xpc3Q6IGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdCR0aGlzPXRoaXM7XG5cdFx0JHByb2R1Y3RvID0gJChpdGVtKTtcblx0XHR2YXIgaWRfcHJvZHVjdG8gPSAkcHJvZHVjdG8uYXR0cignaHJlZicpO1xuXHRcdCQucG9zdCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL1dsaXN0L3JlbW92ZV9mcm9tX3dsaXN0Jyx7J3Byb2R1Y3RvJzppZF9wcm9kdWN0b30sZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRpZighZGF0YS5lcnJvcil7XG5cdFx0XHRcdCRwcm9kdWN0by5wYXJlbnRzKCd0cicpLmZhZGVPdXQoJ3Nsb3cnKS5yZW1vdmUoKTtcblx0XHRcdFx0IG5ldyBQTm90aWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQcm9kdWN0b3IgcmV0aXJhZG8hJyxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJyxcblx0XHQgICAgICAgICAgICBkZWxheTogMjAwXG4gICAgICAgICAgICAgICAgfSk7XG5cdFx0XHR9XG5cdFx0fSwnanNvbicpO1xuXHR9LFxuXHRoYW5kbGVfYWRkX3RvX2NhcnQ6IGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XG5cdFx0dmFyIGlkX3Byb2R1Y3RvID0gJHByb2R1Y3RvLmF0dHIoJ2hyZWYnKTtcblx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9DYXJ0cy9hZGRfdG9fY2FydCcseydwcm9kdWN0byc6aWRfcHJvZHVjdG99LGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0aWYoIWRhdGEuZXJyb3Ipe1xuXHRcdFx0IG5ldyBQTm90aWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQcm9kdWN0byBhZ3JlZ2FkbyEnLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1zZyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nLFxuXHRcdCAgICAgICAgICAgIGRlbGF5OiAyMDBcbiAgICAgICAgICAgICAgICB9KTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHQgQ3VzdG9tYm94Lm9wZW4oe1xuXHQgICAgICAgICAgICAgICAgdGFyZ2V0OiBkYXRhLm1zZyxcblx0ICAgICAgICAgICAgICAgIGVmZmVjdDogJ2ZhZGVpbicsXG5cdCAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKXtcblx0XHRcdFx0XHQgZnJtcy5oYW5kbGVfbG9naW5fc3VibWl0KCk7XG5cdFx0XHRcdFx0IGZybXMuaGFuZGxlX3JlZ2lzdGVyX3N1Ym1pdCgpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9KTtcblx0XHRcdH1cblxuXHRcdH0sJ2pzb24nKTtcblx0fSxcblx0aGFuZGxlX3JlbW92ZV9mcm9tX2NhcnQ6IGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdCR0aGlzPXRoaXM7XG5cdFx0JHByb2R1Y3RvID0gJChpdGVtKTtcblx0XHR2YXIgaWRfcHJvZHVjdG8gPSAkcHJvZHVjdG8uYXR0cignaHJlZicpO1xuXHRcdCQucG9zdCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL0NhcnRzL3JlbW92ZV9mcm9tX2NhcnQnLHsncHJvZHVjdG8nOmlkX3Byb2R1Y3RvfSxmdW5jdGlvbihkYXRhKXtcblx0XHRcdGlmKCFkYXRhLmVycm9yKXtcblx0XHRcdFx0JHByb2R1Y3RvLnBhcmVudHMoJ3RyJykuZmFkZU91dCgnc2xvdycpLnJlbW92ZSgpO1xuXHRcdFx0XHQkdGhpcy5zdWJ0b3RhbF9jYXJ0KCk7XG5cdFx0XHRcdG5ldyBQTm90aWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQcm9kdWN0b3IgcmV0aXJhZG8hJyxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJyxcblx0XHQgICAgICAgICAgICBkZWxheTogMjAwXG4gICAgICAgICAgICAgICAgfSk7XG5cdFx0XHR9XG5cdFx0fSwnanNvbicpO1xuXHR9LFxuXHRoYW5kbGVfem9vbV9pbWFnZW46IGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdCR0aGlzPXRoaXM7XG5cdFx0JHByb2R1Y3RvID0gJChpdGVtKTtcblx0XHRDdXN0b21ib3gub3Blbih7XG4gICAgICAgICAgICAgICAgdGFyZ2V0OiAnI21haW4taW1hZ2VuLXByb2R1Y3RvJyxcbiAgICAgICAgICAgICAgICBlZmZlY3Q6ICdmYWRlaW4nXG4gICAgICAgICAgICB9KTtcblx0fSxcblx0aGFuZGxlX3JlcGxhY2VfaW1hZ2VuOiBmdW5jdGlvbihpdGVtKXtcblx0XHQkdGhpcz10aGlzO1xuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XG5cdFx0JGNvbnRlbmVkb3IgPSAkKCcjbWFpbi1pbWFnZW4tcHJvZHVjdG8nKTtcblx0XHQkaW1hZ2VuID0gJHByb2R1Y3RvLmZpbmQoJ2ltZycpO1xuXHRcdC8vJGNvbnRlbmVkb3IuZmluZCgnaW1nJyk9JGltYWdlbjtcblxuXHR9LFxuXHRjbGVhcl9jYXJ0OmZ1bmN0aW9uKCl7XG5cdFx0JHRoaXM9dGhpcztcblx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9DYXJ0cy9jbGVhcl9jYXJ0Jyx7fSxmdW5jdGlvbihkYXRhKXtcblx0XHRcdGlmKCFkYXRhLmVycm9yKXtcblx0XHRcdFx0JHRoaXMuc3VidG90YWxfY2FydCgpO1xuXHRcdFx0fVxuXHRcdH0sJ2pzb24nKTtcblx0fSxcblx0c3VidG90YWxfaXRlbTpmdW5jdGlvbih0cil7XG5cdFx0JHRyID0gICQodHIpO1xuXHRcdHZhciBwcmVjaW8gPSBwYXJzZUZsb2F0KCR0ci5maW5kKCcuY2FydF9wcmljZSBwIHNwYW4nKS5odG1sKCkpO1xuXHRcdHZhciBjYW50aWRhZCA9IHBhcnNlSW50KCR0ci5maW5kKCcuY2FydF9xdWFudGl0eV9pbnB1dCcpLnZhbCgpKTtcblx0XHR2YXIgcmVzdWx0YWRvID0gJHRyLmZpbmQoJy5jYXJ0X3RvdGFsX3ByaWNlIHNwYW4nKTtcblx0XHRyZXN1bHRhZG8uaHRtbChwcmVjaW8qY2FudGlkYWQpO1xuXHR9LFxuXHRzdWJ0b3RhbF9jYXJ0OmZ1bmN0aW9uKCl7XG5cdFx0dmFyIGFjdW11bGFkb3I9MDtcblx0XHQkLmVhY2goJCgnI2l0ZW1zLWNhcnJpdG8gdHInKSwgZnVuY3Rpb24oaW5kZXgsIHZhbCkge1xuXHRcdFx0ICRpdGVtID0gJCh2YWwpO1xuXG5cdFx0XHQgdmFyIHN1YnRvdGFsID0gcGFyc2VGbG9hdCgkaXRlbS5maW5kKCcuY2FydF90b3RhbF9wcmljZSBzcGFuJykuaHRtbCgpKTtcblx0XHRcdCBhY3VtdWxhZG9yKz1zdWJ0b3RhbDtcblx0XHR9KTtcblx0XHRcblx0XHR2YXIgc3VidG90YWxfY2FydCA9ICQoJyNjYXJ0LXN1YnRvdGFsIHNwYW4nKTtcblx0XHRzdWJ0b3RhbF9jYXJ0Lmh0bWwoYWN1bXVsYWRvcik7XG5cblx0XHR2YXIgdG90YWxfY2FydCA9ICQoJyNjYXJ0LXRvdGFsIHNwYW4nKTtcblx0XHR0b3RhbF9jYXJ0Lmh0bWwoYWN1bXVsYWRvcik7XG5cdH0sXG5cdHVwZGF0ZV9jYW50aWRhZF9pdGVtOiBmdW5jdGlvbihpdGVtKXtcblx0XHQkdGhpcz10aGlzO1xuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XG5cdFx0dmFyIGlkX3Byb2R1Y3RvID0gJHByb2R1Y3RvLmF0dHIoJ2hyZWYnKTtcblx0XHR2YXIgY2FudGlkYWQgPSBwYXJzZUludCgkcHJvZHVjdG8uYXR0cigndmFsJykpO1xuXG5cdFx0JGlucHV0ID0gJHByb2R1Y3RvLnNpYmxpbmdzKCcuY2FydF9xdWFudGl0eV9pbnB1dCcpO1xuXHRcdHZhciB2YWxvciA9IHBhcnNlSW50KCRpbnB1dC52YWwoKSk7XG5cdFx0dmFyIHRvdGFsID0gdmFsb3IrY2FudGlkYWQ7XG5cdFx0aWYodG90YWw+MClcblx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9DYXJ0cy9hZGRfdG9fY2FydCcseydwcm9kdWN0byc6aWRfcHJvZHVjdG8sJ2NhbnRpZGFkJzp0b3RhbH0sZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRpZighZGF0YS5lcnJvcil7XG5cdFx0XHRcdGlmKGNhbnRpZGFkPT0wKXtcblx0XHRcdFx0XHRuZXcgUE5vdGlmeSh7XG5cdFx0ICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvZHVjdG8gYWdyZWdhZG8hJyxcblx0XHQgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXG5cdFx0ICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJyxcblx0XHRcdCAgICAgICAgICAgIGRlbGF5OiAyMDBcblx0XHQgICAgICAgICAgICB9KTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0JGlucHV0LnZhbCh0b3RhbCk7XG5cdFx0XHRcdFx0JHRoaXMuc3VidG90YWxfaXRlbSgkaW5wdXQucGFyZW50cygndHInKSk7XG5cdFx0XHRcdFx0JHRoaXMuc3VidG90YWxfY2FydCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0IEN1c3RvbWJveC5vcGVuKHtcblx0ICAgICAgICAgICAgICAgIHRhcmdldDogZGF0YS5tc2csXG5cdCAgICAgICAgICAgICAgICBlZmZlY3Q6ICdmYWRlaW4nLFxuXHQgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0IGZybXMuaGFuZGxlX2xvZ2luX3N1Ym1pdCgpO1xuXHRcdFx0XHRcdCBmcm1zLmhhbmRsZV9yZWdpc3Rlcl9zdWJtaXQoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSk7XG5cdFx0XHR9XG5cdFx0fSwnanNvbicpO1xuXHR9XG59IiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpLFxyXG4gY2F0YWxvZ28gPSByZXF1aXJlKCcuL2NhdGFsb2dvJyksXHJcbiBmcm1zID0gcmVxdWlyZSgnLi9mb3JtdWxhcmlvcycpO1xyXG5cclxudXRpbHMubG9nKHV0aWxzLmdldEJhc2VQYXRoKCkpOyBcclxuLypwcmljZSByYW5nZSovXHJcbiQoJyNzbDInKS5zbGlkZXIoKS5vbignc2xpZGUnLGZ1bmN0aW9uKCl7Y2F0YWxvZ28ucmVsb2FkX2NhdGFsb2dvKCl9KTtcclxuXHJcbi8qc2Nyb2xsIHRvIHRvcCovXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcblx0JChmdW5jdGlvbiAoKSB7XHJcblx0XHQkLnNjcm9sbFVwKHtcclxuXHQgICAgICAgIHNjcm9sbE5hbWU6ICdzY3JvbGxVcCcsIC8vIEVsZW1lbnQgSURcclxuXHQgICAgICAgIHNjcm9sbERpc3RhbmNlOiAzMDAsIC8vIERpc3RhbmNlIGZyb20gdG9wL2JvdHRvbSBiZWZvcmUgc2hvd2luZyBlbGVtZW50IChweClcclxuXHQgICAgICAgIHNjcm9sbEZyb206ICd0b3AnLCAvLyAndG9wJyBvciAnYm90dG9tJ1xyXG5cdCAgICAgICAgc2Nyb2xsU3BlZWQ6IDMwMCwgLy8gU3BlZWQgYmFjayB0byB0b3AgKG1zKVxyXG5cdCAgICAgICAgZWFzaW5nVHlwZTogJ2xpbmVhcicsIC8vIFNjcm9sbCB0byB0b3AgZWFzaW5nIChzZWUgaHR0cDovL2Vhc2luZ3MubmV0LylcclxuXHQgICAgICAgIGFuaW1hdGlvbjogJ2ZhZGUnLCAvLyBGYWRlLCBzbGlkZSwgbm9uZVxyXG5cdCAgICAgICAgYW5pbWF0aW9uU3BlZWQ6IDIwMCwgLy8gQW5pbWF0aW9uIGluIHNwZWVkIChtcylcclxuXHQgICAgICAgIHNjcm9sbFRyaWdnZXI6IGZhbHNlLCAvLyBTZXQgYSBjdXN0b20gdHJpZ2dlcmluZyBlbGVtZW50LiBDYW4gYmUgYW4gSFRNTCBzdHJpbmcgb3IgalF1ZXJ5IG9iamVjdFxyXG5cdFx0XHRcdFx0Ly9zY3JvbGxUYXJnZXQ6IGZhbHNlLCAvLyBTZXQgYSBjdXN0b20gdGFyZ2V0IGVsZW1lbnQgZm9yIHNjcm9sbGluZyB0byB0aGUgdG9wXHJcblx0ICAgICAgICBzY3JvbGxUZXh0OiAnPGkgY2xhc3M9XCJmYSBmYS1hbmdsZS11cFwiPjwvaT4nLCAvLyBUZXh0IGZvciBlbGVtZW50LCBjYW4gY29udGFpbiBIVE1MXHJcblx0ICAgICAgICBzY3JvbGxUaXRsZTogZmFsc2UsIC8vIFNldCBhIGN1c3RvbSA8YT4gdGl0bGUgaWYgcmVxdWlyZWQuXHJcblx0ICAgICAgICBzY3JvbGxJbWc6IGZhbHNlLCAvLyBTZXQgdHJ1ZSB0byB1c2UgaW1hZ2VcclxuXHQgICAgICAgIGFjdGl2ZU92ZXJsYXk6IGZhbHNlLCAvLyBTZXQgQ1NTIGNvbG9yIHRvIGRpc3BsYXkgc2Nyb2xsVXAgYWN0aXZlIHBvaW50LCBlLmcgJyMwMEZGRkYnXHJcblx0ICAgICAgICB6SW5kZXg6IDIxNDc0ODM2NDcgLy8gWi1JbmRleCBmb3IgdGhlIG92ZXJsYXlcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG59KTtcclxuXHJcblxyXG5cclxuJChkb2N1bWVudCkub24oJ2NsaWNrJywnLm1hcmtldC1maWx0ZXInLGZ1bmN0aW9uKGUpe1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRjYXRhbG9nby5hZGRfZmlsdGVyX3RvX21hcmtlZCgkKHRoaXMpKTsgICAgXHJcblx0Y2F0YWxvZ28ucmVsb2FkX2NhdGFsb2dvKCk7XHJcbn0pO1xyXG5cclxuJChkb2N1bWVudCkub24oJ2NsaWNrJywnLmFkZC10by1jYXJ0JyxmdW5jdGlvbihlKXtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0Y2F0YWxvZ28uaGFuZGxlX2FkZF90b19jYXJ0KCQodGhpcykpOyAgICBcclxufSk7XHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcucmVtb3ZlLWZyb20tY2FydCcsZnVuY3Rpb24oZSl7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGNhdGFsb2dvLmhhbmRsZV9yZW1vdmVfZnJvbV9jYXJ0KCQodGhpcykpOyAgICBcclxufSk7XHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcuYWRkLXRvLXdsaXN0JyxmdW5jdGlvbihlKXtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0Y2F0YWxvZ28uaGFuZGxlX2FkZF90b193bGlzdCgkKHRoaXMpKTsgICAgXHJcbn0pO1xyXG5cclxuJChkb2N1bWVudCkub24oJ2NsaWNrJywnLnJlbW92ZS1mcm9tLXdsaXN0JyxmdW5jdGlvbihlKXtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0Y2F0YWxvZ28uaGFuZGxlX3JlbW92ZV9mcm9tX3dsaXN0KCQodGhpcykpOyAgICBcclxufSk7XHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcuY2FydF9xdWFudGl0eV91cCwgLmNhcnRfcXVhbnRpdHlfZG93biwgLmFkZC10by1jYXJ0MicsZnVuY3Rpb24oZSl7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGNhdGFsb2dvLnVwZGF0ZV9jYW50aWRhZF9pdGVtKCQodGhpcykpOyAgICBcclxuXHRcclxufSk7XHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcjbWFpbi1pbWFnZW4tcHJvZHVjdG8gaDMnLGZ1bmN0aW9uKGUpe1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRjYXRhbG9nby5oYW5kbGVfem9vbV9pbWFnZW4oJCh0aGlzKSk7ICAgIFxyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5pbWFnZW4tcHJvZHVjdG8nLGZ1bmN0aW9uKGUpe1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRjYXRhbG9nby5oYW5kbGVfcmVwbGFjZV9pbWFnZW4oJCh0aGlzKSk7ICAgIFxyXG59KTtcclxuXHJcbi8vb24gc2Nyb2xsIGdldHMgd2hlbiBib3R0b20gb2YgdGhlIHBhZ2UgaXMgcmVhY2hlZCBhbmQgY2FsbHMgdGhlIGZ1bmN0aW9uIGRvIGxvYWQgbW9yZSBjb250ZW50XHJcbiQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oZSl7XHJcblx0Ly9Ob3QgYWx3YXlzIHRoZSBwb3MgPT0gaCBzdGF0ZW1lbnQgaXMgdmVyaWZpZWQsIGV4cGVjaWFsbHkgb24gbW9iaWxlIGRldmljZXMsIHRoYXQncyB3aHkgYSAzMDBweCBvZiBtYXJnaW4gYXJlIGFzc3VtZWQuXHJcblx0aWYoJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgJCh3aW5kb3cpLmhlaWdodCgpID49ICQoZG9jdW1lbnQpLmhlaWdodCgpIC0gMzAwKSB7XHJcblx0XHR1dGlscy5sb2coXCJGaW5hbCBkZSBww6FnaW5hIGFsY2FuemFkb1wiKTtcclxuXHRcdGlmKCQoJyNtYXJrZXQtY2F0YWxvZ28nKS5sZW5ndGgpXHJcblx0XHRcdGNhdGFsb2dvLnJlZnJlc2hfY2F0YWxvZ28oKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gbWFpbigpe1xyXG5cdGNhdGFsb2dvLnJlbG9hZF9jYXRhbG9nbygpO1xyXG5cdGZybXMuaGFuZGxlX2xvZ2luX3N1Ym1pdCgpO1xyXG5cdGZybXMuaGFuZGxlX3JlZ2lzdGVyX3N1Ym1pdCgpO1xyXG5cdGZybXMuaGFuZGxlX3BhZ29fY2MoKTtcclxuXHRmcm1zLmhhbmRsZV9lbnRyZWdhX3N1Ym1pdCgpO1xyXG5cdGZybXMuaGFuZGxlX3Byb2R1Y3RfcmV2aWV3X3N1Ym1pdCgpO1xyXG5cdGNhdGFsb2dvLmxvYWRfZGVzdGFjYWRvcygpO1xyXG59XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShtYWluKTtcclxuIiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpLFxuXHRjdGxnPXJlcXVpcmUoJy4vY2F0YWxvZ28nKTtcbm1vZHVsZS5leHBvcnRzPXtcblx0aGFuZGxlX2xvZ2luX3N1Ym1pdCA6ZnVuY3Rpb24gKCl7XG5cdFx0ICQoJ2Zvcm0jZm9ybS1sb2dpbm1hcmtldCcpLmZpbmQoJy5lcnJvcnMnKS5oaWRlKCk7XG5cdFx0ICQoJyNmb3JtLWxvZ2lubWFya2V0JykudmFsaWRhdGUoe1xuXHQgICAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uIChmb3JtKVxuXHQgICAgICAgIHtcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsIFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICAkKCcjZm9ybS1sb2dpbm1hcmtldCcpLmF0dHIoIFwiYWN0aW9uXCIgKSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogICQoICcjZm9ybS1sb2dpbm1hcmtldCcgKS5zZXJpYWxpemUoKSwgXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsIFxuXHRcdCAgICAgICAgICAgIGJlZm9yZVNlbmQ6ZnVuY3Rpb24oKXtcblx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS52YWwoJ1Byb2Nlc2FuZG8uLi4nKTtcblx0XHQgICAgICAgICAgICB9LFxuXHRcdCAgICAgICAgICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbihkYXRhKXtcblx0XHQgICAgICAgICAgICAgIGlmKCFkYXRhLmVycm9yKXtcblx0XHQgICAgICAgICAgICAgICB3aW5kb3cub3Blbih1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL21hcmtldCcsJ19zZWxmJyk7XG5cdFx0ICAgICAgICAgICAgICBcdG5ldyBQTm90aWZ5KHtcblx0XHQgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQmllbnZlbmlkbyEnLFxuXHRcdCAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXG5cdFx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5mbycsXG5cdFx0ICAgICAgICAgICAgICAgICAgICBkZWxheTogNTAwXG5cdFx0ICAgICAgICAgICAgICAgIH0pO1xuXHRcdCAgICAgICAgICAgICAgXG5cdFx0ICAgICAgICAgICAgICB9ZWxzZXtcblx0XHQgICAgICAgICAgICAgICAgJCgnI2Zvcm0tbG9naW5tYXJrZXQnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChkYXRhLm1zZyk7IFxuXHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdHdWFyZGFyJyk7XG5cdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblx0XHQgICAgICAgICAgICAgIH1cblx0XHQgICAgICAgICAgICB9LFxuXHRcdCAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKGpxWEhSLHRleHRTdGF0dXMsZXJyb3JUaHJvd24pe1xuXHRcdCAgICAgICAgICAgICAgJCgnI2Zvcm0tbG9naW5tYXJrZXQnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChqcVhIUi5zdGF0dXMrJyAnK3RleHRTdGF0dXMpO1xuXHRcdCAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBlcnJvckxhYmVsQ29udGFpbmVyOiBcIiNlcnJvcl9tZXNzYWdlX2JveFwiLFxuXHQgICAgICAgIHdyYXBwZXI6IFwibGlcIixcblx0ICAgICAgICBydWxlczpcblx0ICAgICAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgICAgICB1c2VybmFtZTogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICB9KTtcblx0fSxcblx0aGFuZGxlX3JlZ2lzdGVyX3N1Ym1pdCA6ZnVuY3Rpb24gKCl7XG5cdFx0ICQoJyNmb3JtLXJlZ2lzdGVybWFya2V0JykuZmluZCgnLmVycm9ycycpLmhpZGUoKTtcblx0XHQgJCgnI2Zvcm0tcmVnaXN0ZXJtYXJrZXQnKS52YWxpZGF0ZSh7XG5cdCAgICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKGZvcm0pXG5cdCAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgJC5hamF4KHtcblx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsIFxuXHQgICAgICAgICAgICAgICAgICAgIHVybDogICQoJyNmb3JtLXJlZ2lzdGVybWFya2V0JykuYXR0ciggXCJhY3Rpb25cIiApLFxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGE6ICAkKCAnI2Zvcm0tcmVnaXN0ZXJtYXJrZXQnICkuc2VyaWFsaXplKCksIFxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsIFxuXHRcdFx0ICAgICAgICAgICAgYmVmb3JlU2VuZDpmdW5jdGlvbigpe1xuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS52YWwoJ1Byb2Nlc2FuZG8uLi4nKTtcblx0XHRcdCAgICAgICAgICAgIH0sXG5cdFx0XHQgICAgICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHQgICAgICAgICAgICAgIGlmKCFkYXRhLmVycm9yKXtcblx0XHRcdCAgICAgICAgICAgICAgXHRuZXcgUE5vdGlmeSh7XG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQmllbnZlbmlkbyEnLFxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1zZyxcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nXG5cdFx0XHQgICAgICAgICAgICAgICAgfSk7XG5cdFx0XHQgICAgICAgICAgICAgICB3aW5kb3cub3Blbih1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL21hcmtldCcsJ19zZWxmJyk7XG5cdFx0XHQgICAgICAgICAgICAgIFxuXHRcdFx0ICAgICAgICAgICAgICB9ZWxzZXtcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjZm9ybS1yZWdpc3Rlcm1hcmtldCcpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGRhdGEubXNnKTsgXG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnZhbCgnR3VhcmRhcicpO1xuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdCAgICAgICAgICAgICAgfVxuXHRcdFx0ICAgICAgICAgICAgfSxcblx0XHRcdCAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKGpxWEhSLHRleHRTdGF0dXMsZXJyb3JUaHJvd24pe1xuXHRcdFx0ICAgICAgICAgICAgICAgJCgnI2Zvcm0tcmVnaXN0ZXJtYXJrZXQnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChqcVhIUi5zdGF0dXMrJyAnK3RleHRTdGF0dXMpO1xuXHRcdFx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgfSlcblx0ICAgICAgICB9LFxuXHQgICAgICAgIGVycm9yTGFiZWxDb250YWluZXI6IFwiI2Vycm9yX21lc3NhZ2VfYm94XCIsXG5cdCAgICAgICAgd3JhcHBlcjogXCJsaVwiLFxuXHQgICAgICAgIHJ1bGVzOlxuXHQgICAgICAgICAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgICAgIGZpcnN0X25hbWU6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgICAgICBlbWFpbDogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICB9KTtcblx0fSxcblx0aGFuZGxlX3BhZ29fY2MgOmZ1bmN0aW9uICgpe1xuXHRcdCAkKCcjZm9ybS1wYWdvLWNjJykuZmluZCgnLmVycm9ycycpLmhpZGUoKTtcblx0XHQgJCgnI2Zvcm0tcGFnby1jYycpLnZhbGlkYXRlKHtcblx0ICAgICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoZm9ybSlcblx0ICAgICAgICB7XG5cblx0ICAgICAgICAgICAgICAgICQuYWpheCh7XG5cdCAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLCBcblx0ICAgICAgICAgICAgICAgICAgICB1cmw6ICAkKCcjZm9ybS1wYWdvLWNjJykuYXR0ciggXCJhY3Rpb25cIiApLFxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGE6ICAkKCAnI2Zvcm0tcGFnby1jYycgKS5zZXJpYWxpemUoKSwgXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJywgXG5cdCAgICAgICAgICAgICAgICAgICAgYXN5bmM6ZmFsc2UsXG5cdFx0XHQgICAgICAgICAgICBiZWZvcmVTZW5kOmZ1bmN0aW9uKCl7XG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXRfY2MnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdF9jYycpLnZhbCgnUHJvY2VzYW5kby4uLicpO1xuXHRcdFx0ICAgICAgICAgICAgfSxcblx0XHRcdCAgICAgICAgICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdCAgICAgICAgICAgICAgaWYoIWRhdGEuZXJyb3Ipe1xuXHRcdFx0ICAgICAgICAgICAgICBcdGN0bGcuY2xlYXJfY2FydCgpO1xuXHRcdFx0ICAgICAgICAgICAgICAgd2luZG93Lm9wZW4odXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9DYXJ0cy9maW5hbGl6YXInLCdfc2VsZicpO1xuXHRcdFx0ICAgICAgICAgICAgICBcblx0XHRcdCAgICAgICAgICAgICAgfWVsc2V7XG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI2Zvcm0tcGFnby1jYycpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGRhdGEubXNnKTsgXG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdF9jYycpLnZhbCgnR3VhcmRhcicpO1xuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXRfY2MnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdCAgICAgICAgICAgICAgfVxuXHRcdFx0ICAgICAgICAgICAgfSxcblx0XHRcdCAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKGpxWEhSLHRleHRTdGF0dXMsZXJyb3JUaHJvd24pe1xuXHRcdFx0ICAgICAgICAgICAgXHR1dGlscy5sb2coanFYSFIpO1xuXHRcdFx0ICAgICAgICAgICAgXHR1dGlscy5sb2codGV4dFN0YXR1cyk7XG5cdFx0XHQgICAgICAgICAgICBcdHV0aWxzLmxvZyhlcnJvclRocm93bik7XG5cdFx0XHQgICAgICAgICAgICAgICAkKCcjZm9ybS1wYWdvLWNjJykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoanFYSFIuc3RhdHVzKycgJyt0ZXh0U3RhdHVzKTtcblx0XHRcdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH0pXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBlcnJvckxhYmVsQ29udGFpbmVyOiBcIiNlcnJvcl9tZXNzYWdlX2JveFwiLFxuXHQgICAgICAgIHdyYXBwZXI6IFwibGlcIixcblx0ICAgICAgICBydWxlczpcblx0ICAgICAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgICAgICBjcmVkaXRfY2FyZDogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIFwiY2FyZC1udW1iZXJcIjogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIFwiZXhwaXJ5LW1vbnRoXCI6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgICAgICBcImV4cGlyeS15ZWFyXCI6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgIH0pO1xuXHR9LFxuXHRoYW5kbGVfZW50cmVnYV9zdWJtaXQgOmZ1bmN0aW9uICgpe1xuXHRcdCAkKCcjZm9ybS1lbnRyZWdhJykuZmluZCgnLmVycm9ycycpLmhpZGUoKTtcblx0XHQgJCgnI2Zvcm0tZW50cmVnYScpLnZhbGlkYXRlKHtcblx0ICAgICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoZm9ybSlcblx0ICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICAkLmFqYXgoe1xuXHQgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJywgXG5cdCAgICAgICAgICAgICAgICAgICAgdXJsOiAgJCgnI2Zvcm0tZW50cmVnYScpLmF0dHIoIFwiYWN0aW9uXCIgKSxcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhOiAgJCggJyNmb3JtLWVudHJlZ2EnICkuc2VyaWFsaXplKCksIFxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsIFxuXHRcdFx0ICAgICAgICAgICAgYmVmb3JlU2VuZDpmdW5jdGlvbigpe1xuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS52YWwoJ1Byb2Nlc2FuZG8uLi4nKTtcblx0XHRcdCAgICAgICAgICAgIH0sXG5cdFx0XHQgICAgICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHQgICAgICAgICAgICBcdFxuXHRcdFx0ICAgICAgICAgICAgICBpZighZGF0YS5lcnJvcil7XG5cdFx0XHQgICAgICAgICAgICAgIFx0bmV3IFBOb3RpZnkoe1xuXHRcdFx0ICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0luZm9ybWFjacOzbiBhY3R1YWxpemFkYSEnLFxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1lc3NhZ2UsXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJ1xuXHRcdFx0ICAgICAgICAgICAgICAgIH0pO1xuXHRcdFx0ICAgICAgICAgICAgICAgd2luZG93Lm9wZW4odXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9DYXJ0cy9wYWdvJywnX3NlbGYnKTtcblx0XHRcdCAgICAgICAgICAgICAgXG5cdFx0XHQgICAgICAgICAgICAgIH1lbHNle1xuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNmb3JtLWVudHJlZ2EnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChkYXRhLm1lc3NhZ2UpOyBcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdHdWFyZGFyJyk7XG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0ICAgICAgICAgICAgICB9XG5cdFx0XHQgICAgICAgICAgICB9LFxuXHRcdFx0ICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24oanFYSFIsdGV4dFN0YXR1cyxlcnJvclRocm93bil7XG5cdFx0XHQgICAgICAgICAgICAgICAkKCcjZm9ybS1lbnRyZWdhJykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoanFYSFIuc3RhdHVzKycgJyt0ZXh0U3RhdHVzKTtcblx0XHRcdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH0pXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBlcnJvckxhYmVsQ29udGFpbmVyOiBcIiNlcnJvcl9tZXNzYWdlX2JveFwiLFxuXHQgICAgICAgIHdyYXBwZXI6IFwibGlcIixcblx0ICAgICAgICBydWxlczpcblx0ICAgICAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgICAgICBmaXJzdF9uYW1lOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgbGFzdF9uYW1lOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgYWRkcmVzc18xOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgcGhvbmVfbnVtYmVyOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgZW1haWw6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgfSk7XG5cdH0sXG5cdGhhbmRsZV9wcm9kdWN0X3Jldmlld19zdWJtaXQgOmZ1bmN0aW9uICgpe1xuXHRcdCAkKCcjZm9ybS1wcm9kdWN0cmV2aWV3JykuZmluZCgnLmVycm9ycycpLmhpZGUoKTtcblx0XHQgJCgnI2Zvcm0tcHJvZHVjdHJldmlldycpLnZhbGlkYXRlKHtcblx0ICAgICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoZm9ybSlcblx0ICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICAkLmFqYXgoe1xuXHQgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJywgXG5cdCAgICAgICAgICAgICAgICAgICAgdXJsOiAgJCgnI2Zvcm0tcHJvZHVjdHJldmlldycpLmF0dHIoIFwiYWN0aW9uXCIgKSxcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhOiAgJCggJyNmb3JtLXByb2R1Y3RyZXZpZXcnICkuc2VyaWFsaXplKCksIFxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsIFxuXHRcdFx0ICAgICAgICAgICAgYmVmb3JlU2VuZDpmdW5jdGlvbigpe1xuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS52YWwoJ1Byb2Nlc2FuZG8uLi4nKTtcblx0XHRcdCAgICAgICAgICAgIH0sXG5cdFx0XHQgICAgICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHQgICAgICAgICAgICAgIGlmKCFkYXRhLmVycm9yKXtcblx0XHRcdCAgICAgICAgICAgICAgXHQkY29udGVuZWRvciA9ICQoJyNwcm9kdWN0cmV2aWV3cycpO1xuXHRcdFx0XHRcdFx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9tYXJrZXQvZ2V0X3JldmlldycseydJRCc6ZGF0YS5JRH0sZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRcdFx0XHQkY29udGVuZWRvci5wcmVwZW5kKGRhdGEpO1xuXHRcdFx0XHRcdFx0XHR9LCd0ZXh0Jyk7XG5cdFx0XHRcdFx0XHRcdCQoJyNmb3JtLXByb2R1Y3RyZXZpZXcnKS50cmlnZ2VyKCdyZXNldCcpO1xuXHRcdFx0ICAgICAgICAgICAgICB9ZWxzZXtcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjZm9ybS1wcm9kdWN0cmV2aWV3JykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoZGF0YS5tc2cpOyBcblx0XHRcdCAgICAgICAgICAgICAgfVxuXHRcdFx0ICAgICAgICAgICAgfSxcblx0XHRcdCAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKGpxWEhSLHRleHRTdGF0dXMsZXJyb3JUaHJvd24pe1xuXHRcdFx0ICAgICAgICAgICAgICAgJCgnI2Zvcm0tZW50cmVnYScpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGpxWEhSLnN0YXR1cysnICcrdGV4dFN0YXR1cyk7XG5cdFx0XHQgICAgICAgICAgICB9LFxuXHRcdFx0ICAgICAgICAgICAgY29tcGxldGU6ZnVuY3Rpb24oKXtcblx0XHRcdCAgICAgICAgICAgIFx0JCgnI3N1Ym1pdCcpLnZhbCgnR3VhcmRhcicpO1xuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH0pXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBlcnJvckxhYmVsQ29udGFpbmVyOiBcIiNlcnJvcl9tZXNzYWdlX2JveFwiLFxuXHQgICAgICAgIHdyYXBwZXI6IFwibGlcIixcblx0ICAgICAgICBydWxlczpcblx0ICAgICAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgICAgICBub21icmU6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgICAgICBlbWFpbDogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIGRldGFsbGU6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgIH0pO1xuXHR9LFxufSIsIm1vZHVsZS5leHBvcnRzPXtcblx0bG9nOiBmdW5jdGlvbihzdHJpbmcpe1xuXHRcdGlmKGNvbnNvbGUpIGNvbnNvbGUubG9nKHN0cmluZyk7XG5cdH0sXG5cdC8vT2J0aWVuZSB1biBhcnJheSBjb24gdG9kb3MgbG9zIHNlZ21ldG9zIGRlIGxhIFVSTFxuXHRnZXRCYXNlUGF0aCA6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHBvcnQgPSB3aW5kb3cubG9jYXRpb24ucG9ydDtcblx0XHR2YXIgcGF0aEFycmF5ID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCcvJyk7XG5cdFx0dmFyIGFwcGxpY2FjaW9uID0gKHdpbmRvdy5sb2NhdGlvbi5ob3N0ID09PSBcIjEyNy4wLjAuMVwiIHx8IHdpbmRvdy5sb2NhdGlvbi5ob3N0ID09PSBcImxvY2FsaG9zdFwiIHx8IHdpbmRvdy5sb2NhdGlvbi5ob3N0LmluZGV4T2YoJzE5Mi4xNjguJykgIT09IC0xKSA/IHBhdGhBcnJheVsxXSA6ICcnO1xuXHRcdGlmKHBvcnQ9PT1cIjMwMDBcIil7XG5cdFx0XHRhcHBsaWNhY2lvbiA9IGFwcGxpY2FjaW9uKydwb3MvJztcblx0XHR9XG5cdFx0aWYgKCF3aW5kb3cubG9jYXRpb24ub3JpZ2luKVxuXHRcdFx0cmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIHdpbmRvdy5sb2NhdGlvbi5ob3N0ICsgXCIvXCIgKyBhcHBsaWNhY2lvbjtcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgYXBwbGljYWNpb247XG5cdH1cbn0iXX0=
