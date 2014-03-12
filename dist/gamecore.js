/******/ (function(modules) { // webpackBootstrap
/******/ 	// shortcut for better minimizing
/******/ 	var exports = "exports";
/******/ 	
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/ 	
/******/ 	// The require function
/******/ 	function require(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId][exports];
/******/ 		
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/ 		
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module[exports], module, module[exports], require);
/******/ 		
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 		
/******/ 		// Return the exports of the module
/******/ 		return module[exports];
/******/ 	}
/******/ 	
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	require.modules = modules;
/******/ 	
/******/ 	// expose the module cache
/******/ 	require.cache = installedModules;
/******/ 	
/******/ 	// __webpack_public_path__
/******/ 	require.p = "";
/******/ 	
/******/ 	
/******/ 	// Load entry module and return exports
/******/ 	return require(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*****************************!*\
  !*** ./src/gamecore.coffee ***!
  \*****************************/
/***/ function(module, exports, require) {

	var GameCore, support;
	
	support = require(/*! ./core/support */ 1);
	
	GameCore = {
	  Core: require(/*! ./core/core */ 2),
	  UI: require(/*! ./ui/exports */ 3),
	  Math: require(/*! ./math/exports */ 5),
	  Utils: require(/*! ./utils/exports */ 4),
	  Input: require(/*! ./input/exports */ 6)
	};
	
	if (window) {
	  window.GameCore = window.GameCore || GameCore;
	}
	
	module.exports = GameCore;


/***/ },
/* 1 */
/*!*********************************!*\
  !*** ./src/core/support.coffee ***!
  \*********************************/
/***/ function(module, exports, require) {

	var ERRORS, browserPrefix, prefix, userAgent;
	
	prefix = function(name) {
	  if (browserPrefix !== "") {
	    name = name.charAt(0).toUpperCase() + name.slice(1);
	  }
	  return browserPrefix + name;
	};
	
	userAgent = navigator.userAgent;
	
	browserPrefix = (userAgent.match(/opera/i) && "o") || (userAgent.match(/webkit/i) && "webkit") || (userAgent.match(/msie/i) && "ms") || (userAgent.match(/mozilla/i) && "moz") || "";
	
	Function.prototypeproperty = function(prop, desc) {
	  return Object.defineProperty(this.prototype, prop, desc);
	};
	
	if (typeof window.addEventListener !== "function") {
	  HTMLElement.prototypeaddEventListener = function(type, callback, useCapture) {
	    return attachEvent("on" + type, callback);
	  };
	}
	
	/*
	window.onEnterFrame
	*/
	
	
	window.onEnterFrame = (function() {
	  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
	    return window.setTimeout(callback, 1000 / (window._FPS || 60));
	  };
	})();
	
	/*
	Working around Typed arrays
	*/
	
	
	(function() {
	  /*
	  Trying to create Uint8Array. 
	  If everything is ok then return, otherwise we need to create a simulation.
	  
	  Code borrowed from pdf.js (https://gist.github.com/1057924)
	  */
	
	  var TypedArray, a, set_, subarray;
	  try {
	    a = new Uint8Array(1);
	    return;
	  } catch (_error) {}
	  subarray = function(start, end) {
	    return this.slice(start, end);
	  };
	  set_ = function(array, offset) {
	    var i, n, _results;
	    i = void 0;
	    n = array.length;
	    if (arguments_.length < 2) {
	      offset = 0;
	    }
	    i = 0;
	    _results = [];
	    while (i < n) {
	      this[offset] = array[i] & 0xFF;
	      ++i;
	      _results.push(++offset);
	    }
	    return _results;
	  };
	  TypedArray = function(arg1) {
	    var i, result;
	    result = void 0;
	    i = void 0;
	    if (typeof arg1 === "number") {
	      result = new Array(arg1);
	      i = 0;
	      while (i < arg1) {
	        result[i] = 0;
	        ++i;
	      }
	    } else {
	      result = arg1.slice(0);
	    }
	    result.subarray = subarray;
	    result.buffer = result;
	    result.byteLength = result.length;
	    result.set = set_;
	    if (typeof arg1 === "object" && arg1.buffer) {
	      result.buffer = arg1.buffer;
	    }
	    return result;
	  };
	  window.Uint8Array = TypedArray;
	  window.Uint32Array = TypedArray;
	  return window.Int32Array = TypedArray;
	})();
	
	(function() {
	  var getter;
	  if (window.opera) {
	    return;
	  }
	  if ("response" in XMLHttpRequest.prototype || "mozResponseArrayBuffer" in XMLHttpRequest.prototype || "mozResponse" in XMLHttpRequest.prototype || "responseArrayBuffer" in XMLHttpRequest.prototype) {
	    return;
	  }
	  getter = void 0;
	  if (window.VBArray) {
	    getter = function() {
	      return new Uint8Array(new VBArray(this.responseBody).toArray());
	    };
	  } else {
	    getter = function() {
	      return this.responseBody;
	    };
	  }
	  return Object.defineProperty(XMLHttpRequest.prototype, "response", {
	    get: getter
	  });
	})();
	
	if (!window.btoa) {
	  (function() {
	    return window.btoa = function(data) {
	      var ac, b64, bits, enc, h1, h2, h3, h4, i, o1, o2, o3, r, tmp_arr;
	      b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	      o1 = void 0;
	      o2 = void 0;
	      o3 = void 0;
	      h1 = void 0;
	      h2 = void 0;
	      h3 = void 0;
	      h4 = void 0;
	      bits = void 0;
	      i = 0;
	      ac = 0;
	      enc = "";
	      tmp_arr = [];
	      if (!data) {
	        return data;
	      }
	      while (true) {
	        o1 = data.charCodeAt(i++);
	        o2 = data.charCodeAt(i++);
	        o3 = data.charCodeAt(i++);
	        bits = o1 << 16 | o2 << 8 | o3;
	        h1 = bits >> 18 & 0x3f;
	        h2 = bits >> 12 & 0x3f;
	        h3 = bits >> 6 & 0x3f;
	        h4 = bits & 0x3f;
	        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	        if (!(i < data.length)) {
	          break;
	        }
	      }
	      enc = tmp_arr.join("");
	      r = data.length % 3;
	      return (r ? enc.slice(0, r - 3) : enc) + "===".slice(r || 3);
	    };
	  })();
	}
	
	/*
	Checking for ability to work
	*/
	
	
	ERRORS = [];
	
	if (!Object.defineProperty) {
	  ERRORS.append("Browser doesnt support Object.defineProperty.");
	}
	
	if (!document.createElement("canvas").getContext) {
	  ERRORS.append("Browser doesnt support <canvas> and the Canvas2D API.");
	}
	
	module.exports = {
	  /*
	  */
	
	  ERRORS: ERRORS,
	  /*
	  Browser's user-agent string
	  @attribute userAgent
	  @type {String}
	  @static
	  @readonly
	  */
	
	  userAgent: userAgent,
	  /*
	  Device supports touch events?
	  @attribute touch
	  @type {Boolean}
	  @static
	  @readonly
	  */
	
	  touch: "ontouchstart" in window,
	  /*
	  Device supports Retina Display?
	  @attribute retina
	  @type {Boolean}
	  @static
	  @readonly
	  */
	
	  retina: window.devicePixelRatio > 1 || window.matchMedia("(min-resolution: 1.1dppx)").matches,
	  imageSmoothingEnabled: prefix("imageSmoothingEnabled")
	};


/***/ },
/* 2 */
/*!******************************!*\
  !*** ./src/core/core.coffee ***!
  \******************************/
/***/ function(module, exports, require) {

	var Events, GameCore, Stage, Stats, UUID, context2d, support,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	
	context2d = require(/*! ./context/2d */ 8);
	
	support = require(/*! ./support */ 1);
	
	Events = require(/*! ./events/dispatcher */ 9);
	
	UUID = require(/*! ../math/uuid */ 10);
	
	Stage = require(/*! ../ui/stage */ 7);
	
	Stats = require(/*! ./debug/stats */ 11);
	
	/*
	Game Core base class
	
	@property {Stage} stage
	@property {Boolean} fullWindowSize
	@property {Boolean} paused
	@property {Context} context
	@property {Int} width
	@property {Int} heigth
	@property {DOMElement} renderer
	@property {Boolean} debug
	
	@example How to create an game core 
	    gc = new GameCore() # Creating core
	    gc.renderer = document.body # Appends new canvas element to documents body
	
	@example Making canvas full-sized
	    gc = new GameCore() # Creating core
	    gc.fullWindowSize = true
	*/
	
	
	module.exports = GameCore = (function(_super) {
	  __extends(GameCore, _super);
	
	  /*
	  GameCore instancec archive
	  */
	
	
	  GameCore.cores = {};
	
	  /*
	  Start your application from here.
	  
	  @param {Object} options
	  */
	
	
	  function GameCore(options) {
	    var error, _i, _len, _ref;
	    this.options = options != null ? options : {};
	    GameCore.__super__.constructor.call(this, this.options);
	    /*
	    In the first case we need to generate id for new instance, if it not
	     present in options.
	    */
	
	    this.id = this.options.id || UUID.generateUniqueId();
	    /*
	    Checing for runtime errors
	    */
	
	    if (support.ERRORS) {
	      _ref = support.ERRORS;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        error = _ref[_i];
	        throw error;
	      }
	    }
	    /*
	    Setting up a canvas.
	    If canvas doesn't present in options then create it.
	    */
	
	    this.options.canvas = this.options.canvas || this.createCanvas();
	    /*
	    Registrating GameCore instance in canvas ang GameCore global.
	    */
	
	    this.options.canvas.core = this;
	    GameCore.cores[this.id] = this;
	    /*
	    Setting up framerate
	    */
	
	    this.setFramerate();
	    /*
	    Stages map
	    */
	
	    this._stages = {};
	    Object.defineProperty(this, "stage", {
	      get: function() {
	        var stage;
	        if (this._current_stage_id) {
	          return this._stages[this._current_stage_id];
	        } else {
	          stage = new Stage;
	          this._current_stage_id = stage.id;
	          this.addStage(stage);
	          return stage;
	        }
	      },
	      set: function(stage) {
	        if (!this._stages[stage.id]) {
	          this.addStage(stage);
	        }
	        this._current_stage_id = stage.id;
	        return this.dispatchEvent('stage_changed', stage);
	      }
	    });
	    /*
	    */
	
	    Object.defineProperty(this, "fullWindowSize", {
	      get: function() {
	        return this._in_the_fullscreen_now;
	      },
	      set: function(b) {
	        if (b === true) {
	          window.addEventListener("resize", this._fullWindowSize_resizer);
	          this._in_the_fullscreen_now = true;
	          return this.setSize(document.width, document.height);
	        } else {
	          window.removeEventListener("resize", this._fullWindowSize_resizer);
	          this._in_the_fullscreen_now = false;
	          return this.setSize(this.options.width, this.options.height);
	        }
	      }
	    });
	    this.fullWindowSize = this.options.fullWindowSize;
	    /*
	    */
	
	    Object.defineProperty(this, "width", {
	      get: function() {
	        return this.options.canvas.width;
	      },
	      set: function(width) {
	        this.options.canvas.width = width;
	        return this.options.canvas.style.width = width + "px";
	      }
	    });
	    /*
	    */
	
	    Object.defineProperty(this, "height", {
	      get: function() {
	        return this.options.canvas.height;
	      },
	      set: function(height) {
	        this.options.canvas.height = height;
	        return this.options.canvas.style.height = height + "px";
	      }
	    });
	    /*
	    */
	
	    if (this.fullWindowSize) {
	      this.options.width = window.width;
	      this.options.height = window.height;
	    }
	    this.setSize(this.options.width, this.options.height);
	    /*
	    Context element.
	    @note Currently support only Context2d
	    @property context
	    */
	
	    Object.defineProperty(this, "context", {
	      get: function() {
	        if (!this._context) {
	          this._context = new context2d({
	            canvas: this.options.canvas
	          });
	        }
	        return this._context;
	      }
	    });
	    /*
	    @property paused
	    */
	
	    Object.defineProperty(this, "paused", {
	      get: function() {
	        return this._paused || false;
	      },
	      set: function(paused) {
	        return this._paused = paused ? true : false;
	      }
	    });
	    /*
	    */
	
	    Object.defineProperty(this, "debug", {
	      get: function() {
	        return this._debug || false;
	      },
	      set: function(debug) {
	        return this._debug = !!debug;
	      }
	    });
	    /*
	    Renderer element.
	    @property renderer
	    */
	
	    Object.defineProperty(this, "renderer", {
	      get: function() {
	        return this._parent_node || 'undefined';
	      },
	      set: function(node) {
	        if (!node.tagName) {
	          throw Error("Can render only on document elements");
	        }
	        node.appendChild(this.options.canvas);
	        return this._parent_node = node;
	      }
	    });
	    this._stats = new Stats(this);
	    this._onEnterFrame();
	  }
	
	  /*
	  */
	
	
	  GameCore.prototype.addStage = function(stage, setCurrent) {
	    if (setCurrent == null) {
	      setCurrent = false;
	    }
	    stage = stage || new Stage;
	    this._stages[stage.id] = stage;
	    if (setCurrent) {
	      this.stage = stage.id;
	    }
	    this.dispatchEvent('stage_added');
	    this.dispatchEvent('stage', stage);
	    return stage;
	  };
	
	  /*
	  Switch pause state
	  */
	
	
	  GameCore.prototype.pause = function() {
	    this.paused = !this.paused;
	    if (this.paused) {
	      return this.dispatchEvent('paused');
	    } else {
	      return this.dispatchEvent('unpaused');
	    }
	  };
	
	  /*
	  Set's framerate. Not usable at the moment...
	  @param {Int} framerate
	  @method setFramerate
	  */
	
	
	  GameCore.prototype.setFramerate = function(framerate) {
	    if (framerate == null) {
	      framerate = 60;
	    }
	    return this._FPS = framerate;
	  };
	
	  /*
	  Set size of an canvas element.
	  @param {Int} width
	  @param {Int} height
	  @method setSize
	  */
	
	
	  GameCore.prototype.setSize = function(width, height) {
	    if (width == null) {
	      width = 400;
	    }
	    if (height == null) {
	      height = 300;
	    }
	    this.width = width;
	    this.height = height;
	    return this.dispatchEvent('sizeChanged');
	  };
	
	  GameCore.prototype._fullWindowSize_resizer = function() {
	    var gci;
	    gci = this;
	    return function(e) {
	      return gci.setSize(window.width, window.height);
	    };
	  };
	
	  /*
	  Creates a canvas element
	  @method createCanvas
	  */
	
	
	  GameCore.prototype.createCanvas = function() {
	    var canvas;
	    canvas = document.createElement('canvas');
	    return canvas;
	  };
	
	  /*
	  Call window's requestAnimationFrame.
	  @method _onEnterFrame
	  */
	
	
	  GameCore.prototype._onEnterFrame = function(gci) {
	    if (gci == null) {
	      gci = this;
	    }
	    if (!this.paused) {
	      gci._render(gci.stage);
	    }
	    return window.onEnterFrame(function() {
	      return gci._onEnterFrame(gci);
	    });
	  };
	
	  GameCore.prototype._render = function() {
	    this.dispatchEvent('render_start');
	    this.stage.width = this.width;
	    this.stage.height = this.height;
	    this.context.render([this.stage]);
	    this.dispatchEvent('render_end');
	    return this.dispatchEvent('render');
	  };
	
	  /*
	  @method addInput
	  */
	
	
	  GameCore.prototype.addInput = function(hid) {
	    var input;
	    if (!this._installedInputs) {
	      this._installedInputs = {};
	    }
	    if (__indexOf.call(this._installedInputs, input) < 0) {
	      input = new hid(this);
	      return this._installedInputs[hid] = input;
	    }
	  };
	
	  return GameCore;
	
	})(Events);


/***/ },
/* 3 */
/*!*******************************!*\
  !*** ./src/ui/exports.coffee ***!
  \*******************************/
/***/ function(module, exports, require) {

	module.exports = {
	  Widget: require(/*! ./widget */ 12),
	  Stage: require(/*! ./stage */ 7),
	  Container: require(/*! ./container */ 13),
	  Text: require(/*! ./text */ 14),
	  Sprite: require(/*! ./sprite */ 15),
	  geometry: require(/*! ./geometry/exports */ 16)
	};


/***/ },
/* 4 */
/*!**********************************!*\
  !*** ./src/utils/exports.coffee ***!
  \**********************************/
/***/ function(module, exports, require) {

	module.exports = {
	  Color: require(/*! ./color */ 20),
	  Font: require(/*! ./font */ 21),
	  Loader: require(/*! ./loader */ 22)
	};


/***/ },
/* 5 */
/*!*********************************!*\
  !*** ./src/math/exports.coffee ***!
  \*********************************/
/***/ function(module, exports, require) {

	module.exports = {
	  Matrix2D: require(/*! ./matrix2d */ 17),
	  Vector2D: require(/*! ./vector2d */ 18),
	  UUID: require(/*! ./uuid */ 10),
	  Math: require(/*! ./math */ 19)
	};


/***/ },
/* 6 */
/*!**********************************!*\
  !*** ./src/input/exports.coffee ***!
  \**********************************/
/***/ function(module, exports, require) {

	module.exports = {
	  Mouse: require(/*! ./mouse */ 23)
	};


/***/ },
/* 7 */
/*!*****************************!*\
  !*** ./src/ui/stage.coffee ***!
  \*****************************/
/***/ function(module, exports, require) {

	var Stage, container,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
	
	container = require(/*! ../ui/container */ 13);
	
	/*
	Stage container
	@note GameCore.exports.ui.Stage
	*/
	
	
	Stage = (function(_super) {
	  __extends(Stage, _super);
	
	  function Stage(options) {
	    if (options == null) {
	      options = {};
	    }
	    Stage.__super__.constructor.call(this, options);
	    this.x = options.x || 0;
	    this.y = options.y || 0;
	    this.shaders = [];
	    this.canvas = document.createElement('canvas');
	    this.ctx = this.canvas.getContext('2d');
	  }
	
	  Stage.prototype.addShader = function(shader) {
	    return this.shaders.push(shader);
	  };
	
	  Stage.prototype.render = function(ctx) {
	    var data, shader, _i, _len, _ref;
	    this.width = this.width || ctx.canvas.width;
	    this.height = this.width || ctx.canvas.height;
	    if (this.shaders) {
	      this.canvas.width = this.width;
	      this.canvas.height = this.height;
	      Stage.__super__.render.call(this, this.ctx);
	      _ref = this.shaders;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        shader = _ref[_i];
	        shader.process(this.ctx);
	      }
	      data = this.ctx.getImageData(0, 0, this.width, this.height);
	      return ctx.putImageData(data, this.x, this.y);
	    } else {
	      return Stage.__super__.render.call(this, ctx);
	    }
	  };
	
	  return Stage;
	
	})(container);
	
	module.exports = Stage;


/***/ },
/* 8 */
/*!************************************!*\
  !*** ./src/core/context/2d.coffee ***!
  \************************************/
/***/ function(module, exports, require) {

	var Context2d;
	
	Context2d = (function() {
	  function Context2d(options) {
	    this.setCanvas(options.canvas);
	  }
	
	  Context2d.prototype.setCanvas = function(canvas) {
	    this.canvas = canvas;
	    this.ctx = this.canvas.getContext('2d');
	    return this;
	  };
	
	  Context2d.prototype.clear = function() {
	    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	    return this;
	  };
	
	  Context2d.prototype.render = function(layers) {
	    var layer, _i, _len, _results;
	    if (layers == null) {
	      layers = [];
	    }
	    this.clear();
	    _results = [];
	    for (_i = 0, _len = layers.length; _i < _len; _i++) {
	      layer = layers[_i];
	      _results.push(layer.render(this.ctx));
	    }
	    return _results;
	  };
	
	  return Context2d;
	
	})();
	
	module.exports = Context2d;


/***/ },
/* 9 */
/*!*******************************************!*\
  !*** ./src/core/events/dispatcher.coffee ***!
  \*******************************************/
/***/ function(module, exports, require) {

	/*
	Inspired by CreateJS/TweenJS
	*/
	
	var Event, EventsDispatcher;
	
	Event = require(/*! ./event */ 24);
	
	EventsDispatcher = (function() {
	  /*
	  Static initializer to mix EventDispatcher methods into a target object or prototype.
	  @method constructor
	  @static
	  @param {Object} target The target object to inject EventDispatcher methods into. This can be an instance or aprototype.
	  */
	
	  function EventsDispatcher() {
	    this._listeners = null;
	    this._captureListeners = null;
	  }
	
	  /*
	  Adds the specified event listener. Note that adding multiple listeners to the same function will result in
	  multiple callbacks getting fired.
	  
	  @example
	      Object.addEventListener "click", handleClick
	      handleClick = (event)->
	          # Handle click function body
	  
	  @method addEventListener
	  @param {String} type The string type of the event.
	  @param {Function | Object} listener An object with a handleEvent method, or a function that will be called when the event is dispatched.
	  @param {Boolean} [useCapture] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
	  @return {Function | Object} Returns the listener for chaining or assignment.
	  */
	
	
	  EventsDispatcher.prototype.addEventListener = function(type, listener, useCapture) {
	    var arr, listeners;
	    listeners = void 0;
	    if (useCapture) {
	      listeners = this._captureListeners = this._captureListeners || {};
	    } else {
	      listeners = this._listeners = this._listeners || {};
	    }
	    arr = listeners[type];
	    if (arr) {
	      this.removeEventListener(type, listener, useCapture);
	    }
	    arr = listeners[type];
	    if (!arr) {
	      listeners[type] = [listener];
	    } else {
	      arr.push(listener);
	    }
	    return listener;
	  };
	
	  /*
	  A shortcut method for using addEventListener that makes it easier to specify an execution scope, have a listener
	  only run once, associate arbitrary data with the listener, and remove the listener.
	  
	  This method works by creating an anonymous wrapper function and subscribing it with addEventListener.
	  The created anonymous function is returned for use with .removeEventListener (or .off).
	  
	  @example
	      listener = myBtn.on "click", handleClick, null, false, {count:3}
	      handleClick = (evt, data)->
	          data.count -= 1
	          console.log this == myBtn # true - scope defaults to the dispatcher
	          if data.count == 0
	              alert "clicked 3 times!"
	              myBtn.off "click", listener
	              # alternately: evt.remove()
	  
	  @method on
	  @param {String} type The string type of the event.
	  @param {Function | Object} listener An object with a handleEvent method, or a function that will be called when the event is dispatched.
	  @param {Object} [scope] The scope to execute the listener in. Defaults to the dispatcher/currentTarget for function listeners, and to the listener itself for object listeners (ie. using handleEvent).
	  @param {Boolean} [once=false] If true, the listener will remove itself after the first time it is triggered.
	  @param {*} [data] Arbitrary data that will be included as the second parameter when the listener is called.
	  @param {Boolean} [useCapture=false] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
	  @return {Function} Returns the anonymous function that was created and assigned as the listener. This is needed to remove the listener later using .removeEventListener.
	  */
	
	
	  EventsDispatcher.prototype.on = function(type, listener, scope, once, data, useCapture) {
	    if (listener.handleEvent) {
	      scope = scope || listener;
	      listener = listener.handleEvent;
	    }
	    scope = scope || this;
	    return this.addEventListener(type, (function(evt) {
	      listener.call(scope, evt, data);
	      return once && evt.remove();
	    }), useCapture);
	  };
	
	  /*
	  Removes the specified event listener.
	  
	  @note that you must pass the exact function reference used when the event was added. If a proxy
	  function, or function closure is used as the callback, the proxy/closure reference must be used - a new proxy or
	  closure will not work.
	  
	  @example
	      displayObject.removeEventListener "click", handleClick
	  
	  @method removeEventListener
	  @param {String} type The string type of the event.
	  @param {Function | Object} listener The listener function or object.
	  @param {Boolean} [useCapture] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
	  */
	
	
	  EventsDispatcher.prototype.removeEventListener = function(type, listener, useCapture) {
	    var arr, i, l, listeners, _results;
	    listeners = (useCapture ? this._captureListeners : this._listeners);
	    if (!listeners) {
	      return;
	    }
	    arr = listeners[type];
	    if (!arr) {
	      return;
	    }
	    i = 0;
	    l = arr.length;
	    _results = [];
	    while (i < l) {
	      if (arr[i] === listener) {
	        if (l === 1) {
	          delete listeners[type];
	        } else {
	          arr.splice(i, 1);
	        }
	        break;
	      }
	      _results.push(i++);
	    }
	    return _results;
	  };
	
	  /*
	  A shortcut to the removeEventListener method, with the same parameters and return value. This is a companion to the
	  .on method.
	  
	  @method off
	  @param {String} type The string type of the event.
	  @param {Function | Object} listener The listener function or object.
	  @param {Boolean} [useCapture] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
	  */
	
	
	  EventsDispatcher.prototype.off = EventsDispatcher.prototype.removeEventListener;
	
	  /*
	  Removes all listeners for the specified type, or all listeners of all types.
	  
	  @example Remove all listeners
	      displayObject.removeAllEventListeners()
	  
	  @example Remove all click listeners
	      displayObject.removeAllEventListeners "click"
	  
	  @method removeAllEventListeners
	  @param {String} [type] The string type of the event. If omitted, all listeners for all types will be removed.
	  */
	
	
	  EventsDispatcher.prototype.removeAllEventListeners = function(type) {
	    if (!type) {
	      return this._listeners = this._captureListeners = null;
	    } else {
	      if (this._listeners) {
	        delete this._listeners[type];
	      }
	      if (this._captureListeners) {
	        return delete this._captureListeners[type];
	      }
	    }
	  };
	
	  /*
	  Dispatches the specified event to all listeners.
	  
	  @example Use a string event
	      @dispatchEvent "complete"
	  
	  @example Use an Event instance
	      event = new Event "progress"
	      @dispatchEvent event
	  
	  @method dispatchEvent
	  @param {Object | String | Event} eventObj An object with a "type" property, or a string type.
	  While a generic object will work, it is recommended to use a CreateJS Event instance. If a string is used,
	  dispatchEvent will construct an Event instance with the specified type.
	  @param {Object} [target] The object to use as the target property of the event object. This will default to the
	  dispatching object. <b>This parameter is deprecated and will be removed.</b>
	  @return {Boolean} Returns the value of eventObj.defaultPrevented.
	  */
	
	
	  EventsDispatcher.prototype.dispatchEvent = function(eventObj, target) {
	    var i, l, list, listeners, top;
	    if (typeof eventObj === "string") {
	      listeners = this._listeners;
	      if (!listeners || !listeners[eventObj]) {
	        return false;
	      }
	      eventObj = new Event(eventObj);
	    }
	    eventObj.target = target || this;
	    if (!eventObj.bubbles || !this.parent) {
	      return this._dispatchEvent(eventObj, 2);
	    } else {
	      top = this;
	      list = [top];
	      while (top.parent) {
	        list.push(top = top.parent);
	      }
	      i = void 0;
	      l = list.length;
	      i = l - 1;
	      while (i >= 0 && !eventObj.propagationStopped) {
	        list[i]._dispatchEvent(eventObj, 1 + (i === 0));
	        i--;
	      }
	      i = 1;
	      while (i < l && !eventObj.propagationStopped) {
	        list[i]._dispatchEvent(eventObj, 3);
	        i++;
	      }
	      return eventObj.defaultPrevented;
	    }
	  };
	
	  /*
	  Indicates whether there is at least one listener for the specified event type.
	  @method hasEventListener
	  @param {String} type The string type of the event.
	  @return {Boolean} Returns true if there is at least one listener for the specified event.
	  */
	
	
	  EventsDispatcher.prototype.hasEventListener = function(type) {
	    var captureListeners, listeners;
	    listeners = this._listeners;
	    captureListeners = this._captureListeners;
	    return !!((listeners && listeners[type]) || (captureListeners && captureListeners[type]));
	  };
	
	  /*
	  Indicates whether there is at least one listener for the specified event type on this object or any of its
	  ancestors (parent, parent's parent, etc). A return value of true indicates that if a bubbling event of the
	  specified type is dispatched from this object, it will trigger at least one listener.
	  
	  This is similar to {{#crossLink "EventDispatcher/hasEventListener"}}{{/crossLink}}, but it searches the entire
	  event flow for a listener, not just this object.
	  @method willTrigger
	  @param {String} type The string type of the event.
	  @return {Boolean} Returns `true` if there is at least one listener for the specified event.
	  */
	
	
	  EventsDispatcher.prototype.willTrigger = function(type) {
	    var o;
	    o = this;
	    while (o) {
	      if (o.hasEventListener(type)) {
	        return true;
	      }
	      o = o.parent;
	    }
	    return false;
	  };
	
	  /*
	  @method toString
	  @return {String} a string representation of the instance.
	  */
	
	
	  EventsDispatcher.prototype.toString = function() {
	    return "<EventDispatcher>";
	  };
	
	  /*
	  @method _dispatchEvent
	  @param {Object | String | Event} eventObj
	  @param {Object} eventPhase
	  @protected
	  */
	
	
	  EventsDispatcher.prototype._dispatchEvent = function(eventObj, eventPhase) {
	    var arr, i, l, listeners, o, _results;
	    l = void 0;
	    listeners = (eventPhase === 1 ? this._captureListeners : this._listeners);
	    if (eventObj && listeners) {
	      arr = listeners[eventObj.type];
	      if (!arr || !(l = arr.length)) {
	        return;
	      }
	      eventObj.currentTarget = this;
	      eventObj.eventPhase = eventPhase;
	      eventObj.removed = false;
	      arr = arr.slice();
	      i = 0;
	    }
	    _results = [];
	    while (i < l && !eventObj.immediatePropagationStopped) {
	      o = arr[i];
	      if (o.handleEvent) {
	        o.handleEvent(eventObj);
	      } else {
	        o(eventObj);
	      }
	      if (eventObj.removed) {
	        this.off(eventObj.type, o, eventPhase === 1);
	        eventObj.removed = false;
	      }
	      _results.push(i++);
	    }
	    return _results;
	  };
	
	  return EventsDispatcher;
	
	})();
	
	module.exports = EventsDispatcher;


/***/ },
/* 10 */
/*!******************************!*\
  !*** ./src/math/uuid.coffee ***!
  \******************************/
/***/ function(module, exports, require) {

	/*
	Unique ID generator
	
	@note GameCore.exports.Math.UUID
	*/
	
	var UUID;
	
	UUID = (function() {
	  function UUID() {}
	
	  /*
	  @method generateUniqueId
	  @return {String}
	  */
	
	
	  UUID.generateUniqueId = function() {
	    return "gc-" + this.uuid();
	  };
	
	  /*
	  @method uuid
	  @return {String}
	  */
	
	
	  UUID.uuid = function() {
	    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	      var r, v;
	      r = Math.random() * 16 | 0;
	      v = c === 'x' ? r : r & 0x3 | 0x8;
	      return v.toString(16);
	    });
	  };
	
	  return UUID;
	
	})();
	
	module.exports = UUID;


/***/ },
/* 11 */
/*!*************************************!*\
  !*** ./src/core/debug/stats.coffee ***!
  \*************************************/
/***/ function(module, exports, require) {

	var Stats, Text, Widget,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
	
	Text = require(/*! ../../ui/text */ 14);
	
	Widget = require(/*! ../../ui/widget */ 12);
	
	module.exports = Stats = (function(_super) {
	  __extends(Stats, _super);
	
	  function Stats(core) {
	    var me;
	    this.core = core;
	    Stats.__super__.constructor.apply(this, arguments);
	    this.startTime = Date.now();
	    this.prevTime = this.startTime;
	    this.ms = 0;
	    this.msMin = Infinity;
	    this.msMax = 0;
	    this.fps = 0;
	    this.fpsMin = Infinity;
	    this.fpsMax = 0;
	    this.frames = 0;
	    this.mode = 0;
	    me = this;
	    this.core.on('update', function() {
	      return me.update();
	    });
	    /*
	    Creating UI components
	    */
	
	    this.text = new GameCore.UI.Text;
	  }
	
	  Stats.prototype.update = function() {
	    var time;
	    time = Date.now();
	    this.ms = time - this.startTime;
	    this.msMin = Math.min(msMin, ms);
	    this.msMax = Math.max(msMax, ms);
	    this.frames++;
	    if (time > prevTime + 1000) {
	      this.fps = Math.round((this.frames * 1000) / (time - this.prevTime));
	      this.fpsMin = Math.min(this.fpsMin, this.fps);
	      this.fpsMax = Math.max(this.fpsMax, this.fps);
	      this.prevTime = time;
	      this.frames = 0;
	    }
	    return this.startTime = time;
	  };
	
	  Stats.prototype._render = function(ctx) {
	    return text.text = "FPS: " + this.fps;
	  };
	
	  return Stats;
	
	})(Widget);


/***/ },
/* 12 */
/*!******************************!*\
  !*** ./src/ui/widget.coffee ***!
  \******************************/
/***/ function(module, exports, require) {

	var Color, Events, Matrix2d, Support, UUID, Vector2d, Widget,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
	
	UUID = require(/*! ../math/uuid */ 10);
	
	Events = require(/*! ../core/events/dispatcher */ 9);
	
	Vector2d = require(/*! ../math/vector2d */ 18);
	
	Matrix2d = require(/*! ../math/matrix2d */ 17);
	
	Support = require(/*! ../core/support */ 1);
	
	Color = require(/*! ../utils/color */ 20);
	
	/*
	Base renderable element
	
	@note GameCore.exports.ui.Widget
	*/
	
	
	module.exports = Widget = (function(_super) {
	  __extends(Widget, _super);
	
	  function Widget(options) {
	    if (options == null) {
	      options = {};
	    }
	    this.id = UUID.generateUniqueId();
	    Widget.__super__.constructor.call(this, options);
	    /*
	    @attribute pivot
	    @type {Vector2d}
	    @default 0,0
	    */
	
	    this.pivot = options.pivot || new Vector2d(options.pivotX || 0, options.pivotY || 0);
	    /*
	    @attribute skewX
	    @type {Number}
	    @default 0
	    */
	
	    this.skew = options.skew || new Vector2d(options.skewX || 0, options.skewY || 0);
	    /*
	    @attribute scale
	    @type {Vector2d}
	    @default 1,1
	    */
	
	    this.scale = options.scale || new Vector2d(options.scaleX || 1, options.scaleY || 1);
	    /*
	    @attribute alpha
	    @type {Number}
	    @default 1
	    */
	
	    Object.defineProperty(this, "alpha", {
	      get: function() {
	        if (!this._alpha) {
	          this._alpha = options.alpha || 1;
	        }
	        return this._alpha;
	      },
	      set: function(alpha) {
	        return this._alpha = alpha;
	      },
	      configurable: true
	    });
	    this.alpha = (typeof options.alpha === "undefined" ? 1 : options.alpha);
	    /*
	    @attribute rotation
	    @type {Number}
	    @default 0
	    */
	
	    this.rotation = options.rotation || 0;
	    /*
	    @attribute smooth
	    @type {Boolean}
	    @default false
	    */
	
	    this.smooth = (typeof options.smooth === "undefined" ? true : options.smooth);
	    this._matrix = Matrix2d.identity.clone();
	    Object.defineProperty(this, "position", {
	      get: function() {
	        if (!this._position) {
	          this._position = new Vector2d(0, 0);
	        }
	        return this._position;
	      },
	      set: function(vector) {
	        return this._position = vector.clone();
	      }
	    });
	    Object.defineProperty(this, "x", {
	      get: function() {
	        return this.position.x || 0;
	      },
	      set: function(x) {
	        return this.position.x = x;
	      }
	    });
	    if (options.x) {
	      this.x = options.x;
	    }
	    Object.defineProperty(this, "y", {
	      get: function() {
	        return this.position.y || 0;
	      },
	      set: function(y) {
	        return this.position.y = y;
	      }
	    });
	    if (options.y) {
	      this.y = options.y;
	    }
	    Object.defineProperty(this, "width", {
	      get: function() {
	        return this._width || 0;
	      },
	      set: function(w) {
	        return this._width = w;
	      },
	      configurable: true
	    });
	    if (options.width) {
	      this.width = options.width;
	    }
	    Object.defineProperty(this, "height", {
	      get: function() {
	        return this._height || 0;
	      },
	      set: function(h) {
	        return this._height = h;
	      },
	      configurable: true
	    });
	    if (options.height) {
	      this.height = options.height;
	    }
	    Object.defineProperty(this, "parent", {
	      get: function() {
	        return this._parent || 'undefined';
	      },
	      set: function(parent) {
	        this._parent = parent;
	        return this._parent.addChild(this);
	      }
	    });
	    if (options.parent) {
	      this.parent = options.parent;
	    }
	    Object.defineProperty(this, "visible", {
	      get: function() {
	        if (this.alpha <= 0 || !this._visible) {
	          return false;
	        }
	        return true;
	      },
	      set: function(visibility) {
	        return this._visible = Boolean(visibility);
	      }
	    });
	    this.visible = (options.visible ? options.visible : void 0) || true;
	  }
	
	  Widget.prototype.render = function(ctx) {
	    var bit, mtx;
	    if (!this.visible) {
	      return;
	    }
	    bit = {
	      "false": -1,
	      "true": 1
	    };
	    mtx = Matrix2d.identity.appendTransform(this.position.x + this.width * (this.flipX + 0), this.position.y + this.height * (this.flipY + 0), this.scale.x * bit[!this.flipX], this.scale.y * bit[!this.flipY], this.rotation, this.skew.x, this.skew.y, this.pivot.x, this.pivot.y);
	    ctx.save();
	    ctx.beginPath();
	    ctx.scale(this.scale.x, this.scale.y);
	    ctx.translate(this.position.x, this.position.y);
	    ctx.transform(mtx.m11, mtx.m12, mtx.m21, mtx.m22, mtx.dx, mtx.dy);
	    ctx.rotate(0.0174532925 * this.rotation);
	    ctx.setAlpha(this.alpha);
	    if (this.compositeOperation) {
	      ctx.globalCompositeOperation = this.compositeOperation;
	    }
	    ctx[Support.imageSmoothingEnabled] = this.smooth;
	    ctx.setAlpha(this.alpha);
	    if (this._render) {
	      this._render(ctx);
	    }
	    ctx.scale(1 / this.scale.x, 1 / this.scale.y);
	    ctx.translate(-this.position.x, -this.position.y);
	    ctx.closePath();
	    ctx.restore();
	    return this.dispatchEvent('render');
	  };
	
	  /*
	  @method toString
	  @return {String} String representation of object
	  */
	
	
	  Widget.prototype.toString = function() {
	    return "<Widget (" + this.id + ")>";
	  };
	
	  return Widget;
	
	})(Events);


/***/ },
/* 13 */
/*!*********************************!*\
  !*** ./src/ui/container.coffee ***!
  \*********************************/
/***/ function(module, exports, require) {

	var Container, Widget,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
	
	Widget = require(/*! ./widget */ 12);
	
	/*
	Base widgets container
	@note GameCore.exports.ui.Container
	*/
	
	
	module.exports = Container = (function(_super) {
	  __extends(Container, _super);
	
	  function Container(options) {
	    if (options == null) {
	      options = {};
	    }
	    Container.__super__.constructor.call(this, options);
	    this.children = {};
	  }
	
	  Container.prototype.addChild = function(child) {
	    if (child.parent === !this) {
	      return child.parent = this;
	    } else {
	      return this.children[child.id] = child;
	    }
	  };
	
	  Container.prototype._render = function(ctx) {
	    var child, cid, _ref, _results;
	    _ref = this.children;
	    _results = [];
	    for (cid in _ref) {
	      child = _ref[cid];
	      _results.push(child.render(ctx));
	    }
	    return _results;
	  };
	
	  Container.prototype.render = function(ctx) {
	    return Container.__super__.render.call(this, ctx);
	  };
	
	  return Container;
	
	})(Widget);


/***/ },
/* 14 */
/*!****************************!*\
  !*** ./src/ui/text.coffee ***!
  \****************************/
/***/ function(module, exports, require) {

	var BASELINE, Color, DEFAULT_ALIGN, DEFAULT_BASELINE, DEFAULT_COLOR, DEFAULT_FONT, Font, Text, Widget,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
	
	Widget = require(/*! ./widget */ 12);
	
	Color = require(/*! ../utils/color */ 20);
	
	Font = require(/*! ../utils/font */ 21);
	
	/*
	Object.defineProperty this, BASELINE
	@static
	*/
	
	
	BASELINE = {
	  /*
	  Object.defineProperty this, BASELINE.TOP
	  @type {String}
	  @static
	  */
	
	  TOP: "top",
	  /*
	  Object.defineProperty this, BASELINE.HANGING
	  @type {String}
	  @static
	  */
	
	  HANGING: "hanging",
	  /*
	  Object.defineProperty this, BASELINE.MIDDLE
	  @type {String}
	  @static
	  */
	
	  MIDDLE: "middle",
	  /*
	  Object.defineProperty this, BASELINE.ALPHABETIC
	  @type {String}
	  @static
	  */
	
	  ALPHABETIC: "alphabetic",
	  /*
	  Object.defineProperty this, BASELINE.IDEOGRAPHIC
	  @type {String}
	  @static
	  */
	
	  IDEOGRAPHIC: "ideographic",
	  /*
	  Object.defineProperty this, BASELINE.BOTTOM
	  @type {String}
	  @static
	  */
	
	  BOTTOM: "bottom"
	};
	
	DEFAULT_FONT = new Font();
	
	DEFAULT_COLOR = new Color("black");
	
	DEFAULT_ALIGN = "left";
	
	DEFAULT_BASELINE = BASELINE.TOP;
	
	/*
	Base Text widget
	@note GameCore.exports.ui.Text
	*/
	
	
	Text = (function(_super) {
	  __extends(Text, _super);
	
	  /*
	  @class Text
	  @extends DisplayObject
	  
	  @param {Object} options any attribute may be initialized by option
	  @param {String} [options.text] default - ""
	  @param {String} [options.font] default - "Normal 12px Verdana"
	  @param {String} [options.align] default - "left"
	  @param {String} [options.baseline] default - Joy.Text.BASELINE.TOP
	  @param {String} [options.color] default - #000000
	  
	  @constructor
	  */
	
	
	  function Text(options) {
	    if (options == null) {
	      options = {};
	    }
	    Text.__super__.constructor.call(this, options);
	    /*
	    Text to be displayed
	    @attribute text
	    @default ""
	    @type {String}
	    */
	
	    this.text = options.text || "";
	    /*
	    Font family and size
	    @attribute font
	    @default "Normal 12px Verdana"
	    @type {String}
	    */
	
	    Object.defineProperty(this, 'font', {
	      get: function() {
	        if (!this._font) {
	          this.font = options.font || DEFAULT_FONT;
	        }
	        return this._font;
	      },
	      set: function(font) {
	        this._font = font;
	        return this.__measure = Text.MeasureText(this.text, this._font);
	      }
	    });
	    /*
	    Text horizontal alignment
	    @attribute align
	    @default "left"
	    @type {String}
	    */
	
	    this.align = options.align || DEFAULT_ALIGN;
	    /*
	    Text vertical baseline
	    @attribute baseline
	    @default Joy.Text.BASELINE.TOP
	    @type {String}
	    */
	
	    this.baseline = options.baseline || DEFAULT_BASELINE;
	    /*
	    Color of the text
	    @attribute color
	    @default "#000000"
	    @type {String, Color}
	    */
	
	    Object.defineProperty(this, "color", {
	      get: function() {
	        if (!this._color) {
	          this.color = options.color || DEFAULT_COLOR;
	        }
	        return this._color;
	      },
	      set: function(color) {
	        this._color = typeof color === "string" ? new Color(color) : color;
	        return this.alpha = this._color.a;
	      },
	      configurable: true
	    });
	    if (options.stroke) {
	      this.useStroke();
	    } else {
	      this.useFill();
	    }
	    Object.defineProperty(this, "width", {
	      get: function() {
	        if (!this.__measure) {
	          this.__measure = Text.MeasureText(this.text, this.font);
	        }
	        if (this.__measure) {
	          return this.__measure.width;
	        } else {
	          return 0;
	        }
	      }
	    });
	    Object.defineProperty(this, "height", {
	      get: function() {
	        if (!this.__measure) {
	          this.__measure = Text.MeasureText(this.text, this.font);
	        }
	        if (this.__measure) {
	          return this.__measure.height;
	        } else {
	          return 0;
	        }
	      }
	    });
	  }
	
	  /*
	  @method useStroke
	  */
	
	
	  Text.prototype.useStroke = function() {
	    this.stroke = true;
	    this.fillMethod = "strokeText";
	    return this.styleMethod = "strokeStyle";
	  };
	
	  /*
	  @method useFill
	  */
	
	
	  Text.prototype.useFill = function() {
	    this.stroke = false;
	    this.fillMethod = "fillText";
	    return this.styleMethod = "fillStyle";
	  };
	
	  Text.prototype._render = function(ctx) {
	    ctx.font = this.font.toString();
	    ctx.textAlign = this.align;
	    ctx.textBaseline = this.baseline;
	    ctx[this.styleMethod] = this.color.toString();
	    ctx[this.fillMethod](this.text, 0, 0);
	    return this.getMeasure(ctx);
	  };
	
	  /*
	  @method getMeasure
	  @return {TextMetrics} text metrics
	  */
	
	
	  Text.prototype.getMeasure = function(ctx) {
	    var m;
	    this.__measure = {};
	    m = Text.MeasureText(this.text, this.font);
	    this.__measure.width = m[0];
	    return this.__measure.height = m[1];
	  };
	
	  /*
	  @method toString
	  @return {String} String representation of object
	  */
	
	
	  Text.prototype.toString = function() {
	    return "" + this.text;
	  };
	
	  Text.BASELINE = BASELINE;
	
	  Text.MeasureText = function(text, font) {
	    var div, size, str;
	    str = text + ":" + font;
	    if (typeof this.__measuretext_cache__ === "object" && this.__measuretext_cache__[str]) {
	      return this.__measuretext_cache__[str];
	    }
	    div = document.createElement("DIV");
	    div.innerHTML = text;
	    div.style.position = "absolute";
	    div.style.top = "-100px";
	    div.style.left = "-100px";
	    div.style.font = font.toString();
	    document.body.appendChild(div);
	    size = [div.offsetWidth, div.offsetHeight];
	    document.body.removeChild(div);
	    if (typeof this.__measuretext_cache__ !== "object") {
	      this.__measuretext_cache__ = {};
	    }
	    this.__measuretext_cache__[str] = size;
	    return size;
	  };
	
	  return Text;
	
	})(Widget);
	
	module.exports = Text;


/***/ },
/* 15 */
/*!******************************!*\
  !*** ./src/ui/sprite.coffee ***!
  \******************************/
/***/ function(module, exports, require) {

	var Color, Sprite, Widget,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
	
	Widget = require(/*! ./widget */ 12);
	
	Color = require(/*! ../utils/color */ 20);
	
	module.exports = Sprite = (function(_super) {
	  __extends(Sprite, _super);
	
	  function Sprite(options) {
	    var self;
	    if (options == null) {
	      options = {};
	    }
	    Sprite.__super__.constructor.call(this, options);
	    self = this;
	    this.loaded = false;
	    if (!options.image) {
	      if (!options.src) {
	        throw new Error('Not found required `src` or `image` atribute in options.');
	      }
	      this.image = new Image();
	      this.image.src = options.src;
	    } else {
	      this.image = options.image;
	    }
	    this.image.addEventListener('load', function() {
	      return self.on_load.apply(self, [options.width || false, options.height || false]);
	    });
	  }
	
	  Sprite.prototype.on_load = function(w, h) {
	    this.loaded = true;
	    if (!w) {
	      this.width = this.image.width;
	    }
	    if (!h) {
	      return this.height = this.image.height;
	    }
	  };
	
	  Sprite.prototype._render = function(ctx) {
	    if (this.loaded) {
	      return ctx.drawImage(this.image, 0, 0, this.width, this.height);
	    } else {
	      return ctx.fillRect(0, 0, this.width, this.height);
	    }
	  };
	
	  Sprite.prototype.clone = function() {
	    return new Sprite({
	      width: this.width,
	      height: this.height,
	      image: this.image,
	      parent: this.parent,
	      position: this.position,
	      visible: this.visible,
	      alpha: this.alpha
	    });
	  };
	
	  /*
	  @method toString
	  @return {String} String representation of object
	  */
	
	
	  Sprite.prototype.toString = function() {
	    return "<Sprite (" + this.id + ")>";
	  };
	
	  return Sprite;
	
	})(Widget);


/***/ },
/* 16 */
/*!****************************************!*\
  !*** ./src/ui/geometry/exports.coffee ***!
  \****************************************/
/***/ function(module, exports, require) {

	module.exports = {
	  Circle: require(/*! ./circle */ 25),
	  Rect: require(/*! ./rect */ 26)
	};


/***/ },
/* 17 */
/*!**********************************!*\
  !*** ./src/math/matrix2d.coffee ***!
  \**********************************/
/***/ function(module, exports, require) {

	/*
	2D Matrix manipulations
	
	@note GameCore.exports.Math.Matrix2D
	*/
	
	var Matrix2D;
	
	Matrix2D = (function() {
	  /*           
	  Multiplier for converting degrees to radians. Used internally by Matrix2D.
	  
	  @attribute DEG_TO_RAD
	  @static
	  @readonly
	  @return {Number}
	  */
	
	  Matrix2D.DEG_TO_RAD = Math.PI / 180;
	
	  /*
	  Based on [EaselJS](https://github.com/CreateJS/EaselJS/) Matrix2D implementation.
	  
	  @class Matrix2D
	  @constructor
	  
	  @param {Number} m11
	  @param {Number} m12
	  @param {Number} m21
	  @param {Number} m22
	  @param {Number} dx
	  @param {Number} dy
	  */
	
	
	  function Matrix2D(m11, m12, m21, m22, dx, dy) {
	    if (m11 !== null) {
	      this.m11 = m11;
	    }
	    this.m12 = m12 || 0;
	    this.m21 = m21 || 0;
	    if (m22 !== null) {
	      this.m22 = m22;
	    }
	    this.dx = dx || 0;
	    this.dy = dy || 0;
	  }
	
	  /*
	  Generates matrix properties from the specified display object transform properties, and appends them with this matrix.
	  For example, you can use this to generate m11 matrix from m11 display object: var mtx = new Matrix2D();
	  mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
	  @method appendTransform
	  @param {Number} x
	  @param {Number} y
	  @param {Number} scaleX
	  @param {Number} scaleY
	  @param {Number} rotation
	  @param {Number} skewX
	  @param {Number} skewY
	  @param {Number} pivotX Optional.
	  @param {Number} pivotY Optional.
	  @return {Matrix2D} This matrix. Useful for chaining method calls.
	  */
	
	
	  Matrix2D.prototype.appendTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, pivotX, pivotY) {
	    var cos, r, sin;
	    cos = void 0;
	    sin = void 0;
	    r = void 0;
	    if (rotation % 360) {
	      r = rotation * Matrix2D.DEG_TO_RAD;
	      cos = Math.cos(r);
	      sin = Math.sin(r);
	    } else {
	      cos = 1;
	      sin = 0;
	    }
	    if (skewX || skewY) {
	      skewX *= Matrix2D.DEG_TO_RAD;
	      skewY *= Matrix2D.DEG_TO_RAD;
	      this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
	      this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
	    } else {
	      this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
	    }
	    if (pivotX || pivotY) {
	      this.dx -= pivotX * this.m11 + pivotY * this.m21;
	      this.dy -= pivotX * this.m12 + pivotY * this.m22;
	    }
	    return this;
	  };
	
	  /*
	  Appends the specified matrix properties with this matrix. All parameters are required.
	  @method append
	  @param {Number} m11
	  @param {Number} m12
	  @param {Number} m21
	  @param {Number} m22
	  @param {Number} dx
	  @param {Number} dy
	  @return {Matrix2D} This matrix. Useful for chaining method calls.
	  */
	
	
	  Matrix2D.prototype.append = function(m11, m12, m21, m22, dx, dy) {
	    var a1, b1, c1, d1;
	    a1 = this.m11;
	    b1 = this.m12;
	    c1 = this.m21;
	    d1 = this.m22;
	    this.m11 = m11 * a1 + m12 * c1;
	    this.m12 = m11 * b1 + m12 * d1;
	    this.m21 = m21 * a1 + m22 * c1;
	    this.m22 = m21 * b1 + m22 * d1;
	    this.dx = dx * a1 + dy * c1 + this.dx;
	    this.dy = dx * b1 + dy * d1 + this.dy;
	    return this;
	  };
	
	  /*
	  Inverts the matrix, causing it to perform the opposite transformation.
	  @method invert
	  @return {Matrix2D} this
	  */
	
	
	  Matrix2D.prototype.invert = function() {
	    var a1, b1, c1, d1, n, tx1;
	    a1 = this.m11;
	    b1 = this.m12;
	    c1 = this.m21;
	    d1 = this.m22;
	    tx1 = this.dx;
	    n = a1 * d1 - b1 * c1;
	    this.m11 = d1 / n;
	    this.m12 = -b1 / n;
	    this.m21 = -c1 / n;
	    this.m22 = a1 / n;
	    this.dx = (c1 * this.dy - d1 * tx1) / n;
	    this.dy = -(a1 * this.dy - b1 * tx1) / n;
	    return this;
	  };
	
	  /*
	  Clone Matrix2D instance
	  @return {Matrix2D}
	  */
	
	
	  Matrix2D.prototype.clone = function() {
	    return new Matrix2D(this.m11, this.m12, this.m21, this.m22, this.dx, this.dy);
	  };
	
	  /*
	  Reset matrix to it's identity
	  @return {Matrix2D} this
	  */
	
	
	  Matrix2D.prototype.identity = function() {
	    this.m11 = this.m22 = 1;
	    this.m12 = this.m21 = this.dx = this.dy = 0;
	    return this;
	  };
	
	  Matrix2D.identity = new Matrix2D(1, 0, 0, 1, 0, 0);
	
	  return Matrix2D;
	
	})();
	
	module.exports = Matrix2D;


/***/ },
/* 18 */
/*!**********************************!*\
  !*** ./src/math/vector2d.coffee ***!
  \**********************************/
/***/ function(module, exports, require) {

	/*
	2D Vector manipulations
	
	@note GameCore.exports.Math.Vector2D
	*/
	
	var Vector2d;
	
	Vector2d = (function() {
	  function Vector2d(x, y) {
	    this.x = x != null ? x : 0;
	    this.y = y != null ? y : 0;
	    /*
	    Get the magnitude of this vector
	    @attribute length
	    @readonly
	    */
	
	    Object.defineProperty(this, "length", {
	      get: function() {
	        return Math.sqrt((this.x * this.x) + (this.y * this.y));
	      },
	      configurable: true
	    });
	    /*
	    Get this vector with a magnitude of 1.
	    @attribute normalized
	    @readonly
	    */
	
	    Object.defineProperty(this, "normalized", {
	      get: function() {
	        var magnitude;
	        magnitude = this.length;
	        return new Vector2d(this.x / magnitude, this.y / magnitude);
	      },
	      configurable: true
	    });
	  }
	
	  /*
	  @method set
	  @param {Number} x
	  @param {Number} y
	  @return {Vector2d}
	  */
	
	
	  Vector2d.prototype.set = function(x, y) {
	    this.x = x;
	    this.y = y;
	    return this;
	  };
	
	  /*
	  @method sum
	  @param {Vector2d} vector2d
	  @return {Vector2d}
	  */
	
	
	  Vector2d.prototype.subtract = function(vector2d) {
	    this.x -= vector2d.x;
	    this.y -= vector2d.y;
	    return this;
	  };
	
	  /*
	  @method sum
	  @param {Vector2d} vector2d
	  @return {Vector2d}
	  */
	
	
	  Vector2d.prototype.sum = function(vector2d) {
	    this.x += vector2d.x;
	    this.y += vector2d.y;
	    return this;
	  };
	
	  /*
	  @method scale
	  @param {Number} x (or x y)
	  @param {Number} y
	  @return {Vector2d}
	  */
	
	
	  Vector2d.prototype.scale = function(x, y) {
	    this.x *= x;
	    this.y *= y || x;
	    return this;
	  };
	
	  /*
	  @method clone
	  @return {Vector2d}
	  */
	
	
	  Vector2d.prototype.clone = function() {
	    return new Vector2d(this.x, this.y);
	  };
	
	  /*
	  Return unit vector
	  @return {Vector2d}
	  */
	
	
	  Vector2d.prototype.unit = function() {
	    return new Vector2d(Math.cos(this.x), Math.sin(this.y));
	  };
	
	  /*
	  Normalize this vector
	  @return {Vector2d}
	  */
	
	
	  Vector2d.prototype.normalize = function() {
	    var normal;
	    normal = this.normalized;
	    this.x = normal.x;
	    this.y = normal.y;
	    return this;
	  };
	
	  /*
	  Get the distance between this vector and the argument vector
	  @param {Vector2d} vector
	  @return {Number}
	  */
	
	
	  Vector2d.distance = function(v1, v2) {
	    var xdiff, ydiff;
	    xdiff = v1.x - v2.x;
	    ydiff = v1.y - v2.y;
	    return Math.sqrt(xdiff * xdiff + ydiff * ydiff);
	  };
	
	  /*
	  @method toString
	  @return {String}
	  */
	
	
	  Vector2d.prototype.toString = function() {
	    return "#<Vector2d @x=" + this.x + ", @y=" + this.y + ">";
	  };
	
	  Vector2d.LEFT = new Vector2d(-1, 0);
	
	  Vector2d.RIGHT = new Vector2d(1, 0);
	
	  Vector2d.TOP = new Vector2d(0, -1);
	
	  Vector2d.BOTTOM = new Vector2d(0, 1);
	
	  return Vector2d;
	
	})();
	
	module.exports = Vector2d;


/***/ },
/* 19 */
/*!******************************!*\
  !*** ./src/math/math.coffee ***!
  \******************************/
/***/ function(module, exports, require) {

	/*
	Mathematical functions
	
	@note GameCore.exports.Math.Math
	
	@see http://docs.closure-library.googlecode.com/git-history/418ef20b29e8f3ebb5121266ec7206ae6943d28d/closure_goog_math_math.js.source.html
	*/
	
	var Mathematics;
	
	Mathematics = (function() {
	  function Mathematics() {}
	
	  /*
	  Clamping a number into a limits
	  
	  @method clamp
	  @param {Number} num
	  @param {Number} min
	  @param {Number} max
	  @return {Number}
	  */
	
	
	  Mathematics.clamp = function(num, min, max) {
	    return Math.min(Math.max(num, min), max);
	  };
	
	  /*
	  Alias to @clamp(num, 0, 1)
	  
	  @method clamp01
	  @param {Number} num
	  @return {Number}
	  */
	
	
	  Mathematics.clamp01 = function(num) {
	    return this.clamp(num, 0, 1);
	  };
	
	  /*
	  Returns a random integer greater than or equal to $min and less than $max.
	  
	  @param {Number} a  The lower bound for the random integer inclusive (default=0).
	  @param {Number} a  The upper bound for the random integer exlusive (default=1000).
	  @return {Number} A random integer N such that $min <= N < $max.
	  */
	
	
	  Mathematics.randomInt = function(min, max) {
	    if (min == null) {
	      min = 0;
	    }
	    if (max == null) {
	      max = 100;
	    }
	    return Math.floor(min + Math.random() * (max - min));
	  };
	
	  /*
	  The % operator in JavaScript returns the remainder of a / b, but differs from
	  some other languages in that the result will have the same sign as the
	  dividend. For example, -1 % 8 == -1, whereas in some other languages
	  (such as Python) the result would be 7. This function emulates the more
	  correct modulo behavior, which is useful for certain applications such as
	  calculating an offset index in a circular list.
	   
	  @param {number} a The dividend.
	  @param {number} b The divisor.
	  @return {number} a % b where the result is between 0 and b (either 0 <= x < b
	    or b < x <= 0, depending on the sign of b).
	  */
	
	
	  Mathematics.modulo = function(a, b) {
	    var r;
	    r = a % b;
	    if (r * b < 0) {
	      return r + b;
	    } else {
	      return r;
	    }
	  };
	
	  /*
	  Performs linear interpolation between values a and b. Returns the value
	  between a and b proportional to x (when x is between 0 and 1. When x is
	  outside this range, the return value is a linear extrapolation).
	  
	  @param {number} a A number.
	  @param {number} b A number.
	  @param {number} x The proportion between a and b.
	  @return {number} The interpolated value between a and b.
	  */
	
	
	  Mathematics.lerp = function(a, b, x) {
	    return a + x * (b - a);
	  };
	
	  /*
	  Tests whether the two values are equal to each other, within a certain
	  tolerance to adjust for floating pount errors.
	  
	  @param {Number} a A number.
	  @param {Number} b A number.
	  @param {Number=} opt_tolerance Optional tolerance range.
	      Defaults to 0.000001. If specified, should be greater than 0.
	  @return {Boolean} Whether $a and $b are nearly equal.
	  */
	
	
	  Mathematics.nearlyEquals = function(a, b, opt_tolerance) {
	    if (opt_tolerance == null) {
	      opt_tolerance = 0.000001;
	    }
	    return Math.abs(a - b) <= opt_tolerance;
	  };
	
	  return Mathematics;
	
	})();
	
	module.exports = Mathematics;


/***/ },
/* 20 */
/*!********************************!*\
  !*** ./src/utils/color.coffee ***!
  \********************************/
/***/ function(module, exports, require) {

	/*
	Inspired by TinyColor
	@see https://github.com/bgrins/TinyColor
	*/
	
	var COLOR_NAMES, COLOR_NAMES_F, CSS_INTEGER, CSS_NUMBER, CSS_UNIT, Color, Mathematic, PERMISSIVE_MATCH3, PERMISSIVE_MATCH4, bound01, convertToPercentage, flip, isOnePointZero, isPercentage, matchers, pad2, parseHex, stringInputToObject, trimLeft, trimRight;
	
	Mathematic = require(/*! ../math/math */ 19);
	
	/*
	*/
	
	
	COLOR_NAMES = {
	  aliceblue: "f0f8ff",
	  antiquewhite: "faebd7",
	  aqua: "0ff",
	  aquamarine: "7fffd4",
	  azure: "f0ffff",
	  beige: "f5f5dc",
	  bisque: "ffe4c4",
	  black: "000",
	  blanchedalmond: "ffebcd",
	  blue: "00f",
	  blueviolet: "8a2be2",
	  brown: "a52a2a",
	  burlywood: "deb887",
	  burntsienna: "ea7e5d",
	  cadetblue: "5f9ea0",
	  chartreuse: "7fff00",
	  chocolate: "d2691e",
	  coral: "ff7f50",
	  cornflowerblue: "6495ed",
	  cornsilk: "fff8dc",
	  crimson: "dc143c",
	  cyan: "0ff",
	  darkblue: "00008b",
	  darkcyan: "008b8b",
	  darkgoldenrod: "b8860b",
	  darkgray: "a9a9a9",
	  darkgreen: "006400",
	  darkgrey: "a9a9a9",
	  darkkhaki: "bdb76b",
	  darkmagenta: "8b008b",
	  darkolivegreen: "556b2f",
	  darkorange: "ff8c00",
	  darkorchid: "9932cc",
	  darkred: "8b0000",
	  darksalmon: "e9967a",
	  darkseagreen: "8fbc8f",
	  darkslateblue: "483d8b",
	  darkslategray: "2f4f4f",
	  darkslategrey: "2f4f4f",
	  darkturquoise: "00ced1",
	  darkviolet: "9400d3",
	  deeppink: "ff1493",
	  deepskyblue: "00bfff",
	  dimgray: "696969",
	  dimgrey: "696969",
	  dodgerblue: "1e90ff",
	  firebrick: "b22222",
	  floralwhite: "fffaf0",
	  forestgreen: "228b22",
	  fuchsia: "f0f",
	  gainsboro: "dcdcdc",
	  ghostwhite: "f8f8ff",
	  gold: "ffd700",
	  goldenrod: "daa520",
	  gray: "808080",
	  green: "008000",
	  greenyellow: "adff2f",
	  grey: "808080",
	  honeydew: "f0fff0",
	  hotpink: "ff69b4",
	  indianred: "cd5c5c",
	  indigo: "4b0082",
	  ivory: "fffff0",
	  khaki: "f0e68c",
	  lavender: "e6e6fa",
	  lavenderblush: "fff0f5",
	  lawngreen: "7cfc00",
	  lemonchiffon: "fffacd",
	  lightblue: "add8e6",
	  lightcoral: "f08080",
	  lightcyan: "e0ffff",
	  lightgoldenrodyellow: "fafad2",
	  lightgray: "d3d3d3",
	  lightgreen: "90ee90",
	  lightgrey: "d3d3d3",
	  lightpink: "ffb6c1",
	  lightsalmon: "ffa07a",
	  lightseagreen: "20b2aa",
	  lightskyblue: "87cefa",
	  lightslategray: "789",
	  lightslategrey: "789",
	  lightsteelblue: "b0c4de",
	  lightyellow: "ffffe0",
	  lime: "0f0",
	  limegreen: "32cd32",
	  linen: "faf0e6",
	  magenta: "f0f",
	  maroon: "800000",
	  mediumaquamarine: "66cdaa",
	  mediumblue: "0000cd",
	  mediumorchid: "ba55d3",
	  mediumpurple: "9370db",
	  mediumseagreen: "3cb371",
	  mediumslateblue: "7b68ee",
	  mediumspringgreen: "00fa9a",
	  mediumturquoise: "48d1cc",
	  mediumvioletred: "c71585",
	  midnightblue: "191970",
	  mintcream: "f5fffa",
	  mistyrose: "ffe4e1",
	  moccasin: "ffe4b5",
	  navajowhite: "ffdead",
	  navy: "000080",
	  oldlace: "fdf5e6",
	  olive: "808000",
	  olivedrab: "6b8e23",
	  orange: "ffa500",
	  orangered: "ff4500",
	  orchid: "da70d6",
	  palegoldenrod: "eee8aa",
	  palegreen: "98fb98",
	  paleturquoise: "afeeee",
	  palevioletred: "db7093",
	  papayawhip: "ffefd5",
	  peachpuff: "ffdab9",
	  peru: "cd853f",
	  pink: "ffc0cb",
	  plum: "dda0dd",
	  powderblue: "b0e0e6",
	  purple: "800080",
	  red: "f00",
	  rosybrown: "bc8f8f",
	  royalblue: "4169e1",
	  saddlebrown: "8b4513",
	  salmon: "fa8072",
	  sandybrown: "f4a460",
	  seagreen: "2e8b57",
	  seashell: "fff5ee",
	  sienna: "a0522d",
	  silver: "c0c0c0",
	  skyblue: "87ceeb",
	  slateblue: "6a5acd",
	  slategray: "708090",
	  slategrey: "708090",
	  snow: "fffafa",
	  springgreen: "00ff7f",
	  steelblue: "4682b4",
	  tan: "d2b48c",
	  teal: "008080",
	  thistle: "d8bfd8",
	  tomato: "ff6347",
	  turquoise: "40e0d0",
	  violet: "ee82ee",
	  wheat: "f5deb3",
	  white: "fff",
	  whitesmoke: "f5f5f5",
	  yellow: "ff0",
	  yellowgreen: "9acd32"
	};
	
	trimLeft = /^[\s,#]+/;
	
	trimRight = /\s+$/;
	
	flip = function(o) {
	  var flipped, k, v;
	  flipped = {};
	  for (k in o) {
	    v = o[k];
	    flipped[v] = k;
	  }
	  return flipped;
	};
	
	bound01 = function(n, max) {
	  var processPercent;
	  if (isOnePointZero(n)) {
	    n = "100%";
	  }
	  processPercent = isPercentage(n);
	  n = Math.min(max, Math.max(0, parseFloat(n)));
	  if (processPercent) {
	    n = parseInt(n * max, 10) / 100;
	  }
	  if (Math.abs(n - max) < 0.000001) {
	    return 1;
	  }
	  return (n % max) / parseFloat(max);
	};
	
	parseHex = function(val) {
	  return parseInt(val, 16);
	};
	
	isOnePointZero = function(n) {
	  return typeof n === "string" && n.indexOf(".") !== -1 && parseFloat(n) === 1;
	};
	
	isPercentage = function(n) {
	  return typeof n === "string" && n.indexOf("%") !== -1;
	};
	
	pad2 = function(c) {
	  if (c.length === 1) {
	    return "0" + c;
	  } else {
	    return "" + c;
	  }
	};
	
	convertToPercentage = function(n) {
	  if (n <= 1) {
	    n = (n * 100) + "%";
	  }
	  return n;
	};
	
	COLOR_NAMES_F = flip(COLOR_NAMES);
	
	CSS_INTEGER = "[-\\+]?\\d+%?";
	
	CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
	
	CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";
	
	PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
	
	PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
	
	matchers = {
	  rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
	  rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
	  hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
	  hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
	  hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
	  hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
	  hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
	};
	
	/*
	Color operations
	
	@note GameCore.exports.utils.Color
	*/
	
	
	module.exports = Color = (function() {
	  /*
	  @param {String | Color} hex color string or color name or Color instance
	  @param {Object} options
	  */
	
	  function Color(options) {
	    var color, format, rgb;
	    if (options == null) {
	      options = {};
	    }
	    color = !options.color ? options : options.color || 'black';
	    rgb = Color.inputToRGB(color);
	    this.r = rgb.r;
	    this.g = rgb.g;
	    this.b = rgb.b;
	    this.a = options.alpha || rgb.a;
	    format = options.format || rgb.format || false;
	    Object.defineProperty(this, "roundA", {
	      get: function() {
	        return Math.round(100 * this.a) / 100;
	      }
	    });
	    if (this.r < 1) {
	      this.r = Math.round(this.r);
	    }
	    if (this.g < 1) {
	      this.g = Math.round(this.g);
	    }
	    if (this.b < 1) {
	      this.b = Math.round(this.b);
	    }
	  }
	
	  /*
	  @method toHsv
	  @return {Object} {h,s,v,a}
	  */
	
	
	  Color.prototype.toHsv = function() {
	    var hsv;
	    hsv = Color.rgbToHsv(this.r, this.g, this.b);
	    return {
	      h: hsv.h * 360,
	      s: hsv.s,
	      v: hsv.v,
	      a: this.a
	    };
	  };
	
	  /*
	  @method toHsvString
	  @return {String}
	  */
	
	
	  Color.prototype.toHsvString = function() {
	    var h, hsv, s, v;
	    hsv = Color.rgbToHsv(this.r, this.g, this.b);
	    h = Math.round(hsv.h * 360);
	    s = Math.round(hsv.s * 100);
	    v = Math.round(hsv.v * 100);
	    if (this.a === 1) {
	      return "hsv(" + h + ", " + s + "%, " + v + "%)";
	    } else {
	      return "hsva(" + h + ", " + s + "%, " + v + "%, " + this.roundA + ")";
	    }
	  };
	
	  /*
	  @method toHsl
	  @return {Object} {h,s,l,a}
	  */
	
	
	  Color.prototype.toHsl = function() {
	    var hsl;
	    hsl = Color.rgbToHsl(this.r, this.g, this.b);
	    return {
	      h: hsl.h * 360,
	      s: hsl.s,
	      l: hsl.l,
	      a: this.a
	    };
	  };
	
	  /*
	  @method toHslString
	  @return {String}
	  */
	
	
	  Color.prototype.toHslString = function() {
	    var h, hsl, l, s;
	    hsl = Color.rgbToHsl(this.r, this.g, this.b);
	    h = Math.round(hsl.h * 360);
	    s = Math.round(hsl.s * 100);
	    l = Math.round(hsl.l * 100);
	    if (this.a === 1) {
	      return "hsl(" + h + ", " + s + "%, " + l + "%)";
	    } else {
	      return "hsla(" + h + ", " + s + "%, " + l + "%, " + this.roundA + ")";
	    }
	  };
	
	  /*
	  @method toHex
	  @param {Boolean} allow3Char defaults=false
	  @return {String}
	  */
	
	
	  Color.prototype.toHex = function(allow3Char) {
	    if (allow3Char == null) {
	      allow3Char = false;
	    }
	    return Color.rgbToHex(this.r, this.g, this.b, allow3Char);
	  };
	
	  /*
	  @method toHexString
	  @param {Boolean} allow3Char defaults=false
	  @return {String} # + toHex()
	  */
	
	
	  Color.prototype.toHexString = function(allow3Char) {
	    if (allow3Char == null) {
	      allow3Char = false;
	    }
	    return "#" + this.toHex(allow3Char);
	  };
	
	  /*
	  @method toRgb
	  @return {Object} {r,g,b,a}
	  */
	
	
	  Color.prototype.toRgb = function() {
	    return {
	      r: Math.round(this.r),
	      g: Math.round(this.g),
	      b: Math.round(this.b),
	      a: this.a
	    };
	  };
	
	  /*
	  @method toRgbString
	  @return {String}
	  */
	
	
	  Color.prototype.toRgbString = function() {
	    if (this.a === 1) {
	      return "rgb(" + Math.round(this.r) + ", " + Math.round(this.g) + ", " + Math.round(this.b) + ")";
	    } else {
	      return "rgba(" + Math.round(this.r) + ", " + Math.round(this.g) + ", " + Math.round(this.b) + ", " + this.roundA + ")";
	    }
	  };
	
	  Color.prototype.toPercentageRgb = function() {
	    return {
	      r: Math.round(bound01(this.r, 255) * 100) + "%",
	      g: Math.round(bound01(this.g, 255) * 100) + "%",
	      b: Math.round(bound01(this.b, 255) * 100) + "%",
	      a: this.a
	    };
	  };
	
	  Color.prototype.toPercentageRgbString = function() {
	    if (this.a === 1) {
	      return "rgb(" + Math.round(bound01(this.r, 255) * 100) + "%, " + Math.round(bound01(this.g, 255) * 100) + "%, " + Math.round(bound01(this.b, 255) * 100) + "%)";
	    } else {
	      return "rgba(" + Math.round(bound01(this.r, 255) * 100) + "%, " + Math.round(bound01(this.g, 255) * 100) + "%, " + Math.round(bound01(this.b, 255) * 100) + "%, " + this.a + ")";
	    }
	  };
	
	  Color.prototype.toName = function() {
	    if (this.a === 0) {
	      return "transparent";
	    }
	    return COLOR_NAMES_F[Color.rgbToHex(this.r, this.g, this.b, true)] || false;
	  };
	
	  /*
	  Outputing current color as string
	  */
	
	
	  Color.prototype.toString = function(format) {
	    var formatSet, formatWithAlpha, formattedString, hasAlphaAndFormatNotSet;
	    formatSet = !!format;
	    format = format || this.format;
	    formattedString = false;
	    hasAlphaAndFormatNotSet = !formatSet && this.a < 1 && this.a > 0;
	    formatWithAlpha = hasAlphaAndFormatNotSet && (format === "hex" || format === "hex6" || format === "hex3" || format === "name");
	    if (format === "rgb") {
	      formattedString = this.toRgbString();
	    }
	    if (format === "prgb") {
	      formattedString = this.toPercentageRgbString();
	    }
	    if (format === "hex" || format === "hex6") {
	      formattedString = this.toHexString();
	    }
	    if (format === "hex3") {
	      formattedString = this.toHexString(true);
	    }
	    if (format === "name") {
	      formattedString = this.toName();
	    }
	    if (format === "hsl") {
	      formattedString = this.toHslString();
	    }
	    if (format === "hsv") {
	      formattedString = this.toHsvString();
	    }
	    if (formatWithAlpha) {
	      return this.toRgbString();
	    } else {
	      return formattedString || this.toHexString();
	    }
	  };
	
	  /*
	  */
	
	
	  Color.prototype.readable = function(color) {
	    return Color.readable(this, color);
	  };
	
	  Color.prototype.tetrad = function() {
	    return Color.tetrad(this);
	  };
	
	  Color.prototype.equals = function(color) {
	    return Color.equals(this, color);
	  };
	
	  Color.prototype.desaturate = function(amount) {
	    var color, rgb;
	    if (amount == null) {
	      amount = 10;
	    }
	    color = Color.desaturate(this, amount);
	    rgb = color.toRgb();
	    this.r = rgb.r;
	    this.g = rgb.g;
	    this.b = rgb.b;
	    return this;
	  };
	
	  Color.prototype.clone = function() {
	    return new Color(this.toString());
	  };
	
	  Color.prototype.darken = function(amount) {
	    var color, rgb;
	    if (amount == null) {
	      amount = 10;
	    }
	    color = Color.darken(this, amount);
	    rgb = color.toRgb();
	    this.r = rgb.r;
	    this.g = rgb.g;
	    this.b = rgb.b;
	    return this;
	  };
	
	  Color.prototype.lighten = function(amount) {
	    var color, rgb;
	    if (amount == null) {
	      amount = 10;
	    }
	    color = Color.lighten(this, amount);
	    rgb = color.toRgb();
	    this.r = rgb.r;
	    this.g = rgb.g;
	    this.b = rgb.b;
	    return this;
	  };
	
	  /*
	  If input is an object, force 1 into "1.0" to handle ratios properly
	  String input requires "1.0" as input, so 1 will be treated as 1
	  
	  Given a string or object, convert that input to RGB
	  Possible string inputs:
	  
	  "red"
	  "#f00" or "f00"
	  "#ff0000" or "ff0000"
	  "rgb 255 0 0" or "rgb (255, 0, 0)"
	  "rgb 1.0 0 0" or "rgb (1, 0, 0)"
	  "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
	  "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
	  "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
	  "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
	  "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
	  
	  @param {String | Color} color
	  */
	
	
	  Color.inputToRGB = function(color) {
	    var a, format, ok, rgb;
	    rgb = {
	      r: 0,
	      g: 0,
	      b: 0
	    };
	    a = 1;
	    ok = false;
	    format = false;
	    if (typeof color === "string") {
	      color = stringInputToObject(color);
	    }
	    if (typeof color === "object") {
	      if (color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b")) {
	        rgb = Color.rgbToRgb(color.r, color.g, color.b);
	        ok = true;
	        format = (String(color.r).substr(-1) === "%" ? "prgb" : "rgb");
	      } else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("v")) {
	        color.s = convertToPercentage(color.s);
	        color.v = convertToPercentage(color.v);
	        rgb = Color.hsvToRgb(color.h, color.s, color.v);
	        ok = true;
	        format = "hsv";
	      } else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l")) {
	        color.s = convertToPercentage(color.s);
	        color.l = convertToPercentage(color.l);
	        rgb = Color.hslToRgb(color.h, color.s, color.l);
	        ok = true;
	        format = "hsl";
	      }
	      if (color.hasOwnProperty("a")) {
	        a = color.a;
	      }
	    }
	    a = parseFloat(a);
	    if (isNaN(a) || a < 0 || a > 1) {
	      a = 1;
	    }
	    return {
	      ok: ok,
	      format: color.format || format,
	      r: Math.min(255, Math.max(rgb.r, 0)),
	      g: Math.min(255, Math.max(rgb.g, 0)),
	      b: Math.min(255, Math.max(rgb.b, 0)),
	      a: a
	    };
	  };
	
	  /*
	  Handle bounds / percentage checking to conform to CSS color spec
	  <http://www.w3.org/TR/css3-color/>
	  
	  @method rgbToRgb
	  
	  @param {Integer} r in 0..255 or 0..1
	  @param {Integer} g in 0..255 or 0..1
	  @param {Integer} b in 0..255 or 0..1
	  
	  @return {Object} { r, g, b } in 0..255
	  */
	
	
	  Color.rgbToRgb = function(r, g, b) {
	    return {
	      r: bound01(r, 255) * 255,
	      g: bound01(g, 255) * 255,
	      b: bound01(b, 255) * 255
	    };
	  };
	
	  /*
	  Converts an RGB color value to HSL.
	  
	  @method rgbToHsl
	  
	  @param {Integer} r in 0..255 or 0..1
	  @param {Integer} g in 0..255 or 0..1
	  @param {Integer} b in 0..255 or 0..1
	  
	  @return {Object} { h, s, l } in 0..1
	  */
	
	
	  Color.rgbToHsl = function(r, g, b) {
	    var d, h, l, max, min, s;
	    r = bound01(r, 255);
	    g = bound01(g, 255);
	    b = bound01(b, 255);
	    max = Math.max(r, g, b);
	    min = Math.min(r, g, b);
	    h = void 0;
	    s = void 0;
	    l = (max + min) / 2;
	    if (max === min) {
	      h = s = 0;
	    } else {
	      d = max - min;
	      s = (l > 0.5 ? d / (2 - max - min) : d / (max + min));
	      switch (max) {
	        case r:
	          h = (g - b) / d + (g < b ? 6 : 0);
	          break;
	        case g:
	          h = (b - r) / d + 2;
	          break;
	        case b:
	          h = (r - g) / d + 4;
	      }
	      h /= 6;
	    }
	    return {
	      h: h,
	      s: s,
	      l: l
	    };
	  };
	
	  /*
	  Converts an HSL color value to RGB.
	  
	  @method hslToRgb
	  @param {Integer} h in 0..360 or 0..1
	  @param {Integer} s in 0..100 or 0..1
	  @param {Integer} l in 0..100 or 0..1
	  @return {Object} { r, g, b } in 0..255
	  */
	
	
	  Color.hslToRgb = function(h, s, l) {
	    var b, g, hue2rgb, p, q, r;
	    hue2rgb = function(p, q, t) {
	      if (t < 0) {
	        t += 1;
	      }
	      if (t > 1) {
	        t -= 1;
	      }
	      if (t < 1 / 6) {
	        return p + (q - p) * 6 * t;
	      }
	      if (t < 1 / 2) {
	        return q;
	      }
	      if (t < 2 / 3) {
	        return p + (q - p) * (2 / 3 - t) * 6;
	      }
	      return p;
	    };
	    r = void 0;
	    g = void 0;
	    b = void 0;
	    h = bound01(h, 360);
	    s = bound01(s, 100);
	    l = bound01(l, 100);
	    if (s === 0) {
	      r = g = b = l;
	    } else {
	      q = (l < 0.5 ? l * (1 + s) : l + s - l * s);
	      p = 2 * l - q;
	      r = hue2rgb(p, q, h + 1 / 3);
	      g = hue2rgb(p, q, h);
	      b = hue2rgb(p, q, h - 1 / 3);
	    }
	    return {
	      r: r * 255,
	      g: g * 255,
	      b: b * 255
	    };
	  };
	
	  /*
	  Converts an RGB color value to HSV
	  
	  @method rgbToHsv
	  @param {Integer} r in 0..255 or 0..1
	  @param {Integer} g in 0..255 or 0..1
	  @param {Integer} b in 0..255 or 0..1
	  @return {Object} { h, s, v } in 0..1
	  */
	
	
	  Color.rgbToHsv = function(r, g, b) {
	    var d, h, max, min, s, v;
	    r = bound01(r, 255);
	    g = bound01(g, 255);
	    b = bound01(b, 255);
	    max = Math.max(r, g, b);
	    min = Math.min(r, g, b);
	    h = void 0;
	    s = void 0;
	    v = max;
	    d = max - min;
	    s = (max === 0 ? 0 : d / max);
	    if (max === min) {
	      h = 0;
	    } else {
	      switch (max) {
	        case r:
	          h = (g - b) / d + (g < b ? 6 : 0);
	          break;
	        case g:
	          h = (b - r) / d + 2;
	          break;
	        case b:
	          h = (r - g) / d + 4;
	      }
	      h /= 6;
	    }
	    return {
	      h: h,
	      s: s,
	      v: v
	    };
	  };
	
	  /*
	  Converts an HSV color value to RGB.
	  
	  @method hsvToRgb
	  @param {Integer} h in 0..360 or 0..1
	  @param {Integer} s in 0..100 or 0..1
	  @param {Integer} v in 0..100 or 0..1
	  @return {Object} { r, g, b } in 0..255
	  */
	
	
	  Color.hsvToRgb = function(h, s, v) {
	    var b, f, g, i, mod, p, q, r, t;
	    h = bound01(h, 360) * 6;
	    s = bound01(s, 100);
	    v = bound01(v, 100);
	    i = Math.floor(h);
	    f = h - i;
	    p = v * (1 - s);
	    q = v * (1 - f * s);
	    t = v * (1 - (1 - f) * s);
	    mod = i % 6;
	    r = [v, q, p, p, t, v][mod];
	    g = [t, v, v, q, p, p][mod];
	    b = [p, p, t, v, v, q][mod];
	    return {
	      r: r * 255,
	      g: g * 255,
	      b: b * 255
	    };
	  };
	
	  /*
	  Converts an RGB color to hex
	  
	  @method rgbToHex
	  @param {Integer} r in 0..255
	  @param {Integer} g in 0..255
	  @param {Integer} b in 0..255
	  @param {Boolean} allow3Char
	  @return {String} 3 or 6 character hex
	  */
	
	
	  Color.rgbToHex = function(r, g, b, allow3Char) {
	    var hex;
	    if (allow3Char == null) {
	      allow3Char = false;
	    }
	    hex = [pad2(Math.round(r).toString(16)), pad2(Math.round(g).toString(16)), pad2(Math.round(b).toString(16))];
	    if (allow3Char && hex[0].charAt(0) === hex[0].charAt(1) && hex[1].charAt(0) === hex[1].charAt(1) && hex[2].charAt(0) === hex[2].charAt(1)) {
	      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
	    }
	    return hex.join("");
	  };
	
	  return Color;
	
	})();
	
	/*
	Permissive string parsing. Take in a number of formats, and output an object
	based on detected format.
	@method stringInputToObject
	@param {String | Color} color
	@return {Object} `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
	*/
	
	
	stringInputToObject = function(color) {
	  var match, named;
	  color = color.replace(trimLeft, "").replace(trimRight, "").toLowerCase();
	  named = false;
	  if (COLOR_NAMES[color]) {
	    color = COLOR_NAMES[color];
	    named = true;
	  } else if (color === "transparent") {
	    ({
	      r: 0,
	      g: 0,
	      b: 0,
	      a: 0,
	      format: "name"
	    });
	  }
	  match = void 0;
	  if (match = matchers.rgb.exec(color)) {
	    return {
	      r: match[1],
	      g: match[2],
	      b: match[3]
	    };
	  }
	  if (match = matchers.rgba.exec(color)) {
	    return {
	      r: match[1],
	      g: match[2],
	      b: match[3],
	      a: match[4]
	    };
	  }
	  if (match = matchers.hsl.exec(color)) {
	    return {
	      h: match[1],
	      s: match[2],
	      l: match[3]
	    };
	  }
	  if (match = matchers.hsla.exec(color)) {
	    return {
	      h: match[1],
	      s: match[2],
	      l: match[3],
	      a: match[4]
	    };
	  }
	  if (match = matchers.hsv.exec(color)) {
	    return {
	      h: match[1],
	      s: match[2],
	      v: match[3]
	    };
	  }
	  if (match = matchers.hex6.exec(color)) {
	    return {
	      r: parseHex(match[1]),
	      g: parseHex(match[2]),
	      b: parseHex(match[3]),
	      format: (named ? "name" : "hex")
	    };
	  }
	  if (match = matchers.hex3.exec(color)) {
	    return {
	      r: parseHex(match[1] + "" + match[1]),
	      g: parseHex(match[2] + "" + match[2]),
	      b: parseHex(match[3] + "" + match[3]),
	      format: (named ? "name" : "hex")
	    };
	  }
	  return false;
	};
	
	Color.fromRatio = function(color, opts) {
	  var i, newColor;
	  if (opts == null) {
	    opts = {};
	  }
	  if (typeof color === "object") {
	    newColor = {};
	    for (i in color) {
	      if (color.hasOwnProperty(i)) {
	        if (i === "a") {
	          newColor[i] = color[i];
	        } else {
	          newColor[i] = convertToPercentage(color[i]);
	        }
	      }
	    }
	    color = newColor;
	  }
	  return new Color(color, opts);
	};
	
	Color.equals = function(color1, color2) {
	  if (!color1 || !color2) {
	    return false;
	  }
	  return (new Color(color1)).toRgbString() === (new Color(color2)).toRgbString();
	};
	
	Color.random = function() {
	  return Color.fromRatio({
	    r: Math.random(),
	    g: Math.random(),
	    b: Math.random()
	  });
	};
	
	Color.desaturate = function(color, amount) {
	  var hsl;
	  if (amount == null) {
	    amount = 10;
	  }
	  hsl = (new Color(color)).toHsl();
	  hsl.s -= amount / 100;
	  hsl.s = Mathematic.clamp01(hsl.s);
	  return new Color(hsl);
	};
	
	Color.saturate = function(color, amount) {
	  var hsl;
	  if (amount == null) {
	    amount = 10;
	  }
	  hsl = (new Color(color)).toHsl();
	  hsl.s += amount / 100;
	  hsl.s = Mathematic.clamp01(hsl.s);
	  return new Color(hsl);
	};
	
	Color.greyscale = function(color) {
	  return Color.desaturate(color, 100);
	};
	
	Color.lighten = function(color, amount) {
	  var hsl;
	  if (amount == null) {
	    amount = 10;
	  }
	  hsl = (new Color(color)).toHsl();
	  hsl.l += amount / 100;
	  hsl.l = Mathematic.clamp01(hsl.l);
	  return new Color(hsl);
	};
	
	Color.darken = function(color, amount) {
	  var hsl;
	  if (amount == null) {
	    amount = 10;
	  }
	  hsl = (new Color(color)).toHsl();
	  hsl.l -= amount / 100;
	  hsl.l = Mathematic.clamp01(hsl.l);
	  return new Color(hsl);
	};
	
	Color.complement = function(color) {
	  var hsl;
	  hsl = (new Color(color)).toHsl();
	  hsl.h = (hsl.h + 180) % 360;
	  return new Color(hsl);
	};
	
	Color.triad = function(color) {
	  var h, hsl;
	  hsl = (new Color(color)).toHsl();
	  h = hsl.h;
	  return [
	    new Color(color), new Color({
	      h: (h + 120) % 360,
	      s: hsl.s,
	      l: hsl.l
	    }), new Color({
	      h: (h + 240) % 360,
	      s: hsl.s,
	      l: hsl.l
	    })
	  ];
	};
	
	Color.tetrad = function(color) {
	  var h, hsl;
	  hsl = (new Color(color)).toHsl();
	  h = hsl.h;
	  return [
	    new Color(color), new Color({
	      h: (h + 90) % 360,
	      s: hsl.s,
	      l: hsl.l
	    }), new Color({
	      h: (h + 180) % 360,
	      s: hsl.s,
	      l: hsl.l
	    }), new Color({
	      h: (h + 270) % 360,
	      s: hsl.s,
	      l: hsl.l
	    })
	  ];
	};
	
	Color.splitcomplement = function(color) {
	  var h, hsl;
	  hsl = (new Color(color)).toHsl();
	  h = hsl.h;
	  return [
	    new Color(color), new Color({
	      h: (h + 72) % 360,
	      s: hsl.s,
	      l: hsl.l
	    }), new Color({
	      h: (h + 216) % 360,
	      s: hsl.s,
	      l: hsl.l
	    })
	  ];
	};
	
	Color.analogous = function(color, results, slices) {
	  var hsl, part, ret;
	  if (results == null) {
	    results = 6;
	  }
	  if (slices == null) {
	    slices = 30;
	  }
	  hsl = (new Color(color)).toHsl();
	  part = 360 / slices;
	  ret = [new Color(color)];
	  hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360;
	  while (--results) {
	    hsl.h = (hsl.h + part) % 360;
	    ret.push(new Color(hsl));
	  }
	  return ret;
	};
	
	Color.monochromatic = function(color, results) {
	  var h, hsv, modification, ret, s, v;
	  if (results == null) {
	    results = 6;
	  }
	  hsv = (new Color(color)).toHsv();
	  h = hsv.h;
	  s = hsv.s;
	  v = hsv.v;
	  ret = [];
	  modification = 1 / results;
	  while (results--) {
	    ret.push(Color({
	      h: h,
	      s: s,
	      v: v
	    }));
	    v = (v + modification) % 1;
	  }
	  return ret;
	};
	
	Color.readability = function(color1, color2) {
	  var a, b, brightnessA, brightnessB, colorDiff;
	  a = (new Color(color1)).toRgb();
	  b = (new Color(color2)).toRgb();
	  brightnessA = (a.r * 299 + a.g * 587 + a.b * 114) / 1000;
	  brightnessB = (b.r * 299 + b.g * 587 + b.b * 114) / 1000;
	  colorDiff = Math.max(a.r, b.r) - Math.min(a.r, b.r) + Math.max(a.g, b.g) - Math.min(a.g, b.g) + Math.max(a.b, b.b) - Math.min(a.b, b.b);
	  return {
	    brightness: Math.abs(brightnessA - brightnessB),
	    color: colorDiff
	  };
	};
	
	Color.readable = function(color1, color2) {
	  var readability;
	  readability = Color.readability(color1, color2);
	  return readability.brightness > 125 && readability.color > 500;
	};
	
	Color.mostReadable = function(baseColor, colorList) {
	  var bestColor, bestIsReadable, bestScore, i, readability, readable, score;
	  bestColor = null;
	  bestScore = 0;
	  bestIsReadable = false;
	  i = 0;
	  while (i < colorList.length) {
	    readability = Color.readability(baseColor, colorList[i]);
	    readable = readability.brightness > 125 && readability.color > 500;
	    score = 3 * (readability.brightness / 125) + (readability.color / 500);
	    if ((readable && !bestIsReadable) || (readable && bestIsReadable && score > bestScore) || ((!readable) && (!bestIsReadable) && score > bestScore)) {
	      bestIsReadable = readable;
	      bestScore = score;
	      bestColor = new Color(colorList[i]);
	    }
	    i++;
	  }
	  return bestColor;
	};


/***/ },
/* 21 */
/*!*******************************!*\
  !*** ./src/utils/font.coffee ***!
  \*******************************/
/***/ function(module, exports, require) {

	/*
	Inspired by Font.js by  Mike "Pomax" Kamermans
	@see http://github.com/Pomax/Font.js
	*/
	
	var Events, FONT_CACHE, FONT_DEFAULTS, Font, Mathmetics, chr, chr16, dechex, fword, ulong, ushort,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
	
	Mathmetics = require(/*! ../math/math */ 19);
	
	Events = require(/*! ../core/events/dispatcher */ 9);
	
	FONT_CACHE = {};
	
	FONT_DEFAULTS = {
	  fontFamily: 'Verdena',
	  fontSize: 12
	};
	
	chr = function(val) {
	  return String.fromCharCode(val);
	};
	
	chr16 = function(val) {
	  var b1, b2;
	  if (val < 256) {
	    return chr(0) + chr(val);
	  }
	  b1 = val >> 8;
	  b2 = val & 0xFF;
	  return chr(b1) + chr(b2);
	};
	
	dechex = function(val) {
	  if (val < 0) {
	    val = 0xFFFFFFFF + val + 1;
	  }
	  return parseInt(val, 10).toString(16);
	};
	
	ushort = function(b1, b2) {
	  return 256 * b1 + b2;
	};
	
	fword = function(b1, b2) {
	  var negative, val;
	  negative = b1 >> 7 === 1;
	  val = void 0;
	  b1 = b1 & 0x7F;
	  val = 256 * b1 + b2;
	  if (!negative) {
	    return val;
	  }
	  return val - 0x8000;
	};
	
	ulong = function(b1, b2, b3, b4) {
	  return 16777216 * b1 + 65536 * b2 + 256 * b3 + b4;
	};
	
	/*
	Font manipulations and measurement
	
	@note GameCore.exports.Utils.Font
	*/
	
	
	module.exports = Font = (function(_super) {
	  __extends(Font, _super);
	
	  function Font(options) {
	    if (options == null) {
	      options = {};
	    }
	    this.url = options.url || options.src || "";
	    this.fontFamily = this.url ? options.fontFamily || "font" + Mathmetics.randomInt(0, 999999) : FONT_DEFAULTS.fontFamily;
	    this.fontSize = options.fontSize || options.size || FONT_DEFAULTS.fontSize;
	    this.format = options.format || "";
	    this.data = options.data || "";
	    this.base64 = "AAEAAAAKAIAAAwAgT1MvMgAAAAAAAACsAAAAWGNtYXAA" + "AAAAAAABBAAAACxnbHlmAAAAAAAAATAAAAAQaGVhZAAAA" + "AAAAAFAAAAAOGhoZWEAAAAAAAABeAAAACRobXR4AAAAAA" + "AAAZwAAAAIbG9jYQAAAAAAAAGkAAAACG1heHAAAAAAAAA" + "BrAAAACBuYW1lAAAAAAAAAcwAAAAgcG9zdAAAAAAAAAHs" + "AAAAEAAEAAEAZAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + "AAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAABAAMAAQA" + "AAAwABAAgAAAABAAEAAEAAABB//8AAABB////wAABAAAA" + "AAABAAAAAAAAAAAAAAAAMQAAAQAAAAAAAAAAAABfDzz1A" + "AAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAEAAg" + "AAAAAAAAABAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAA" + "AAAAAAAAAAQAAAAAAAAAAAAAAAAAIAAAAAQAAAAIAAQAB" + "AAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAIAHgADAAEEC" + "QABAAAAAAADAAEECQACAAIAAAAAAAEAAAAAAAAAAAAAAA" + "AAAA==";
	    /*
	    these metrics represent the font-indicated values,
	    not the values pertaining to text as it is rendered
	    on the page (use fontmetrics.js for this instead).
	    */
	
	    this.metrics = {
	      quadsize: 0,
	      leading: 0,
	      ascent: 0,
	      descent: 0,
	      weightclass: 400
	    };
	    Object.defineProperty(this, "systemfont", {
	      get: function() {
	        if (this._systemfont) {
	          return this._systemfont;
	        } else {
	          if (this.url) {
	            return false;
	          } else {
	            return true;
	          }
	        }
	      },
	      set: function(oreally) {
	        return this._systemfont = oreally;
	      }
	    });
	    this.loaded = false;
	    this.canvas = false;
	    this.context = false;
	    this.styleNode = false;
	    /*
	    we want Font to do the same thing Image does when
	    we set the "src" property value, so we use the
	    Object.defineProperty function to bind a setter
	    that does more than just bind values.
	    */
	
	    Object.defineProperty(this, "src", {
	      get: function() {
	        return this.url;
	      },
	      set: function(url) {
	        this.url = url;
	        return this.loadFont();
	      }
	    });
	    if (this.url) {
	      this.loadFont();
	    }
	  }
	
	  /*
	  This function gets called once the font is done
	  loading, its metrics have been determined, and it
	  has been parsed for use on-page. By default, this
	  function does nothing, and users can bind their
	  own handler function.
	  */
	
	
	  Font.prototype.onload = function() {};
	
	  /*
	  This function gets called when there is a problem
	  loading the font.
	  */
	
	
	  Font.prototype.onerror = function() {};
	
	  /*
	  validation function to see if the zero-width styled
	  text is no longer zero-width. If this is true, the
	  font is properly done loading. If this is false, the
	  function calls itself via a timeout
	  */
	
	
	  Font.prototype.validate = function(target, zero, mark, font, timeout) {
	    var computedStyle, width;
	    if (timeout !== false && timeout < 0) {
	      this.onerror();
	      throw new Error("Requested system font '" + this.fontFamily + "' could not be loaded (it may not be installed).");
	      return;
	    }
	    computedStyle = document.defaultView.getComputedStyle(target, "");
	    width = computedStyle.getPropertyValue("width").replace("px", "");
	    if (width > 0) {
	      document.head.removeChild(zero);
	      document.body.removeChild(target);
	      this.loaded = true;
	      return this.onload();
	    } else {
	      return setTimeout((function() {
	        return font.validate(target, zero, mark, font, (timeout === false ? false : timeout - 50));
	      }), 50);
	    }
	  };
	
	  /*
	  This gets called when the file is done downloading.
	  */
	
	
	  Font.prototype.ondownloaded = function() {
	    var cff, data, error, instance, isCFF, isTTF, isWOFF, printChar, ttf, version, woff;
	    instance = this;
	    error = function(msg) {
	      return instance.onerror(msg);
	    };
	    ttf = chr(0) + chr(1) + chr(0) + chr(0);
	    cff = 'OTTO';
	    woff = 'wOFF';
	    data = this.data;
	    version = chr(data[0]) + chr(data[1]) + chr(data[2]) + chr(data[3]);
	    isTTF = version === ttf;
	    isCFF = (isTTF ? false : version === cff);
	    isWOFF = (isCFF || isTTF ? false : version === woff);
	    if (isTTF) {
	      this.format = "truetype";
	    } else if (isCFF) {
	      this.format = "opentype";
	    } else if (isWOFF) {
	      this.format = "woff";
	    } else {
	      throw new Error("Error: file at " + this.url + " cannot be interpreted as OpenType font.");
	      return;
	    }
	    printChar = this.format === 'truetype' || this.format === 'opentype' ? this._verifyTTForOTF(data) : 'A';
	    return this.bootstrapValidation(printChar);
	  };
	
	  Font.prototype._verifyTTForOTF = function(data) {
	    var checkTableError, cmap314, delta, e, encodingID, encodingRecord, end, endChar, i, newhex, numTables, offset, platformID, printChar, printable, ptr, rptr, segCount, tag, tagStart, tags, unitsPerEm, version;
	    numTables = ushort(data[4], data[5]);
	    tagStart = 12;
	    ptr = void 0;
	    end = tagStart + 16 * numTables;
	    tags = {};
	    tag = void 0;
	    ptr = tagStart;
	    while (ptr < end) {
	      tag = chr(data[ptr]) + chr(data[ptr + 1]) + chr(data[ptr + 2]) + chr(data[ptr + 3]);
	      tags[tag] = {
	        name: tag,
	        checksum: ulong(data[ptr + 4], data[ptr + 5], data[ptr + 6], data[ptr + 7]),
	        offset: ulong(data[ptr + 8], data[ptr + 9], data[ptr + 10], data[ptr + 11]),
	        length: ulong(data[ptr + 12], data[ptr + 13], data[ptr + 14], data[ptr + 15])
	      };
	      ptr += 16;
	    }
	    checkTableError = function(tag) {
	      if (!tags[tag]) {
	        throw new Error("Error: font is missing the required OpenType '" + tag + "' table.");
	        return false;
	      }
	      return tag;
	    };
	    tag = checkTableError("head");
	    if (tag === false) {
	      return;
	    }
	    ptr = tags[tag].offset;
	    tags[tag].version = "" + data[ptr] + data[ptr + 1] + data[ptr + 2] + data[ptr + 3];
	    unitsPerEm = ushort(data[ptr + 18], data[ptr + 19]);
	    this.metrics.quadsize = unitsPerEm;
	    tag = checkTableError("hhea");
	    if (tag === false) {
	      return;
	    }
	    ptr = tags[tag].offset;
	    tags[tag].version = "" + data[ptr] + data[ptr + 1] + data[ptr + 2] + data[ptr + 3];
	    this.metrics.ascent = fword(data[ptr + 4], data[ptr + 5]) / unitsPerEm;
	    this.metrics.descent = fword(data[ptr + 6], data[ptr + 7]) / unitsPerEm;
	    this.metrics.leading = fword(data[ptr + 8], data[ptr + 9]) / unitsPerEm;
	    tag = checkTableError("OS/2");
	    if (tag === false) {
	      return;
	    }
	    ptr = tags[tag].offset;
	    tags[tag].version = "" + data[ptr] + data[ptr + 1];
	    this.metrics.weightclass = ushort(data[ptr + 4], data[ptr + 5]);
	    tag = checkTableError("cmap");
	    if (tag === false) {
	      return;
	    }
	    ptr = tags[tag].offset;
	    tags[tag].version = "" + data[ptr] + data[ptr + 1];
	    numTables = ushort(data[ptr + 2], data[ptr + 3]);
	    encodingRecord = void 0;
	    rptr = void 0;
	    platformID = void 0;
	    encodingID = void 0;
	    offset = void 0;
	    cmap314 = false;
	    encodingRecord = 0;
	    while (encodingRecord < numTables) {
	      rptr = ptr + 4 + encodingRecord * 8;
	      platformID = ushort(data[rptr], data[rptr + 1]);
	      encodingID = ushort(data[rptr + 2], data[rptr + 3]);
	      offset = ulong(data[rptr + 4], data[rptr + 5], data[rptr + 6], data[rptr + 7]);
	      if (platformID === 3 && encodingID === 1) {
	        cmap314 = offset;
	      }
	      encodingRecord++;
	    }
	    printChar = "A";
	    if (cmap314 !== false) {
	      ptr += cmap314;
	      version = ushort(data[ptr], data[ptr + 1]);
	      if (version === 4) {
	        segCount = ushort(data[ptr + 6], data[ptr + 7]) / 2;
	        printable = function(chr) {
	          return [0x0009, 0x000A, 0x000B, 0x000C, 0x000D, 0x0020, 0x0085, 0x00A0, 0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x2028, 0x2029, 0x202F, 0x205F, 0x3000].indexOf(chr) === -1;
	        };
	        i = ptr + 14;
	        e = ptr + 14 + 2 * segCount;
	        endChar = false;
	        while (i < e) {
	          endChar = ushort(data[i], data[i + 1]);
	          if (printable(endChar)) {
	            break;
	          }
	          endChar = false;
	          i += 2;
	        }
	        if (endChar !== false) {
	          printChar = String.fromCharCode(endChar);
	          delta = -(endChar - 1) + 65536;
	          newhex = btoa(chr(0) + chr16(endChar) + chr16(0xFFFF) + chr16(0) + chr16(endChar) + chr16(0xFFFF) + chr16(delta) + chr16(1));
	          this.base64 = this.base64.substring(0, 380) + newhex + this.base64.substring(380 + newhex.length);
	        }
	      }
	    }
	    return printChar;
	  };
	
	  Font.prototype.bootstrapValidation = function(printChar, timeout) {
	    var canvas, context, delayedValidate, local, para, quad, realfont, tfName, zerowidth;
	    if (timeout == null) {
	      timeout = false;
	    }
	    tfName = this.fontFamily + " testfont";
	    zerowidth = document.createElement("style");
	    zerowidth.setAttribute("type", "text/css");
	    zerowidth.innerHTML = "@font-face {\n" + " font-family: '" + tfName + "';\n" + " src: url('data:application/x-font-ttf;base64," + this.base64 + "')\n" + " format('truetype');}";
	    document.head.appendChild(zerowidth);
	    realfont = false;
	    if (!this.systemfont) {
	      realfont = this.toStyleNode();
	      document.head.appendChild(realfont);
	    }
	    para = document.createElement("p");
	    para.style.cssText = "position: absolute; top: 0; left: 0; opacity: 0;";
	    para.style.fontFamily = "'" + this.fontFamily + "', '" + tfName + "'";
	    para.innerHTML = printChar + printChar + printChar + printChar + printChar + printChar + printChar + printChar + printChar + printChar;
	    document.body.appendChild(para);
	    if (!document.defaultView.getComputedStyle) {
	      this.onload();
	      return error("Error: document.defaultView.getComputedStyle is not supported by this browser.\n" + "Consequently, Font.onload() cannot be trusted.");
	    } else {
	      quad = (this.systemfont ? 1000 : this.metrics.quadsize);
	      canvas = document.createElement("canvas");
	      canvas.width = quad;
	      canvas.height = quad;
	      this.canvas = canvas;
	      context = canvas.getContext("2d");
	      context.font = "1em '" + this.fontFamily + "'";
	      context.fillStyle = "white";
	      context.fillRect(-1, -1, quad + 2, quad + 2);
	      context.fillStyle = "black";
	      context.fillText("test text", 50, quad / 2);
	      this.context = context;
	      local = this;
	      delayedValidate = function() {
	        return local.validate(para, zerowidth, realfont, local, timeout);
	      };
	      return setTimeout(delayedValidate, 50);
	    }
	  };
	
	  /*
	  We take a different path for System fonts, because
	  we cannot inspect the actual byte code.
	  */
	
	
	  Font.prototype.processSystemFont = function() {
	    this.systemfont = true;
	    this.metrics = false;
	    return this.bootstrapValidation("A", 1000);
	  };
	
	  /*
	  This gets called when font.src is set, (the binding
	  for which is at the end of this file).
	  */
	
	
	  Font.prototype.loadFont = function() {
	    var font, xhr;
	    font = this;
	    if (this.url.indexOf(".") === -1) {
	      setTimeout((function() {
	        return font.processSystemFont();
	      }), 10);
	      return;
	    }
	    xhr = new XMLHttpRequest();
	    xhr.open("GET", font.url, true);
	    xhr.responseType = "arraybuffer";
	    xhr.onreadystatechange = function(evt) {
	      var arrayBuffer;
	      if (xhr.readyState !== 4) {
	        return;
	      }
	      if (xhr.status !== 200) {
	        throw new Error("Can't load from " + this.url + ". Please, verify source urls.");
	      }
	      arrayBuffer = xhr.response;
	      if (arrayBuffer) {
	        font.data = new Uint8Array(arrayBuffer);
	        return font.ondownloaded();
	      } else {
	        return font.onerror("Error downloading font resource from " + font.url);
	      }
	    };
	    return xhr.send(null);
	  };
	
	  /*
	  Get the DOM node associated with this Font
	  object, for page-injection.
	  */
	
	
	  Font.prototype.toStyleNode = function() {
	    var styletext;
	    if (this.styleNode) {
	      return this.styleNode;
	    }
	    this.styleNode = document.createElement("style");
	    this.styleNode.type = "text/css";
	    styletext = "@font-face {\n";
	    styletext += " font-family: '" + this.fontFamily + "';\n";
	    styletext += " src: local('" + this.fontFamily + "'), url('" + this.url + "') format('" + this.format + "');\n";
	    styletext += "}";
	    this.styleNode.innerHTML = styletext;
	    return this.styleNode;
	  };
	
	  /*
	  Measure a specific string of text, given this font.
	  If the text is too wide for our preallocated canvas,
	  it will be chopped up and the segments measured
	  separately.
	  */
	
	
	  Font.prototype.measureText = function(textString) {
	    var i, metrics, minSegments, segmentLength, segments;
	    if (!(this.loaded && !this.systemfont)) {
	      throw new Error("measureText() was called while the font was not yet loaded");
	      return false;
	    }
	    this.context.font = this.toString();
	    metrics = this.context.measureText(textString);
	    metrics.fontsize = this.fontSize;
	    metrics.ascent = 0;
	    metrics.descent = 0;
	    metrics.bounds = {
	      minx: 0,
	      maxx: metrics.width,
	      miny: 0,
	      maxy: 0
	    };
	    metrics.height = 0;
	    segments = [];
	    minSegments = metrics.width / this.metrics.quadsize;
	    if (minSegments <= 1) {
	      segments.push(textString);
	    } else {
	      segments.push(textString);
	    }
	    segmentLength = segments.length;
	    i = void 0;
	    i = 0;
	    while (i < segmentLength) {
	      this.measureSegment(segments[i], metrics);
	      i++;
	    }
	    return metrics;
	  };
	
	  /*
	  Measure a section of text, given this font, that is
	  guaranteed to fit on our preallocated canvas.
	  */
	
	
	  Font.prototype.measureSegment = function(textSegment, metrics) {
	    var ascent, baseline, canvas, ctx, descent, getCSSValue, h, i, j, leadDiv, leadDivHeight, len, maxx, mid, minx, numLines, padding, pixelData, quad, scanheight, scanwidth, step, w, w4, x_offset, xpos, y_offset;
	    getCSSValue = function(element, property) {
	      return document.defaultView.getComputedStyle(element, null).getPropertyValue(property);
	    };
	    i = void 0;
	    leadDiv = document.createElement("div");
	    leadDiv.style.position = "absolute";
	    leadDiv.style.opacity = 0;
	    leadDiv.style.font = this.toString();
	    numLines = 10;
	    leadDiv.innerHTML = textSegment;
	    i = 1;
	    while (i < numLines) {
	      leadDiv.innerHTML += "<br/>" + textSegment;
	      i++;
	    }
	    document.body.appendChild(leadDiv);
	    metrics.leading = 1.2 * this.fontSize;
	    leadDivHeight = getCSSValue(leadDiv, "height");
	    leadDivHeight = leadDivHeight.replace("px", "");
	    if (leadDivHeight >= this.fontSize * numLines) {
	      metrics.leading = (leadDivHeight / numLines) | 0;
	    }
	    document.body.removeChild(leadDiv);
	    if (/^\s*$/.test(textSegment)) {
	      return metrics;
	    }
	    canvas = this.canvas;
	    ctx = this.context;
	    quad = (this.systemfont ? 1000 : this.metrics.quadsize);
	    w = quad;
	    h = quad;
	    baseline = quad / 2;
	    padding = 50;
	    xpos = (quad - metrics.width) / 2;
	    if (xpos !== (xpos | 0)) {
	      xpos = xpos | 0;
	    }
	    ctx.fillStyle = "white";
	    ctx.fillRect(-padding, -padding, w + 2 * padding, h + 2 * padding);
	    ctx.fillStyle = "black";
	    ctx.fillText(textSegment, xpos, baseline);
	    scanwidth = (metrics.width + padding) | 0;
	    scanheight = 4 * this.fontSize;
	    x_offset = xpos - padding / 2;
	    y_offset = baseline - scanheight / 2;
	    pixelData = ctx.getImageData(x_offset, y_offset, scanwidth, scanheight).data;
	    i = 0;
	    j = 0;
	    w4 = scanwidth * 4;
	    len = pixelData.length;
	    mid = scanheight / 2;
	    while (++i < len && pixelData[i] === 255) {
	      continue;
	    }
	    ascent = (i / w4) | 0;
	    i = len - 1;
	    while (--i > 0 && pixelData[i] === 255) {
	      continue;
	    }
	    descent = (i / w4) | 0;
	    i = 0;
	    j = 0;
	    while (j < scanwidth && pixelData[i] === 255) {
	      i += w4;
	      if (i >= len) {
	        j++;
	        i = (i - len) + 4;
	      }
	    }
	    minx = j;
	    step = 1;
	    i = len - 3;
	    j = 0;
	    while (j < scanwidth && pixelData[i] === 255) {
	      i -= w4;
	      if (i < 0) {
	        j++;
	        i = (len - 3) - (step++) * 4;
	      }
	    }
	    maxx = scanwidth - j;
	    metrics.ascent = mid - ascent;
	    metrics.descent = descent - mid;
	    metrics.bounds = {
	      minx: minx - (padding / 2),
	      maxx: maxx - (padding / 2),
	      miny: -metrics.descent,
	      maxy: metrics.ascent
	    };
	    metrics.height = 1 + (descent - ascent);
	    return metrics;
	  };
	
	  Font.prototype.toString = function() {
	    return "" + this.fontSize + "px '" + this.fontFamily + "'";
	  };
	
	  return Font;
	
	})(Events);


/***/ },
/* 22 */
/*!*********************************!*\
  !*** ./src/utils/loader.coffee ***!
  \*********************************/
/***/ function(module, exports, require) {

	var Loader;
	
	Loader = (function() {
	  function Loader() {}
	
	  return Loader;
	
	})();
	
	module.exports = Loader;


/***/ },
/* 23 */
/*!********************************!*\
  !*** ./src/input/mouse.coffee ***!
  \********************************/
/***/ function(module, exports, require) {

	var Mouse, MouseCursor, MouseEvents, Vector2d;
	
	Vector2d = require(/*! ../math/vector2d */ 18);
	
	MouseCursor = (function() {
	  function MouseCursor(mouse, x, y) {
	    this.mouse = mouse;
	    this.x = x != null ? x : -1;
	    this.y = y != null ? y : -1;
	  }
	
	  MouseCursor.prototype.handleEvent = function(e) {
	    console.log(e);
	    this.x = e.offsetX * this.mouse.core.stage.viewport.scale.x;
	    return this.y = e.offsetY * this.mouse.core.stage.viewport.scale.y;
	  };
	
	  return MouseCursor;
	
	})();
	
	MouseEvents = {
	  /*
	  Events.MOUSE_DOWN
	  @type {String}
	  @static
	  @final
	  */
	
	  MOUSE_DOWN: "mousedown",
	  /*
	  Events.MOUSE_UP
	  @type {String}
	  @static
	  @final
	  */
	
	  MOUSE_UP: "mouseup",
	  /*
	  Events.MOUSE_MOVE
	  @type {String}
	  @static
	  @final
	  */
	
	  MOUSE_MOVE: "mousemove",
	  /*
	  Events.CLICK
	  @type {String}
	  @static
	  @final
	  */
	
	  CLICK: "click",
	  /*
	  Events.DOUBLE_CLICK
	  @type {String}
	  @static
	  @final
	  */
	
	  DOUBLE_CLICK: "dblclick",
	  /*
	  TODO: not implemented yet
	  only available attaching Joy.Behaviour.Button behaviour
	  
	  Events.MOUSE_OVER
	  @type {String}
	  @static
	  @final
	  */
	
	  MOUSE_OVER: "mouseover"
	};
	
	module.exports = Mouse = (function() {
	  /*
	  */
	
	  function Mouse(core) {
	    var a, eventType, _i, _len, _ref;
	    this.core = core;
	    if (this.core.mouse) {
	      throw new Error("Mouse already attached to this core. Only one instance of mouse is allowed.");
	      return this.core.mouse;
	    }
	    this.core.mouse = this;
	    this.handlers = {};
	    this.cursor = new MouseCursor(this, -1, -1);
	    this.lastEvent = null;
	    a = this;
	    this.updateColliderPosition = function(e) {
	      Mouse.collider.position.x = e.offsetX * J.currentEngine.currentScene.viewport.scale.x;
	      Mouse.collider.position.y = e.offsetY * J.currentEngine.currentScene.viewport.scale.y;
	      return Mouse.collider.updateColliderPosition(J.currentEngine.currentScene.viewport.position);
	    };
	    this.addHandler = function(eventType) {
	      a.handlers[eventType] = [];
	      return a.core.renderer["on" + eventType] = a.triggerMouseEvents();
	    };
	    _ref = [MouseEvents.CLICK, MouseEvents.DOUBLE_CLICK, MouseEvents.MOUSE_MOVE, MouseEvents.MOUSE_DOWN, MouseEvents.MOUSE_UP];
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      eventType = _ref[_i];
	      this.addHandler(eventType);
	    }
	  }
	
	  Mouse.prototype.triggerMouseEvents = function() {
	    var mi;
	    mi = this;
	    return function(e) {
	      var handlers, i, length, _results;
	      handlers = mi.handlers[e.type];
	      mi.lastEvent = e;
	      mi.cursor.handleEvent(e);
	      i = 0;
	      length = handlers.length;
	      _results = [];
	      while (i < length) {
	        if (handlers[i].target.visible && mi.isOver(handlers[i].target)) {
	          handlers[i].handler.apply(handlers[i].target, [e]);
	        }
	        _results.push(++i);
	      }
	      return _results;
	    };
	  };
	
	  Mouse.prototype.isOver = function(target) {
	    return console.log(target, this.cursor);
	  };
	
	  return Mouse;
	
	})();


/***/ },
/* 24 */
/*!**************************************!*\
  !*** ./src/core/events/event.coffee ***!
  \**************************************/
/***/ function(module, exports, require) {

	/*
	@note Inspired by CreateJS/TweenJS
	
	A collection of Classes that are shared across all the CreateJS libraries.  The classes are included in the minified
	files of each library and are available on the createsjs namespace directly.
	
	@example
	    #myObject.addEventListener "change", createjs.proxy(myMethod, scope)
	
	@module CreateJS
	@main CreateJS
	*/
	
	var Event;
	
	Event = (function() {
	  /*
	  The type of event.
	  @property type
	  @type String
	  */
	
	  var bubbles, cancelable, currentTarget, defaultPrevented, eventPhase, immediatePropagationStopped, propagationStopped, removed, target, timeStamp, type;
	
	  type = null;
	
	  /*
	  The object that generated an event.
	  @property target
	  @type Object
	  @default null
	  @readonly
	  */
	
	
	  target = null;
	
	  /*
	  The current target that a bubbling event is being dispatched from. For non-bubbling events, this will
	  always be the same as target. For example, if childObj.parent = parentObj, and a bubbling event
	  is generated from childObj, then a listener on parentObj would receive the event with
	  target=childObj (the original target) and currentTarget=parentObj (where the listener was added).
	  @property currentTarget
	  @type Object
	  @default null
	  @readonly
	  */
	
	
	  currentTarget = null;
	
	  /*
	  For bubbling events, this indicates the current event phase:<OL>
	  <LI> capture phase: starting from the top parent to the target</LI>
	  <LI> at target phase: currently being dispatched from the target</LI>
	  <LI> bubbling phase: from the target to the top parent</LI>
	  </OL>
	  
	  @property eventPhase
	  @type Number
	  @default 0
	  @readonly
	  */
	
	
	  eventPhase = 0;
	
	  /*
	  Indicates whether the event will bubble through the display list.
	  @property bubbles
	  @type Boolean
	  @default false
	  @readonly
	  */
	
	
	  bubbles = false;
	
	  /*
	  Indicates whether the default behaviour of this event can be cancelled via
	  {{#crossLink "Event/preventDefault"}}{{/crossLink}}. This is set via the Event constructor.
	  @property cancelable
	  @type Boolean
	  @default false
	  @readonly
	  */
	
	
	  cancelable = false;
	
	  /*
	  The epoch time at which this event was created.
	  @property timeStamp
	  @type Number
	  @default 0
	  @readonly
	  */
	
	
	  timeStamp = 0;
	
	  /*
	  Indicates if {{#crossLink "Event/preventDefault"}}{{/crossLink}} has been called
	  on this event.
	  @property defaultPrevented
	  @type Boolean
	  @default false
	  @readonly
	  */
	
	
	  defaultPrevented = false;
	
	  /*
	  Indicates if {{#crossLink "Event/stopPropagation"}}{{/crossLink}} or
	  {{#crossLink "Event/stopImmediatePropagation"}}{{/crossLink}} has been called on this event.
	  @property propagationStopped
	  @type Boolean
	  @default false
	  @readonly
	  */
	
	
	  propagationStopped = false;
	
	  /*
	  Indicates if {{#crossLink "Event/stopImmediatePropagation"}}{{/crossLink}} has been called
	  on this event.
	  @property immediatePropagationStopped
	  @type Boolean
	  @default false
	  @readonly
	  */
	
	
	  immediatePropagationStopped = false;
	
	  /*
	  Indicates if {{#crossLink "Event/remove"}}{{/crossLink}} has been called on this event.
	  @property removed
	  @type Boolean
	  @default false
	  @readonly
	  */
	
	
	  removed = false;
	
	  /*
	  Initialization method.
	  @method constructor
	  @param {String} type The event type.
	  @param {Boolean} bubbles Indicates whether the event will bubble through the display list.
	  @param {Boolean} cancelable Indicates whether the default behaviour of this event can be cancelled.
	  @protected
	  */
	
	
	  function Event(type, bubbles, cancelable) {
	    this.type = type;
	    this.bubbles = bubbles;
	    this.cancelable = cancelable;
	    this.timeStamp = (new Date()).getTime();
	  }
	
	  /*
	  Sets {{#crossLink "Event/defaultPrevented"}}{{/crossLink}} to true.
	  Mirrors the DOM event standard.
	  @method preventDefault
	  */
	
	
	  Event.prototype.preventDefault = function() {
	    return this.defaultPrevented = true;
	  };
	
	  /*
	  Sets {{#crossLink "Event/propagationStopped"}}{{/crossLink}} to true.
	  Mirrors the DOM event standard.
	  @method stopPropagation
	  */
	
	
	  Event.prototype.stopPropagation = function() {
	    return this.propagationStopped = true;
	  };
	
	  /*
	  Sets {{#crossLink "Event/propagationStopped"}}{{/crossLink}} and
	  {{#crossLink "Event/immediatePropagationStopped"}}{{/crossLink}} to true.
	  Mirrors the DOM event standard.
	  @method stopImmediatePropagation
	  */
	
	
	  Event.prototype.stopImmediatePropagation = function() {
	    return this.immediatePropagationStopped = this.propagationStopped = true;
	  };
	
	  /*
	  Causes the active listener to be removed via removeEventListener();
	  
	  @example
	      myBtn.addEventListener "click", (evt)->
	          # do stuff...
	          evt.remove() # removes this listener.
	  
	  @method remove
	  */
	
	
	  Event.prototype.remove = function() {
	    return this.removed = true;
	  };
	
	  /*
	  Returns a clone of the Event instance.
	  @method clone
	  @return {Event} a clone of the Event instance.
	  */
	
	
	  Event.prototype.clone = function() {
	    return new Event(this.type, this.bubbles, this.cancelable);
	  };
	
	  /*
	  Returns a string representation of this object.
	  @method toString
	  @return {String} a string representation of the instance.
	  */
	
	
	  Event.prototype.toString = function() {
	    return "<Event (type=" + this.type + ")>";
	  };
	
	  return Event;
	
	})();
	
	module.exports = Event;


/***/ },
/* 25 */
/*!***************************************!*\
  !*** ./src/ui/geometry/circle.coffee ***!
  \***************************************/
/***/ function(module, exports, require) {

	var Circle, Widget,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
	
	Widget = require(/*! ../widget */ 12);
	
	module.exports = Circle = (function(_super) {
	  __extends(Circle, _super);
	
	  function Circle(options) {
	    if (options == null) {
	      options = {};
	    }
	    Circle.__super__.constructor.call(this, options);
	  }
	
	  Circle.prototype._render = function(ctx) {
	    ctx.beginPath();
	    ctx.arc(this.radius, this.radius, this.radius, 0, 2 * Math.PI);
	    ctx.fillStyle = this.color.toString();
	    return ctx.fill();
	  };
	
	  return Circle;
	
	})(Widget);


/***/ },
/* 26 */
/*!*************************************!*\
  !*** ./src/ui/geometry/rect.coffee ***!
  \*************************************/
/***/ function(module, exports, require) {

	var Rect, Widget,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
	
	Widget = require(/*! ../widget */ 12);
	
	module.exports = Rect = (function(_super) {
	  __extends(Rect, _super);
	
	  function Rect(options) {
	    if (options == null) {
	      options = {};
	    }
	    Rect.__super__.constructor.call(this, options);
	    Object.defineProperty(this, "color", {
	      get: function() {
	        if (!this._color) {
	          this.color = options.color || DEFAULT_COLOR;
	        }
	        return this._color;
	      },
	      set: function(color) {
	        this._color = typeof color === "string" ? new Color(color) : color;
	        return this.alpha = this._color.a;
	      },
	      configurable: true
	    });
	  }
	
	  Rect.prototype._render = function(ctx) {
	    if (this.color) {
	      ctx.fillStyle = this.color.toString();
	    }
	    return ctx.fillRect(0, 0, this.width, this.height);
	  };
	
	  return Rect;
	
	})(Widget);


/***/ }
/******/ ])
/*
//@ sourceMappingURL=gamecore.js.map
*/