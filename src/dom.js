goog.provide('fontface.Dom');

goog.scope(function () {

  /**
   * @constructor
   *
   * @param {Document} document
   */
  fontface.Dom = function (document) {
    this.document = document || window.document;
  };

  var Dom = fontface.Dom;

  /**
   * @private
   * @return {boolean}
   */
  Dom.prototype.supportsAddEventListener = function () {
    return !!this.document.addEventListener;
  };

  /**
   * @param {string} name
   * @return {Element}
   */
  Dom.prototype.createElement = function (name) {
    return this.document.createElement(name);
  };

  /**
   * @param {string} text
   * @return {Text}
   */
  Dom.prototype.createText = function (text) {
    return this.document.createTextNode(text);
  };

  /**
   * @param {Element} element
   * @param {string} style
   */
  Dom.prototype.style = function (element, style) {
    element.style.cssText = style;
  };

  /**
   * @param {Node} parent
   * @param {Node} child
   */
  Dom.prototype.append = function (parent, child) {
    parent.appendChild(child);
  };

  /**
   * @param {Node} parent
   * @param {Node} child
   */
  Dom.prototype.remove = function (parent, child) {
    parent.removeChild(child);
  };

  /**
   * @param {Element} element
   * @param {string} className
   *
   * @return {boolean}
   */
  Dom.prototype.hasClass = function (element, className) {
    return element.className.split(/\s+/).indexOf(className) !== -1;
  };

  /**
   * @param {Element} element
   * @param {string} className
   */
  Dom.prototype.addClass = function (element, className) {
    if (!this.hasClass(element, className)) {
      element.className += ' ' + className;
    }
  };

  /**
   * @param {Element} element
   * @param {string} className
   */
  Dom.prototype.removeClass = function (element, className) {
    if (this.hasClass(element, className)) {
      var parts = element.className.split(/\s+/);
      var index = parts.indexOf(className);

      parts.splice(index, 1);

      element.className = parts.join(' ');
    }
  };

  /**
   * @param {Element} element
   * @param {string} oldClassName
   * @param {string} newClassName
   */
  Dom.prototype.replaceClass = function (element, oldClassName, newClassName) {
    if (this.hasClass(element, oldClassName)) {
      var parts = element.className.split(/\s+/);
      var index = parts.indexOf(oldClassName);

      parts[index] = newClassName;

      element.className = parts.join(' ');
    }
  };

  /**
   * @param {Element} element
   * @param {string} event
   * @param {function(Event)} callback
   */
  Dom.prototype.addListener = function (element, event, callback) {
    if (this.supportsAddEventListener()) {
      element.addEventListener(event, callback, false);
    } else {
      element.attachEvent(event, callback);
    }
  };

  /**
   * @param {function()} callback
   */
  Dom.prototype.waitForBody = function (callback) {
    if (this.document.body) {
      callback();
    } else {
      if (this.supportsAddEventListener()) {
        this.document.addEventListener('DOMContentLoaded', function listener() {
          this.document.removeEventListener('DOMContentLoaded', listener);
          callback();
        });
      } else {
        // IE8
        this.document.attachEvent('onreadystatechange', function listener() {
          if (this.document.readyState == 'interactive' || this.document.readyState == 'complete') {
            this.document.detachEvent('onreadystatechange', listener);
            callback();
          }
        });
      }
    }
  };
});
