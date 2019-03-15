(function($){
	$.cdzWidget = function(name,widgetHandler){
		$.fn[name] = function(options){
			return this.each(function(){
				var $element = $(this);
				var handler = $.extend({},widgetHandler);
				handler.init = function(){
					handler.element = $element;
					if(typeof handler.options == 'undefined'){
						handler.options = {};
					}
					handler.options = $.extend({},handler.options,options);
					if(typeof handler._create === 'function'){
						handler._create();	
					}
				}
				handler.init();
			});	
		}
	}
	$.cdzWidget('mobileslider',{
		options: {
			defaultSliderConfig: {
				loop: true,
				margin: 20,
				responsiveClass: true,
				nav: true,
				dots: false
			},
			adapt: 768
		},
		_create: function(){
			var self = this, config = self.options;
			config.sliderConfig = $.extend({},config.defaultSliderConfig,config.sliderConfig);
			var $win = $(window);
			self.winWidth = $win.prop('innerWidth');
			if(self.winWidth < config.adapt){
				self.mode = 'mobile';
				self._forMobile();
			}else{
				self.mode = 'desktop';
			}
			self.timeout = false;
			$win.on('resize',function(){
				if(self.timeout) clearTimeout(self.timeout);
				self.timeout = setTimeout(function(){
					var winWidth = $win.prop('innerWidth');
					if(winWidth != self.winWidth){
						if( (self.winWidth < config.adapt) && (winWidth >= config.adapt) ){
							self.mode = 'desktop';
							self._forDesktop();
						}else if( (self.winWidth >= config.adapt) && (winWidth < config.adapt) ){
							self.mode = 'mobile';
							self._forMobile();
						}
						self.winWidth = winWidth;
					}
				},200);
			});
		},
		_forMobile: function(){
			var self = this, config = self.options;
			self.element.addClass('owl-carousel');
			self.element.owlCarousel(config.sliderConfig);
		},
		_forDesktop: function(){
			var self = this, config = self.options;
			if(self.element.hasClass('owl-carousel')){
				self.element.data('owl.carousel').destroy();
				self.element.removeClass('owl-carousel owl-loaded');
				self.element.find('.owl-stage-outer').children().unwrap();
				self.element.removeData();
			}
		}
	});
	$.fn.checkVisibleOnScreen = function(){
		var $element = $(this);
		var $win = $(window);
		var winTop = $win.scrollTop();
		var winHeight = $win.height();
		var winBottom = winTop + winHeight;
		var elTop = $element.offset().top;
		var elHeight = $element.height();
		var eBottom = elTop + elHeight;
		
		var cond1 = (elTop >= winTop) && (elTop <= winBottom );
		var cond2 = (eBottom >= winTop) && (eBottom <= winBottom);
		var cond3 = (elTop <= winTop) && (eBottom >= winBottom);
				
		return ( cond1 || cond2 || cond3 ) && $element.is(':visible');
	}
	$.cdzWidget('appearingEffect',{
		options: {
			hideClass: 'cdz-transparent',
			effectClass: 'cdz-translator'
		},
		_create: function(){
			var self = this, config = self.options, $element = self.element, $win = $(window);
			function makeEffect(){
				$('.'+config.hideClass,$element).each(function(i,el){
					var delay = (i + 1)*300;
					var $_pItem = $(this);
					setTimeout(function(){
						$_pItem.removeClass(config.hideClass);
						$_pItem.addClass(config.effectClass);
					},delay);
					setTimeout(function(){
						$_pItem.removeClass(config.effectClass);
					},delay + 1500);
				});
			}
			var uniqueId = 'effect_'+Math.round(Math.random()*1000)+Math.round(Math.random()*1000);
			var eventScroll = 'scroll.'+uniqueId;
			var eventClick = 'click.'+uniqueId;
			var eventLoad = 'load.'+uniqueId;
			function bindEffect(){
				$win.off(eventScroll);
				if($element.checkVisibleOnScreen()){
						makeEffect();
				}else{
					$win.on(eventScroll,function(){
						if($element.checkVisibleOnScreen()){
							makeEffect();
							$win.off(eventScroll);
						}
					});
				}
				if($element.parents('.tab-pane').length){
					var $parent = $element.parents('.tab-pane').first();
					var tabId = $parent.attr('id');
					var $tabCont = $parent.parents('.tabs').first();
					if($tabCont.length){
						var $tabLink = $('a[href="#'+tabId+'"]',$tabCont).first();
						$tabLink.on(eventClick,function(){
							setTimeout(function(){
								makeEffect();
								$win.off(eventScroll);
								$tabLink.off(eventClick);
							},100);
						});
					}
				}
			}
			bindEffect();
			$win.on(eventLoad,function(){
				bindEffect();
				if(!$element.checkVisibleOnScreen()){
					setTimeout(bindEffect,500);
				}
			});
			if($element.find('img').length){
				var $img = $element.find('img').last();
				var img = new Image();
				img.src = $img.attr('src');
				$(img).on(eventLoad,function(){
					bindEffect();
					if($element.checkVisibleOnScreen()){
						$win.off(eventLoad);
					}
				});
			}
			$element.on('contentUpdated',makeEffect);
		}
	});
	$(document).ready(function(){
		function createWidget($context){
			$('[data-cdzwidget]',$context).each(function(){
				var $element = $(this),
				widget = $element.data('cdzwidget');
				for(var name in widget){
					var options = widget[name];
					if(typeof $.fn[name] === 'function'){
						$element[name](options);
						$element.on('contentUpdated',function(){
							createWidget($element);
						});
					}
				}
			});
		}
		createWidget($('body'));
		$('*').on('contentUpdated',function(){
			var $context = $(this);
			createWidget($context);
		});
	});
})(jQuery);