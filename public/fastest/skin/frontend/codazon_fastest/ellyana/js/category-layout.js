/**
 * Copyright © 2017 Codazon. All rights reserved.
 * See COPYING.txt for license details.
 */
(function($){
    $.cdzWidget('categoryLayout',{
        options: {
            namespace: 'categoryLayout',
            sidebarBtn: '[data-role="toggle-sidebar"]',
            gridBtn: '[data-role="toggle-grid"]',
            listBtn: '[data-role="toggle-list"]',
            sidebar: '.col-left.sidebar',
            mainCol: '.col-main',
            fullClass: 'full-width',
            activeClass: 'active',
            mainColWidthFull: '100%',
            mainColWidthTwo: '75%',
            mainColWidthThree: '50%',
            absLeft: 366,
            layoutListing: 'col-desktop-4 col-tablet-l-3 col-tablet-p-2 col-mobile-2',
            layoutContainer: '.layout-mode',
            layoutListMode: '',
            direction: 'left',
            delay: 200,
            sidebarOff: 'sidebar-off',
            isoWrap: '.products',
            isoItem: '.product-item',
            toolbar: '#toolbar-wrap',
            mbAdapt: 768,
            listClass: 'products-list',
            gridClass: 'products-grid',
            mbSidebar: 'mb-sidebar',
            mbSbWidth: 300,
            sbOnClass: 'mb-sidebar-on',
            mbDelay: 200
        },
        _create: function(){
            this._assignElements();
            this._prepareHtml();
            this._bindEvent();
            this._isoLayout();
        },
        _assignElements: function(){
            var self = this, config = this.options;
            config.originLeft = !(Codazon.enable_rtl);
            this.$layout = $(config.layoutContainer).first();
            this.$sidebar = $(config.sidebar).first();
            this.$mainCol = $(config.mainCol).first();
            this.$parent = this.$sidebar.parent();
            this.$toolbar = $(config.toolbar).first();
            this.$pcToolbar = $('<div class="pc-toolbar">');
            this.$pcToolbar.insertBefore(this.$toolbar);
            this.sidebarOff = config.sidebarOff;
            this.$sidebarBtn = $(config.sidebarBtn);
            this.$isoWrap = $(config.isoWrap);
            this.$isoItem = $(config.isoItem);
            this.$gridBtn = $(config.gridBtn);
            this.$listBtn = $(config.listBtn);
            if(typeof Codazon.allGridClass != 'undefined') {
                config.layoutListing = Codazon.allGridClass;
            }
            if (this._isThreeColumnsPage()) {
                this.colNum = 3;
                this.colNumLess = 2;
                config.mainColWidth = config.mainColWidthThree;
                config.mainColWidthFull = config.mainColWidthTwo;
            } else if (this._isTwoColumnsPage()) {
                this.colNum = 2;
                this.colNumLess = 1;
                config.mainColWidth = config.mainColWidthTwo;
            } else {
                this.colNum = 1;
                this.colNumLess = 1;
                config.mainColWidth = config.mainColWidthFull;
            }
            if ($('#js-mobile-sidebar').length == 0) {
                this.$mbOverlay = $('<div class="mb-overlay" id="js-mb-overlay" />');
                this.$mbSidebar = $('<div id="js-mobile-sidebar" class="' + config.mbSidebar + '" />').css({
                    display: 'none', position: 'absolute', width: config.mbSbWidth, height: '100%', top: 0, left: -config.mbSbWidth
                });
                this.$mbOverlay.appendTo('body');
                this.$mbSidebar.appendTo('body');
            } else {
                this.$mbOverlay = $('#js-mb-overlay');
                this.$mbSidebar = $('#js-mobile-sidebar');
            }
            var isMobile = function() {
              var check = false;
              (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
              return check;
            };
            this.isMobile = isMobile();
        },
        _prepareHtml: function() {
            var self = this, config = this.options;
            var winwidth = window.innerWidth;
            self.$toolbar.css({display:''});
            this.$parent.css({position: 'relative'});
            this._adaptLayout = function(winwidth) {
                if (winwidth < config.mbAdapt) {
                    self.$toolbar.appendTo(self.$pcToolbar);
                    self._showSideBar(false);
                    self.$sidebar.css({position: ''});
                    self.$sidebar.appendTo(self.$mbSidebar);
                } else {
                    $('body').css({top: '', position: '', overflow: '', left: ''}).removeClass(config.sbOnClass);
                    self.$mbSidebar.hide();
                    self.$toolbar.insertBefore(self.$parent);
                    self.$sidebarBtn.css('display','');
                    self._updateSidebar();
                    self.$sidebar.insertBefore(self.$mainCol);
                }
            }
            this._adaptLayout(winwidth);
            if(this._isListMode()) {
                this._switchToList();
            }
        },
        _bindEvent: function(){
            var self = this, config = this.options,
            click = 'click.' + config.namespace,
            resize = 'resize.' + config.namespace;
            changeAdapt = 'changeAdapt' + config.namespace;
            if(!this._isOneColumnPage()){
                this.$sidebarBtn.off(click).on(click,function(e){
                    e.preventDefault();
                    if(window.innerWidth < config.mbAdapt) {
                        self._mbToggleSidebar();
                    } else {
                        self._toggleSideBar();
                    }
                });
            }else{
                this.$sidebarBtn.hide();
            }
            this.$listBtn.off(click).on(click,function(e){
                e.preventDefault();
                self._switchToList();
            });
            this.$gridBtn.off(click).on(click,function(e){
                e.preventDefault();
                self._switchToGrid();
            });
            this.$mbOverlay.off(click).on(click,function(e){
                self._mbHideSidebar();
            });
            var winwidth = window.innerWidth;
            $(window).off(resize).on(resize,function(){
                var newwidth = window.innerWidth;
                if( (winwidth < config.mbAdapt && newwidth >= config.mbAdapt) || (winwidth >= config.mbAdapt) && (newwidth < config.mbAdapt) ){
                    $(window).trigger(changeAdapt,[newwidth]);
                }
                winwidth = newwidth;
            });
            $(window).off(changeAdapt).on(changeAdapt,function(e,newwidth){
                self._adaptLayout(newwidth);
            });
        },
        _mbHideSidebar: function() {
            var self = this, config = this.options,
            sbOnClass = config.sbOnClass,
            $body = $('body');
            self.$mbSidebar.css({
                position: 'absolute',
                left: -config.mbSbWidth,
                top: $(window).scrollTop()
            });
            $body.animate({
                left: 0
            }, config.mbDelay, 'linear', function() {
                self.$mbSidebar.hide().css({top: ''});
                $body.css({top: '', position: '', overflow: ''}).removeClass(sbOnClass);
            });
        },
        _mbShowSidebar: function() {
            var self = this, config = this.options,
            sbOnClass = config.sbOnClass,
            $body = $('body');
            self.$mbSidebar.show();
            $body.addClass(sbOnClass);
            self.$mbSidebar.css({
                top: $(window).scrollTop(),
            });
            $body.css({top: 0, position: 'relative', overflow: 'hidden'});
            $body.animate({
                left: config.mbSbWidth
            }, config.mbDelay, 'linear', function() {
                self.$mbSidebar.css({
                    position: 'fixed',
                    left: 0,
                    top: 0
                });
            });
        },
        _mbToggleSidebar: function() {
            var self = this, config = this.options,
            sbOnClass = config.sbOnClass,
            $body = $('body');
            if ($body.hasClass(sbOnClass)) {
                self._mbHideSidebar();
            } else {
                self._mbShowSidebar();
            }
        },
        _isoLayout: function(){
            var self = this, config = this.options;
            if(this.isMobile) {
                var duration = 0;
            } else {
                var duration = config.delay;
            }
            setTimeout(function() {
                self._refreshItemHeight();
                self.iso = new Isotope( config.isoWrap, {
                    transitionDuration: duration,
                    itemSelector: config.isoItem,
                    originLeft: config.originLeft
                });
                self.$isoWrap.data('isotope',self.iso);
            }, 500);
            
            var winwidth = window.innerWidth;
            var isoTimeout = false;
            $(window).resize(function(){
                if(winwidth != window.innerWidth) {
                    if (isoTimeout) {
                        clearTimeout(isoTimeout);
                    }
                    isoTimeout = setTimeout(function() {
                        self._refreshItemHeight();
                    }, 100);
                    winwidth = window.innerWidth;
                }
            });
        },
        _switchToList: function() {
            var self = this, config = this.options;
            this.$listBtn.addClass(config.activeClass);
            this.$gridBtn.removeClass(config.activeClass);
            this.$layout.removeClass(config.gridClass).addClass(config.listClass);
            this.$isoWrap.removeClass(Codazon.layoutGridClass);
            this._refreshItemHeight();
            this.$isoItem.each(function() {
                var $item = $(this);
                var $el, $dest;
                /*if( $('.product-gallery',$item).length ) {
                    $el = $('.product-gallery',$item);
                    $dest = $('.cdz-hover-section',$item);
                    $el.appendTo($dest);
                }*/
                if( $('.qs-button',$item).length ) {
                    $el = $('.qs-button',$item);
                    $dest = $('.product-actions-right',$item);
                    $el.appendTo($dest);
                }
            });
            if(typeof self.iso !== 'undefined') {
                self.iso.arrange();
            }
            $('body').addClass('js_list');
        },
        _switchToGrid: function() {
            $('body').removeClass('js_list');
            var self = this, config = this.options;
            this.$gridBtn.addClass(config.activeClass);
            this.$listBtn.removeClass(config.activeClass);
            this.$layout.removeClass(config.listClass).addClass(config.gridClass);
            this.$isoWrap.addClass(Codazon.layoutGridClass);
            if(!this._isOneColumnPage()){
                if(this._isSidebarHidden()){
                    this._switchLayout(config,this.colNum, this.colNumLess);
                }else{
                    this._switchLayout(config,this.colNumLess,this.colNum);
                }
            }else{
                this._switchLayout(config,this.colNum,this.colNumLess);
            }
            this.$isoItem.each(function() {
                var $item = $(this);
                var $el, $dest;
                /*if( $('.product-gallery',$item).length ) {
                    $el = $('.product-gallery',$item);
                    $dest = $('.product-item-details',$item);
                    $el.prependTo($dest);
                }*/
                if( $('.qs-button',$item).length ) {
                    $el = $('.qs-button',$item);
                    $dest = $('.addto-button',$item);
                    $el.appendTo($dest);
                }
            });
            this._refreshItemHeight();
            if(typeof self.iso !== 'undefined') {
                self.iso.arrange();
            }
        },
        _refreshItemHeight: function(){
            if(typeof $.fn.sameHeightItems != 'undefined') {
                this.$layout.sameHeightItems({oneTime: true});
            }
        },
        _updateSidebar: function() {
            if (this._isSidebarHidden()) {
                this._hideSidebar(false);
            } else {
                this._showSideBar(false);
            }
        },
        _toggleSideBar: function(){
            if (this._isSidebarHidden()) {
                this._showSideBar(true);
            } else {
                this._hideSidebar(true);
            }
        },
        _showSideBar: function(effect) {
            var self = this, config = this.options,
            parentHeight = this.$parent.outerHeight();
            self.$sidebar.show();
            var before = {opacity: 0, position: 'absolute', top: 0};
            var after = {opacity: 1};
            
            if (config.originLeft) {
                var floatDir = 'right';
                before.left = -config.absLeft;
                after.left = 0;
            } else {
                var floatDir = 'left';
                before.right = -config.absLeft;
                after.right = 0;
            }
            
            if (effect) {
                var width = self.$isoItem.first().width();
                if (!self._isListMode()) {
                    self.$isoItem.width(width);
                }
                this.$sidebarBtn.attr('disabled','disabled');
                this.$parent.css({height: parentHeight});
                this.$sidebar.css(before);
                
                this.$sidebar.animate(after,config.delay,'linear',function(){
                    self.$parent.css({height: ''});
                    $('body').removeClass(self.sidebarOff);
                    self.$sidebarBtn.removeAttr('disabled');
                    self.iso.arrange();
                });
                this.$mainCol.css({float: floatDir}).animate({
                    width: config.mainColWidth
                },config.delay, 'swing', function(){
                    self.$sidebar.css({position: ''});
                    self.$mainCol.css({width: '', float: ''});
                    self.$isoItem.width('');
                    self._switchLayout(config, self.colNumLess, self.colNum);
                    self._refreshItemHeight();
                    self.iso.arrange();
                });
            } else {
                $('body').removeClass(self.sidebarOff);
                self.$mainCol.css({width: ''});
                self.$sidebar.css(after);
                self._switchLayout(config, self.colNumLess, self.colNum);
                self._refreshItemHeight();
                if(typeof self.iso !== 'undefined') {
                    self.iso.arrange();
                }
            }
        },
        _hideSidebar: function(effect) {
            var self = this, config = this.options,
            parentHeight = this.$parent.outerHeight();
            var before = {opacity: 1, position: 'absolute', top: 0};
            var after = {opacity: 0};
            if (config.originLeft) {
                var floatDir = 'right';
                before.left = 0;
                after.left = -config.absLeft;
            } else {
                var floatDir = 'left';
                before.right = 0;
                after.right = -config.absLeft;
            }
            if (effect) {
                var width = self.$isoItem.first().width();
                if(!self._isListMode()) {
                    self.$isoItem.width(width);
                }
                this.$sidebarBtn.attr('disabled','disabled');
                this.$parent.css({height: parentHeight});
                this.$sidebar.css(before);
                this.$sidebar.animate(after,config.delay,'linear',function(){
                    self.iso.arrange();
                    self.$sidebar.hide();
                    self.$parent.css({height: ''});
                    $('body').addClass(self.sidebarOff);
                    self.$sidebarBtn.removeAttr('disabled');
                    self.iso.arrange();
                });
                this.$mainCol.css({float: floatDir}).animate({
                    width: config.mainColWidthFull
                },config.delay,'swing',function() {
                    self.$isoItem.width('');
                    self._switchLayout(config, self.colNum, self.colNumLess);
                    self._refreshItemHeight();
                    self.iso.arrange();
                    self.$mainCol.css({float: ''});
                });
            } else {
                $('body').addClass(self.sidebarOff);
                self.$sidebar.css(after).hide();
                self.$isoItem.width('');
                self.$mainCol.css({width: config.mainColWidthFull});
                self._switchLayout(config, self.colNum, self.colNumLess);
                self._refreshItemHeight();
                if(typeof self.iso !== 'undefined') {
                    self.iso.arrange();
                }
            }
        },
         _switchLayout: function (config,from,to) {
            Codazon.layoutGridClass = config.layoutListing[to];
            var winwidth = window.innerWidth;
            this.$isoWrap.removeClass(config.layoutListing[from]);
            
            if(this._isListMode()){
                this.$layout.addClass(config.layoutListMode);
            } else {
                this.$layout.addClass(config.layoutGridMode);
                this.$isoWrap.addClass(config.layoutListing[to]);
            }
        },
        _isListMode: function() {
            return this.$layout.hasClass(this.options.listClass) | $('body').hasClass('js_list');
        },
        _isSidebarHidden: function() {
            return ($('body').hasClass(this.sidebarOff) | this._isOneColumnPage());
        },
        _isOneColumnPage: function() {
            return ($('.col-right').length == 0)&&($('.col-left').length == 0);
        },
        _isThreeColumnsPage: function() {
            return ($('.col-right').length > 0)&&($('.col-left').length > 0);
        },
        _isTwoColumnsPage: function() {
            return ($('.col-right').length > 0)&&($('.col-left').length == 0) || ($('.col-right').length == 0)&&($('.col-left').length > 0);
        }
    });
})(jQuery);