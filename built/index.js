"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var blessed_1 = __importDefault(require("blessed"));
var screen_1 = __importDefault(require("./screen"));
var directive_1 = __importDefault(require("./directive"));
var Git = __importStar(require("./git"));
/*******************************
* Initial setting
/******************************/
var s = new screen_1.default(blessed_1.default.screen({
    smartCSR: true,
    fullUnicode: true,
    title: 'giv'
}));
s.init(); // Show Main screen and hide other screens
var directive = new directive_1.default(s);
/********************************
* Prepare state
/*******************************/
var state = {
    isMainScreen: true
};
var dispatch = {
    cheangedMainScreen: function () { return (state.isMainScreen = false); },
    init: function () { return (state.isMainScreen = true); },
};
/*********************************
* Process for setting items.
*********************************/
var logs;
var tree; // Store git tree line by line
function setScreenItems(name) {
    // 'name' means branch name
    logs = Git.getLog(name && name);
    tree = Git.coloringTree(Git.getTree(name && name), logs.map(function (x) { return x.id; }), Git.getMerge(name && name));
    directive.main.commit.set(logs, tree, name && name);
    directive.main.modefied.set(logs[0].id);
    s.SelectBranch.list.clearItems();
    Git.getAllBranches().forEach(function (name) { return s.SelectBranch.list.addItem(name); });
    s.render();
}
// This function is used in the enter event of commit
function setDiffItems(i) {
    directive.diff.set(logs[i].id);
    s.Diff.modefied.focus();
    dispatch.cheangedMainScreen(); // Make sure to move the screen
    s.show(s.Diff);
}
/* Set initial items */
setScreenItems();
/*****************************
* Events
/****************************/
/* Main screen events */
s.Main.commit.key('d', function () { return s.Main.commit.scroll(10); });
s.Main.commit.key('u', function () { return s.Main.commit.scroll(-10); });
s.Main.commit.key('g', function () { return s.Main.commit.resetScroll(); });
s.Main.commit.key('S-g', function () { return s.Main.commit.scroll(directive.main.commits.length); });
s.Main.commit.on('select item', function () {
    directive.main.modefied.set(logs[this.selected].id);
});
s.Main.commit.key('enter', function () {
    setDiffItems(this.selected);
});
/* Diff screen events */
s.Diff.modefied.on('select item', function () {
    s.Diff.diff.resetScroll();
    // The diff of each file is stored in directive.diff.files
    s.Diff.diff.setContent(Git.coloringDiff(directive.diff.files[this.selected]).join('\n'));
    // 'setJumps()' finds the changed part of the file (-/ +) and records its line number
    directive.diff.setJumps(this.selected);
});
s.Diff.modefied.key('o', function () { return directive.diff.jump('next'); });
s.Diff.modefied.key('i', function () { return directive.diff.jump('before'); });
s.Diff.modefied.key('j', function () { return directive.diff.scrollDown(1); });
s.Diff.modefied.key('k', function () { return directive.diff.scrollUp(1); });
s.Diff.modefied.key('u', function () { return directive.diff.scrollUp(10); });
s.Diff.modefied.key('d', function () { return directive.diff.scrollDown(10); });
s.Diff.modefied.key('g', function () {
    // Scroll to first line
    s.Diff.diff.resetScroll();
    s.render();
});
s.Diff.modefied.key('S-g', function () {
    // Scroll to last line
    s.Diff.diff.scroll(s.Diff.diff.getScrollHeight());
    s.render();
});
/* NewBranch screen events */
s.key('n', function () {
    directive.newBranch.show();
    dispatch.cheangedMainScreen();
});
s.NewBranch.name.key('enter', function () { return directive.newBranch.register(); });
/* SelectBranch screen events */
s.key('b', function () {
    directive.selectBranch.show();
    dispatch.cheangedMainScreen();
});
s.SelectBranch.list.key('enter', function () {
    var name = this.value.replace('* ', '');
    directive.selectBranch.checkout(name);
});
s.SelectBranch.list.key('v', function () {
    // switch view mode
    var name = this.value.replace('* ', '');
    setScreenItems(name);
    s.init();
    dispatch.init();
});
/* Help screen events */
s.key('h', function () {
    directive.help.show();
    dispatch.cheangedMainScreen();
});
/* Events common to all screens */
s.key('r', function () {
    s.init();
    dispatch.init();
    setScreenItems();
});
s.key(['escape', 'q', 'C-['], function () {
    if (state.isMainScreen === false) {
        s.init();
        dispatch.init();
        return;
    }
    process.exit(0);
});
s.key(['C-c'], function () { return process.exit(0); });
