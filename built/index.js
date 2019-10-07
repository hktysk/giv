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
var giv = __importStar(require("./giv.modules"));
var directive = __importStar(require("./directive/index"));
var screen_module_1 = __importDefault(require("./screen/screen.module"));
var state = {
    isMainScreen: true,
};
var dispatch = {
    cheangedMainScreen: function () { return (state.isMainScreen = false); },
    init: function () { return (state.isMainScreen = true); },
};
var Screen = blessed_1.default.screen({
    smartCSR: true,
    title: 'giv',
});
var s = new screen_module_1.default(Screen);
giv.getGitBranches().forEach(function (name) { return s.SelectBranch.list.addItem(name); });
s.init();
var logs = giv.getGitLog();
var tree = giv.coloringTree(giv.getGitTree(), logs.map(function (x) { return x.id; }), giv.getGitMerges().map(function (x) { return x.id; }));
directive.main.commit.set(s, logs, tree);
directive.main.modefied.set(s, logs[0].id);
s.Diff.modefied.on('select item', function () {
    s.Diff.diff.resetScroll();
    s.Diff.diff.setContent(giv.coloringGitDiff(directive.diff.diff[this.selected]).join('\n'));
    directive.diff.setJumps(this.selected);
});
s.Main.commit.on('select item', function (_, index) {
    directive.main.modefied.set(s, logs[index].id);
    s.Main.diff.resetScroll();
});
s.Main.commit.key('enter', function () {
    directive.diff.set(s, logs[this.selected].id);
    s.show(s.Diff);
    s.Diff.modefied.focus();
    dispatch.cheangedMainScreen();
    Screen.render();
});
s.Diff.modefied.key('o', function () {
    var now = s.Diff.diff.getScroll();
    var jumpLine = directive.diff.jumps.find(function (x) { return x > now; });
    s.Diff.diff.scrollTo(jumpLine ? jumpLine : directive.diff.jumps[0]);
    Screen.render();
});
s.Diff.modefied.key('i', function () {
    var now = s.Diff.diff.getScroll();
    var jumpLine = directive.diff.jumps.find(function (x) { return x < now; });
    s.Diff.diff.scrollTo(jumpLine ? jumpLine : directive.diff.jumps[directive.diff.jumps.length - 1]);
    Screen.render();
});
s.Diff.modefied.key('g', function () {
    s.Diff.diff.resetScroll();
    Screen.render();
});
s.Diff.modefied.key('S-g', function () {
    s.Diff.diff.scroll(s.Diff.diff.getScrollHeight());
    Screen.render();
});
s.Diff.modefied.key('j', function () {
    s.Diff.diff.scroll(1);
    Screen.render();
});
s.Diff.modefied.key('k', function () {
    s.Diff.diff.scroll(-1);
    Screen.render();
});
s.Diff.modefied.key('u', function () {
    directive.diff.scrollUp(s);
});
s.Diff.modefied.key('d', function () {
    directive.diff.scrollDown(s);
});
Screen.key('n', function () {
    directive.newBranch.show(s);
    dispatch.cheangedMainScreen();
});
s.NewBranch.name.key(['enter'], function () { return directive.newBranch.register(s); });
s.Main.commit.key('j', function () { return directive.diff.scrollDown(s); });
s.Main.commit.key('k', function () { return directive.diff.scrollUp(s); });
Screen.key('h', function () {
    directive.help.show(s);
    dispatch.cheangedMainScreen();
});
Screen.key('b', function () {
    directive.selectBranch.show(s);
    dispatch.cheangedMainScreen();
});
s.SelectBranch.list.key('enter', function () {
    var name = this.value.replace('* ', '');
    directive.selectBranch.checkout(s, name);
});
Screen.key(['escape', 'q', 'C-['], function () {
    if (state.isMainScreen === false) {
        s.init();
        dispatch.init();
        return;
    }
    process.exit(0);
});
Screen.key(['C-c'], function () { return process.exit(0); });
Screen.render();
