$(document).ready(function() {
	// Pagination
	var resizeTimer;

	if($('.pagination').length) pagination();

	$(window).on('resize', function (e) {
		if($('.pagination').length) {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function() {
				// For page resizing or orientation changes
				$('.pagination .page').show().css('margin-right', 5);
				$('.ellipsis').show();
				pagination();
			}, 250);
		}
	});

	function pagination() {
		var page = $('.pagination').data('page');
		var pages = $('.pagination').data('pages');
		var npn = ( 1 < page && page < pages ) ? 2 : 1;
		var npw = ( $('.next').width() ) ? ( $('.next').width() ) * npn : ( $('.previous').width() ) * npn;
		var en = 2;
		var ew = $('.ellipsis')[0].getBoundingClientRect().width * en;
		var pw = $('.pagination')[0].getBoundingClientRect().width;
		var fit = Math.floor(( pw - npw - ew ) / 44);
		var range = (fit > pages) ? pages : fit - 2;
		var min = page - Math.floor(range / 2);
		var max = page + Math.floor(range / 2);
		var prms = 0;

		// Variable corrections because assumptions had to be made
		if (min < 1) min = 1;
		if (range % 2 === 0 && range != pages) min++;

		if (min <= 2 || max >= pages - 1) {
			range++;
			fit++;
		}

		// Variable corrections because assumptions had to be made
		if (range >= pages || fit >= pages) {
			ew = 0;
			en = 0;
			fit = pages;
			min = 1;
			max = pages;
			range = pages;
		} else if (min > 2 && max < pages - 1) en = 2;
		else if ( min > 2 || max < pages - 1) {
			en = 1;
			ew = ew / 2;
		} else en = 0;

		// Variable corrections because assumptions had to be made
		if (min == 2) max = range + 1;
		else if (max == pages - 1) min = pages - range;

		// Figure out how many page links won't have margin
		if(en == 2) prms = 3;
		else if (en == 1) prms = 2;
		else if (en == 0) prms = 1;

		// Hide the pages that won't fit
		if ((page == 1 || min == 1) && pages != fit) {
			max = range;
			$('.pagination .page:gt(' + max + ')').hide();
		} else if ((page == pages || max >= pages) && pages != fit) {
			min = pages - range;
			$('.pagination .page:lt(' + (min - 1) + ')').hide();
		} else {
			$('.pagination .page:lt(' + (min - 1) + ')').hide();
			$('.pagination .page:gt(' + (max - 1) + ')').hide();
		}

		// Make sure the first and last page always show
		$('.pagination .page.first').show();
		$('.pagination .page.last').show();

		// Remove margin from pages that don't need it
		if (max < pages - 1 && page == 1) $('.pagination .page:eq(' + (max) + ')').css('margin-right', 0);
		else if (max < pages - 1 && min > 2) $('.pagination .page:eq(' + (max - 1) + ')').css('margin-right', 0);
		else if (min < 2) $('.pagination .page:eq(' + (max) + ')').css('margin-right', 0);
		else if (min == 2) $('.pagination .page:eq(' + (max - 1) + ')').css('margin-right', 0);
		if (min > 2) $('.pagination .page.first').css('margin-right', 0);

		// Hide the ellipsis that won't be used
		if (min <= 2) $('.pagination .ellipsis.first').hide();
		if (max >= pages - 1) $('.pagination .ellipsis.last').hide();

		// Calculate the remaining space in the pagination div
		var remainder = Math.floor(pw - npw - ew - (fit * 44) + (prms * 5));

		// If we only have 1 next/previous button and the remaining space is too big set it to 15
		if (npn < 2 && remainder > 49) remainder = 15;

		// If we somehow got a negative remainder, remove a page, reset 0 margins, and recalculate
		if (remainder < 0) {
			if(min <= 2) {
				$('.pagination .page:eq(' + (max) + ')').hide();
				$('.pagination .page:eq(' + (max - 1) + ')').css('margin-right', 0);
			} else if (max >= pages - 1) {
				$('.pagination .page:eq(' + (min) + ')').hide();
				$('.pagination .page:eq(' + (min - 1) + ')').css('margin-right', 0);
			}
			remainder = Math.floor(pw - npw - ew - ((fit - 1) * 44) + (prms * 5));
		}

		// Use the remaining space to apply as margin so the pagination takes up the whole div
		if (page == 1) $('.pagination .page.last').css('margin-right', remainder);
		else if (page == pages) $('.previous').css('margin-right', remainder);
		else {
			$('.pagination .previous').css('margin-right', (remainder / 2));
			$('.pagination .page.last').css('margin-right', (remainder / 2));
		}

		// console.log(remainder + " = " + pw + " - " + npw + " - " + ew + " - (" + fit + " * 44) + (" + prms + " * 5)");
		// console.log(
		// 	"min: " + min + '\n' + 
		// 	"max: " + max + '\n' + 
		// 	"range: " + range + '\n' + 
		// 	"fit: " + fit + '\n' + 
		// 	"npn: " + npn + '\n' + 
		// 	"npw: " + npw + '\n' + 
		// 	"en: " + en + '\n' + 
		// 	"ew: " + ew + '\n' + 
		// 	"pw: " + pw + '\n' + 
		// 	"prms: " + prms + '\n' + 
		// 	"remainder: " + remainder
		// );
	}
});
