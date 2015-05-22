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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi92YXIvd3d3L2h0bWwvcG9zL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi92YXIvd3d3L2h0bWwvcG9zL2Fzc2V0cy93ZWIvanMvZGV2L2NhdGFsb2dvLmpzIiwiL3Zhci93d3cvaHRtbC9wb3MvYXNzZXRzL3dlYi9qcy9kZXYvZmFrZV84ZDY0NTUyZi5qcyIsIi92YXIvd3d3L2h0bWwvcG9zL2Fzc2V0cy93ZWIvanMvZGV2L2Zvcm11bGFyaW9zLmpzIiwiL3Zhci93d3cvaHRtbC9wb3MvYXNzZXRzL3dlYi9qcy9kZXYvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblx0ZnJtcz1yZXF1aXJlKCcuL2Zvcm11bGFyaW9zJyk7XG5tb2R1bGUuZXhwb3J0cz17XG5cdGFkZF9maWx0ZXJfdG9fbWFya2VkIDogZnVuY3Rpb24gKGZpbHRybyl7XG5cdFx0JGJ0biAgPSAkKGZpbHRybyk7XG5cdCAgICAkYnRuLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKVxuXHRcdGlmKCRidG4uY3NzKCdvcGFjaXR5Jyk9PTEpe1xuXHRcdFx0JGJ0bi5hbmltYXRlKHsnb3BhY2l0eSc6MC41fSwgMjAwKTtcblx0XHR9ZWxzZXsgXG5cdFx0XHQkYnRuLmFuaW1hdGUoeydvcGFjaXR5JzoxfSwgMjAwKTtcblx0XHR9XG5cdCAgICAvL0HDsWFkZSBsYSBjYXRlZ29yaWEgc2VsZWNjaW9uYWRhIGFsIGRpdiBkZSBmaWx0cm8gYXBsaWNhZG9zXG5cdFx0LyokZmlsdHJvcyA9ICQoJy5tYXJrZXQtYXBwbGllZC1maWx0ZXJzJyk7XG5cdFx0JGZpbHRyb3MuZmluZCgnW2ZpbHRlcj1cIicrJChmaWx0cm8pLmF0dHIoJ2ZpbHRlcicpKydcIl0nKS5yZW1vdmUoKTtcblx0XHQkbGkgPSQoJzxsaT48L2xpPicpO1xuXHRcdCRsaS5hdHRyKCd0aXBvJywkKGZpbHRybykuYXR0cigndGlwbycpKTtcblx0XHQkbGkuYXR0cignZmlsdGVyJywkKGZpbHRybykuYXR0cignZmlsdGVyJykpO1xuXHRcdCRsaS5odG1sKCQoZmlsdHJvKS5hdHRyKCdmaWx0ZXInKSk7XG5cdFx0JGZpbHRyb3MuYXBwZW5kKCRsaSk7Ki9cblx0fSxcblx0Z2V0X2ZpbHRlcnMgOmZ1bmN0aW9uICgpe1xuXHRcdHZhciBmaWx0ZXJzPXsnY2F0ZWdvcmlhJzpbXSwncHJlY2lvcyc6W119O1xuXHRcdCQuZWFjaCgkKCcubWFya2V0LWZpbHRlcicpLGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuXHRcdFx0aWYoJChlbCkuaGFzQ2xhc3MoJ2FjdGl2ZScpKVxuXHRcdFx0XHRmaWx0ZXJzWyQoZWwpLmF0dHIoJ3RpcG8nKV0ucHVzaCgkKGVsKS5hdHRyKCdmaWx0ZXInKSk7XG5cdFx0fSk7XG5cdFx0ZmlsdGVycy5wcmVjaW9zPSQoJyNzbDInKS52YWwoKTtcblx0XHR2YXIgdWx0ID0gJCgnLmZlYXR1cmVzX2l0ZW1zIC5wcm9kdWN0LWltYWdlLXdyYXBwZXI6bGFzdCcpO1xuXHRcdGZpbHRlcnMudWx0aW1vID0gdWx0LmluZGV4KCcucHJvZHVjdC1pbWFnZS13cmFwcGVyJyk7XG5cdFx0Y29uc29sZS5sb2coZmlsdGVycy50b1NvdXJjZSgpKTtcblx0XHRyZXR1cm4gZmlsdGVycztcblx0fSxcblx0bG9hZF9kZXN0YWNhZG9zIDogZnVuY3Rpb24oKXtcblx0XHQkKCcjbWFya2V0LWRlc3RhY2Fkb3MnKS5sb2FkKHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0L2Rlc3RhY2Fkb3MnKTtcblx0fSxcblx0cmVsb2FkX2NhdGFsb2dvIDpmdW5jdGlvbiAoKXtcblx0XHR2YXIgZmlsdHJvcyA9IHRoaXMuZ2V0X2ZpbHRlcnMoKTtcblx0XHRmaWx0cm9zLnVsdGltbz0tMTtcblx0XHQkLmdldCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL21hcmtldC9jYXRhbG9nbycsZmlsdHJvcywgZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0aWYoZGF0YSE9XCJcIil7XG5cdFx0XHRcdCQoJyNtYXJrZXQtY2F0YWxvZ28nKS5odG1sKGRhdGEpLmFuaW1hdGUoe29wYWNjaXR5OjAuOH0sIDUwMCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cdHJlZnJlc2hfY2F0YWxvZ28gOmZ1bmN0aW9uICgpe1xuXHRcdHZhciBmaWx0cm9zID0gdGhpcy5nZXRfZmlsdGVycygpO1xuXHRcdCQuZ2V0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0L2NhdGFsb2dvJyxmaWx0cm9zLCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRpZihkYXRhIT1cIlwiKXtcblx0XHRcdFx0aWYoZmlsdHJvcy51bHRpbW8gPT0gLTEpe1xuXHRcdFx0XHRcdCQoJyNtYXJrZXQtY2F0YWxvZ28nKS5odG1sKGRhdGEpLmFuaW1hdGUoe29wYWNjaXR5OjAuOH0sIDUwMCk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdCQoJyNtYXJrZXQtY2F0YWxvZ28nKS5hcHBlbmQoZGF0YSkuYW5pbWF0ZSh7b3BhY2NpdHk6MC44fSwgNTAwKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXHRoYW5kbGVfYWRkX3RvX3dsaXN0OiBmdW5jdGlvbihpdGVtKXtcblx0XHQkcHJvZHVjdG8gPSAkKGl0ZW0pO1xuXHRcdHZhciBpZF9wcm9kdWN0byA9ICRwcm9kdWN0by5hdHRyKCdocmVmJyk7XG5cdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvV2xpc3QvYWRkX3RvX3dsaXN0Jyx7J3Byb2R1Y3RvJzppZF9wcm9kdWN0b30sZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRpZighZGF0YS5lcnJvcil7XG5cdFx0XHQgbmV3IFBOb3RpZnkoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Byb2R1Y3RvIGFncmVnYWRvIScsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEubXNnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5mbycsXG5cdFx0ICAgICAgICAgICAgZGVsYXk6IDIwMFxuICAgICAgICAgICAgICAgIH0pO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdCBDdXN0b21ib3gub3Blbih7XG5cdCAgICAgICAgICAgICAgICB0YXJnZXQ6IGRhdGEubXNnLFxuXHQgICAgICAgICAgICAgICAgZWZmZWN0OiAnZmFkZWluJyxcblx0ICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdCBmcm1zLmhhbmRsZV9sb2dpbl9zdWJtaXQoKTtcblx0XHRcdFx0XHQgZnJtcy5oYW5kbGVfcmVnaXN0ZXJfc3VibWl0KCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0pO1xuXHRcdFx0fVxuXHRcdH0sJ2pzb24nKTtcblx0fSxcblx0aGFuZGxlX3JlbW92ZV9mcm9tX3dsaXN0OiBmdW5jdGlvbihpdGVtKXtcblx0XHQkdGhpcz10aGlzO1xuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XG5cdFx0dmFyIGlkX3Byb2R1Y3RvID0gJHByb2R1Y3RvLmF0dHIoJ2hyZWYnKTtcblx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9XbGlzdC9yZW1vdmVfZnJvbV93bGlzdCcseydwcm9kdWN0byc6aWRfcHJvZHVjdG99LGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0aWYoIWRhdGEuZXJyb3Ipe1xuXHRcdFx0XHQkcHJvZHVjdG8ucGFyZW50cygndHInKS5mYWRlT3V0KCdzbG93JykucmVtb3ZlKCk7XG5cdFx0XHRcdCBuZXcgUE5vdGlmeSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvZHVjdG9yIHJldGlyYWRvIScsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEubXNnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5mbycsXG5cdFx0ICAgICAgICAgICAgZGVsYXk6IDIwMFxuICAgICAgICAgICAgICAgIH0pO1xuXHRcdFx0fVxuXHRcdH0sJ2pzb24nKTtcblx0fSxcblx0aGFuZGxlX2FkZF90b19jYXJ0OiBmdW5jdGlvbihpdGVtKXtcblx0XHQkcHJvZHVjdG8gPSAkKGl0ZW0pO1xuXHRcdHZhciBpZF9wcm9kdWN0byA9ICRwcm9kdWN0by5hdHRyKCdocmVmJyk7XG5cdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvQ2FydHMvYWRkX3RvX2NhcnQnLHsncHJvZHVjdG8nOmlkX3Byb2R1Y3RvfSxmdW5jdGlvbihkYXRhKXtcblx0XHRcdGlmKCFkYXRhLmVycm9yKXtcblx0XHRcdCBuZXcgUE5vdGlmeSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvZHVjdG8gYWdyZWdhZG8hJyxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJyxcblx0XHQgICAgICAgICAgICBkZWxheTogMjAwXG4gICAgICAgICAgICAgICAgfSk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0IEN1c3RvbWJveC5vcGVuKHtcblx0ICAgICAgICAgICAgICAgIHRhcmdldDogZGF0YS5tc2csXG5cdCAgICAgICAgICAgICAgICBlZmZlY3Q6ICdmYWRlaW4nLFxuXHQgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0IGZybXMuaGFuZGxlX2xvZ2luX3N1Ym1pdCgpO1xuXHRcdFx0XHRcdCBmcm1zLmhhbmRsZV9yZWdpc3Rlcl9zdWJtaXQoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSk7XG5cdFx0XHR9XG5cblx0XHR9LCdqc29uJyk7XG5cdH0sXG5cdGhhbmRsZV9yZW1vdmVfZnJvbV9jYXJ0OiBmdW5jdGlvbihpdGVtKXtcblx0XHQkdGhpcz10aGlzO1xuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XG5cdFx0dmFyIGlkX3Byb2R1Y3RvID0gJHByb2R1Y3RvLmF0dHIoJ2hyZWYnKTtcblx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9DYXJ0cy9yZW1vdmVfZnJvbV9jYXJ0Jyx7J3Byb2R1Y3RvJzppZF9wcm9kdWN0b30sZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRpZighZGF0YS5lcnJvcil7XG5cdFx0XHRcdCRwcm9kdWN0by5wYXJlbnRzKCd0cicpLmZhZGVPdXQoJ3Nsb3cnKS5yZW1vdmUoKTtcblx0XHRcdFx0JHRoaXMuc3VidG90YWxfY2FydCgpO1xuXHRcdFx0XHRuZXcgUE5vdGlmeSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvZHVjdG9yIHJldGlyYWRvIScsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEubXNnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5mbycsXG5cdFx0ICAgICAgICAgICAgZGVsYXk6IDIwMFxuICAgICAgICAgICAgICAgIH0pO1xuXHRcdFx0fVxuXHRcdH0sJ2pzb24nKTtcblx0fSxcblx0aGFuZGxlX3pvb21faW1hZ2VuOiBmdW5jdGlvbihpdGVtKXtcblx0XHQkdGhpcz10aGlzO1xuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XG5cdFx0Q3VzdG9tYm94Lm9wZW4oe1xuICAgICAgICAgICAgICAgIHRhcmdldDogJyNtYWluLWltYWdlbi1wcm9kdWN0bycsXG4gICAgICAgICAgICAgICAgZWZmZWN0OiAnZmFkZWluJ1xuICAgICAgICAgICAgfSk7XG5cdH0sXG5cdGhhbmRsZV9yZXBsYWNlX2ltYWdlbjogZnVuY3Rpb24oaXRlbSl7XG5cdFx0JHRoaXM9dGhpcztcblx0XHQkcHJvZHVjdG8gPSAkKGl0ZW0pO1xuXHRcdCRjb250ZW5lZG9yID0gJCgnI21haW4taW1hZ2VuLXByb2R1Y3RvJyk7XG5cdFx0JGltYWdlbiA9ICRwcm9kdWN0by5maW5kKCdpbWcnKTtcblx0XHQvLyRjb250ZW5lZG9yLmZpbmQoJ2ltZycpPSRpbWFnZW47XG5cblx0fSxcblx0Y2xlYXJfY2FydDpmdW5jdGlvbigpe1xuXHRcdCR0aGlzPXRoaXM7XG5cdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvQ2FydHMvY2xlYXJfY2FydCcse30sZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRpZighZGF0YS5lcnJvcil7XG5cdFx0XHRcdCR0aGlzLnN1YnRvdGFsX2NhcnQoKTtcblx0XHRcdH1cblx0XHR9LCdqc29uJyk7XG5cdH0sXG5cdHN1YnRvdGFsX2l0ZW06ZnVuY3Rpb24odHIpe1xuXHRcdCR0ciA9ICAkKHRyKTtcblx0XHR2YXIgcHJlY2lvID0gcGFyc2VGbG9hdCgkdHIuZmluZCgnLmNhcnRfcHJpY2UgcCBzcGFuJykuaHRtbCgpKTtcblx0XHR2YXIgY2FudGlkYWQgPSBwYXJzZUludCgkdHIuZmluZCgnLmNhcnRfcXVhbnRpdHlfaW5wdXQnKS52YWwoKSk7XG5cdFx0dmFyIHJlc3VsdGFkbyA9ICR0ci5maW5kKCcuY2FydF90b3RhbF9wcmljZSBzcGFuJyk7XG5cdFx0cmVzdWx0YWRvLmh0bWwocHJlY2lvKmNhbnRpZGFkKTtcblx0fSxcblx0c3VidG90YWxfY2FydDpmdW5jdGlvbigpe1xuXHRcdHZhciBhY3VtdWxhZG9yPTA7XG5cdFx0JC5lYWNoKCQoJyNpdGVtcy1jYXJyaXRvIHRyJyksIGZ1bmN0aW9uKGluZGV4LCB2YWwpIHtcblx0XHRcdCAkaXRlbSA9ICQodmFsKTtcblxuXHRcdFx0IHZhciBzdWJ0b3RhbCA9IHBhcnNlRmxvYXQoJGl0ZW0uZmluZCgnLmNhcnRfdG90YWxfcHJpY2Ugc3BhbicpLmh0bWwoKSk7XG5cdFx0XHQgYWN1bXVsYWRvcis9c3VidG90YWw7XG5cdFx0fSk7XG5cdFx0XG5cdFx0dmFyIHN1YnRvdGFsX2NhcnQgPSAkKCcjY2FydC1zdWJ0b3RhbCBzcGFuJyk7XG5cdFx0c3VidG90YWxfY2FydC5odG1sKGFjdW11bGFkb3IpO1xuXG5cdFx0dmFyIHRvdGFsX2NhcnQgPSAkKCcjY2FydC10b3RhbCBzcGFuJyk7XG5cdFx0dG90YWxfY2FydC5odG1sKGFjdW11bGFkb3IpO1xuXHR9LFxuXHR1cGRhdGVfY2FudGlkYWRfaXRlbTogZnVuY3Rpb24oaXRlbSl7XG5cdFx0JHRoaXM9dGhpcztcblx0XHQkcHJvZHVjdG8gPSAkKGl0ZW0pO1xuXHRcdHZhciBpZF9wcm9kdWN0byA9ICRwcm9kdWN0by5hdHRyKCdocmVmJyk7XG5cdFx0dmFyIGNhbnRpZGFkID0gcGFyc2VJbnQoJHByb2R1Y3RvLmF0dHIoJ3ZhbCcpKTtcblxuXHRcdCRpbnB1dCA9ICRwcm9kdWN0by5zaWJsaW5ncygnLmNhcnRfcXVhbnRpdHlfaW5wdXQnKTtcblx0XHR2YXIgdmFsb3IgPSBwYXJzZUludCgkaW5wdXQudmFsKCkpO1xuXHRcdHZhciB0b3RhbCA9IHZhbG9yK2NhbnRpZGFkO1xuXHRcdGlmKHRvdGFsPjApXG5cdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvQ2FydHMvYWRkX3RvX2NhcnQnLHsncHJvZHVjdG8nOmlkX3Byb2R1Y3RvLCdjYW50aWRhZCc6dG90YWx9LGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0aWYoIWRhdGEuZXJyb3Ipe1xuXHRcdFx0XHRpZihjYW50aWRhZD09MCl7XG5cdFx0XHRcdFx0bmV3IFBOb3RpZnkoe1xuXHRcdCAgICAgICAgICAgICAgICB0aXRsZTogJ1Byb2R1Y3RvIGFncmVnYWRvIScsXG5cdFx0ICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEubXNnLFxuXHRcdCAgICAgICAgICAgICAgICB0eXBlOiAnaW5mbycsXG5cdFx0XHQgICAgICAgICAgICBkZWxheTogMjAwXG5cdFx0ICAgICAgICAgICAgfSk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdCRpbnB1dC52YWwodG90YWwpO1xuXHRcdFx0XHRcdCR0aGlzLnN1YnRvdGFsX2l0ZW0oJGlucHV0LnBhcmVudHMoJ3RyJykpO1xuXHRcdFx0XHRcdCR0aGlzLnN1YnRvdGFsX2NhcnQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdCBDdXN0b21ib3gub3Blbih7XG5cdCAgICAgICAgICAgICAgICB0YXJnZXQ6IGRhdGEubXNnLFxuXHQgICAgICAgICAgICAgICAgZWZmZWN0OiAnZmFkZWluJyxcblx0ICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdCBmcm1zLmhhbmRsZV9sb2dpbl9zdWJtaXQoKTtcblx0XHRcdFx0XHQgZnJtcy5oYW5kbGVfcmVnaXN0ZXJfc3VibWl0KCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0pO1xuXHRcdFx0fVxuXHRcdH0sJ2pzb24nKTtcblx0fVxufSIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKSxcclxuIGNhdGFsb2dvID0gcmVxdWlyZSgnLi9jYXRhbG9nbycpLFxyXG4gZnJtcyA9IHJlcXVpcmUoJy4vZm9ybXVsYXJpb3MnKTtcclxuXHJcbnV0aWxzLmxvZyh1dGlscy5nZXRCYXNlUGF0aCgpKTsgXHJcbi8qcHJpY2UgcmFuZ2UqL1xyXG4kKCcjc2wyJykuc2xpZGVyKCkub24oJ3NsaWRlJyxmdW5jdGlvbigpe2NhdGFsb2dvLnJlbG9hZF9jYXRhbG9nbygpfSk7XHJcblxyXG4vKnNjcm9sbCB0byB0b3AqL1xyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG5cdCQoZnVuY3Rpb24gKCkge1xyXG5cdFx0JC5zY3JvbGxVcCh7XHJcblx0ICAgICAgICBzY3JvbGxOYW1lOiAnc2Nyb2xsVXAnLCAvLyBFbGVtZW50IElEXHJcblx0ICAgICAgICBzY3JvbGxEaXN0YW5jZTogMzAwLCAvLyBEaXN0YW5jZSBmcm9tIHRvcC9ib3R0b20gYmVmb3JlIHNob3dpbmcgZWxlbWVudCAocHgpXHJcblx0ICAgICAgICBzY3JvbGxGcm9tOiAndG9wJywgLy8gJ3RvcCcgb3IgJ2JvdHRvbSdcclxuXHQgICAgICAgIHNjcm9sbFNwZWVkOiAzMDAsIC8vIFNwZWVkIGJhY2sgdG8gdG9wIChtcylcclxuXHQgICAgICAgIGVhc2luZ1R5cGU6ICdsaW5lYXInLCAvLyBTY3JvbGwgdG8gdG9wIGVhc2luZyAoc2VlIGh0dHA6Ly9lYXNpbmdzLm5ldC8pXHJcblx0ICAgICAgICBhbmltYXRpb246ICdmYWRlJywgLy8gRmFkZSwgc2xpZGUsIG5vbmVcclxuXHQgICAgICAgIGFuaW1hdGlvblNwZWVkOiAyMDAsIC8vIEFuaW1hdGlvbiBpbiBzcGVlZCAobXMpXHJcblx0ICAgICAgICBzY3JvbGxUcmlnZ2VyOiBmYWxzZSwgLy8gU2V0IGEgY3VzdG9tIHRyaWdnZXJpbmcgZWxlbWVudC4gQ2FuIGJlIGFuIEhUTUwgc3RyaW5nIG9yIGpRdWVyeSBvYmplY3RcclxuXHRcdFx0XHRcdC8vc2Nyb2xsVGFyZ2V0OiBmYWxzZSwgLy8gU2V0IGEgY3VzdG9tIHRhcmdldCBlbGVtZW50IGZvciBzY3JvbGxpbmcgdG8gdGhlIHRvcFxyXG5cdCAgICAgICAgc2Nyb2xsVGV4dDogJzxpIGNsYXNzPVwiZmEgZmEtYW5nbGUtdXBcIj48L2k+JywgLy8gVGV4dCBmb3IgZWxlbWVudCwgY2FuIGNvbnRhaW4gSFRNTFxyXG5cdCAgICAgICAgc2Nyb2xsVGl0bGU6IGZhbHNlLCAvLyBTZXQgYSBjdXN0b20gPGE+IHRpdGxlIGlmIHJlcXVpcmVkLlxyXG5cdCAgICAgICAgc2Nyb2xsSW1nOiBmYWxzZSwgLy8gU2V0IHRydWUgdG8gdXNlIGltYWdlXHJcblx0ICAgICAgICBhY3RpdmVPdmVybGF5OiBmYWxzZSwgLy8gU2V0IENTUyBjb2xvciB0byBkaXNwbGF5IHNjcm9sbFVwIGFjdGl2ZSBwb2ludCwgZS5nICcjMDBGRkZGJ1xyXG5cdCAgICAgICAgekluZGV4OiAyMTQ3NDgzNjQ3IC8vIFotSW5kZXggZm9yIHRoZSBvdmVybGF5XHJcblx0XHR9KTtcclxuXHR9KTtcclxufSk7XHJcblxyXG5cclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5tYXJrZXQtZmlsdGVyJyxmdW5jdGlvbihlKXtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0Y2F0YWxvZ28uYWRkX2ZpbHRlcl90b19tYXJrZWQoJCh0aGlzKSk7ICAgIFxyXG5cdGNhdGFsb2dvLnJlbG9hZF9jYXRhbG9nbygpO1xyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5hZGQtdG8tY2FydCcsZnVuY3Rpb24oZSl7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGNhdGFsb2dvLmhhbmRsZV9hZGRfdG9fY2FydCgkKHRoaXMpKTsgICAgXHJcbn0pO1xyXG5cclxuJChkb2N1bWVudCkub24oJ2NsaWNrJywnLnJlbW92ZS1mcm9tLWNhcnQnLGZ1bmN0aW9uKGUpe1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRjYXRhbG9nby5oYW5kbGVfcmVtb3ZlX2Zyb21fY2FydCgkKHRoaXMpKTsgICAgXHJcbn0pO1xyXG5cclxuJChkb2N1bWVudCkub24oJ2NsaWNrJywnLmFkZC10by13bGlzdCcsZnVuY3Rpb24oZSl7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGNhdGFsb2dvLmhhbmRsZV9hZGRfdG9fd2xpc3QoJCh0aGlzKSk7ICAgIFxyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5yZW1vdmUtZnJvbS13bGlzdCcsZnVuY3Rpb24oZSl7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGNhdGFsb2dvLmhhbmRsZV9yZW1vdmVfZnJvbV93bGlzdCgkKHRoaXMpKTsgICAgXHJcbn0pO1xyXG5cclxuJChkb2N1bWVudCkub24oJ2NsaWNrJywnLmNhcnRfcXVhbnRpdHlfdXAsIC5jYXJ0X3F1YW50aXR5X2Rvd24sIC5hZGQtdG8tY2FydDInLGZ1bmN0aW9uKGUpe1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRjYXRhbG9nby51cGRhdGVfY2FudGlkYWRfaXRlbSgkKHRoaXMpKTsgICAgXHJcblx0XHJcbn0pO1xyXG5cclxuJChkb2N1bWVudCkub24oJ2NsaWNrJywnI21haW4taW1hZ2VuLXByb2R1Y3RvIGgzJyxmdW5jdGlvbihlKXtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0Y2F0YWxvZ28uaGFuZGxlX3pvb21faW1hZ2VuKCQodGhpcykpOyAgICBcclxufSk7XHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcuaW1hZ2VuLXByb2R1Y3RvJyxmdW5jdGlvbihlKXtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0Y2F0YWxvZ28uaGFuZGxlX3JlcGxhY2VfaW1hZ2VuKCQodGhpcykpOyAgICBcclxufSk7XHJcblxyXG4vL29uIHNjcm9sbCBnZXRzIHdoZW4gYm90dG9tIG9mIHRoZSBwYWdlIGlzIHJlYWNoZWQgYW5kIGNhbGxzIHRoZSBmdW5jdGlvbiBkbyBsb2FkIG1vcmUgY29udGVudFxyXG4kKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKGUpe1xyXG5cdC8vTm90IGFsd2F5cyB0aGUgcG9zID09IGggc3RhdGVtZW50IGlzIHZlcmlmaWVkLCBleHBlY2lhbGx5IG9uIG1vYmlsZSBkZXZpY2VzLCB0aGF0J3Mgd2h5IGEgMzAwcHggb2YgbWFyZ2luIGFyZSBhc3N1bWVkLlxyXG5cdGlmKCQod2luZG93KS5zY3JvbGxUb3AoKSArICQod2luZG93KS5oZWlnaHQoKSA+PSAkKGRvY3VtZW50KS5oZWlnaHQoKSAtIDMwMCkge1xyXG5cdFx0dXRpbHMubG9nKFwiRmluYWwgZGUgcMOhZ2luYSBhbGNhbnphZG9cIik7XHJcblx0XHRpZigkKCcjbWFya2V0LWNhdGFsb2dvJykubGVuZ3RoKVxyXG5cdFx0XHRjYXRhbG9nby5yZWZyZXNoX2NhdGFsb2dvKCk7XHJcblx0fVxyXG59KTtcclxuXHJcbmZ1bmN0aW9uIG1haW4oKXtcclxuXHRjYXRhbG9nby5yZWxvYWRfY2F0YWxvZ28oKTtcclxuXHRmcm1zLmhhbmRsZV9sb2dpbl9zdWJtaXQoKTtcclxuXHRmcm1zLmhhbmRsZV9yZWdpc3Rlcl9zdWJtaXQoKTtcclxuXHRmcm1zLmhhbmRsZV9wYWdvX2NjKCk7XHJcblx0ZnJtcy5oYW5kbGVfZW50cmVnYV9zdWJtaXQoKTtcclxuXHRmcm1zLmhhbmRsZV9wcm9kdWN0X3Jldmlld19zdWJtaXQoKTtcclxuXHRjYXRhbG9nby5sb2FkX2Rlc3RhY2Fkb3MoKTtcclxufVxyXG5cclxuJChkb2N1bWVudCkucmVhZHkobWFpbik7XHJcbiIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKSxcblx0Y3RsZz1yZXF1aXJlKCcuL2NhdGFsb2dvJyk7XG5tb2R1bGUuZXhwb3J0cz17XG5cdGhhbmRsZV9sb2dpbl9zdWJtaXQgOmZ1bmN0aW9uICgpe1xuXHRcdCAkKCdmb3JtI2Zvcm0tbG9naW5tYXJrZXQnKS5maW5kKCcuZXJyb3JzJykuaGlkZSgpO1xuXHRcdCAkKCcjZm9ybS1sb2dpbm1hcmtldCcpLnZhbGlkYXRlKHtcblx0ICAgICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoZm9ybSlcblx0ICAgICAgICB7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLCBcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAgJCgnI2Zvcm0tbG9naW5tYXJrZXQnKS5hdHRyKCBcImFjdGlvblwiICksXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6ICAkKCAnI2Zvcm0tbG9naW5tYXJrZXQnICkuc2VyaWFsaXplKCksIFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCBcblx0XHQgICAgICAgICAgICBiZWZvcmVTZW5kOmZ1bmN0aW9uKCl7XG5cdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdQcm9jZXNhbmRvLi4uJyk7XG5cdFx0ICAgICAgICAgICAgfSxcblx0XHQgICAgICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XG5cdFx0ICAgICAgICAgICAgICBpZighZGF0YS5lcnJvcil7XG5cdFx0ICAgICAgICAgICAgICAgd2luZG93Lm9wZW4odXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9tYXJrZXQnLCdfc2VsZicpO1xuXHRcdCAgICAgICAgICAgICAgXHRuZXcgUE5vdGlmeSh7XG5cdFx0ICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0JpZW52ZW5pZG8hJyxcblx0XHQgICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEubXNnLFxuXHRcdCAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nLFxuXHRcdCAgICAgICAgICAgICAgICAgICAgZGVsYXk6IDUwMFxuXHRcdCAgICAgICAgICAgICAgICB9KTtcblx0XHQgICAgICAgICAgICAgIFxuXHRcdCAgICAgICAgICAgICAgfWVsc2V7XG5cdFx0ICAgICAgICAgICAgICAgICQoJyNmb3JtLWxvZ2lubWFya2V0JykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoZGF0YS5tc2cpOyBcblx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnZhbCgnR3VhcmRhcicpO1xuXHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0ICAgICAgICAgICAgICB9XG5cdFx0ICAgICAgICAgICAgfSxcblx0XHQgICAgICAgICAgICBlcnJvcjpmdW5jdGlvbihqcVhIUix0ZXh0U3RhdHVzLGVycm9yVGhyb3duKXtcblx0XHQgICAgICAgICAgICAgICQoJyNmb3JtLWxvZ2lubWFya2V0JykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoanFYSFIuc3RhdHVzKycgJyt0ZXh0U3RhdHVzKTtcblx0XHQgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcblxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgZXJyb3JMYWJlbENvbnRhaW5lcjogXCIjZXJyb3JfbWVzc2FnZV9ib3hcIixcblx0ICAgICAgICB3cmFwcGVyOiBcImxpXCIsXG5cdCAgICAgICAgcnVsZXM6XG5cdCAgICAgICAgICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgfSk7XG5cdH0sXG5cdGhhbmRsZV9yZWdpc3Rlcl9zdWJtaXQgOmZ1bmN0aW9uICgpe1xuXHRcdCAkKCcjZm9ybS1yZWdpc3Rlcm1hcmtldCcpLmZpbmQoJy5lcnJvcnMnKS5oaWRlKCk7XG5cdFx0ICQoJyNmb3JtLXJlZ2lzdGVybWFya2V0JykudmFsaWRhdGUoe1xuXHQgICAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uIChmb3JtKVxuXHQgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgICQuYWpheCh7XG5cdCAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLCBcblx0ICAgICAgICAgICAgICAgICAgICB1cmw6ICAkKCcjZm9ybS1yZWdpc3Rlcm1hcmtldCcpLmF0dHIoIFwiYWN0aW9uXCIgKSxcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhOiAgJCggJyNmb3JtLXJlZ2lzdGVybWFya2V0JyApLnNlcmlhbGl6ZSgpLCBcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCBcblx0XHRcdCAgICAgICAgICAgIGJlZm9yZVNlbmQ6ZnVuY3Rpb24oKXtcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdQcm9jZXNhbmRvLi4uJyk7XG5cdFx0XHQgICAgICAgICAgICB9LFxuXHRcdFx0ICAgICAgICAgICAgc3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0ICAgICAgICAgICAgICBpZighZGF0YS5lcnJvcil7XG5cdFx0XHQgICAgICAgICAgICAgIFx0bmV3IFBOb3RpZnkoe1xuXHRcdFx0ICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0JpZW52ZW5pZG8hJyxcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJ1xuXHRcdFx0ICAgICAgICAgICAgICAgIH0pO1xuXHRcdFx0ICAgICAgICAgICAgICAgd2luZG93Lm9wZW4odXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9tYXJrZXQnLCdfc2VsZicpO1xuXHRcdFx0ICAgICAgICAgICAgICBcblx0XHRcdCAgICAgICAgICAgICAgfWVsc2V7XG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI2Zvcm0tcmVnaXN0ZXJtYXJrZXQnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChkYXRhLm1zZyk7IFxuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS52YWwoJ0d1YXJkYXInKTtcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHQgICAgICAgICAgICAgIH1cblx0XHRcdCAgICAgICAgICAgIH0sXG5cdFx0XHQgICAgICAgICAgICBlcnJvcjpmdW5jdGlvbihqcVhIUix0ZXh0U3RhdHVzLGVycm9yVGhyb3duKXtcblx0XHRcdCAgICAgICAgICAgICAgICQoJyNmb3JtLXJlZ2lzdGVybWFya2V0JykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoanFYSFIuc3RhdHVzKycgJyt0ZXh0U3RhdHVzKTtcblx0XHRcdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH0pXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBlcnJvckxhYmVsQ29udGFpbmVyOiBcIiNlcnJvcl9tZXNzYWdlX2JveFwiLFxuXHQgICAgICAgIHdyYXBwZXI6IFwibGlcIixcblx0ICAgICAgICBydWxlczpcblx0ICAgICAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgICAgICBmaXJzdF9uYW1lOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgZW1haWw6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgfSk7XG5cdH0sXG5cdGhhbmRsZV9wYWdvX2NjIDpmdW5jdGlvbiAoKXtcblx0XHQgJCgnI2Zvcm0tcGFnby1jYycpLmZpbmQoJy5lcnJvcnMnKS5oaWRlKCk7XG5cdFx0ICQoJyNmb3JtLXBhZ28tY2MnKS52YWxpZGF0ZSh7XG5cdCAgICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKGZvcm0pXG5cdCAgICAgICAge1xuXG5cdCAgICAgICAgICAgICAgICAkLmFqYXgoe1xuXHQgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJywgXG5cdCAgICAgICAgICAgICAgICAgICAgdXJsOiAgJCgnI2Zvcm0tcGFnby1jYycpLmF0dHIoIFwiYWN0aW9uXCIgKSxcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhOiAgJCggJyNmb3JtLXBhZ28tY2MnICkuc2VyaWFsaXplKCksIFxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsIFxuXHQgICAgICAgICAgICAgICAgICAgIGFzeW5jOmZhbHNlLFxuXHRcdFx0ICAgICAgICAgICAgYmVmb3JlU2VuZDpmdW5jdGlvbigpe1xuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0X2NjJykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXRfY2MnKS52YWwoJ1Byb2Nlc2FuZG8uLi4nKTtcblx0XHRcdCAgICAgICAgICAgIH0sXG5cdFx0XHQgICAgICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHQgICAgICAgICAgICAgIGlmKCFkYXRhLmVycm9yKXtcblx0XHRcdCAgICAgICAgICAgICAgXHRjdGxnLmNsZWFyX2NhcnQoKTtcblx0XHRcdCAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvQ2FydHMvZmluYWxpemFyJywnX3NlbGYnKTtcblx0XHRcdCAgICAgICAgICAgICAgXG5cdFx0XHQgICAgICAgICAgICAgIH1lbHNle1xuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNmb3JtLXBhZ28tY2MnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChkYXRhLm1zZyk7IFxuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXRfY2MnKS52YWwoJ0d1YXJkYXInKTtcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0X2NjJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHQgICAgICAgICAgICAgIH1cblx0XHRcdCAgICAgICAgICAgIH0sXG5cdFx0XHQgICAgICAgICAgICBlcnJvcjpmdW5jdGlvbihqcVhIUix0ZXh0U3RhdHVzLGVycm9yVGhyb3duKXtcblx0XHRcdCAgICAgICAgICAgIFx0dXRpbHMubG9nKGpxWEhSKTtcblx0XHRcdCAgICAgICAgICAgIFx0dXRpbHMubG9nKHRleHRTdGF0dXMpO1xuXHRcdFx0ICAgICAgICAgICAgXHR1dGlscy5sb2coZXJyb3JUaHJvd24pO1xuXHRcdFx0ICAgICAgICAgICAgICAgJCgnI2Zvcm0tcGFnby1jYycpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGpxWEhSLnN0YXR1cysnICcrdGV4dFN0YXR1cyk7XG5cdFx0XHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9KVxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgZXJyb3JMYWJlbENvbnRhaW5lcjogXCIjZXJyb3JfbWVzc2FnZV9ib3hcIixcblx0ICAgICAgICB3cmFwcGVyOiBcImxpXCIsXG5cdCAgICAgICAgcnVsZXM6XG5cdCAgICAgICAgICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICAgICAgY3JlZGl0X2NhcmQ6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgICAgICBcImNhcmQtbnVtYmVyXCI6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgICAgICBcImV4cGlyeS1tb250aFwiOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgXCJleHBpcnkteWVhclwiOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICB9KTtcblx0fSxcblx0aGFuZGxlX2VudHJlZ2Ffc3VibWl0IDpmdW5jdGlvbiAoKXtcblx0XHQgJCgnI2Zvcm0tZW50cmVnYScpLmZpbmQoJy5lcnJvcnMnKS5oaWRlKCk7XG5cdFx0ICQoJyNmb3JtLWVudHJlZ2EnKS52YWxpZGF0ZSh7XG5cdCAgICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKGZvcm0pXG5cdCAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgJC5hamF4KHtcblx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsIFxuXHQgICAgICAgICAgICAgICAgICAgIHVybDogICQoJyNmb3JtLWVudHJlZ2EnKS5hdHRyKCBcImFjdGlvblwiICksXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YTogICQoICcjZm9ybS1lbnRyZWdhJyApLnNlcmlhbGl6ZSgpLCBcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCBcblx0XHRcdCAgICAgICAgICAgIGJlZm9yZVNlbmQ6ZnVuY3Rpb24oKXtcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdQcm9jZXNhbmRvLi4uJyk7XG5cdFx0XHQgICAgICAgICAgICB9LFxuXHRcdFx0ICAgICAgICAgICAgc3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0ICAgICAgICAgICAgICBpZighZGF0YS5lcnJvcil7XG5cdFx0XHQgICAgICAgICAgICAgIFx0bmV3IFBOb3RpZnkoe1xuXHRcdFx0ICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0luZm9ybWFjacOzbiBhY3R1YWxpemFkYSEnLFxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1zZyxcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nXG5cdFx0XHQgICAgICAgICAgICAgICAgfSk7XG5cdFx0XHQgICAgICAgICAgICAgICB3aW5kb3cub3Blbih1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL0NhcnRzL3BhZ28nLCdfc2VsZicpO1xuXHRcdFx0ICAgICAgICAgICAgICBcblx0XHRcdCAgICAgICAgICAgICAgfWVsc2V7XG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI2Zvcm0tZW50cmVnYScpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGRhdGEubXNnKTsgXG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnZhbCgnR3VhcmRhcicpO1xuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdCAgICAgICAgICAgICAgfVxuXHRcdFx0ICAgICAgICAgICAgfSxcblx0XHRcdCAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKGpxWEhSLHRleHRTdGF0dXMsZXJyb3JUaHJvd24pe1xuXHRcdFx0ICAgICAgICAgICAgICAgJCgnI2Zvcm0tZW50cmVnYScpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGpxWEhSLnN0YXR1cysnICcrdGV4dFN0YXR1cyk7XG5cdFx0XHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9KVxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgZXJyb3JMYWJlbENvbnRhaW5lcjogXCIjZXJyb3JfbWVzc2FnZV9ib3hcIixcblx0ICAgICAgICB3cmFwcGVyOiBcImxpXCIsXG5cdCAgICAgICAgcnVsZXM6XG5cdCAgICAgICAgICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICAgICAgZmlyc3RfbmFtZTogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIGxhc3RfbmFtZTogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIGFkZHJlc3NfMTogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIHBob25lX251bWJlcjogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIGVtYWlsOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgIH0pO1xuXHR9LFxuXHRoYW5kbGVfcHJvZHVjdF9yZXZpZXdfc3VibWl0IDpmdW5jdGlvbiAoKXtcblx0XHQgJCgnI2Zvcm0tcHJvZHVjdHJldmlldycpLmZpbmQoJy5lcnJvcnMnKS5oaWRlKCk7XG5cdFx0ICQoJyNmb3JtLXByb2R1Y3RyZXZpZXcnKS52YWxpZGF0ZSh7XG5cdCAgICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKGZvcm0pXG5cdCAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgJC5hamF4KHtcblx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsIFxuXHQgICAgICAgICAgICAgICAgICAgIHVybDogICQoJyNmb3JtLXByb2R1Y3RyZXZpZXcnKS5hdHRyKCBcImFjdGlvblwiICksXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YTogICQoICcjZm9ybS1wcm9kdWN0cmV2aWV3JyApLnNlcmlhbGl6ZSgpLCBcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCBcblx0XHRcdCAgICAgICAgICAgIGJlZm9yZVNlbmQ6ZnVuY3Rpb24oKXtcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdQcm9jZXNhbmRvLi4uJyk7XG5cdFx0XHQgICAgICAgICAgICB9LFxuXHRcdFx0ICAgICAgICAgICAgc3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0ICAgICAgICAgICAgICBpZighZGF0YS5lcnJvcil7XG5cdFx0XHQgICAgICAgICAgICAgIFx0JGNvbnRlbmVkb3IgPSAkKCcjcHJvZHVjdHJldmlld3MnKTtcblx0XHRcdFx0XHRcdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0L2dldF9yZXZpZXcnLHsnSUQnOmRhdGEuSUR9LGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdFx0XHRcdFx0JGNvbnRlbmVkb3IucHJlcGVuZChkYXRhKTtcblx0XHRcdFx0XHRcdFx0fSwndGV4dCcpO1xuXHRcdFx0XHRcdFx0XHQkKCcjZm9ybS1wcm9kdWN0cmV2aWV3JykudHJpZ2dlcigncmVzZXQnKTtcblx0XHRcdCAgICAgICAgICAgICAgfWVsc2V7XG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI2Zvcm0tcHJvZHVjdHJldmlldycpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGRhdGEubXNnKTsgXG5cdFx0XHQgICAgICAgICAgICAgIH1cblx0XHRcdCAgICAgICAgICAgIH0sXG5cdFx0XHQgICAgICAgICAgICBlcnJvcjpmdW5jdGlvbihqcVhIUix0ZXh0U3RhdHVzLGVycm9yVGhyb3duKXtcblx0XHRcdCAgICAgICAgICAgICAgICQoJyNmb3JtLWVudHJlZ2EnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChqcVhIUi5zdGF0dXMrJyAnK3RleHRTdGF0dXMpO1xuXHRcdFx0ICAgICAgICAgICAgfSxcblx0XHRcdCAgICAgICAgICAgIGNvbXBsZXRlOmZ1bmN0aW9uKCl7XG5cdFx0XHQgICAgICAgICAgICBcdCQoJyNzdWJtaXQnKS52YWwoJ0d1YXJkYXInKTtcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9KVxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgZXJyb3JMYWJlbENvbnRhaW5lcjogXCIjZXJyb3JfbWVzc2FnZV9ib3hcIixcblx0ICAgICAgICB3cmFwcGVyOiBcImxpXCIsXG5cdCAgICAgICAgcnVsZXM6XG5cdCAgICAgICAgICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICAgICAgbm9tYnJlOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgZW1haWw6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgICAgICBkZXRhbGxlOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICB9KTtcblx0fSxcbn0iLCJtb2R1bGUuZXhwb3J0cz17XG5cdGxvZzogZnVuY3Rpb24oc3RyaW5nKXtcblx0XHRpZihjb25zb2xlKSBjb25zb2xlLmxvZyhzdHJpbmcpO1xuXHR9LFxuXHQvL09idGllbmUgdW4gYXJyYXkgY29uIHRvZG9zIGxvcyBzZWdtZXRvcyBkZSBsYSBVUkxcblx0Z2V0QmFzZVBhdGggOiBmdW5jdGlvbigpe1xuXHRcdHZhciBwb3J0ID0gd2luZG93LmxvY2F0aW9uLnBvcnQ7XG5cdFx0dmFyIHBhdGhBcnJheSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnLycpO1xuXHRcdHZhciBhcHBsaWNhY2lvbiA9ICh3aW5kb3cubG9jYXRpb24uaG9zdCA9PT0gXCIxMjcuMC4wLjFcIiB8fCB3aW5kb3cubG9jYXRpb24uaG9zdCA9PT0gXCJsb2NhbGhvc3RcIiB8fCB3aW5kb3cubG9jYXRpb24uaG9zdC5pbmRleE9mKCcxOTIuMTY4LicpICE9PSAtMSkgPyBwYXRoQXJyYXlbMV0gOiAnJztcblx0XHRpZihwb3J0PT09XCIzMDAwXCIpe1xuXHRcdFx0YXBwbGljYWNpb24gPSBhcHBsaWNhY2lvbisncG9zLyc7XG5cdFx0fVxuXHRcdGlmICghd2luZG93LmxvY2F0aW9uLm9yaWdpbilcblx0XHRcdHJldHVybiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArIFwiL1wiICsgYXBwbGljYWNpb247XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIGFwcGxpY2FjaW9uO1xuXHR9XG59Il19
