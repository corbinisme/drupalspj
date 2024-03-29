// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/string-natural-compare/natural-compare.js":[function(require,module,exports) {
'use strict';

var alphabet;
var alphabetIndexMap;
var alphabetIndexMapLength = 0;

function isNumberCode(code) {
  return code >= 48 && code <= 57;
}

function naturalCompare(a, b) {
  var lengthA = (a += '').length;
  var lengthB = (b += '').length;
  var aIndex = 0;
  var bIndex = 0;

  while (aIndex < lengthA && bIndex < lengthB) {
    var charCodeA = a.charCodeAt(aIndex);
    var charCodeB = b.charCodeAt(bIndex);

    if (isNumberCode(charCodeA)) {
      if (!isNumberCode(charCodeB)) {
        return charCodeA - charCodeB;
      }

      var numStartA = aIndex;
      var numStartB = bIndex;

      while (charCodeA === 48 && ++numStartA < lengthA) {
        charCodeA = a.charCodeAt(numStartA);
      }
      while (charCodeB === 48 && ++numStartB < lengthB) {
        charCodeB = b.charCodeAt(numStartB);
      }

      var numEndA = numStartA;
      var numEndB = numStartB;

      while (numEndA < lengthA && isNumberCode(a.charCodeAt(numEndA))) {
        ++numEndA;
      }
      while (numEndB < lengthB && isNumberCode(b.charCodeAt(numEndB))) {
        ++numEndB;
      }

      var difference = numEndA - numStartA - numEndB + numStartB; // numA length - numB length
      if (difference) {
        return difference;
      }

      while (numStartA < numEndA) {
        difference = a.charCodeAt(numStartA++) - b.charCodeAt(numStartB++);
        if (difference) {
          return difference;
        }
      }

      aIndex = numEndA;
      bIndex = numEndB;
      continue;
    }

    if (charCodeA !== charCodeB) {
      if (
        charCodeA < alphabetIndexMapLength &&
        charCodeB < alphabetIndexMapLength &&
        alphabetIndexMap[charCodeA] !== -1 &&
        alphabetIndexMap[charCodeB] !== -1
      ) {
        return alphabetIndexMap[charCodeA] - alphabetIndexMap[charCodeB];
      }

      return charCodeA - charCodeB;
    }

    ++aIndex;
    ++bIndex;
  }

  if (aIndex >= lengthA && bIndex < lengthB && lengthA >= lengthB) {
    return -1;
  }

  if (bIndex >= lengthB && aIndex < lengthA && lengthB >= lengthA) {
    return 1;
  }

  return lengthA - lengthB;
}

naturalCompare.caseInsensitive = naturalCompare.i = function(a, b) {
  return naturalCompare(('' + a).toLowerCase(), ('' + b).toLowerCase());
};

Object.defineProperties(naturalCompare, {
  alphabet: {
    get: function() {
      return alphabet;
    },

    set: function(value) {
      alphabet = value;
      alphabetIndexMap = [];

      var i = 0;

      if (alphabet) {
        for (; i < alphabet.length; i++) {
          alphabetIndexMap[alphabet.charCodeAt(i)] = i;
        }
      }

      alphabetIndexMapLength = alphabetIndexMap.length;

      for (i = 0; i < alphabetIndexMapLength; i++) {
        if (alphabetIndexMap[i] === undefined) {
          alphabetIndexMap[i] = -1;
        }
      }
    },
  },
});

module.exports = naturalCompare;

},{}],"node_modules/list.js/src/utils/get-by-class.js":[function(require,module,exports) {
/**
 * A cross-browser implementation of getElementsByClass.
 * Heavily based on Dustin Diaz's function: http://dustindiaz.com/getelementsbyclass.
 *
 * Find all elements with class `className` inside `container`.
 * Use `single = true` to increase performance in older browsers
 * when only one element is needed.
 *
 * @param {String} className
 * @param {Element} container
 * @param {Boolean} single
 * @api public
 */

var getElementsByClassName = function (container, className, single) {
  if (single) {
    return container.getElementsByClassName(className)[0];
  } else {
    return container.getElementsByClassName(className);
  }
};
var querySelector = function (container, className, single) {
  className = '.' + className;
  if (single) {
    return container.querySelector(className);
  } else {
    return container.querySelectorAll(className);
  }
};
var polyfill = function (container, className, single) {
  var classElements = [],
    tag = '*';
  var els = container.getElementsByTagName(tag);
  var elsLen = els.length;
  var pattern = new RegExp('(^|\\s)' + className + '(\\s|$)');
  for (var i = 0, j = 0; i < elsLen; i++) {
    if (pattern.test(els[i].className)) {
      if (single) {
        return els[i];
      } else {
        classElements[j] = els[i];
        j++;
      }
    }
  }
  return classElements;
};
module.exports = function () {
  return function (container, className, single, options) {
    options = options || {};
    if (options.test && options.getElementsByClassName || !options.test && document.getElementsByClassName) {
      return getElementsByClassName(container, className, single);
    } else if (options.test && options.querySelector || !options.test && document.querySelector) {
      return querySelector(container, className, single);
    } else {
      return polyfill(container, className, single);
    }
  };
}();
},{}],"node_modules/list.js/src/utils/extend.js":[function(require,module,exports) {
/*
 * Source: https://github.com/segmentio/extend
 */

module.exports = function extend(object) {
  // Takes an unlimited number of extenders.
  var args = Array.prototype.slice.call(arguments, 1);

  // For each extender, copy their properties on our object.
  for (var i = 0, source; source = args[i]; i++) {
    if (!source) continue;
    for (var property in source) {
      object[property] = source[property];
    }
  }
  return object;
};
},{}],"node_modules/list.js/src/utils/index-of.js":[function(require,module,exports) {
var indexOf = [].indexOf;
module.exports = function (arr, obj) {
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0, il = arr.length; i < il; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],"node_modules/list.js/src/utils/to-array.js":[function(require,module,exports) {
/**
 * Source: https://github.com/timoxley/to-array
 *
 * Convert an array-like object into an `Array`.
 * If `collection` is already an `Array`, then will return a clone of `collection`.
 *
 * @param {Array | Mixed} collection An `Array` or array-like object to convert e.g. `arguments` or `NodeList`
 * @return {Array} Naive conversion of `collection` to a new `Array`.
 * @api public
 */

module.exports = function toArray(collection) {
  if (typeof collection === 'undefined') return [];
  if (collection === null) return [null];
  if (collection === window) return [window];
  if (typeof collection === 'string') return [collection];
  if (isArray(collection)) return collection;
  if (typeof collection.length != 'number') return [collection];
  if (typeof collection === 'function' && collection instanceof Function) return [collection];
  var arr = [];
  for (var i = 0, il = collection.length; i < il; i++) {
    if (Object.prototype.hasOwnProperty.call(collection, i) || i in collection) {
      arr.push(collection[i]);
    }
  }
  if (!arr.length) return [];
  return arr;
};
function isArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
}
},{}],"node_modules/list.js/src/utils/events.js":[function(require,module,exports) {
var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
  unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
  prefix = bind !== 'addEventListener' ? 'on' : '',
  toArray = require('./to-array');

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el, NodeList, HTMLCollection or Array
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.bind = function (el, type, fn, capture) {
  el = toArray(el);
  for (var i = 0, il = el.length; i < il; i++) {
    el[i][bind](prefix + type, fn, capture || false);
  }
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el, NodeList, HTMLCollection or Array
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.unbind = function (el, type, fn, capture) {
  el = toArray(el);
  for (var i = 0, il = el.length; i < il; i++) {
    el[i][unbind](prefix + type, fn, capture || false);
  }
};

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * `wait` milliseconds. If `immediate` is true, trigger the function on the
 * leading edge, instead of the trailing.
 *
 * @param {Function} fn
 * @param {Integer} wait
 * @param {Boolean} immediate
 * @api public
 */

exports.debounce = function (fn, wait, immediate) {
  var timeout;
  return wait ? function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) fn.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) fn.apply(context, args);
  } : fn;
};
},{"./to-array":"node_modules/list.js/src/utils/to-array.js"}],"node_modules/list.js/src/utils/to-string.js":[function(require,module,exports) {
module.exports = function (s) {
  s = s === undefined ? '' : s;
  s = s === null ? '' : s;
  s = s.toString();
  return s;
};
},{}],"node_modules/list.js/src/utils/classes.js":[function(require,module,exports) {
/**
 * Module dependencies.
 */

var index = require('./index-of');

/**
 * Whitespace regexp.
 */

var re = /\s+/;

/**
 * toString reference.
 */

var toString = Object.prototype.toString;

/**
 * Wrap `el` in a `ClassList`.
 *
 * @param {Element} el
 * @return {ClassList}
 * @api public
 */

module.exports = function (el) {
  return new ClassList(el);
};

/**
 * Initialize a new ClassList for `el`.
 *
 * @param {Element} el
 * @api private
 */

function ClassList(el) {
  if (!el || !el.nodeType) {
    throw new Error('A DOM element reference is required');
  }
  this.el = el;
  this.list = el.classList;
}

/**
 * Add class `name` if not already present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.add = function (name) {
  // classList
  if (this.list) {
    this.list.add(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (!~i) arr.push(name);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove class `name` when present, or
 * pass a regular expression to remove
 * any which match.
 *
 * @param {String|RegExp} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.remove = function (name) {
  // classList
  if (this.list) {
    this.list.remove(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (~i) arr.splice(i, 1);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Toggle class `name`, can force state via `force`.
 *
 * For browsers that support classList, but do not support `force` yet,
 * the mistake will be detected and corrected.
 *
 * @param {String} name
 * @param {Boolean} force
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.toggle = function (name, force) {
  // classList
  if (this.list) {
    if ('undefined' !== typeof force) {
      if (force !== this.list.toggle(name, force)) {
        this.list.toggle(name); // toggle again to correct
      }
    } else {
      this.list.toggle(name);
    }
    return this;
  }

  // fallback
  if ('undefined' !== typeof force) {
    if (!force) {
      this.remove(name);
    } else {
      this.add(name);
    }
  } else {
    if (this.has(name)) {
      this.remove(name);
    } else {
      this.add(name);
    }
  }
  return this;
};

/**
 * Return an array of classes.
 *
 * @return {Array}
 * @api public
 */

ClassList.prototype.array = function () {
  var className = this.el.getAttribute('class') || '';
  var str = className.replace(/^\s+|\s+$/g, '');
  var arr = str.split(re);
  if ('' === arr[0]) arr.shift();
  return arr;
};

/**
 * Check if class `name` is present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.has = ClassList.prototype.contains = function (name) {
  return this.list ? this.list.contains(name) : !!~index(this.array(), name);
};
},{"./index-of":"node_modules/list.js/src/utils/index-of.js"}],"node_modules/list.js/src/utils/get-attribute.js":[function(require,module,exports) {
/**
 * A cross-browser implementation of getAttribute.
 * Source found here: http://stackoverflow.com/a/3755343/361337 written by Vivin Paliath
 *
 * Return the value for `attr` at `element`.
 *
 * @param {Element} el
 * @param {String} attr
 * @api public
 */

module.exports = function (el, attr) {
  var result = el.getAttribute && el.getAttribute(attr) || null;
  if (!result) {
    var attrs = el.attributes;
    var length = attrs.length;
    for (var i = 0; i < length; i++) {
      if (attrs[i] !== undefined) {
        if (attrs[i].nodeName === attr) {
          result = attrs[i].nodeValue;
        }
      }
    }
  }
  return result;
};
},{}],"node_modules/list.js/src/item.js":[function(require,module,exports) {
module.exports = function (list) {
  return function (initValues, element, notCreate) {
    var item = this;
    this._values = {};
    this.found = false; // Show if list.searched == true and this.found == true
    this.filtered = false; // Show if list.filtered == true and this.filtered == true

    var init = function (initValues, element, notCreate) {
      if (element === undefined) {
        if (notCreate) {
          item.values(initValues, notCreate);
        } else {
          item.values(initValues);
        }
      } else {
        item.elm = element;
        var values = list.templater.get(item, initValues);
        item.values(values);
      }
    };
    this.values = function (newValues, notCreate) {
      if (newValues !== undefined) {
        for (var name in newValues) {
          item._values[name] = newValues[name];
        }
        if (notCreate !== true) {
          list.templater.set(item, item.values());
        }
      } else {
        return item._values;
      }
    };
    this.show = function () {
      list.templater.show(item);
    };
    this.hide = function () {
      list.templater.hide(item);
    };
    this.matching = function () {
      return list.filtered && list.searched && item.found && item.filtered || list.filtered && !list.searched && item.filtered || !list.filtered && list.searched && item.found || !list.filtered && !list.searched;
    };
    this.visible = function () {
      return item.elm && item.elm.parentNode == list.list ? true : false;
    };
    init(initValues, element, notCreate);
  };
};
},{}],"node_modules/list.js/src/add-async.js":[function(require,module,exports) {
module.exports = function (list) {
  var addAsync = function (values, callback, items) {
    var valuesToAdd = values.splice(0, 50);
    items = items || [];
    items = items.concat(list.add(valuesToAdd));
    if (values.length > 0) {
      setTimeout(function () {
        addAsync(values, callback, items);
      }, 1);
    } else {
      list.update();
      callback(items);
    }
  };
  return addAsync;
};
},{}],"node_modules/list.js/src/pagination.js":[function(require,module,exports) {
var classes = require('./utils/classes'),
  events = require('./utils/events'),
  List = require('./index');
module.exports = function (list) {
  var isHidden = false;
  var refresh = function (pagingList, options) {
    if (list.page < 1) {
      list.listContainer.style.display = 'none';
      isHidden = true;
      return;
    } else if (isHidden) {
      list.listContainer.style.display = 'block';
    }
    var item,
      l = list.matchingItems.length,
      index = list.i,
      page = list.page,
      pages = Math.ceil(l / page),
      currentPage = Math.ceil(index / page),
      innerWindow = options.innerWindow || 2,
      left = options.left || options.outerWindow || 0,
      right = options.right || options.outerWindow || 0;
    right = pages - right;
    pagingList.clear();
    for (var i = 1; i <= pages; i++) {
      var className = currentPage === i ? 'active' : '';

      //console.log(i, left, right, currentPage, (currentPage - innerWindow), (currentPage + innerWindow), className);

      if (is.number(i, left, right, currentPage, innerWindow)) {
        item = pagingList.add({
          page: i,
          dotted: false
        })[0];
        if (className) {
          classes(item.elm).add(className);
        }
        item.elm.firstChild.setAttribute('data-i', i);
        item.elm.firstChild.setAttribute('data-page', page);
      } else if (is.dotted(pagingList, i, left, right, currentPage, innerWindow, pagingList.size())) {
        item = pagingList.add({
          page: '...',
          dotted: true
        })[0];
        classes(item.elm).add('disabled');
      }
    }
  };
  var is = {
    number: function (i, left, right, currentPage, innerWindow) {
      return this.left(i, left) || this.right(i, right) || this.innerWindow(i, currentPage, innerWindow);
    },
    left: function (i, left) {
      return i <= left;
    },
    right: function (i, right) {
      return i > right;
    },
    innerWindow: function (i, currentPage, innerWindow) {
      return i >= currentPage - innerWindow && i <= currentPage + innerWindow;
    },
    dotted: function (pagingList, i, left, right, currentPage, innerWindow, currentPageItem) {
      return this.dottedLeft(pagingList, i, left, right, currentPage, innerWindow) || this.dottedRight(pagingList, i, left, right, currentPage, innerWindow, currentPageItem);
    },
    dottedLeft: function (pagingList, i, left, right, currentPage, innerWindow) {
      return i == left + 1 && !this.innerWindow(i, currentPage, innerWindow) && !this.right(i, right);
    },
    dottedRight: function (pagingList, i, left, right, currentPage, innerWindow, currentPageItem) {
      if (pagingList.items[currentPageItem - 1].values().dotted) {
        return false;
      } else {
        return i == right && !this.innerWindow(i, currentPage, innerWindow) && !this.right(i, right);
      }
    }
  };
  return function (options) {
    var pagingList = new List(list.listContainer.id, {
      listClass: options.paginationClass || 'pagination',
      item: options.item || "<li><a class='page' href='#'></a></li>",
      valueNames: ['page', 'dotted'],
      searchClass: 'pagination-search-that-is-not-supposed-to-exist',
      sortClass: 'pagination-sort-that-is-not-supposed-to-exist'
    });
    events.bind(pagingList.listContainer, 'click', function (e) {
      var target = e.target || e.srcElement,
        page = list.utils.getAttribute(target, 'data-page'),
        i = list.utils.getAttribute(target, 'data-i');
      if (i) {
        list.show((i - 1) * page + 1, page);
      }
    });
    list.on('updated', function () {
      refresh(pagingList, options);
    });
    refresh(pagingList, options);
  };
};
},{"./utils/classes":"node_modules/list.js/src/utils/classes.js","./utils/events":"node_modules/list.js/src/utils/events.js","./index":"node_modules/list.js/src/index.js"}],"node_modules/list.js/src/parse.js":[function(require,module,exports) {
module.exports = function (list) {
  var Item = require('./item')(list);
  var getChildren = function (parent) {
    var nodes = parent.childNodes,
      items = [];
    for (var i = 0, il = nodes.length; i < il; i++) {
      // Only textnodes have a data attribute
      if (nodes[i].data === undefined) {
        items.push(nodes[i]);
      }
    }
    return items;
  };
  var parse = function (itemElements, valueNames) {
    for (var i = 0, il = itemElements.length; i < il; i++) {
      list.items.push(new Item(valueNames, itemElements[i]));
    }
  };
  var parseAsync = function (itemElements, valueNames) {
    var itemsToIndex = itemElements.splice(0, 50); // TODO: If < 100 items, what happens in IE etc?
    parse(itemsToIndex, valueNames);
    if (itemElements.length > 0) {
      setTimeout(function () {
        parseAsync(itemElements, valueNames);
      }, 1);
    } else {
      list.update();
      list.trigger('parseComplete');
    }
  };
  list.handlers.parseComplete = list.handlers.parseComplete || [];
  return function () {
    var itemsToIndex = getChildren(list.list),
      valueNames = list.valueNames;
    if (list.indexAsync) {
      parseAsync(itemsToIndex, valueNames);
    } else {
      parse(itemsToIndex, valueNames);
    }
  };
};
},{"./item":"node_modules/list.js/src/item.js"}],"node_modules/list.js/src/templater.js":[function(require,module,exports) {
var Templater = function (list) {
  var createItem,
    templater = this;
  var init = function () {
    var itemSource;
    if (typeof list.item === 'function') {
      createItem = function (values) {
        var item = list.item(values);
        return getItemSource(item);
      };
      return;
    }
    if (typeof list.item === 'string') {
      if (list.item.indexOf('<') === -1) {
        itemSource = document.getElementById(list.item);
      } else {
        itemSource = getItemSource(list.item);
      }
    } else {
      /* If item source does not exists, use the first item in list as
      source for new items */
      itemSource = getFirstListItem();
    }
    if (!itemSource) {
      throw new Error("The list needs to have at least one item on init otherwise you'll have to add a template.");
    }
    itemSource = createCleanTemplateItem(itemSource, list.valueNames);
    createItem = function () {
      return itemSource.cloneNode(true);
    };
  };
  var createCleanTemplateItem = function (templateNode, valueNames) {
    var el = templateNode.cloneNode(true);
    el.removeAttribute('id');
    for (var i = 0, il = valueNames.length; i < il; i++) {
      var elm = undefined,
        valueName = valueNames[i];
      if (valueName.data) {
        for (var j = 0, jl = valueName.data.length; j < jl; j++) {
          el.setAttribute('data-' + valueName.data[j], '');
        }
      } else if (valueName.attr && valueName.name) {
        elm = list.utils.getByClass(el, valueName.name, true);
        if (elm) {
          elm.setAttribute(valueName.attr, '');
        }
      } else {
        elm = list.utils.getByClass(el, valueName, true);
        if (elm) {
          elm.innerHTML = '';
        }
      }
    }
    return el;
  };
  var getFirstListItem = function () {
    var nodes = list.list.childNodes;
    for (var i = 0, il = nodes.length; i < il; i++) {
      // Only textnodes have a data attribute
      if (nodes[i].data === undefined) {
        return nodes[i].cloneNode(true);
      }
    }
    return undefined;
  };
  var getItemSource = function (itemHTML) {
    if (typeof itemHTML !== 'string') return undefined;
    if (/<tr[\s>]/g.exec(itemHTML)) {
      var tbody = document.createElement('tbody');
      tbody.innerHTML = itemHTML;
      return tbody.firstElementChild;
    } else if (itemHTML.indexOf('<') !== -1) {
      var div = document.createElement('div');
      div.innerHTML = itemHTML;
      return div.firstElementChild;
    }
    return undefined;
  };
  var getValueName = function (name) {
    for (var i = 0, il = list.valueNames.length; i < il; i++) {
      var valueName = list.valueNames[i];
      if (valueName.data) {
        var data = valueName.data;
        for (var j = 0, jl = data.length; j < jl; j++) {
          if (data[j] === name) {
            return {
              data: name
            };
          }
        }
      } else if (valueName.attr && valueName.name && valueName.name == name) {
        return valueName;
      } else if (valueName === name) {
        return name;
      }
    }
  };
  var setValue = function (item, name, value) {
    var elm = undefined,
      valueName = getValueName(name);
    if (!valueName) return;
    if (valueName.data) {
      item.elm.setAttribute('data-' + valueName.data, value);
    } else if (valueName.attr && valueName.name) {
      elm = list.utils.getByClass(item.elm, valueName.name, true);
      if (elm) {
        elm.setAttribute(valueName.attr, value);
      }
    } else {
      elm = list.utils.getByClass(item.elm, valueName, true);
      if (elm) {
        elm.innerHTML = value;
      }
    }
  };
  this.get = function (item, valueNames) {
    templater.create(item);
    var values = {};
    for (var i = 0, il = valueNames.length; i < il; i++) {
      var elm = undefined,
        valueName = valueNames[i];
      if (valueName.data) {
        for (var j = 0, jl = valueName.data.length; j < jl; j++) {
          values[valueName.data[j]] = list.utils.getAttribute(item.elm, 'data-' + valueName.data[j]);
        }
      } else if (valueName.attr && valueName.name) {
        elm = list.utils.getByClass(item.elm, valueName.name, true);
        values[valueName.name] = elm ? list.utils.getAttribute(elm, valueName.attr) : '';
      } else {
        elm = list.utils.getByClass(item.elm, valueName, true);
        values[valueName] = elm ? elm.innerHTML : '';
      }
    }
    return values;
  };
  this.set = function (item, values) {
    if (!templater.create(item)) {
      for (var v in values) {
        if (values.hasOwnProperty(v)) {
          setValue(item, v, values[v]);
        }
      }
    }
  };
  this.create = function (item) {
    if (item.elm !== undefined) {
      return false;
    }
    item.elm = createItem(item.values());
    templater.set(item, item.values());
    return true;
  };
  this.remove = function (item) {
    if (item.elm.parentNode === list.list) {
      list.list.removeChild(item.elm);
    }
  };
  this.show = function (item) {
    templater.create(item);
    list.list.appendChild(item.elm);
  };
  this.hide = function (item) {
    if (item.elm !== undefined && item.elm.parentNode === list.list) {
      list.list.removeChild(item.elm);
    }
  };
  this.clear = function () {
    /* .innerHTML = ''; fucks up IE */
    if (list.list.hasChildNodes()) {
      while (list.list.childNodes.length >= 1) {
        list.list.removeChild(list.list.firstChild);
      }
    }
  };
  init();
};
module.exports = function (list) {
  return new Templater(list);
};
},{}],"node_modules/list.js/src/search.js":[function(require,module,exports) {
module.exports = function (list) {
  var item, text, columns, searchString, customSearch;
  var prepare = {
    resetList: function () {
      list.i = 1;
      list.templater.clear();
      customSearch = undefined;
    },
    setOptions: function (args) {
      if (args.length == 2 && args[1] instanceof Array) {
        columns = args[1];
      } else if (args.length == 2 && typeof args[1] == 'function') {
        columns = undefined;
        customSearch = args[1];
      } else if (args.length == 3) {
        columns = args[1];
        customSearch = args[2];
      } else {
        columns = undefined;
      }
    },
    setColumns: function () {
      if (list.items.length === 0) return;
      if (columns === undefined) {
        columns = list.searchColumns === undefined ? prepare.toArray(list.items[0].values()) : list.searchColumns;
      }
    },
    setSearchString: function (s) {
      s = list.utils.toString(s).toLowerCase();
      s = s.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&'); // Escape regular expression characters
      searchString = s;
    },
    toArray: function (values) {
      var tmpColumn = [];
      for (var name in values) {
        tmpColumn.push(name);
      }
      return tmpColumn;
    }
  };
  var search = {
    list: function () {
      // Extract quoted phrases "word1 word2" from original searchString
      // searchString is converted to lowercase by List.js
      var words = [],
        phrase,
        ss = searchString;
      while ((phrase = ss.match(/"([^"]+)"/)) !== null) {
        words.push(phrase[1]);
        ss = ss.substring(0, phrase.index) + ss.substring(phrase.index + phrase[0].length);
      }
      // Get remaining space-separated words (if any)
      ss = ss.trim();
      if (ss.length) words = words.concat(ss.split(/\s+/));
      for (var k = 0, kl = list.items.length; k < kl; k++) {
        var item = list.items[k];
        item.found = false;
        if (!words.length) continue;
        for (var i = 0, il = words.length; i < il; i++) {
          var word_found = false;
          for (var j = 0, jl = columns.length; j < jl; j++) {
            var values = item.values(),
              column = columns[j];
            if (values.hasOwnProperty(column) && values[column] !== undefined && values[column] !== null) {
              var text = typeof values[column] !== 'string' ? values[column].toString() : values[column];
              if (text.toLowerCase().indexOf(words[i]) !== -1) {
                // word found, so no need to check it against any other columns
                word_found = true;
                break;
              }
            }
          }
          // this word not found? no need to check any other words, the item cannot match
          if (!word_found) break;
        }
        item.found = word_found;
      }
    },
    // Removed search.item() and search.values()
    reset: function () {
      list.reset.search();
      list.searched = false;
    }
  };
  var searchMethod = function (str) {
    list.trigger('searchStart');
    prepare.resetList();
    prepare.setSearchString(str);
    prepare.setOptions(arguments); // str, cols|searchFunction, searchFunction
    prepare.setColumns();
    if (searchString === '') {
      search.reset();
    } else {
      list.searched = true;
      if (customSearch) {
        customSearch(searchString, columns);
      } else {
        search.list();
      }
    }
    list.update();
    list.trigger('searchComplete');
    return list.visibleItems;
  };
  list.handlers.searchStart = list.handlers.searchStart || [];
  list.handlers.searchComplete = list.handlers.searchComplete || [];
  list.utils.events.bind(list.utils.getByClass(list.listContainer, list.searchClass), 'keyup', list.utils.events.debounce(function (e) {
    var target = e.target || e.srcElement,
      // IE have srcElement
      alreadyCleared = target.value === '' && !list.searched;
    if (!alreadyCleared) {
      // If oninput already have resetted the list, do nothing
      searchMethod(target.value);
    }
  }, list.searchDelay));

  // Used to detect click on HTML5 clear button
  list.utils.events.bind(list.utils.getByClass(list.listContainer, list.searchClass), 'input', function (e) {
    var target = e.target || e.srcElement;
    if (target.value === '') {
      searchMethod('');
    }
  });
  return searchMethod;
};
},{}],"node_modules/list.js/src/filter.js":[function(require,module,exports) {
module.exports = function (list) {
  // Add handlers
  list.handlers.filterStart = list.handlers.filterStart || [];
  list.handlers.filterComplete = list.handlers.filterComplete || [];
  return function (filterFunction) {
    list.trigger('filterStart');
    list.i = 1; // Reset paging
    list.reset.filter();
    if (filterFunction === undefined) {
      list.filtered = false;
    } else {
      list.filtered = true;
      var is = list.items;
      for (var i = 0, il = is.length; i < il; i++) {
        var item = is[i];
        if (filterFunction(item)) {
          item.filtered = true;
        } else {
          item.filtered = false;
        }
      }
    }
    list.update();
    list.trigger('filterComplete');
    return list.visibleItems;
  };
};
},{}],"node_modules/list.js/src/sort.js":[function(require,module,exports) {
module.exports = function (list) {
  var buttons = {
    els: undefined,
    clear: function () {
      for (var i = 0, il = buttons.els.length; i < il; i++) {
        list.utils.classes(buttons.els[i]).remove('asc');
        list.utils.classes(buttons.els[i]).remove('desc');
      }
    },
    getOrder: function (btn) {
      var predefinedOrder = list.utils.getAttribute(btn, 'data-order');
      if (predefinedOrder == 'asc' || predefinedOrder == 'desc') {
        return predefinedOrder;
      } else if (list.utils.classes(btn).has('desc')) {
        return 'asc';
      } else if (list.utils.classes(btn).has('asc')) {
        return 'desc';
      } else {
        return 'asc';
      }
    },
    getInSensitive: function (btn, options) {
      var insensitive = list.utils.getAttribute(btn, 'data-insensitive');
      if (insensitive === 'false') {
        options.insensitive = false;
      } else {
        options.insensitive = true;
      }
    },
    setOrder: function (options) {
      for (var i = 0, il = buttons.els.length; i < il; i++) {
        var btn = buttons.els[i];
        if (list.utils.getAttribute(btn, 'data-sort') !== options.valueName) {
          continue;
        }
        var predefinedOrder = list.utils.getAttribute(btn, 'data-order');
        if (predefinedOrder == 'asc' || predefinedOrder == 'desc') {
          if (predefinedOrder == options.order) {
            list.utils.classes(btn).add(options.order);
          }
        } else {
          list.utils.classes(btn).add(options.order);
        }
      }
    }
  };
  var sort = function () {
    list.trigger('sortStart');
    var options = {};
    var target = arguments[0].currentTarget || arguments[0].srcElement || undefined;
    if (target) {
      options.valueName = list.utils.getAttribute(target, 'data-sort');
      buttons.getInSensitive(target, options);
      options.order = buttons.getOrder(target);
    } else {
      options = arguments[1] || options;
      options.valueName = arguments[0];
      options.order = options.order || 'asc';
      options.insensitive = typeof options.insensitive == 'undefined' ? true : options.insensitive;
    }
    buttons.clear();
    buttons.setOrder(options);

    // caseInsensitive
    // alphabet
    var customSortFunction = options.sortFunction || list.sortFunction || null,
      multi = options.order === 'desc' ? -1 : 1,
      sortFunction;
    if (customSortFunction) {
      sortFunction = function (itemA, itemB) {
        return customSortFunction(itemA, itemB, options) * multi;
      };
    } else {
      sortFunction = function (itemA, itemB) {
        var sort = list.utils.naturalSort;
        sort.alphabet = list.alphabet || options.alphabet || undefined;
        if (!sort.alphabet && options.insensitive) {
          sort = list.utils.naturalSort.caseInsensitive;
        }
        return sort(itemA.values()[options.valueName], itemB.values()[options.valueName]) * multi;
      };
    }
    list.items.sort(sortFunction);
    list.update();
    list.trigger('sortComplete');
  };

  // Add handlers
  list.handlers.sortStart = list.handlers.sortStart || [];
  list.handlers.sortComplete = list.handlers.sortComplete || [];
  buttons.els = list.utils.getByClass(list.listContainer, list.sortClass);
  list.utils.events.bind(buttons.els, 'click', sort);
  list.on('searchStart', buttons.clear);
  list.on('filterStart', buttons.clear);
  return sort;
};
},{}],"node_modules/list.js/src/utils/fuzzy.js":[function(require,module,exports) {
module.exports = function (text, pattern, options) {
  // Aproximately where in the text is the pattern expected to be found?
  var Match_Location = options.location || 0;

  //Determines how close the match must be to the fuzzy location (specified above). An exact letter match which is 'distance' characters away from the fuzzy location would score as a complete mismatch. A distance of '0' requires the match be at the exact location specified, a threshold of '1000' would require a perfect match to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
  var Match_Distance = options.distance || 100;

  // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match (of both letters and location), a threshold of '1.0' would match anything.
  var Match_Threshold = options.threshold || 0.4;
  if (pattern === text) return true; // Exact match
  if (pattern.length > 32) return false; // This algorithm cannot be used

  // Set starting location at beginning text and initialise the alphabet.
  var loc = Match_Location,
    s = function () {
      var q = {},
        i;
      for (i = 0; i < pattern.length; i++) {
        q[pattern.charAt(i)] = 0;
      }
      for (i = 0; i < pattern.length; i++) {
        q[pattern.charAt(i)] |= 1 << pattern.length - i - 1;
      }
      return q;
    }();

  // Compute and return the score for a match with e errors and x location.
  // Accesses loc and pattern through being a closure.

  function match_bitapScore_(e, x) {
    var accuracy = e / pattern.length,
      proximity = Math.abs(loc - x);
    if (!Match_Distance) {
      // Dodge divide by zero error.
      return proximity ? 1.0 : accuracy;
    }
    return accuracy + proximity / Match_Distance;
  }
  var score_threshold = Match_Threshold,
    // Highest score beyond which we give up.
    best_loc = text.indexOf(pattern, loc); // Is there a nearby exact match? (speedup)

  if (best_loc != -1) {
    score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
    // What about in the other direction? (speedup)
    best_loc = text.lastIndexOf(pattern, loc + pattern.length);
    if (best_loc != -1) {
      score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
    }
  }

  // Initialise the bit arrays.
  var matchmask = 1 << pattern.length - 1;
  best_loc = -1;
  var bin_min, bin_mid;
  var bin_max = pattern.length + text.length;
  var last_rd;
  for (var d = 0; d < pattern.length; d++) {
    // Scan for the best match; each iteration allows for one more error.
    // Run a binary search to determine how far from 'loc' we can stray at this
    // error level.
    bin_min = 0;
    bin_mid = bin_max;
    while (bin_min < bin_mid) {
      if (match_bitapScore_(d, loc + bin_mid) <= score_threshold) {
        bin_min = bin_mid;
      } else {
        bin_max = bin_mid;
      }
      bin_mid = Math.floor((bin_max - bin_min) / 2 + bin_min);
    }
    // Use the result from this iteration as the maximum for the next.
    bin_max = bin_mid;
    var start = Math.max(1, loc - bin_mid + 1);
    var finish = Math.min(loc + bin_mid, text.length) + pattern.length;
    var rd = Array(finish + 2);
    rd[finish + 1] = (1 << d) - 1;
    for (var j = finish; j >= start; j--) {
      // The alphabet (s) is a sparse hash, so the following line generates
      // warnings.
      var charMatch = s[text.charAt(j - 1)];
      if (d === 0) {
        // First pass: exact match.
        rd[j] = (rd[j + 1] << 1 | 1) & charMatch;
      } else {
        // Subsequent passes: fuzzy match.
        rd[j] = (rd[j + 1] << 1 | 1) & charMatch | ((last_rd[j + 1] | last_rd[j]) << 1 | 1) | last_rd[j + 1];
      }
      if (rd[j] & matchmask) {
        var score = match_bitapScore_(d, j - 1);
        // This match will almost certainly be better than any existing match.
        // But check anyway.
        if (score <= score_threshold) {
          // Told you so.
          score_threshold = score;
          best_loc = j - 1;
          if (best_loc > loc) {
            // When passing loc, don't exceed our current distance from loc.
            start = Math.max(1, 2 * loc - best_loc);
          } else {
            // Already passed loc, downhill from here on in.
            break;
          }
        }
      }
    }
    // No hope for a (better) match at greater error levels.
    if (match_bitapScore_(d + 1, loc) > score_threshold) {
      break;
    }
    last_rd = rd;
  }
  return best_loc < 0 ? false : true;
};
},{}],"node_modules/list.js/src/fuzzy-search.js":[function(require,module,exports) {
var classes = require('./utils/classes'),
  events = require('./utils/events'),
  extend = require('./utils/extend'),
  toString = require('./utils/to-string'),
  getByClass = require('./utils/get-by-class'),
  fuzzy = require('./utils/fuzzy');
module.exports = function (list, options) {
  options = options || {};
  options = extend({
    location: 0,
    distance: 100,
    threshold: 0.4,
    multiSearch: true,
    searchClass: 'fuzzy-search'
  }, options);
  var fuzzySearch = {
    search: function (searchString, columns) {
      // Substract arguments from the searchString or put searchString as only argument
      var searchArguments = options.multiSearch ? searchString.replace(/ +$/, '').split(/ +/) : [searchString];
      for (var k = 0, kl = list.items.length; k < kl; k++) {
        fuzzySearch.item(list.items[k], columns, searchArguments);
      }
    },
    item: function (item, columns, searchArguments) {
      var found = true;
      for (var i = 0; i < searchArguments.length; i++) {
        var foundArgument = false;
        for (var j = 0, jl = columns.length; j < jl; j++) {
          if (fuzzySearch.values(item.values(), columns[j], searchArguments[i])) {
            foundArgument = true;
          }
        }
        if (!foundArgument) {
          found = false;
        }
      }
      item.found = found;
    },
    values: function (values, value, searchArgument) {
      if (values.hasOwnProperty(value)) {
        var text = toString(values[value]).toLowerCase();
        if (fuzzy(text, searchArgument, options)) {
          return true;
        }
      }
      return false;
    }
  };
  events.bind(getByClass(list.listContainer, options.searchClass), 'keyup', list.utils.events.debounce(function (e) {
    var target = e.target || e.srcElement; // IE have srcElement
    list.search(target.value, fuzzySearch.search);
  }, list.searchDelay));
  return function (str, columns) {
    list.search(str, columns, fuzzySearch.search);
  };
};
},{"./utils/classes":"node_modules/list.js/src/utils/classes.js","./utils/events":"node_modules/list.js/src/utils/events.js","./utils/extend":"node_modules/list.js/src/utils/extend.js","./utils/to-string":"node_modules/list.js/src/utils/to-string.js","./utils/get-by-class":"node_modules/list.js/src/utils/get-by-class.js","./utils/fuzzy":"node_modules/list.js/src/utils/fuzzy.js"}],"node_modules/list.js/src/index.js":[function(require,module,exports) {
var naturalSort = require('string-natural-compare'),
  getByClass = require('./utils/get-by-class'),
  extend = require('./utils/extend'),
  indexOf = require('./utils/index-of'),
  events = require('./utils/events'),
  toString = require('./utils/to-string'),
  classes = require('./utils/classes'),
  getAttribute = require('./utils/get-attribute'),
  toArray = require('./utils/to-array');
module.exports = function (id, options, values) {
  var self = this,
    init,
    Item = require('./item')(self),
    addAsync = require('./add-async')(self),
    initPagination = require('./pagination')(self);
  init = {
    start: function () {
      self.listClass = 'list';
      self.searchClass = 'search';
      self.sortClass = 'sort';
      self.page = 10000;
      self.i = 1;
      self.items = [];
      self.visibleItems = [];
      self.matchingItems = [];
      self.searched = false;
      self.filtered = false;
      self.searchColumns = undefined;
      self.searchDelay = 0;
      self.handlers = {
        updated: []
      };
      self.valueNames = [];
      self.utils = {
        getByClass: getByClass,
        extend: extend,
        indexOf: indexOf,
        events: events,
        toString: toString,
        naturalSort: naturalSort,
        classes: classes,
        getAttribute: getAttribute,
        toArray: toArray
      };
      self.utils.extend(self, options);
      self.listContainer = typeof id === 'string' ? document.getElementById(id) : id;
      if (!self.listContainer) {
        return;
      }
      self.list = getByClass(self.listContainer, self.listClass, true);
      self.parse = require('./parse')(self);
      self.templater = require('./templater')(self);
      self.search = require('./search')(self);
      self.filter = require('./filter')(self);
      self.sort = require('./sort')(self);
      self.fuzzySearch = require('./fuzzy-search')(self, options.fuzzySearch);
      this.handlers();
      this.items();
      this.pagination();
      self.update();
    },
    handlers: function () {
      for (var handler in self.handlers) {
        if (self[handler] && self.handlers.hasOwnProperty(handler)) {
          self.on(handler, self[handler]);
        }
      }
    },
    items: function () {
      self.parse(self.list);
      if (values !== undefined) {
        self.add(values);
      }
    },
    pagination: function () {
      if (options.pagination !== undefined) {
        if (options.pagination === true) {
          options.pagination = [{}];
        }
        if (options.pagination[0] === undefined) {
          options.pagination = [options.pagination];
        }
        for (var i = 0, il = options.pagination.length; i < il; i++) {
          initPagination(options.pagination[i]);
        }
      }
    }
  };

  /*
   * Re-parse the List, use if html have changed
   */
  this.reIndex = function () {
    self.items = [];
    self.visibleItems = [];
    self.matchingItems = [];
    self.searched = false;
    self.filtered = false;
    self.parse(self.list);
  };
  this.toJSON = function () {
    var json = [];
    for (var i = 0, il = self.items.length; i < il; i++) {
      json.push(self.items[i].values());
    }
    return json;
  };

  /*
   * Add object to list
   */
  this.add = function (values, callback) {
    if (values.length === 0) {
      return;
    }
    if (callback) {
      addAsync(values.slice(0), callback);
      return;
    }
    var added = [],
      notCreate = false;
    if (values[0] === undefined) {
      values = [values];
    }
    for (var i = 0, il = values.length; i < il; i++) {
      var item = null;
      notCreate = self.items.length > self.page ? true : false;
      item = new Item(values[i], undefined, notCreate);
      self.items.push(item);
      added.push(item);
    }
    self.update();
    return added;
  };
  this.show = function (i, page) {
    this.i = i;
    this.page = page;
    self.update();
    return self;
  };

  /* Removes object from list.
   * Loops through the list and removes objects where
   * property "valuename" === value
   */
  this.remove = function (valueName, value, options) {
    var found = 0;
    for (var i = 0, il = self.items.length; i < il; i++) {
      if (self.items[i].values()[valueName] == value) {
        self.templater.remove(self.items[i], options);
        self.items.splice(i, 1);
        il--;
        i--;
        found++;
      }
    }
    self.update();
    return found;
  };

  /* Gets the objects in the list which
   * property "valueName" === value
   */
  this.get = function (valueName, value) {
    var matchedItems = [];
    for (var i = 0, il = self.items.length; i < il; i++) {
      var item = self.items[i];
      if (item.values()[valueName] == value) {
        matchedItems.push(item);
      }
    }
    return matchedItems;
  };

  /*
   * Get size of the list
   */
  this.size = function () {
    return self.items.length;
  };

  /*
   * Removes all items from the list
   */
  this.clear = function () {
    self.templater.clear();
    self.items = [];
    return self;
  };
  this.on = function (event, callback) {
    self.handlers[event].push(callback);
    return self;
  };
  this.off = function (event, callback) {
    var e = self.handlers[event];
    var index = indexOf(e, callback);
    if (index > -1) {
      e.splice(index, 1);
    }
    return self;
  };
  this.trigger = function (event) {
    var i = self.handlers[event].length;
    while (i--) {
      self.handlers[event][i](self);
    }
    return self;
  };
  this.reset = {
    filter: function () {
      var is = self.items,
        il = is.length;
      while (il--) {
        is[il].filtered = false;
      }
      return self;
    },
    search: function () {
      var is = self.items,
        il = is.length;
      while (il--) {
        is[il].found = false;
      }
      return self;
    }
  };
  this.update = function () {
    var is = self.items,
      il = is.length;
    self.visibleItems = [];
    self.matchingItems = [];
    self.templater.clear();
    for (var i = 0; i < il; i++) {
      if (is[i].matching() && self.matchingItems.length + 1 >= self.i && self.visibleItems.length < self.page) {
        is[i].show();
        self.visibleItems.push(is[i]);
        self.matchingItems.push(is[i]);
      } else if (is[i].matching()) {
        self.matchingItems.push(is[i]);
        is[i].hide();
      } else {
        is[i].hide();
      }
    }
    self.trigger('updated');
    return self;
  };
  init.start();
};
},{"string-natural-compare":"node_modules/string-natural-compare/natural-compare.js","./utils/get-by-class":"node_modules/list.js/src/utils/get-by-class.js","./utils/extend":"node_modules/list.js/src/utils/extend.js","./utils/index-of":"node_modules/list.js/src/utils/index-of.js","./utils/events":"node_modules/list.js/src/utils/events.js","./utils/to-string":"node_modules/list.js/src/utils/to-string.js","./utils/classes":"node_modules/list.js/src/utils/classes.js","./utils/get-attribute":"node_modules/list.js/src/utils/get-attribute.js","./utils/to-array":"node_modules/list.js/src/utils/to-array.js","./item":"node_modules/list.js/src/item.js","./add-async":"node_modules/list.js/src/add-async.js","./pagination":"node_modules/list.js/src/pagination.js","./parse":"node_modules/list.js/src/parse.js","./templater":"node_modules/list.js/src/templater.js","./search":"node_modules/list.js/src/search.js","./filter":"node_modules/list.js/src/filter.js","./sort":"node_modules/list.js/src/sort.js","./fuzzy-search":"node_modules/list.js/src/fuzzy-search.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

var _list = _interopRequireDefault(require("list.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var dog = {
  target: null,
  data: null,
  init: function init() {
    dog.target = document.getElementById("leaderboardDOG");
    dog.getData();
  },
  getData: function getData() {
    var url = "https://dog.spjnetwork.org/dog-leaderboard-feed-js.php";
    fetch(url).then(function (resp) {
      return resp.text();
    }).then(function (str) {
      return new window.DOMParser().parseFromString(str, "text/xml");
    }).then(function (data) {
      dog.data = [];
      data.querySelectorAll("items item").forEach(function (item) {
        var temp = {};
        var code = item.getElementsByTagName("affinitycode")[0].innerHTML;
        if (code == "") {
          code = " ";
        }
        temp['guid'] = item.getElementsByTagName("GUID")[0].innerHTML;
        temp['name'] = item.getElementsByTagName("title")[0].innerHTML;
        temp['donation'] = item.getElementsByTagName("donation")[0].innerHTML;
        temp['code'] = code;
        dog.data.push(temp);
      });
      dog.buildDisplay();
    });
  },
  getDollarFormat: function getDollarFormat(val) {
    var formattedTotal = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(val);
    return formattedTotal;
  },
  buildDisplay: function buildDisplay() {
    var template = "   \n      ";
    dog.data.forEach(function (row) {
      template += "<tr class=''>\n            <td class='name'>".concat(row.name, "</td>\n            <td class='donation' data-total=\"").concat(row.donation, "\">").concat(dog.getDollarFormat(row.donation), "</td>\n            <td class='code'><a href='javascript:window.loadSearch(\"").concat(row.code, "\")'>").concat(row.code, "</a></td>\n          </tr>");
    });
    template += "";
    dog.target.innerHTML = template;
    var tfoot = document.createElement("tfoot");
    var total = '0';
    tfoot.innerHTML = "\n        <tr>\n            <td></td>\n            <td><span class=\"total\">0</span></td>\n            <td></td>\n        </tr>\n      ";
    dog.target.closest("table").append(tfoot);
    document.querySelector(".searchClear").addEventListener("click", function (e) {
      document.querySelector("#dogLeaderboardWrapper input.search").value = "";
      window.listObj.search();
    });
    window.updateTotal();
    dog.makeSearch();
  },
  makeSearch: function makeSearch() {
    var options = {
      valueNames: ['name', 'donation', 'code']
    };
    window.listObj = new _list.default('dogLeaderboardWrapper', options);
    window.listObj.on('updated', function (e) {
      console.log("e", e);
      window.updateTotal();
    });
    console.log("dog list", window.listObj);
  },
  listObj: null
};
dog.init();
window.loadSearch = function (what) {
  document.querySelector("#dogLeaderboardWrapper input.search").value = what;
  window.listObj.search(what);
};
window.updateTotal = function () {
  var target = document.querySelector("#dogLeaderboardWrapper table tfoot .total");
  var total = 0;
  document.querySelectorAll("#dogLeaderboardWrapper tbody tr .donation").forEach(function (donation) {
    var val = parseInt(donation.getAttribute("data-total"));
    total += val;
  });
  console.log("update", total);
  var formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(total);
  target.innerHTML = formattedTotal;
};
},{"list.js":"node_modules/list.js/src/index.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "12756" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map