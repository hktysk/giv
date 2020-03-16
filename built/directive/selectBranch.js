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
var selectBranch = /** @class */ (function () {
    function selectBranch(s) {
        this.s = s;
    }
    selectBranch.prototype.show = function () {
        this.s.show(this.s.SelectBranch);
        this.s.SelectBranch.checkoutError.hide();
        this.s.SelectBranch.list.focus();
        this.s.render();
    };
    selectBranch.prototype.checkout = function (name) {
        var _this = this;
        if (Git.isOkCheckout() === false) {
            this.s.SelectBranch.checkoutError.show();
            this.s.render();
            setTimeout(function () {
                _this.s.SelectBranch.checkoutError.hide();
                _this.s.render();
            }, 3000);
            return;
        }
        Git.checkoutBranch(name);
        this.s.init();
    };
    return selectBranch;
}());
exports.default = selectBranch;
