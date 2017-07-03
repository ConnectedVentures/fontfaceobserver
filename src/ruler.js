goog.provide('fontface.Ruler');

goog.scope(function () {

  /**
   * @constructor
   * @param {string} text
   */
  fontface.Ruler = function (text, dom) {
    var style = 'max-width:none;' +
                'display:inline-block;' +
                'position:absolute;' +
                'height:100%;' +
                'width:100%;' +
                'overflow:scroll;' +
                'font-size:16px;';

    this.dom = dom;

    this.element = this.dom.createElement('div');
    this.element.setAttribute('aria-hidden', 'true');

    this.dom.append(this.element, this.dom.createText(text));

    this.collapsible = this.dom.createElement('span');
    this.expandable = this.dom.createElement('span');
    this.collapsibleInner = this.dom.createElement('span');
    this.expandableInner = this.dom.createElement('span');

    this.lastOffsetWidth = -1;

    this.dom.style(this.collapsible, style);
    this.dom.style(this.expandable, style);
    this.dom.style(this.expandableInner, style);
    this.dom.style(this.collapsibleInner, 'display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;');

    this.dom.append(this.collapsible, this.collapsibleInner);
    this.dom.append(this.expandable, this.expandableInner);

    this.dom.append(this.element, this.collapsible);
    this.dom.append(this.element, this.expandable);
  };

  var Ruler = fontface.Ruler;

  /**
   * @return {Element}
   */
  Ruler.prototype.getElement = function () {
    return this.element;
  };

  /**
   * @param {string} font
   */
  Ruler.prototype.setFont = function (font) {
    this.dom.style(this.element, 'max-width:none;' +
                            'min-width:20px;' +
                            'min-height:20px;' +
                            'display:inline-block;' +
                            'overflow:hidden;' +
                            'position:absolute;' +
                            'width:auto;' +
                            'margin:0;' +
                            'padding:0;' +
                            'top:-999px;' +
                            'white-space:nowrap;' +
                            'font-synthesis:none;' +
                            'font:' + font + ';');
  };

  /**
   * @return {number}
   */
  Ruler.prototype.getWidth = function () {
    return this.element.offsetWidth;
  };

  /**
   * @param {string} width
   */
  Ruler.prototype.setWidth = function (width) {
    this.element.style.width = width + 'px';
  };

  /**
   * @private
   *
   * @return {boolean}
   */
  Ruler.prototype.reset = function () {
    var offsetWidth = this.getWidth(),
        width = offsetWidth + 100;

    this.expandableInner.style.width = width + 'px';
    this.expandable.scrollLeft = width;
    this.collapsible.scrollLeft = this.collapsible.scrollWidth + 100;

    if (this.lastOffsetWidth !== offsetWidth) {
      this.lastOffsetWidth = offsetWidth;
      return true;
    } else {
      return false;
    }
  };

  /**
   * @private
   * @param {function(number)} callback
   */
  Ruler.prototype.onScroll = function (callback) {
    if (this.reset() && this.element.parentNode !== null) {
      callback(this.lastOffsetWidth);
    }
  };

  /**
   * @param {function(number)} callback
   */
  Ruler.prototype.onResize = function (callback) {
    var that = this;

    function onScroll() {
      that.onScroll(callback);
    }

    this.dom.addListener(this.collapsible, 'scroll', onScroll);
    this.dom.addListener(this.expandable, 'scroll', onScroll);
    this.reset();
  };
});
