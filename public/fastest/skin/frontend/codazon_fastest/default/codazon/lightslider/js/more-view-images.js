(function($){
$.fn.moreviewSlider = function(options){
	return this.each(function(){
		var $element = $(this);
		var moreviewSlider = {
			media: '',
			options: {
				thumbs: '.viewmore-thumbs',
				mains: '.viewmore-main',
				thumbLink: '.thumb-link',
				mainLink: '.main-link',
				defaultType: 'vertical'
			},
			init: function(){
				this.element = $element;
				this.options = $.extend({},this.options,options);
				this._create();
			},
			_create: function(){
				var self = this, config = this.options;
				this.window = $(window);
				this.media = this._getMedia();
				
				this.$mains = $(config.mains,self.element);
				this.$thumbs = $(config.thumbs,self.element);
				this.$mainLink = $(config.mainLink,self.$mains);
				this.$thumbLink = $(config.thumbLink,self.$thumbs);
				this._initSlider();
				this._attachEvent();
				this._updateSwatch();
			},
			_attachEvent: function(){
				var self = this, config = this.options;
				this.$thumbLink.each(function(i,el){
					var $tLink = $(this);
					
					$tLink.on('click',function(e){
						e.preventDefault();
						self.$thumbLink.removeClass('select');
						$tLink.addClass('select');
						self.owl.to(i,self.owl.options.smartSpeed,true);
						
						if(typeof $tLink.data('mainSrc') !== 'undefined'){
							var $mLink = $(self.$mainLink[i]);
							var mainSrc = $tLink.data('mainSrc');
							$mLink.find('img').attr('src',mainSrc);
						}
					});
				});
				this.$mainLink.each(function(i,el){
					var $mLink = $(this);
					$mLink.on('click',function(e){
						e.preventDefault();
					});
					self._zoom($mLink.parent());
				});
			},
			_getMedia: function(){
				if(this.window.prop('innerWidth') < 768){
					return 'mobile';
				}else{
					return 'desktop';
				}
			},
			_initSlider: function(){
				var self = this, config = this.options, vertical;
				self.$firstMain = self.$mains.find('.main-link img').first();
				var img = new Image();
				img.src = self.$firstMain.attr('src');
				
				$(img).load(function(){
					self.$mains.addClass('owl-carousel owl-theme');
					self.$mains.owlCarousel({
						items: 1,
						nav: true,
						dots: false,
						margin: 0
					});
					self.height = self.$mains.height();
					self.$firstThumb = self.$thumbs.find('.thumb-link img').first();
					self.owl = self.$mains.data('owl.carousel');
					img = new Image();
					img.src = self.$firstThumb.attr('src');
										
					self.offset = 0;
					self.curIndex = 0;
					self.activeOffset = 0;
					$(img).load(function(){
						self.$thumbs.lightSlider(self._getSliderSettings(config));
						self.$thumbLink.each(function(i,el){
							var $tLink = $(this);
							$tLink.data('index',i);
							$tLink.data('mainSrc',$(self.$mainLink[i]).find('img').attr('src'));
						});
						self.$mainLink.each(function(i,el){
							var $mainLink = $(this);
							$mainLink.data('index',i);
							if($mainLink.hasClass('product-image')){
								self.owl.to(i,1,true);
								$(self.$thumbLink.get(i)).addClass('select');
							}
						});
						var slTimeout = false;
						self.$mains.on('refreshed.owl.carousel',function(){
							if(slTimeout){
								clearTimeout(slTimeout);
							}
							slTimeout = setTimeout(function(){
								var curMedia = self._getMedia();
								if( (curMedia != self.media) && (config.defaultType == 'vertical')){
									self.$thumbs.destroy();
									self.$thumbs.removeClass('lSSlide');
									self.media = curMedia;
									self.$thumbs.lightSlider = $.fn.lightSlider;
									self.$thumbs.lightSlider(self._getSliderSettings(config));
								}else{
									self.$thumbs.setConfig(self._getSliderSettings());	
									self.$thumbs.refresh();
								}
							},300);
						});
						self.$mains.on('changed.owl.carousel',function(e){
							var index = e.item.index;
							var $tLink = $(self.$thumbLink[index]), $mLink = $(self.$mainLink[index]);
							self.$thumbLink.removeClass('select');
							$tLink.addClass('select');
							if(typeof $tLink.data('mainSrc') !== 'undefined'){
								var mainSrc = $tLink.data('mainSrc');
								$mLink.find('img').attr('src',mainSrc);
								var $parent = $mLink.parent();
								$parent.find('.magnify').css('background',mainSrc);
								self._zoom($parent);
								self.$mainLink.removeClass('product-image');
								$mLink.addClass('product-image');
							}
							var offset = Math.floor(index/config.item);
							if(self.offset != offset){
								self.$thumbs.goToSlide(offset*config.item);
								self.offset = offset;
							}
							self.curIndex = index;
						});
						self.$mains.find('.owl-stage').lightGallery({
							selectWithin: '.image-item',
							selector: '.main-link'
						});
						$('.rsUni',self.$mains).click(function(){
							$(this).parents('.image-item').first().find('.main-link').first().click();
						});
					});
				});
			},
			_getSliderSettings: function(){
				var self = this, config = this.options;
				if(config.defaultType == 'vertical'){
					config.vertical = (self.media == 'desktop');	
				}else{
					config.vertical = false;
				}
				
				var imgHeight = self.$firstThumb.height();
				var imgWidth = self.$firstThumb.width();
				self.height = self.$mains.height();
				self.width = self.$mains.width();
				if(config.vertical){
					config.item = Math.floor(self.height/imgHeight);
					config.slideMargin = Math.max(0,(self.height - imgHeight*config.item)/config.item);
				}else{
					imgWidth = Math.max(85,imgWidth);
					config.item = Math.floor(self.width/imgWidth);
					config.slideMargin = Math.max(0,(self.width - imgWidth*config.item)/config.item);
				}
				return {
					item: config.item,
					vertical: config.vertical,
					verticalHeight: self.height,
					pager: false,
					slideMargin: config.slideMargin,
					onAfterSlide: function($el){}
				}
			},
			_zoom: function($parent){
				$parent.off('mousemove.cdzZoom');
				$parent.off('mouseleave.cdzZoom');
				$parent.data('cdzZoom','');
				$parent.cdzZoom({
					mainImg: '.main-link > img',
					magnify: '.magnify'	
				});
					
			},
			_updateSwatch: function(){
				var self = this;
				self.window.on('swatchUpdateImage',function(e,swatchImageUrl){
					var $mLink = $(self.$mainLink.get(self.curIndex))
					$mLink.find('img').attr('src',swatchImageUrl);
					var background = 'url('+swatchImageUrl+')';
					var $parent = $mLink.parent();
					$parent.find('.magnify').css('background',background);
					self._zoom($parent);
				});
			}
		}
		moreviewSlider.init();
	});
}
})(jQuery);