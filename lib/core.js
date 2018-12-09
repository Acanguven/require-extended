"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mimic_1 = require("./mimic");
var binding_1 = require("./binding");
var app_root_path_1 = require("app-root-path");
var Core = /** @class */ (function () {
    function Core() {
        this.rootPath = app_root_path_1.path;
    }
    Core.prototype.init = function (options) {
        return this;
    };
    Core.prototype.mimic = function (matcher) {
        return new mimic_1.Mimic();
    };
    Core.prototype.bind = function (matcher) {
        return new binding_1.Binding();
    };
    Core.prototype.setRoot = function (path) {
    };
    return Core;
}());
exports.Core = Core;
