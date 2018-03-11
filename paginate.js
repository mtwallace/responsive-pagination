(function() {
	'use strict';
	
	function Pagination(list) {
		this._list = list;
		this._next = list.querySelector('.next');
		this._previous = list.querySelector('.previous');
		this._ellipsis = list.querySelectorAll('.ellipsis');
		this.ellipsis_count = 2;
		this._list_width = this.get_list_width();
		this._ellipsis_width = this.get_ellipsis_width();
		this._page = list.dataset.page;
		this._pages = list.dataset.pages;
		this._button_count = this.get_buttons(page,pages);
		this._button_width = this.get_buttons_width(button_count);
		let link list.querySelector('.link');
		this._link = { margin: link.style.marginRight, width: link.clientWidth };
		this._fit = this.get_pagination_count();
		this._range = (fit > pages) ? pages : fit - 2;
		this.min = page - Math.floor(this._range / 2);
		this.max = page + Math.floor(this._range / 2);
		this.prms = 0; // This will help calc # of the links with no right margin
		this.remainder = 0;
		this.resizeTimer;
	}
	window.pagination = Pagination;

	pagination.prototype._init = function() {
		this._paginate();
		window.addEventListener('resize', this.resize);
	}
	pagination.prototype.paginate = function() {
		this.corrections();
		this.hide_page_links();
		this.show_first_and_last();
		this.remove_margin();
		this.get_remainder();
		this.white_space_correction();
		this.invalid_calculation_correction();
		this.use_remaining_space();
		//this.debug();
	}
	// variable correction algorithm
	pagination.prototype.corrections = function() {
		if (this.min < 1) this.min = 1;
		if (this._range % 2 === 0 && this._range != pages) this.min++;

		if (this.min <= 2 || max >= pages - 1) {
			this._range++;
			this._fit++;
		}

		if (this._range >= this._pages || this._fit >= this._pages) {
			this._ellipsis_width = 0;
			this.ellipsis_count = 0;
			this._fit = this._pages;
			this.min = 1;
			this.max = this._pages;
			this._range = this._pages;
		} else if (this.min > 2 && this.max < this._pages - 1) {
			this.ellipsis_count = 2;
		} else if ( this.min > 2 || this.max < this._pages - 1) {
			this.ellipsis_count = 1;
			this.ellipsis_count = this.ellipsis_count / 2;
		} else this.ellipsis_count = 0;

		if (this.min == 2) this.max = this._range + 1;
		else if (this.max == this._pages - 1) this.min = this._pages - this._range;

		// Figure out how many page links won't have margin
		if(this.ellipsis_count == 2) this.prms = 3;
		else if (this.ellipsis_count == 1) this.prms = 2;
		else if (this.ellipsis_count == 0) this.prms = 1;
	}
	pagination.prototype.debug = function() {
		console.log(this.remainder + " = " + this._list_width + " - " + this._button_width + " - " + this._ellipsis_width + " - (" + this._fit + " * " + (this._link.margin + this._link.width) + ") + (" + this.prms + " * " + this._link.margin + ")");
		console.log(
			"min: " + this.min + '\n' + 
			"max: " + this.max + '\n' + 
			"range: " + this._range + '\n' + 
			"fit: " + this._fit + '\n' + 
			"button count: " + this._button_count + '\n' + 
			"button width: " + this._button_width + '\n' + 
			"ellipsis count: " + this.ellipsis_count + '\n' + 
			"ellipsis width: " + this._ellipsis_width + '\n' + 
			"list width: " + this._list_width + '\n' + 
			"buttons without margin: " + this.prms + '\n' + 
			"remainder: " + this.remainder
		);
	}
	// return number of prev/next buttons
	// parameters: current page, number of pages
	pagination.prototype.get_buttons = function(a,b) {
		return 1 < a && a < b ? 2 : 1;
	}
	// return number of prev/next buttons
	// paramenters: button count
	pagination.prototype.get_buttons_width = function(a) {
		let next = this._next, prev = this._prev;
		return (!!next ? next.clientWidth : !!prev ? prev.clientWidth : 0)*a;
	}
	// return width of the ellipsis
	pagination.prototype.get_ellipsis_width = function() {
		let ellipsis = this._ellipsis[0];
		return !!ellipsis ? ellipsis.clientWidth * 2 : 0;
	}
	// return width of pagination list
	pagination.prototype.get_list_width = function() {
		return this._list.clientWidth;
	}
	// return number of paginatio buttons that can fit
	pagination.prototype.get_pagination_count = function() {
		let link = this._link;
		return Math.floor(( this._list_width - this._button_width - this._ellipsis_width ) / (link.margin + link.width));
	}
	// Calculate the remaining space in the pagination div
	pagination.prototype.get_remainder = function() {
		this.remainder = Math.floor(this._list_width - this._button_width - this._ellipsis_width - (this._fit * (this._link.margin + this._link.width)) + (this.prms * this._link.margin));
	}
	// Hide the pages that won't fit
	pagination.prototype.hide_page_links = function() {
		if ((this._page == 1 || this.min == 1) && this._pages != this._fit) {
			// User on Page 1
			this.max = this._range;
			hide_elems(this._list.querySelectorAll('.page:gt(' + this.max + ')'));
		} else if ((this._page == this._pages || this.max >= this._pages) && this._pages != fit) {
			// User is on last page
			this.min = this._pages - this._range;
			hide_elems(this._list.querySelectorAll('.page:lt(' + (this.min - 1) + ')'));
		} else {
			// User is somehwere in between page 1 and the final page
			hide_elems(this._list.querySelectorAll('.page:lt(' + (this.min - 1) + ')'));
			hide_elems(this._list.querySelectorAll('.page:gt(' + (this.max - 1) + ')'));
		}
	}
	// If we somehow got a negative remainder, remove a page, reset 0 margins, and recalculate
	pagination.prototype.invalid_calculation_correction = function() {
		if (this.remainder < 0) {
			if(this.min <= 2) {
				$('.pagination .page:eq(' + (this.max) + ')').hide();
				remove_elems_right_margin(this._list.querySelectorAll('.page:eq(' + (this.max - 1) + ')'));
			} else if (this.max >= this._pages - 1) {
				hide_elems(this._list.querySelectorAll('.page:eq(' + (this.min) + ')'));
				remove_elems_right_margin(this._list.querySelectorAll('.page:eq(' + (this.min - 1) + ')'));
			}
			this.remainder = Math.floor(this._list_width - this._button_width - this.ellipsis_count - ((this._fit - 1) * (this._link.margin + this._link.width)) + (this.prms * this._link.margin));
		}
	}
	// Remove margin from pages that don't need it
	pagination.prototype.remove_margin = function() {
		if (this.max < this._pages - 1 && this._page == 1) remove_elems_right_margin(this._list.querySelectorAll('.page:eq(' + (this.max) + ')'));
		else if (this.max < this._pages - 1 && this.min > 2) remove_elems_right_margin(this._list.querySelectorAll('.page:eq(' + (this.max - 1) + ')'));
		else if (this.min < 2) remove_elems_right_margin(this._list.querySelectorAll('.page:eq(' + (this.max) + ')'));
		else if (this.min == 2) remove_elems_right_margin(this._list.querySelectorAll('.page:eq(' + (this.max - 1) + ')'));
		if (this.min > 2) remove_elems_right_margin(this._list.querySelectorAll('.page.first'));
	}
	// Hide the ellipsis that won't be used
	pagination.prototype.remove_ellipsis = function() {
		if (this.min <= 2) $('.pagination .ellipsis.first').hide();
		if (this.max >= this._pages - 1) $('.pagination .ellipsis.last').hide();
	}
	// Window resize for mobile orientation changes
	pagination.prototype.resize = function() {
		var el = this;
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			// For page resizing or orientation changes
			show_elems(el._list.querySelectorAll('.page'));
			set_elems_right_margin(el._list.querySelectorAll('.page'), 5);
			show_elems(el._ellipsis);
			el.paginate();
		}, 250);
	}
	// Show first and final link in the list
	pagination.prototype.show_first_and_last = function() {
		show_elems(this._list.querySelectorAll('.page.first'));
		show_elems(this._list.querySelectorAll('.page.last'));
	}
	// Use the remaining space to apply as margin so the pagination takes up the whole div
	pagination.prototype.use_remaining_space = function() {
		if (this._page == 1)
			set_elems_right_margin(this._list.querySelectorAll('.page.last'), this.remainder);
		else if (this._page == this._pages)
			set_elems_right_margin(this._list.querySelector('.previous'), this.remainder);
		else {
			set_elems_right_margin(this._list.querySelector('.previous'), (this.remainder / 2));
			set_elems_right_margin(this._list.querySelector('.page.last'), (this.remainder / 2));
		}
	}
	// This is to prevent a huge gap of whitespace for a short pagination list
	pagination.prototype.white_space_correction = function() {
		// If we only have 1 next/previous button and the remaining space is too big set it to 15
		if (this._npn < 2 && this.remainder > 49) this.remainder = 15;
	}
	// UTILITIES
	function hide_elems(elements) {
		for(let i = 0; i < elements.length; i++) 
			elements[i].setAttribute('style', 'display: none;');
	}
	function remove_elems_right_margin(elements) {
		for(let i = 0; i < elements.length; i++) 
			elements[i].setAttribute('style', 'margin-right: 0;');
	}
	function set_elems_right_margin(elements, margin) {
		for(let i = 0; i < elements.length; i++) 
			elements[i].setAttribute('style', 'margin-right: ' + margin + 'px;');
	}
	function show_elems(elements) {
		for(let i = 0; i < elements.length; i++) 
			elements[i].setAttribute('style', 'display: block;');
	}
})();
