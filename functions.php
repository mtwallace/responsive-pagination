<?php
	function pagination() {
	    global $paged;
	    global $wp_query;
	    
	    if(empty($paged)) $paged = 1;

		$pages = $wp_query->max_num_pages;

		if(!$pages) $pages = 1;  

	    if($pages > 1) {

	    	$html = '<ul class="pagination clearfix" data-page="' . $paged . '" data-pages="' . $pages . '">';
	        
	        if ($paged > 1) {
	        	$html .= '<li class="previous"><a href="' . get_pagenum_link(1) . '" title="Previous Page" class="button">Prev</a></li>';
	        	$html .= '<li class="page link first"><a href="' . get_pagenum_link(1) . '">1</a></li>';
	        } else
	       		$html .= '<li class="page current">1</li>';

	       	$html .= '<li class="ellipsis first"><span>...</span></li>';

	        for ($i = 2; $i < $pages; $i++)
	            $html .= ($paged == $i)? '<li class="page current">' . $i . '</li>':'<li class="page link"><a href="' . get_pagenum_link($i) . '">' . $i . '</a></li>';

	        $html .= '<li class="ellipsis last"><span>...</span></li>';

	        if ($paged < $pages) {
	        	$html .= '<li class="page link last"><a href="' . get_pagenum_link($pages) . '">' . $pages . '</a></li>';
	        	$html .= '<li class="next"><a href="' . get_pagenum_link($paged + 1) . '" title="Next Page" class="button">Next</a></li>';
	        } else
	       		$html .= '<li class="page current">' . $pages . '</li>';
	        	
	        $html .= '</ul>';

	        echo $html;
	    }
	}
