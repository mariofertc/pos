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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi92YXIvd3d3L2h0bWwvcG9zL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi92YXIvd3d3L2h0bWwvcG9zL2Fzc2V0cy93ZWIvanMvZGV2L2NhdGFsb2dvLmpzIiwiL3Zhci93d3cvaHRtbC9wb3MvYXNzZXRzL3dlYi9qcy9kZXYvZmFrZV82ZGQzM2E2Ny5qcyIsIi92YXIvd3d3L2h0bWwvcG9zL2Fzc2V0cy93ZWIvanMvZGV2L2Zvcm11bGFyaW9zLmpzIiwiL3Zhci93d3cvaHRtbC9wb3MvYXNzZXRzL3dlYi9qcy9kZXYvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cdGZybXM9cmVxdWlyZSgnLi9mb3JtdWxhcmlvcycpO1xubW9kdWxlLmV4cG9ydHM9e1xuXHRhZGRfZmlsdGVyX3RvX21hcmtlZCA6IGZ1bmN0aW9uIChmaWx0cm8pe1xuXHRcdCRidG4gID0gJChmaWx0cm8pO1xuXHQgICAgJGJ0bi50b2dnbGVDbGFzcygnYWN0aXZlJylcblx0XHRpZigkYnRuLmNzcygnb3BhY2l0eScpPT0xKXtcblx0XHRcdCRidG4uYW5pbWF0ZSh7J29wYWNpdHknOjAuNX0sIDIwMCk7XG5cdFx0fWVsc2V7IFxuXHRcdFx0JGJ0bi5hbmltYXRlKHsnb3BhY2l0eSc6MX0sIDIwMCk7XG5cdFx0fVxuXHQgICAgLy9Bw7FhZGUgbGEgY2F0ZWdvcmlhIHNlbGVjY2lvbmFkYSBhbCBkaXYgZGUgZmlsdHJvIGFwbGljYWRvc1xuXHRcdC8qJGZpbHRyb3MgPSAkKCcubWFya2V0LWFwcGxpZWQtZmlsdGVycycpO1xuXHRcdCRmaWx0cm9zLmZpbmQoJ1tmaWx0ZXI9XCInKyQoZmlsdHJvKS5hdHRyKCdmaWx0ZXInKSsnXCJdJykucmVtb3ZlKCk7XG5cdFx0JGxpID0kKCc8bGk+PC9saT4nKTtcblx0XHQkbGkuYXR0cigndGlwbycsJChmaWx0cm8pLmF0dHIoJ3RpcG8nKSk7XG5cdFx0JGxpLmF0dHIoJ2ZpbHRlcicsJChmaWx0cm8pLmF0dHIoJ2ZpbHRlcicpKTtcblx0XHQkbGkuaHRtbCgkKGZpbHRybykuYXR0cignZmlsdGVyJykpO1xuXHRcdCRmaWx0cm9zLmFwcGVuZCgkbGkpOyovXG5cdH0sXG5cdGdldF9maWx0ZXJzIDpmdW5jdGlvbiAoKXtcblx0XHR2YXIgZmlsdGVycz17J2NhdGVnb3JpYSc6W10sJ3ByZWNpb3MnOltdfTtcblx0XHQkLmVhY2goJCgnLm1hcmtldC1maWx0ZXInKSxmdW5jdGlvbihpbmRleCwgZWwpIHtcblx0XHRcdGlmKCQoZWwpLmhhc0NsYXNzKCdhY3RpdmUnKSlcblx0XHRcdFx0ZmlsdGVyc1skKGVsKS5hdHRyKCd0aXBvJyldLnB1c2goJChlbCkuYXR0cignZmlsdGVyJykpO1xuXHRcdH0pO1xuXHRcdGZpbHRlcnMucHJlY2lvcz0kKCcjc2wyJykudmFsKCk7XG5cdFx0dmFyIHVsdCA9ICQoJy5mZWF0dXJlc19pdGVtcyAucHJvZHVjdC1pbWFnZS13cmFwcGVyOmxhc3QnKTtcblx0XHRmaWx0ZXJzLnVsdGltbyA9IHVsdC5pbmRleCgnLnByb2R1Y3QtaW1hZ2Utd3JhcHBlcicpO1xuXHRcdGNvbnNvbGUubG9nKGZpbHRlcnMudG9Tb3VyY2UoKSk7XG5cdFx0cmV0dXJuIGZpbHRlcnM7XG5cdH0sXG5cdGxvYWRfZGVzdGFjYWRvcyA6IGZ1bmN0aW9uKCl7XG5cdFx0JCgnI21hcmtldC1kZXN0YWNhZG9zJykubG9hZCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL21hcmtldC9kZXN0YWNhZG9zJyk7XG5cdH0sXG5cdHJlbG9hZF9jYXRhbG9nbyA6ZnVuY3Rpb24gKCl7XG5cdFx0dmFyIGZpbHRyb3MgPSB0aGlzLmdldF9maWx0ZXJzKCk7XG5cdFx0ZmlsdHJvcy51bHRpbW89LTE7XG5cdFx0JC5nZXQodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9tYXJrZXQvY2F0YWxvZ28nLGZpbHRyb3MsIGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdGlmKGRhdGEhPVwiXCIpe1xuXHRcdFx0XHQkKCcjbWFya2V0LWNhdGFsb2dvJykuaHRtbChkYXRhKS5hbmltYXRlKHtvcGFjY2l0eTowLjh9LCA1MDApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXHRyZWZyZXNoX2NhdGFsb2dvIDpmdW5jdGlvbiAoKXtcblx0XHR2YXIgZmlsdHJvcyA9IHRoaXMuZ2V0X2ZpbHRlcnMoKTtcblx0XHQkLmdldCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL21hcmtldC9jYXRhbG9nbycsZmlsdHJvcywgZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0aWYoZGF0YSE9XCJcIil7XG5cdFx0XHRcdGlmKGZpbHRyb3MudWx0aW1vID09IC0xKXtcblx0XHRcdFx0XHQkKCcjbWFya2V0LWNhdGFsb2dvJykuaHRtbChkYXRhKS5hbmltYXRlKHtvcGFjY2l0eTowLjh9LCA1MDApO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHQkKCcjbWFya2V0LWNhdGFsb2dvJykuYXBwZW5kKGRhdGEpLmFuaW1hdGUoe29wYWNjaXR5OjAuOH0sIDUwMCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblx0aGFuZGxlX2FkZF90b193bGlzdDogZnVuY3Rpb24oaXRlbSl7XG5cdFx0JHByb2R1Y3RvID0gJChpdGVtKTtcblx0XHR2YXIgaWRfcHJvZHVjdG8gPSAkcHJvZHVjdG8uYXR0cignaHJlZicpO1xuXHRcdCQucG9zdCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL1dsaXN0L2FkZF90b193bGlzdCcseydwcm9kdWN0byc6aWRfcHJvZHVjdG99LGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0aWYoIWRhdGEuZXJyb3Ipe1xuXHRcdFx0IG5ldyBQTm90aWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQcm9kdWN0byBhZ3JlZ2FkbyEnLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1zZyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nLFxuXHRcdCAgICAgICAgICAgIGRlbGF5OiAyMDBcbiAgICAgICAgICAgICAgICB9KTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHQgQ3VzdG9tYm94Lm9wZW4oe1xuXHQgICAgICAgICAgICAgICAgdGFyZ2V0OiBkYXRhLm1zZyxcblx0ICAgICAgICAgICAgICAgIGVmZmVjdDogJ2ZhZGVpbicsXG5cdCAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKXtcblx0XHRcdFx0XHQgZnJtcy5oYW5kbGVfbG9naW5fc3VibWl0KCk7XG5cdFx0XHRcdFx0IGZybXMuaGFuZGxlX3JlZ2lzdGVyX3N1Ym1pdCgpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9KTtcblx0XHRcdH1cblx0XHR9LCdqc29uJyk7XG5cdH0sXG5cdGhhbmRsZV9yZW1vdmVfZnJvbV93bGlzdDogZnVuY3Rpb24oaXRlbSl7XG5cdFx0JHRoaXM9dGhpcztcblx0XHQkcHJvZHVjdG8gPSAkKGl0ZW0pO1xuXHRcdHZhciBpZF9wcm9kdWN0byA9ICRwcm9kdWN0by5hdHRyKCdocmVmJyk7XG5cdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvV2xpc3QvcmVtb3ZlX2Zyb21fd2xpc3QnLHsncHJvZHVjdG8nOmlkX3Byb2R1Y3RvfSxmdW5jdGlvbihkYXRhKXtcblx0XHRcdGlmKCFkYXRhLmVycm9yKXtcblx0XHRcdFx0JHByb2R1Y3RvLnBhcmVudHMoJ3RyJykuZmFkZU91dCgnc2xvdycpLnJlbW92ZSgpO1xuXHRcdFx0XHQgbmV3IFBOb3RpZnkoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Byb2R1Y3RvciByZXRpcmFkbyEnLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1zZyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nLFxuXHRcdCAgICAgICAgICAgIGRlbGF5OiAyMDBcbiAgICAgICAgICAgICAgICB9KTtcblx0XHRcdH1cblx0XHR9LCdqc29uJyk7XG5cdH0sXG5cdGhhbmRsZV9hZGRfdG9fY2FydDogZnVuY3Rpb24oaXRlbSl7XG5cdFx0JHByb2R1Y3RvID0gJChpdGVtKTtcblx0XHR2YXIgaWRfcHJvZHVjdG8gPSAkcHJvZHVjdG8uYXR0cignaHJlZicpO1xuXHRcdCQucG9zdCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL0NhcnRzL2FkZF90b19jYXJ0Jyx7J3Byb2R1Y3RvJzppZF9wcm9kdWN0b30sZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRpZighZGF0YS5lcnJvcil7XG5cdFx0XHQgbmV3IFBOb3RpZnkoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Byb2R1Y3RvIGFncmVnYWRvIScsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEubXNnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5mbycsXG5cdFx0ICAgICAgICAgICAgZGVsYXk6IDIwMFxuICAgICAgICAgICAgICAgIH0pO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdCBDdXN0b21ib3gub3Blbih7XG5cdCAgICAgICAgICAgICAgICB0YXJnZXQ6IGRhdGEubXNnLFxuXHQgICAgICAgICAgICAgICAgZWZmZWN0OiAnZmFkZWluJyxcblx0ICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdCBmcm1zLmhhbmRsZV9sb2dpbl9zdWJtaXQoKTtcblx0XHRcdFx0XHQgZnJtcy5oYW5kbGVfcmVnaXN0ZXJfc3VibWl0KCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0pO1xuXHRcdFx0fVxuXG5cdFx0fSwnanNvbicpO1xuXHR9LFxuXHRoYW5kbGVfcmVtb3ZlX2Zyb21fY2FydDogZnVuY3Rpb24oaXRlbSl7XG5cdFx0JHRoaXM9dGhpcztcblx0XHQkcHJvZHVjdG8gPSAkKGl0ZW0pO1xuXHRcdHZhciBpZF9wcm9kdWN0byA9ICRwcm9kdWN0by5hdHRyKCdocmVmJyk7XG5cdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvQ2FydHMvcmVtb3ZlX2Zyb21fY2FydCcseydwcm9kdWN0byc6aWRfcHJvZHVjdG99LGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0aWYoIWRhdGEuZXJyb3Ipe1xuXHRcdFx0XHQkcHJvZHVjdG8ucGFyZW50cygndHInKS5mYWRlT3V0KCdzbG93JykucmVtb3ZlKCk7XG5cdFx0XHRcdCR0aGlzLnN1YnRvdGFsX2NhcnQoKTtcblx0XHRcdFx0bmV3IFBOb3RpZnkoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Byb2R1Y3RvciByZXRpcmFkbyEnLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1zZyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nLFxuXHRcdCAgICAgICAgICAgIGRlbGF5OiAyMDBcbiAgICAgICAgICAgICAgICB9KTtcblx0XHRcdH1cblx0XHR9LCdqc29uJyk7XG5cdH0sXG5cdGNsZWFyX2NhcnQ6ZnVuY3Rpb24oKXtcblx0XHQkdGhpcz10aGlzO1xuXHRcdCQucG9zdCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL0NhcnRzL2NsZWFyX2NhcnQnLHt9LGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0aWYoIWRhdGEuZXJyb3Ipe1xuXHRcdFx0XHQkdGhpcy5zdWJ0b3RhbF9jYXJ0KCk7XG5cdFx0XHR9XG5cdFx0fSwnanNvbicpO1xuXHR9LFxuXHRzdWJ0b3RhbF9pdGVtOmZ1bmN0aW9uKHRyKXtcblx0XHQkdHIgPSAgJCh0cik7XG5cdFx0dmFyIHByZWNpbyA9IHBhcnNlRmxvYXQoJHRyLmZpbmQoJy5jYXJ0X3ByaWNlIHAgc3BhbicpLmh0bWwoKSk7XG5cdFx0dmFyIGNhbnRpZGFkID0gcGFyc2VJbnQoJHRyLmZpbmQoJy5jYXJ0X3F1YW50aXR5X2lucHV0JykudmFsKCkpO1xuXHRcdHZhciByZXN1bHRhZG8gPSAkdHIuZmluZCgnLmNhcnRfdG90YWxfcHJpY2Ugc3BhbicpO1xuXHRcdHJlc3VsdGFkby5odG1sKHByZWNpbypjYW50aWRhZCk7XG5cdH0sXG5cdHN1YnRvdGFsX2NhcnQ6ZnVuY3Rpb24oKXtcblx0XHR2YXIgYWN1bXVsYWRvcj0wO1xuXHRcdCQuZWFjaCgkKCcjaXRlbXMtY2Fycml0byB0cicpLCBmdW5jdGlvbihpbmRleCwgdmFsKSB7XG5cdFx0XHQgJGl0ZW0gPSAkKHZhbCk7XG5cblx0XHRcdCB2YXIgc3VidG90YWwgPSBwYXJzZUZsb2F0KCRpdGVtLmZpbmQoJy5jYXJ0X3RvdGFsX3ByaWNlIHNwYW4nKS5odG1sKCkpO1xuXHRcdFx0IGFjdW11bGFkb3IrPXN1YnRvdGFsO1xuXHRcdH0pO1xuXHRcdFxuXHRcdHZhciBzdWJ0b3RhbF9jYXJ0ID0gJCgnI2NhcnQtc3VidG90YWwgc3BhbicpO1xuXHRcdHN1YnRvdGFsX2NhcnQuaHRtbChhY3VtdWxhZG9yKTtcblxuXHRcdHZhciB0b3RhbF9jYXJ0ID0gJCgnI2NhcnQtdG90YWwgc3BhbicpO1xuXHRcdHRvdGFsX2NhcnQuaHRtbChhY3VtdWxhZG9yKTtcblx0fSxcblx0dXBkYXRlX2NhbnRpZGFkX2l0ZW06IGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdCR0aGlzPXRoaXM7XG5cdFx0JHByb2R1Y3RvID0gJChpdGVtKTtcblx0XHR2YXIgaWRfcHJvZHVjdG8gPSAkcHJvZHVjdG8uYXR0cignaHJlZicpO1xuXHRcdHZhciBjYW50aWRhZCA9IHBhcnNlSW50KCRwcm9kdWN0by5hdHRyKCd2YWwnKSk7XG5cblx0XHQkaW5wdXQgPSAkcHJvZHVjdG8uc2libGluZ3MoJy5jYXJ0X3F1YW50aXR5X2lucHV0Jyk7XG5cdFx0dmFyIHZhbG9yID0gcGFyc2VJbnQoJGlucHV0LnZhbCgpKTtcblx0XHR2YXIgdG90YWwgPSB2YWxvcitjYW50aWRhZDtcblx0XHRpZih0b3RhbD4wKVxuXHRcdCQucG9zdCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL0NhcnRzL2FkZF90b19jYXJ0Jyx7J3Byb2R1Y3RvJzppZF9wcm9kdWN0bywnY2FudGlkYWQnOnRvdGFsfSxmdW5jdGlvbihkYXRhKXtcblx0XHRcdGlmKCFkYXRhLmVycm9yKXtcblx0XHRcdFx0aWYoY2FudGlkYWQ9PTApe1xuXHRcdFx0XHRcdG5ldyBQTm90aWZ5KHtcblx0XHQgICAgICAgICAgICAgICAgdGl0bGU6ICdQcm9kdWN0byBhZ3JlZ2FkbyEnLFxuXHRcdCAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1zZyxcblx0XHQgICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nLFxuXHRcdFx0ICAgICAgICAgICAgZGVsYXk6IDIwMFxuXHRcdCAgICAgICAgICAgIH0pO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHQkaW5wdXQudmFsKHRvdGFsKTtcblx0XHRcdFx0XHQkdGhpcy5zdWJ0b3RhbF9pdGVtKCRpbnB1dC5wYXJlbnRzKCd0cicpKTtcblx0XHRcdFx0XHQkdGhpcy5zdWJ0b3RhbF9jYXJ0KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1lbHNle1xuXHRcdFx0XHQgQ3VzdG9tYm94Lm9wZW4oe1xuXHQgICAgICAgICAgICAgICAgdGFyZ2V0OiBkYXRhLm1zZyxcblx0ICAgICAgICAgICAgICAgIGVmZmVjdDogJ2ZhZGVpbicsXG5cdCAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKXtcblx0XHRcdFx0XHQgZnJtcy5oYW5kbGVfbG9naW5fc3VibWl0KCk7XG5cdFx0XHRcdFx0IGZybXMuaGFuZGxlX3JlZ2lzdGVyX3N1Ym1pdCgpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9KTtcblx0XHRcdH1cblx0XHR9LCdqc29uJyk7XG5cdH1cbn0iLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyksXHJcbiBjYXRhbG9nbyA9IHJlcXVpcmUoJy4vY2F0YWxvZ28nKSxcclxuIGZybXMgPSByZXF1aXJlKCcuL2Zvcm11bGFyaW9zJyk7XHJcblxyXG51dGlscy5sb2codXRpbHMuZ2V0QmFzZVBhdGgoKSk7IFxyXG4vKnByaWNlIHJhbmdlKi9cclxuJCgnI3NsMicpLnNsaWRlcigpLm9uKCdzbGlkZScsZnVuY3Rpb24oKXtjYXRhbG9nby5yZWxvYWRfY2F0YWxvZ28oKX0pO1xyXG5cclxuLypzY3JvbGwgdG8gdG9wKi9cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuXHQkKGZ1bmN0aW9uICgpIHtcclxuXHRcdCQuc2Nyb2xsVXAoe1xyXG5cdCAgICAgICAgc2Nyb2xsTmFtZTogJ3Njcm9sbFVwJywgLy8gRWxlbWVudCBJRFxyXG5cdCAgICAgICAgc2Nyb2xsRGlzdGFuY2U6IDMwMCwgLy8gRGlzdGFuY2UgZnJvbSB0b3AvYm90dG9tIGJlZm9yZSBzaG93aW5nIGVsZW1lbnQgKHB4KVxyXG5cdCAgICAgICAgc2Nyb2xsRnJvbTogJ3RvcCcsIC8vICd0b3AnIG9yICdib3R0b20nXHJcblx0ICAgICAgICBzY3JvbGxTcGVlZDogMzAwLCAvLyBTcGVlZCBiYWNrIHRvIHRvcCAobXMpXHJcblx0ICAgICAgICBlYXNpbmdUeXBlOiAnbGluZWFyJywgLy8gU2Nyb2xsIHRvIHRvcCBlYXNpbmcgKHNlZSBodHRwOi8vZWFzaW5ncy5uZXQvKVxyXG5cdCAgICAgICAgYW5pbWF0aW9uOiAnZmFkZScsIC8vIEZhZGUsIHNsaWRlLCBub25lXHJcblx0ICAgICAgICBhbmltYXRpb25TcGVlZDogMjAwLCAvLyBBbmltYXRpb24gaW4gc3BlZWQgKG1zKVxyXG5cdCAgICAgICAgc2Nyb2xsVHJpZ2dlcjogZmFsc2UsIC8vIFNldCBhIGN1c3RvbSB0cmlnZ2VyaW5nIGVsZW1lbnQuIENhbiBiZSBhbiBIVE1MIHN0cmluZyBvciBqUXVlcnkgb2JqZWN0XHJcblx0XHRcdFx0XHQvL3Njcm9sbFRhcmdldDogZmFsc2UsIC8vIFNldCBhIGN1c3RvbSB0YXJnZXQgZWxlbWVudCBmb3Igc2Nyb2xsaW5nIHRvIHRoZSB0b3BcclxuXHQgICAgICAgIHNjcm9sbFRleHQ6ICc8aSBjbGFzcz1cImZhIGZhLWFuZ2xlLXVwXCI+PC9pPicsIC8vIFRleHQgZm9yIGVsZW1lbnQsIGNhbiBjb250YWluIEhUTUxcclxuXHQgICAgICAgIHNjcm9sbFRpdGxlOiBmYWxzZSwgLy8gU2V0IGEgY3VzdG9tIDxhPiB0aXRsZSBpZiByZXF1aXJlZC5cclxuXHQgICAgICAgIHNjcm9sbEltZzogZmFsc2UsIC8vIFNldCB0cnVlIHRvIHVzZSBpbWFnZVxyXG5cdCAgICAgICAgYWN0aXZlT3ZlcmxheTogZmFsc2UsIC8vIFNldCBDU1MgY29sb3IgdG8gZGlzcGxheSBzY3JvbGxVcCBhY3RpdmUgcG9pbnQsIGUuZyAnIzAwRkZGRidcclxuXHQgICAgICAgIHpJbmRleDogMjE0NzQ4MzY0NyAvLyBaLUluZGV4IGZvciB0aGUgb3ZlcmxheVxyXG5cdFx0fSk7XHJcblx0fSk7XHJcbn0pO1xyXG5cclxuXHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcubWFya2V0LWZpbHRlcicsZnVuY3Rpb24oZSl7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGNhdGFsb2dvLmFkZF9maWx0ZXJfdG9fbWFya2VkKCQodGhpcykpOyAgICBcclxuXHRjYXRhbG9nby5yZWxvYWRfY2F0YWxvZ28oKTtcclxufSk7XHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcuYWRkLXRvLWNhcnQnLGZ1bmN0aW9uKGUpe1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRjYXRhbG9nby5oYW5kbGVfYWRkX3RvX2NhcnQoJCh0aGlzKSk7ICAgIFxyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5yZW1vdmUtZnJvbS1jYXJ0JyxmdW5jdGlvbihlKXtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0Y2F0YWxvZ28uaGFuZGxlX3JlbW92ZV9mcm9tX2NhcnQoJCh0aGlzKSk7ICAgIFxyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5hZGQtdG8td2xpc3QnLGZ1bmN0aW9uKGUpe1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRjYXRhbG9nby5oYW5kbGVfYWRkX3RvX3dsaXN0KCQodGhpcykpOyAgICBcclxufSk7XHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcucmVtb3ZlLWZyb20td2xpc3QnLGZ1bmN0aW9uKGUpe1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRjYXRhbG9nby5oYW5kbGVfcmVtb3ZlX2Zyb21fd2xpc3QoJCh0aGlzKSk7ICAgIFxyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5jYXJ0X3F1YW50aXR5X3VwLCAuY2FydF9xdWFudGl0eV9kb3duLCAuYWRkLXRvLWNhcnQyJyxmdW5jdGlvbihlKXtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0Y2F0YWxvZ28udXBkYXRlX2NhbnRpZGFkX2l0ZW0oJCh0aGlzKSk7ICAgIFxyXG5cdFxyXG59KTtcclxuXHJcblxyXG4vL29uIHNjcm9sbCBnZXRzIHdoZW4gYm90dG9tIG9mIHRoZSBwYWdlIGlzIHJlYWNoZWQgYW5kIGNhbGxzIHRoZSBmdW5jdGlvbiBkbyBsb2FkIG1vcmUgY29udGVudFxyXG4kKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKGUpe1xyXG5cdC8vTm90IGFsd2F5cyB0aGUgcG9zID09IGggc3RhdGVtZW50IGlzIHZlcmlmaWVkLCBleHBlY2lhbGx5IG9uIG1vYmlsZSBkZXZpY2VzLCB0aGF0J3Mgd2h5IGEgMzAwcHggb2YgbWFyZ2luIGFyZSBhc3N1bWVkLlxyXG5cdGlmKCQod2luZG93KS5zY3JvbGxUb3AoKSArICQod2luZG93KS5oZWlnaHQoKSA+PSAkKGRvY3VtZW50KS5oZWlnaHQoKSAtIDMwMCkge1xyXG5cdFx0dXRpbHMubG9nKFwiRmluYWwgZGUgcMOhZ2luYSBhbGNhbnphZG9cIik7XHJcblx0XHRpZigkKCcjbWFya2V0LWNhdGFsb2dvJykubGVuZ3RoKVxyXG5cdFx0XHRjYXRhbG9nby5yZWZyZXNoX2NhdGFsb2dvKCk7XHJcblx0fVxyXG59KTtcclxuXHJcbmZ1bmN0aW9uIG1haW4oKXtcclxuXHRjYXRhbG9nby5yZWxvYWRfY2F0YWxvZ28oKTtcclxuXHRmcm1zLmhhbmRsZV9sb2dpbl9zdWJtaXQoKTtcclxuXHRmcm1zLmhhbmRsZV9yZWdpc3Rlcl9zdWJtaXQoKTtcclxuXHRmcm1zLmhhbmRsZV9wYWdvX2NjKCk7XHJcblx0ZnJtcy5oYW5kbGVfZW50cmVnYV9zdWJtaXQoKTtcclxuXHRmcm1zLmhhbmRsZV9wcm9kdWN0X3Jldmlld19zdWJtaXQoKTtcclxuXHRjYXRhbG9nby5sb2FkX2Rlc3RhY2Fkb3MoKTtcclxufVxyXG5cclxuJChkb2N1bWVudCkucmVhZHkobWFpbik7XHJcbiIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKSxcblx0Y3RsZz1yZXF1aXJlKCcuL2NhdGFsb2dvJyk7XG5tb2R1bGUuZXhwb3J0cz17XG5cdGhhbmRsZV9sb2dpbl9zdWJtaXQgOmZ1bmN0aW9uICgpe1xuXHRcdCAkKCdmb3JtI2Zvcm0tbG9naW5tYXJrZXQnKS5maW5kKCcuZXJyb3JzJykuaGlkZSgpO1xuXHRcdCAkKCcjZm9ybS1sb2dpbm1hcmtldCcpLnZhbGlkYXRlKHtcblx0ICAgICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoZm9ybSlcblx0ICAgICAgICB7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLCBcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAgJCgnI2Zvcm0tbG9naW5tYXJrZXQnKS5hdHRyKCBcImFjdGlvblwiICksXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6ICAkKCAnI2Zvcm0tbG9naW5tYXJrZXQnICkuc2VyaWFsaXplKCksIFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCBcblx0XHQgICAgICAgICAgICBiZWZvcmVTZW5kOmZ1bmN0aW9uKCl7XG5cdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdQcm9jZXNhbmRvLi4uJyk7XG5cdFx0ICAgICAgICAgICAgfSxcblx0XHQgICAgICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XG5cdFx0ICAgICAgICAgICAgICBpZighZGF0YS5lcnJvcil7XG5cdFx0ICAgICAgICAgICAgICAgd2luZG93Lm9wZW4odXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9tYXJrZXQnLCdfc2VsZicpO1xuXHRcdCAgICAgICAgICAgICAgXHRuZXcgUE5vdGlmeSh7XG5cdFx0ICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0JpZW52ZW5pZG8hJyxcblx0XHQgICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEubXNnLFxuXHRcdCAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nLFxuXHRcdCAgICAgICAgICAgICAgICAgICAgZGVsYXk6IDUwMFxuXHRcdCAgICAgICAgICAgICAgICB9KTtcblx0XHQgICAgICAgICAgICAgIFxuXHRcdCAgICAgICAgICAgICAgfWVsc2V7XG5cdFx0ICAgICAgICAgICAgICAgICQoJyNmb3JtLWxvZ2lubWFya2V0JykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoZGF0YS5tc2cpOyBcblx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnZhbCgnR3VhcmRhcicpO1xuXHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0ICAgICAgICAgICAgICB9XG5cdFx0ICAgICAgICAgICAgfSxcblx0XHQgICAgICAgICAgICBlcnJvcjpmdW5jdGlvbihqcVhIUix0ZXh0U3RhdHVzLGVycm9yVGhyb3duKXtcblx0XHQgICAgICAgICAgICAgICQoJyNmb3JtLWxvZ2lubWFya2V0JykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoanFYSFIuc3RhdHVzKycgJyt0ZXh0U3RhdHVzKTtcblx0XHQgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcblxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgZXJyb3JMYWJlbENvbnRhaW5lcjogXCIjZXJyb3JfbWVzc2FnZV9ib3hcIixcblx0ICAgICAgICB3cmFwcGVyOiBcImxpXCIsXG5cdCAgICAgICAgcnVsZXM6XG5cdCAgICAgICAgICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgfSk7XG5cdH0sXG5cdGhhbmRsZV9yZWdpc3Rlcl9zdWJtaXQgOmZ1bmN0aW9uICgpe1xuXHRcdCAkKCcjZm9ybS1yZWdpc3Rlcm1hcmtldCcpLmZpbmQoJy5lcnJvcnMnKS5oaWRlKCk7XG5cdFx0ICQoJyNmb3JtLXJlZ2lzdGVybWFya2V0JykudmFsaWRhdGUoe1xuXHQgICAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uIChmb3JtKVxuXHQgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgICQuYWpheCh7XG5cdCAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLCBcblx0ICAgICAgICAgICAgICAgICAgICB1cmw6ICAkKCcjZm9ybS1yZWdpc3Rlcm1hcmtldCcpLmF0dHIoIFwiYWN0aW9uXCIgKSxcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhOiAgJCggJyNmb3JtLXJlZ2lzdGVybWFya2V0JyApLnNlcmlhbGl6ZSgpLCBcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCBcblx0XHRcdCAgICAgICAgICAgIGJlZm9yZVNlbmQ6ZnVuY3Rpb24oKXtcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdQcm9jZXNhbmRvLi4uJyk7XG5cdFx0XHQgICAgICAgICAgICB9LFxuXHRcdFx0ICAgICAgICAgICAgc3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0ICAgICAgICAgICAgICBpZighZGF0YS5lcnJvcil7XG5cdFx0XHQgICAgICAgICAgICAgIFx0bmV3IFBOb3RpZnkoe1xuXHRcdFx0ICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0JpZW52ZW5pZG8hJyxcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJ1xuXHRcdFx0ICAgICAgICAgICAgICAgIH0pO1xuXHRcdFx0ICAgICAgICAgICAgICAgd2luZG93Lm9wZW4odXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9tYXJrZXQnLCdfc2VsZicpO1xuXHRcdFx0ICAgICAgICAgICAgICBcblx0XHRcdCAgICAgICAgICAgICAgfWVsc2V7XG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI2Zvcm0tcmVnaXN0ZXJtYXJrZXQnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChkYXRhLm1zZyk7IFxuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS52YWwoJ0d1YXJkYXInKTtcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHQgICAgICAgICAgICAgIH1cblx0XHRcdCAgICAgICAgICAgIH0sXG5cdFx0XHQgICAgICAgICAgICBlcnJvcjpmdW5jdGlvbihqcVhIUix0ZXh0U3RhdHVzLGVycm9yVGhyb3duKXtcblx0XHRcdCAgICAgICAgICAgICAgICQoJyNmb3JtLXJlZ2lzdGVybWFya2V0JykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoanFYSFIuc3RhdHVzKycgJyt0ZXh0U3RhdHVzKTtcblx0XHRcdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH0pXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBlcnJvckxhYmVsQ29udGFpbmVyOiBcIiNlcnJvcl9tZXNzYWdlX2JveFwiLFxuXHQgICAgICAgIHdyYXBwZXI6IFwibGlcIixcblx0ICAgICAgICBydWxlczpcblx0ICAgICAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgICAgICBmaXJzdF9uYW1lOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgZW1haWw6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgfSk7XG5cdH0sXG5cdGhhbmRsZV9wYWdvX2NjIDpmdW5jdGlvbiAoKXtcblx0XHQgJCgnI2Zvcm0tcGFnby1jYycpLmZpbmQoJy5lcnJvcnMnKS5oaWRlKCk7XG5cdFx0ICQoJyNmb3JtLXBhZ28tY2MnKS52YWxpZGF0ZSh7XG5cdCAgICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKGZvcm0pXG5cdCAgICAgICAge1xuXG5cdCAgICAgICAgICAgICAgICAkLmFqYXgoe1xuXHQgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJywgXG5cdCAgICAgICAgICAgICAgICAgICAgdXJsOiAgJCgnI2Zvcm0tcGFnby1jYycpLmF0dHIoIFwiYWN0aW9uXCIgKSxcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhOiAgJCggJyNmb3JtLXBhZ28tY2MnICkuc2VyaWFsaXplKCksIFxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsIFxuXHQgICAgICAgICAgICAgICAgICAgIGFzeW5jOmZhbHNlLFxuXHRcdFx0ICAgICAgICAgICAgYmVmb3JlU2VuZDpmdW5jdGlvbigpe1xuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0X2NjJykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXRfY2MnKS52YWwoJ1Byb2Nlc2FuZG8uLi4nKTtcblx0XHRcdCAgICAgICAgICAgIH0sXG5cdFx0XHQgICAgICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHQgICAgICAgICAgICAgIGlmKCFkYXRhLmVycm9yKXtcblx0XHRcdCAgICAgICAgICAgICAgXHRjdGxnLmNsZWFyX2NhcnQoKTtcblx0XHRcdCAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvQ2FydHMvZmluYWxpemFyJywnX3NlbGYnKTtcblx0XHRcdCAgICAgICAgICAgICAgXG5cdFx0XHQgICAgICAgICAgICAgIH1lbHNle1xuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNmb3JtLXBhZ28tY2MnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChkYXRhLm1zZyk7IFxuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXRfY2MnKS52YWwoJ0d1YXJkYXInKTtcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0X2NjJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHQgICAgICAgICAgICAgIH1cblx0XHRcdCAgICAgICAgICAgIH0sXG5cdFx0XHQgICAgICAgICAgICBlcnJvcjpmdW5jdGlvbihqcVhIUix0ZXh0U3RhdHVzLGVycm9yVGhyb3duKXtcblx0XHRcdCAgICAgICAgICAgIFx0dXRpbHMubG9nKGpxWEhSKTtcblx0XHRcdCAgICAgICAgICAgIFx0dXRpbHMubG9nKHRleHRTdGF0dXMpO1xuXHRcdFx0ICAgICAgICAgICAgXHR1dGlscy5sb2coZXJyb3JUaHJvd24pO1xuXHRcdFx0ICAgICAgICAgICAgICAgJCgnI2Zvcm0tcGFnby1jYycpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGpxWEhSLnN0YXR1cysnICcrdGV4dFN0YXR1cyk7XG5cdFx0XHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9KVxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgZXJyb3JMYWJlbENvbnRhaW5lcjogXCIjZXJyb3JfbWVzc2FnZV9ib3hcIixcblx0ICAgICAgICB3cmFwcGVyOiBcImxpXCIsXG5cdCAgICAgICAgcnVsZXM6XG5cdCAgICAgICAgICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICAgICAgY3JlZGl0X2NhcmQ6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgICAgICBcImNhcmQtbnVtYmVyXCI6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgICAgICBcImV4cGlyeS1tb250aFwiOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgXCJleHBpcnkteWVhclwiOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICB9KTtcblx0fSxcblx0aGFuZGxlX2VudHJlZ2Ffc3VibWl0IDpmdW5jdGlvbiAoKXtcblx0XHQgJCgnI2Zvcm0tZW50cmVnYScpLmZpbmQoJy5lcnJvcnMnKS5oaWRlKCk7XG5cdFx0ICQoJyNmb3JtLWVudHJlZ2EnKS52YWxpZGF0ZSh7XG5cdCAgICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKGZvcm0pXG5cdCAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgJC5hamF4KHtcblx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsIFxuXHQgICAgICAgICAgICAgICAgICAgIHVybDogICQoJyNmb3JtLWVudHJlZ2EnKS5hdHRyKCBcImFjdGlvblwiICksXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YTogICQoICcjZm9ybS1lbnRyZWdhJyApLnNlcmlhbGl6ZSgpLCBcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCBcblx0XHRcdCAgICAgICAgICAgIGJlZm9yZVNlbmQ6ZnVuY3Rpb24oKXtcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdQcm9jZXNhbmRvLi4uJyk7XG5cdFx0XHQgICAgICAgICAgICB9LFxuXHRcdFx0ICAgICAgICAgICAgc3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0ICAgICAgICAgICAgICBpZighZGF0YS5lcnJvcil7XG5cdFx0XHQgICAgICAgICAgICAgIFx0bmV3IFBOb3RpZnkoe1xuXHRcdFx0ICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0luZm9ybWFjacOzbiBhY3R1YWxpemFkYSEnLFxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1zZyxcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nXG5cdFx0XHQgICAgICAgICAgICAgICAgfSk7XG5cdFx0XHQgICAgICAgICAgICAgICB3aW5kb3cub3Blbih1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL0NhcnRzL3BhZ28nLCdfc2VsZicpO1xuXHRcdFx0ICAgICAgICAgICAgICBcblx0XHRcdCAgICAgICAgICAgICAgfWVsc2V7XG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI2Zvcm0tZW50cmVnYScpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGRhdGEubXNnKTsgXG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnZhbCgnR3VhcmRhcicpO1xuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdCAgICAgICAgICAgICAgfVxuXHRcdFx0ICAgICAgICAgICAgfSxcblx0XHRcdCAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKGpxWEhSLHRleHRTdGF0dXMsZXJyb3JUaHJvd24pe1xuXHRcdFx0ICAgICAgICAgICAgICAgJCgnI2Zvcm0tZW50cmVnYScpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGpxWEhSLnN0YXR1cysnICcrdGV4dFN0YXR1cyk7XG5cdFx0XHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9KVxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgZXJyb3JMYWJlbENvbnRhaW5lcjogXCIjZXJyb3JfbWVzc2FnZV9ib3hcIixcblx0ICAgICAgICB3cmFwcGVyOiBcImxpXCIsXG5cdCAgICAgICAgcnVsZXM6XG5cdCAgICAgICAgICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICAgICAgZmlyc3RfbmFtZTogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIGxhc3RfbmFtZTogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIGFkZHJlc3NfMTogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIHBob25lX251bWJlcjogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIGVtYWlsOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgIH0pO1xuXHR9LFxuXHRoYW5kbGVfcHJvZHVjdF9yZXZpZXdfc3VibWl0IDpmdW5jdGlvbiAoKXtcblx0XHQgJCgnI2Zvcm0tcHJvZHVjdHJldmlldycpLmZpbmQoJy5lcnJvcnMnKS5oaWRlKCk7XG5cdFx0ICQoJyNmb3JtLXByb2R1Y3RyZXZpZXcnKS52YWxpZGF0ZSh7XG5cdCAgICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKGZvcm0pXG5cdCAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgJC5hamF4KHtcblx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsIFxuXHQgICAgICAgICAgICAgICAgICAgIHVybDogICQoJyNmb3JtLXByb2R1Y3RyZXZpZXcnKS5hdHRyKCBcImFjdGlvblwiICksXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YTogICQoICcjZm9ybS1wcm9kdWN0cmV2aWV3JyApLnNlcmlhbGl6ZSgpLCBcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCBcblx0XHRcdCAgICAgICAgICAgIGJlZm9yZVNlbmQ6ZnVuY3Rpb24oKXtcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdQcm9jZXNhbmRvLi4uJyk7XG5cdFx0XHQgICAgICAgICAgICB9LFxuXHRcdFx0ICAgICAgICAgICAgc3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0ICAgICAgICAgICAgICBpZighZGF0YS5lcnJvcil7XG5cdFx0XHQgICAgICAgICAgICAgIFx0JGNvbnRlbmVkb3IgPSAkKCcjcHJvZHVjdHJldmlld3MnKTtcblx0XHRcdFx0XHRcdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0L2dldF9yZXZpZXcnLHsnSUQnOmRhdGEuSUR9LGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdFx0XHRcdFx0JGNvbnRlbmVkb3IucHJlcGVuZChkYXRhKTtcblx0XHRcdFx0XHRcdFx0fSwndGV4dCcpO1xuXHRcdFx0XHRcdFx0XHQkKCcjZm9ybS1wcm9kdWN0cmV2aWV3JykudHJpZ2dlcigncmVzZXQnKTtcblx0XHRcdCAgICAgICAgICAgICAgfWVsc2V7XG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI2Zvcm0tcHJvZHVjdHJldmlldycpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGRhdGEubXNnKTsgXG5cdFx0XHQgICAgICAgICAgICAgIH1cblx0XHRcdCAgICAgICAgICAgIH0sXG5cdFx0XHQgICAgICAgICAgICBlcnJvcjpmdW5jdGlvbihqcVhIUix0ZXh0U3RhdHVzLGVycm9yVGhyb3duKXtcblx0XHRcdCAgICAgICAgICAgICAgICQoJyNmb3JtLWVudHJlZ2EnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChqcVhIUi5zdGF0dXMrJyAnK3RleHRTdGF0dXMpO1xuXHRcdFx0ICAgICAgICAgICAgfSxcblx0XHRcdCAgICAgICAgICAgIGNvbXBsZXRlOmZ1bmN0aW9uKCl7XG5cdFx0XHQgICAgICAgICAgICBcdCQoJyNzdWJtaXQnKS52YWwoJ0d1YXJkYXInKTtcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9KVxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgZXJyb3JMYWJlbENvbnRhaW5lcjogXCIjZXJyb3JfbWVzc2FnZV9ib3hcIixcblx0ICAgICAgICB3cmFwcGVyOiBcImxpXCIsXG5cdCAgICAgICAgcnVsZXM6XG5cdCAgICAgICAgICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICAgICAgbm9tYnJlOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgZW1haWw6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgICAgICBkZXRhbGxlOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICB9KTtcblx0fSxcbn0iLCJtb2R1bGUuZXhwb3J0cz17XG5cdGxvZzogZnVuY3Rpb24oc3RyaW5nKXtcblx0XHRpZihjb25zb2xlKSBjb25zb2xlLmxvZyhzdHJpbmcpO1xuXHR9LFxuXHQvL09idGllbmUgdW4gYXJyYXkgY29uIHRvZG9zIGxvcyBzZWdtZXRvcyBkZSBsYSBVUkxcblx0Z2V0QmFzZVBhdGggOiBmdW5jdGlvbigpe1xuXHRcdHZhciBwb3J0ID0gd2luZG93LmxvY2F0aW9uLnBvcnQ7XG5cdFx0dmFyIHBhdGhBcnJheSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnLycpO1xuXHRcdHZhciBhcHBsaWNhY2lvbiA9ICh3aW5kb3cubG9jYXRpb24uaG9zdCA9PT0gXCIxMjcuMC4wLjFcIiB8fCB3aW5kb3cubG9jYXRpb24uaG9zdCA9PT0gXCJsb2NhbGhvc3RcIiB8fCB3aW5kb3cubG9jYXRpb24uaG9zdC5pbmRleE9mKCcxOTIuMTY4LicpICE9PSAtMSkgPyBwYXRoQXJyYXlbMV0gOiAnJztcblx0XHRpZihwb3J0PT09XCIzMDAwXCIpe1xuXHRcdFx0YXBwbGljYWNpb24gPSBhcHBsaWNhY2lvbisncG9zLyc7XG5cdFx0fVxuXHRcdGlmICghd2luZG93LmxvY2F0aW9uLm9yaWdpbilcblx0XHRcdHJldHVybiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArIFwiL1wiICsgYXBwbGljYWNpb247XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIGFwcGxpY2FjaW9uO1xuXHR9XG59Il19
