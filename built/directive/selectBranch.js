"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var giv = __importStar(require("../giv.modules"));
exports.selectBranch = {
    show: function (s) {
        s.show(s.SelectBranch);
        s.SelectBranch.checkoutError.hide();
        s.SelectBranch.list.focus();
        s.screen.render();
    },
    checkout: function (s, name) {
        if (giv.isOkGitCheckout() === false) {
            s.SelectBranch.checkoutError.show();
            s.screen.render();
            setTimeout(function () {
                s.SelectBranch.checkoutError.hide();
                s.screen.render();
            }, 3000);
            return;
        }
        var index = s.SelectBranch.list.getItemIndex(name);
        giv.checkoutGitBranch(giv.getGitBranches()[index]);
        s.init();
    }
};
exports.default = exports.selectBranch;
