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
				 new PNotify({
                    title: 'Error al agregar producto!',
                    text: data.msg,
                    type: 'error',
		            delay: 200
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
				  new PNotify({
                    title: 'Error al agregar producto!',
                    text: data.msg,
                    type: 'error',
		            delay: 200
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
		$.post(utils.getBasePath()+'/web/market/clear_cart',{},function(data){
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
		                title: 'Cantidad actualizada!',
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
				  new PNotify({
                    title: 'Error al actualizar cantidad!',
                    text: data.msg,
                    type: 'error',
		            delay: 200
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

$(document).on('click','.olvido_pass',function(e){
	e.preventDefault();
	$('#panel-olvida-pass').toggle('slow');    
});
$(document).on('change','#toggle_direccion_de_envio',function(e){
	$('#form-envio').toggle('slow');
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
	frms.handle_envio_submit();
	frms.handle_product_review_submit();
	frms.handle_blog_review_submit();
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
	                    password: {
	                    	"required":true,
	                    	"minlength":5
	                    },
	                    repassword:{
	                    	"required":true,
	                    	"minlength":5,
	                    	equalTo: "#password"
	                    }
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
			               window.open(utils.getBasePath()+'/web/Store/finalizar','_self');
			              
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
			                    title: 'Dirección de facturación actualizada!',
			                    text: data.message,
			                    type: 'info'
			                });

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
	                    ciudad: "required",
	                    pais: "required",
	                }
	    });
	},
	handle_envio_submit :function (){
		 $('#form-envio').find('.errors').hide();
		 $('#form-envio').validate({
	        submitHandler: function (form)
	        {
	                $.ajax({
	                    type: 'POST', 
	                    url:  $('#form-envio').attr( "action" ),
	                    data:  $( '#form-envio' ).serialize(), 
	                    dataType: 'json', 
			            beforeSend:function(){
			              $('#submit').addClass('disabled');
			              $('#submit').val('Procesando...');
			            },
			            success : function(data){

			              if(!data.error){
			              	new PNotify({
			                    title: 'Dirección de envío actualizada!',
			                    text: data.message,
			                    type: 'info'
			                });
			                
			              }else{
			                $('#form-envio').find('.errors').fadeIn('slow').html(data.message); 
			                $('#submit').val('Guardar');
			                $('#submit').removeClass('disabled');
			              }
			            },
			            error:function(jqXHR,textStatus,errorThrown){
			               $('#form-envio').find('.errors').fadeIn('slow').html(jqXHR.status+' '+textStatus);
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
	                    ciudad: "required",
	                    pais: "required",
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
			               $('#form-productreview').find('.errors').fadeIn('slow').html(jqXHR.status+' '+textStatus);
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
	handle_blog_review_submit :function (){
		 $('#form-blogreview').find('.errors').hide();
		 $('#form-blogreview').validate({
	        submitHandler: function (form)
	        {
	                $.ajax({
	                    type: 'POST', 
	                    url:  $('#form-blogreview').attr( "action" ),
	                    data:  $( '#form-blogreview' ).serialize(), 
	                    dataType: 'json', 
			            beforeSend:function(){
			              $('#submit').addClass('disabled');
			              $('#submit').val('Procesando...');
			            },
			            success : function(data){
			              if(!data.error){
			              	$contenedor = $('#blogreviews');
							$.post(utils.getBasePath()+'/web/market/get_blog_review',{'ID':data.ID},function(data){
									$contenedor.prepend(data);
							},'text');
							$('#form-blogreview').trigger('reset');
			              }else{
			                $('#form-blogreview').find('.errors').fadeIn('slow').html(data.msg); 
			              }
			            },
			            error:function(jqXHR,textStatus,errorThrown){
			               $('#form-blogreview').find('.errors').fadeIn('slow').html(jqXHR.status+' '+textStatus);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi92YXIvd3d3L2h0bWwvcG9zL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi92YXIvd3d3L2h0bWwvcG9zL2Fzc2V0cy93ZWIvanMvZGV2L2NhdGFsb2dvLmpzIiwiL3Zhci93d3cvaHRtbC9wb3MvYXNzZXRzL3dlYi9qcy9kZXYvZmFrZV9kMGNkZmEyOC5qcyIsIi92YXIvd3d3L2h0bWwvcG9zL2Fzc2V0cy93ZWIvanMvZGV2L2Zvcm11bGFyaW9zLmpzIiwiL3Zhci93d3cvaHRtbC9wb3MvYXNzZXRzL3dlYi9qcy9kZXYvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXHRmcm1zPXJlcXVpcmUoJy4vZm9ybXVsYXJpb3MnKTtcbm1vZHVsZS5leHBvcnRzPXtcblx0YWRkX2ZpbHRlcl90b19tYXJrZWQgOiBmdW5jdGlvbiAoZmlsdHJvKXtcblx0XHQkYnRuICA9ICQoZmlsdHJvKTtcblx0ICAgICRidG4udG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpXG5cdFx0aWYoJGJ0bi5jc3MoJ29wYWNpdHknKT09MSl7XG5cdFx0XHQkYnRuLmFuaW1hdGUoeydvcGFjaXR5JzowLjV9LCAyMDApO1xuXHRcdH1lbHNleyBcblx0XHRcdCRidG4uYW5pbWF0ZSh7J29wYWNpdHknOjF9LCAyMDApO1xuXHRcdH1cblx0ICAgIC8vQcOxYWRlIGxhIGNhdGVnb3JpYSBzZWxlY2Npb25hZGEgYWwgZGl2IGRlIGZpbHRybyBhcGxpY2Fkb3Ncblx0XHQvKiRmaWx0cm9zID0gJCgnLm1hcmtldC1hcHBsaWVkLWZpbHRlcnMnKTtcblx0XHQkZmlsdHJvcy5maW5kKCdbZmlsdGVyPVwiJyskKGZpbHRybykuYXR0cignZmlsdGVyJykrJ1wiXScpLnJlbW92ZSgpO1xuXHRcdCRsaSA9JCgnPGxpPjwvbGk+Jyk7XG5cdFx0JGxpLmF0dHIoJ3RpcG8nLCQoZmlsdHJvKS5hdHRyKCd0aXBvJykpO1xuXHRcdCRsaS5hdHRyKCdmaWx0ZXInLCQoZmlsdHJvKS5hdHRyKCdmaWx0ZXInKSk7XG5cdFx0JGxpLmh0bWwoJChmaWx0cm8pLmF0dHIoJ2ZpbHRlcicpKTtcblx0XHQkZmlsdHJvcy5hcHBlbmQoJGxpKTsqL1xuXHR9LFxuXHRnZXRfZmlsdGVycyA6ZnVuY3Rpb24gKCl7XG5cdFx0dmFyIGZpbHRlcnM9eydjYXRlZ29yaWEnOltdLCdwcmVjaW9zJzpbXSwndGFsbGEnOltdLCdjb2xvcic6W10sJ3RhZyc6W119O1xuXHRcdCQuZWFjaCgkKCcubWFya2V0LWZpbHRlcicpLGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuXHRcdFx0aWYoJChlbCkuaGFzQ2xhc3MoJ2FjdGl2ZScpKXtcblx0XHRcdFx0ZmlsdGVyc1skKGVsKS5hdHRyKCd0aXBvJyldLnB1c2goJChlbCkuYXR0cignZmlsdGVyJykpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGZpbHRlcnMucHJlY2lvcz0kKCcjc2wyJykudmFsKCk7XG5cdFx0dmFyIHVsdCA9ICQoJy5mZWF0dXJlc19pdGVtcyAucHJvZHVjdC1pbWFnZS13cmFwcGVyOmxhc3QnKTtcblx0XHRmaWx0ZXJzLnVsdGltbyA9IHVsdC5pbmRleCgnLnByb2R1Y3QtaW1hZ2Utd3JhcHBlcicpO1xuXHRcdGZpbHRlcnMubm9tYnJlID0gJCgnI3NlYXJjaF9pbnB1dCcpLnZhbCgpO1xuXHRcdGNvbnNvbGUubG9nKGZpbHRlcnMudG9Tb3VyY2UoKSk7XG5cdFx0cmV0dXJuIGZpbHRlcnM7XG5cdH0sXG5cdGxvYWRfZGVzdGFjYWRvcyA6IGZ1bmN0aW9uKCl7XG5cdFx0JCgnI21hcmtldC1kZXN0YWNhZG9zJykubG9hZCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL21hcmtldC9kZXN0YWNhZG9zJyk7XG5cdH0sXG5cdHJlbG9hZF9jYXRhbG9nbyA6ZnVuY3Rpb24gKCl7XG5cdFx0dmFyIGZpbHRyb3MgPSB0aGlzLmdldF9maWx0ZXJzKCk7XG5cdFx0ZmlsdHJvcy51bHRpbW89LTE7XG5cdFx0JC5nZXQodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9tYXJrZXQvY2F0YWxvZ28nLGZpbHRyb3MsIGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdGlmKGRhdGEhPVwiXCIpe1xuXHRcdFx0XHQkKCcjbWFya2V0LWNhdGFsb2dvJykuaHRtbChkYXRhKS5hbmltYXRlKHtvcGFjY2l0eTowLjh9LCA1MDApO1xuXHRcdFx0fVxuXHRcdFx0dXRpbHMuc2V0RXN0YUNhcmdhbmRvKGZhbHNlKTtcblx0XHR9KTtcblx0fSxcblx0cmVmcmVzaF9jYXRhbG9nbyA6ZnVuY3Rpb24gKCl7XG5cdFx0dmFyIGZpbHRyb3MgPSB0aGlzLmdldF9maWx0ZXJzKCk7XG5cdFx0JC5nZXQodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9tYXJrZXQvY2F0YWxvZ28nLGZpbHRyb3MsIGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdGlmKGRhdGEhPVwiXCIpe1xuXHRcdFx0XHRpZihmaWx0cm9zLnVsdGltbyA9PSAtMSl7XG5cdFx0XHRcdFx0JCgnI21hcmtldC1jYXRhbG9nbycpLmh0bWwoZGF0YSkuYW5pbWF0ZSh7b3BhY2NpdHk6MC44fSwgNTAwKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0JCgnI21hcmtldC1jYXRhbG9nbycpLmFuaW1hdGUoe29wYWNpdHk6MC42fSwgNTAwKS5hcHBlbmQoZGF0YSkuYW5pbWF0ZSh7b3BhY2l0eToxfSwgMjAwKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dXRpbHMuc2V0RXN0YUNhcmdhbmRvKGZhbHNlKTtcblx0XHR9KTtcblx0fSxcblx0aGFuZGxlX2FkZF90b193bGlzdDogZnVuY3Rpb24oaXRlbSl7XG5cdFx0JHByb2R1Y3RvID0gJChpdGVtKTtcblx0XHR2YXIgaWRfcHJvZHVjdG8gPSAkcHJvZHVjdG8uYXR0cignaHJlZicpO1xuXHRcdCQucG9zdCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL1dsaXN0L2FkZF90b193bGlzdCcseydwcm9kdWN0byc6aWRfcHJvZHVjdG99LGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0aWYoIWRhdGEuZXJyb3Ipe1xuXHRcdFx0IG5ldyBQTm90aWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQcm9kdWN0byBhZ3JlZ2FkbyEnLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1zZyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nLFxuXHRcdCAgICAgICAgICAgIGRlbGF5OiAyMDBcbiAgICAgICAgICAgICAgICB9KTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHQgbmV3IFBOb3RpZnkoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0Vycm9yIGFsIGFncmVnYXIgcHJvZHVjdG8hJyxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG5cdFx0ICAgICAgICAgICAgZGVsYXk6IDIwMFxuICAgICAgICAgICAgICAgIH0pO1xuXHRcdFx0fVxuXHRcdH0sJ2pzb24nKTtcblx0fSxcblx0aGFuZGxlX3JlbW92ZV9mcm9tX3dsaXN0OiBmdW5jdGlvbihpdGVtKXtcblx0XHQkdGhpcz10aGlzO1xuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XG5cdFx0dmFyIGlkX3Byb2R1Y3RvID0gJHByb2R1Y3RvLmF0dHIoJ2hyZWYnKTtcblx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9XbGlzdC9yZW1vdmVfZnJvbV93bGlzdCcseydwcm9kdWN0byc6aWRfcHJvZHVjdG99LGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0aWYoIWRhdGEuZXJyb3Ipe1xuXHRcdFx0XHQkcHJvZHVjdG8ucGFyZW50cygndHInKS5mYWRlT3V0KCdzbG93JykucmVtb3ZlKCk7XG5cdFx0XHRcdCBuZXcgUE5vdGlmeSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvZHVjdG9yIHJldGlyYWRvIScsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEubXNnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5mbycsXG5cdFx0ICAgICAgICAgICAgZGVsYXk6IDIwMFxuICAgICAgICAgICAgICAgIH0pO1xuXHRcdFx0fVxuXHRcdH0sJ2pzb24nKTtcblx0fSxcblx0aGFuZGxlX2FkZF90b19jYXJ0OiBmdW5jdGlvbihpdGVtKXtcblx0XHQkcHJvZHVjdG8gPSAkKGl0ZW0pO1xuXHRcdHZhciBpZF9wcm9kdWN0byA9ICRwcm9kdWN0by5hdHRyKCdocmVmJyk7XG5cdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvQ2FydHMvYWRkX3RvX2NhcnQnLHsncHJvZHVjdG8nOmlkX3Byb2R1Y3RvfSxmdW5jdGlvbihkYXRhKXtcblx0XHRcdGlmKCFkYXRhLmVycm9yKXtcblx0XHRcdCBuZXcgUE5vdGlmeSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvZHVjdG8gYWdyZWdhZG8hJyxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJyxcblx0XHQgICAgICAgICAgICBkZWxheTogMjAwXG4gICAgICAgICAgICAgICAgfSk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0ICBuZXcgUE5vdGlmeSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnRXJyb3IgYWwgYWdyZWdhciBwcm9kdWN0byEnLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1zZyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcblx0XHQgICAgICAgICAgICBkZWxheTogMjAwXG4gICAgICAgICAgICAgICAgfSk7XG5cdFx0XHR9XG5cblx0XHR9LCdqc29uJyk7XG5cdH0sXG5cdGhhbmRsZV9yZW1vdmVfZnJvbV9jYXJ0OiBmdW5jdGlvbihpdGVtKXtcblx0XHQkdGhpcz10aGlzO1xuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XG5cdFx0dmFyIGlkX3Byb2R1Y3RvID0gJHByb2R1Y3RvLmF0dHIoJ2hyZWYnKTtcblx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9DYXJ0cy9yZW1vdmVfZnJvbV9jYXJ0Jyx7J3Byb2R1Y3RvJzppZF9wcm9kdWN0b30sZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRpZighZGF0YS5lcnJvcil7XG5cdFx0XHRcdCRwcm9kdWN0by5wYXJlbnRzKCd0cicpLmZhZGVPdXQoJ3Nsb3cnKS5yZW1vdmUoKTtcblx0XHRcdFx0JHRoaXMuc3VidG90YWxfY2FydCgpO1xuXHRcdFx0XHRuZXcgUE5vdGlmeSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvZHVjdG9yIHJldGlyYWRvIScsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEubXNnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5mbycsXG5cdFx0ICAgICAgICAgICAgZGVsYXk6IDIwMFxuICAgICAgICAgICAgICAgIH0pO1xuXHRcdFx0fVxuXHRcdH0sJ2pzb24nKTtcblx0fSxcblx0aGFuZGxlX3pvb21faW1hZ2VuOiBmdW5jdGlvbihpdGVtKXtcblx0XHQkdGhpcz10aGlzO1xuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XG5cdFx0Q3VzdG9tYm94Lm9wZW4oe1xuICAgICAgICAgICAgICAgIHRhcmdldDogJyNtYWluLWltYWdlbi1wcm9kdWN0bycsXG4gICAgICAgICAgICAgICAgZWZmZWN0OiAnZmFkZWluJyxcbiAgICAgICAgICAgICAgICBvcGVuOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgXHQkcHJvZHVjdG8udG9nZ2xlKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjbG9zZTpmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIFx0JHByb2R1Y3RvLnRvZ2dsZSgpO1x0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cdH0sXG5cdGhhbmRsZV9yZXBsYWNlX2ltYWdlbjogZnVuY3Rpb24oaXRlbSl7XG5cdFx0JHRoaXM9dGhpcztcblx0XHQkcHJvZHVjdG8gPSAkKGl0ZW0pO1xuXHRcdCRjb250ZW5lZG9yID0gJCgnI21haW4taW1hZ2VuLXByb2R1Y3RvJyk7XG5cdFx0JGltYWdlbiA9ICRwcm9kdWN0by5jaGlsZHJlbignaW1nJyk7XG5cdFx0JGltZ19jb250ZW50ID0gJGNvbnRlbmVkb3IuY2hpbGRyZW4oJ2ltZycpO1xuXHRcdCRpbWdfY29udGVudC5hdHRyKCdzcmMnLCAkaW1hZ2VuLmF0dHIoJ3NyYycpKTtcblx0fSxcblx0Y2xlYXJfY2FydDpmdW5jdGlvbigpe1xuXHRcdCR0aGlzPXRoaXM7XG5cdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0L2NsZWFyX2NhcnQnLHt9LGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0aWYoIWRhdGEuZXJyb3Ipe1xuXHRcdFx0XHQkdGhpcy5zdWJ0b3RhbF9jYXJ0KCk7XG5cdFx0XHR9XG5cdFx0fSwnanNvbicpO1xuXHR9LFxuXHRzdWJ0b3RhbF9pdGVtOmZ1bmN0aW9uKHRyKXtcblx0XHQkdHIgPSAgJCh0cik7XG5cdFx0dmFyIHByZWNpbyA9IHBhcnNlRmxvYXQoJHRyLmZpbmQoJy5jYXJ0X3ByaWNlIHAgc3BhbicpLmh0bWwoKSk7XG5cdFx0dmFyIGNhbnRpZGFkID0gcGFyc2VJbnQoJHRyLmZpbmQoJy5jYXJ0X3F1YW50aXR5X2lucHV0JykudmFsKCkpO1xuXHRcdHZhciByZXN1bHRhZG8gPSAkdHIuZmluZCgnLmNhcnRfdG90YWxfcHJpY2Ugc3BhbicpO1xuXHRcdHJlc3VsdGFkby5odG1sKHByZWNpbypjYW50aWRhZCk7XG5cdH0sXG5cdHN1YnRvdGFsX2NhcnQ6ZnVuY3Rpb24oKXtcblx0XHR2YXIgYWN1bXVsYWRvcj0wO1xuXHRcdCQuZWFjaCgkKCcjaXRlbXMtY2Fycml0byB0cicpLCBmdW5jdGlvbihpbmRleCwgdmFsKSB7XG5cdFx0XHQgJGl0ZW0gPSAkKHZhbCk7XG5cblx0XHRcdCB2YXIgc3VidG90YWwgPSBwYXJzZUZsb2F0KCRpdGVtLmZpbmQoJy5jYXJ0X3RvdGFsX3ByaWNlIHNwYW4nKS5odG1sKCkpO1xuXHRcdFx0IGFjdW11bGFkb3IrPXN1YnRvdGFsO1xuXHRcdH0pO1xuXHRcdFxuXHRcdHZhciBzdWJ0b3RhbF9jYXJ0ID0gJCgnI2NhcnQtc3VidG90YWwgc3BhbicpO1xuXHRcdHN1YnRvdGFsX2NhcnQuaHRtbChhY3VtdWxhZG9yKTtcblxuXHRcdHZhciB0b3RhbF9jYXJ0ID0gJCgnI2NhcnQtdG90YWwgc3BhbicpO1xuXHRcdHRvdGFsX2NhcnQuaHRtbChhY3VtdWxhZG9yKTtcblx0fSxcblx0dXBkYXRlX2NhbnRpZGFkX2l0ZW06IGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdCR0aGlzPXRoaXM7XG5cdFx0JHByb2R1Y3RvID0gJChpdGVtKTtcblx0XHR2YXIgaWRfcHJvZHVjdG8gPSAkcHJvZHVjdG8uYXR0cignaHJlZicpO1xuXHRcdHZhciBjYW50aWRhZCA9IHBhcnNlSW50KCRwcm9kdWN0by5hdHRyKCd2YWwnKSk7XG5cblx0XHQkaW5wdXQgPSAkcHJvZHVjdG8uc2libGluZ3MoJy5jYXJ0X3F1YW50aXR5X2lucHV0Jyk7XG5cdFx0dmFyIHZhbG9yID0gcGFyc2VJbnQoJGlucHV0LnZhbCgpKTtcblx0XHR2YXIgdG90YWwgPSB2YWxvcitjYW50aWRhZDtcblx0XHRpZih0b3RhbD4wKVxuXHRcdCQucG9zdCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL0NhcnRzL2FkZF90b19jYXJ0Jyx7J3Byb2R1Y3RvJzppZF9wcm9kdWN0bywnY2FudGlkYWQnOnRvdGFsfSxmdW5jdGlvbihkYXRhKXtcblx0XHRcdGlmKCFkYXRhLmVycm9yKXtcblx0XHRcdFx0aWYoY2FudGlkYWQ9PTApe1xuXHRcdFx0XHRcdG5ldyBQTm90aWZ5KHtcblx0XHQgICAgICAgICAgICAgICAgdGl0bGU6ICdDYW50aWRhZCBhY3R1YWxpemFkYSEnLFxuXHRcdCAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1zZyxcblx0XHQgICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nLFxuXHRcdFx0ICAgICAgICAgICAgZGVsYXk6IDIwMFxuXHRcdCAgICAgICAgICAgIH0pO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHQkaW5wdXQudmFsKHRvdGFsKTtcblx0XHRcdFx0XHQkdGhpcy5zdWJ0b3RhbF9pdGVtKCRpbnB1dC5wYXJlbnRzKCd0cicpKTtcblx0XHRcdFx0XHQkdGhpcy5zdWJ0b3RhbF9jYXJ0KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1lbHNle1xuXHRcdFx0XHQgIG5ldyBQTm90aWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdFcnJvciBhbCBhY3R1YWxpemFyIGNhbnRpZGFkIScsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEubXNnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuXHRcdCAgICAgICAgICAgIGRlbGF5OiAyMDBcbiAgICAgICAgICAgICAgICB9KTtcblx0XHRcdH1cblx0XHR9LCdqc29uJyk7XG5cdH1cbn0iLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyksXG4gY2F0YWxvZ28gPSByZXF1aXJlKCcuL2NhdGFsb2dvJyksXG4gZnJtcyA9IHJlcXVpcmUoJy4vZm9ybXVsYXJpb3MnKTtcblxudXRpbHMubG9nKHV0aWxzLmdldEJhc2VQYXRoKCkpOyBcbi8qcHJpY2UgcmFuZ2UqL1xuJCgnI3NsMicpLnNsaWRlcigpLm9uKCdzbGlkZScsZnVuY3Rpb24oKXtjYXRhbG9nby5yZWxvYWRfY2F0YWxvZ28oKX0pO1xuXG4vKnNjcm9sbCB0byB0b3AqL1xuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcblx0JChmdW5jdGlvbiAoKSB7XG5cdFx0JC5zY3JvbGxVcCh7XG5cdCAgICAgICAgc2Nyb2xsTmFtZTogJ3Njcm9sbFVwJywgLy8gRWxlbWVudCBJRFxuXHQgICAgICAgIHNjcm9sbERpc3RhbmNlOiAzMDAsIC8vIERpc3RhbmNlIGZyb20gdG9wL2JvdHRvbSBiZWZvcmUgc2hvd2luZyBlbGVtZW50IChweClcblx0ICAgICAgICBzY3JvbGxGcm9tOiAndG9wJywgLy8gJ3RvcCcgb3IgJ2JvdHRvbSdcblx0ICAgICAgICBzY3JvbGxTcGVlZDogMzAwLCAvLyBTcGVlZCBiYWNrIHRvIHRvcCAobXMpXG5cdCAgICAgICAgZWFzaW5nVHlwZTogJ2xpbmVhcicsIC8vIFNjcm9sbCB0byB0b3AgZWFzaW5nIChzZWUgaHR0cDovL2Vhc2luZ3MubmV0Lylcblx0ICAgICAgICBhbmltYXRpb246ICdmYWRlJywgLy8gRmFkZSwgc2xpZGUsIG5vbmVcblx0ICAgICAgICBhbmltYXRpb25TcGVlZDogMjAwLCAvLyBBbmltYXRpb24gaW4gc3BlZWQgKG1zKVxuXHQgICAgICAgIHNjcm9sbFRyaWdnZXI6IGZhbHNlLCAvLyBTZXQgYSBjdXN0b20gdHJpZ2dlcmluZyBlbGVtZW50LiBDYW4gYmUgYW4gSFRNTCBzdHJpbmcgb3IgalF1ZXJ5IG9iamVjdFxuXHRcdFx0XHRcdC8vc2Nyb2xsVGFyZ2V0OiBmYWxzZSwgLy8gU2V0IGEgY3VzdG9tIHRhcmdldCBlbGVtZW50IGZvciBzY3JvbGxpbmcgdG8gdGhlIHRvcFxuXHQgICAgICAgIHNjcm9sbFRleHQ6ICc8aSBjbGFzcz1cImZhIGZhLWFuZ2xlLXVwXCI+PC9pPicsIC8vIFRleHQgZm9yIGVsZW1lbnQsIGNhbiBjb250YWluIEhUTUxcblx0ICAgICAgICBzY3JvbGxUaXRsZTogZmFsc2UsIC8vIFNldCBhIGN1c3RvbSA8YT4gdGl0bGUgaWYgcmVxdWlyZWQuXG5cdCAgICAgICAgc2Nyb2xsSW1nOiBmYWxzZSwgLy8gU2V0IHRydWUgdG8gdXNlIGltYWdlXG5cdCAgICAgICAgYWN0aXZlT3ZlcmxheTogZmFsc2UsIC8vIFNldCBDU1MgY29sb3IgdG8gZGlzcGxheSBzY3JvbGxVcCBhY3RpdmUgcG9pbnQsIGUuZyAnIzAwRkZGRidcblx0ICAgICAgICB6SW5kZXg6IDIxNDc0ODM2NDcgLy8gWi1JbmRleCBmb3IgdGhlIG92ZXJsYXlcblx0XHR9KTtcblx0fSk7XG59KTtcblxuXG5cbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5tYXJrZXQtZmlsdGVyJyxmdW5jdGlvbihlKXtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRjYXRhbG9nby5hZGRfZmlsdGVyX3RvX21hcmtlZCgkKHRoaXMpKTsgICAgXG5cdGNhdGFsb2dvLnJlbG9hZF9jYXRhbG9nbygpO1xufSk7XG5cbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5hZGQtdG8tY2FydCcsZnVuY3Rpb24oZSl7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0Y2F0YWxvZ28uaGFuZGxlX2FkZF90b19jYXJ0KCQodGhpcykpOyAgICBcbn0pO1xuXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcucmVtb3ZlLWZyb20tY2FydCcsZnVuY3Rpb24oZSl7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0Y2F0YWxvZ28uaGFuZGxlX3JlbW92ZV9mcm9tX2NhcnQoJCh0aGlzKSk7ICAgIFxufSk7XG5cbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5hZGQtdG8td2xpc3QnLGZ1bmN0aW9uKGUpe1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdGNhdGFsb2dvLmhhbmRsZV9hZGRfdG9fd2xpc3QoJCh0aGlzKSk7ICAgIFxufSk7XG5cbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5yZW1vdmUtZnJvbS13bGlzdCcsZnVuY3Rpb24oZSl7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0Y2F0YWxvZ28uaGFuZGxlX3JlbW92ZV9mcm9tX3dsaXN0KCQodGhpcykpOyAgICBcbn0pO1xuXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcuY2FydF9xdWFudGl0eV91cCwgLmNhcnRfcXVhbnRpdHlfZG93biwgLmFkZC10by1jYXJ0MicsZnVuY3Rpb24oZSl7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0Y2F0YWxvZ28udXBkYXRlX2NhbnRpZGFkX2l0ZW0oJCh0aGlzKSk7ICAgIFxuXHRcbn0pO1xuXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcjbWFpbi1pbWFnZW4tcHJvZHVjdG8gaDMnLGZ1bmN0aW9uKGUpe1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdGNhdGFsb2dvLmhhbmRsZV96b29tX2ltYWdlbigkKHRoaXMpKTsgICAgXG59KTtcblxuJChkb2N1bWVudCkub24oJ2NsaWNrJywnLmltYWdlbi1wcm9kdWN0bycsZnVuY3Rpb24oZSl7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0Y2F0YWxvZ28uaGFuZGxlX3JlcGxhY2VfaW1hZ2VuKCQodGhpcykpOyAgICBcbn0pO1xuXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcub2x2aWRvX3Bhc3MnLGZ1bmN0aW9uKGUpe1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdCQoJyNwYW5lbC1vbHZpZGEtcGFzcycpLnRvZ2dsZSgnc2xvdycpOyAgICBcbn0pO1xuJChkb2N1bWVudCkub24oJ2NoYW5nZScsJyN0b2dnbGVfZGlyZWNjaW9uX2RlX2VudmlvJyxmdW5jdGlvbihlKXtcblx0JCgnI2Zvcm0tZW52aW8nKS50b2dnbGUoJ3Nsb3cnKTtcbn0pO1xuXG51dGlscy5zZXRFc3RhQ2FyZ2FuZG8oZmFsc2UpO1xuLy9vbiBzY3JvbGwgZ2V0cyB3aGVuIGJvdHRvbSBvZiB0aGUgcGFnZSBpcyByZWFjaGVkIGFuZCBjYWxscyB0aGUgZnVuY3Rpb24gZG8gbG9hZCBtb3JlIGNvbnRlbnRcbiQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oZSl7XG5cdC8vTm90IGFsd2F5cyB0aGUgcG9zID09IGggc3RhdGVtZW50IGlzIHZlcmlmaWVkLCBleHBlY2lhbGx5IG9uIG1vYmlsZSBkZXZpY2VzLCB0aGF0J3Mgd2h5IGEgMzAwcHggb2YgbWFyZ2luIGFyZSBhc3N1bWVkLlxuXHRpZigkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyAkKHdpbmRvdykuaGVpZ2h0KCkgPj0gJChkb2N1bWVudCkuaGVpZ2h0KCkgLSAzMDApIHtcblx0XHR1dGlscy5sb2coXCJGaW5hbCBkZSBww6FnaW5hIGFsY2FuemFkb1wiKTtcblx0XHRpZigkKCcjbWFya2V0LWNhdGFsb2dvJykubGVuZ3RoICYmICghdXRpbHMuZXN0YUNhcmdhbmRvKCkpKXtcblx0XHRcdGNhdGFsb2dvLnJlZnJlc2hfY2F0YWxvZ28oKTtcblx0XHR9XG5cdFx0dXRpbHMuc2V0RXN0YUNhcmdhbmRvKHRydWUpO1xuXHR9XG59KTtcblxuZnVuY3Rpb24gbWFpbigpe1xuXHRjYXRhbG9nby5yZWxvYWRfY2F0YWxvZ28oKTtcblx0ZnJtcy5oYW5kbGVfbG9naW5fc3VibWl0KCk7XG5cdGZybXMuaGFuZGxlX3JlZ2lzdGVyX3N1Ym1pdCgpO1xuXHRmcm1zLmhhbmRsZV9wYWdvX2NjKCk7XG5cdGZybXMuaGFuZGxlX2VudHJlZ2Ffc3VibWl0KCk7XG5cdGZybXMuaGFuZGxlX2VudmlvX3N1Ym1pdCgpO1xuXHRmcm1zLmhhbmRsZV9wcm9kdWN0X3Jldmlld19zdWJtaXQoKTtcblx0ZnJtcy5oYW5kbGVfYmxvZ19yZXZpZXdfc3VibWl0KCk7XG5cdGNhdGFsb2dvLmxvYWRfZGVzdGFjYWRvcygpO1xuXHR1dGlscy5pbml0QWpheFRhYnMoKTtcblxuXHQkKCcjc2VhcmNoX2lucHV0Jykua2V5dXAoZnVuY3Rpb24oZSkge1xuXHRcdGNhdGFsb2dvLnJlbG9hZF9jYXRhbG9nbygpO1xuXHR9KTtcbn1cblxuJChkb2N1bWVudCkucmVhZHkobWFpbik7IiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpLFxuXHRjdGxnPXJlcXVpcmUoJy4vY2F0YWxvZ28nKTtcbm1vZHVsZS5leHBvcnRzPXtcblx0aGFuZGxlX2xvZ2luX3N1Ym1pdCA6ZnVuY3Rpb24gKCl7XG5cdFx0ICQoJ2Zvcm0jZm9ybS1sb2dpbm1hcmtldCcpLmZpbmQoJy5lcnJvcnMnKS5oaWRlKCk7XG5cdFx0ICQoJyNmb3JtLWxvZ2lubWFya2V0JykudmFsaWRhdGUoe1xuXHQgICAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uIChmb3JtKVxuXHQgICAgICAgIHtcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsIFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICAkKCcjZm9ybS1sb2dpbm1hcmtldCcpLmF0dHIoIFwiYWN0aW9uXCIgKSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogICQoICcjZm9ybS1sb2dpbm1hcmtldCcgKS5zZXJpYWxpemUoKSwgXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsIFxuXHRcdCAgICAgICAgICAgIGJlZm9yZVNlbmQ6ZnVuY3Rpb24oKXtcblx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS52YWwoJ1Byb2Nlc2FuZG8uLi4nKTtcblx0XHQgICAgICAgICAgICB9LFxuXHRcdCAgICAgICAgICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbihkYXRhKXtcblx0XHQgICAgICAgICAgICAgIGlmKCFkYXRhLmVycm9yKXtcblx0XHQgICAgICAgICAgICAgICB3aW5kb3cub3Blbih1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL21hcmtldCcsJ19zZWxmJyk7XG5cdFx0ICAgICAgICAgICAgICBcdG5ldyBQTm90aWZ5KHtcblx0XHQgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQmllbnZlbmlkbyEnLFxuXHRcdCAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXG5cdFx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5mbycsXG5cdFx0ICAgICAgICAgICAgICAgICAgICBkZWxheTogNTAwXG5cdFx0ICAgICAgICAgICAgICAgIH0pO1xuXHRcdCAgICAgICAgICAgICAgXG5cdFx0ICAgICAgICAgICAgICB9ZWxzZXtcblx0XHQgICAgICAgICAgICAgICAgJCgnI2Zvcm0tbG9naW5tYXJrZXQnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChkYXRhLm1zZyk7IFxuXHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdHdWFyZGFyJyk7XG5cdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblx0XHQgICAgICAgICAgICAgIH1cblx0XHQgICAgICAgICAgICB9LFxuXHRcdCAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKGpxWEhSLHRleHRTdGF0dXMsZXJyb3JUaHJvd24pe1xuXHRcdCAgICAgICAgICAgICAgJCgnI2Zvcm0tbG9naW5tYXJrZXQnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChqcVhIUi5zdGF0dXMrJyAnK3RleHRTdGF0dXMpO1xuXHRcdCAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBlcnJvckxhYmVsQ29udGFpbmVyOiBcIiNlcnJvcl9tZXNzYWdlX2JveFwiLFxuXHQgICAgICAgIHdyYXBwZXI6IFwibGlcIixcblx0ICAgICAgICBydWxlczpcblx0ICAgICAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgICAgICB1c2VybmFtZTogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICB9KTtcblx0fSxcblx0aGFuZGxlX3JlZ2lzdGVyX3N1Ym1pdCA6ZnVuY3Rpb24gKCl7XG5cdFx0ICQoJyNmb3JtLXJlZ2lzdGVybWFya2V0JykuZmluZCgnLmVycm9ycycpLmhpZGUoKTtcblx0XHQgJCgnI2Zvcm0tcmVnaXN0ZXJtYXJrZXQnKS52YWxpZGF0ZSh7XG5cdCAgICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKGZvcm0pXG5cdCAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgJC5hamF4KHtcblx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsIFxuXHQgICAgICAgICAgICAgICAgICAgIHVybDogICQoJyNmb3JtLXJlZ2lzdGVybWFya2V0JykuYXR0ciggXCJhY3Rpb25cIiApLFxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGE6ICAkKCAnI2Zvcm0tcmVnaXN0ZXJtYXJrZXQnICkuc2VyaWFsaXplKCksIFxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsIFxuXHRcdFx0ICAgICAgICAgICAgYmVmb3JlU2VuZDpmdW5jdGlvbigpe1xuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS52YWwoJ1Byb2Nlc2FuZG8uLi4nKTtcblx0XHRcdCAgICAgICAgICAgIH0sXG5cdFx0XHQgICAgICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHQgICAgICAgICAgICAgIGlmKCFkYXRhLmVycm9yKXtcblx0XHRcdCAgICAgICAgICAgICAgXHRuZXcgUE5vdGlmeSh7XG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQmllbnZlbmlkbyEnLFxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1zZyxcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nXG5cdFx0XHQgICAgICAgICAgICAgICAgfSk7XG5cdFx0XHQgICAgICAgICAgICAgICB3aW5kb3cub3Blbih1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL21hcmtldCcsJ19zZWxmJyk7XG5cdFx0XHQgICAgICAgICAgICAgIFxuXHRcdFx0ICAgICAgICAgICAgICB9ZWxzZXtcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjZm9ybS1yZWdpc3Rlcm1hcmtldCcpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGRhdGEubXNnKTsgXG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnZhbCgnR3VhcmRhcicpO1xuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdCAgICAgICAgICAgICAgfVxuXHRcdFx0ICAgICAgICAgICAgfSxcblx0XHRcdCAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKGpxWEhSLHRleHRTdGF0dXMsZXJyb3JUaHJvd24pe1xuXHRcdFx0ICAgICAgICAgICAgICAgJCgnI2Zvcm0tcmVnaXN0ZXJtYXJrZXQnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChqcVhIUi5zdGF0dXMrJyAnK3RleHRTdGF0dXMpO1xuXHRcdFx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgfSlcblx0ICAgICAgICB9LFxuXHQgICAgICAgIGVycm9yTGFiZWxDb250YWluZXI6IFwiI2Vycm9yX21lc3NhZ2VfYm94XCIsXG5cdCAgICAgICAgd3JhcHBlcjogXCJsaVwiLFxuXHQgICAgICAgIHJ1bGVzOlxuXHQgICAgICAgICAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgICAgIGZpcnN0X25hbWU6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgICAgICBlbWFpbDogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOiB7XG5cdCAgICAgICAgICAgICAgICAgICAgXHRcInJlcXVpcmVkXCI6dHJ1ZSxcblx0ICAgICAgICAgICAgICAgICAgICBcdFwibWlubGVuZ3RoXCI6NVxuXHQgICAgICAgICAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgICAgICAgICAgcmVwYXNzd29yZDp7XG5cdCAgICAgICAgICAgICAgICAgICAgXHRcInJlcXVpcmVkXCI6dHJ1ZSxcblx0ICAgICAgICAgICAgICAgICAgICBcdFwibWlubGVuZ3RoXCI6NSxcblx0ICAgICAgICAgICAgICAgICAgICBcdGVxdWFsVG86IFwiI3Bhc3N3b3JkXCJcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICB9KTtcblx0fSxcblx0aGFuZGxlX3BhZ29fY2MgOmZ1bmN0aW9uICgpe1xuXHRcdCAkKCcjZm9ybS1wYWdvLWNjJykuZmluZCgnLmVycm9ycycpLmhpZGUoKTtcblx0XHQgJCgnI2Zvcm0tcGFnby1jYycpLnZhbGlkYXRlKHtcblx0ICAgICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoZm9ybSlcblx0ICAgICAgICB7XG5cblx0ICAgICAgICAgICAgICAgICQuYWpheCh7XG5cdCAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLCBcblx0ICAgICAgICAgICAgICAgICAgICB1cmw6ICAkKCcjZm9ybS1wYWdvLWNjJykuYXR0ciggXCJhY3Rpb25cIiApLFxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGE6ICAkKCAnI2Zvcm0tcGFnby1jYycgKS5zZXJpYWxpemUoKSwgXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJywgXG5cdCAgICAgICAgICAgICAgICAgICAgYXN5bmM6ZmFsc2UsXG5cdFx0XHQgICAgICAgICAgICBiZWZvcmVTZW5kOmZ1bmN0aW9uKCl7XG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXRfY2MnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdF9jYycpLnZhbCgnUHJvY2VzYW5kby4uLicpO1xuXHRcdFx0ICAgICAgICAgICAgfSxcblx0XHRcdCAgICAgICAgICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdCAgICAgICAgICAgICAgaWYoIWRhdGEuZXJyb3Ipe1xuXHRcdFx0ICAgICAgICAgICAgICAgd2luZG93Lm9wZW4odXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9TdG9yZS9maW5hbGl6YXInLCdfc2VsZicpO1xuXHRcdFx0ICAgICAgICAgICAgICBcblx0XHRcdCAgICAgICAgICAgICAgfWVsc2V7XG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI2Zvcm0tcGFnby1jYycpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGRhdGEubXNnKTsgXG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdF9jYycpLnZhbCgnR3VhcmRhcicpO1xuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXRfY2MnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdCAgICAgICAgICAgICAgfVxuXHRcdFx0ICAgICAgICAgICAgfSxcblx0XHRcdCAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKGpxWEhSLHRleHRTdGF0dXMsZXJyb3JUaHJvd24pe1xuXHRcdFx0ICAgICAgICAgICAgXHR1dGlscy5sb2coanFYSFIpO1xuXHRcdFx0ICAgICAgICAgICAgXHR1dGlscy5sb2codGV4dFN0YXR1cyk7XG5cdFx0XHQgICAgICAgICAgICBcdHV0aWxzLmxvZyhlcnJvclRocm93bik7XG5cdFx0XHQgICAgICAgICAgICAgICAkKCcjZm9ybS1wYWdvLWNjJykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoanFYSFIuc3RhdHVzKycgJyt0ZXh0U3RhdHVzKTtcblx0XHRcdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH0pXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBlcnJvckxhYmVsQ29udGFpbmVyOiBcIiNlcnJvcl9tZXNzYWdlX2JveFwiLFxuXHQgICAgICAgIHdyYXBwZXI6IFwibGlcIixcblx0ICAgICAgICBydWxlczpcblx0ICAgICAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgICAgICBjcmVkaXRfY2FyZDogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIFwiY2FyZC1udW1iZXJcIjogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIFwiZXhwaXJ5LW1vbnRoXCI6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgICAgICBcImV4cGlyeS15ZWFyXCI6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgIH0pO1xuXHR9LFxuXHRoYW5kbGVfZW50cmVnYV9zdWJtaXQgOmZ1bmN0aW9uICgpe1xuXHRcdCAkKCcjZm9ybS1lbnRyZWdhJykuZmluZCgnLmVycm9ycycpLmhpZGUoKTtcblx0XHQgJCgnI2Zvcm0tZW50cmVnYScpLnZhbGlkYXRlKHtcblx0ICAgICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoZm9ybSlcblx0ICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICAkLmFqYXgoe1xuXHQgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJywgXG5cdCAgICAgICAgICAgICAgICAgICAgdXJsOiAgJCgnI2Zvcm0tZW50cmVnYScpLmF0dHIoIFwiYWN0aW9uXCIgKSxcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhOiAgJCggJyNmb3JtLWVudHJlZ2EnICkuc2VyaWFsaXplKCksIFxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsIFxuXHRcdFx0ICAgICAgICAgICAgYmVmb3JlU2VuZDpmdW5jdGlvbigpe1xuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS52YWwoJ1Byb2Nlc2FuZG8uLi4nKTtcblx0XHRcdCAgICAgICAgICAgIH0sXG5cdFx0XHQgICAgICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XG5cblx0XHRcdCAgICAgICAgICAgICAgaWYoIWRhdGEuZXJyb3Ipe1xuXHRcdFx0ICAgICAgICAgICAgICBcdG5ldyBQTm90aWZ5KHtcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdEaXJlY2Npw7NuIGRlIGZhY3R1cmFjacOzbiBhY3R1YWxpemFkYSEnLFxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1lc3NhZ2UsXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJ1xuXHRcdFx0ICAgICAgICAgICAgICAgIH0pO1xuXG5cdFx0XHQgICAgICAgICAgICAgIH1lbHNle1xuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNmb3JtLWVudHJlZ2EnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChkYXRhLm1lc3NhZ2UpOyBcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdHdWFyZGFyJyk7XG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0ICAgICAgICAgICAgICB9XG5cdFx0XHQgICAgICAgICAgICB9LFxuXHRcdFx0ICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24oanFYSFIsdGV4dFN0YXR1cyxlcnJvclRocm93bil7XG5cdFx0XHQgICAgICAgICAgICAgICAkKCcjZm9ybS1lbnRyZWdhJykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoanFYSFIuc3RhdHVzKycgJyt0ZXh0U3RhdHVzKTtcblx0XHRcdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH0pXG5cdCAgICAgICAgfSxcblx0ICAgICAgICBlcnJvckxhYmVsQ29udGFpbmVyOiBcIiNlcnJvcl9tZXNzYWdlX2JveFwiLFxuXHQgICAgICAgIHdyYXBwZXI6IFwibGlcIixcblx0ICAgICAgICBydWxlczpcblx0ICAgICAgICAgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgICAgICBmaXJzdF9uYW1lOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgbGFzdF9uYW1lOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgYWRkcmVzc18xOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgY2l1ZGFkOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgcGFpczogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgfSk7XG5cdH0sXG5cdGhhbmRsZV9lbnZpb19zdWJtaXQgOmZ1bmN0aW9uICgpe1xuXHRcdCAkKCcjZm9ybS1lbnZpbycpLmZpbmQoJy5lcnJvcnMnKS5oaWRlKCk7XG5cdFx0ICQoJyNmb3JtLWVudmlvJykudmFsaWRhdGUoe1xuXHQgICAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uIChmb3JtKVxuXHQgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgICQuYWpheCh7XG5cdCAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLCBcblx0ICAgICAgICAgICAgICAgICAgICB1cmw6ICAkKCcjZm9ybS1lbnZpbycpLmF0dHIoIFwiYWN0aW9uXCIgKSxcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhOiAgJCggJyNmb3JtLWVudmlvJyApLnNlcmlhbGl6ZSgpLCBcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCBcblx0XHRcdCAgICAgICAgICAgIGJlZm9yZVNlbmQ6ZnVuY3Rpb24oKXtcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdQcm9jZXNhbmRvLi4uJyk7XG5cdFx0XHQgICAgICAgICAgICB9LFxuXHRcdFx0ICAgICAgICAgICAgc3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xuXG5cdFx0XHQgICAgICAgICAgICAgIGlmKCFkYXRhLmVycm9yKXtcblx0XHRcdCAgICAgICAgICAgICAgXHRuZXcgUE5vdGlmeSh7XG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnRGlyZWNjacOzbiBkZSBlbnbDrW8gYWN0dWFsaXphZGEhJyxcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tZXNzYWdlLFxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5mbydcblx0XHRcdCAgICAgICAgICAgICAgICB9KTtcblx0XHRcdCAgICAgICAgICAgICAgICBcblx0XHRcdCAgICAgICAgICAgICAgfWVsc2V7XG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI2Zvcm0tZW52aW8nKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChkYXRhLm1lc3NhZ2UpOyBcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdHdWFyZGFyJyk7XG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0ICAgICAgICAgICAgICB9XG5cdFx0XHQgICAgICAgICAgICB9LFxuXHRcdFx0ICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24oanFYSFIsdGV4dFN0YXR1cyxlcnJvclRocm93bil7XG5cdFx0XHQgICAgICAgICAgICAgICAkKCcjZm9ybS1lbnZpbycpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGpxWEhSLnN0YXR1cysnICcrdGV4dFN0YXR1cyk7XG5cdFx0XHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9KVxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgZXJyb3JMYWJlbENvbnRhaW5lcjogXCIjZXJyb3JfbWVzc2FnZV9ib3hcIixcblx0ICAgICAgICB3cmFwcGVyOiBcImxpXCIsXG5cdCAgICAgICAgcnVsZXM6XG5cdCAgICAgICAgICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICAgICAgZmlyc3RfbmFtZTogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIGxhc3RfbmFtZTogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIGFkZHJlc3NfMTogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIGNpdWRhZDogXCJyZXF1aXJlZFwiLFxuXHQgICAgICAgICAgICAgICAgICAgIHBhaXM6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgIH0pO1xuXHR9LFxuXHRoYW5kbGVfcHJvZHVjdF9yZXZpZXdfc3VibWl0IDpmdW5jdGlvbiAoKXtcblx0XHQgJCgnI2Zvcm0tcHJvZHVjdHJldmlldycpLmZpbmQoJy5lcnJvcnMnKS5oaWRlKCk7XG5cdFx0ICQoJyNmb3JtLXByb2R1Y3RyZXZpZXcnKS52YWxpZGF0ZSh7XG5cdCAgICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKGZvcm0pXG5cdCAgICAgICAge1xuXHQgICAgICAgICAgICAgICAgJC5hamF4KHtcblx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsIFxuXHQgICAgICAgICAgICAgICAgICAgIHVybDogICQoJyNmb3JtLXByb2R1Y3RyZXZpZXcnKS5hdHRyKCBcImFjdGlvblwiICksXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YTogICQoICcjZm9ybS1wcm9kdWN0cmV2aWV3JyApLnNlcmlhbGl6ZSgpLCBcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCBcblx0XHRcdCAgICAgICAgICAgIGJlZm9yZVNlbmQ6ZnVuY3Rpb24oKXtcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdQcm9jZXNhbmRvLi4uJyk7XG5cdFx0XHQgICAgICAgICAgICB9LFxuXHRcdFx0ICAgICAgICAgICAgc3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0ICAgICAgICAgICAgICBpZighZGF0YS5lcnJvcil7XG5cdFx0XHQgICAgICAgICAgICAgIFx0JGNvbnRlbmVkb3IgPSAkKCcjcHJvZHVjdHJldmlld3MnKTtcblx0XHRcdFx0XHRcdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0L2dldF9yZXZpZXcnLHsnSUQnOmRhdGEuSUR9LGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdFx0XHRcdFx0JGNvbnRlbmVkb3IucHJlcGVuZChkYXRhKTtcblx0XHRcdFx0XHRcdFx0fSwndGV4dCcpO1xuXHRcdFx0XHRcdFx0XHQkKCcjZm9ybS1wcm9kdWN0cmV2aWV3JykudHJpZ2dlcigncmVzZXQnKTtcblx0XHRcdCAgICAgICAgICAgICAgfWVsc2V7XG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI2Zvcm0tcHJvZHVjdHJldmlldycpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGRhdGEubXNnKTsgXG5cdFx0XHQgICAgICAgICAgICAgIH1cblx0XHRcdCAgICAgICAgICAgIH0sXG5cdFx0XHQgICAgICAgICAgICBlcnJvcjpmdW5jdGlvbihqcVhIUix0ZXh0U3RhdHVzLGVycm9yVGhyb3duKXtcblx0XHRcdCAgICAgICAgICAgICAgICQoJyNmb3JtLXByb2R1Y3RyZXZpZXcnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChqcVhIUi5zdGF0dXMrJyAnK3RleHRTdGF0dXMpO1xuXHRcdFx0ICAgICAgICAgICAgfSxcblx0XHRcdCAgICAgICAgICAgIGNvbXBsZXRlOmZ1bmN0aW9uKCl7XG5cdFx0XHQgICAgICAgICAgICBcdCQoJyNzdWJtaXQnKS52YWwoJ0d1YXJkYXInKTtcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9KVxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgZXJyb3JMYWJlbENvbnRhaW5lcjogXCIjZXJyb3JfbWVzc2FnZV9ib3hcIixcblx0ICAgICAgICB3cmFwcGVyOiBcImxpXCIsXG5cdCAgICAgICAgcnVsZXM6XG5cdCAgICAgICAgICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICAgICAgbm9tYnJlOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgZW1haWw6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgICAgICBkZXRhbGxlOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICB9KTtcblx0fSxcblx0aGFuZGxlX2Jsb2dfcmV2aWV3X3N1Ym1pdCA6ZnVuY3Rpb24gKCl7XG5cdFx0ICQoJyNmb3JtLWJsb2dyZXZpZXcnKS5maW5kKCcuZXJyb3JzJykuaGlkZSgpO1xuXHRcdCAkKCcjZm9ybS1ibG9ncmV2aWV3JykudmFsaWRhdGUoe1xuXHQgICAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uIChmb3JtKVxuXHQgICAgICAgIHtcblx0ICAgICAgICAgICAgICAgICQuYWpheCh7XG5cdCAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLCBcblx0ICAgICAgICAgICAgICAgICAgICB1cmw6ICAkKCcjZm9ybS1ibG9ncmV2aWV3JykuYXR0ciggXCJhY3Rpb25cIiApLFxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGE6ICAkKCAnI2Zvcm0tYmxvZ3JldmlldycgKS5zZXJpYWxpemUoKSwgXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJywgXG5cdFx0XHQgICAgICAgICAgICBiZWZvcmVTZW5kOmZ1bmN0aW9uKCl7XG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnZhbCgnUHJvY2VzYW5kby4uLicpO1xuXHRcdFx0ICAgICAgICAgICAgfSxcblx0XHRcdCAgICAgICAgICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdCAgICAgICAgICAgICAgaWYoIWRhdGEuZXJyb3Ipe1xuXHRcdFx0ICAgICAgICAgICAgICBcdCRjb250ZW5lZG9yID0gJCgnI2Jsb2dyZXZpZXdzJyk7XG5cdFx0XHRcdFx0XHRcdCQucG9zdCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL21hcmtldC9nZXRfYmxvZ19yZXZpZXcnLHsnSUQnOmRhdGEuSUR9LGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdFx0XHRcdFx0JGNvbnRlbmVkb3IucHJlcGVuZChkYXRhKTtcblx0XHRcdFx0XHRcdFx0fSwndGV4dCcpO1xuXHRcdFx0XHRcdFx0XHQkKCcjZm9ybS1ibG9ncmV2aWV3JykudHJpZ2dlcigncmVzZXQnKTtcblx0XHRcdCAgICAgICAgICAgICAgfWVsc2V7XG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI2Zvcm0tYmxvZ3JldmlldycpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGRhdGEubXNnKTsgXG5cdFx0XHQgICAgICAgICAgICAgIH1cblx0XHRcdCAgICAgICAgICAgIH0sXG5cdFx0XHQgICAgICAgICAgICBlcnJvcjpmdW5jdGlvbihqcVhIUix0ZXh0U3RhdHVzLGVycm9yVGhyb3duKXtcblx0XHRcdCAgICAgICAgICAgICAgICQoJyNmb3JtLWJsb2dyZXZpZXcnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChqcVhIUi5zdGF0dXMrJyAnK3RleHRTdGF0dXMpO1xuXHRcdFx0ICAgICAgICAgICAgfSxcblx0XHRcdCAgICAgICAgICAgIGNvbXBsZXRlOmZ1bmN0aW9uKCl7XG5cdFx0XHQgICAgICAgICAgICBcdCQoJyNzdWJtaXQnKS52YWwoJ0d1YXJkYXInKTtcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9KVxuXHQgICAgICAgIH0sXG5cdCAgICAgICAgZXJyb3JMYWJlbENvbnRhaW5lcjogXCIjZXJyb3JfbWVzc2FnZV9ib3hcIixcblx0ICAgICAgICB3cmFwcGVyOiBcImxpXCIsXG5cdCAgICAgICAgcnVsZXM6XG5cdCAgICAgICAgICAgICAgICB7XG5cdCAgICAgICAgICAgICAgICAgICAgbm9tYnJlOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgZW1haWw6IFwicmVxdWlyZWRcIixcblx0ICAgICAgICAgICAgICAgICAgICBkZXRhbGxlOiBcInJlcXVpcmVkXCIsXG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICB9KTtcblx0fSxcbn0iLCJ2YXIgZXN0YV9jYXJnYW5kbz1mYWxzZTtcbm1vZHVsZS5leHBvcnRzPXtcblx0bG9nOiBmdW5jdGlvbihzdHJpbmcpe1xuXHRcdGlmKGNvbnNvbGUpIGNvbnNvbGUubG9nKHN0cmluZyk7XG5cdH0sXG5cdC8vT2J0aWVuZSB1biBhcnJheSBjb24gdG9kb3MgbG9zIHNlZ21ldG9zIGRlIGxhIFVSTFxuXHRnZXRCYXNlUGF0aCA6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHBvcnQgPSB3aW5kb3cubG9jYXRpb24ucG9ydDtcblx0XHR2YXIgcGF0aEFycmF5ID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCcvJyk7XG5cdFx0dmFyIGFwcGxpY2FjaW9uID0gKHdpbmRvdy5sb2NhdGlvbi5ob3N0ID09PSBcIjEyNy4wLjAuMVwiIHx8IHdpbmRvdy5sb2NhdGlvbi5ob3N0ID09PSBcImxvY2FsaG9zdFwiIHx8IHdpbmRvdy5sb2NhdGlvbi5ob3N0LmluZGV4T2YoJzE5Mi4xNjguJykgIT09IC0xKSA/IHBhdGhBcnJheVsxXSA6ICcnO1xuXHRcdGlmKHBvcnQ9PT1cIjMwMDBcIil7XG5cdFx0XHRhcHBsaWNhY2lvbiA9IGFwcGxpY2FjaW9uKydwb3MvJztcblx0XHR9XG5cdFx0aWYgKCF3aW5kb3cubG9jYXRpb24ub3JpZ2luKVxuXHRcdFx0cmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIHdpbmRvdy5sb2NhdGlvbi5ob3N0ICsgXCIvXCIgKyBhcHBsaWNhY2lvbjtcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgYXBwbGljYWNpb247XG5cdH0sXG5cdGVzdGFDYXJnYW5kbzpmdW5jdGlvbigpe1xuXHRcdHJldHVybiBlc3RhX2NhcmdhbmRvO1xuXHR9LFxuXHRzZXRFc3RhQ2FyZ2FuZG86ZnVuY3Rpb24odmFsb3Ipe1xuXHRcdGVzdGFfY2FyZ2FuZG89dmFsb3I7XG5cdH0sXG5cdGluaXRBamF4VGFiczpmdW5jdGlvbigpe1xuXHRcdCQoJ1tkYXRhLXRvZ2dsZT1cInRhYmFqYXhcIl0nKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0ICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG5cdFx0ICAgICAgICBsb2FkdXJsID0gJHRoaXMuYXR0cignaHJlZicpLFxuXHRcdCAgICAgICAgdGFyZyA9ICR0aGlzLmF0dHIoJ2RhdGEtdGFyZ2V0Jyk7XG5cblx0XHQgICAgJC5nZXQobG9hZHVybCwgZnVuY3Rpb24oZGF0YSkge1xuXHRcdCAgICAgICAgJCh0YXJnKS5odG1sKGRhdGEpO1xuXHRcdCAgICB9KTtcblxuXHRcdCAgICAkdGhpcy50YWIoJ3Nob3cnKTtcblx0XHQgICAgcmV0dXJuIGZhbHNlO1xuXHRcdH0pO1xuXHRcdCQoJ1tkYXRhLXRvZ2dsZT1cInRhYmFqYXhcIl06Zmlyc3QnKS5jbGljaygpO1xuXHR9XG59Il19
