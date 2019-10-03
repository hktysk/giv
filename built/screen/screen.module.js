"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var blessed_contrib_1 = __importDefault(require("blessed-contrib"));
var Main_1 = __importDefault(require("./Main"));
var NewBranch_1 = __importDefault(require("./NewBranch"));
var SelectBranch_1 = __importDefault(require("./SelectBranch"));
var Help_1 = __importDefault(require("./Help"));
var Screen = /** @class */ (function () {
    function Screen(screen) {
        this.screen = screen;
        this.grid = new blessed_contrib_1.default.grid({
            rows: 20,
            cols: 20,
            screen: this.screen
        });
        this.Main = new Main_1.default(this.screen, this.grid);
        this.NewBranch = new NewBranch_1.default(this.screen);
        this.SelectBranch = new SelectBranch_1.default(this.screen, this.grid);
        this.Help = new Help_1.default(this.screen);
        this.all = [
            this.Main,
            this.NewBranch,
            this.SelectBranch,
            this.Help
        ];
    }
    Screen.prototype.hide = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.all), _c = _b.next(); !_c.done; _c = _b.next()) {
                var s = _c.value;
                for (var k in s) {
                    if ('hide' in s[k])
                        s[k].hide();
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    Screen.prototype.show = function (s) {
        this.hide();
        for (var k in s) {
            if ('show' in s[k])
                s[k].show();
        }
        this.screen.render();
    };
    Screen.prototype.init = function () {
        this.hide();
        this.show(this.Main);
        this.Main.commit.focus();
    };
    return Screen;
}());
exports.default = Screen;
