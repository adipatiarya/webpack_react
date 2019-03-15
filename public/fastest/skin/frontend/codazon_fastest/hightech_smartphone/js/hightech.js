( function($) {
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
	$.fn.scrollBar = function(options){
		var defaultConfig = {
			colMain: '.col-main',
			header: '.header-container',
			stickyMenu: '.sticky-menu'
		};
		var conf = $.extend({},defaultConfig,options);
		var $win = $(window),
		$colMain = $(conf.colMain).first(), $header = $(conf.header).first(), $stickyMenu = $(conf.stickyMenu).first();
		return this.each(function(){
			var $this = $(this);
			function getLeft(){
				var winW = $win.width(), colWith = $colMain.width(), left = (winW - colWith)/2 + colWith + 10;
				return left;
			}
			function getTop(){
				if($stickyMenu.hasClass('active')){
					var top = '';	
				}else{
					var top = $header.outerHeight() + 10;
				}
				return top;
			}
			function assignPosition(){
				$this.css({left:getLeft(), top: getTop()});
			}
			assignPosition()
			$win.scroll(assignPosition);
			var timeout = false;
			$win.resize(function(){
				if(timeout) clearTimeout(timeout);
				timeout = setTimeout(assignPosition,300);
			});
		});
	}
    $.cdzWidget('minicountdown', {
        options: {
            nowDate: Codazon.nowDate,
            startDate: false,
            stopDate: false,
            dayLabel: 'Day(s)',
            hourLabel: 'Hour(s)',
            minLabel: 'Minute(s)',
            secLabel: 'Second(s)',
            delay: 1000
        },
        _create: function() {
            var self = this, conf = this.options;
            if (conf.stopDate) {
                var now = new Date().getTime();
                if (conf.startDate) {
                    self.startDate = new Date(conf.startDate).getTime();
                    if (self.startDate > now) {
                        return true;
                    }
                }
                if (conf.nowDate) {
                    self.delta = (new Date().getTime()) - (new Date(conf.nowDate).getTime());
                } else {
                    self.delta = 0;
                }
                
                self.stopDate = new Date(conf.stopDate).getTime();
                if (self.stopDate > now) {
                    self.$wrapper = $('<div class="deal-items">').appendTo(self.element).hide();
                    self.$days = $('<div class="deal-item days"><span class="value"></span> <span class="label">' + conf.dayLabel + '</span></div>').appendTo(self.$wrapper).find('.value');
                    self.$hours = $('<div class="deal-item hours"><span class="value"></span> <span class="label">' + conf.hourLabel + '</span></div>').appendTo(self.$wrapper).find('.value');
                    self.$mins = $('<div class="deal-item mins"><span class="value"></span> <span class="label">' + conf.minLabel + '</span></div>').appendTo(self.$wrapper).find('.value');
                    self.$secs = $('<div class="deal-item secs"><span class="value"></span> <span class="label">' + conf.secLabel + '</span></div>').appendTo(self.$wrapper).find('.value');
                    self.interval = setInterval(function() {
                        self._countDown();
                    }, conf.delay);
                    self.$wrapper.fadeIn(300, 'linear', function() { self.$wrapper.css({display: ''}); });
                    if (self.element.parents('.codazon-filter').length) {
                        self.element.parents('.codazon-filter').first().trigger('layoutUpdated');
                    }
                }
            }
        },
        _countDown: function() {
            var self = this, conf = this.options;
            var now = new Date().getTime() - self.delta, distance = self.stopDate - now;
            var days = Math.floor(distance / (1000 * 60 * 60 * 24)), hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)), secs = Math.floor((distance % (1000 * 60)) / 1000);
            self.$days.text(days); self.$hours.text(hours); self.$mins.text(mins); self.$secs.text(secs);
            if (distance < 0) {
                self.$wrapper.hide();
                clearInterval(self.interval);
            }
        }
    });
    
    $.cdzWidget('mobiledropdown', {
        options: {
            adapt: 768,
            item: '.item',
            text: 'Dropdown'
        },
        _create: function() {                        
            this._initContent();
        },
        _initContent: function() {
            var self = this,
                config = this.options,
                adapt = config.adapt;
            self.winwidth = window.innerWidth;
            self.element.addClass('abs-dropdown');
            this.$toggle = $('<a href="javascript:void(0)">').addClass('mobile-toggle visible-xs').text($(config.item, self.element).first().text());
            this.$toggle.insertBefore(self.element);

            function prepare() {
                winwidth = window.innerWidth;
                if (winwidth < adapt) {
                    self.element.removeClass('hidden-xs').hide();
                } else {
                    self.element.addClass('hidden-xs').css('display', '');
                }
            }
            this.$toggle.click(function() {
                self.element.slideToggle(100, 'linear', function() {
                    self.$toggle.toggleClass('open');
                });
            });
            $('body').on('click', function(e) {
                if (self.winwidth < config.adapt) {
                    var $target = $(e.target);
                    var cond1 = $target.is(self.element),
                        cond2 = ($target.parents('.abs-dropdown').length > 0),
                        cond3 = $target.is(self.$toggle);
                    if (!(cond1 | cond2 | cond3)) {
                        self.element.slideUp(100, 'linear', function() {
                            self.$toggle.removeClass('open');
                        });
                    }
                }
            });
            $(config.item, self.element).click(function() {
                var $item = $(this);
                if ($item.data('isnotabitem')) {
                    return true;
                }
                if (self.winwidth < config.adapt) {
                    self.element.slideUp(100, 'linear', function() {
                        self.$toggle.removeClass('open');
                    });
                }
                var $cloneItem = $item.clone();
                $cloneItem.find('[data-needhidden]').remove();
                self.$toggle.text($cloneItem.text());
                $cloneItem.remove();
            });
            $(window).resize(function() {
                var newwidth = window.innerWidth;
                if ((self.winwidth < adapt && newwidth >= adapt) || (self.winwidth >= adapt && newwidth < adapt)) {
                    prepare();
                }
                self.winwidth = newwidth;
            });
            prepare();
        }
    });
    
	$(document).ready(function(e) {
		$('.float-bar').scrollBar();
    });
    $(document).ready(function(){
		function createWidget($context){
			$('[data-cdzwidget]', $context).each(function(){
				var $element = $(this),
				widget = $element.data('cdzwidget');
				for(var name in widget){
					var options = widget[name];
					if(typeof $.fn[name] === 'function'){
						$element[name](options);
					}
				}
                $element.removeAttr('data-cdzwidget');
			});
		}
		
        createWidget($('body'));
        
		$('body').on('contentUpdated',function(){
			var $context = $(this);
			createWidget($context);
		});
	});
} )(jQuery);