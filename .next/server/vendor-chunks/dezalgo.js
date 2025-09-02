/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/dezalgo";
exports.ids = ["vendor-chunks/dezalgo"];
exports.modules = {

/***/ "(rsc)/./node_modules/dezalgo/dezalgo.js":
/*!*****************************************!*\
  !*** ./node_modules/dezalgo/dezalgo.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var wrappy = __webpack_require__(/*! wrappy */ \"(rsc)/./node_modules/wrappy/wrappy.js\")\nmodule.exports = wrappy(dezalgo)\n\nvar asap = __webpack_require__(/*! asap */ \"(rsc)/./node_modules/asap/asap.js\")\n\nfunction dezalgo (cb) {\n  var sync = true\n  asap(function () {\n    sync = false\n  })\n\n  return function zalgoSafe() {\n    var args = arguments\n    var me = this\n    if (sync)\n      asap(function() {\n        cb.apply(me, args)\n      })\n    else\n      cb.apply(me, args)\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvZGV6YWxnby9kZXphbGdvLmpzIiwibWFwcGluZ3MiOiJBQUFBLGFBQWEsbUJBQU8sQ0FBQyxxREFBUTtBQUM3Qjs7QUFFQSxXQUFXLG1CQUFPLENBQUMsK0NBQU07O0FBRXpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcVm9ydGV4XFxGTEFTSC1DQVJELTIuMC1XSVRILVNISS1XRUlcXG5vZGVfbW9kdWxlc1xcZGV6YWxnb1xcZGV6YWxnby5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgd3JhcHB5ID0gcmVxdWlyZSgnd3JhcHB5Jylcbm1vZHVsZS5leHBvcnRzID0gd3JhcHB5KGRlemFsZ28pXG5cbnZhciBhc2FwID0gcmVxdWlyZSgnYXNhcCcpXG5cbmZ1bmN0aW9uIGRlemFsZ28gKGNiKSB7XG4gIHZhciBzeW5jID0gdHJ1ZVxuICBhc2FwKGZ1bmN0aW9uICgpIHtcbiAgICBzeW5jID0gZmFsc2VcbiAgfSlcblxuICByZXR1cm4gZnVuY3Rpb24gemFsZ29TYWZlKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzXG4gICAgdmFyIG1lID0gdGhpc1xuICAgIGlmIChzeW5jKVxuICAgICAgYXNhcChmdW5jdGlvbigpIHtcbiAgICAgICAgY2IuYXBwbHkobWUsIGFyZ3MpXG4gICAgICB9KVxuICAgIGVsc2VcbiAgICAgIGNiLmFwcGx5KG1lLCBhcmdzKVxuICB9XG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/dezalgo/dezalgo.js\n");

/***/ })

};
;