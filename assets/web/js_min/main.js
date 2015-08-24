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
                effect: 'fadein',
                open:function(){
                	$producto.toggle();
                },
                close:function(){
                	$producto.toggle();	
                }
            });
	},
	handle_replace_imagen: function(item){
		$this=this;
		$producto = $(item);
		$contenedor = $('#main-imagen-producto');
		$imagen = $producto.children('img');
		$img_content = $contenedor.children('img');
		$img_content.attr('src', $imagen.attr('src'));
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
	utils.initAjaxTabs();

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
	},
	initAjaxTabs:function(){
		$('[data-toggle="tabajax"]').click(function(e) {
		    var $this = $(this),
		        loadurl = $this.attr('href'),
		        targ = $this.attr('data-target');

		    $.get(loadurl, function(data) {
		        $(targ).html(data);
		    });

		    $this.tab('show');
		    return false;
		});
		$('[data-toggle="tabajax"]:first').click();
	}
}
},{}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi92YXIvd3d3L2h0bWwvcG9zL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi92YXIvd3d3L2h0bWwvcG9zL2Fzc2V0cy93ZWIvanMvZGV2L2NhdGFsb2dvLmpzIiwiL3Zhci93d3cvaHRtbC9wb3MvYXNzZXRzL3dlYi9qcy9kZXYvZmFrZV9mODBlYTlmZC5qcyIsIi92YXIvd3d3L2h0bWwvcG9zL2Fzc2V0cy93ZWIvanMvZGV2L2Zvcm11bGFyaW9zLmpzIiwiL3Zhci93d3cvaHRtbC9wb3MvYXNzZXRzL3dlYi9qcy9kZXYvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblx0ZnJtcz1yZXF1aXJlKCcuL2Zvcm11bGFyaW9zJyk7XG5tb2R1bGUuZXhwb3J0cz17XG5cdGFkZF9maWx0ZXJfdG9fbWFya2VkIDogZnVuY3Rpb24gKGZpbHRybyl7XG5cdFx0JGJ0biAgPSAkKGZpbHRybyk7XG5cdCAgICAkYnRuLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKVxuXHRcdGlmKCRidG4uY3NzKCdvcGFjaXR5Jyk9PTEpe1xuXHRcdFx0JGJ0bi5hbmltYXRlKHsnb3BhY2l0eSc6MC41fSwgMjAwKTtcblx0XHR9ZWxzZXsgXG5cdFx0XHQkYnRuLmFuaW1hdGUoeydvcGFjaXR5JzoxfSwgMjAwKTtcblx0XHR9XG5cdCAgICAvL0HDsWFkZSBsYSBjYXRlZ29yaWEgc2VsZWNjaW9uYWRhIGFsIGRpdiBkZSBmaWx0cm8gYXBsaWNhZG9zXG5cdFx0LyokZmlsdHJvcyA9ICQoJy5tYXJrZXQtYXBwbGllZC1maWx0ZXJzJyk7XG5cdFx0JGZpbHRyb3MuZmluZCgnW2ZpbHRlcj1cIicrJChmaWx0cm8pLmF0dHIoJ2ZpbHRlcicpKydcIl0nKS5yZW1vdmUoKTtcblx0XHQkbGkgPSQoJzxsaT48L2xpPicpO1xuXHRcdCRsaS5hdHRyKCd0aXBvJywkKGZpbHRybykuYXR0cigndGlwbycpKTtcblx0XHQkbGkuYXR0cignZmlsdGVyJywkKGZpbHRybykuYXR0cignZmlsdGVyJykpO1xuXHRcdCRsaS5odG1sKCQoZmlsdHJvKS5hdHRyKCdmaWx0ZXInKSk7XG5cdFx0JGZpbHRyb3MuYXBwZW5kKCRsaSk7Ki9cblx0fSxcblx0Z2V0X2ZpbHRlcnMgOmZ1bmN0aW9uICgpe1xuXHRcdHZhciBmaWx0ZXJzPXsnY2F0ZWdvcmlhJzpbXSwncHJlY2lvcyc6W10sJ3RhbGxhJzpbXSwnY29sb3InOltdLCd0YWcnOltdfTtcblx0XHQkLmVhY2goJCgnLm1hcmtldC1maWx0ZXInKSxmdW5jdGlvbihpbmRleCwgZWwpIHtcblx0XHRcdGlmKCQoZWwpLmhhc0NsYXNzKCdhY3RpdmUnKSl7XG5cdFx0XHRcdGZpbHRlcnNbJChlbCkuYXR0cigndGlwbycpXS5wdXNoKCQoZWwpLmF0dHIoJ2ZpbHRlcicpKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRmaWx0ZXJzLnByZWNpb3M9JCgnI3NsMicpLnZhbCgpO1xuXHRcdHZhciB1bHQgPSAkKCcuZmVhdHVyZXNfaXRlbXMgLnByb2R1Y3QtaW1hZ2Utd3JhcHBlcjpsYXN0Jyk7XG5cdFx0ZmlsdGVycy51bHRpbW8gPSB1bHQuaW5kZXgoJy5wcm9kdWN0LWltYWdlLXdyYXBwZXInKTtcblx0XHRmaWx0ZXJzLm5vbWJyZSA9ICQoJyNzZWFyY2hfaW5wdXQnKS52YWwoKTtcblx0XHRjb25zb2xlLmxvZyhmaWx0ZXJzLnRvU291cmNlKCkpO1xuXHRcdHJldHVybiBmaWx0ZXJzO1xuXHR9LFxuXHRsb2FkX2Rlc3RhY2Fkb3MgOiBmdW5jdGlvbigpe1xuXHRcdCQoJyNtYXJrZXQtZGVzdGFjYWRvcycpLmxvYWQodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9tYXJrZXQvZGVzdGFjYWRvcycpO1xuXHR9LFxuXHRyZWxvYWRfY2F0YWxvZ28gOmZ1bmN0aW9uICgpe1xuXHRcdHZhciBmaWx0cm9zID0gdGhpcy5nZXRfZmlsdGVycygpO1xuXHRcdGZpbHRyb3MudWx0aW1vPS0xO1xuXHRcdCQuZ2V0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0L2NhdGFsb2dvJyxmaWx0cm9zLCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRpZihkYXRhIT1cIlwiKXtcblx0XHRcdFx0JCgnI21hcmtldC1jYXRhbG9nbycpLmh0bWwoZGF0YSkuYW5pbWF0ZSh7b3BhY2NpdHk6MC44fSwgNTAwKTtcblx0XHRcdH1cblx0XHRcdHV0aWxzLnNldEVzdGFDYXJnYW5kbyhmYWxzZSk7XG5cdFx0fSk7XG5cdH0sXG5cdHJlZnJlc2hfY2F0YWxvZ28gOmZ1bmN0aW9uICgpe1xuXHRcdHZhciBmaWx0cm9zID0gdGhpcy5nZXRfZmlsdGVycygpO1xuXHRcdCQuZ2V0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0L2NhdGFsb2dvJyxmaWx0cm9zLCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRpZihkYXRhIT1cIlwiKXtcblx0XHRcdFx0aWYoZmlsdHJvcy51bHRpbW8gPT0gLTEpe1xuXHRcdFx0XHRcdCQoJyNtYXJrZXQtY2F0YWxvZ28nKS5odG1sKGRhdGEpLmFuaW1hdGUoe29wYWNjaXR5OjAuOH0sIDUwMCk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdCQoJyNtYXJrZXQtY2F0YWxvZ28nKS5hbmltYXRlKHtvcGFjaXR5OjAuNn0sIDUwMCkuYXBwZW5kKGRhdGEpLmFuaW1hdGUoe29wYWNpdHk6MX0sIDIwMCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHV0aWxzLnNldEVzdGFDYXJnYW5kbyhmYWxzZSk7XG5cdFx0fSk7XG5cdH0sXG5cdGhhbmRsZV9hZGRfdG9fd2xpc3Q6IGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XG5cdFx0dmFyIGlkX3Byb2R1Y3RvID0gJHByb2R1Y3RvLmF0dHIoJ2hyZWYnKTtcblx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9XbGlzdC9hZGRfdG9fd2xpc3QnLHsncHJvZHVjdG8nOmlkX3Byb2R1Y3RvfSxmdW5jdGlvbihkYXRhKXtcblx0XHRcdGlmKCFkYXRhLmVycm9yKXtcblx0XHRcdCBuZXcgUE5vdGlmeSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvZHVjdG8gYWdyZWdhZG8hJyxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJyxcblx0XHQgICAgICAgICAgICBkZWxheTogMjAwXG4gICAgICAgICAgICAgICAgfSk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0IEN1c3RvbWJveC5vcGVuKHtcblx0ICAgICAgICAgICAgICAgIHRhcmdldDogZGF0YS5tc2csXG5cdCAgICAgICAgICAgICAgICBlZmZlY3Q6ICdmYWRlaW4nLFxuXHQgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0IGZybXMuaGFuZGxlX2xvZ2luX3N1Ym1pdCgpO1xuXHRcdFx0XHRcdCBmcm1zLmhhbmRsZV9yZWdpc3Rlcl9zdWJtaXQoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSk7XG5cdFx0XHR9XG5cdFx0fSwnanNvbicpO1xuXHR9LFxuXHRoYW5kbGVfcmVtb3ZlX2Zyb21fd2xpc3Q6IGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdCR0aGlzPXRoaXM7XG5cdFx0JHByb2R1Y3RvID0gJChpdGVtKTtcblx0XHR2YXIgaWRfcHJvZHVjdG8gPSAkcHJvZHVjdG8uYXR0cignaHJlZicpO1xuXHRcdCQucG9zdCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL1dsaXN0L3JlbW92ZV9mcm9tX3dsaXN0Jyx7J3Byb2R1Y3RvJzppZF9wcm9kdWN0b30sZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRpZighZGF0YS5lcnJvcil7XG5cdFx0XHRcdCRwcm9kdWN0by5wYXJlbnRzKCd0cicpLmZhZGVPdXQoJ3Nsb3cnKS5yZW1vdmUoKTtcblx0XHRcdFx0IG5ldyBQTm90aWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQcm9kdWN0b3IgcmV0aXJhZG8hJyxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJyxcblx0XHQgICAgICAgICAgICBkZWxheTogMjAwXG4gICAgICAgICAgICAgICAgfSk7XG5cdFx0XHR9XG5cdFx0fSwnanNvbicpO1xuXHR9LFxuXHRoYW5kbGVfYWRkX3RvX2NhcnQ6IGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XG5cdFx0dmFyIGlkX3Byb2R1Y3RvID0gJHByb2R1Y3RvLmF0dHIoJ2hyZWYnKTtcblx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9DYXJ0cy9hZGRfdG9fY2FydCcseydwcm9kdWN0byc6aWRfcHJvZHVjdG99LGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0aWYoIWRhdGEuZXJyb3Ipe1xuXHRcdFx0IG5ldyBQTm90aWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQcm9kdWN0byBhZ3JlZ2FkbyEnLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1zZyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nLFxuXHRcdCAgICAgICAgICAgIGRlbGF5OiAyMDBcbiAgICAgICAgICAgICAgICB9KTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHQgQ3VzdG9tYm94Lm9wZW4oe1xuXHQgICAgICAgICAgICAgICAgdGFyZ2V0OiBkYXRhLm1zZyxcblx0ICAgICAgICAgICAgICAgIGVmZmVjdDogJ2ZhZGVpbicsXG5cdCAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKXtcblx0XHRcdFx0XHQgZnJtcy5oYW5kbGVfbG9naW5fc3VibWl0KCk7XG5cdFx0XHRcdFx0IGZybXMuaGFuZGxlX3JlZ2lzdGVyX3N1Ym1pdCgpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9KTtcblx0XHRcdH1cblxuXHRcdH0sJ2pzb24nKTtcblx0fSxcblx0aGFuZGxlX3JlbW92ZV9mcm9tX2NhcnQ6IGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdCR0aGlzPXRoaXM7XG5cdFx0JHByb2R1Y3RvID0gJChpdGVtKTtcblx0XHR2YXIgaWRfcHJvZHVjdG8gPSAkcHJvZHVjdG8uYXR0cignaHJlZicpO1xuXHRcdCQucG9zdCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL0NhcnRzL3JlbW92ZV9mcm9tX2NhcnQnLHsncHJvZHVjdG8nOmlkX3Byb2R1Y3RvfSxmdW5jdGlvbihkYXRhKXtcblx0XHRcdGlmKCFkYXRhLmVycm9yKXtcblx0XHRcdFx0JHByb2R1Y3RvLnBhcmVudHMoJ3RyJykuZmFkZU91dCgnc2xvdycpLnJlbW92ZSgpO1xuXHRcdFx0XHQkdGhpcy5zdWJ0b3RhbF9jYXJ0KCk7XG5cdFx0XHRcdG5ldyBQTm90aWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQcm9kdWN0b3IgcmV0aXJhZG8hJyxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJyxcblx0XHQgICAgICAgICAgICBkZWxheTogMjAwXG4gICAgICAgICAgICAgICAgfSk7XG5cdFx0XHR9XG5cdFx0fSwnanNvbicpO1xuXHR9LFxuXHRoYW5kbGVfem9vbV9pbWFnZW46IGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdCR0aGlzPXRoaXM7XG5cdFx0JHByb2R1Y3RvID0gJChpdGVtKTtcblx0XHRDdXN0b21ib3gub3Blbih7XG4gICAgICAgICAgICAgICAgdGFyZ2V0OiAnI21haW4taW1hZ2VuLXByb2R1Y3RvJyxcbiAgICAgICAgICAgICAgICBlZmZlY3Q6ICdmYWRlaW4nLFxuICAgICAgICAgICAgICAgIG9wZW46ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBcdCRwcm9kdWN0by50b2dnbGUoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNsb3NlOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgXHQkcHJvZHVjdG8udG9nZ2xlKCk7XHRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblx0fSxcblx0aGFuZGxlX3JlcGxhY2VfaW1hZ2VuOiBmdW5jdGlvbihpdGVtKXtcblx0XHQkdGhpcz10aGlzO1xuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XG5cdFx0JGNvbnRlbmVkb3IgPSAkKCcjbWFpbi1pbWFnZW4tcHJvZHVjdG8nKTtcblx0XHQkaW1hZ2VuID0gJHByb2R1Y3RvLmNoaWxkcmVuKCdpbWcnKTtcblx0XHQkaW1nX2NvbnRlbnQgPSAkY29udGVuZWRvci5jaGlsZHJlbignaW1nJyk7XG5cdFx0JGltZ19jb250ZW50LmF0dHIoJ3NyYycsICRpbWFnZW4uYXR0cignc3JjJykpO1xuXHR9LFxuXHRjbGVhcl9jYXJ0OmZ1bmN0aW9uKCl7XG5cdFx0JHRoaXM9dGhpcztcblx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9DYXJ0cy9jbGVhcl9jYXJ0Jyx7fSxmdW5jdGlvbihkYXRhKXtcblx0XHRcdGlmKCFkYXRhLmVycm9yKXtcblx0XHRcdFx0JHRoaXMuc3VidG90YWxfY2FydCgpO1xuXHRcdFx0fVxuXHRcdH0sJ2pzb24nKTtcblx0fSxcblx0c3VidG90YWxfaXRlbTpmdW5jdGlvbih0cil7XG5cdFx0JHRyID0gICQodHIpO1xuXHRcdHZhciBwcmVjaW8gPSBwYXJzZUZsb2F0KCR0ci5maW5kKCcuY2FydF9wcmljZSBwIHNwYW4nKS5odG1sKCkpO1xuXHRcdHZhciBjYW50aWRhZCA9IHBhcnNlSW50KCR0ci5maW5kKCcuY2FydF9xdWFudGl0eV9pbnB1dCcpLnZhbCgpKTtcblx0XHR2YXIgcmVzdWx0YWRvID0gJHRyLmZpbmQoJy5jYXJ0X3RvdGFsX3ByaWNlIHNwYW4nKTtcblx0XHRyZXN1bHRhZG8uaHRtbChwcmVjaW8qY2FudGlkYWQpO1xuXHR9LFxuXHRzdWJ0b3RhbF9jYXJ0OmZ1bmN0aW9uKCl7XG5cdFx0dmFyIGFjdW11bGFkb3I9MDtcblx0XHQkLmVhY2goJCgnI2l0ZW1zLWNhcnJpdG8gdHInKSwgZnVuY3Rpb24oaW5kZXgsIHZhbCkge1xuXHRcdFx0ICRpdGVtID0gJCh2YWwpO1xuXG5cdFx0XHQgdmFyIHN1YnRvdGFsID0gcGFyc2VGbG9hdCgkaXRlbS5maW5kKCcuY2FydF90b3RhbF9wcmljZSBzcGFuJykuaHRtbCgpKTtcblx0XHRcdCBhY3VtdWxhZG9yKz1zdWJ0b3RhbDtcblx0XHR9KTtcblx0XHRcblx0XHR2YXIgc3VidG90YWxfY2FydCA9ICQoJyNjYXJ0LXN1YnRvdGFsIHNwYW4nKTtcblx0XHRzdWJ0b3RhbF9jYXJ0Lmh0bWwoYWN1bXVsYWRvcik7XG5cblx0XHR2YXIgdG90YWxfY2FydCA9ICQoJyNjYXJ0LXRvdGFsIHNwYW4nKTtcblx0XHR0b3RhbF9jYXJ0Lmh0bWwoYWN1bXVsYWRvcik7XG5cdH0sXG5cdHVwZGF0ZV9jYW50aWRhZF9pdGVtOiBmdW5jdGlvbihpdGVtKXtcblx0XHQkdGhpcz10aGlzO1xuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XG5cdFx0dmFyIGlkX3Byb2R1Y3RvID0gJHByb2R1Y3RvLmF0dHIoJ2hyZWYnKTtcblx0XHR2YXIgY2FudGlkYWQgPSBwYXJzZUludCgkcHJvZHVjdG8uYXR0cigndmFsJykpO1xuXG5cdFx0JGlucHV0ID0gJHByb2R1Y3RvLnNpYmxpbmdzKCcuY2FydF9xdWFudGl0eV9pbnB1dCcpO1xuXHRcdHZhciB2YWxvciA9IHBhcnNlSW50KCRpbnB1dC52YWwoKSk7XG5cdFx0dmFyIHRvdGFsID0gdmFsb3IrY2FudGlkYWQ7XG5cdFx0aWYodG90YWw+MClcblx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9DYXJ0cy9hZGRfdG9fY2FydCcseydwcm9kdWN0byc6aWRfcHJvZHVjdG8sJ2NhbnRpZGFkJzp0b3RhbH0sZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRpZighZGF0YS5lcnJvcil7XG5cdFx0XHRcdGlmKGNhbnRpZGFkPT0wKXtcblx0XHRcdFx0XHRuZXcgUE5vdGlmeSh7XG5cdFx0ICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvZHVjdG8gYWdyZWdhZG8hJyxcblx0XHQgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXG5cdFx0ICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJyxcblx0XHRcdCAgICAgICAgICAgIGRlbGF5OiAyMDBcblx0XHQgICAgICAgICAgICB9KTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0JGlucHV0LnZhbCh0b3RhbCk7XG5cdFx0XHRcdFx0JHRoaXMuc3VidG90YWxfaXRlbSgkaW5wdXQucGFyZW50cygndHInKSk7XG5cdFx0XHRcdFx0JHRoaXMuc3VidG90YWxfY2FydCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0IEN1c3RvbWJveC5vcGVuKHtcblx0ICAgICAgICAgICAgICAgIHRhcmdldDogZGF0YS5tc2csXG5cdCAgICAgICAgICAgICAgICBlZmZlY3Q6ICdmYWRlaW4nLFxuXHQgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0IGZybXMuaGFuZGxlX2xvZ2luX3N1Ym1pdCgpO1xuXHRcdFx0XHRcdCBmcm1zLmhhbmRsZV9yZWdpc3Rlcl9zdWJtaXQoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSk7XG5cdFx0XHR9XG5cdFx0fSwnanNvbicpO1xuXHR9XG59IiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpLFxuIGNhdGFsb2dvID0gcmVxdWlyZSgnLi9jYXRhbG9nbycpLFxuIGZybXMgPSByZXF1aXJlKCcuL2Zvcm11bGFyaW9zJyk7XG5cbnV0aWxzLmxvZyh1dGlscy5nZXRCYXNlUGF0aCgpKTsgXG4vKnByaWNlIHJhbmdlKi9cbiQoJyNzbDInKS5zbGlkZXIoKS5vbignc2xpZGUnLGZ1bmN0aW9uKCl7Y2F0YWxvZ28ucmVsb2FkX2NhdGFsb2dvKCl9KTtcblxuLypzY3JvbGwgdG8gdG9wKi9cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG5cdCQoZnVuY3Rpb24gKCkge1xuXHRcdCQuc2Nyb2xsVXAoe1xuXHQgICAgICAgIHNjcm9sbE5hbWU6ICdzY3JvbGxVcCcsIC8vIEVsZW1lbnQgSURcblx0ICAgICAgICBzY3JvbGxEaXN0YW5jZTogMzAwLCAvLyBEaXN0YW5jZSBmcm9tIHRvcC9ib3R0b20gYmVmb3JlIHNob3dpbmcgZWxlbWVudCAocHgpXG5cdCAgICAgICAgc2Nyb2xsRnJvbTogJ3RvcCcsIC8vICd0b3AnIG9yICdib3R0b20nXG5cdCAgICAgICAgc2Nyb2xsU3BlZWQ6IDMwMCwgLy8gU3BlZWQgYmFjayB0byB0b3AgKG1zKVxuXHQgICAgICAgIGVhc2luZ1R5cGU6ICdsaW5lYXInLCAvLyBTY3JvbGwgdG8gdG9wIGVhc2luZyAoc2VlIGh0dHA6Ly9lYXNpbmdzLm5ldC8pXG5cdCAgICAgICAgYW5pbWF0aW9uOiAnZmFkZScsIC8vIEZhZGUsIHNsaWRlLCBub25lXG5cdCAgICAgICAgYW5pbWF0aW9uU3BlZWQ6IDIwMCwgLy8gQW5pbWF0aW9uIGluIHNwZWVkIChtcylcblx0ICAgICAgICBzY3JvbGxUcmlnZ2VyOiBmYWxzZSwgLy8gU2V0IGEgY3VzdG9tIHRyaWdnZXJpbmcgZWxlbWVudC4gQ2FuIGJlIGFuIEhUTUwgc3RyaW5nIG9yIGpRdWVyeSBvYmplY3Rcblx0XHRcdFx0XHQvL3Njcm9sbFRhcmdldDogZmFsc2UsIC8vIFNldCBhIGN1c3RvbSB0YXJnZXQgZWxlbWVudCBmb3Igc2Nyb2xsaW5nIHRvIHRoZSB0b3Bcblx0ICAgICAgICBzY3JvbGxUZXh0OiAnPGkgY2xhc3M9XCJmYSBmYS1hbmdsZS11cFwiPjwvaT4nLCAvLyBUZXh0IGZvciBlbGVtZW50LCBjYW4gY29udGFpbiBIVE1MXG5cdCAgICAgICAgc2Nyb2xsVGl0bGU6IGZhbHNlLCAvLyBTZXQgYSBjdXN0b20gPGE+IHRpdGxlIGlmIHJlcXVpcmVkLlxuXHQgICAgICAgIHNjcm9sbEltZzogZmFsc2UsIC8vIFNldCB0cnVlIHRvIHVzZSBpbWFnZVxuXHQgICAgICAgIGFjdGl2ZU92ZXJsYXk6IGZhbHNlLCAvLyBTZXQgQ1NTIGNvbG9yIHRvIGRpc3BsYXkgc2Nyb2xsVXAgYWN0aXZlIHBvaW50LCBlLmcgJyMwMEZGRkYnXG5cdCAgICAgICAgekluZGV4OiAyMTQ3NDgzNjQ3IC8vIFotSW5kZXggZm9yIHRoZSBvdmVybGF5XG5cdFx0fSk7XG5cdH0pO1xufSk7XG5cblxuXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcubWFya2V0LWZpbHRlcicsZnVuY3Rpb24oZSl7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0Y2F0YWxvZ28uYWRkX2ZpbHRlcl90b19tYXJrZWQoJCh0aGlzKSk7ICAgIFxuXHRjYXRhbG9nby5yZWxvYWRfY2F0YWxvZ28oKTtcbn0pO1xuXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcuYWRkLXRvLWNhcnQnLGZ1bmN0aW9uKGUpe1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdGNhdGFsb2dvLmhhbmRsZV9hZGRfdG9fY2FydCgkKHRoaXMpKTsgICAgXG59KTtcblxuJChkb2N1bWVudCkub24oJ2NsaWNrJywnLnJlbW92ZS1mcm9tLWNhcnQnLGZ1bmN0aW9uKGUpe1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdGNhdGFsb2dvLmhhbmRsZV9yZW1vdmVfZnJvbV9jYXJ0KCQodGhpcykpOyAgICBcbn0pO1xuXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcuYWRkLXRvLXdsaXN0JyxmdW5jdGlvbihlKXtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRjYXRhbG9nby5oYW5kbGVfYWRkX3RvX3dsaXN0KCQodGhpcykpOyAgICBcbn0pO1xuXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcucmVtb3ZlLWZyb20td2xpc3QnLGZ1bmN0aW9uKGUpe1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdGNhdGFsb2dvLmhhbmRsZV9yZW1vdmVfZnJvbV93bGlzdCgkKHRoaXMpKTsgICAgXG59KTtcblxuJChkb2N1bWVudCkub24oJ2NsaWNrJywnLmNhcnRfcXVhbnRpdHlfdXAsIC5jYXJ0X3F1YW50aXR5X2Rvd24sIC5hZGQtdG8tY2FydDInLGZ1bmN0aW9uKGUpe1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdGNhdGFsb2dvLnVwZGF0ZV9jYW50aWRhZF9pdGVtKCQodGhpcykpOyAgICBcblx0XG59KTtcblxuJChkb2N1bWVudCkub24oJ2NsaWNrJywnI21haW4taW1hZ2VuLXByb2R1Y3RvIGgzJyxmdW5jdGlvbihlKXtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRjYXRhbG9nby5oYW5kbGVfem9vbV9pbWFnZW4oJCh0aGlzKSk7ICAgIFxufSk7XG5cbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5pbWFnZW4tcHJvZHVjdG8nLGZ1bmN0aW9uKGUpe1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdGNhdGFsb2dvLmhhbmRsZV9yZXBsYWNlX2ltYWdlbigkKHRoaXMpKTsgICAgXG59KTtcblxudXRpbHMuc2V0RXN0YUNhcmdhbmRvKGZhbHNlKTtcbi8vb24gc2Nyb2xsIGdldHMgd2hlbiBib3R0b20gb2YgdGhlIHBhZ2UgaXMgcmVhY2hlZCBhbmQgY2FsbHMgdGhlIGZ1bmN0aW9uIGRvIGxvYWQgbW9yZSBjb250ZW50XG4kKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKGUpe1xuXHQvL05vdCBhbHdheXMgdGhlIHBvcyA9PSBoIHN0YXRlbWVudCBpcyB2ZXJpZmllZCwgZXhwZWNpYWxseSBvbiBtb2JpbGUgZGV2aWNlcywgdGhhdCdzIHdoeSBhIDMwMHB4IG9mIG1hcmdpbiBhcmUgYXNzdW1lZC5cblx0aWYoJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgJCh3aW5kb3cpLmhlaWdodCgpID49ICQoZG9jdW1lbnQpLmhlaWdodCgpIC0gMzAwKSB7XG5cdFx0dXRpbHMubG9nKFwiRmluYWwgZGUgcMOhZ2luYSBhbGNhbnphZG9cIik7XG5cdFx0aWYoJCgnI21hcmtldC1jYXRhbG9nbycpLmxlbmd0aCAmJiAoIXV0aWxzLmVzdGFDYXJnYW5kbygpKSl7XG5cdFx0XHRjYXRhbG9nby5yZWZyZXNoX2NhdGFsb2dvKCk7XG5cdFx0fVxuXHRcdHV0aWxzLnNldEVzdGFDYXJnYW5kbyh0cnVlKTtcblx0fVxufSk7XG5cbmZ1bmN0aW9uIG1haW4oKXtcblx0Y2F0YWxvZ28ucmVsb2FkX2NhdGFsb2dvKCk7XG5cdGZybXMuaGFuZGxlX2xvZ2luX3N1Ym1pdCgpO1xuXHRmcm1zLmhhbmRsZV9yZWdpc3Rlcl9zdWJtaXQoKTtcblx0ZnJtcy5oYW5kbGVfcGFnb19jYygpO1xuXHRmcm1zLmhhbmRsZV9lbnRyZWdhX3N1Ym1pdCgpO1xuXHRmcm1zLmhhbmRsZV9wcm9kdWN0X3Jldmlld19zdWJtaXQoKTtcblx0Y2F0YWxvZ28ubG9hZF9kZXN0YWNhZG9zKCk7XG5cdHV0aWxzLmluaXRBamF4VGFicygpO1xuXG5cdCQoJyNzZWFyY2hfaW5wdXQnKS5rZXl1cChmdW5jdGlvbihlKSB7XG5cdFx0Y2F0YWxvZ28ucmVsb2FkX2NhdGFsb2dvKCk7XG5cdH0pO1xufVxuXG4kKGRvY3VtZW50KS5yZWFkeShtYWluKTsiLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyksXG5cdGN0bGc9cmVxdWlyZSgnLi9jYXRhbG9nbycpO1xubW9kdWxlLmV4cG9ydHM9e1xuXHRoYW5kbGVfbG9naW5fc3VibWl0IDpmdW5jdGlvbiAoKXtcblx0XHQgJCgnZm9ybSNmb3JtLWxvZ2lubWFya2V0JykuZmluZCgnLmVycm9ycycpLmhpZGUoKTtcblx0XHQgJCgnI2Zvcm0tbG9naW5tYXJrZXQnKS52YWxpZGF0ZSh7XG5cdCAgICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKGZvcm0pXG5cdCAgICAgICAge1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJywgXG4gICAgICAgICAgICAgICAgICAgIHVybDogICQoJyNmb3JtLWxvZ2lubWFya2V0JykuYXR0ciggXCJhY3Rpb25cIiApLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiAgJCggJyNmb3JtLWxvZ2lubWFya2V0JyApLnNlcmlhbGl6ZSgpLCBcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJywgXG5cdFx0ICAgICAgICAgICAgYmVmb3JlU2VuZDpmdW5jdGlvbigpe1xuXHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnZhbCgnUHJvY2VzYW5kby4uLicpO1xuXHRcdCAgICAgICAgICAgIH0sXG5cdFx0ICAgICAgICAgICAgc3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdCAgICAgICAgICAgICAgaWYoIWRhdGEuZXJyb3Ipe1xuXHRcdCAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0JywnX3NlbGYnKTtcblx0XHQgICAgICAgICAgICAgIFx0bmV3IFBOb3RpZnkoe1xuXHRcdCAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdCaWVudmVuaWRvIScsXG5cdFx0ICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1zZyxcblx0XHQgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJyxcblx0XHQgICAgICAgICAgICAgICAgICAgIGRlbGF5OiA1MDBcblx0XHQgICAgICAgICAgICAgICAgfSk7XG5cdFx0ICAgICAgICAgICAgICBcblx0XHQgICAgICAgICAgICAgIH1lbHNle1xuXHRcdCAgICAgICAgICAgICAgICAkKCcjZm9ybS1sb2dpbm1hcmtldCcpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGRhdGEubXNnKTsgXG5cdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS52YWwoJ0d1YXJkYXInKTtcblx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdCAgICAgICAgICAgICAgfVxuXHRcdCAgICAgICAgICAgIH0sXG5cdFx0ICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24oanFYSFIsdGV4dFN0YXR1cyxlcnJvclRocm93bil7XG5cdFx0ICAgICAgICAgICAgICAkKCcjZm9ybS1sb2dpbm1hcmtldCcpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGpxWEhSLnN0YXR1cysnICcrdGV4dFN0YXR1cyk7XG5cdFx0ICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG5cblx0ICAgICAgICB9LFxuXHQgICAgICAgIGVycm9yTGFiZWxDb250YWluZXI6IFwiI2Vycm9yX21lc3NhZ2VfYm94XCIsXG5cdCAgICAgICAgd3JhcHBlcjogXCJsaVwiLFxuXHQgICAgICAgIHJ1bGVzOlxuXHQgICAgICAgICAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgIH0pO1xuXHR9LFxuXHRoYW5kbGVfcmVnaXN0ZXJfc3VibWl0IDpmdW5jdGlvbiAoKXtcblx0XHQgJCgnI2Zvcm0tcmVnaXN0ZXJtYXJrZXQnKS5maW5kKCcuZXJyb3JzJykuaGlkZSgpO1xuXHRcdCAkKCcjZm9ybS1yZWdpc3Rlcm1hcmtldCcpLnZhbGlkYXRlKHtcblx0ICAgICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoZm9ybSlcblx0ICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICAkLmFqYXgoe1xuXHQgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJywgXG5cdCAgICAgICAgICAgICAgICAgICAgdXJsOiAgJCgnI2Zvcm0tcmVnaXN0ZXJtYXJrZXQnKS5hdHRyKCBcImFjdGlvblwiICksXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YTogICQoICcjZm9ybS1yZWdpc3Rlcm1hcmtldCcgKS5zZXJpYWxpemUoKSwgXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJywgXG5cdFx0XHQgICAgICAgICAgICBiZWZvcmVTZW5kOmZ1bmN0aW9uKCl7XG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnZhbCgnUHJvY2VzYW5kby4uLicpO1xuXHRcdFx0ICAgICAgICAgICAgfSxcblx0XHRcdCAgICAgICAgICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdCAgICAgICAgICAgICAgaWYoIWRhdGEuZXJyb3Ipe1xuXHRcdFx0ICAgICAgICAgICAgICBcdG5ldyBQTm90aWZ5KHtcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdCaWVudmVuaWRvIScsXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEubXNnLFxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5mbydcblx0XHRcdCAgICAgICAgICAgICAgICB9KTtcblx0XHRcdCAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0JywnX3NlbGYnKTtcblx0XHRcdCAgICAgICAgICAgICAgXG5cdFx0XHQgICAgICAgICAgICAgIH1lbHNle1xuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNmb3JtLXJlZ2lzdGVybWFya2V0JykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoZGF0YS5tc2cpOyBcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdHdWFyZGFyJyk7XG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0ICAgICAgICAgICAgICB9XG5cdFx0XHQgICAgICAgICAgICB9LFxuXHRcdFx0ICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24oanFYSFIsdGV4dFN0YXR1cyxlcnJvclRocm93bil7XG5cdFx0XHQgICAgICAgICAgICAgICAkKCcjZm9ybS1yZWdpc3Rlcm1hcmtldCcpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGpxWEhSLnN0YXR1cysnICcrdGV4dFN0YXR1cyk7XG5cdFx0XHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9KVxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgZXJyb3JMYWJlbENvbnRhaW5lcjogXCIjZXJyb3JfbWVzc2FnZV9ib3hcIixcblx0ICAgICAgICB3cmFwcGVyOiBcImxpXCIsXG5cdCAgICAgICAgcnVsZXM6XG5cdCAgICAgICAgICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICAgICAgZmlyc3RfbmFtZTogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIGVtYWlsOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgIH0pO1xuXHR9LFxuXHRoYW5kbGVfcGFnb19jYyA6ZnVuY3Rpb24gKCl7XG5cdFx0ICQoJyNmb3JtLXBhZ28tY2MnKS5maW5kKCcuZXJyb3JzJykuaGlkZSgpO1xuXHRcdCAkKCcjZm9ybS1wYWdvLWNjJykudmFsaWRhdGUoe1xuXHQgICAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uIChmb3JtKVxuXHQgICAgICAgIHtcblxuXHQgICAgICAgICAgICAgICAgJC5hamF4KHtcblx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsIFxuXHQgICAgICAgICAgICAgICAgICAgIHVybDogICQoJyNmb3JtLXBhZ28tY2MnKS5hdHRyKCBcImFjdGlvblwiICksXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YTogICQoICcjZm9ybS1wYWdvLWNjJyApLnNlcmlhbGl6ZSgpLCBcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCBcblx0ICAgICAgICAgICAgICAgICAgICBhc3luYzpmYWxzZSxcblx0XHRcdCAgICAgICAgICAgIGJlZm9yZVNlbmQ6ZnVuY3Rpb24oKXtcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdF9jYycpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0X2NjJykudmFsKCdQcm9jZXNhbmRvLi4uJyk7XG5cdFx0XHQgICAgICAgICAgICB9LFxuXHRcdFx0ICAgICAgICAgICAgc3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0ICAgICAgICAgICAgICBpZighZGF0YS5lcnJvcil7XG5cdFx0XHQgICAgICAgICAgICAgICB3aW5kb3cub3Blbih1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL0NhcnRzL2ZpbmFsaXphcicsJ19zZWxmJyk7XG5cdFx0XHQgICAgICAgICAgICAgIFxuXHRcdFx0ICAgICAgICAgICAgICB9ZWxzZXtcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjZm9ybS1wYWdvLWNjJykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoZGF0YS5tc2cpOyBcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0X2NjJykudmFsKCdHdWFyZGFyJyk7XG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdF9jYycpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0ICAgICAgICAgICAgICB9XG5cdFx0XHQgICAgICAgICAgICB9LFxuXHRcdFx0ICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24oanFYSFIsdGV4dFN0YXR1cyxlcnJvclRocm93bil7XG5cdFx0XHQgICAgICAgICAgICBcdHV0aWxzLmxvZyhqcVhIUik7XG5cdFx0XHQgICAgICAgICAgICBcdHV0aWxzLmxvZyh0ZXh0U3RhdHVzKTtcblx0XHRcdCAgICAgICAgICAgIFx0dXRpbHMubG9nKGVycm9yVGhyb3duKTtcblx0XHRcdCAgICAgICAgICAgICAgICQoJyNmb3JtLXBhZ28tY2MnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChqcVhIUi5zdGF0dXMrJyAnK3RleHRTdGF0dXMpO1xuXHRcdFx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgfSlcblx0ICAgICAgICB9LFxuXHQgICAgICAgIGVycm9yTGFiZWxDb250YWluZXI6IFwiI2Vycm9yX21lc3NhZ2VfYm94XCIsXG5cdCAgICAgICAgd3JhcHBlcjogXCJsaVwiLFxuXHQgICAgICAgIHJ1bGVzOlxuXHQgICAgICAgICAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgICAgIGNyZWRpdF9jYXJkOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgXCJjYXJkLW51bWJlclwiOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgXCJleHBpcnktbW9udGhcIjogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIFwiZXhwaXJ5LXllYXJcIjogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgfSk7XG5cdH0sXG5cdGhhbmRsZV9lbnRyZWdhX3N1Ym1pdCA6ZnVuY3Rpb24gKCl7XG5cdFx0ICQoJyNmb3JtLWVudHJlZ2EnKS5maW5kKCcuZXJyb3JzJykuaGlkZSgpO1xuXHRcdCAkKCcjZm9ybS1lbnRyZWdhJykudmFsaWRhdGUoe1xuXHQgICAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uIChmb3JtKVxuXHQgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgICQuYWpheCh7XG5cdCAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLCBcblx0ICAgICAgICAgICAgICAgICAgICB1cmw6ICAkKCcjZm9ybS1lbnRyZWdhJykuYXR0ciggXCJhY3Rpb25cIiApLFxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGE6ICAkKCAnI2Zvcm0tZW50cmVnYScgKS5zZXJpYWxpemUoKSwgXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJywgXG5cdFx0XHQgICAgICAgICAgICBiZWZvcmVTZW5kOmZ1bmN0aW9uKCl7XG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnZhbCgnUHJvY2VzYW5kby4uLicpO1xuXHRcdFx0ICAgICAgICAgICAgfSxcblx0XHRcdCAgICAgICAgICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbihkYXRhKXtcblxuXHRcdFx0ICAgICAgICAgICAgICBpZighZGF0YS5lcnJvcil7XG5cdFx0XHQgICAgICAgICAgICAgIFx0bmV3IFBOb3RpZnkoe1xuXHRcdFx0ICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0luZm9ybWFjacOzbiBhY3R1YWxpemFkYSEnLFxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1lc3NhZ2UsXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJ1xuXHRcdFx0ICAgICAgICAgICAgICAgIH0pO1xuXHRcdFx0ICAgICAgICAgICAgICAgd2luZG93Lm9wZW4odXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9DYXJ0cy9wYWdvJywnX3NlbGYnKTtcblx0XHRcdCAgICAgICAgICAgICAgXG5cdFx0XHQgICAgICAgICAgICAgIH1lbHNle1xuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNmb3JtLWVudHJlZ2EnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChkYXRhLm1lc3NhZ2UpOyBcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdHdWFyZGFyJyk7XG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0ICAgICAgICAgICAgICB9XG5cdFx0XHQgICAgICAgICAgICB9LFxuXHRcdFx0ICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24oanFYSFIsdGV4dFN0YXR1cyxlcnJvclRocm93bil7XG5cdFx0XHQgICAgICAgICAgICAgICAkKCcjZm9ybS1lbnRyZWdhJykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoanFYSFIuc3RhdHVzKycgJyt0ZXh0U3RhdHVzKTtcblx0XHRcdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH0pXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBlcnJvckxhYmVsQ29udGFpbmVyOiBcIiNlcnJvcl9tZXNzYWdlX2JveFwiLFxuXHQgICAgICAgIHdyYXBwZXI6IFwibGlcIixcblx0ICAgICAgICBydWxlczpcblx0ICAgICAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgICAgICBmaXJzdF9uYW1lOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgbGFzdF9uYW1lOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgYWRkcmVzc18xOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgcGhvbmVfbnVtYmVyOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgZW1haWw6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgfSk7XG5cdH0sXG5cdGhhbmRsZV9wcm9kdWN0X3Jldmlld19zdWJtaXQgOmZ1bmN0aW9uICgpe1xuXHRcdCAkKCcjZm9ybS1wcm9kdWN0cmV2aWV3JykuZmluZCgnLmVycm9ycycpLmhpZGUoKTtcblx0XHQgJCgnI2Zvcm0tcHJvZHVjdHJldmlldycpLnZhbGlkYXRlKHtcblx0ICAgICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoZm9ybSlcblx0ICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICAkLmFqYXgoe1xuXHQgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJywgXG5cdCAgICAgICAgICAgICAgICAgICAgdXJsOiAgJCgnI2Zvcm0tcHJvZHVjdHJldmlldycpLmF0dHIoIFwiYWN0aW9uXCIgKSxcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhOiAgJCggJyNmb3JtLXByb2R1Y3RyZXZpZXcnICkuc2VyaWFsaXplKCksIFxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsIFxuXHRcdFx0ICAgICAgICAgICAgYmVmb3JlU2VuZDpmdW5jdGlvbigpe1xuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS52YWwoJ1Byb2Nlc2FuZG8uLi4nKTtcblx0XHRcdCAgICAgICAgICAgIH0sXG5cdFx0XHQgICAgICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHQgICAgICAgICAgICAgIGlmKCFkYXRhLmVycm9yKXtcblx0XHRcdCAgICAgICAgICAgICAgXHQkY29udGVuZWRvciA9ICQoJyNwcm9kdWN0cmV2aWV3cycpO1xuXHRcdFx0XHRcdFx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9tYXJrZXQvZ2V0X3JldmlldycseydJRCc6ZGF0YS5JRH0sZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRcdFx0XHQkY29udGVuZWRvci5wcmVwZW5kKGRhdGEpO1xuXHRcdFx0XHRcdFx0XHR9LCd0ZXh0Jyk7XG5cdFx0XHRcdFx0XHRcdCQoJyNmb3JtLXByb2R1Y3RyZXZpZXcnKS50cmlnZ2VyKCdyZXNldCcpO1xuXHRcdFx0ICAgICAgICAgICAgICB9ZWxzZXtcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjZm9ybS1wcm9kdWN0cmV2aWV3JykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoZGF0YS5tc2cpOyBcblx0XHRcdCAgICAgICAgICAgICAgfVxuXHRcdFx0ICAgICAgICAgICAgfSxcblx0XHRcdCAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKGpxWEhSLHRleHRTdGF0dXMsZXJyb3JUaHJvd24pe1xuXHRcdFx0ICAgICAgICAgICAgICAgJCgnI2Zvcm0tZW50cmVnYScpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGpxWEhSLnN0YXR1cysnICcrdGV4dFN0YXR1cyk7XG5cdFx0XHQgICAgICAgICAgICB9LFxuXHRcdFx0ICAgICAgICAgICAgY29tcGxldGU6ZnVuY3Rpb24oKXtcblx0XHRcdCAgICAgICAgICAgIFx0JCgnI3N1Ym1pdCcpLnZhbCgnR3VhcmRhcicpO1xuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH0pXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBlcnJvckxhYmVsQ29udGFpbmVyOiBcIiNlcnJvcl9tZXNzYWdlX2JveFwiLFxuXHQgICAgICAgIHdyYXBwZXI6IFwibGlcIixcblx0ICAgICAgICBydWxlczpcblx0ICAgICAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgICAgICBub21icmU6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgICAgICBlbWFpbDogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIGRldGFsbGU6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgIH0pO1xuXHR9LFxufSIsInZhciBlc3RhX2NhcmdhbmRvPWZhbHNlO1xubW9kdWxlLmV4cG9ydHM9e1xuXHRsb2c6IGZ1bmN0aW9uKHN0cmluZyl7XG5cdFx0aWYoY29uc29sZSkgY29uc29sZS5sb2coc3RyaW5nKTtcblx0fSxcblx0Ly9PYnRpZW5lIHVuIGFycmF5IGNvbiB0b2RvcyBsb3Mgc2VnbWV0b3MgZGUgbGEgVVJMXG5cdGdldEJhc2VQYXRoIDogZnVuY3Rpb24oKXtcblx0XHR2YXIgcG9ydCA9IHdpbmRvdy5sb2NhdGlvbi5wb3J0O1xuXHRcdHZhciBwYXRoQXJyYXkgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoJy8nKTtcblx0XHR2YXIgYXBwbGljYWNpb24gPSAod2luZG93LmxvY2F0aW9uLmhvc3QgPT09IFwiMTI3LjAuMC4xXCIgfHwgd2luZG93LmxvY2F0aW9uLmhvc3QgPT09IFwibG9jYWxob3N0XCIgfHwgd2luZG93LmxvY2F0aW9uLmhvc3QuaW5kZXhPZignMTkyLjE2OC4nKSAhPT0gLTEpID8gcGF0aEFycmF5WzFdIDogJyc7XG5cdFx0aWYocG9ydD09PVwiMzAwMFwiKXtcblx0XHRcdGFwcGxpY2FjaW9uID0gYXBwbGljYWNpb24rJ3Bvcy8nO1xuXHRcdH1cblx0XHRpZiAoIXdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pXG5cdFx0XHRyZXR1cm4gd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyBcIi9cIiArIGFwcGxpY2FjaW9uO1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBhcHBsaWNhY2lvbjtcblx0fSxcblx0ZXN0YUNhcmdhbmRvOmZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGVzdGFfY2FyZ2FuZG87XG5cdH0sXG5cdHNldEVzdGFDYXJnYW5kbzpmdW5jdGlvbih2YWxvcil7XG5cdFx0ZXN0YV9jYXJnYW5kbz12YWxvcjtcblx0fSxcblx0aW5pdEFqYXhUYWJzOmZ1bmN0aW9uKCl7XG5cdFx0JCgnW2RhdGEtdG9nZ2xlPVwidGFiYWpheFwiXScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0XHQgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcblx0XHQgICAgICAgIGxvYWR1cmwgPSAkdGhpcy5hdHRyKCdocmVmJyksXG5cdFx0ICAgICAgICB0YXJnID0gJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKTtcblxuXHRcdCAgICAkLmdldChsb2FkdXJsLCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0ICAgICAgICAkKHRhcmcpLmh0bWwoZGF0YSk7XG5cdFx0ICAgIH0pO1xuXG5cdFx0ICAgICR0aGlzLnRhYignc2hvdycpO1xuXHRcdCAgICByZXR1cm4gZmFsc2U7XG5cdFx0fSk7XG5cdFx0JCgnW2RhdGEtdG9nZ2xlPVwidGFiYWpheFwiXTpmaXJzdCcpLmNsaWNrKCk7XG5cdH1cbn0iXX0=
