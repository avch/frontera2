var $ = require('jquery');
var slick = require('slick-carousel');

require('fancybox')($);

module.exports = (function() {
	$(document).ready(function() {
		$('.fancybox').fancybox();

		$('.slick').slick();

		$('.toggle').each(function() {
			var target = this.dataset.toggleTarget,
				evt = this.dataset.toggleEvent;

			if( ! evt) evt = 'click';

			$(this).on(evt, function(e) {
				$(target).toggleClass(this.dataset.toggleClass);

				if(this.tag == 'A' && evt == 'click') {
					e.preventDefault();
					e.stopPropagation();
				}
			});
		});

		(function() {
			var $totop = $('<a href="#no-click" class="to-top hide"></a>');

			$totop.on('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				$('html, body').animate({ scrollTop: 0 }, 'slow');
			});

			$('body').append($totop);

			$(window).on('scroll', function() {
				if($(this).scrollTop() > 350) {
					$totop.removeClass('hide');
				} else {
					$totop.addClass('hide');
				}
			});
		})();

		if(navigator.platform.indexOf('iPad') != -1) {
			document.querySelector('meta[name=viewport]').setAttribute('content', 'width=1200');
		}
	});
})();
