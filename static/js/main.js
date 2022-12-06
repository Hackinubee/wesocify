/* ==========================================================================
MAIN.JS | Social NG | (c) Chris Ade 2020-2021
========================================================================== */
"use strict";

// Get Theme
function setThemeToLocalStorage(value) {
  window.localStorage.setItem('theme', value);
    if (value === 'dark') {
      $('body').addClass('is-dark');
    } else {
      $('body').removeClass('is-dark');
    }
}

function toggleTheme() {
  var theme = window.localStorage.getItem('theme');
    if (theme != null && theme != undefined) {
      setThemeToLocalStorage(theme);
    if (theme === 'dark') {
      $('#theme-toggle input').prop('checked', true);
    }
  }
  $('#theme-toggle input').on('change', function() {
    if ($(this).prop('checked') === true) {
      setThemeToLocalStorage('dark');
      $('#theme-toggle input').prop('checked', true);
    } else {
      setThemeToLocalStorage('light');
      $('#theme-toggle input').prop('checked', false);
    }
  });
}

/* ==========================================================================
Toggle theme (light/dark)
========================================================================== */
toggleTheme();

/* ==========================================================================
Explorer Menu
========================================================================== */
$(document).ready(function() {
if ($('.explorer-menu').length) {
    $('#explorer-trigger, #mobile-explorer-trigger').on('click', function () {
      $('.explorer-menu').toggleClass('is-active');
    });
  }
});

/* ==========================================================================
Drop Trigger Menu
========================================================================== */
$(document).ready(function() {
$('.drop-trigger').on('click', function() {
$(this).find('.nav-drop').toggleClass('is-active');
if ($(this).hasClass('is-account')) {
  $(this).addClass('is-opened');
}
});

$(document).click(function (e) {
var target = e.target;
if (!$(target).is('.nav-drop') && !$(target).parents().is('.drop-trigger')) {
  $('.nav-drop').removeClass('is-active');
  $('.is-account').removeClass('is-opened');
}
  });
});

/* ==========================================================================
Fixed Nav Menu
========================================================================== */
$(document).ready(function() {
$(window).on('scroll', function() {
  var height = $(window).scrollTop();
  if (height > 80) {
$(".toolbar-fixed-wrap").addClass('is-active');
  } else {
$(".toolbar-fixed-wrap").removeClass('is-active');
  }
  });
});

/* ==========================================================================
Form Input
========================================================================== */
$(document).ready(function() {
$('main#content').on('focus','.form-input-container input, .form-textarea-container textarea', function() {
  $(this).parent().addClass('is-focused');
});

$('main#content').on('blur','.form-input-container input, .form-textarea-container textarea', function() {
  $(this).parent().removeClass('is-focused');
});

$('main#content').on('focus','.form-textarea-container textarea', function() {
  $(this).parent().addClass('active');
});

$('main#content').on('blur','.form-textarea-container textarea', function() {
  if(!$(this).val()) {
  $(this).parent().removeClass('active');
  }
  });
});

/* ==========================================================================
Upvote Button
========================================================================== */
$(document).ready(function() {
$('main#content').on('click', '.upvote-btn', function() {
  $(this).toggleClass('not-liked is-liked').find('i').toggleClass('bouncy');
  });
});

/* ==========================================================================
Load More
========================================================================== */
$(document).ready(function() {
var t;
$('main#content').on('click', '.load-more-button', function (e) {
e.preventDefault();
clearTimeout(t);
$(this).toggleClass('loading');
t = setTimeout(function () {
$('.load-more-button').removeClass('loading');
}, 2500);
  });
});

/* ==========================================================================
Video Player
========================================================================== */
$(document).ready(function() {
if ($('.videos-wrapper.has-player').length) {
// Expand video description
$('#description-show-more').on('click', function() {
$('.additional-description').slideToggle('fast');
if ($(this).text() == 'Show More') {
$(this).html('Show Less');
} else {
$(this).html('Show More');
}
// Expand comments
$('.nested-replies .header').on('click', function() {
$(this).toggleClass('is-active');
$(this).siblings('.nested-comments').slideToggle('fast');
    });
  });
}
});

/* ==========================================================================
Back 2 Top
========================================================================== */
$(document).ready(function() {
  if ($('#top-control').length) {
  // Check to see if the window is top if not then display button
  $(window).scroll(function() {
  if ($(this).scrollTop() > 200) {
    $('#top-control').fadeIn();
  } else {
    $('#top-control').fadeOut();
  }
});
    }
// Scroll to the top
$('#top-control').on('click', function() {
$('html, body').animate({
scrollTop: 0
}, 1200);
return false;
  }); 
});

/* ==========================================================================
Bulma Modals
========================================================================== */
$(document).ready(function() {
if ($('.modal-trigger').length) {
$('main#content').on('click','.modal-trigger',function () {
var modalID = $(this).attr('data-modal');
$('#' + modalID).toggleClass('is-active');
});
$('main#content').on('click','.modal-close, .close-modal',function() {
$('.modal.is-active').removeClass('is-active');
  });
}
});

/* ==========================================================================
Bulma Dropdowns
========================================================================== */
$(document).ready(function() {
$('main#content').on('click','.dropdown-trigger', function() {
$('.dropdown-trigger').removeClass('is-active');
$(this).addClass('is-active');
});
$(document).on('click', function(e) {
var target = e.target;
if (!$(target).is('.dropdown-trigger img') && !$(target).parents().is('.dropdown-trigger')) {
  $('.dropdown-trigger').removeClass('is-active');
}
  });
});

/* ==========================================================================
Refresh Feed
========================================================================== */
$(document).ready(function() {
$('main#content').on('click','#refresh',function() {
  var id = $('#refresh').attr('data-id');
  $.ajax({
 url: baseUrl+"feed/refresh",
 type: 'post',
 data: {last_feed: id},
 cache: false,
 beforeSend: function() {
 $('#refresh').html('<div class="preloader preloader-center"></div>');
 },
 success: function(data) {
 $('#refresh').html('<span> Refresh </span>');
 $('.feed-content:first').before(data);
 $('.timeago').timeago();
 }
 });
    });
});

/* ==========================================================================
Post Feed
========================================================================== */
$(document).ready(function() {
$('#feed_form').on('submit', function(e) {
e.preventDefault();
var formData = new FormData(this);
$.ajax({
url: baseUrl+"feed/post",
type: "post",
data: formData,
contentType: false,
cache: false,
processData: false,
dataType: 'json',
beforeSend: function() {
$("#posting-feed").html('<div class="preloader preloader-center" style="padding: 16px;"></div>');
},
success: function(data) {
var result = data;
if(result.status == 200) {
$("#publish-button").removeAttr("disabled");
toast_success(result.message);
$('#feed_form').trigger('reset');
$('#feed,#feed-upload-input').val('');
$('#feed-upload').html('');
$('#feed-upload').hide();
closePublish();
reload();
$("#posting-feed").empty();
}
if (result.status == 201) {
$("#publish-button").removeAttr("disabled");
toast_error(result.message);
$('#feed_form').trigger('reset');
$('#feed,#feed-upload-input').val('');
$("#posting-feed").empty();
}
}
});
});
});

/* ==========================================================================
Search 
========================================================================== */
function load_data(query) {
$.ajax({
   url: baseUrl+"search",
   method: "post",
   data:{query:query},
   cache: false,
   success:function(data) {
    $('#search').html(data);
   }
});
}

/* ==========================================================================
Update Credits
========================================================================== */
$(document).ready(function() {
setInterval(function() {
$.ajax({
url: baseUrl+"update_credits",
type: "post",
success: function(data) {
}
});
}, 1000 * 60 * 1);
});

/* ==========================================================================
Search Init
========================================================================== */
$(document).ready(function() {
$('#search_text').on('keyup', function() {
var search = $(this).val();
if(search != null) {
load_data(search);
}
});
// clear search result when empty
setInterval(function() {
var search = $('#search_text').val();
if (!search) {
$('#search').hide();
}
else {
$('#search').show();
}
}, 1000);
});

/* ==========================================================================
Side Nav
========================================================================== */
$(document).ready(function() {
// Left Sidebar Init
$("#menu-bar").show();
$("#menu-bar > .handle").show();
$("#menu-bar > .handle").addClass("animate-right");
var slider = $("#menu-bar").slideReveal({
width: 60,
push: false,
speed: 600,
trigger: $(".handle"),
// autoEscape: false,
shown: function(obj){
obj.find(".handle").html('<span class="fal fa-chevron-left"></span>');
},
hidden: function(obj){
obj.find(".handle").html('<span class="fal fa-chevron-right"></span>');
}
});
});

/* ==========================================================================
Chatroom Side Nav
========================================================================== */
$(document).ready(function() {
// Chatroom Sidebar
$("#menu-bar-right").show();
$("#menu-bar-right > .handle-right").show();
$("#menu-bar-right > .handle-right").addClass("animate-left");
var slider = $("#menu-bar-right").slideReveal({
width: 60,
position: "right",
push: false,
speed: 600,
trigger: $(".handle-right"),
// autoEscape: false,
shown: function(obj){
obj.find(".handle-right").html('<span class="fal fa-chevron-right"></span>');
          },
hidden: function(obj){
obj.find(".handle-right").html('<span class="fal fa-chevron-left"></span>');
}
});
});

/* ==========================================================================
Timeago
========================================================================== */
$(document).ready(function() {
$(".timeago").timeago();
});

/* ==========================================================================
Dropify
========================================================================== */
$(document).ready(function() {
$('.dropify').dropify();
});

/* ==========================================================================
Password Toggle
========================================================================== */
$(document).ready(function() {
$(document).on('click', '#toggle-password', function() {
$(this).find('i').toggleClass("fa-eye fa-eye-slash");
var input = $('#password');
if (input.attr("type") == "password") {
    input.attr("type", "text");
} else {
    input.attr("type", "password");
  }
});
});

/* ==========================================================================
Toggle Side Nav
========================================================================== */
$(document).ready(function() {
$('#toggle_chatroom_nav').on('click', function() {
  $('#chatroom_nav').toggle();
  $(this).find('i').toggleClass('fa-bars fa-times animate-left');
});
});

/* ==========================================================================
Load Status
========================================================================== */
$(document).ready(function() {
$.ajax({
url: baseUrl +"feed/load_status",
type: 'post',
cache: false,
dataType: 'json',
beforeSend: function() {
$("#stories").html('<div class="preloader preloader-center" style="padding: 16px;"></div>');
},
success: function(data) {
var result = data;
if(result.code = 200) {
$("#stories").empty();
$("body").append(result.output);
}
else {
$("#stories").empty();
}
}
});
});

/* ==========================================================================
Load Status Invokable Function
========================================================================== */
function loadStatus() {
$.ajax({
url: baseUrl +"feed/load_status",
type: 'post',
cache: false,
dataType: 'json',
beforeSend: function() {
$("#stories").html('<div class="preloader preloader-center" style="padding: 16px;"></div>');
},
success: function(data) {
var result = data;
if(result.code = 200) {
$("#stories").empty();
$("body").append(result.output);
}
else {
$("#stories").empty();
}
}
});
};


/* ==========================================================================
Update Status
========================================================================== */
$(document).ready(function() {
$("form#status_form").on('submit', function(e) {
var data = $(".status-image").data('id');
  e.preventDefault();
  var formData = new FormData(this);
  $.ajax({
  url: baseUrl +"story/add",
  type: 'post',
  enctype: 'multipart/form-data',
  data: formData,
  cache: false,
  contentType: false,
  processData: false,
  dataType: 'json',
  beforeSend: function() {
  startAjaxLoading();
  $("#status-btn").attr({disabled:true});
  },
  success: function(data) {
  var result = data;
  if(result.status == 200) {
  stopAjaxLoading();
  toast_success(result.message);
  $("#status-btn").attr({disabled:false});
  $("#status_image").val('');
  $('form#status_form').trigger('reset');
  loadStatus();
  }
  else {
  toast_error(result.message);
  $("#status-btn").attr({disabled:false});
  $("#status_image").val('');
  }
}
});
});
});

/* ==========================================================================
Accordion
========================================================================== */
$(document).ready(function() {
$('main#content').on('shown.bs.collapse', '#room_acordion', function() {
$(this).find('button').find('i').toggleClass('fa-chevron-down fa-chevron-up');
});

$('main#content').on('hidden.bs.collapse', '#room_acordion', function() {
$(this).find('button').find('i').toggleClass('fa-chevron-up fa-chevron-down');
});
});

/* ==========================================================================
Comment
========================================================================== */
$(document).ready(function() {
$("form#comment_form").on('submit', function(e) {
e.preventDefault();
var formData = new FormData(this);
$.ajax({
url: baseUrl +"view/comment",
type: 'post',
data: formData,
cache: false,
contentType: false,
processData: false,
dataType: 'json',
beforeSend: function() {
$("#load-comments").html('<div class="preloader preloader-center" style="padding: 16px;"></div>');
},
success: function(data) {
var result = data;
if(result.status == 200) {
toast_success(result.message);
loadComments($("#load-comments").data('id'));
$('.timeago').timeago('updateFromDOM');
$('form#comment_form').trigger('reset');
}
else {
toast_error(result.message);
$("#load-comments").empty();
$("#comment_form").trigger('reset');
}
}
});
});
});

/* ==========================================================================
Greetings
========================================================================== */
$(document).ready(function() {
$(document).on('click', '#text-1,#text-2,#text-3,#text-4', function() {
 var $text = $(this).find('span').text();
 $('#message').val($text);
 $('#send').trigger('click');
});
});

/* ==========================================================================
Preview upload images
========================================================================== */
$(document).ready(function() {
$(document).on('change', '#feed-upload-input', function() {
if(this.files.length > 0) {
      $('#feed-upload').html('');
      $('#feed-upload').show();
for(var i = 0; i < this.files.length; i++) {
  if(this.files[i]) {
  var reader = new FileReader();
      
   reader.onload = function(e) {
      var deleteIcon = '<i class="far fa-times"></i>';
      var template = "\n<div class=\"upload-wrap\">\n<img src=\"" + e.target.result + "\" alt=\"\">\n<span class=\"remove-file\">\n                        " + deleteIcon + "\n</span>\n</div>\n";
      $('#feed-upload').append(template);
      $('.remove-file').on('click', function () {
        $('#feed-upload-input').val('');
        $(this).closest('.upload-wrap').remove();
      });
  }
  reader.readAsDataURL(this.files[i]);
        }
      }
    } else {
      // Clear any previous selections
      $('#feed-upload').html('');
      $('#feed-upload').hide();
    }
});
});

function initMisc() {
jQuery(".timeago").timeago('updateFromDOM');
$('#upload').on('click', function() {
$('#upload_field').toggle();
});
$('[data-toggle="popover"]').popover();
}

// Floating labels
const FloatLabel = (() => {
// add active class and placeholder
const handleFocus = (e) => {
const target = e.target;
target.parentNode.classList.add('active');
};

// remove active class and placeholder
const handleBlur = (e) => {
const target = e.target;
if(!target.value) {
target.parentNode.classList.remove('active');
}
target.removeAttribute('placeholder');
};

// register events
const bindEvents = (element) => {
const floatField = element.querySelector('input');
floatField.addEventListener('focus', handleFocus);
floatField.addEventListener('blur', handleBlur);
};

// get DOM elements
const init = () => {
const floatContainers = $(".form-input-container");
$(floatContainers).each(function() {
if (this.querySelector('input').value) {
this.classList.add('active');
}
bindEvents(this);
});
};
  return {
  init: init
  };
})();

/* ==========================================================================
Floating Labels
========================================================================== */
$(document).ready(function() {
FloatLabel.init();
});

// Reseize Gallery
function resizeGallery() {
	// image-container class
	var maxWidth = 1000;
	var maxHeight = 600;

	$('.image-container').css('max-width', maxWidth);
	$('.image-container').css('max-height', maxHeight);

	var currentWidth = $(window).width();
	var currentHeight = $(window).height();
	var currentMidWidth = Math.abs(currentWidth - maxWidth);
	var currentMidHeight = Math.abs(currentHeight - maxHeight);

	// Calculate the Width
	if(currentMidWidth <= 40 && currentMidWidth >= 0) {
		$('.image-container').css('max-width', currentWidth - 40);
		$('.image-container').css('margin-left', 20);
		$('.image-container').css('margin-right', 20);
	} else if(maxWidth < currentWidth) {
		$('.image-container').css('margin-left', ((currentWidth - maxWidth) / 2));
		$('.image-container').css('margin-right', ((currentWidth - maxWidth) / 2));
	} else {
		$('.image-container').css('max-width', currentWidth - 40);
	}

	// Calculate the Height
	if(currentMidHeight <= 40 && currentMidHeight >= 0) {
		$('.image-container').css('max-height', currentHeight - (62 - 20));
		$('.image-container').css('margin-top', 20);
		$('.image-container').css('margin-bottom', 20);
		$('.image-content').css('height', currentHeight - (40 + 62));
		$('#gallery-next, #gallery-prev').css({'height': ($('.image-content').height()-35), 'top': '35px'});
	} else if(maxHeight < currentHeight) {
		$('.image-container').css('margin-top', ((currentHeight - maxHeight) / 2));
		$('.image-container').css('margin-bottom', ((currentHeight - maxHeight) / 2));
		$('.image-content').css('height', maxHeight - 62);
		$('#gallery-next, #gallery-prev').css({'height': ($('.image-content').height()-35), 'top': '35px'});
	} else {
		$('.image-container').css('max-height', currentHeight - 40);
		$('.image-content').css('height', currentHeight - (40 + 62));
		$('#gallery-next, #gallery-prev').css({'height': ($('.image-content').height()-35), 'top': '35px'});
	}
	return false;
}

// Show Gallery
function showGallery(url, name) {
$("#gallery, #gallery-background, .overall").fadeIn(300);
$('.image-content').html('<img src="'+baseUrl+'/'+url+'" class="ri">').fadeIn(300);
$('.gallery-footer-container').html('<div class="gallery-top"><a onclick="closeGallery()" title="Close"><div class="gallery-close-btn"><i class="fal fa-times"></i></div></a><a href="'+baseUrl+'/'+url+'" title="Download" target="_blank" download><div class="gallery-download-btn"><i class="fal fa-arrow-down"></i></div></a><div class="gallery-author"> '+name+' </div></div>');
resizeGallery();
}

// Close Gallery
function closeGallery() {
$("#gallery, #gallery-background, .overall").fadeOut();
}

// Content loading placeholder
function placeload(elem) {
if ($('main#content').length) {
var shadowDomTimeout = setTimeout(function () {
$(elem).remove();
$('.true-dom').removeClass('is-hidden');
clearTimeout(shadowDomTimeout);
  }, 2500);
}
}

// Get new feed on scroll function
function loadMoreFeed() {
$(window).scroll(function() {
// if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
if($(window).scrollTop() >= $('#main-feed').offset().top + $('#main-feed').outerHeight() - window.innerHeight) {
 $(window).off("scroll");
 var id = $('#load_more').attr('data-id');
 $.ajax({
 url: baseUrl+"feed/load_more",
 type: 'post',
 data: {last_feed: id},
 cache: false,
 beforeSend: function() {
 $('#load_more').text("Loading more feeds...");
 },
 success: function(data) {
 $('#load_more').empty();
 $('.feed-content:last').after(data);
 $('.timeago').timeago();
 $(window).on("scroll");
 }
 });
}
});
}

// Reload feed function
function reload() {
 var id = $('#reload').attr('data-id');
$.ajax({
 url: baseUrl+"feed/reload",
 type: 'post',
 data: {last_feed: id},
 cache: false,
 beforeSend: function() {
 $('#reload').show();
 $('#reload').html('<div class="preloader preloader-center"></div>');
 },
 success: function(data) {
 $('#reload').hide();
 $('.feed-content:first').before(data);
 $('.timeago').timeago();
 }
 });
}

// React function
function react(param) {
var $elem = '#'+param;
var $target = $($elem).data('id');
$(document).on('click', $elem, function() {
if (param != null) {
$.ajax({
 url: baseUrl +'feed/react',
 type: "post",
 data: {data:$target},
 cache: false,
 dataType: 'json',
 beforeSend: function() {
 $($elem).addClass("disabled");
 $($elem).toggleClass('not-liked is-liked').find('i').toggleClass('bouncy');
 },
 success: function(data) {
 var result = data;
 if(result.status == 200) {
 $($elem).removeClass("disabled");
 getReactions($target);
}
 if (result.status == 201) {
 $($elem).removeClass("disabled");
 toast_error('An error occurred!');
}
}
});
}
else {
 toast_error('An error occurred!');
}
});
}

// Unreact function
function unreact(param) {
var $elem = '#'+param;
var $target = $($elem).data('id');
$(document).on('click', $elem, function() {
if (param != null) {
$.ajax({
 url: baseUrl +'feed/unreact',
 type: "post",
 data: {data:$target},
 cache: false,
 dataType: 'json',
 beforeSend: function() {
 $($elem).addClass("disabled");
 $($elem).toggleClass('is-liked not-liked').find('i').toggleClass('bouncy');
 },
 success: function(data) {
 var result = data;
 if(result.status == 200) {
 $($elem).removeClass("disabled");
 getReactions($($elem).parent().data('id'));
}
 if (result.status == 201) {
 $($elem).removeClass("disabled");
 toast_error('An error occurred!');
}
}
});
}
else {
 toast_error('An error occurred!');
}
});
}

// Get reactions
function getReactions(param) {
 $.ajax({
 url: baseUrl +'feed/load_reacts',
 type: 'post',
 data: {param: param},
 cache: false,
 dataType: 'json',
 success: function(data) {
 if(data.code == 201) {
 toast_error("An error occurred!");
 }
 else {
 $('.react-loading').detach();
 $('#get-reacts-'+param).html(data.output);
 }
}
 });
}

/* ==========================================================================
Reactions
========================================================================== */
$(document).ready(function() {
$(".control-block-button").each(function() {
var $elem = $(this).find($('a.get-reacts')).data('id');
getReactions($elem);
});
});

/* ==========================================================================
Reactions Invokable Function
========================================================================== */
function initReacts() {
$(".control-block-button").each(function() {
var $elem = $(this).find($('a.get-reacts')).data('id');
getReactions($elem);
});
}

// Disable scroll
function disableScroll() {
var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
window.onscroll = function() {
window.scrollTo(scrollLeft, scrollTop);
};
}

// Enable scroll
function enableScroll() {
    window.onscroll = function() {};
}

// Start Ajax loading screen
function startAjaxLoading() {
 $("#page-preloader").addClass("preload");
 disableScroll();
}

// Stop Ajax loading screen
function stopAjaxLoading() {
$("#page-preloader").removeClass("preload");
  enableScroll();
}

// Mention
function doMention(id, find, replace) {
	current = $('#'+id).val();
	$('#'+id).val(current.replace(new RegExp('\@'+find+'\\b'), '@'+replace+' '));
	$('#mentions-container').remove();
	$('#'+id).focus();
}

function escapeHtml(str) {
 var map = {
 '&': '&amp;',
 '<': '&lt;',
 '>': '&gt;',
 '"': '&quot;',
 "'": '&#039;'
};
    return str.replace(/[&<>"']/g, function(m) {return map[m];});
}

function decodeHtml(str) {
    var map =
    {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'"
    };
    return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function(m) {return map[m];});
}

// Fetch hashtags
function fetchTags() {
var $tag = $("#tag-value").data('value');
$.ajax({
url: baseUrl +"trends/load_tags",
type: 'post',
data: {tag: $tag},
cache: false,
dataType: 'json',
beforeSend: function() {
$("#show-hashtag-feeds").html('<div class="card"><div class="card-body"><div class="preloader preloader-center"></div></div></div>');
},
success: function(data) {
var result = data;
if(result.status == 200) {
$("#show-hashtag-feeds").html(result.output);
$('.timeago').timeago('updateFromDOM');
}
else {
$("#show-hashtag-feeds").html(result.output);
}
}
});
}

// Load comments
function loadComments(target) {
$.ajax({
url: baseUrl +"view/load_comments",
type: 'post',
data: {target: target},
cache: false,
dataType: 'json',
beforeSend: function() {
$("#load-comments").html('<div class="preloader preloader-center" style="padding: 16px;"></div>');
},
success: function(data) {
var result = data;
if(result.status == 200) {
$("#load-comments").html(result.output);
$('.timeago').timeago('updateFromDOM');
}
else {
$("#load-comments").html(result.output);
}
}
});
}

// Delete comment
function deleteComment(target, feed) {
$.ajax({
url: baseUrl +"view/delete/comment",
type: 'post',
data: {id: feed, target: target},
cache: false,
dataType: 'json',
beforeSend: function() {
$("#load-comments").html('<div class="preloader preloader-center" style="padding: 16px;"></div>');
},
success: function(data) {
var result = data;
if(result.status == 200) {
loadComments($("#load-comments").data('id'));
$('.timeago').timeago('updateFromDOM');
toast_success("Deleted");
$("#load-comments").empty();
}
else {
toast_error("An error occurred!");
$("#load-comments").empty();
}
}
});
}

// Edit comment
function editComment(message, target) {
var $msg = decodeHtml(message);
$('#editc_modal').modal('show');
$('#editc_modal').on('shown.bs.modal', function () {
var $attr = 'edit-cmt-'+target;
var $btn_attr = 'edit-comment-btn-'+target;
var $cmt_attr = target;
$(this).find('textarea').attr('id', $attr);
$(this).find('#edit-comment-btn').attr('id', $btn_attr);
$(this).find('input[name="cmt-id"]').val($cmt_attr);
$('#edit-cmt-'+target).val($msg);
$('#edit-cmt-'+target).trigger('focus');
$('form#edit-comment-form').submit(function(e) {
 e.preventDefault();
 var feed = $('#edit-cmt-'+target).data('id');
 var comment = target;
 var message = $('#edit-cmt-'+target).val();
 var formData = new FormData(this);
 $.ajax({
 url: baseUrl +"view/edit/comment",
 type: 'post',
 data: formData,
 cache: false,
 contentType: false, 
 processData: false,
 dataType: 'json',
 beforeSend: function() {
 $("#load-edit-comments"+comment).html('<div class="preloader" style="padding: 16px;display: inline-block;"></div>');
 $("#editc_modal").modal('hide');
 },
 success: function(data) {
 var result = data;
 if(result.status == 200) {
 $('form#edit-comment-form').trigger('reset');
 $('input[name="cmt-id"]').val('');
 $('textarea[name="edited-comment"]').attr('id', '');
 loadComments(feed);
 $('.timeago').timeago('updateFromDOM');
 }
 else {
 toast_error("An error occurred!");
 }
 }
 });
 });
});
}

function replyComment(target, comment) {
$('#reply_modal').modal('show');
$('#reply_modal').on('shown.bs.modal', function () {
var $attr = 'reply-cmt-'+comment;
var $btn_attr = 'reply-comment-btn-'+comment;
var $cmt_attr = comment;
$(this).find('textarea').attr('id', $attr);
$(this).find('#reply-comment-btn').attr('id', $btn_attr);
$(this).find('input[name="cmt-id"]').val($cmt_attr);
$('#reply-cmt-'+comment).trigger('focus');
$('form#reply-comment-form').submit(function(e) {
 e.preventDefault();
 var feed = $('input[name="feed_id"]').val();
 var message = $('#reply-cmt-'+comment).val();
 var formData = new FormData(this);
 $.ajax({
 url: baseUrl +"view/comment/reply",
 type: 'post',
 data: formData,
 cache: false,
 contentType: false,
 processData: false,
 dataType: 'json',
 beforeSend: function() {
 $("#load-edit-comments"+comment).html('<div class="preloader" style="padding: 16px;display: inline-block;"></div>');
 $("#reply_modal").modal('hide');
 },
 success: function(data) {
 var result = data;
 if(result.status == 200) {
 $('form#reply-comment-form').trigger('reset');
 $('input[name="cmt-id"]').val('');
 $('textarea[name="reply"]').attr('id', '');
 loadComments(feed);
 $('.timeago').timeago('updateFromDOM');
 }
 else {
 toast_error("An error occurred!");
 }
 }
 });
 });
});
}

function loadChats() {
var oldscrollHeight = $("#chat-screen").prop("scrollHeight");
var uid = $('#send').data('id');
  $.ajax({
   type: "post",
   url: baseUrl+"chats/load",
   data: {uid: uid},
   cache: false,
   dataType: 'json',
   success:function(data) {
   if(data.code == 200) {
    $('#chats').html(data.output);
    var newscrollHeight = $("#chat-screen").prop("scrollHeight");
    if (newscrollHeight > oldscrollHeight) {
    $("#send_stats").text("Updating...");
    $("#chat-screen").animate({scrollTop: newscrollHeight }, 3500);
    $("#chats").focus();
}
    $("#send_stats").empty();
}
   else {
    $('#chats').html(data.output);
}
},
	complete:function(data) {
     setTimeout(load_chats, 5000);
  }
  })
}

function deleteChat(cid) {
$.ajax({
url: baseUrl +"chats/delete",
type: 'post',
data: {cid: cid},
cache: false,
dataType: 'json',
beforeSend: function() {

},
success: function(data) { loadChats(); }
});
}

function editChat(cid) {
$('.dropdown').removeClass('is-active');
$('.message[data-id="'+cid+'"]').attr('contenteditable', true).focus();
$('.message[data-id="'+cid+'"]').on('blur', '', function() {
 $('.message[data-id="'+cid+'"]').removeAttr('contenteditable');
var content = $('.message[data-id="'+cid+'"]').text();
if(typeof content != undefined && content != "") {
$.ajax({
url: baseUrl +"chats/edit",
type: 'post',
data: {cid: cid, content: content},
cache: false,
dataType: 'json',
beforeSend: function() {

},
success: function(data) { 
if(data.code = 200) {
loadChats(); 
}
else {
 toast_error("An error occurred!");
}
}
});
}
else {
 toast_error("The field can not be empty!");
}
});
}

function loadMoreChat(uid, start) {
var sid = $('.chat-ctn:first').data('id');
$.ajax({
url: baseUrl +"chats/load",
type: 'post',
data: {uid: uid, sid: sid, start: start},
cache: false,
dataType: 'json',
beforeSend: function() {
$("#l-m-c").html('<div class="preloader preloader-center" style="padding: 16px;"></div>');
},
success: function(data) {
if(data.code == 200) {
 $('#chats').prepend(data.output);
 $("#l-m-c").prependTo('#chats');
}
}
});
}

function startLoadingBar() {
	// only add progress bar if added yet.
	jQuery("#loading-bar").show();
	jQuery("#loading-bar").width((50 + Math.random() * 30) + "%");
}

function stopLoadingBar() {
	// End loading animation
	jQuery("#loading-bar").width("101%").delay(200).fadeOut(400, function() {
		jQuery(this).width("0");
	});
}

/* ==========================================================================
Remove loading bar after page load
========================================================================== */
$(document).ready(function() {
  stopLoadingBar();
});

/* ==========================================================================
Post Comments
========================================================================== */
$(document).ready(function() {
  $('main#content').on('click','a.is-comment, .close-comments', function (e) {
    $(this).addClass('is-active').closest('.card').find('.content-wrap, .comments-wrap').toggleClass('is-hidden');
    var jump = $(this).closest('.is-post');
    var new_position = $(jump).offset();
    $('html, body').stop().animate({
      scrollTop: new_position.top - 70
    }, 500);
    e.preventDefault();
    setTimeout(function () {
      $('.emojionearea-editor').val('');
    }, 400);
  });
});

/* ==========================================================================
Compose
========================================================================== */
$(document).ready(function() {
if ($('#compose-card').length) {
  // Open publish mode
  $('main#content').on('click','#feed', function () {
    $('.app-overlay').addClass('is-active');
    $('.is-new-content').addClass('is-highlighted');
  }); 
  
  $('main#content').on('click','#add-story-button', function () {
    $('.app-overlay').addClass('is-active');
    $('.is-new-content').addClass('is-highlighted');
    $('.target-channels .channel').each(function () {
      if ($(this).find('input[type="checkbox"]').prop('checked')) {
        $(this).find('input[type="checkbox"]').prop('checked', false);
      } else {
        $(this).find('input[type="checkbox"]').prop('checked', true);
      }
    });
  }); 
  // Enable and disable publish button based on the textarea value length (1)
  $('main#content').on('input','#feed', function () {
    var valueLength = $(this).val().length;
    if (valueLength >= 1) {
      $('#publish-button').removeAttr('disabled');
    } else {
      $('#publish-button').attr('disabled', true);
    }
  }); 
  //Close compose box
  $('main#content').on('click','.close-publish', function () {
    $('.app-overlay').removeClass('is-active');
    $('.is-new-content').removeClass('is-highlighted');
  });
  }
});

function closePublish() {
$('.app-overlay').removeClass('is-active');
$('.is-new-content').removeClass('is-highlighted');
}

/* ==========================================================================
Load Feed Comments
========================================================================== */
function loadFeedComments(target) {
  return new Promise(function(resolve, reject) {
  $.ajax({
  url: baseUrl +"feed/load_comments",
  type: 'post',
  data: {target: target},
  cache: false,
  dataType: 'json',
  success: function(data) {
        resolve(data);
      },
      error: function(err) {
        reject(err);
      }
    });
  });
}

function changeLightboxImages() {
$('.fancybox-container [data-demo-src]').each(function () {
  var newSrc = $(this).attr('data-demo-src');
  $(this).attr('src', newSrc);
});
}

function remove_hash_from_url() {
var uri = window.location.toString();
if (uri.indexOf("#") > 0) {
var clean_uri = uri.substring(0,uri.indexOf("#"));
window.history.replaceState({},document.title, clean_uri);
  }
}

/* ==========================================================================
Fancybox function
========================================================================== */
$(document).ready(function() {
$('[data-fancybox]').each(function() {
  var target = $(this).data('id');
 $(this).fancybox({
   baseClass: "fancybox-custom-layout",
   keyboard: false,
   infobar: false,
   touch: {
   vertical: false
   },
   buttons: ["close"],
   animationEffect: "fade",
   transitionEffect: "fade",
   preventCaptionOverlap: false,
   idleTime: false,
   gutter: 0,
   caption: function caption(instance) {
   loadFeedComments(target).then(function(data) {
   $('.fancybox-custom-layout').addClass('fancybox-show-caption').find('.fancybox-caption__body').html(data.content);
   }).catch(function(err) {});
   },
   afterShow: function afterShow(instance, current) {
      changeLightboxImages();
          }
      });
   });
 });

/* ==========================================================================
Fancybox Invokable function
========================================================================== */
function fancyBox() {
$('[data-fancybox]').each(function() {
  var target = $(this).data('id');
 $(this).fancybox({
   baseClass: "fancybox-custom-layout",
   keyboard: false,
   infobar: false,
   touch: {
   vertical: false
   },
   buttons: ["close"],
   animationEffect: "fade",
   transitionEffect: "fade",
   preventCaptionOverlap: false,
   idleTime: false,
   gutter: 0,
   caption: function caption(instance) {
   loadFeedComments(target).then(function(data) {
   $('.fancybox-custom-layout').addClass('fancybox-show-caption').find('.fancybox-caption__body').html(data.content);
   }).catch(function(err) {});
   },
   afterShow: function afterShow(instance, current) {
      changeLightboxImages();
          }
      });
   });
}

/* ==========================================================================
Fancybox Comment Function
========================================================================== */
$(document).ready(function() {
$(document).on('click', '#publish-comment', function() {
var target = $(this).data('target');
var content = $("#comment-field").val();
var valueLength = $("#comment-field").val().length;
  if(valueLength > 1) {
  $.ajax({
  url: baseUrl +"feed/post_comment",
  type: 'post',
  cache: false,
  data: {target: target, content: content},
  dataType: 'json',
  success: function(data) {
if(data.status == 200) {
  toast_success(data.message);
  $("#comment-field").val('');
  loadFeedComments(target).then(function(data) {
$('.fancybox-custom-layout').addClass('fancybox-show-caption').find('.fancybox-caption__body').html(data.content);
   }).catch(function(err) {});
   var oldscrollHeight = $("#comments-container").prop("scrollHeight");
   var newscrollHeight = $("#comments-container").prop("scrollHeight");
 if(newscrollHeight > oldscrollHeight) {
$("#comments-container").animate({scrollTop: newscrollHeight }, 3500);
	}
  }
else {
   toast_error(data.message);
   $("#comment-field").val('');
   loadFeedComments(target).then(function(data) {
   $('.fancybox-custom-layout').addClass('fancybox-show-caption').find('.fancybox-caption__body').html(data.content);
   }).catch(function(err) {});
    }
  }
    });
        }
else {
toast_error("Please fill in the field!");
$("#comment-field").focus();
 }
  });
});

/* ==========================================================================
Fetch Live Loaded Page
========================================================================== */
$(document).ready(function() {
$("body").on("click", "a[rel='loadpage']", function(e) {
 e.preventDefault();
 // Get the link location that was clicked
 liveLoad($(this).attr('href'), null);
    return false;
});
// Override the back button to get the previous content 
$(window).on('popstate', function(ev) {
  // liveLoad(location.href, null);
  });
});

/* ==========================================================================
Live load pages
========================================================================== */
function liveLoad(pageurl, parameters) {
  startLoadingBar();
  $.ajax({
  url: pageurl,
  data: parameters,
  dataType: 'json',
  success: function(data) {
  var result = data;
  $('main#content').html(result.content);
  $('.dropify').dropify();
  placeload("#feed-shadow-dom");
  $('.timeago').timeago('updateFromDOM');
  fancyBox();
  initReacts();
  stopLoadingBar();
  document.title = result.title;
  $(document).scrollTop(0);
    FloatLabel.init();
  }
});
  // Store the url to the last page accessed
  if(pageurl != window.location) {
    window.history.pushState({path:pageurl}, '', pageurl);
   }
  return false;
}

/* ==========================================================================
Toast Service
========================================================================== */
function toast_success(text) {
iziToast.show({
  maxWidth: '280px',
  class: 'success-toast',
  icon: 'fas fa-check-circle',
  title: '',
  message: text,
  titleColor: '#fff',
  messageColor: '#fff',
  iconColor: "#fff",
  backgroundColor: '#3d70b2',
  progressBarColor: '#fafafa',
  position: 'bottomRight',
  transitionIn: 'fadeInUp',
  close: false,
  timeout: 1800,
  zindex: 99999
});
}

// Toast (error)
function toast_error(text) {
iziToast.show({
  maxWidth: '280px',
  class: 'error-toast',
  icon: 'far fa-ban',
  title: '',
  message: text,
  titleColor: '#fff',
  messageColor: '#fff',
  iconColor: "#fff",
  backgroundColor: '#ff533d',
  progressBarColor: '#fff',
  position: 'bottomRight',
  transitionIn: 'fadeInUp',
  close: false,
  timeout: 1800,
  zindex: 99999
});
}

/*
function parse($message) {
    // Parse links
    $parseUrl = preg_replace_callback('/(?i)\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:\'".,<>?«»“”‘’]))/', "parseCallback", $message);

    // Parse @mentions and #hashtags
    $parsedMessage = preg_replace(array('/(^|[^a-z0-9_\/])@([a-z0-9_]+)/i', '/(^|[^a-z0-9_\/])!([a-z0-9_]+)/i', '/(^|[^a-z0-9_\/])#(\w+)/u'), array('$1<a href="'.permalink(baseUrl.'/profile/$2').'" rel="loadpage">@$2</a>', '$1<a href="'.permalink(baseUrl.'/profile/$2').'" rel="loadpage">!$2</a>', '$1<a href="'.permalink(baseUrl.'/profile/$2').'" rel="loadpage">#$2</a>'), $parseUrl);

    return $parsedMessage;
}
*/