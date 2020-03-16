"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var help = /** @class */ (function () {
    function help(s) {
        this.s = s;
    }
    help.prototype.show = function () {
        this.s.show(this.s.Help);
        this.s.render();
    };
    return help;
}());
exports.default = help;
