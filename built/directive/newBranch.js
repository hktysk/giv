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
var newBranch = /** @class */ (function () {
    function newBranch(s) {
        this.s = s;
    }
    newBranch.prototype.show = function () {
        this.s.show(this.s.NewBranch);
        this.s.NewBranch.creationSuccessText.hide();
        this.s.NewBranch.emptyErrorText.hide();
        this.s.NewBranch.registerdErrorText.hide();
        this.s.NewBranch.name.focus();
        this.s.render();
    };
    newBranch.prototype.register = function () {
        var _this = this;
        var name = this.s.NewBranch.name.value.trim();
        this.s.NewBranch.nameExplanation.hide();
        this.s.NewBranch.backExplanation.hide();
        this.s.render();
        var branches = Git.getAllBranches().map(function (x) { return x.replace('*', '').trim(); });
        if (branches.indexOf(name) > -1) {
            this.s.NewBranch.registerdErrorText.show();
        }
        else if (name.length === 0) {
            this.s.NewBranch.emptyErrorText.show();
        }
        else {
            Git.createNewBranch(name);
            this.s.NewBranch.name.hide();
            this.s.NewBranch.creationSuccessText.show();
            this.s.render();
            setTimeout(function () {
                _this.s.init();
                _this.s.NewBranch.name.value = '';
            }, 2000);
            return;
        }
        this.s.render();
        setTimeout(this.show, 2000);
    };
    return newBranch;
}());
exports.default = newBranch;
