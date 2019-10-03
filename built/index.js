"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
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
var colors_1 = __importDefault(require("colors"));
var moment_1 = __importDefault(require("moment"));
var giv = __importStar(require("./giv.modules"));
var directive = __importStar(require("./directive/index"));
var screen_module_1 = __importDefault(require("./screen/screen.module"));
var state = {
    isMainScreen: true
};
var dispatch = {
    cheangedMainScreen: function () { return (state.isMainScreen = false); },
    init: function () { return (state.isMainScreen = true); }
};
var Screen = blessed_1.default.screen({
    smartCSR: true,
    title: 'giv'
});
var s = new screen_module_1.default(Screen);
giv.getGitBranches().forEach(function (name) { return s.SelectBranch.list.addItem(name); });
s.init();
var gitLog = giv.getGitLog();
var gitMerges = giv.getGitMerges().map(function (x) { return x.id; });
var tree = giv.getGitTree();
tree = giv.coloringTree(tree, gitLog.map(function (x) { return x.id; }), gitMerges);
var commits = [];
var subjectMax = 75;
var subjectMin = 70;
for (var i = 0; i < gitLog.length; i++) {
    var log = gitLog[i];
    var subject = log.subject;
    if (subject.length > subjectMax) {
        subject = subject.slice(0, subjectMax) + '...';
    }
    subject = tree.indexOf('M') > -1 ?
        colors_1.default.yellow('✔') + " " + colors_1.default.cyan(subject)
        : colors_1.default.green('»') + " " + subject;
    subject = subject.padEnd(subjectMin, '  ');
    var date = moment_1.default(log.date);
    var TL = date.fromNow(true).replace('a few', '1').split(' ');
    TL[0] = TL[0]
        .replace(/(an|a)/, '1')
        .padStart(2, ' ');
    TL[1] = TL[1]
        .replace(/(hours|hour)/, 'h')
        .replace(/(minutes|minute)/, 'm')
        .replace(/(seconds|second)/, 's');
    commits.push([
        TL[0] + " " + TL[1],
        tree[i],
        subject,
        colors_1.default.cyan('❤ ') + colors_1.default.green(log.commiter),
        colors_1.default.gray(date.format('DD MMM HH:mm:ss').toLowerCase()),
    ]);
}
s.Main.commit.setData(__spread([
    ['TL', 'GRAPH', 'MESSAGE', 'AUTHOR', 'DATE']
], commits));
s.Main.commit.setLabel(" " + colors_1.default.green(giv.getNowGitBranch()) + " ");
var branches = giv.getGitBranches();
s.Main.contains.setContent(colors_1.default.gray(" " + branches.length + " branches") + ("\n" + branches.join('\n')));
function setDiffScreen(compareCommitId, comparedCommitId) {
    var diff = comparedCommitId ?
        giv.getGitDiff(compareCommitId, comparedCommitId)
        : giv.getGitDiff(compareCommitId);
    s.Main.diff.setContent(giv.coloringGitDiff(diff)
        .map(function (x) { return x[0]; })
        .join('\n'));
    var modefiedFiles = comparedCommitId ?
        giv.getGitModifiedFiles(compareCommitId, comparedCommitId)
        : giv.getGitModifiedFiles(compareCommitId);
    s.Main.modefied.setContent(colors_1.default.gray(" " + modefiedFiles.length + " Files")
        + ("\n" + modefiedFiles.join('\n')));
    Screen.render();
}
gitLog.length > 1 ?
    setDiffScreen(gitLog[0].id, gitLog[1].id)
    : setDiffScreen(gitLog[0].id);
s.Main.commit.on('select item', function (_, index) {
    index--;
    if (index === 0 && gitLog.length > 1 && index !== gitLog.length - 1) {
        setDiffScreen(gitLog[index].id, gitLog[index + 1].id);
    }
    else {
        setDiffScreen(gitLog[index].id);
    }
    s.Main.diff.resetScroll();
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
    directive.selectBranch.checkout(s, this.selected);
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
