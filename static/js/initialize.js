/*! initialize.js | Social NG | (c) Chris Ade 2020-2021 */

/* ==========================================================================
Initialize defined functions
========================================================================== */
"use strict";

function init() {
placeload('#feed-shadow-dom');
refreshReactions();
initExplorerMenu();
initNavDrop();
initFixedNav();
initInputFields();
initInputFields();
initUpvote();
initLoadMore();
initVideoDesc();
initScroll2Top();
initBulmaModals();
initBulmaDropdowns();
postFeed();
updateCredit();
search();
initSideNav();
initSideNav2();
initTimeago();
initPasswordToggle();
initChatroomSidenav();
initAcordion();
loadStatus();
addStatus();
initGreetings();
initUploadPreview();
initMisc();
initPostComments();
initCompose();
closePublish();
changeLightboxImages();
}

init();
initliveLoad();

/* ==========================================================================
Live load pages
========================================================================== */
function liveLoad(pageurl, parameters) {
	startLoadingBar();
	// Request the page
	$.ajax({
    url: pageurl,
    data: parameters,
    success: function(data) {
	var result = jQuery.parseJSON(data);
	// Show the content
	$('#content').html(result.content);
	// Stop the loading bar
	stopLoadingBar();
	// Set the new title tag
	document.title = result.title;
	// Scroll the document at the top of the page
	$(document).scrollTop(0);
    FloatLabel.init();
	// Reload functions
	init();
	}
});
	// Store the url to the last page accessed
	if(pageurl != window.location) {
		window.history.pushState({path:pageurl}, '', pageurl);
	}
	return false;
}