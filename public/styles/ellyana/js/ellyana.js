/*! Codazon Js Framework - v1.0.0 - 2017-05-05
 * https://ecommerce.codazon.com
 * Theme framework javascript for Codazon Theme.
 * Copyright 2017 CodazonGroup. */
(function($) {
    /* -- jquery cdz widget -- */
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
    $.fn.verticalThumbsSlider = function (options) {
        return this.each(function () {
            var $element = $(this);
            var horizonSlider = {
                options: {
                    parent: '.cdz-product-top',
                    mainImg: '.product-image img',
                    item: 4,
                    slideMargin: 8,
                    adapt: 768,
                    smallImgType: 'small_default',
                    largeImgType: 'home_default'
                },
                _isElVisible: function (el) {
                    var pr = $(el).parent().get(0);
                    return pr.offsetWidth > 0 && pr.offsetHeight > 0;
                },
                _init: function () {
                    var self = this;
                    this.element = $element;
                    this.options = $.extend({},this.options,options);
                    var visibleInterval = false;
                    setTimeout(function () {
                        function checkVisible()
                        {
                            if (self._isElVisible(self.element.get(0))) {
                                window.clearInterval(visibleInterval);
                                setTimeout(function () {
                                    self._create();
                                },300);
                            }
                        }
                        if (self._isElVisible(self.element.get(0))) {
                            self._create();
                        } else {
                            visibleInterval = window.setInterval(checkVisible, 500);
                        }
                    },500);
                },
                _create: function () {
                    var self = this, config = self.options;
                    if (config.images.length == 0) {
                        return true;
                    }
                    self.$parent = this.element.parents(config.parent).first();
                    self.$mainImg = self.$parent.find(config.mainImg).first();
                    
                    var img = new Image();
                    img.src = self.$mainImg.attr('src');
                    $(img).load(function () {
                        self.element.css({display:'block', opacity:0, position:'absolute'});
                        self.height = parseInt(self.element.css('height')) - parseInt(self.element.css('padding-top')) - parseInt(self.element.css('padding-bottom'));                        
                        self.width = config.width;
                        self._createSlider(config);
                        setTimeout(function () {
                            self.element.css({display:'',opacity:'', position:''});
                        },500);
                        function refresh()
                        {
                            var visibleInterval = false;
                            function calcSliderSize()
                            {
                                self.element.css({display:'block', opacity:0, position:'absolute'});
                                self.height = self.$parent.height() - parseInt(self.element.css('padding-top')) - parseInt(self.element.css('padding-bottom'));
                                var imgHeight = self.$firstImg.height();
                                config.item = Math.floor(self.height/imgHeight);
                                config.item = Math.ceil(config.item - (config.item*config.slideMargin/imgHeight));
                                self.slider.setConfig({'verticalHeight': self.height, item: config.item});
                                self.slider.refresh();
                                setTimeout(function () {
                                    self.element.css({display:'', opacity:'', position:''});
                                },200);
                            }
                            function checkVisible()
                            {
                                if (self._isElVisible(self.element.get(0))) {
                                    setTimeout(function () {
                                        window.clearInterval(visibleInterval);
                                        calcSliderSize();
                                    },300);
                                }
                            }
                            if (self._isElVisible(self.element.get(0))) {
                                calcSliderSize();
                            } else {
                                visibleInterval = window.setInterval(checkVisible, 500);
                            }
                        }
                        $(window).on('grid_mode list_mode toggleLeftColumnCompleted',function () {
                            setTimeout(function () {
                                refresh();
                            },400);
                        });
                        if (self.element.parents('[data-sameheight]').length) {
                            var $_sameHeight = self.element.parents('[data-sameheight]').first();
                            $_sameHeight.on('sameheight_completed',function () {
                                setTimeout(function () {
                                    refresh();
                                },300);
                            });
                        }
                        var $win = $(window);
                        var curWinWidth = $win.prop('innerWidth');
                        $win.on('resize',function () {
                            var newWinWidth = $win.prop('innerWidth');
                            if ( (newWinWidth >= config.adapt) && (newWinWidth != curWinWidth) ) {
                                setTimeout(function () {
                                    refresh();
                                },400);
                            }
                            curWinWidth = newWinWidth;
                        });
                    });
                },
                _createSlider: function () {
                    var self = this, config = this.options;
                    var $loader = $('<span class="vImgLoader"><span>Loading</span></span>');
                    var $imgParent = self.$mainImg.parent();
                    $loader.css({position: 'absolute',
                        width: '100%', height: '100%', backgroundColor: '',
                        zIndex: 10000, top: 0, left:0, textAlign: 'center', paddingTop: '50%',
                        display: 'none'
                    });
                    $loader.appendTo($imgParent);
                    
                    var html = '<ul class="img-slider">';
                    $(config.images).each(function (i,img) {
                        var src = img.resize;
                        var largeSrc = img.main;
                        html += '<li class="item"><a href="'+largeSrc+'"><img class="img-responsive" src="'+src+'" /></a></li>'
                    });
                    html += '</ul>';
                    self.slider = $(html);
                    self.slider.appendTo(self.element);
                    self.$firstImg = self.slider.find('img').first();
                    var firstImg = new Image();
                    firstImg.src = config.images[0]['resize'];
                    
                    $(firstImg).load(function () {
                        self.$mainImg.data('processing',false);
                        self.slider.find('a').each(function () {
                            var $a = $(this), loaded = false;
                            $a.click(function (e) {
                                e.preventDefault();
                            });
                            $a.hover(function (e) {
                                e.preventDefault();
                                if (!self.$mainImg.data('processing')) {
                                    self.$mainImg.data('processing',true);
                                    var src = $(this).attr('href');
                                    self.slider.find('a').parent().removeClass('img-active');
                                    $a.parent().addClass('img-active');
                                    if (!loaded) {
                                        var mainImage = new Image();
                                        mainImage.src = src;
                                        $loader.show();
                                        $(mainImage).load(function () {
                                            $loader.hide();
                                            loaded = true;
                                            self.$mainImg.attr('src',src);
                                            self.$mainImg.data('processing',false);
                                        });
                                    } else {
                                        self.$mainImg.attr('src',src);
                                        self.$mainImg.data('processing',false);
                                    }
                                }
                            }, function (){});
                        });
                        var imgHeight = self.$firstImg.height();
                        
                        config.item = Math.floor(self.height/imgHeight);
                        config.item = Math.ceil(config.item - (config.item*config.slideMargin/imgHeight));
                        self.slider.lightSlider(self._getSliderSettings(config));
                        $('.lSAction',self.element).insertBefore($('.lSSlideWrapper',self.element));
                    });
                },
                _getSliderSettings: function (config) {
                    var self = this;                    
                    return {
                        item: config.item,
                        vertical: true,
                        verticalHeight: self.height,
                        pager: false,
                        slideMargin: config.slideMargin
                    }
                }
            }
            horizonSlider._init();
        });
    }
    $.cdzWidget = function(name, widgetHandler) {
        $.fn[name] = function(options) {
            return this.each(function() {
                var handler = $.extend({}, widgetHandler)
                var $element = $(this);
                handler.init = function() {
                    handler.element = $element;
                    if (typeof handler.options == 'undefined') {
                        handler.options = {};
                    }
                    handler.options = $.extend({}, handler.options, options);
                    if (typeof handler._create === 'function') {
                        handler._create();
                    }
                }
                handler.init();
            });
        }
    }

    function runWidget(context) {
        $('[data-cdzwidget]', context).each(function() {            
            var $element = $(this);
            var widget = $element.data('cdzwidget');                
            for (var name in widget) {
                var options = widget[name];                
                if (typeof $.fn[name] === 'function') {
                    $element[name](options);
                }
            }
            $element.removeAttr('data-cdzwidget');
        });
    }
    $(document).ready(function() {
        var $body = $('body');
        runWidget($body);
        $body.on('contentUpdated', function() {
            runWidget($body);
        });
    });
    $.cdzWidget('owlslider', {
        options: {},
        _create: function() {
            var self = this,
                config = this.options;
            this.element.addClass('owl-carousel owl-theme');
            this.element.owlCarousel(config);
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
    $.cdzWidget('vslider', {
        _create: function() {
            this.element.verticalThumbsSlider(this.options);
        }
    });
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
})(jQuery);