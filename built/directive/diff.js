"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Git = __importStar(require("../git"));
var diff = /** @class */ (function () {
    function diff(s) {
        this.s = s;
        this.files = [];
        this.jumps = [];
        this.interval = 8;
    }
    diff.prototype.set = function (id) {
        var _this = this;
        this.files = Git.getDiff(id);
        this.s.Diff.diff.resetScroll();
        this.s.Diff.diff.setContent(Git.coloringDiff(this.files[0]).join('\n'));
        this.setJumps(0);
        var modefiedFiles = Git.getModified(id);
        this.s.Diff.modefied.clearItems();
        modefiedFiles.forEach(function (v) { return _this.s.Diff.modefied.addItem(v); });
        this.s.render();
    };
    diff.prototype.setJumps = function (index) {
        var _this = this;
        this.jumps = [];
        var isRowNumber = false;
        var isSymbol = false;
        this.files[index].forEach(function (v, k) {
            if (isRowNumber === true) {
                if (v.charAt(0) === '-' || v.charAt(0) === '+') {
                    if (isSymbol === false) {
                        _this.jumps.push(k);
                        isSymbol = true;
                    }
                }
                else {
                    isSymbol = false;
                }
            }
            if (v.slice(0, 2) === '@@')
                isRowNumber = true;
        });
    };
    diff.prototype.jump = function (direction) {
        var now = this.s.Diff.diff.getScroll();
        // TODO: findだと一番最初と一番最後しか該当しないので書き直す
        var index = 0;
        var diff = now;
        this.jumps.forEach(function (v, k) {
            var abs = Math.abs(v - now);
            if (abs < diff) {
                diff = abs;
                index = k;
            }
        });
        direction === 'next' ? index++ : index--;
        var jumpLine;
        if (index === this.jumps.length && direction === 'next') {
            jumpLine = this.jumps[0];
        }
        else if (index === -1 && direction === 'before') {
            jumpLine = this.jumps[this.jumps.length - 1];
        }
        else {
            jumpLine = this.jumps[index];
        }
        this.s.Diff.diff.scrollTo(jumpLine);
        this.s.render();
    };
    diff.prototype.scroll = function (direction, iteration) {
        var _this = this;
        for (var i = 1; i <= iteration; i++) {
            setTimeout(function () {
                _this.s.Diff.diff.scroll(direction === 'down' ? 1 : -1);
                _this.s.render();
            }, i * this.interval);
        }
    };
    diff.prototype.scrollUp = function (iteration) {
        this.scroll('up', iteration);
    };
    diff.prototype.scrollDown = function (iteration) {
        this.scroll('down', iteration);
    };
    return diff;
}());
exports.default = diff;
