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
exports.newBranch = {
    show: function (s) {
        s.show(s.NewBranch);
        s.NewBranch.creationSuccessText.hide();
        s.NewBranch.emptyErrorText.hide();
        s.NewBranch.registerdErrorText.hide();
        s.NewBranch.name.focus();
        s.screen.render();
    },
    register: function (s) {
        var name = s.NewBranch.name.value.trim();
        s.NewBranch.nameExplanation.hide();
        s.NewBranch.backExplanation.hide();
        s.screen.render();
        var branches = giv.getGitBranches().map(function (x) { return x.replace('*', '').trim(); });
        if (branches.indexOf(name) > -1) {
            s.NewBranch.registerdErrorText.show();
        }
        else if (name.length === 0) {
            s.NewBranch.emptyErrorText.show();
        }
        else {
            giv.createGitNewBranch(name);
            s.NewBranch.name.hide();
            s.NewBranch.creationSuccessText.show();
            s.screen.render();
            setTimeout(function () {
                s.init();
                s.NewBranch.name.value = '';
            }, 2000);
            return;
        }
        s.screen.render();
        setTimeout(this.show, 2000);
    }
};
exports.default = exports.newBranch;
