/*
 * HTML5 application library
 * Copyright (c) 2012-2017 Alexander Melanchenko
 * http://alexnd.com
 * Released under the MIT License
 */

var window = window || self || global || this;

(function ($window, $lib) {

  if ('object' == typeof module && null !== module) {

    module.exports = function ($g, $ns) {
      var $g = ('undefined' == typeof $g) ? $window : $g;
      var $ns = ('undefined' == typeof $ns) ? $lib : $ns;
      var $ = _factory($g, $ns);
      return $;
    }
  } else {
    _factory($window, $lib);
  }

  function _factory($g, $ns) {

    var self = this;
    if (!('object' == typeof $g[$ns] && $g[$ns]!==null)) {
      $g[$ns] = {};
    }
    var $ = $g[$ns];

// polyfills

    //you can redefine lib.alert to something more useful
    $.alert = $g.alert;
    if ('undefined' == typeof $g.console) $g.console = {
      '_alerts': true,
      '_': function () {
        if ($g.console._alerts) $.alert($g.Array.prototype.slice.call(arguments).join('\n'));
      },
      'assert': function () {
        $g.console._(arguments);
      },
      'clear': function () {
      },
      'count': function () {
      },
      'debug': function () {
        $g.console._(arguments);
      },
      'dir': function () {
        $g.console._(arguments);
      },
      'dirxml': function () {
      },
      'error': function () {
        $g.console._(arguments);
      },
      'exception': function () {
        $g.console._(arguments);
      },
      'group': function () {
      },
      'groupCollapsed': function () {
      },
      'groupEnd': function () {
      },
      'info': function () {
        $g.console._(arguments);
      },
      'log': function () {
        $g.console._(arguments);
      },
      'profile': function () {
      },
      'profileEnd': function () {
      },
      'table': function () {
        $g.console._(arguments);
      },
      'time': function () {
      },
      'timeEnd': function () {
      },
      'timeStamp': function () {
      },
      'trace': function () {
        $g.console._(arguments);
      },
      'warn': function () {
        $g.console._(arguments);
      }
    };

    if (!$g.String.prototype.trim) {
      $g.String.prototype.trim = function () {
        //return this.replace(/^\s+|\s+$/g,'');
        return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
      }
    }

// http://es5.github.io/#x15.4.4.18
    if (!$g.Array.prototype.forEach) {
      $g.Array.prototype.forEach = function (callback, thisArg) {
        var T, k;
        if (this == null) {
          throw new $g.TypeError(' this is null or not defined');
        }
        var O = $g.Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== 'function') {
          throw new $g.TypeError(callback + ' is not a function');
        }
        if (arguments.length > 1) {
          T = thisArg;
        }
        k = 0;
        while (k < len) {
          var kValue;
          if (k in O) {
            kValue = O[k];
            callback.call(T, kValue, k, O);
          }
          k++;
        }
      };
    }

// http://es5.github.io/#x15.4.4.21
    if (!$g.Array.prototype.reduce) {
      $g.Array.prototype.reduce = function (callback /*, initialValue*/) {
        'use strict';
        if (this == null) {
          throw new $g.TypeError('Array.prototype.reduce called on null or undefined');
        }
        if (typeof callback !== 'function') {
          throw new $g.TypeError(callback + ' is not a function');
        }
        var t = $g.Object(this), len = t.length >>> 0, k = 0, value;
        if (arguments.length == 2) {
          value = arguments[1];
        } else {
          while (k < len && !(k in t)) {
            k++;
          }
          if (k >= len) {
            throw new $g.TypeError('Reduce of empty array with no initial value');
          }
          value = t[k++];
        }
        for (; k < len; k++) {
          if (k in t) {
            value = callback(value, t[k], k, t);
          }
        }
        return value;
      };
    }

// http://es5.github.io/#x15.4.4.19
    if (!$g.Array.prototype.map) {
      $g.Array.prototype.map = function (callback, thisArg) {
        var T, A, k;
        if (this == null) {
          throw new $g.TypeError(' this is null or not defined');
        }
        var O = $g.Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== 'function') {
          throw new $g.TypeError(callback + ' is not a function');
        }
        if (arguments.length > 1) {
          T = thisArg;
        }
        A = new $g.Array(len);
        k = 0;
        while (k < len) {
          var kValue, mappedValue;
          if (k in O) {
            kValue = O[k];
            mappedValue = callback.call(T, kValue, k, O);
            A[k] = mappedValue;
          }
          k++;
        }
        return A;
      };
    }

    if ('undefined' == typeof $g.requestAnimationFrame) $g._requestAnimationFrame_interval = 20;
    $g.requestAnimationFrame =
      $g.requestAnimationFrame ||
      $g.webkitRequestAnimationFrame ||
      $g.mozRequestAnimationFrame ||
      $g.oRequestAnimationFrame ||
      $g.msRequestAnimationFrame ||
      function (cb, el) {
        $g.setTimeout(function () {
          cb(+new $g.Date());
        }, $g._requestAnimationFrame_interval);
      };

    $g.URL = $g.URL || $g.webkitURL || null;

    $g.AudioContext =
      $g.AudioContext ||
      $g.webkitAudioContext ||
      $g.mozAudioContext ||
      $g.oAudioContext ||
      $g.msAudioContext || null;

// localization back compat
    if ('undefined' == typeof $g.__) $g.__ = function (k) {
      return ('object' == typeof $g.i18n && 'undefined' != typeof $g.i18n[k]) ? $g.i18n[k] : k
    };

// console sugar
    $g.log = $g.console.log.bind($g.console);
    $g.trace = $g.console.trace.bind($g.console);

//lib

    $.inject = function (dst, src) {
      try {
        if (!('object' == typeof dst && null !== dst)) var dst = {};
        if ('object' == typeof src && null !== src) for (var p in src) {
          if ('function' == typeof src.hasOwnProperty && !src.hasOwnProperty(p)) continue;
          dst[p] = src[p];
        }
        if (arguments.length > 2) {
          for (var i = 2; i < arguments.length; i++) {
            if ('object' == typeof arguments[i] && null !== arguments[i]) for (var p in arguments[i]) {
              if ('function' == typeof arguments[i].hasOwnProperty && !arguments[i].hasOwnProperty(p)) continue;
              dst[p] = arguments[i][p];
            }
          }
        }
        return dst;
      } catch (e) {
        return null;
      }
    };

    $.serialize = function(obj, prefix) {
      var str = [];
      for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
          var k = prefix ? prefix + '[' + p + ']' : p,
            v = obj[p];
          str.push(typeof v == 'object' ? $.serialize(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v));
        }
      }
      return str.join('&');
    };

    $.unserialize = function (s) {
      return s.split('&').reduce(function (a, p) {
        var ps = p.split('=').map(function (v) {
          return decodeURIComponent(v.replace('+', ' '));
        });
        a[ps[0]] = ps[1];
        return a;
      }, {});
    };

    $.copy = function(src, isown) {
      var dest = {};
      if('object'==typeof src) for (var p in src) {
        if (undefined!==isown && isown && undefined!==src['hasOwnProperty'] && !src.hasOwnProperty(p)) continue;
        dest[p] = src[p];
      }
      return dest;
    };

    /**
     * c - Child
     * p - Parent
     function Parent() {}
     function Child() {}
     lib.inherit(Child, Parent);
     var kid = new Child();
     **/
    $.inherit = (function () {
      var f = function(){};
      return function(c, p) {
        f.prototype = p.prototype;
        c.prototype = new f();
        c._super = p.prototype;
        c.prototype.constructor = c;
      }
    }());

    $.empty = function (v) {
      try {
        if (!v) return true;
        if (v instanceof Array) return ( v.length == 0 );
        if (v instanceof Object) {
          for (var i in v) {
            if (v.hasOwnProperty(i)) return false;
          }
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    };

    $.to_str = Object.prototype.toString;

    $.is_str = function (s) {
      return typeof s === 'string';
    };

    $.is_arr = function (a) {
      return $.to_str.call(a) === '[object Array]';
    };

    $.is_obj = function (v) {
      return v !== null && typeof v === 'object';
    };

    $.is_el = function (el) {
      return ($.is_obj(el) && undefined !== el['nodeType']);
    };

    $.is_num = function (v) {
      return typeof v === 'number';
    };

    $.is_fun = function (v) {
      return typeof v === 'function';
    };
    $.is_func = $.is_fun;

    $.is_null = function (v) {
      return v === null;
    };

    $.is_empty = function (v) {
      if (v === undefined) return true;
      if (v == null) return false;
      if (lib.is_arr(v) || lib.is_str(v)) return !v.length;
      if (lib.is_obj(v)) return !Object.keys(v).length;
      return false;
    };

    $.to_int = function (s) {
      var n = parseInt(s, 10);
      return n === null || isNaN(n) ? 0 : n;
    };
    $.parse_num = $.to_int;

    $.to_float = function (v) {
      var n = parseFloat(v);
      return n === null || isNaN(n) ? 0 : n;
    };

    $.is_url = function(v) {
      return ($.is_str(v) && v.match(/^https?\:\/\/\w+/));
    };

    $.arr_intersect = function (a, a2) {
      try {
        for (var i = a.length; i--;) {
          for (var j = a2.length; j--;) {
            if (a[i] == a2[j]) return true;
          }
        }
        return false;
      } catch (e) {
        return null
      }
    };

    $.in_arr = function (a) {
      try {
        for (var i = a.length; i--;) {
          for (var j = 0; j < arguments.length; j++) {
            if (j == 0) continue;
            if (a[i] == arguments[j]) return i;
          }
        }
        return null;
      } catch (e) {
        return null
      }
    };

    $.arr_trim = function (a) {
      try {
        for (var i = a.length; i--;) {
          if (a[i] === undefined) a.splice(i, 1);
        }
      } catch (e) {
      }
    };

    // Return real var type string representation
    $.toType = function (ob) {
      return ({}).toString.call(ob).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    };

    // converts float number to string with given precision
    $.toFixed = function (value, precision) {
      var power = Math.pow(10, precision || 0);
      return String(Math.round(value * power) / power);
    };

    $.toSource = function (obj, name) {
      try {
        var c = obj.constructor.toString();
        var tmpArr = [];
        var tmpName = ( name ) ? '"' + name + '"' + ':' : "";
        if (c.match(/Object/g)) {
          var tmpOArr = [];
          for (var i in obj) {
            tmpOArr.push($.toSource(obj[i], i));
          }
          tmpArr.push(tmpName + "{" + tmpOArr.join() + "}");
        }
        if (c.match(/Array/g)) {
          var tmpAArr = [];
          for (var i = 0, l = obj.length; i < l; i++) {
            tmpAArr.push($.toSource(obj[i]));
          }
          tmpArr.push(tmpName + "[" + tmpAArr.join() + "]");
        }
        else if (c.match(/String/g)) {
          var tmpStr = obj.replace(/(\\)/g, '\\');
          tmpStr = tmpStr.replace(/(")/g, '\\"');
          tmpArr.push(tmpName + '"' + tmpStr + '"');
        }
        else if (c.match(/Number/g)) {
          tmpArr.push(tmpName + obj);
        }
        return tmpArr.join();

      } catch (e) {
      }
    };

    // converts numeric degrees to radians
    $.toRad = function (a) {
      if (!isNaN(a)) {
        return parseFloat(a) * Math.PI / 180;
      }
      return 0;
    };

    $.strbool = function (s) {
      return (('string' == typeof s && /^true$/i.test(s)) ? true : false);
    };

    $.trim_str = function (s) {
      return s.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
    };

    $.capitalize = function (s) {
      return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    };

    // Returns a random number between min and max
    $.rnd_a = function (min, max) {
      return Math.random() * (max - min) + min;
    };

    // Returns a random integer between min and max
    // Using Math.round() will give you a non-uniform distribution!
    $.rnd_i = function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    $.rnd_circ = function () {
      var t = 2 * Math.PI * Math.random();
      var u = Math.random() + Math.random();
      var r = (u>1) ? 2-u : u;
      return [r * Math.cos(t), r * Math.sin(t)];
    };

    $.err = function (s) {
      console.log('Error:', s);
    };

    $.ts = function () {
      return Date.now();
    };
	
	$.t = function () {
      return Math.floor(Date.now() / 1000);
	};

    $.tsof = function (x) {
      return $.ts() + x;
    };

    $.id = function (s) {
      return document.getElementById(s);
    };

    //var cnv = lib.el('CANVAS', {width:100,height:100,style:'background:#000'});
    $.el = function (tag) {
      var el = document.createElement(tag);
      if (tag.toUpperCase() === 'CANVAS' && 'undefined' != typeof window.G_vmlCanvasManager) {
        G_vmlCanvasManager.initElement(el);
      }
      if (arguments.length > 1 && 'object' == typeof arguments[1]) {
        for (var i in arguments[1]) {
          if ('object' == typeof arguments[1][i]) {
            for (var j in arguments[1][i]) {
              el[i][j] = arguments[1][i][j];
            }
          } else {
            el.setAttribute(i, arguments[1][i]);
          }
        }
      }
      if (arguments.length > 2 && null !== arguments[2]) {
        if (tag.match(/^INPUT|TEXTAREA$/i))
          el.value = arguments[2];
        else
          el.innerHTML = arguments[2];
      }
      if (arguments.length > 3) {// && 'object' == typeof arguments[3]
        $.inject(el.style, arguments[3]);
      }
      return el;
    };

    $.qs = function (s) {
      if (arguments.length > 1)
        return s.querySelector(arguments[1]);
      else
        return document.querySelector(s);
    };

    $.qsa = function (s) {
      if (arguments.length > 1)
        return s.querySelectorAll(arguments[1]);
      else
        return document.querySelectorAll(s);
    };

    $.add = function (p, el) {
      p.appendChild(el);
    };

    $.addBefore = function (p, el) {
      return p.insertBefore(el, p.firstChild);
    };

    // adds DOM node to the end after referenced one
    $.addAfter = function (parent, node, referenceNode) {
      parent.insertBefore(node, referenceNode.nextSibling);
    };

    $.rm = function (el) {
      el.parentNode.removeChild(el);
    };

    $.isChildOf = function (child, parent) {
      var node = child.parentNode;
      while (node != null) {
        if (node == parent) {
          return true;
        }
        node = node.parentNode;
      }
      return false;
    };

    $.cn = function (el, t) {
      return el.getElementsByTagName(t).item(0);
    };

    $.cns = function (el, t) {
      return el.getElementsByTagName(t);
    };

    $.ptn = function (node, nodeName) {
      try {
        var node = (($.is_str(node)) ? $.id(node) : node);
        while (node.parentNode && node.parentNode.nodeName != nodeName) {
          node = node.parentNode;
        }
        if (!node.parentNode) return;
        return node.parentNode;
      } catch (e) {
        return;
      }
    };

    $.pcn = function (node, className) {
      try {
        var node = (($.is_str(node)) ? $.id(node) : node);
        while (node.parentNode && !$.match_class(node.parentNode, className)) {
          node = node.parentNode;
        }
        if (!node.parentNode) return;
        return node.parentNode;
      } catch (e) {
        return;
      }
    };

    $.match_class = function (node, className) {
      try {
        var node = ($.is_str(node)) ? $.id(node) : node;
        var classArr = node.className.split(/\s+/i);
        for (var i = classArr.length; i-- > 0;) {
          if (classArr[i] == className) return true;
        }
        return false;
      } catch (e) {
        return;
      }
    };

    $.set_class = function (node, className, state) {
      try {
        var node = ($.is_str(node)) ? $.id(node) : node;
        var classArr = node.className.split(/\s+/i);
        for (var i = classArr.length; i-- > 0;) {
          if (classArr[i] == className) {
            if (state) return;
            if (!state) {
              classArr.splice(i, 1);
              node.className = classArr.join(' ');
              return;
            }
          }
        }
        if (state) {
          classArr.push(className);
          node.className = classArr.join(' ');
        }
      } catch (e) {
      }
    };

    $.set_classes = function (node, classNamesStates) {
      try {
        if ($.is_str(node)) node = $.id(node);
        if ($.is_el(node)) {
          var classArr = node.className.split(/\s+/i), i, j, s;
          for (j in classNamesStates) {
            s = 0;
            for (i = 0; i < classArr.length; i++) {
              if (!classNamesStates[j]) {
                s = 1;
                if (classArr[i] == j) {
                  classArr.splice(i, 1);
                }
                break;
              }
              else if (classArr[i] == j) s = 1;
            }
            if (!s && classNamesStates[j]) classArr.push(j);
          }
          node.className = classArr.join(' ');
        }
      } catch (e) {
      }
    };

    $.get_css_selector = function (className) {
      var r, classes = document.styleSheets[0].rules || document.styleSheets[0].cssRules;
      for (var x = 0; x < classes.length; x++) {
        if (classes[x].selectorText == className) {
          r = (classes[x].cssText) ? classes[x].cssText : classes[x].style.cssText;
        }
      }
      return r;
    };

    $.txt = function (el) {
      return el.innerText || el.textContent || '';
    };

    $.first_el = function (node) {
      try {
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
          if (node.childNodes[i].nodeType == $.NODE_ELEMENT) return node.childNodes[i];
        }
        return null;
      } catch (e) {
        return null;
      }
    };

    $.next_by_tag = function (node, nodeName) {
      try {
        while (node.nextSibling) {
          if (node.nextSibling.nodeName == nodeName) return node.nextSibling;
          node = node.nextSibling;
        }
        return null;
      } catch (e) {
        return null;
      }
    };

    $.prev_by_tag = function (node, nodeName) {
      try {
        while (node.previousSibling) {
          if (node.previousSibling.nodeName == nodeName) return node.previousSibling;
          node = node.previousSibling;
        }
        return null;
      } catch (e) {
        return null;
      }
    };

    $.has_atr = function (el, n) {
      return ( el.hasAttribute(n) );
    };

    $.body = function () {
      return document.getElementsByTagName('body')[0];
    };

    $.d2c = function (el) {
      return ($.is_el(el) ? el.getContext('2d') : null);
    };

    /*
       params:
       elementNode - dom node
       eventName - string event name
       callback - function
       useCapture - bool (true - capturing, false - bubbling)
       example:
       lib.event(el, 'click', function(e){
         if (!e) var e = window.event;
         lib.prevent(e);
         //do work...
         return false;
       });
    */
    $.event = function (el, ev, cb, cap) {
      var el = ('undefined'==typeof el) ? null : el;
	  if ($.is_str(el)) el = lib.id(el);
	  if (!$.is_el(el)) el = lib.qs(el);
	  if (!$.is_el(el)) return;
	  if (typeof cb!='function') return;
      if (!ev) return;
      if (el.addEventListener) {
        el.addEventListener(ev, cb, ((undefined === cap) ? false : cap));
      }
      //FIXME?
      else if (el.attachEvent) {
        //el.attachEvent('on' + ev, cb);
        el.attachEvent('on' + ev, function () {
          cb.call(event.srcElement, event);
        });
      }
      else {
        el['on' + ev] = cb
      }
    };

    $.unevent = function (el, ev, cb, cap) {
      if (el && el.removeEventListener) {
        try {// FF issue
          el.removeEventListener(ev, cb, ((undefined === cap) ? false : cap));
        } catch (_) {
        }
      } else if (el && el.detachEvent) {
        el.detachEvent('on' + ev, cb);
      } else if (el) {
        if (undefined !== el['on' + ev]) {
          //delete el['on' + ev];
          el['on' + ev] = null;
        }
      }
    };

    $.prevent = function (ev) {
      if (!ev) return false;
      ev.cancelBubble = true;
      ev.returnValue = false;
      if (ev.stopPropagation) ev.stopPropagation();
      if (ev.preventDefault) ev.preventDefault();
      return false;
    };

    $.eventTarget = function (e) {
      var trg;
      if (e.target) trg = e.target;
      else if (e.toElement) trg = e.toElement;
      else if (e.currentTarget) trg = e.currentTarget;
      else if (e.srcElement) trg = e.srcElement;
      else trg = e;
      return trg;
    };

    $.eventSource = function (e) {
      var trg;
      if (e.currentTarget) trg = e.currentTarget;
      else if (e.srcElement) trg = e.srcElement;
      else if (e.target) trg = e.target;
      else if (e.toElement) trg = e.toElement;
      else trg = e;
      return trg;
    };

    $.mousepos = function (e) {
      if (e.pageX || e.pageY) {
        return {x: e.pageX, y: e.pageY};
      }
      return {
        x: e.clientX + document.body.scrollLeft - document.body.clientLeft,
        y: e.clientY + document.body.scrollTop - document.body.clientTop
      }
    };

    $.cookie = {
      create: function (name, value, days) {
        if (typeof days !== 'number' || typeof name !== 'string' || typeof value !== 'string') {
          return false;
        }
        var date = new Date();
        date.setTime(date.getTime() + (days * 86400000));
        document.cookie = name + '=' + value + '; expires=' + date.toGMTString() + '; path=/';
      },
      read: function (name) {
        var cookie = document.cookie,
          i, val = false;
        cookie = cookie.split(';');
        for (i = 0; i < cookie.length; i++) {
          if (cookie[i].indexOf(name) !== -1) {
            while (cookie[i].indexOf(name) > 0 && cookie[i].length > name.length) {
              cookie[i] = cookie[i].substr(1);
            }
            val = cookie[i].substr(name.length + 1);
          }
        }
        return val;
      },
      erase: function (name) {
        this.create(name, '', -1);
      }
    };

    //ajax wrapper
    /*
      var xhr = lib.xhr();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          try {
            var r = lib.json_decode(req.responseText);
            //work with r
          } catch(_){
            //handle error
          }
        }
      };
      xhr.open('GET', 'foo=bar', true);
      xhr.send(null);
    */
    $.xhr = function () {
      var ref = null;
      if (window.XMLHttpRequest) {
        ref = new XMLHttpRequest();
      } else if (window.ActiveXObject) {
        try {
          ref = new ActiveXObject('Msxml2.XMLHTTP.6.0');
        } catch (e) {
        }
        try {
          ref = new ActiveXObject('Msxml2.XMLHTTP.3.0');
        } catch (e) {
        }
        try {
          ref = new ActiveXObject('Microsoft.XMLHTTP');
        } catch (e) {
        }
        //throw new Error('This browser does not support XMLHttpRequest.');
      }
      return ref;
    };

    //http://www.html5rocks.com/en/tutorials/cors/?redirect_from_locale=ru
    //var xhr = lib.xhr_cors('GET', url);
    //if (!xhr) throw new Error('CORS not supported');
    //xhr.onload = function() {
    //  var responseText = xhr.responseText;
    //  log(responseText);
    //};
    //xhr.onerror = function() {
    //  log('There was an error!');
    //};
    //xhr.send();
    $.xhr_cors = function (method, url) {
      var xhr = new XMLHttpRequest();
      if ("withCredentials" in xhr) {
        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);
      } else if (typeof XDomainRequest != "undefined") {
        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url);
      } else {
        // Otherwise, CORS is not supported by the browser.
        xhr = null;
      }
      if (xhr !== null) xhr.withCredentials = true;
      return xhr;
    };

    $.sendfile = function (url, file, varname, filename, extravars, load_img_back, cb, formEl) {
      var xhr = $.xhr();
      if (undefined !== formEl) {
        var fd = new FormData(formEl);
      } else {
        var fd = new FormData();
      }
      xhr.open('POST', url, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          if (xhr.responseText != '') {
            if (undefined !== load_img_back && load_img_back) {
              var img = new Image();
              if ('function' == typeof cb) {
                img.onload = function () {
                  cb.call(this, img);
                }
              }
              img.src = xhr.responseText;
            } else {
              if ('function' == typeof cb) {
                cb.call(this, xhr.responseText, xhr);
              }
            }
          }
        }
      };
      if (undefined !== filename) {
        fd.append(varname, file, filename);
      } else {
        fd.append(varname, file);
      }
      if ('object' == typeof extravars) {
        for (var i in extravars) {
          fd.append(i, extravars[i]);
        }
      }
      xhr.send(fd);
    };

    $.set_xhr_post = function (xhr, type, legacyHdrs) {
      var type = ('undefined'==typeof type) ? 'application/x-www-form-urlencoded' : type;
      var legacyHdrs = ('undefined'==typeof type) ? false : legacyHdrs;
      xhr.setRequestHeader('Content-type', type);
      if (legacyHdrs) {
        if (arguments.length > 1) xhr.setRequestHeader('Content-length', arguments[1].length);
        xhr.setRequestHeader('Connection', 'close');
      }
    };

    $.set_headers = function (xhr, hdrs) {
      for(var x in hdrs) {
        xhr.setRequestHeader(x, hdrs[x]);
      }
    };

    // local storage

    $.save_ls = function (k, v) {
      if (undefined !== k && undefined !== v) {
        if ('object' == typeof v) localStorage.setItem(k, JSON.stringify(v));
        else localStorage.setItem(k, v);
      }
    };

    $.unset_ls = function (k) {
      localStorage.setItem(k, null);
    };

    $.load_ls = function (k) {
      return localStorage.getItem(k);
    };

    $.load_bool_ls = function (k) {
      var s = $.load_ls(k);
      return $.strbool(s);
    };

    $.load_int_ls = function (k) {
      var s = $.load_ls(k);
      return ((s !== null && !isNaN(s)) ? $.to_int(s) : 0);
    };

    $.load_float_ls = function (k) {
      var s = $.load_ls(k);
      return ((s !== null && !isNaN(s)) ? parseFloat(s) : 0.0);
    };

    $.load_obj_ls = function (k) {
      var s = $.load_ls(k);
      return ((s !== null && s.indexOf('{') == 0) ? JSON.parse(s) : {});
    };

    $.load_arr_ls = function (k) {
      var s = $.load_ls(k);
      return ((s !== null && s.indexOf('[') == 0) ? JSON.parse(s) : []);
    };

    $.is_ls = function (k) {
      return (undefined !== k && null !== localStorage.getItem(k));
    };

    $.json_decode = function(v) {
      try {
        if ('string' == typeof v && (v.indexOf('{') == 0 || v.indexOf('[') == 0)) return JSON.parse(v);
        else {
          var ob = new Object();
          return ob;
        }
      } catch (e) {
        var ob = new Object();
        return ob;
      }
    };

    // To localize this you must redefine the lib.months | lib.months_short
    $.months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
    $.months_short = ['Янв','Фев','Мар','Апр','Мая','Июн','Июл','Авг','Сен','Окт','Ной','Дек'];
    // format date
    $.dtformat = function (t) {
      if ('undefined' == typeof t) var t = $.ts();
      var d = new Date(t), s = ((d.getDate() < 10) ? ('0' + d.getDate()) : d.getDate()) + '.' + $.months[d.getMonth()] + '.' + d.getFullYear() + '/' +
        ((d.getHours() < 10) ? ('0' + d.getHours()) : d.getHours()) + ':' + ((d.getMinutes() < 10) ? ('0' + d.getMinutes()) : d.getMinutes())
        + ':' + ((d.getSeconds() < 10) ? ('0' + d.getSeconds()) : d.getSeconds());
      return s;
    };
    $.dtf = function (t) {
      if ('undefined' == typeof t) var t = $.ts();
      if ($.is_str(t)) t = $.to_int(t);
      var cd = new Date();
      var d = new Date(t), s = ((d.getDate() < 10) ? ('0' + d.getDate()) : d.getDate()) + ' ' +
        ((arguments.length>1 && arguments[1]) ? $.months[d.getMonth()] : $.months_short[d.getMonth()]);
      if (d.getFullYear() != cd.getFullYear()) {
        s += ' '  + d.getFullYear();
      }
      return s;
    };

    // convert string DD.MM.YYYY date to unix timestamp (seconds since 1970)
    $.dt_to_ts = function (s) {
      if (s === undefined) return 0;
      var s = '' + s;
      var p = s.match(/^(\d+)\.(\d+)\.(\d+)$/), d = new Date();
      if (p) {
        d.setFullYear(p[3]);
        d.setMonth(p[2]);
        d.setDate(p[1]);
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        return d.getTime();
      }
      return 0;
    };

    // convert string YYYY-MM-DD hh:mm:ss date to unix timestamp (seconds since 1970)
    $.sqldate_to_ts = function (s) {
      if (s === undefined) return 0;
      var s = '' + s;
      var p = s.match(/^(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)$/), d = new Date();
      if (!p) p = s.match(/^(\d+)-(\d+)-(\d+)$/);
      if (p) {
        d.setFullYear(p[1]);
        d.setMonth(p[2]);
        d.setDate(p[3]);
        if (p.length > 6) {
          d.setHours(p[4]);
          d.setMinutes(p[5]);
          d.setSeconds(p[6]);
        } else {
          d.setHours(0);
          d.setMinutes(0);
          d.setSeconds(0);
        }
        d.setMilliseconds(0);
        return d.getTime();
      }
      return 0;
    };

    $.sqldate = function (dt) {
      var s = '';
      if ('undefined'==typeof dt) var dt = new Date();
      else if (!(dt instanceof Date)) dt = new Date(dt);
      s += dt.getFullYear();
      s += '-' + ((dt.getMonth() < 9) ? ('0' + (dt.getMonth()+1)) : (dt.getMonth()+1));
      s += '-' + ((dt.getDate() < 10) ? ('0' + dt.getDate()) : dt.getDate());
      if (arguments.length>1 && arguments[1]) {
        s += ' ' + ((dt.getHours() < 10) ? ('0' + dt.getHours()) : dt.getHours());
        s += ':' + ((dt.getMinutes() < 10) ? ('0' + dt.getMinutes()) : dt.getMinutes());
        s += ':' + ((dt.getSeconds() < 10) ? ('0' + dt.getSeconds()) : dt.getSeconds());
      }
      return s;
    };

    $.sqltime = function (dt) {
      var s = '';
      if ('undefined'==typeof dt) var dt = new Date();
      else if (!(dt instanceof Date)) dt = new Date(dt);
      s += ((dt.getHours() < 10) ? ('0' + dt.getHours()) : dt.getHours());
      s += ':' + ((dt.getMinutes() < 10) ? ('0' + dt.getMinutes()) : dt.getMinutes());
      s += ':' + ((dt.getSeconds() < 10) ? ('0' + dt.getSeconds()) : dt.getSeconds());
      return s;
    };

    $.ts_to_sqldate = function(_v) {
      var v = _v || Date.now();
      var d = new Date(v);
      var m = d.getMonth() - 1;
      return d.getFullYear() + '-' +
        ((d.getMonth() + 1 < 10) ? ('0' + (d.getMonth() + 1)) : (d.getMonth() + 1)) + '-' +
        ((d.getDate() < 10) ? ('0' + d.getDate()) : d.getDate()) + ' ' +
        ((d.getHours() < 10) ? ('0' + d.getHours()) : d.getHours()) + ':' +
        ((d.getMinutes() < 10) ? ('0' + d.getMinutes()) : d.getMinutes()) + ':' +
        ((d.getSeconds() < 10) ? ('0' + d.getSeconds()) : d.getSeconds());
    };

    $.leapYear = function(y) {
      return ((y % 4 == 0) && (y % 100 != 0)) || (y % 400 == 0);
    };

    // calculate distance between 2 points
    $.dist = function (x1, y1, x2, y2) {
      if (!isNaN(x1) || !isNaN(x2) || !isNaN(y1) || !isNaN(y2)) return 0;
      return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    };

    // is point belongs to polygon
    $.point_in_poly = function (v, p, is_str, is_verts_arr, p_latlng) {
      if (undefined !== is_str && is_str) v = $.json_decode(v);
      if (undefined !== p_latlng && p_latlng && $.is_obj(p)) {
        if (is_verts_arr)
          p = [p.lat, p.lng];
        else
          p = {x:p.lat, y:p.lng};
      }
      var r = 0, n = v.length;
      if (n) {
        v.push(v[0]);
        var vn,
          cn = 0; // the crossing number counter
        // loop through all edges of the polygon
        for (var i=0; i < n; i++) { // edge from V[i]  to V[i+1]
          if (undefined!==is_verts_arr && is_verts_arr) {
            if (((v[i][1] <= p[1]) && (v[i+1][1] > p[1])) // an upward crossing
              || ((v[i][1] > p[1]) && (v[i+1][1] <= p[1]))) { // a downward crossing
              // compute the actual edge-ray intersect x-coordinate
              vt = (p[1] - v[i][1]) / (v[i+1][1] - v[i][1]);
              if (p[0] < v[i][0] + vt * (v[i+1][0] - v[i][0])) // P.x < intersect
                ++cn; // a valid crossing of y=P.y right of P.x
            }
          } else {
            if (((v[i].y <= p.y) && (v[i+1].y > p.y)) // an upward crossing
              || ((v[i].y > p.y) && (v[i+1].y <= p.y))) { // a downward crossing
              // compute the actual edge-ray intersect x-coordinate
              vt = (p.y - v[i].y) / (v[i+1].y - v[i].y);
              if (p.x < v[i].x + vt * (v[i+1].x - v[i].x)) // P.x < intersect
                ++cn; // a valid crossing of y=P.y right of P.x
            }
          }
        }
        r = cn & 1; // 0 if even (out), and 1 if  odd (in)
      }
      return r;
    };

    /* return bounding rectangle of path
     input: [[lat,lng],...] or [{lat,lng},...]
     output:
     north (0)
     west (1) *********{x2,y2} east (3)
     {x1,y1}********
     south (2)
     */
    $.path_bounds = function (path) {
      var r = [];
      for (var i=0; i<path.length; i++) {
        if (i===0) {
          if ($.is_arr(path[i])) {
            r.push(path[i][0]); //0: y2 (north)
            r.push(path[i][1]); //1: x1 (west)
            r.push(path[i][0]); //2: y1 (south)
            r.push(path[i][1]); //3: x2 (east)
          } else {
            r = { north: path[i].lat, west: path[i].lng, south: path[i].lat, east: path[i].lng };
          }
        } else {
          if ($.is_arr(r)) {
            if (path[i][0] < r[0]) r[0] = path[i][0];
            else if (path[i][0] > r[2]) r[2] = path[i][0];
            if (path[i][1] < r[1]) r[1] = path[i][1];
            else if (path[i][1] > r[3]) r[3] = path[i][1];
          } else {
            if (path[i].lat < r.north) r.north = path[i].lat;
            else if (path[i].lat > r.south) r.south = path[i].lat;
            if (path[i].lng < r.west) r.west = path[i].lng;
            else if (path[i].lng > r.east) r.east = path[i].lng;
          }
        }
      }
      return r;
    };

    //calculate center of path using google LatLngBounds
    $.path_center = function(path, plain) {
      var bounds = new google.maps.LatLngBounds();
      if ($.is_arr(path) && path.length) {
        for (var i = 0; i < path.length; i++) {
          if ('function'==typeof path[i].lat)
            bounds.extend(new google.maps.LatLng(path[i].lat(), path[i].lng()));
          else
            bounds.extend(new google.maps.LatLng(path[i].lat, path[i].lng));
        }
      } else if (lib.is_obj(path) && !lib.is_arr(path)) {
        path.forEach(function(p) {
          bounds.extend(new google.maps.LatLng(p.lat(), p.lng()));
        });
      } else
        return null;
      var c = bounds.getCenter();
      if (undefined!==plain) {
        if (plain == 2)
          return [c.lat(), c.lng()];
        else if (plain)
          return { lat: c.lat(), lng: c.lng() };
        else
          return c;
      } else
        return c;
    };

    //convert mvcarray of google geoobjects to array of arrays[2] or array of {lat,lng}
    $.path_plain = function(obj, latlng) {
      var path = [], pp;
      if ('object' == typeof obj && obj !== null) {
        if ('function' == typeof obj.getPath)
          pp = obj.getPath();
        else pp = obj;
        pp.forEach(function(p) {
          if (undefined!==latlng && latlng)
            path.push({lat:p.lat(), lng:p.lng()});
          else
            path.push([p.lat(), p.lng()]);
        });
      }
      return path;
    };

	// Return a universally unique identifier in form 550e8400-e29b-41d4-a716-446655440000
    $.uuid = function () {
      var s = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };
      return (s() + s() + '-' + s() + '-' + s() + '-' + s() + '-' + s() + s() + s());
    };

    // Return a unique identifier with the given length
    $.uid = function (len) {
      var buf = [], chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', charlen = chars.length,
	  len = (('undefined'==typeof len) ? 32 : len);
      for (var i = 0; i < len; ++i) {
        buf.push(chars[this.rnd_i(0, charlen - 1)]);
      }
      return buf.join('');
    };

    $.base64 = {
      _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
      encode: function (e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = $.base64._utf8_encode(e);
        while (f < e.length) {
          n = e.charCodeAt(f++);
          r = e.charCodeAt(f++);
          i = e.charCodeAt(f++);
          s = n >> 2;
          o = (n & 3) << 4 | r >> 4;
          u = (r & 15) << 2 | i >> 6;
          a = i & 63;
          if (isNaN(r)) {
              u = a = 64
          } else if (isNaN(i)) {
              a = 64
          }
          t = t + $.base64._keyStr.charAt(s) + $.base64._keyStr.charAt(o) + $.base64._keyStr.charAt(u) + $.base64._keyStr.charAt(a)
        }
        return t
      },
      decode: function (e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9+/=]/g, "");
        while (f < e.length) {
          s = $.base64._keyStr.indexOf(e.charAt(f++));
          o = $.base64._keyStr.indexOf(e.charAt(f++));
          u = $.base64._keyStr.indexOf(e.charAt(f++));
          a = $.base64._keyStr.indexOf(e.charAt(f++));
          n = s << 2 | o >> 4;
          r = (o & 15) << 4 | u >> 2;
          i = (u & 3) << 6 | a;
          t = t + String.fromCharCode(n);
          if (u != 64) {
              t = t + String.fromCharCode(r)
          }
          if (a != 64) {
              t = t + String.fromCharCode(i)
          }
        }
        t = $.base64._utf8_decode(t);
        return t
      },
      _utf8_encode: function (e) {
        e = e.replace(/rn/g, "n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
          var r = e.charCodeAt(n);
          if (r < 128) {
            t += String.fromCharCode(r)
          } else if (r > 127 && r < 2048) {
            t += String.fromCharCode(r >> 6 | 192);
            t += String.fromCharCode(r & 63 | 128)
          } else {
            t += String.fromCharCode(r >> 12 | 224);
            t += String.fromCharCode(r >> 6 & 63 | 128);
            t += String.fromCharCode(r & 63 | 128)
          }
        }
        return t
      },
      _utf8_decode: function (e) {
        var t = "";
        var n = 0;
        var r = c1 = c2 = 0;
        while (n < e.length) {
          r = e.charCodeAt(n);
          if (r < 128) {
            t += String.fromCharCode(r);
            n++
          } else if (r > 191 && r < 224) {
            c2 = e.charCodeAt(n + 1);
            t += String.fromCharCode((r & 31) << 6 | c2 & 63);
            n += 2
          } else {
            c2 = e.charCodeAt(n + 1);
            c3 = e.charCodeAt(n + 2);
            t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
            n += 3
          }
        }
        return t
      }
    };

    $.is_email = function(v) {
      if (undefined === v) return false;
      if (!$.is_str(v)) return false;
      var r = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return r.test(v);
    };

    //replace http://-like substrings with <a href>'s
    $.urlify = function (s, blank) {
      return s.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,
        '<a href="$1"' + ((undefined !== blank) ? ' target="blank"' : '') + '>$1</a>');
    };

    // return Dom element width in pixels
    $.w = function (el) {
      if (!el) return 0;
      if (typeof(el.clip) != 'undefined') {
        return el.clip.width;
      } else {
        if (el.style.pixelWidth) {
          return el.style.pixelWidth;
        } else {
          return el.offsetWidth;
        }
      }
    };

    // return Dom element height in pixels
    $.h = function (el) {
      if (!el) return 0;
      if (typeof(el.clip) != 'undefined') {
        return el.clip.height;
      } else {
        if (el.style.pixelHeight) {
          return el.style.pixelHeight;
        } else {
          return el.offsetHeight;
        }
      }
    };

    // return Dom element positions {x,y} in pixels
    $.xy = function (el) {
      var x = 0, y = 0;
      /*while(el && el.tagName != 'BODY') {
       y += el.offsetTop;
       x += el.offsetLeft;
       el = el.offsetParent;
       }*/
      if (el && 'undefined' != typeof el.getBoundingClientRect) {
        var r = el.getBoundingClientRect(),
          scrollTop = document.documentElement.scrollTop ?
            document.documentElement.scrollTop : document.body.scrollTop,
          scrollLeft = document.documentElement.scrollLeft ?
            document.documentElement.scrollLeft : document.body.scrollLeft;
        if (arguments.length > 1 && arguments[1]) {
          x = Math.round(r.left + scrollLeft);
          y = Math.round(r.top + scrollTop);
        } else {
          x = r.left + scrollLeft;
          y = r.top + scrollTop;
        }
      }
      return {'x': x, 'y': y};
    };

    $.pos = function (el) {
      var p = {'x': 0, 'y': 0};
      while (el) {
        p.x += (el.offsetLeft - el.scrollLeft + el.clientLeft);
        p.y += (el.offsetTop - el.scrollTop + el.clientTop);
        el = el.offsetParent;
      }
      return p;
    };

    $.scrollPos = function () {
      return ((document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100);
    };

    // injects view into DOM placeholder
    //example: var view = lib.inflate_view( [ {tag:'CANVAS', atr:{width:100,height:100,style:'background:#000'}} ] );
    $.inflate_view = function (el, vi, op) {
      var i, j, v, isT, isV, r = [];
      //TODO: work in fr = document.createDocumentFragment() than insert it into el
      if (undefined !== vi && $.is_obj(vi)) {
        if (!$.is_arr(vi)) vi = [vi];
        if (undefined !== op && $.is_obj(op) && undefined !== op['clean'] && op.clean && undefined !== el) {
          if ($.is_el(el)) el.innerHTML = '';
        }
        if (!$.is_el(el)) el = document.createDocumentFragment();
        for (i in vi) {
          v = null;
          isT = false;
          isV = false;
          if (undefined !== vi[i]['el'] && $.is_el(vi[i].el)) {
            if (undefined !== op && undefined !== op.dir && op.dir === 'before') {
              el.parentNode.insertBefore(vi[i].el, el);
            } else if (undefined !== op && undefined !== op.dir && op.dir === 'after') {
              el.parentNode.insertBefore(vi[i].el, el.nextSibling);
            } else {
              el.appendChild(vi[i].el);
            }
            vi[i]['skip_c'] = true;
          }
          if (undefined !== vi[i]['html']) {
            if ($.is_str(vi[i].html)) {
              if ($.is_el(el)) el.innerHTML += vi[i].html;
              else {
                v = $.el('DIV');
                v.innerHTML = vi[i].html;
              }
              vi[i]['skip_c'] = true;
            }
          }
          if (undefined === vi[i]['skip_c'] || (undefined !== vi[i].skip_c && vi[i].skip_c)) {
            if ('undefined' != typeof vi[i].ref) {
              v = $.id(vi[i].ref);
              if (null !== v && null !== v.tagName.match(/^INPUT|TEXTAREA$/i)) isV = true;
            } else if ('string' == typeof vi[i].tag) {
              v = $.el(vi[i].tag);
              if (null !== vi[i].tag.match(/^INPUT|TEXTAREA$/i)) isV = true;
              if (vi[i].tag.match(/^SELECT$/i) && undefined !== vi[i]['options']) {
                var okey, oval, oel;
                for (j = 0; j < vi[i].options.length; j++) {
                  for (okey in vi[i].options[j]) {
                    oval = vi[i].options[j][okey];
                    break;
                  }
                  oel = $.el('OPTION', {value: okey}, oval);
                  //oel.value = okey;
                  if (undefined !== vi[i]['selected'] && vi[i].selected == okey) oel.selected = true;
                  v.appendChild(oel);
                }
              }
            } else if ('string' == typeof vi[i].txt) {
              v = document.createTextNode(vi[i].txt);
              isT = true;
            }
            if (v && !isT) { // workaround for google maps api
              if (null !== vi[i].tag.match(/^CANVAS$/i) && 'undefined' != typeof G_vmlCanvasManager)
                G_vmlCanvasManager.initElement(v);
            }
            if (v && 'object' == typeof vi[i].atr) {
              for (j in vi[i].atr) {
                v.setAttribute(j, vi[i].atr[j]);
                if (null !== j.match(/^SC$/i) && 'object' == typeof SC) SC.setSC(v, vi[i].atr[j]);
              }
            }
            if (v && 'object' == typeof vi[i].css) {
              for (j in vi[i].css) {
                v.style[j] = vi[i].css[j];
              }
            }
            if (v && 'object' == typeof vi[i].evn) {
              for (j in vi[i].evn) {
                $.event(v, j, vi[i].evn[j]);
              }
            }
            if ('string' == typeof vi[i].txt && !isT) {
              if (v) {
                if (isV) v.value = vi[i].txt;
                else v.innerHTML = vi[i].txt;
              }
              else {
                if (null !== el.tagName.match(/^INPUT|TEXTAREA$/i)) el.value = vi[i].txt;
                else el.innerHTML = vi[i].txt;
              }
            }
            //TODO: ignore TextNode childs ?
            if (v && 'object' == typeof vi[i].ch && !isT) {
              $.inflate_view(v, vi[i].ch);
            }
            if ('object' == typeof vi[i]['layers'] && !isT) {
              for (j = vi[i].layers.n - 1; j >= 0; j--) {
                var rr = $.inflate_view(el, [{
                  tag: 'CANVAS',
                  atr: {'id': vi[i].layers.ns + j, width: vi[i].layers.w, height: vi[i].layers.h, style: 'display:none'}
                }]);
                if ('function' == typeof vi[i]['layers_ini']) {
                  vi[i].layers_ini.call(this, rr[0], j);
                }
              }
            }
            if ($.is_el(el) && $.is_el(v)) {
              if (undefined !== op && undefined !== op.dir && op.dir === 'before') {
                el.parentNode.insertBefore(v, el)
              } else if (undefined !== op && undefined !== op.dir && op.dir === 'after') {
                el.parentNode.insertBefore(v, el.nextSibling);
              } else if (undefined !== op && undefined !== op.dir && op.dir === 'begin') {
                el.insertBefore(v, el.firstChild);
              } else {
                el.appendChild(v);
              }
            }
            //TODO: need pause after appendChild() ?
          }
          //if($.is_el(v))
          r[i] = v;
          /*if(null===v) {
           if('undefined' != typeof vi[i].ref) {
           v = $.id(vi[i].ref);
           } else {
           v = el;
           }
           }*/
          if ('function' == typeof vi[i].ini) {
            vi[i].ini.call(this, v, vi[i], i, el);
          }
        }
      }
      return r;
    };

    $.serialize_view = function (el, ops) {
      var r = {}, ops = ops || {};
      if ('object' == typeof el) {
        if (el.nodeType == $.NODE_ELEMENT) {
          r['tag'] = el.nodeName;
          r['atr'] = {};
          if (undefined !== el['className'] && el.className.length) r.atr['class'] = el.className;
          if (undefined !== el['id'] && el.id.length) r.atr['id'] = el.id;
          if ('object' == typeof ops['styles']) {
            r.atr['style'] = {};
            for (var i in ops.styles) {
              if (undefined !== el.style[i]) r.atr.style[ops.styles[i]] = el.style[i];
            }
          }
          if (r.tag.match(/^CANVAS$/i)) {
            r.atr['width'] = el.width;
            r.atr['height'] = el.height;
          }
          if (el.hasChildNodes()) {
            r['ch'] = [];
            for (var i in el.childNodes) {
              if (!(el.childNodes[i].nodeType == $.NODE_ELEMENT || el.childNodes[i].nodeType == $.NODE_TEXT)) continue;
              var c = $.serialize_view(el.childNodes[i]);
              if (!$.empty(c)) r['ch'].push(c);
            }
          } else {
            var t = '' + el.innerHTML;
            if (!t.length) t = $.txt(el);
            if (t.length) r['txt'] = t;
          }
        } else if (el.nodeType == $.NODE_TEXT) {
          var t = '' + el.nodeValue;
          t = t.trim();
          if (t.length) r['txt'] = t;
        }
      }
      return r;
    };

// loading media

    //hash of image objects {'path' : Image}
    if ('object' != typeof $.imgs) $.imgs = {};
    if ('object' != typeof $.cnvs) $.cnvs = {};
    if ('object' != typeof $.snds) $.snds = {};

    $.load_img = function (url, id, cb, args) {
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function () {
        if ('function' == typeof cb) {
          if (undefined !== args) {
            cb.call(this, img, id, args, url);
          } else {
            cb.call(this, img, id, null, url);
          }
        }
        // remove event and self to prevent IE on animated gif loops and clear up garbage
        if (img) img = img.onload = img.onabort = img.onerror = null;
      };
      img.src = url;
      if ('object' != typeof $.imgs) $.imgs = {};
      if (!id) id = url;
      $.imgs[id] = img;
    };

    $.load_cnv = function (url, id, cb, args) {
      $.load_img(url, id, function (img) {
        //console.log('load_img', img.width, img.height);
        var c;
        if ('object' == typeof args && args.hasOwnProperty('c')) {
          c = args.c;
        } else {
          c = $.el('canvas');
        }
        var dc = $.d2c(c);
        c.width = img.width;
        c.height = img.height;
        dc.drawImage(img, 0, 0);
        if (undefined === args || (undefined !== args && 'undefined' == typeof args['no_cnvs'])) $.cnvs[id] = c;
        if ('function' == typeof cb) {
          if (undefined !== args) {
            cb.call(this, c, id, args, url);
          } else {
            cb.call(this, c, id, null, url);
          }
        }
      }, args, url);
    };

    $.load_snd = function (url, id) {
      if ('undefined' != typeof Audio) {
        if (undefined === id) id = url;
        else if (null === id) id = url;
        else if ('' == id) id = url;
        $.snds[id] = new Audio(url);
      }
      //log('Audio', $.snds[id]);
    };

    $.load_js = function (uri, onsuccess, onerror, _context, args) {
      var el = $.el('SCRIPT');
      if (undefined === _context) var _context = window;
      else if (!_context) _context = window;
      var a = Array.prototype.slice.call(arguments);
      a.push(uri);
      if (undefined !== args) {
        if (!$.is_arr(args)) args = [args];
        a = a.concat(args);
      }
      if ($.ie) {
        //TODO: how to implement onerror for IE<=10?
        $.event(el, 'readystatechange', function () {
          //console.log('readystatechange', this.readyState, this.status);
          if (this.readyState == 'loaded' || this.readyState == 'completed') {
            //$.event(el, 'readystatechange', function() {
            //    if(this.readyState=='completed') {
            onsuccess.apply(_context, a);
            //    }
            //});
          }
        });
      } else {
        /*$.event(el, 'load', function() {
         onsuccess.apply(_context, a);
         });
         $.event(el, 'error', function() {
         onerror.apply(_context, a);
         });*/
        if ($.is_fun(onsuccess)) $.event(el, 'load', onsuccess);
        if ($.is_fun(onerror)) $.event(el, 'error', onerror);
      }
      if (-1 != uri.search(/^https?\:\/\//i) || 0 == uri.indexOf('/') || 0 == uri.indexOf('.')) {
        el.src = uri;
      } else {
        el.src = '/js/' + uri + '.js';
      }
      document.getElementsByTagName('head')[0].appendChild(el);
    };

    $.load_css = function (uri) {
      var el = $.el('LINK');
      el.type = 'text/css';
      el.rel = 'stylesheet';
      if (-1 != uri.search(/^https?\:\/\//i) || 0 == uri.indexOf('/')) {
        el.href = uri;
      } else {
        var p1 = /^\//, p2 = /\.css$/;
        if (!p1.test(uri)) {
          uri = '/css/' + uri;
        }
        if (!p2.test(uri)) {
          uri += '.css';
        }
        el.href = uri;
      }
      document.getElementsByTagName('head')[0].appendChild(el);
    };

    $.load_assets = function (a, done, donecontext) {
      var r,
        imgdir = ('undefined' == typeof $.imgpath) ? '/img/' : $.imgpath,
        snddir = ('undefined' == typeof $.sndpath) ? '/media/' : $.sndpath;
      if ($.is_obj(a) && !$.is_arr(a)) {
        $._load_a = [];
        if (undefined !== a.js) {
          if ($.is_arr(a.js)) $._load_a.concat(a.js);
          else if ($.is_str(a.js)) $._load_a.push(a.js);
        }
        if (undefined !== a.css) {
          if ($.is_arr(a.css)) $._load_a.concat(a.css);
          else if ($.is_str(a.css)) $._load_a.push(a.css);
        }
        if (undefined !== a.img) {
          if ($.is_arr(a.img)) $._load_a.concat(a.img);
          else if ($.is_str(a.img)) $._load_a.push(a.img);
        }
        if (undefined !== a.cnv) {
          if ($.is_arr(a.cnv)) $._load_a.concat(a.cnv);
          else if ($.is_str(a.cnv)) $._load_a.push(a.cnv);
        }
        if (undefined !== a.snd) {
          if ($.is_arr(a.snd)) $._load_a.concat(a.snd);
          else if ($.is_str(a.snd)) $._load_a.push(a.snd);
        }
      }
      $._load_i = 0;
      $._load_timer = setInterval(function () {
        if ($._load_i >= $._load_a.length) {
          clearInterval($._load_timer);
          if ($._load_vis && $.id($._load_el)) {
            $.id($._load_el).style.display = 'none';
          }
          var c = donecontext || this;
          if ('function' == typeof done) done.call(c);
          else if ('function' == typeof $.on_load_assets) $.on_load_assets.call(c);
        }
      }, 100);
      if ($.is_arr(a)) {
        $._load_a = a;
        for (var i in a) {
          // images
          r = a[i].match(/(.+)\.(gif|jpg|jpeg|png)$/i);
          if (r !== null && r.length > 2) {
            if (0 == a[i].indexOf('*')) {
              //url, id, cb, args
              $.load_cnv(imgdir + a[i].substr(1), r[1].substr(1), function (cnv, id, args, url) {
                if (!cnv) return null;
                $._on_load_asset(url);
              });
            } else {
              //url, id, cb, args
              $.load_img(imgdir + a[i], r[1], function (img, id, args, url) {
                if (!img) return null;
                $._on_load_asset(url);
              });
            }
          } else {
            // sounds
            r = a[i].match(/(.+)\.(wav|ogg|mp3|mid)$/i);
            if (r !== null && r.length > 2) {
              $.load_snd(snddir + a[i], r[1]);
              $._on_load_asset(a[i]);
            } else {
              // javascripts
              if (-1 != a[i].search(/.+\.js$/i)) {
                $.load_js(a[i], function () {
                  $._on_load_asset(a[i]);
                }, function () {
                  $._on_load_asset(a[i]);
                });
              } else {
                // css
                if (-1 != a[i].search(/.+\.css$/i)) {
                  $.load_css(a[i]);
                  $._on_load_asset(a[i]);
                }
              }
            }
          }
        }
      } else if ($.is_obj(a)) {
        if (undefined !== a.js) {
          if ($.is_arr(a.js)) for (var i = 0; i < a.js.length; i++) {
            $.load_js(a.js[i], function () {
              $._on_load_asset(a.js[i]);
            }, function () {
              $._on_load_asset(a.js[i]);
            });
          }
          else if ($.is_str(a.js)) {
            $.load_js(a.js, function () {
              $._on_load_asset(a.js);
            }, function () {
              $._on_load_asset(a.js);
            });
          }
        }
        // a.css
        if (undefined !== a.css) {
          if ($.is_arr(a.css)) for (var i = 0; i < a.css.length; i++) {
            $.load_css(a.css[i]);
            $._on_load_asset(a.css[i]);
          }
          else if ($.is_str(a.css)) {
            $.load_css(a.css);
            $._on_load_asset(a.css);
          }
        }
        if (undefined !== a.css_inline && $.is_arr(a.css_inline)) {
          try {
            var ss = Array.prototype.slice.call(document.styleSheets);
            if (ss.length) {
              var b = [].concat(a.css_inline);
              for (var i = 0; i < ss.length; i++) {
                if (undefined === css.cssRules) continue;
                var rules = Array.prototype.slice.call(css.cssRules);
                for (var j = 0; j < rules.length; j++) {
                  if (undefined === rules[j].cssRule) continue;
                  if (undefined === rules[j].cssRule.cssText) continue;
                  for (var k = 0; k < b.length; k++) {
                    if (b[k] == rules[j].cssRule.cssText) b.splice(k, 1);
                  }
                }
              }
              $.add_css(b);
            } else $.add_css(a.css_inline);
          } catch (_) {
            err('error in $.load_assets', _);
          }
        }
        // a.img
        if (undefined !== a.img) {
          if ($.is_arr(a.img)) for (var i = 0; i < a.img.length; i++) {
            r = a.img[i].match(/(.+)\.(gif|jpg|jpeg|png)$/i);
            r = ((!(r !== null && r.length > 2)) ? r[1] : a.img[i]);
            $.load_img(a.img[i], r, function (img, id, args, url) {
              $._on_load_asset(url);
            });
          }
          else if ($.is_str(a.img)) {
            r = a.img.match(/(.+)\.(gif|jpg|jpeg|png)$/i);
            r = ((!(r !== null && r.length > 2)) ? r[1] : a.img);
            $.load_img(a.img, r, function (img, id, args, url) {
              $._on_load_asset(url);
            });
          }
        }
        // a.cnv
        if (undefined !== a.cnv) {
          if ($.is_arr(a.cnv)) for (var i = 0; i < a.cnv.length; i++) {
            r = a.img[i].match(/(.+)\.(gif|jpg|jpeg|png)$/i);
            r = ((!(r !== null && r.length > 2)) ? r[1] : a.img[i]);
            $.load_cnv(a.cnv[i], r, function (img, id, args, url) {
              $._on_load_asset(url);
            });
          }
          else if ($.is_str(a.cnv)) {
            r = a.img.match(/(.+)\.(gif|jpg|jpeg|png)$/i);
            r = ((!(r !== null && r.length > 2)) ? r[1] : a.img);
            $.load_cnv(a.cnv, r, function (img, id, args, url) {
              $._on_load_asset(url);
            });
          }
        }
        // a.snd
        if (undefined !== a.snd) {
          if ($.is_arr(a.snd)) for (var i = 0; i < a.snd.length; i++) {
            r = a.snd[i].match(/(.+)\.(wav|ogg|mp3|mid)$/i);
            r = ((!(r !== null && r.length > 2)) ? r[1] : a.snd[i]);
            $.load_snd(snddir + a.snd[i], r);
            $._on_load_asset(a.snd[i]);
          }
          else if ($.is_str(a.snd)) {
            r = a.snd.match(/(.+)\.(wav|ogg|mp3|mid)$/i);
            r = ((!(r !== null && r.length > 2)) ? r[1] : a.snd);
            $.load_snd(snddir + a.snd, r);
            $._on_load_asset(a.snd);
          }
        }
      }
    };

    $._on_load_asset = function(u) {
      $._load_i++;
      if( undefined!==$._load_el && $.id($._load_el)) $.id($._load_el).innerHTML = __('Loading') + ' ' + u + '...' + Math.floor((100/$._load_a.length) * $._load_i, 1) + '%';
    };

    // drawing

    $.draw_img = function (img, vc, x, y, w, h, sx, sy, sw, sh) {
      var i = null;
      //console.log(typeof img, img);
      if ('string' == typeof img) {
        if ('undefined' != typeof $.imgs[img]) i = $.imgs[img];
      } else if (null !== img) {
        i = img;
      }
      if (undefined === x) var x = 0;
      if (undefined === y) var y = 0;
      // drawImage( image, sx, sy, sw, sh, dx, dy, dw, dh );
      if ('object' == typeof i && null !== i && 'object' == typeof vc && 'undefined' != typeof vc.drawImage && !isNaN(x) && !isNaN(y)) {
        if (undefined !== w && undefined !== h) {
          if (isNaN(w) || !w) w = i.width;
          if (isNaN(h) || !h) h = i.height;
          if (undefined !== sx && undefined !== sy && !isNaN(sx) && !isNaN(sy)) {
            if (undefined !== sw && undefined !== sh && !isNaN(sw) && !isNaN(sh)) {
              vc.drawImage(i, Math.round(sx), Math.round(sy), Math.round(sw), Math.round(sh), Math.round(x), Math.round(y), Math.round(w), Math.round(h));
            } else {
              vc.drawImage(i, Math.round(sx), Math.round(sy), Math.round(x), Math.round(y), Math.round(w), Math.round(h));
            }
          } else {
            vc.drawImage(i, Math.round(x), Math.round(y), Math.round(w), Math.round(h));
          }
        } else {
          vc.drawImage(i, Math.round(x), Math.round(y));
        }
      }
    };

    $.draw_cnv = function (cnv, vc, x, y, w, h, sx, sy, sw, sh) {
      var c = null;
      if ('string' == typeof cnv) {
        if ('undefined' != typeof $.cnvs[cnv]) c = $.cnvs[cnv];
      } else if (null !== cnv) {
        c = cnv;
      }
      if (undefined === x) var x = 0;
      if (undefined === y) var y = 0;
      // drawImage( image, sx, sy, sw, sh, dx, dy, dw, dh );
      if ('object' == typeof c && null !== c && 'object' == typeof vc && 'undefined' != typeof vc.drawImage && !isNaN(x) && !isNaN(y)) {
        if (undefined !== w && undefined !== h) {
          if (isNaN(w) || !w) w = i.width;
          if (isNaN(h) || !h) h = i.height;
          if (undefined !== sx && undefined !== sy && !isNaN(sx) && !isNaN(sy)) {
            if (undefined !== sw && undefined !== sh && !isNaN(sw) && !isNaN(sh)) {
              vc.drawImage(c, Math.round(sx), Math.round(sy), Math.round(sw), Math.round(sh), Math.round(x), Math.round(y), Math.round(w), Math.round(h));
            } else {
              vc.drawImage(c, Math.round(sx), Math.round(sy), Math.round(w), Math.round(h), Math.round(x), Math.round(y));
            }
          } else {
            vc.drawImage(c, Math.round(x), Math.round(y), Math.round(w), Math.round(h));
          }
        } else {
          vc.drawImage(c, Math.round(x), Math.round(y));
        }
      }
    };

    $.clear_cnv = function (id) {
      var cnv;
      if (undefined !== $.cnvs[id]) {
        cnv = $.cnvs[id];
      } else cnv = $.id(id);
      if (cnv) {
        cnv.width = cnv.width;
      }
    };

// sound api

    $.play_snd = function (id) {
      if ($._is_snds && 'object' == typeof $.snds && undefined !== typeof $.snds[id] &&
        'function' == typeof $.snds[id].play) $.snds[id].play();
    };
    $.stop_snd = function (id) {
      if ('object' == typeof $.snds && 'undefined' != typeof $.snds[id] &&
        'function' == typeof $.snds[id].pause) $.snds[id].pause();
    };

    if ('undefined' == typeof $.ac) {
      try {
        $.ac = new AudioContext();
      } catch (e) {
        //$g.log('Web Audio API is not supported in this browser');
        $.ac = null;
      }
    }

    $.play_syn = function (freq, time, type) {
      if (!$.ac) return;
      var o = $.ac.createOscillator();
      o.frequency.value = freq;
      o.type = ((undefined === type) ? 'square' : type);
      o.connect($.ac.destination);
      o.start(0);
      setTimeout(function () {
        o.stop(0);
        o.disconnect($.ac.destination);
      }, time);
    };

    $._resize = function() {
      if( typeof( window.innerWidth ) == 'number' ) {//Non-IE
        $.ww = window.innerWidth;
        $.wh = window.innerHeight;
      } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {//IE 6+ in 'standards compliant mode'
        $.ww = document.documentElement.clientWidth;
        $.wh = document.documentElement.clientHeight;
      } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {//IE 4 compatible
        $.ww = document.body.clientWidth;
        $.wh = document.body.clientHeight;
      }
    };

    $._keydown = function(e) {
      var e = (window.event || e)
      $.kc = (e.keyCode || e.which);
      $.kALT = (e.altKey || null);
      $.kCTRL = (e.ctrlKey || null);
      $.kSHIFT = (e.shiftKey || null);
    };

    // pub/sub

    $._mq = {};

    $.sub = function (channel, fn) {
      if (!$._mq[channel]) $._mq[channel] = [];
      $._mq[channel].push({context: this, callback: fn});
    };

    $.unsub = function (channel, fn) {
      if (!$._mq.hasOwnProperty(channel)) {
        return false;
      }
      for (var i = 0, len = $._mq[channel].length; i < len; i++) {
        if ($._mq[channel][i].callback === fn) {
          $._mq[channel].splice(i, 1);
          return true;
        }
      }
      return false;
    };

    $.pub = function (channel) {
      if (!$._mq[channel]) return false;
      var args = Array.prototype.slice.call(arguments, 1), i, l;
      for (i = 0, l = $._mq[channel].length; i < l; i++) {
        var subscription = $._mq[channel][i];
        subscription.callback.apply(subscription.context, args);
      }
      return this;
    };

// geo location

    $.geo_loc = function (fn) {
      if ($g.navigator.geolocation) {
        $g.navigator.geolocation.getCurrentPosition(function (e) {
          if (e.coords) fn({lat: e.coords.latitude, lng: e.coords.longitude});
        });
      }
    };

// css anim

    $.ontransend = function (el, fn) {
      el.addEventListener('transitionend', fn, true);
    };

// browsers detection

    $.detect = function() {
      //$['ff'] = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      $.ff = typeof $g.InstallTrigger !== 'undefined'; // Firefox 1.0+
      $.op = !!$g.opera || $g.navigator.userAgent.indexOf(' OPR/') >= 0; // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
      $.sf = $g.Object.prototype.toString.call($g.HTMLElement).indexOf('Constructor') > 0; // At least Safari 3+: "[object HTMLElementConstructor]"
      $.cr = !!$g.chrome && !$.op; // Chrome 1+
      //if(undefined === $['ie'])
      $.ie = /*@cc_on!@*/false || !!$g.document.documentMode; // At least IE6
      $.ie10 = /*@cc_on!@*/false && $g.document.documentMode === 10;
      $.ie11 = $.ie && $g.navigator.userAgent.indexOf('MSIE') == -1;
    };
//namespaces

    $.svgNS = 'http://www.w3.org/2000/svg';
    $.xlinkNS = 'http://www.w3.org/1999/xlink';
    $.xulNS = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';

    return $;
  };

})(window, 'lib');
