/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/global.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/orientationchangeend/src/orientationchangeend.js":
/*!***********************************************************************!*\
  !*** ./node_modules/orientationchangeend/src/orientationchangeend.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(global) {var Event,\n    Sister = __webpack_require__(/*! sister */ \"./node_modules/sister/src/sister.js\");\n\nEvent = function Event (config) {\n    var event,\n        lastEnd,\n        eventEmitter;\n\n    if (!(this instanceof Event)) {\n        return new Event(config);\n    }\n\n    eventEmitter = Sister();\n\n    event = this;\n    event.on = eventEmitter.on;\n\n    config = config || {};\n\n    /**\n     * @var {Number} Number of iterations the subject of interval inspection must not mutate to fire \"orientationchangeend\".\n     */\n    config.noChangeCountToEnd = config.noChangeCountToEnd || 100;\n    /**\n     * @var {Number} Number of milliseconds after which fire the \"orientationchangeend\" if interval inspection did not do it before.\n     */\n    config.noEndTimeout = 1000 || false;\n    /**\n     * @var {Boolean} Enables logging of the events.\n     */\n    config.debug = config.debug || false;\n\n    global\n        .addEventListener('orientationchange', function () {\n            var interval,\n                timeout,\n                end,\n                lastInnerWidth,\n                lastInnerHeight,\n                noChangeCount;\n\n            end = function (dispatchEvent) {\n                clearInterval(interval);\n                clearTimeout(timeout);\n\n                interval = null;\n                timeout = null;\n\n                if (dispatchEvent) {\n                    eventEmitter.trigger('orientationchangeend');\n                }\n            };\n\n            // If there is a series of orientationchange events fired one after another,\n            // where n event orientationchangeend event has not been fired before the n+2 orientationchange,\n            // then orientationchangeend will fire only for the last orientationchange event in the series.\n            if (lastEnd) {\n                lastEnd(false);\n            }\n\n            lastEnd = end;\n\n            interval = setInterval(function () {\n                if (global.innerWidth === lastInnerWidth && global.innerHeight === lastInnerHeight) {\n                    noChangeCount++;\n\n                    if (noChangeCount === config.noChangeCountToEnd) {\n                        if (config.debug) {\n                            console.debug('setInterval');\n                        }\n\n                        end(true);\n                    }\n                } else {\n                    lastInnerWidth = global.innerWidth;\n                    lastInnerHeight = global.innerHeight;\n                    noChangeCount = 0;\n                }\n            });\n            timeout = setTimeout(function () {\n                if (config.debug) {\n                    console.debug('setTimeout');\n                }\n\n                end(true);\n            }, config.noEndTimeout);\n        });\n}\n\nglobal.gajus = global.gajus || {};\nglobal.gajus.orientationchangeend = Event;\n\nmodule.exports = Event;\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ \"./node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack:///./node_modules/orientationchangeend/src/orientationchangeend.js?");

/***/ }),

/***/ "./node_modules/scream/dist/scream.js":
/*!********************************************!*\
  !*** ./node_modules/scream/dist/scream.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _sister = __webpack_require__(/*! sister */ \"./node_modules/sister/src/sister.js\");\n\nvar _sister2 = _interopRequireDefault(_sister);\n\nvar _orientationchangeend = __webpack_require__(/*! orientationchangeend */ \"./node_modules/orientationchangeend/src/orientationchangeend.js\");\n\nvar _orientationchangeend2 = _interopRequireDefault(_orientationchangeend);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar OCE = (0, _orientationchangeend2.default)();\n\nexports.default = function () {\n    var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];\n\n    var scream = {};\n    var eventEmitter = (0, _sister2.default)();\n\n    config.width = config.width || {};\n\n    if (!config.width.portrait) {\n        config.width.portrait = window.screen.width;\n    }\n\n    if (!config.width.landscape) {\n        config.width.landscape = window.screen.width;\n    }\n\n    if (config.viewport === undefined) {\n        config.viewport = true;\n    }\n\n    /**\n     * Whether to manage the viewport of the page.\n     */\n    scream.manageViewport = function () {\n        return config.viewport;\n    };\n\n    /**\n     * Viewport width relative to the device orientation.\n     */\n    scream.getViewportWidth = function () {\n        return config.width[scream.getOrientation()];\n    };\n\n    /**\n     * Viewport height relative to the device orientation and to scale with the viewport width.\n     */\n    scream.getViewportHeight = function () {\n        return Math.round(scream.getScreenHeight() / scream.getScale());\n    };\n\n    /**\n     * The ratio between screen width and viewport width.\n     */\n    scream.getScale = function () {\n        return scream.getScreenWidth() / scream.getViewportWidth();\n    };\n\n    var OrientationType = 'portrait' | 'landscape';\n\n    scream.getOrientation = function () {\n        return window.orientation === 0 || window.orientation === 180 ? 'portrait' : 'landscape';\n    };\n\n    /**\n     * Screen width relative to the device orientation.\n     */\n    scream.getScreenWidth = function () {\n        return window.screen[scream.getOrientation() === 'portrait' ? 'width' : 'height'];\n    };\n\n    /**\n     * Screen width relative to the device orientation.\n     */\n    scream.getScreenHeight = function () {\n        return window.screen[scream.getOrientation() === 'portrait' ? 'height' : 'width'];\n    };\n\n    /**\n     * Generates a viewport tag reflecting the content width relative to the device orientation\n     * and scale required to fit the content in the viewport if enabled.\n     *\n     * Appends the tag to the document.head and removes the preceding additions.\n     */\n    scream.updateViewport = function () {\n        if (!scream.manageViewport()) return;\n\n        var width = scream.getViewportWidth();\n        var scale = scream.getScale();\n        var padding = scream.getNotchPadding();\n\n        var content = 'width=' + width + ', initial-scale=' + scale + ', minimum-scale=' + scale + ', maximum-scale=' + scale + ', user-scalable=0' + ', viewport-fit=cover';\n\n        if (padding > 0) {\n            content = 'width=' + (width - padding) + ', initial-scale=' + scale + ', minimum-scale=' + scale + ', maximum-scale=' + scale + ', user-scalable=0';\n        }\n\n        var viewport = document.createElement('meta');\n        viewport.name = 'viewport';\n        viewport.content = content;\n\n        var oldViewport = window.document.head.querySelector('meta[name=\"viewport\"]');\n\n        if (oldViewport) {\n            // Workaround for viewport-fit change not having an immediate effect\n            setTimeout(function (content, viewport) {\n                if (scream.getNotchPadding() > 0 && content !== viewport) {\n                    scream.updateViewport();\n                }\n            }, 2000, content, oldViewport.getAttribute('content'));\n            oldViewport.parentNode.removeChild(oldViewport);\n        } else {\n            // Workaround for viewport-fit change not having an immediate effect\n            setTimeout(function () {\n                scream.updateViewport();\n            }, 1000);\n        }\n\n        window.document.head.appendChild(viewport);\n    };\n\n    /**\n     * @property 0 window.innerWidth when device is in a portrait orientation, scale 0.25 and page is the minimal view\n     * @property 1 window.innerHeight when device is in a portrait orientation, scale 0.25 and page is the minimal view\n     * @property 2 window.innerWidth when device is in a landscape orientation, scale 0.25 and page is the minimal view\n     * @property 3 window.innerHeight when device is in a landscape orientation, scale 0.25 and page is the minimal view\n     * @property 4 screen.width\n     * @property 5 screen.height\n     * @property 6 devicePixelRatio\n     * @property 7 name\n     */\n\n\n    /**\n     * Uses static device environment variables (screen.width, screen.height, devicePixelRatio) to recognize device spec.\n     */\n    scream.deviceSpec = function () {\n        var index = void 0,\n            spec = void 0;\n\n        var specs = [[1280, 1762, 1920, 1280, 320, 480, 2, 'iPhone 4/4s'], [1280, 2114, 2272, 1280, 320, 568, 2, 'iPhone 5/5c/5s/SE and 6/6s (Zoomed)'], [1500, 2510, 2668, 1500, 375, 667, 2, 'iPhone 6/6s/7/8'], [1656, 2785, 2944, 1656, 414, 736, 3, 'iPhone 6+/6s+/7+/8+'], [1500, 2509, 2668, 1500, 375, 667, 3, 'iPhone 6+/6s+/7+/8+ (Zoomed)'], [3072, 3936, 4096, 2912, 768, 1024, 1, 'iPad 2'], [3072, 3938, 4096, 2914, 768, 1024, 2, 'iPad Air/Retina/Pro (9.7-inch)'], [3336, 4290, 4448, 3178, 834, 1112, 2, 'iPad Pro (10.5-inch)'], [3336, 4602, 4776, 3162, 834, 1194, 2, 'iPad Pro (11-inch)'], [4096, 5306, 5464, 3938, 1024, 1366, 2, 'iPad Pro (12.9-inch)'], [4096, 5290, 5464, 3922, 1024, 1366, 2, 'iPad Pro (12.9-inch) 3rd generation'], [1656, 3330, 3584, 1656, 414, 896, 2, 'iPhone XR'], [1500, 2993, 3248, 1500, 375, 812, 3, 'iPhone X/XS'], [1656, 3329, 3584, 1656, 414, 896, 3, 'iPhone XS Max']];\n\n        index = specs.length;\n\n        while (index--) {\n            if (window.screen.width === specs[index][4] && window.screen.height === specs[index][5] && window.devicePixelRatio === specs[index][6]) {\n                spec = specs[index];\n\n                break;\n            }\n        }\n\n        return spec;\n    };\n\n    /**\n     * Returns height of the usable viewport in the minimal view relative to the current viewport width.\n     *\n     * This method will work with iOS8 only.\n     *\n     * @see http://stackoverflow.com/questions/26827822/how-is-the-window-innerheight-derived-of-the-minimal-view/26827842\n     * @see http://stackoverflow.com/questions/26801943/how-to-get-the-window-size-of-fullscream-view-when-not-in-fullscream\n     */\n    scream.getMinimalViewHeight = function () {\n        var height = void 0;\n\n        var orientation = scream.getOrientation();\n        var spec = scream.deviceSpec();\n\n        if (!spec) {\n            throw new Error('Not a known iOS device. If you are using an iOS device, report it to https://github.com/gajus/scream/issues/1.');\n        }\n\n        if (orientation === 'portrait') {\n            height = Math.round(scream.getViewportWidth() * spec[1] / spec[0]);\n        } else {\n            height = Math.round(scream.getViewportWidth() * spec[3] / spec[2]);\n        }\n\n        return height;\n    };\n\n    /**\n     * Returns dimensions of the usable viewport in the minimal view relative to the current viewport width and orientation.\n     */\n    scream.getMinimalViewSize = function () {\n        var width = scream.getViewportWidth();\n        var height = scream.getMinimalViewHeight();\n\n        return {\n            height: height,\n            width: width\n        };\n    };\n\n    /**\n     * Returns padding needed to prevent content from clashing with notch\n     * https://stackoverflow.com/questions/46318395/detecting-mobile-device-notch\n     */\n    scream.getNotchPadding = function () {\n        var proceed = false;\n        var div = document.createElement('div');\n        if (CSS.supports('padding-left: env(safe-area-inset-left)') && CSS.supports('padding-left: env(safe-area-inset-right)')) {\n            div.style.paddingLeft = 'env(safe-area-inset-left)';\n            div.style.paddingRight = 'env(safe-area-inset-right)';\n            proceed = true;\n        } else if (CSS.supports('padding-left: constant(safe-area-inset-left)') && CSS.supports('padding-left: constant(safe-area-inset-right)')) {\n            div.style.paddingLeft = 'constant(safe-area-inset-left)';\n            div.style.paddingRight = 'constant(safe-area-inset-right)';\n            proceed = true;\n        }\n        if (proceed) {\n            document.body.appendChild(div);\n            var paddingLeft = parseInt(window.getComputedStyle(div).paddingLeft);\n            var paddingRight = parseInt(window.getComputedStyle(div).paddingRight);\n            document.body.removeChild(div);\n            return paddingLeft + paddingRight;\n        }\n        return 0;\n    };\n\n    /**\n     * Returns true if screen is in \"minimal\" UI.\n     *\n     * iOS 8 has removed the minimal-ui viewport property.\n     * Nevertheless, user can enter minimal-ui using touch-drag-down gesture.\n     * This method is used to detect if user is in minimal-ui view.\n     *\n     * In case of orientation change, the state of the view can be accurately\n     * determined only after orientationchangeend event.\n     */\n    scream.isMinimalView = function () {\n        // It is enough to check the height, because the viewport is based on width.\n        return window.innerHeight === scream.getMinimalViewSize().height;\n    };\n\n    /**\n     * Detect when view changes from full to minimal and vice-versa.\n     */\n    scream.detectViewChange = function () {\n        var lastView = void 0;\n\n        // This method will only with iOS 8.\n        // Overwrite the event handler to prevent an error.\n        if (!scream.deviceSpec()) {\n            /* eslint-disable no-console */\n            console.log('View change detection has been disabled. Unrecognized device. If you are using an iOS device, report it to https://github.com/gajus/scream/issues/1.');\n            /* eslint-enable */\n\n            return function () {};\n        }\n\n        return function () {\n            var currentView = scream.isMinimalView() ? 'minimal' : 'full';\n\n            if (lastView !== currentView) {\n                eventEmitter.trigger('viewchange', {\n                    viewName: currentView\n                });\n\n                lastView = currentView;\n            }\n        };\n    };\n\n    scream.detectViewChange = scream.detectViewChange();\n\n    scream.setupDOMEventListeners = function () {\n        var isOrientationChanging = void 0;\n\n        // Media matcher is the first to pick up the orientation change.\n        window.matchMedia('(orientation: portrait)').addListener(function () {\n            isOrientationChanging = true;\n        });\n\n        OCE.on('orientationchangeend', function () {\n            isOrientationChanging = false;\n\n            scream.updateViewport();\n            scream.detectViewChange();\n\n            eventEmitter.trigger('orientationchangeend');\n        });\n\n        window.addEventListener('orientationchange', function () {\n            scream.updateViewport();\n        });\n\n        window.addEventListener('resize', function () {\n            if (!isOrientationChanging) {\n                scream.detectViewChange();\n            }\n        });\n\n        // iPhone 6 plus does not trigger resize event when leaving the minimal-ui in the landscape orientation.\n        window.addEventListener('scroll', function () {\n            if (!isOrientationChanging) {\n                scream.detectViewChange();\n            }\n        });\n\n        setTimeout(function () {\n            scream.detectViewChange();\n        });\n    };\n\n    scream.updateViewport();\n    scream.setupDOMEventListeners();\n\n    scream.on = eventEmitter.on;\n    scream.off = eventEmitter.off;\n\n    return scream;\n};\n\nmodule.exports = exports['default'];\n//# sourceMappingURL=scream.js.map\n\n\n//# sourceURL=webpack:///./node_modules/scream/dist/scream.js?");

/***/ }),

/***/ "./node_modules/sister/src/sister.js":
/*!*******************************************!*\
  !*** ./node_modules/sister/src/sister.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar Sister;\n\n/**\n* @link https://github.com/gajus/sister for the canonical source repository\n* @license https://github.com/gajus/sister/blob/master/LICENSE BSD 3-Clause\n*/\nSister = function () {\n    var sister = {},\n        events = {};\n\n    /**\n     * @name handler\n     * @function\n     * @param {Object} data Event data.\n     */\n\n    /**\n     * @param {String} name Event name.\n     * @param {handler} handler\n     * @return {listener}\n     */\n    sister.on = function (name, handler) {\n        var listener = {name: name, handler: handler};\n        events[name] = events[name] || [];\n        events[name].unshift(listener);\n        return listener;\n    };\n\n    /**\n     * @param {listener}\n     */\n    sister.off = function (listener) {\n        var index = events[listener.name].indexOf(listener);\n\n        if (index !== -1) {\n            events[listener.name].splice(index, 1);\n        }\n    };\n\n    /**\n     * @param {String} name Event name.\n     * @param {Object} data Event data.\n     */\n    sister.trigger = function (name, data) {\n        var listeners = events[name],\n            i;\n\n        if (listeners) {\n            i = listeners.length;\n            while (i--) {\n                listeners[i].handler(data);\n            }\n        }\n    };\n\n    return sister;\n};\n\nmodule.exports = Sister;\n\n\n//# sourceURL=webpack:///./node_modules/sister/src/sister.js?");

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var g;\n\n// This works in non-strict mode\ng = (function() {\n\treturn this;\n})();\n\ntry {\n\t// This works if eval is allowed (see CSP)\n\tg = g || new Function(\"return this\")();\n} catch (e) {\n\t// This works if the window reference is available\n\tif (typeof window === \"object\") g = window;\n}\n\n// g can still be undefined, but nothing to do about it...\n// We return undefined, instead of nothing here, so it's\n// easier to handle this case. if(!global) { ...}\n\nmodule.exports = g;\n\n\n//# sourceURL=webpack:///(webpack)/buildin/global.js?");

/***/ }),

/***/ "./src/global.js":
/*!***********************!*\
  !*** ./src/global.js ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_scream_dist_scream__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/scream/dist/scream */ \"./node_modules/scream/dist/scream.js\");\n/* harmony import */ var _node_modules_scream_dist_scream__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_scream_dist_scream__WEBPACK_IMPORTED_MODULE_0__);\n\nvar scream = _node_modules_scream_dist_scream__WEBPACK_IMPORTED_MODULE_0___default()({\n  viewport: false,\n  width: {\n    portrait: screen.width,\n    landscape: screen.height\n  }\n});\nwindow.webMobileGlobal = {\n  isMinimalView: scream.isMinimalView.bind(scream),\n  getViewportWidth: scream.getViewportWidth.bind(scream),\n  getViewportHeight: scream.getViewportHeight.bind(scream),\n  getScale: scream.getScale.bind(scream),\n  getScreenWidth: scream.getScreenWidth.bind(scream),\n  getScreenHeight: scream.getScreenHeight.bind(scream),\n  getNotchPadding: scream.getNotchPadding.bind(scream)\n};\n\n//# sourceURL=webpack:///./src/global.js?");

/***/ })

/******/ });