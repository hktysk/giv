"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var giv = __importStar(require("../giv.modules"));
var colors_1 = __importDefault(require("colors"));
exports.diff = {
    diff: [],
    jumps: [],
    set: function (s, id) {
        this.diff = giv.getGitDiff(id);
        s.Diff.diff.resetScroll();
        s.Diff.diff.setContent(giv.coloringGitDiff(this.diff[0]).join('\n'));
        this.setJumps(0);
        var modefiedFiles = giv.getGitModifiedFiles(id);
        s.Diff.modefied.clearItems();
        modefiedFiles.forEach(function (v) { return s.Diff.modefied.addItem(colors_1.default.cyan(v[0])); });
        s.screen.render();
    },
    setJumps: function (index) {
        var _this = this;
        this.jumps = [];
        var isRowNumber = false;
        var isSymbol = false;
        this.diff[index].forEach(function (v, k) {
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
    },
    iterationCount: 10,
    interval: 8,
    scroll: function (s, direction) {
        for (var i = 1; i <= this.iterationCount; i++) {
            setTimeout(function () {
                s.Diff.diff.scroll(direction === 'down' ? 1 : -1);
                s.screen.render();
            }, i * this.interval);
        }
    },
    scrollUp: function (s) {
        this.scroll(s, 'up');
    },
    scrollDown: function (s) {
        this.scroll(s, 'down');
    },
};
exports.default = exports.diff;
