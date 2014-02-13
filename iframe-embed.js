var H5P = H5P || {};

H5P.IFrameEmbed = function (options, contentId) {
  var self = this,
    $ = H5P.jQuery;

  this.options = H5P.jQuery.extend({}, {
    "width": "100%",
    "height": "500px",
    "minHeight": "420px",
    "source": ""
  }, options);

  if (!this instanceof H5P.IFrameEmbed){
    return new H5P.IFrameEmbed(options, contentId);
  }

  var attach = function ($wrapper) {
    $wrapper.html('').addClass('h5p-edge');
    
    var iFrameSource = '';
    
    if (self.options.source !== undefined) {
      if(self.options.source.trim().toLowerCase().substring(0, 4) === 'http') {
        iFrameSource = self.options.source;
      }
      else {
        iFrameSource = H5P.getContentPath(contentId) + '/' + self.options.source;
      }
    }
    
    var $iframe = $('<iframe/>', {
      src: iFrameSource,
      scrolling: 'no',
      frameBorder: 0,
      'class': 'h5p-iframe-content h5p-iframe-wrapper'
    }).css({width: self.options.width, height: self.options.height, 'min-height': self.options.minHeight});
    $wrapper.append($iframe);
    
    $iframe.ready(function () {
      // Get height of h5p at startup
      var height = $iframe.parent().height();
      var $doc = $iframe.contents();
      
      var resizeIframeInterval = setInterval(function () {
        var contentWidth = $iframe.parent().width();
        var contentHeight = $iframe.parent().height();
        var frameWidth = $iframe.innerWidth();
        var frameHeight = $iframe.innerHeight();
        
        if (frameWidth !== contentWidth || frameHeight !== contentHeight) {
          $iframe.css({
            width: (H5P.isFullscreen) ? '100%' : contentWidth + 'px',
            height: (H5P.isFullscreen) ? '100%' : height + 'px'
          });
          $doc[0].documentElement.style.margin = '0 0 1px 0';
        }
        else {
          // Small trick to make scrollbars go away in ie.
          $doc[0].documentElement.style.margin = '0 0 0 0';
        }
      }, 300);
    });

    return this;
  };
  
  // This is a fix/hack to make touch work in iframe on mobile safari,
  // like if the iframe is listening to touch events on the iframe's 
  // window object. (like in PHET simulations)
  window.addEventListener("touchstart", function () {});

  var returnObject = {
    attach: attach,
    machineName: 'H5P.IFrameEmbed'
  };

  return returnObject;
};
