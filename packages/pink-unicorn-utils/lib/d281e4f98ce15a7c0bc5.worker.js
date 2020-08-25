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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/groupDataset.worker.js?worker");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/groupDataset.js":
/*!*****************************!*\
  !*** ./src/groupDataset.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return groupDataset; });\nfunction _createForOfIteratorHelperLoose(o) { var i = 0; if (typeof Symbol === \"undefined\" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); } i = o[Symbol.iterator](); return i.next.bind(i); }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(n); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }\n\nfunction groupDataset({\n  group,\n  end,\n  start,\n  dataset,\n  dimensions\n}) {\n  dataset = dataset || [];\n  const dimLen = dimensions.length;\n  const sampleLen = dimensions.length - 1;\n\n  for (let i = 0; i < dataset.length; i++) {\n    let ds = dataset[i];\n    let chunks = new Map();\n\n    while (start < end) {\n      chunks.set(start, [start].concat(Array(sampleLen).fill([])));\n      start = start + group;\n    }\n\n    chunks.set(end, [start].concat(Array(sampleLen).fill([])));\n    ds.source = ds.source || [];\n\n    for (let j = 0, len = ds.source.length; j < len; j++) {\n      const item = ds.source[j];\n      let chunk;\n\n      for (var _iterator = _createForOfIteratorHelperLoose(chunks.keys()), _step; !(_step = _iterator()).done;) {\n        const ts = _step.value;\n\n        if (item[0] >= ts && item[0] < ts + group) {\n          chunk = chunks.get(ts);\n          break;\n        }\n      }\n\n      if (chunk) {\n        chunks.set(chunk[0], [chunk[0], chunk[1] && chunk[1].concat(item[1]), chunk[2] && chunk[2].concat(item[2]), chunk[3] && chunk[3].concat(item[3]), chunk[4] && chunk[4].concat(item[4]), chunk[5] && chunk[5].concat(item[5]), chunk[6] && chunk[6].concat(item[6]), chunk[7] && chunk[7].concat(item[7])]);\n      }\n    }\n\n    ds.source = [];\n    chunks = Array.from(chunks.values());\n\n    for (let j = 0, len = chunks.length; j < len; j++) {\n      const item = chunks[j].slice(0, dimLen);\n\n      for (let k = 0; k < dimLen; k++) {\n        item[k] = sample(dimensions[k].name, item[k]);\n      }\n\n      ds.source.push(item);\n    }\n\n    for (let k = 0; k < dimLen; k++) {\n      if (dimensions[k].name === 'skip') {\n        let prevSkip = 0;\n\n        for (let idx = 0, len = ds.source.length; idx < len; idx++) {\n          const nextSkip = idx < len - 1 ? ds.source[idx + 1][k] : null;\n          let skip = ds.source[idx][k] || 0;\n\n          if (!(skip || prevSkip || nextSkip)) {\n            skip = null;\n          }\n\n          ds.source[idx][k] = skip;\n          prevSkip = skip;\n        }\n      }\n    }\n  }\n\n  return dataset;\n}\n\nfunction sample(dim, value) {\n  switch (dim) {\n    case 'count':\n    case 'slow_count':\n      return sampleSum(value);\n\n    case 'skip':\n      return sampleSumNull(value);\n\n    case 'max':\n    case 'max95':\n      return sampleMax(value);\n\n    case 'avg':\n      return sampleAverage(value);\n\n    default:\n      return value;\n  }\n}\n\nfunction sampleAverage(frame) {\n  var sum = 0;\n  var count = 0;\n\n  for (var i = 0; i < frame.length; i++) {\n    if (!isNaN(frame[i])) {\n      sum += frame[i] || 0;\n      count++;\n    }\n  }\n\n  return count === 0 ? NaN : sum / count;\n}\n\nfunction sampleSum(frame) {\n  var sum = 0;\n\n  for (var i = 0; i < frame.length; i++) {\n    sum += frame[i] || 0;\n  }\n\n  return sum;\n}\n\nfunction sampleSumNull(frame) {\n  var sum = 0;\n\n  for (var i = 0; i < frame.length; i++) {\n    sum += frame[i] || 0;\n  }\n\n  return sum || null;\n}\n\nfunction sampleMax(frame) {\n  var max = -Infinity;\n\n  for (var i = 0; i < frame.length; i++) {\n    if (!isNaN(frame[i]) && typeof frame[i] === 'number' && frame[i] > max) {\n      max = frame[i];\n    }\n  }\n\n  return isFinite(max) ? max : NaN;\n}\n\n//# sourceURL=webpack://pul/./src/groupDataset.js?");

/***/ }),

/***/ "./src/groupDataset.worker.js?worker":
/*!*******************************************!*\
  !*** ./src/groupDataset.worker.js?worker ***!
  \*******************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _groupDataset__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./groupDataset */ \"./src/groupDataset.js\");\n\n\nself.addEventListener('message', (event) => {\n  const dataset = Object(_groupDataset__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(event.data)\n  self.postMessage({ key: event.data.key, dataset })\n})\n\n\n//# sourceURL=webpack://pul/./src/groupDataset.worker.js?");

/***/ })

/******/ });