"use strict";

var prefix = "";

exports.has = function (key) {
	return localStorage.getItem(prefix + key) != null;
};

exports.get = function (key) {
	return exports.has(key) ? JSON.parse(localStorage.getItem(prefix + key)) : undefined;
};

exports.setPrefix = function (prefix) {
	prefix = prefix
};

exports.set = function (key, val) {
	localStorage.setItem(prefix + key, JSON.stringify(val));
};

exports.def = function (key, val) {
	!exports.has(key) && exports.set(key, val);
};

exports.del = function (key) {
	localStorage.removeItem(prefix + key);
};

exports.hasItem = exports.has;
exports.getItem = exports.get;
exports.setItem = exports.set;
exports.removeItem = exports.del;