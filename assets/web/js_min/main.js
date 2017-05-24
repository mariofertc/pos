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
//		$producto.attr('href')

		//var cantidad = parseInt($producto.attr('val'));

		$input = $producto.siblings('.cart_quantity_input');
		var cantidad = parseInt($input.val())?parseInt($input.val()):1;


		$.post(utils.getBasePath()+'/web/Carts/add_to_cart',{'producto':id_producto, 'cantidad': cantidad},function(data){
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
				new PNotify({
                    title: 'Advertencia!',
                    text: data.warning,
                    type: 'error',
		            delay: 200
                });
			}

		},'json');
	},
	handle_remove_from_cart: function(item){
		$this=this;
		$producto = $(item);
		var indice_producto = $producto.attr('indice');
		$.post(utils.getBasePath()+'/web/Carts/remove_from_cart',{'producto':indice_producto},function(data){
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
		var id_producto = $producto.attr('indice');
		//var id_producto = $producto.attr('indice')?$producto.attr('indice'):$producto.attr('href');
		var cantidad = parseInt($producto.attr('val'));

		$input = $producto.siblings('.cart_quantity_input');
		var valor = parseInt($input.val());
		var total = valor+cantidad;
		if(total>0)
		$.post(utils.getBasePath()+'/web/Carts/update_cart',{'producto':id_producto,'cantidad':total},function(data){
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

	$('#misma_direccion').val($(this).is(':checked')?1:0);
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
		              	if(data.module){
		                  window.open(utils.getBasePath()+'/web/'+data.module+"/"+(data.module=="Store"?"entrega":""),'_self');
		               }else{
		                 window.open(utils.getBasePath()+'/web/market','_self');
		           	   }
		           	   //NOTA: Produe error cuando se envia el pnotify primero. Por seguridad de navegadores no se permite.
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
			               $('#submit_cc').removeClass('disabled');
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
	                    "cvv" : "required"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwcm9ncmFtYXNfbWFudWFsXFxwcm95ZWN0b3NcXHBvc1xcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzovcHJvZ3JhbWFzX21hbnVhbC9wcm95ZWN0b3MvcG9zL2Fzc2V0cy93ZWIvanMvZGV2L2NhdGFsb2dvLmpzIiwiQzovcHJvZ3JhbWFzX21hbnVhbC9wcm95ZWN0b3MvcG9zL2Fzc2V0cy93ZWIvanMvZGV2L2Zha2VfYzQyZDU2MzMuanMiLCJDOi9wcm9ncmFtYXNfbWFudWFsL3Byb3llY3Rvcy9wb3MvYXNzZXRzL3dlYi9qcy9kZXYvZm9ybXVsYXJpb3MuanMiLCJDOi9wcm9ncmFtYXNfbWFudWFsL3Byb3llY3Rvcy9wb3MvYXNzZXRzL3dlYi9qcy9kZXYvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XHJcblx0ZnJtcz1yZXF1aXJlKCcuL2Zvcm11bGFyaW9zJyk7XHJcbm1vZHVsZS5leHBvcnRzPXtcclxuXHRhZGRfZmlsdGVyX3RvX21hcmtlZCA6IGZ1bmN0aW9uIChmaWx0cm8pe1xyXG5cdFx0JGJ0biAgPSAkKGZpbHRybyk7XHJcblx0ICAgICRidG4udG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpXHJcblx0XHRpZigkYnRuLmNzcygnb3BhY2l0eScpPT0xKXtcclxuXHRcdFx0JGJ0bi5hbmltYXRlKHsnb3BhY2l0eSc6MC41fSwgMjAwKTtcclxuXHRcdH1lbHNleyBcclxuXHRcdFx0JGJ0bi5hbmltYXRlKHsnb3BhY2l0eSc6MX0sIDIwMCk7XHJcblx0XHR9XHJcblx0ICAgIC8vQcOxYWRlIGxhIGNhdGVnb3JpYSBzZWxlY2Npb25hZGEgYWwgZGl2IGRlIGZpbHRybyBhcGxpY2Fkb3NcclxuXHRcdC8qJGZpbHRyb3MgPSAkKCcubWFya2V0LWFwcGxpZWQtZmlsdGVycycpO1xyXG5cdFx0JGZpbHRyb3MuZmluZCgnW2ZpbHRlcj1cIicrJChmaWx0cm8pLmF0dHIoJ2ZpbHRlcicpKydcIl0nKS5yZW1vdmUoKTtcclxuXHRcdCRsaSA9JCgnPGxpPjwvbGk+Jyk7XHJcblx0XHQkbGkuYXR0cigndGlwbycsJChmaWx0cm8pLmF0dHIoJ3RpcG8nKSk7XHJcblx0XHQkbGkuYXR0cignZmlsdGVyJywkKGZpbHRybykuYXR0cignZmlsdGVyJykpO1xyXG5cdFx0JGxpLmh0bWwoJChmaWx0cm8pLmF0dHIoJ2ZpbHRlcicpKTtcclxuXHRcdCRmaWx0cm9zLmFwcGVuZCgkbGkpOyovXHJcblx0fSxcclxuXHRnZXRfZmlsdGVycyA6ZnVuY3Rpb24gKCl7XHJcblx0XHR2YXIgZmlsdGVycz17J2NhdGVnb3JpYSc6W10sJ3ByZWNpb3MnOltdLCd0YWxsYSc6W10sJ2NvbG9yJzpbXSwndGFnJzpbXX07XHJcblx0XHQkLmVhY2goJCgnLm1hcmtldC1maWx0ZXInKSxmdW5jdGlvbihpbmRleCwgZWwpIHtcclxuXHRcdFx0aWYoJChlbCkuaGFzQ2xhc3MoJ2FjdGl2ZScpKXtcclxuXHRcdFx0XHRmaWx0ZXJzWyQoZWwpLmF0dHIoJ3RpcG8nKV0ucHVzaCgkKGVsKS5hdHRyKCdmaWx0ZXInKSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0ZmlsdGVycy5wcmVjaW9zPSQoJyNzbDInKS52YWwoKTtcclxuXHRcdHZhciB1bHQgPSAkKCcuZmVhdHVyZXNfaXRlbXMgLnByb2R1Y3QtaW1hZ2Utd3JhcHBlcjpsYXN0Jyk7XHJcblx0XHRmaWx0ZXJzLnVsdGltbyA9IHVsdC5pbmRleCgnLnByb2R1Y3QtaW1hZ2Utd3JhcHBlcicpO1xyXG5cdFx0ZmlsdGVycy5ub21icmUgPSAkKCcjc2VhcmNoX2lucHV0JykudmFsKCk7XHJcblx0XHRjb25zb2xlLmxvZyhmaWx0ZXJzLnRvU291cmNlKCkpO1xyXG5cdFx0cmV0dXJuIGZpbHRlcnM7XHJcblx0fSxcclxuXHRsb2FkX2Rlc3RhY2Fkb3MgOiBmdW5jdGlvbigpe1xyXG5cdFx0JCgnI21hcmtldC1kZXN0YWNhZG9zJykubG9hZCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL21hcmtldC9kZXN0YWNhZG9zJyk7XHJcblx0fSxcclxuXHRyZWxvYWRfY2F0YWxvZ28gOmZ1bmN0aW9uICgpe1xyXG5cdFx0dmFyIGZpbHRyb3MgPSB0aGlzLmdldF9maWx0ZXJzKCk7XHJcblx0XHRmaWx0cm9zLnVsdGltbz0tMTtcclxuXHRcdCQuZ2V0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0L2NhdGFsb2dvJyxmaWx0cm9zLCBmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdGlmKGRhdGEhPVwiXCIpe1xyXG5cdFx0XHRcdCQoJyNtYXJrZXQtY2F0YWxvZ28nKS5odG1sKGRhdGEpLmFuaW1hdGUoe29wYWNjaXR5OjAuOH0sIDUwMCk7XHJcblx0XHRcdH1cclxuXHRcdFx0dXRpbHMuc2V0RXN0YUNhcmdhbmRvKGZhbHNlKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0cmVmcmVzaF9jYXRhbG9nbyA6ZnVuY3Rpb24gKCl7XHJcblx0XHR2YXIgZmlsdHJvcyA9IHRoaXMuZ2V0X2ZpbHRlcnMoKTtcclxuXHRcdCQuZ2V0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0L2NhdGFsb2dvJyxmaWx0cm9zLCBmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdGlmKGRhdGEhPVwiXCIpe1xyXG5cdFx0XHRcdGlmKGZpbHRyb3MudWx0aW1vID09IC0xKXtcclxuXHRcdFx0XHRcdCQoJyNtYXJrZXQtY2F0YWxvZ28nKS5odG1sKGRhdGEpLmFuaW1hdGUoe29wYWNjaXR5OjAuOH0sIDUwMCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHQkKCcjbWFya2V0LWNhdGFsb2dvJykuYW5pbWF0ZSh7b3BhY2l0eTowLjZ9LCA1MDApLmFwcGVuZChkYXRhKS5hbmltYXRlKHtvcGFjaXR5OjF9LCAyMDApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHR1dGlscy5zZXRFc3RhQ2FyZ2FuZG8oZmFsc2UpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRoYW5kbGVfYWRkX3RvX3dsaXN0OiBmdW5jdGlvbihpdGVtKXtcclxuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XHJcblx0XHR2YXIgaWRfcHJvZHVjdG8gPSAkcHJvZHVjdG8uYXR0cignaHJlZicpO1xyXG5cdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvV2xpc3QvYWRkX3RvX3dsaXN0Jyx7J3Byb2R1Y3RvJzppZF9wcm9kdWN0b30sZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdGlmKCFkYXRhLmVycm9yKXtcclxuXHRcdFx0IG5ldyBQTm90aWZ5KHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Byb2R1Y3RvIGFncmVnYWRvIScsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nLFxyXG5cdFx0ICAgICAgICAgICAgZGVsYXk6IDIwMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdCBuZXcgUE5vdGlmeSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdFcnJvciBhbCBhZ3JlZ2FyIHByb2R1Y3RvIScsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcclxuXHRcdCAgICAgICAgICAgIGRlbGF5OiAyMDBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9LCdqc29uJyk7XHJcblx0fSxcclxuXHRoYW5kbGVfcmVtb3ZlX2Zyb21fd2xpc3Q6IGZ1bmN0aW9uKGl0ZW0pe1xyXG5cdFx0JHRoaXM9dGhpcztcclxuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XHJcblx0XHR2YXIgaWRfcHJvZHVjdG8gPSAkcHJvZHVjdG8uYXR0cignaHJlZicpO1xyXG5cdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvV2xpc3QvcmVtb3ZlX2Zyb21fd2xpc3QnLHsncHJvZHVjdG8nOmlkX3Byb2R1Y3RvfSxmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0aWYoIWRhdGEuZXJyb3Ipe1xyXG5cdFx0XHRcdCRwcm9kdWN0by5wYXJlbnRzKCd0cicpLmZhZGVPdXQoJ3Nsb3cnKS5yZW1vdmUoKTtcclxuXHRcdFx0XHQgbmV3IFBOb3RpZnkoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvZHVjdG9yIHJldGlyYWRvIScsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nLFxyXG5cdFx0ICAgICAgICAgICAgZGVsYXk6IDIwMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblx0XHRcdH1cclxuXHRcdH0sJ2pzb24nKTtcclxuXHR9LFxyXG5cdGhhbmRsZV9hZGRfdG9fY2FydDogZnVuY3Rpb24oaXRlbSl7XHJcblx0XHQkcHJvZHVjdG8gPSAkKGl0ZW0pO1xyXG5cdFx0dmFyIGlkX3Byb2R1Y3RvID0gJHByb2R1Y3RvLmF0dHIoJ2hyZWYnKTtcclxuLy9cdFx0JHByb2R1Y3RvLmF0dHIoJ2hyZWYnKVxyXG5cclxuXHRcdC8vdmFyIGNhbnRpZGFkID0gcGFyc2VJbnQoJHByb2R1Y3RvLmF0dHIoJ3ZhbCcpKTtcclxuXHJcblx0XHQkaW5wdXQgPSAkcHJvZHVjdG8uc2libGluZ3MoJy5jYXJ0X3F1YW50aXR5X2lucHV0Jyk7XHJcblx0XHR2YXIgY2FudGlkYWQgPSBwYXJzZUludCgkaW5wdXQudmFsKCkpP3BhcnNlSW50KCRpbnB1dC52YWwoKSk6MTtcclxuXHJcblxyXG5cdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvQ2FydHMvYWRkX3RvX2NhcnQnLHsncHJvZHVjdG8nOmlkX3Byb2R1Y3RvLCAnY2FudGlkYWQnOiBjYW50aWRhZH0sZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdGlmKCFkYXRhLmVycm9yKXtcclxuXHRcdFx0IG5ldyBQTm90aWZ5KHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Byb2R1Y3RvIGFncmVnYWRvIScsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nLFxyXG5cdFx0ICAgICAgICAgICAgZGVsYXk6IDIwMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdCAgbmV3IFBOb3RpZnkoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnRXJyb3IgYWwgYWdyZWdhciBwcm9kdWN0byEnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEubXNnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXHJcblx0XHQgICAgICAgICAgICBkZWxheTogMjAwXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHRcdFx0XHRuZXcgUE5vdGlmeSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdBZHZlcnRlbmNpYSEnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEud2FybmluZyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxyXG5cdFx0ICAgICAgICAgICAgZGVsYXk6IDIwMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9LCdqc29uJyk7XHJcblx0fSxcclxuXHRoYW5kbGVfcmVtb3ZlX2Zyb21fY2FydDogZnVuY3Rpb24oaXRlbSl7XHJcblx0XHQkdGhpcz10aGlzO1xyXG5cdFx0JHByb2R1Y3RvID0gJChpdGVtKTtcclxuXHRcdHZhciBpbmRpY2VfcHJvZHVjdG8gPSAkcHJvZHVjdG8uYXR0cignaW5kaWNlJyk7XHJcblx0XHQkLnBvc3QodXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9DYXJ0cy9yZW1vdmVfZnJvbV9jYXJ0Jyx7J3Byb2R1Y3RvJzppbmRpY2VfcHJvZHVjdG99LGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRpZighZGF0YS5lcnJvcil7XHJcblx0XHRcdFx0JHByb2R1Y3RvLnBhcmVudHMoJ3RyJykuZmFkZU91dCgnc2xvdycpLnJlbW92ZSgpO1xyXG5cdFx0XHRcdCR0aGlzLnN1YnRvdGFsX2NhcnQoKTtcclxuXHRcdFx0XHRuZXcgUE5vdGlmeSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQcm9kdWN0b3IgcmV0aXJhZG8hJyxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1zZyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5mbycsXHJcblx0XHQgICAgICAgICAgICBkZWxheTogMjAwXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSwnanNvbicpO1xyXG5cdH0sXHJcblx0aGFuZGxlX3pvb21faW1hZ2VuOiBmdW5jdGlvbihpdGVtKXtcclxuXHRcdCR0aGlzPXRoaXM7XHJcblx0XHQkcHJvZHVjdG8gPSAkKGl0ZW0pO1xyXG5cdFx0Q3VzdG9tYm94Lm9wZW4oe1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiAnI21haW4taW1hZ2VuLXByb2R1Y3RvJyxcclxuICAgICAgICAgICAgICAgIGVmZmVjdDogJ2ZhZGVpbicsXHJcbiAgICAgICAgICAgICAgICBvcGVuOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBcdCRwcm9kdWN0by50b2dnbGUoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjbG9zZTpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgXHQkcHJvZHVjdG8udG9nZ2xlKCk7XHRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblx0fSxcclxuXHRoYW5kbGVfcmVwbGFjZV9pbWFnZW46IGZ1bmN0aW9uKGl0ZW0pe1xyXG5cdFx0JHRoaXM9dGhpcztcclxuXHRcdCRwcm9kdWN0byA9ICQoaXRlbSk7XHJcblx0XHQkY29udGVuZWRvciA9ICQoJyNtYWluLWltYWdlbi1wcm9kdWN0bycpO1xyXG5cdFx0JGltYWdlbiA9ICRwcm9kdWN0by5jaGlsZHJlbignaW1nJyk7XHJcblx0XHQkaW1nX2NvbnRlbnQgPSAkY29udGVuZWRvci5jaGlsZHJlbignaW1nJyk7XHJcblx0XHQkaW1nX2NvbnRlbnQuYXR0cignc3JjJywgJGltYWdlbi5hdHRyKCdzcmMnKSk7XHJcblx0fSxcclxuXHRjbGVhcl9jYXJ0OmZ1bmN0aW9uKCl7XHJcblx0XHQkdGhpcz10aGlzO1xyXG5cdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0L2NsZWFyX2NhcnQnLHt9LGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRpZighZGF0YS5lcnJvcil7XHJcblx0XHRcdFx0JHRoaXMuc3VidG90YWxfY2FydCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9LCdqc29uJyk7XHJcblx0fSxcclxuXHRzdWJ0b3RhbF9pdGVtOmZ1bmN0aW9uKHRyKXtcclxuXHRcdCR0ciA9ICAkKHRyKTtcclxuXHRcdHZhciBwcmVjaW8gPSBwYXJzZUZsb2F0KCR0ci5maW5kKCcuY2FydF9wcmljZSBwIHNwYW4nKS5odG1sKCkpO1xyXG5cdFx0dmFyIGNhbnRpZGFkID0gcGFyc2VJbnQoJHRyLmZpbmQoJy5jYXJ0X3F1YW50aXR5X2lucHV0JykudmFsKCkpO1xyXG5cdFx0dmFyIHJlc3VsdGFkbyA9ICR0ci5maW5kKCcuY2FydF90b3RhbF9wcmljZSBzcGFuJyk7XHJcblx0XHRyZXN1bHRhZG8uaHRtbChwcmVjaW8qY2FudGlkYWQpO1xyXG5cdH0sXHJcblx0c3VidG90YWxfY2FydDpmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGFjdW11bGFkb3I9MDtcclxuXHRcdCQuZWFjaCgkKCcjaXRlbXMtY2Fycml0byB0cicpLCBmdW5jdGlvbihpbmRleCwgdmFsKSB7XHJcblx0XHRcdCAkaXRlbSA9ICQodmFsKTtcclxuXHJcblx0XHRcdCB2YXIgc3VidG90YWwgPSBwYXJzZUZsb2F0KCRpdGVtLmZpbmQoJy5jYXJ0X3RvdGFsX3ByaWNlIHNwYW4nKS5odG1sKCkpO1xyXG5cdFx0XHQgYWN1bXVsYWRvcis9c3VidG90YWw7XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0dmFyIHN1YnRvdGFsX2NhcnQgPSAkKCcjY2FydC1zdWJ0b3RhbCBzcGFuJyk7XHJcblx0XHRzdWJ0b3RhbF9jYXJ0Lmh0bWwoYWN1bXVsYWRvcik7XHJcblxyXG5cdFx0dmFyIHRvdGFsX2NhcnQgPSAkKCcjY2FydC10b3RhbCBzcGFuJyk7XHJcblx0XHR0b3RhbF9jYXJ0Lmh0bWwoYWN1bXVsYWRvcik7XHJcblx0fSxcclxuXHR1cGRhdGVfY2FudGlkYWRfaXRlbTogZnVuY3Rpb24oaXRlbSl7XHJcblx0XHQkdGhpcz10aGlzO1xyXG5cdFx0JHByb2R1Y3RvID0gJChpdGVtKTtcclxuXHRcdHZhciBpZF9wcm9kdWN0byA9ICRwcm9kdWN0by5hdHRyKCdpbmRpY2UnKTtcclxuXHRcdC8vdmFyIGlkX3Byb2R1Y3RvID0gJHByb2R1Y3RvLmF0dHIoJ2luZGljZScpPyRwcm9kdWN0by5hdHRyKCdpbmRpY2UnKTokcHJvZHVjdG8uYXR0cignaHJlZicpO1xyXG5cdFx0dmFyIGNhbnRpZGFkID0gcGFyc2VJbnQoJHByb2R1Y3RvLmF0dHIoJ3ZhbCcpKTtcclxuXHJcblx0XHQkaW5wdXQgPSAkcHJvZHVjdG8uc2libGluZ3MoJy5jYXJ0X3F1YW50aXR5X2lucHV0Jyk7XHJcblx0XHR2YXIgdmFsb3IgPSBwYXJzZUludCgkaW5wdXQudmFsKCkpO1xyXG5cdFx0dmFyIHRvdGFsID0gdmFsb3IrY2FudGlkYWQ7XHJcblx0XHRpZih0b3RhbD4wKVxyXG5cdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvQ2FydHMvdXBkYXRlX2NhcnQnLHsncHJvZHVjdG8nOmlkX3Byb2R1Y3RvLCdjYW50aWRhZCc6dG90YWx9LGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRpZighZGF0YS5lcnJvcil7XHJcblx0XHRcdFx0aWYoY2FudGlkYWQ9PTApe1xyXG5cdFx0XHRcdFx0bmV3IFBOb3RpZnkoe1xyXG5cdFx0ICAgICAgICAgICAgICAgIHRpdGxlOiAnQ2FudGlkYWQgYWN0dWFsaXphZGEhJyxcclxuXHRcdCAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLm1zZyxcclxuXHRcdCAgICAgICAgICAgICAgICB0eXBlOiAnaW5mbycsXHJcblx0XHRcdCAgICAgICAgICAgIGRlbGF5OiAyMDBcclxuXHRcdCAgICAgICAgICAgIH0pO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0JGlucHV0LnZhbCh0b3RhbCk7XHJcblx0XHRcdFx0XHQkdGhpcy5zdWJ0b3RhbF9pdGVtKCRpbnB1dC5wYXJlbnRzKCd0cicpKTtcclxuXHRcdFx0XHRcdCR0aGlzLnN1YnRvdGFsX2NhcnQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdCAgbmV3IFBOb3RpZnkoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnRXJyb3IgYWwgYWN0dWFsaXphciBjYW50aWRhZCEnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEubXNnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXHJcblx0XHQgICAgICAgICAgICBkZWxheTogMjAwXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSwnanNvbicpO1xyXG5cdH1cclxufSIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKSxcclxuIGNhdGFsb2dvID0gcmVxdWlyZSgnLi9jYXRhbG9nbycpLFxyXG4gZnJtcyA9IHJlcXVpcmUoJy4vZm9ybXVsYXJpb3MnKTtcclxuXHJcbnV0aWxzLmxvZyh1dGlscy5nZXRCYXNlUGF0aCgpKTsgXHJcbi8qcHJpY2UgcmFuZ2UqL1xyXG4kKCcjc2wyJykuc2xpZGVyKCkub24oJ3NsaWRlJyxmdW5jdGlvbigpe2NhdGFsb2dvLnJlbG9hZF9jYXRhbG9nbygpfSk7XHJcblxyXG4vKnNjcm9sbCB0byB0b3AqL1xyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG5cdCQoZnVuY3Rpb24gKCkge1xyXG5cdFx0JC5zY3JvbGxVcCh7XHJcblx0ICAgICAgICBzY3JvbGxOYW1lOiAnc2Nyb2xsVXAnLCAvLyBFbGVtZW50IElEXHJcblx0ICAgICAgICBzY3JvbGxEaXN0YW5jZTogMzAwLCAvLyBEaXN0YW5jZSBmcm9tIHRvcC9ib3R0b20gYmVmb3JlIHNob3dpbmcgZWxlbWVudCAocHgpXHJcblx0ICAgICAgICBzY3JvbGxGcm9tOiAndG9wJywgLy8gJ3RvcCcgb3IgJ2JvdHRvbSdcclxuXHQgICAgICAgIHNjcm9sbFNwZWVkOiAzMDAsIC8vIFNwZWVkIGJhY2sgdG8gdG9wIChtcylcclxuXHQgICAgICAgIGVhc2luZ1R5cGU6ICdsaW5lYXInLCAvLyBTY3JvbGwgdG8gdG9wIGVhc2luZyAoc2VlIGh0dHA6Ly9lYXNpbmdzLm5ldC8pXHJcblx0ICAgICAgICBhbmltYXRpb246ICdmYWRlJywgLy8gRmFkZSwgc2xpZGUsIG5vbmVcclxuXHQgICAgICAgIGFuaW1hdGlvblNwZWVkOiAyMDAsIC8vIEFuaW1hdGlvbiBpbiBzcGVlZCAobXMpXHJcblx0ICAgICAgICBzY3JvbGxUcmlnZ2VyOiBmYWxzZSwgLy8gU2V0IGEgY3VzdG9tIHRyaWdnZXJpbmcgZWxlbWVudC4gQ2FuIGJlIGFuIEhUTUwgc3RyaW5nIG9yIGpRdWVyeSBvYmplY3RcclxuXHRcdFx0XHRcdC8vc2Nyb2xsVGFyZ2V0OiBmYWxzZSwgLy8gU2V0IGEgY3VzdG9tIHRhcmdldCBlbGVtZW50IGZvciBzY3JvbGxpbmcgdG8gdGhlIHRvcFxyXG5cdCAgICAgICAgc2Nyb2xsVGV4dDogJzxpIGNsYXNzPVwiZmEgZmEtYW5nbGUtdXBcIj48L2k+JywgLy8gVGV4dCBmb3IgZWxlbWVudCwgY2FuIGNvbnRhaW4gSFRNTFxyXG5cdCAgICAgICAgc2Nyb2xsVGl0bGU6IGZhbHNlLCAvLyBTZXQgYSBjdXN0b20gPGE+IHRpdGxlIGlmIHJlcXVpcmVkLlxyXG5cdCAgICAgICAgc2Nyb2xsSW1nOiBmYWxzZSwgLy8gU2V0IHRydWUgdG8gdXNlIGltYWdlXHJcblx0ICAgICAgICBhY3RpdmVPdmVybGF5OiBmYWxzZSwgLy8gU2V0IENTUyBjb2xvciB0byBkaXNwbGF5IHNjcm9sbFVwIGFjdGl2ZSBwb2ludCwgZS5nICcjMDBGRkZGJ1xyXG5cdCAgICAgICAgekluZGV4OiAyMTQ3NDgzNjQ3IC8vIFotSW5kZXggZm9yIHRoZSBvdmVybGF5XHJcblx0XHR9KTtcclxuXHR9KTtcclxufSk7XHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcubWFya2V0LWZpbHRlcicsZnVuY3Rpb24oZSl7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGNhdGFsb2dvLmFkZF9maWx0ZXJfdG9fbWFya2VkKCQodGhpcykpOyAgICBcclxuXHRjYXRhbG9nby5yZWxvYWRfY2F0YWxvZ28oKTtcclxufSk7XHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcuYWRkLXRvLWNhcnQnLGZ1bmN0aW9uKGUpe1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRjYXRhbG9nby5oYW5kbGVfYWRkX3RvX2NhcnQoJCh0aGlzKSk7ICAgIFxyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5yZW1vdmUtZnJvbS1jYXJ0JyxmdW5jdGlvbihlKXtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0Y2F0YWxvZ28uaGFuZGxlX3JlbW92ZV9mcm9tX2NhcnQoJCh0aGlzKSk7ICAgIFxyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5hZGQtdG8td2xpc3QnLGZ1bmN0aW9uKGUpe1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRjYXRhbG9nby5oYW5kbGVfYWRkX3RvX3dsaXN0KCQodGhpcykpOyAgICBcclxufSk7XHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCcucmVtb3ZlLWZyb20td2xpc3QnLGZ1bmN0aW9uKGUpe1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRjYXRhbG9nby5oYW5kbGVfcmVtb3ZlX2Zyb21fd2xpc3QoJCh0aGlzKSk7ICAgIFxyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJy5jYXJ0X3F1YW50aXR5X3VwLCAuY2FydF9xdWFudGl0eV9kb3duLCAuYWRkLXRvLWNhcnQyJyxmdW5jdGlvbihlKXtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0Y2F0YWxvZ28udXBkYXRlX2NhbnRpZGFkX2l0ZW0oJCh0aGlzKSk7ICAgIFxyXG5cdFxyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdjbGljaycsJyNtYWluLWltYWdlbi1wcm9kdWN0byBoMycsZnVuY3Rpb24oZSl7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGNhdGFsb2dvLmhhbmRsZV96b29tX2ltYWdlbigkKHRoaXMpKTsgICAgXHJcbn0pO1xyXG5cclxuJChkb2N1bWVudCkub24oJ2NsaWNrJywnLmltYWdlbi1wcm9kdWN0bycsZnVuY3Rpb24oZSl7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGNhdGFsb2dvLmhhbmRsZV9yZXBsYWNlX2ltYWdlbigkKHRoaXMpKTsgICAgXHJcbn0pO1xyXG5cclxuJChkb2N1bWVudCkub24oJ2NsaWNrJywnLm9sdmlkb19wYXNzJyxmdW5jdGlvbihlKXtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0JCgnI3BhbmVsLW9sdmlkYS1wYXNzJykudG9nZ2xlKCdzbG93Jyk7ICAgIFxyXG59KTtcclxuJChkb2N1bWVudCkub24oJ2NoYW5nZScsJyN0b2dnbGVfZGlyZWNjaW9uX2RlX2VudmlvJyxmdW5jdGlvbihlKXtcclxuXHJcblx0JCgnI21pc21hX2RpcmVjY2lvbicpLnZhbCgkKHRoaXMpLmlzKCc6Y2hlY2tlZCcpPzE6MCk7XHJcblx0JCgnI2Zvcm0tZW52aW8nKS50b2dnbGUoJ3Nsb3cnKTtcclxufSk7XHJcblxyXG51dGlscy5zZXRFc3RhQ2FyZ2FuZG8oZmFsc2UpO1xyXG4vL29uIHNjcm9sbCBnZXRzIHdoZW4gYm90dG9tIG9mIHRoZSBwYWdlIGlzIHJlYWNoZWQgYW5kIGNhbGxzIHRoZSBmdW5jdGlvbiBkbyBsb2FkIG1vcmUgY29udGVudFxyXG4kKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKGUpe1xyXG5cdC8vTm90IGFsd2F5cyB0aGUgcG9zID09IGggc3RhdGVtZW50IGlzIHZlcmlmaWVkLCBleHBlY2lhbGx5IG9uIG1vYmlsZSBkZXZpY2VzLCB0aGF0J3Mgd2h5IGEgMzAwcHggb2YgbWFyZ2luIGFyZSBhc3N1bWVkLlxyXG5cdGlmKCQod2luZG93KS5zY3JvbGxUb3AoKSArICQod2luZG93KS5oZWlnaHQoKSA+PSAkKGRvY3VtZW50KS5oZWlnaHQoKSAtIDMwMCkge1xyXG5cdFx0dXRpbHMubG9nKFwiRmluYWwgZGUgcMOhZ2luYSBhbGNhbnphZG9cIik7XHJcblx0XHRpZigkKCcjbWFya2V0LWNhdGFsb2dvJykubGVuZ3RoICYmICghdXRpbHMuZXN0YUNhcmdhbmRvKCkpKXtcclxuXHRcdFx0Y2F0YWxvZ28ucmVmcmVzaF9jYXRhbG9nbygpO1xyXG5cdFx0fVxyXG5cdFx0dXRpbHMuc2V0RXN0YUNhcmdhbmRvKHRydWUpO1xyXG5cdH1cclxufSk7XHJcblxyXG5mdW5jdGlvbiBtYWluKCl7XHJcblx0Y2F0YWxvZ28ucmVsb2FkX2NhdGFsb2dvKCk7XHJcblx0ZnJtcy5oYW5kbGVfbG9naW5fc3VibWl0KCk7XHJcblx0ZnJtcy5oYW5kbGVfcmVnaXN0ZXJfc3VibWl0KCk7XHJcblx0ZnJtcy5oYW5kbGVfcGFnb19jYygpO1xyXG5cdGZybXMuaGFuZGxlX2VudHJlZ2Ffc3VibWl0KCk7XHJcblx0ZnJtcy5oYW5kbGVfZW52aW9fc3VibWl0KCk7XHJcblx0ZnJtcy5oYW5kbGVfcHJvZHVjdF9yZXZpZXdfc3VibWl0KCk7XHJcblx0ZnJtcy5oYW5kbGVfYmxvZ19yZXZpZXdfc3VibWl0KCk7XHJcblx0Y2F0YWxvZ28ubG9hZF9kZXN0YWNhZG9zKCk7XHJcblx0dXRpbHMuaW5pdEFqYXhUYWJzKCk7XHJcblxyXG5cdCQoJyNzZWFyY2hfaW5wdXQnKS5rZXl1cChmdW5jdGlvbihlKSB7XHJcblx0XHRjYXRhbG9nby5yZWxvYWRfY2F0YWxvZ28oKTtcclxuXHR9KTtcclxufVxyXG5cclxuJChkb2N1bWVudCkucmVhZHkobWFpbik7IiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpLFxyXG5cdGN0bGc9cmVxdWlyZSgnLi9jYXRhbG9nbycpO1xyXG5tb2R1bGUuZXhwb3J0cz17XHJcblx0aGFuZGxlX2xvZ2luX3N1Ym1pdCA6ZnVuY3Rpb24gKCl7XHJcblx0XHQgJCgnZm9ybSNmb3JtLWxvZ2lubWFya2V0JykuZmluZCgnLmVycm9ycycpLmhpZGUoKTtcclxuXHRcdCAkKCcjZm9ybS1sb2dpbm1hcmtldCcpLnZhbGlkYXRlKHtcclxuXHQgICAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uIChmb3JtKVxyXG5cdCAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsIFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogICQoJyNmb3JtLWxvZ2lubWFya2V0JykuYXR0ciggXCJhY3Rpb25cIiApLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6ICAkKCAnI2Zvcm0tbG9naW5tYXJrZXQnICkuc2VyaWFsaXplKCksIFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsIFxyXG5cdFx0ICAgICAgICAgICAgYmVmb3JlU2VuZDpmdW5jdGlvbigpe1xyXG5cdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS52YWwoJ1Byb2Nlc2FuZG8uLi4nKTtcclxuXHRcdCAgICAgICAgICAgIH0sXHJcblx0XHQgICAgICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XHJcblxyXG5cdFx0ICAgICAgICAgICAgICBpZighZGF0YS5lcnJvcil7XHJcblx0XHQgICAgICAgICAgICAgIFx0aWYoZGF0YS5tb2R1bGUpe1xyXG5cdFx0ICAgICAgICAgICAgICAgICAgd2luZG93Lm9wZW4odXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi8nK2RhdGEubW9kdWxlK1wiL1wiKyhkYXRhLm1vZHVsZT09XCJTdG9yZVwiP1wiZW50cmVnYVwiOlwiXCIpLCdfc2VsZicpO1xyXG5cdFx0ICAgICAgICAgICAgICAgfWVsc2V7XHJcblx0XHQgICAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0JywnX3NlbGYnKTtcclxuXHRcdCAgICAgICAgICAgXHQgICB9XHJcblx0XHQgICAgICAgICAgIFx0ICAgLy9OT1RBOiBQcm9kdWUgZXJyb3IgY3VhbmRvIHNlIGVudmlhIGVsIHBub3RpZnkgcHJpbWVyby4gUG9yIHNlZ3VyaWRhZCBkZSBuYXZlZ2Fkb3JlcyBubyBzZSBwZXJtaXRlLlxyXG5cdFx0ICAgICAgICAgICAgICBcdG5ldyBQTm90aWZ5KHtcclxuXHRcdCAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdCaWVudmVuaWRvIScsXHJcblx0XHQgICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEubXNnLFxyXG5cdFx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5mbycsXHJcblx0XHQgICAgICAgICAgICAgICAgICAgIGRlbGF5OiA1MDBcclxuXHRcdCAgICAgICAgICAgICAgICB9KTtcclxuXHRcdCAgICAgICAgICAgICAgfWVsc2V7XHJcblx0XHQgICAgICAgICAgICAgICAgJCgnI2Zvcm0tbG9naW5tYXJrZXQnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChkYXRhLm1zZyk7IFxyXG5cdFx0ICAgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS52YWwoJ0d1YXJkYXInKTtcclxuXHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHQgICAgICAgICAgICAgIH1cclxuXHRcdCAgICAgICAgICAgIH0sXHJcblx0XHQgICAgICAgICAgICBlcnJvcjpmdW5jdGlvbihqcVhIUix0ZXh0U3RhdHVzLGVycm9yVGhyb3duKXtcclxuXHRcdCAgICAgICAgICAgICAgJCgnI2Zvcm0tbG9naW5tYXJrZXQnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChqcVhIUi5zdGF0dXMrJyAnK3RleHRTdGF0dXMpO1xyXG5cdFx0ICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcblx0ICAgICAgICB9LFxyXG5cdCAgICAgICAgZXJyb3JMYWJlbENvbnRhaW5lcjogXCIjZXJyb3JfbWVzc2FnZV9ib3hcIixcclxuXHQgICAgICAgIHdyYXBwZXI6IFwibGlcIixcclxuXHQgICAgICAgIHJ1bGVzOlxyXG5cdCAgICAgICAgICAgICAgICB7XHJcblx0ICAgICAgICAgICAgICAgICAgICB1c2VybmFtZTogXCJyZXF1aXJlZFwiLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6IFwicmVxdWlyZWRcIixcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICB9KTtcclxuXHR9LFxyXG5cdGhhbmRsZV9yZWdpc3Rlcl9zdWJtaXQgOmZ1bmN0aW9uICgpe1xyXG5cdFx0ICQoJyNmb3JtLXJlZ2lzdGVybWFya2V0JykuZmluZCgnLmVycm9ycycpLmhpZGUoKTtcclxuXHRcdCAkKCcjZm9ybS1yZWdpc3Rlcm1hcmtldCcpLnZhbGlkYXRlKHtcclxuXHQgICAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uIChmb3JtKVxyXG5cdCAgICAgICAge1xyXG5cdCAgICAgICAgICAgICAgICAkLmFqYXgoe1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLCBcclxuXHQgICAgICAgICAgICAgICAgICAgIHVybDogICQoJyNmb3JtLXJlZ2lzdGVybWFya2V0JykuYXR0ciggXCJhY3Rpb25cIiApLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YTogICQoICcjZm9ybS1yZWdpc3Rlcm1hcmtldCcgKS5zZXJpYWxpemUoKSwgXHJcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCBcclxuXHRcdFx0ICAgICAgICAgICAgYmVmb3JlU2VuZDpmdW5jdGlvbigpe1xyXG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdQcm9jZXNhbmRvLi4uJyk7XHJcblx0XHRcdCAgICAgICAgICAgIH0sXHJcblx0XHRcdCAgICAgICAgICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0ICAgICAgICAgICAgICBpZighZGF0YS5lcnJvcil7XHJcblx0XHRcdCAgICAgICAgICAgICAgXHRuZXcgUE5vdGlmeSh7XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdCaWVudmVuaWRvIScsXHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tc2csXHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nXHJcblx0XHRcdCAgICAgICAgICAgICAgICB9KTtcclxuXHRcdFx0ICAgICAgICAgICAgICAgd2luZG93Lm9wZW4odXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9tYXJrZXQnLCdfc2VsZicpO1xyXG5cdFx0XHQgICAgICAgICAgICAgIFxyXG5cdFx0XHQgICAgICAgICAgICAgIH1lbHNle1xyXG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI2Zvcm0tcmVnaXN0ZXJtYXJrZXQnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChkYXRhLm1zZyk7IFxyXG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnZhbCgnR3VhcmRhcicpO1xyXG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHQgICAgICAgICAgICAgIH1cclxuXHRcdFx0ICAgICAgICAgICAgfSxcclxuXHRcdFx0ICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24oanFYSFIsdGV4dFN0YXR1cyxlcnJvclRocm93bil7XHJcblx0XHRcdCAgICAgICAgICAgICAgICQoJyNmb3JtLXJlZ2lzdGVybWFya2V0JykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoanFYSFIuc3RhdHVzKycgJyt0ZXh0U3RhdHVzKTtcclxuXHRcdFx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICB9KVxyXG5cdCAgICAgICAgfSxcclxuXHQgICAgICAgIGVycm9yTGFiZWxDb250YWluZXI6IFwiI2Vycm9yX21lc3NhZ2VfYm94XCIsXHJcblx0ICAgICAgICB3cmFwcGVyOiBcImxpXCIsXHJcblx0ICAgICAgICBydWxlczpcclxuXHQgICAgICAgICAgICAgICAge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgZmlyc3RfbmFtZTogXCJyZXF1aXJlZFwiLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgZW1haWw6IFwicmVxdWlyZWRcIixcclxuXHQgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOiB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBcdFwicmVxdWlyZWRcIjp0cnVlLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgXHRcIm1pbmxlbmd0aFwiOjVcclxuXHQgICAgICAgICAgICAgICAgICAgIH0sXHJcblx0ICAgICAgICAgICAgICAgICAgICByZXBhc3N3b3JkOntcclxuXHQgICAgICAgICAgICAgICAgICAgIFx0XCJyZXF1aXJlZFwiOnRydWUsXHJcblx0ICAgICAgICAgICAgICAgICAgICBcdFwibWlubGVuZ3RoXCI6NSxcclxuXHQgICAgICAgICAgICAgICAgICAgIFx0ZXF1YWxUbzogXCIjcGFzc3dvcmRcIlxyXG5cdCAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgIH0pO1xyXG5cdH0sXHJcblx0aGFuZGxlX3BhZ29fY2MgOmZ1bmN0aW9uICgpe1xyXG5cdFx0ICQoJyNmb3JtLXBhZ28tY2MnKS5maW5kKCcuZXJyb3JzJykuaGlkZSgpO1xyXG5cdFx0ICQoJyNmb3JtLXBhZ28tY2MnKS52YWxpZGF0ZSh7XHJcblx0ICAgICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoZm9ybSlcclxuXHQgICAgICAgIHtcclxuXHJcblx0ICAgICAgICAgICAgICAgICQuYWpheCh7XHJcblx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsIFxyXG5cdCAgICAgICAgICAgICAgICAgICAgdXJsOiAgJCgnI2Zvcm0tcGFnby1jYycpLmF0dHIoIFwiYWN0aW9uXCIgKSxcclxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGE6ICAkKCAnI2Zvcm0tcGFnby1jYycgKS5zZXJpYWxpemUoKSwgXHJcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCBcclxuXHQgICAgICAgICAgICAgICAgICAgIGFzeW5jOmZhbHNlLFxyXG5cdFx0XHQgICAgICAgICAgICBiZWZvcmVTZW5kOmZ1bmN0aW9uKCl7XHJcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdF9jYycpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXRfY2MnKS52YWwoJ1Byb2Nlc2FuZG8uLi4nKTtcclxuXHRcdFx0ICAgICAgICAgICAgfSxcclxuXHRcdFx0ICAgICAgICAgICAgc3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHQgICAgICAgICAgICAgIGlmKCFkYXRhLmVycm9yKXtcclxuXHRcdFx0ICAgICAgICAgICAgICAgd2luZG93Lm9wZW4odXRpbHMuZ2V0QmFzZVBhdGgoKSsnL3dlYi9TdG9yZS9maW5hbGl6YXInLCdfc2VsZicpO1xyXG5cdFx0XHQgICAgICAgICAgICAgIFxyXG5cdFx0XHQgICAgICAgICAgICAgIH1lbHNle1xyXG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI2Zvcm0tcGFnby1jYycpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGRhdGEubXNnKTsgXHJcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0X2NjJykudmFsKCdHdWFyZGFyJyk7XHJcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0X2NjJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdCAgICAgICAgICAgICAgfVxyXG5cdFx0XHQgICAgICAgICAgICB9LFxyXG5cdFx0XHQgICAgICAgICAgICBlcnJvcjpmdW5jdGlvbihqcVhIUix0ZXh0U3RhdHVzLGVycm9yVGhyb3duKXtcclxuXHRcdFx0ICAgICAgICAgICAgXHR1dGlscy5sb2coanFYSFIpO1xyXG5cdFx0XHQgICAgICAgICAgICBcdHV0aWxzLmxvZyh0ZXh0U3RhdHVzKTtcclxuXHRcdFx0ICAgICAgICAgICAgXHR1dGlscy5sb2coZXJyb3JUaHJvd24pO1xyXG5cdFx0XHQgICAgICAgICAgICAgICAkKCcjZm9ybS1wYWdvLWNjJykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoanFYSFIuc3RhdHVzKycgJyt0ZXh0U3RhdHVzKTtcclxuXHRcdFx0ICAgICAgICAgICAgICAgJCgnI3N1Ym1pdF9jYycpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIH0pXHJcblx0ICAgICAgICB9LFxyXG5cdCAgICAgICAgZXJyb3JMYWJlbENvbnRhaW5lcjogXCIjZXJyb3JfbWVzc2FnZV9ib3hcIixcclxuXHQgICAgICAgIHdyYXBwZXI6IFwibGlcIixcclxuXHQgICAgICAgIHJ1bGVzOlxyXG5cdCAgICAgICAgICAgICAgICB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBjcmVkaXRfY2FyZDogXCJyZXF1aXJlZFwiLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgXCJjYXJkLW51bWJlclwiOiBcInJlcXVpcmVkXCIsXHJcblx0ICAgICAgICAgICAgICAgICAgICBcImV4cGlyeS1tb250aFwiOiBcInJlcXVpcmVkXCIsXHJcblx0ICAgICAgICAgICAgICAgICAgICBcImV4cGlyeS15ZWFyXCI6IFwicmVxdWlyZWRcIixcclxuXHQgICAgICAgICAgICAgICAgICAgIFwiY3Z2XCIgOiBcInJlcXVpcmVkXCJcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICB9KTtcclxuXHR9LFxyXG5cdGhhbmRsZV9lbnRyZWdhX3N1Ym1pdCA6ZnVuY3Rpb24gKCl7XHJcblx0XHQgJCgnI2Zvcm0tZW50cmVnYScpLmZpbmQoJy5lcnJvcnMnKS5oaWRlKCk7XHJcblx0XHQgJCgnI2Zvcm0tZW50cmVnYScpLnZhbGlkYXRlKHtcclxuXHQgICAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uIChmb3JtKVxyXG5cdCAgICAgICAge1xyXG5cdCAgICAgICAgICAgICAgICAkLmFqYXgoe1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLCBcclxuXHQgICAgICAgICAgICAgICAgICAgIHVybDogICQoJyNmb3JtLWVudHJlZ2EnKS5hdHRyKCBcImFjdGlvblwiICksXHJcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhOiAgJCggJyNmb3JtLWVudHJlZ2EnICkuc2VyaWFsaXplKCksIFxyXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJywgXHJcblx0XHRcdCAgICAgICAgICAgIGJlZm9yZVNlbmQ6ZnVuY3Rpb24oKXtcclxuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnZhbCgnUHJvY2VzYW5kby4uLicpO1xyXG5cdFx0XHQgICAgICAgICAgICB9LFxyXG5cdFx0XHQgICAgICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XHJcblxyXG5cdFx0XHQgICAgICAgICAgICAgIGlmKCFkYXRhLmVycm9yKXtcclxuXHRcdFx0ICAgICAgICAgICAgICBcdG5ldyBQTm90aWZ5KHtcclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0RpcmVjY2nDs24gZGUgZmFjdHVyYWNpw7NuIGFjdHVhbGl6YWRhIScsXHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tZXNzYWdlLFxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJ1xyXG5cdFx0XHQgICAgICAgICAgICAgICAgfSk7XHJcblxyXG5cdFx0XHQgICAgICAgICAgICAgIH1lbHNle1xyXG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI2Zvcm0tZW50cmVnYScpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGRhdGEubWVzc2FnZSk7IFxyXG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnZhbCgnR3VhcmRhcicpO1xyXG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHQgICAgICAgICAgICAgIH1cclxuXHRcdFx0ICAgICAgICAgICAgfSxcclxuXHRcdFx0ICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24oanFYSFIsdGV4dFN0YXR1cyxlcnJvclRocm93bil7XHJcblx0XHRcdCAgICAgICAgICAgICAgICQoJyNmb3JtLWVudHJlZ2EnKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChqcVhIUi5zdGF0dXMrJyAnK3RleHRTdGF0dXMpO1xyXG5cdFx0XHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIH0pXHJcblx0ICAgICAgICB9LFxyXG5cdCAgICAgICAgZXJyb3JMYWJlbENvbnRhaW5lcjogXCIjZXJyb3JfbWVzc2FnZV9ib3hcIixcclxuXHQgICAgICAgIHdyYXBwZXI6IFwibGlcIixcclxuXHQgICAgICAgIHJ1bGVzOlxyXG5cdCAgICAgICAgICAgICAgICB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBmaXJzdF9uYW1lOiBcInJlcXVpcmVkXCIsXHJcblx0ICAgICAgICAgICAgICAgICAgICBsYXN0X25hbWU6IFwicmVxdWlyZWRcIixcclxuXHQgICAgICAgICAgICAgICAgICAgIGFkZHJlc3NfMTogXCJyZXF1aXJlZFwiLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgY2l1ZGFkOiBcInJlcXVpcmVkXCIsXHJcblx0ICAgICAgICAgICAgICAgICAgICBwYWlzOiBcInJlcXVpcmVkXCIsXHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgfSk7XHJcblx0fSxcclxuXHRoYW5kbGVfZW52aW9fc3VibWl0IDpmdW5jdGlvbiAoKXtcclxuXHRcdCAkKCcjZm9ybS1lbnZpbycpLmZpbmQoJy5lcnJvcnMnKS5oaWRlKCk7XHJcblx0XHQgJCgnI2Zvcm0tZW52aW8nKS52YWxpZGF0ZSh7XHJcblx0ICAgICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoZm9ybSlcclxuXHQgICAgICAgIHtcclxuXHQgICAgICAgICAgICAgICAgJC5hamF4KHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJywgXHJcblx0ICAgICAgICAgICAgICAgICAgICB1cmw6ICAkKCcjZm9ybS1lbnZpbycpLmF0dHIoIFwiYWN0aW9uXCIgKSxcclxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGE6ICAkKCAnI2Zvcm0tZW52aW8nICkuc2VyaWFsaXplKCksIFxyXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJywgXHJcblx0XHRcdCAgICAgICAgICAgIGJlZm9yZVNlbmQ6ZnVuY3Rpb24oKXtcclxuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnZhbCgnUHJvY2VzYW5kby4uLicpO1xyXG5cdFx0XHQgICAgICAgICAgICB9LFxyXG5cdFx0XHQgICAgICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XHJcblxyXG5cdFx0XHQgICAgICAgICAgICAgIGlmKCFkYXRhLmVycm9yKXtcclxuXHRcdFx0ICAgICAgICAgICAgICBcdG5ldyBQTm90aWZ5KHtcclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0RpcmVjY2nDs24gZGUgZW52w61vIGFjdHVhbGl6YWRhIScsXHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5tZXNzYWdlLFxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJ1xyXG5cdFx0XHQgICAgICAgICAgICAgICAgfSk7XHJcblx0XHRcdCAgICAgICAgICAgICAgICBcclxuXHRcdFx0ICAgICAgICAgICAgICB9ZWxzZXtcclxuXHRcdFx0ICAgICAgICAgICAgICAgICQoJyNmb3JtLWVudmlvJykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoZGF0YS5tZXNzYWdlKTsgXHJcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdHdWFyZGFyJyk7XHJcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdCAgICAgICAgICAgICAgfVxyXG5cdFx0XHQgICAgICAgICAgICB9LFxyXG5cdFx0XHQgICAgICAgICAgICBlcnJvcjpmdW5jdGlvbihqcVhIUix0ZXh0U3RhdHVzLGVycm9yVGhyb3duKXtcclxuXHRcdFx0ICAgICAgICAgICAgICAgJCgnI2Zvcm0tZW52aW8nKS5maW5kKCcuZXJyb3JzJykuZmFkZUluKCdzbG93JykuaHRtbChqcVhIUi5zdGF0dXMrJyAnK3RleHRTdGF0dXMpO1xyXG5cdFx0XHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIH0pXHJcblx0ICAgICAgICB9LFxyXG5cdCAgICAgICAgZXJyb3JMYWJlbENvbnRhaW5lcjogXCIjZXJyb3JfbWVzc2FnZV9ib3hcIixcclxuXHQgICAgICAgIHdyYXBwZXI6IFwibGlcIixcclxuXHQgICAgICAgIHJ1bGVzOlxyXG5cdCAgICAgICAgICAgICAgICB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBmaXJzdF9uYW1lOiBcInJlcXVpcmVkXCIsXHJcblx0ICAgICAgICAgICAgICAgICAgICBsYXN0X25hbWU6IFwicmVxdWlyZWRcIixcclxuXHQgICAgICAgICAgICAgICAgICAgIGFkZHJlc3NfMTogXCJyZXF1aXJlZFwiLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgY2l1ZGFkOiBcInJlcXVpcmVkXCIsXHJcblx0ICAgICAgICAgICAgICAgICAgICBwYWlzOiBcInJlcXVpcmVkXCIsXHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgfSk7XHJcblx0fSxcclxuXHRoYW5kbGVfcHJvZHVjdF9yZXZpZXdfc3VibWl0IDpmdW5jdGlvbiAoKXtcclxuXHRcdCAkKCcjZm9ybS1wcm9kdWN0cmV2aWV3JykuZmluZCgnLmVycm9ycycpLmhpZGUoKTtcclxuXHRcdCAkKCcjZm9ybS1wcm9kdWN0cmV2aWV3JykudmFsaWRhdGUoe1xyXG5cdCAgICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKGZvcm0pXHJcblx0ICAgICAgICB7XHJcblx0ICAgICAgICAgICAgICAgICQuYWpheCh7XHJcblx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsIFxyXG5cdCAgICAgICAgICAgICAgICAgICAgdXJsOiAgJCgnI2Zvcm0tcHJvZHVjdHJldmlldycpLmF0dHIoIFwiYWN0aW9uXCIgKSxcclxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGE6ICAkKCAnI2Zvcm0tcHJvZHVjdHJldmlldycgKS5zZXJpYWxpemUoKSwgXHJcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLCBcclxuXHRcdFx0ICAgICAgICAgICAgYmVmb3JlU2VuZDpmdW5jdGlvbigpe1xyXG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuXHRcdFx0ICAgICAgICAgICAgICAkKCcjc3VibWl0JykudmFsKCdQcm9jZXNhbmRvLi4uJyk7XHJcblx0XHRcdCAgICAgICAgICAgIH0sXHJcblx0XHRcdCAgICAgICAgICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0ICAgICAgICAgICAgICBpZighZGF0YS5lcnJvcil7XHJcblx0XHRcdCAgICAgICAgICAgICAgXHQkY29udGVuZWRvciA9ICQoJyNwcm9kdWN0cmV2aWV3cycpO1xyXG5cdFx0XHRcdFx0XHRcdCQucG9zdCh1dGlscy5nZXRCYXNlUGF0aCgpKycvd2ViL21hcmtldC9nZXRfcmV2aWV3Jyx7J0lEJzpkYXRhLklEfSxmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0JGNvbnRlbmVkb3IucHJlcGVuZChkYXRhKTtcclxuXHRcdFx0XHRcdFx0XHR9LCd0ZXh0Jyk7XHJcblx0XHRcdFx0XHRcdFx0JCgnI2Zvcm0tcHJvZHVjdHJldmlldycpLnRyaWdnZXIoJ3Jlc2V0Jyk7XHJcblx0XHRcdCAgICAgICAgICAgICAgfWVsc2V7XHJcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjZm9ybS1wcm9kdWN0cmV2aWV3JykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoZGF0YS5tc2cpOyBcclxuXHRcdFx0ICAgICAgICAgICAgICB9XHJcblx0XHRcdCAgICAgICAgICAgIH0sXHJcblx0XHRcdCAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKGpxWEhSLHRleHRTdGF0dXMsZXJyb3JUaHJvd24pe1xyXG5cdFx0XHQgICAgICAgICAgICAgICAkKCcjZm9ybS1wcm9kdWN0cmV2aWV3JykuZmluZCgnLmVycm9ycycpLmZhZGVJbignc2xvdycpLmh0bWwoanFYSFIuc3RhdHVzKycgJyt0ZXh0U3RhdHVzKTtcclxuXHRcdFx0ICAgICAgICAgICAgfSxcclxuXHRcdFx0ICAgICAgICAgICAgY29tcGxldGU6ZnVuY3Rpb24oKXtcclxuXHRcdFx0ICAgICAgICAgICAgXHQkKCcjc3VibWl0JykudmFsKCdHdWFyZGFyJyk7XHJcblx0XHRcdCAgICAgICAgICAgICAgICAkKCcjc3VibWl0JykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblx0XHRcdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgfSlcclxuXHQgICAgICAgIH0sXHJcblx0ICAgICAgICBlcnJvckxhYmVsQ29udGFpbmVyOiBcIiNlcnJvcl9tZXNzYWdlX2JveFwiLFxyXG5cdCAgICAgICAgd3JhcHBlcjogXCJsaVwiLFxyXG5cdCAgICAgICAgcnVsZXM6XHJcblx0ICAgICAgICAgICAgICAgIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIG5vbWJyZTogXCJyZXF1aXJlZFwiLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgZW1haWw6IFwicmVxdWlyZWRcIixcclxuXHQgICAgICAgICAgICAgICAgICAgIGRldGFsbGU6IFwicmVxdWlyZWRcIixcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICB9KTtcclxuXHR9LFxyXG5cdGhhbmRsZV9ibG9nX3Jldmlld19zdWJtaXQgOmZ1bmN0aW9uICgpe1xyXG5cdFx0ICQoJyNmb3JtLWJsb2dyZXZpZXcnKS5maW5kKCcuZXJyb3JzJykuaGlkZSgpO1xyXG5cdFx0ICQoJyNmb3JtLWJsb2dyZXZpZXcnKS52YWxpZGF0ZSh7XHJcblx0ICAgICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoZm9ybSlcclxuXHQgICAgICAgIHtcclxuXHQgICAgICAgICAgICAgICAgJC5hamF4KHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJywgXHJcblx0ICAgICAgICAgICAgICAgICAgICB1cmw6ICAkKCcjZm9ybS1ibG9ncmV2aWV3JykuYXR0ciggXCJhY3Rpb25cIiApLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YTogICQoICcjZm9ybS1ibG9ncmV2aWV3JyApLnNlcmlhbGl6ZSgpLCBcclxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsIFxyXG5cdFx0XHQgICAgICAgICAgICBiZWZvcmVTZW5kOmZ1bmN0aW9uKCl7XHJcblx0XHRcdCAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHQgICAgICAgICAgICAgICQoJyNzdWJtaXQnKS52YWwoJ1Byb2Nlc2FuZG8uLi4nKTtcclxuXHRcdFx0ICAgICAgICAgICAgfSxcclxuXHRcdFx0ICAgICAgICAgICAgc3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHQgICAgICAgICAgICAgIGlmKCFkYXRhLmVycm9yKXtcclxuXHRcdFx0ICAgICAgICAgICAgICBcdCRjb250ZW5lZG9yID0gJCgnI2Jsb2dyZXZpZXdzJyk7XHJcblx0XHRcdFx0XHRcdFx0JC5wb3N0KHV0aWxzLmdldEJhc2VQYXRoKCkrJy93ZWIvbWFya2V0L2dldF9ibG9nX3JldmlldycseydJRCc6ZGF0YS5JRH0sZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdCRjb250ZW5lZG9yLnByZXBlbmQoZGF0YSk7XHJcblx0XHRcdFx0XHRcdFx0fSwndGV4dCcpO1xyXG5cdFx0XHRcdFx0XHRcdCQoJyNmb3JtLWJsb2dyZXZpZXcnKS50cmlnZ2VyKCdyZXNldCcpO1xyXG5cdFx0XHQgICAgICAgICAgICAgIH1lbHNle1xyXG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI2Zvcm0tYmxvZ3JldmlldycpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGRhdGEubXNnKTsgXHJcblx0XHRcdCAgICAgICAgICAgICAgfVxyXG5cdFx0XHQgICAgICAgICAgICB9LFxyXG5cdFx0XHQgICAgICAgICAgICBlcnJvcjpmdW5jdGlvbihqcVhIUix0ZXh0U3RhdHVzLGVycm9yVGhyb3duKXtcclxuXHRcdFx0ICAgICAgICAgICAgICAgJCgnI2Zvcm0tYmxvZ3JldmlldycpLmZpbmQoJy5lcnJvcnMnKS5mYWRlSW4oJ3Nsb3cnKS5odG1sKGpxWEhSLnN0YXR1cysnICcrdGV4dFN0YXR1cyk7XHJcblx0XHRcdCAgICAgICAgICAgIH0sXHJcblx0XHRcdCAgICAgICAgICAgIGNvbXBsZXRlOmZ1bmN0aW9uKCl7XHJcblx0XHRcdCAgICAgICAgICAgIFx0JCgnI3N1Ym1pdCcpLnZhbCgnR3VhcmRhcicpO1xyXG5cdFx0XHQgICAgICAgICAgICAgICAgJCgnI3N1Ym1pdCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cdFx0XHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIH0pXHJcblx0ICAgICAgICB9LFxyXG5cdCAgICAgICAgZXJyb3JMYWJlbENvbnRhaW5lcjogXCIjZXJyb3JfbWVzc2FnZV9ib3hcIixcclxuXHQgICAgICAgIHdyYXBwZXI6IFwibGlcIixcclxuXHQgICAgICAgIHJ1bGVzOlxyXG5cdCAgICAgICAgICAgICAgICB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBub21icmU6IFwicmVxdWlyZWRcIixcclxuXHQgICAgICAgICAgICAgICAgICAgIGVtYWlsOiBcInJlcXVpcmVkXCIsXHJcblx0ICAgICAgICAgICAgICAgICAgICBkZXRhbGxlOiBcInJlcXVpcmVkXCIsXHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgfSk7XHJcblx0fSxcclxufSIsInZhciBlc3RhX2NhcmdhbmRvPWZhbHNlO1xyXG5tb2R1bGUuZXhwb3J0cz17XHJcblx0bG9nOiBmdW5jdGlvbihzdHJpbmcpe1xyXG5cdFx0aWYoY29uc29sZSkgY29uc29sZS5sb2coc3RyaW5nKTtcclxuXHR9LFxyXG5cdC8vT2J0aWVuZSB1biBhcnJheSBjb24gdG9kb3MgbG9zIHNlZ21ldG9zIGRlIGxhIFVSTFxyXG5cdGdldEJhc2VQYXRoIDogZnVuY3Rpb24oKXtcclxuXHRcdHZhciBwb3J0ID0gd2luZG93LmxvY2F0aW9uLnBvcnQ7XHJcblx0XHR2YXIgcGF0aEFycmF5ID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCcvJyk7XHJcblx0XHR2YXIgYXBwbGljYWNpb24gPSAod2luZG93LmxvY2F0aW9uLmhvc3QgPT09IFwiMTI3LjAuMC4xXCIgfHwgd2luZG93LmxvY2F0aW9uLmhvc3QgPT09IFwibG9jYWxob3N0XCIgfHwgd2luZG93LmxvY2F0aW9uLmhvc3QuaW5kZXhPZignMTkyLjE2OC4nKSAhPT0gLTEpID8gcGF0aEFycmF5WzFdIDogJyc7XHJcblx0XHRpZihwb3J0PT09XCIzMDAwXCIpe1xyXG5cdFx0XHRhcHBsaWNhY2lvbiA9IGFwcGxpY2FjaW9uKydwb3MvJztcclxuXHRcdH1cclxuXHRcdGlmICghd2luZG93LmxvY2F0aW9uLm9yaWdpbilcclxuXHRcdFx0cmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIHdpbmRvdy5sb2NhdGlvbi5ob3N0ICsgXCIvXCIgKyBhcHBsaWNhY2lvbjtcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIGFwcGxpY2FjaW9uO1xyXG5cdH0sXHJcblx0ZXN0YUNhcmdhbmRvOmZ1bmN0aW9uKCl7XHJcblx0XHRyZXR1cm4gZXN0YV9jYXJnYW5kbztcclxuXHR9LFxyXG5cdHNldEVzdGFDYXJnYW5kbzpmdW5jdGlvbih2YWxvcil7XHJcblx0XHRlc3RhX2NhcmdhbmRvPXZhbG9yO1xyXG5cdH0sXHJcblx0aW5pdEFqYXhUYWJzOmZ1bmN0aW9uKCl7XHJcblx0XHQkKCdbZGF0YS10b2dnbGU9XCJ0YWJhamF4XCJdJykuY2xpY2soZnVuY3Rpb24oZSkge1xyXG5cdFx0ICAgIHZhciAkdGhpcyA9ICQodGhpcyksXHJcblx0XHQgICAgICAgIGxvYWR1cmwgPSAkdGhpcy5hdHRyKCdocmVmJyksXHJcblx0XHQgICAgICAgIHRhcmcgPSAkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpO1xyXG5cclxuXHRcdCAgICAkLmdldChsb2FkdXJsLCBmdW5jdGlvbihkYXRhKSB7XHJcblx0XHQgICAgICAgICQodGFyZykuaHRtbChkYXRhKTtcclxuXHRcdCAgICB9KTtcclxuXHJcblx0XHQgICAgJHRoaXMudGFiKCdzaG93Jyk7XHJcblx0XHQgICAgcmV0dXJuIGZhbHNlO1xyXG5cdFx0fSk7XHJcblx0XHQkKCdbZGF0YS10b2dnbGU9XCJ0YWJhamF4XCJdOmZpcnN0JykuY2xpY2soKTtcclxuXHR9XHJcbn0iXX0=
