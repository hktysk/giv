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
var blessed_contrib_1 = __importDefault(require("blessed-contrib"));
var colors_1 = __importDefault(require("colors"));
var moment_1 = __importDefault(require("moment"));
var giv = __importStar(require("./giv.modules"));
var givScreenName = {
    commit: 'commit',
    branch: 'branch',
    modefied: 'modefied',
    diff: 'diff'
};
var state = {
    location: givScreenName.commit,
    commitIndex: 0
};
var Config = new giv.Config(blessed_1.default.screen());
var grid = new blessed_contrib_1.default.grid(Config.Grid);
var givScreen = {
    commit: grid.set(0, 0, 15, 13, blessed_contrib_1.default.table, Config.CommitTable),
    branch: grid.set(15, 0, 5, 6, blessed_contrib_1.default.table, Config.BranchTable),
    modefied: grid.set(15, 6, 5, 7, blessed_contrib_1.default.table, Config.ModefiedTable),
    diff: grid.set(0, 13, 20, 7, blessed_contrib_1.default.table, Config.DiffTable)
};
givScreen.commit.focus();
var gitLog = giv.getGitLog();
var gitTree = giv.getGitTree();
var commits = [];
var subjectLimit = 36;
for (var i = 0; i < gitLog.length; i++) {
    var log = gitLog[i];
    var subject = log.subject;
    if (subject.length > subjectLimit) {
        subject = subject.slice(0, subjectLimit) + '...';
    }
    subject = subject.indexOf('M') > -1 ?
        colors_1.default.yellow('✔ ') + colors_1.default.cyan(subject)
        : colors_1.default.green('» ') + subject;
    var date = moment_1.default(log.date);
    var TL = date.fromNow(true).replace('a few', '1').split(' ');
    TL[0] = TL[0].padStart(2, ' ').replace('a', '1');
    TL[1] = TL[1].replace(/(hours|hour)/, 'h').replace(/(minutes|minute)/, 'm').replace(/(seconds|second)/, 's');
    var tree = gitTree[i].split('').map(function (x) { return colors_1.default.cyan(x); }).join('');
    tree = tree.replace('M', colors_1.default.yellow('M')).replace('*', colors_1.default.green('c'));
    commits.push([
        TL[0] + " " + TL[1],
        tree,
        subject,
        colors_1.default.cyan('❤ ') + colors_1.default.green(log.commiter),
        colors_1.default.gray(date.format('DD MMM HH:mm:ss').toLowerCase()),
    ]);
}
givScreen.commit.setData({
    headers: [' TL', ' GRAPH', ' MESSAGE', ' AUTHOR', ' DATE'],
    data: commits
});
var branches = giv.getGitBranches();
givScreen.branch.setData({
    headers: [colors_1.default.gray(" " + branches.length + " branches")],
    data: branches
});
function setDiffScreen(compareCommitId, comparedCommitId) {
    var diff = comparedCommitId ?
        giv.getGitDiff(compareCommitId, comparedCommitId)
        : giv.getGitDiff(compareCommitId);
    givScreen.diff.setData({
        headers: [''],
        data: giv.coloringGitDiff(diff)
    });
    var modefiedFiles = comparedCommitId ?
        giv.getGitModifiedFiles(compareCommitId, comparedCommitId)
        : giv.getGitModifiedFiles(compareCommitId);
    givScreen.modefied.setData({
        headers: [colors_1.default.gray(" " + modefiedFiles.length + " Files")],
        data: modefiedFiles
    });
}
gitLog.length > 1 ?
    setDiffScreen(gitLog[0].id, gitLog[1].id)
    : setDiffScreen(gitLog[0].id);
Config.screen.key('down', function () {
    if (state.commitIndex === gitLog.length - 1)
        return;
    state.commitIndex++;
    var isLastLog = (state.commitIndex === gitLog.length - 1);
    isLastLog ?
        setDiffScreen(gitLog[state.commitIndex].id)
        : setDiffScreen(gitLog[state.commitIndex].id, gitLog[state.commitIndex + 1].id);
});
Config.screen.key('up', function () {
    if (state.commitIndex === 0)
        return;
    state.commitIndex--;
    var isFirstLog = (state.commitIndex === 0);
    isFirstLog ?
        setDiffScreen(gitLog[state.commitIndex].id)
        : setDiffScreen(gitLog[state.commitIndex].id, gitLog[state.commitIndex + 1].id);
});
Config.screen.key(['escape', 'q', 'C-c'], function () { return process.exit(0); });
Config.screen.render();
