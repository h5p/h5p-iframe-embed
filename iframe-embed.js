var H5P = H5P || {};

H5P.IFrameEmbed = function (options, contentId) {
  var $ = H5P.jQuery;
  var $iframe = null;
  this.$ = $(this);

  options = H5P.jQuery.extend({
    width: "500px",
    minWidth: "300px",
    height: "500px",
    source: "",
    resizeSupported: true
  }, options);

  if (!this instanceof H5P.IFrameEmbed){
    return new H5P.IFrameEmbed(options, contentId);
  }

  this.attach = function ($wrapper) {
    // Set up an iframe with the correct source, and append
    // it to '$wrapper'.

    var iFrameSource = '';

    if (options.source !== undefined) {
      if (options.source.trim().toLowerCase().substring(0, 4) === 'http') {
        iFrameSource = decode_entities(options.source);
      }
      else {
        iFrameSource = H5P.getContentPath(contentId) + '/' + options.source;
      }
    }

    $iframe = $('<iframe/>', {
      src: iFrameSource,
      scrolling: 'no',
      frameBorder: 0,
      'class': 'h5p-iframe-content h5p-iframe-wrapper'
    }).css({width: options.width, height: options.height});

    $wrapper.html('');
    $wrapper.append($iframe);
    
    if(options.resizeSupported === false) {
      /* Unfortunately fullscreen-button is not in DOM yet.
       * Therefore we need to remove it using a timer */
      setTimeout(function () {
        $('.h5p-enable-fullscreen').hide();
      }, 1);
    }
    
    this.$.trigger('resize');
  };

  this.resize = function () {
    if(this.parent && this.parent.slides && this.parent.slides.length >= 10) { // checks if the parent has slides and is therefore a course presentation
      $iframe.css({width: '100%', height: '100%'}); // always set 100% if course pres
    } else { // default standalone config
      if(options.resizeSupported) { 
        $iframe.css(
          (H5P.isFullscreen) ? {width: '100%', height: '100%'} : getElementSize($iframe)
        );
      }
    }
  };

  var getElementSize = function ($element) {
    // Get width of 'element' parent. Return width and height
    // so that 'element' scales (with the proper ratio) to fit
    // the parent. Make sure 'element' doesn't scale below
    // 'options.minWidth'.
    var elementMinWidth = parseInt(options.minWidth ,10);
    var elementSizeRatio = parseInt(options.height, 10) / parseInt(options.width, 10);
    var parentWidth = $element.parent().width();
    var elementWidth = (parentWidth > elementMinWidth) ? parentWidth : elementMinWidth;

    return {
      width: elementWidth + 'px',
      height: elementWidth * elementSizeRatio + 'px'
    };
  };

  var decode_entities = (function() {
    // Remove HTML Entities
    var element = document.createElement('div');

    function decode_HTML_entities (str) {
      if (str && typeof str === 'string') {
        // Escape HTML before decoding for HTML Entities
        str = escape(str).replace(/%26/g,'&').replace(/%23/g,'#').replace(/%3B/g,';');
        element.innerHTML = str;
        if (element.innerText) {
          str = element.innerText;
          element.innerText = '';
        } else {
          // Firefox support
          str = element.textContent;
          element.textContent = '';
        }
      }
      return unescape(str);
    }
    return decode_HTML_entities;
  })();

  // This is a fix/hack to make touch work in iframe on mobile safari,
  // like if the iframe is listening to touch events on the iframe's
  // window object. (like in PHET simulations)
  window.addEventListener("touchstart", function () {});
};
