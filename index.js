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
    main: {
        commit: 'commit',
        branch: 'branch',
        modefied: 'modefied',
        diff: 'diff'
    },
    newBranch: 'newBranch'
};
var state = {
    location: givScreenName.main.commit,
    commitIndex: 0
};
var Config = new giv.Config(blessed_1.default.screen());
var grid = new blessed_contrib_1.default.grid(Config.Main.Grid);
var givScreen = {
    main: {
        commit: grid.set(0, 0, 15, 13, blessed_contrib_1.default.table, Config.Main.CommitTable),
        branch: grid.set(15, 0, 5, 6, blessed_contrib_1.default.table, Config.Main.BranchTable),
        modefied: grid.set(15, 6, 5, 7, blessed_contrib_1.default.table, Config.Main.ModefiedTable),
        diff: grid.set(0, 13, 20, 7, blessed_contrib_1.default.table, Config.Main.DiffTable),
    },
    loading: {
        diff: grid.set(0, 13, 20, 7, blessed_1.default.text, Config.Loading.Diff)
    },
    newBranch: {
        name: blessed_1.default.textbox(Config.NewBranch.Name),
        label: blessed_1.default.text(Config.NewBranch.Label),
        label2: blessed_1.default.text(Config.NewBranch.Label2),
        createdLabel: blessed_1.default.text(Config.NewBranch.CreatedLabel),
        strErrorLabel: blessed_1.default.text(Config.NewBranch.StrErrorLabel),
        branchErrorLabel: blessed_1.default.text(Config.NewBranch.BranchErrorLabel)
    }
};
function switchScreen(screenName) {
    for (var k in givScreen) {
        if (k === screenName) {
            for (var k2 in givScreen[k])
                givScreen[k][k2].show();
            continue;
        }
        for (var k2 in givScreen[k])
            givScreen[k][k2].hide();
    }
}
function screenInit() {
    switchScreen('main');
    state.location = givScreenName.main.commit;
    Config.screen.render();
    givScreen.main.commit.focus();
}
switchScreen('main');
givScreen.main.commit.focus();
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
givScreen.main.commit.setData({
    headers: [' TL', ' GRAPH', ' MESSAGE', ' AUTHOR', ' DATE'],
    data: commits
});
var branches = giv.getGitBranches();
givScreen.main.branch.setData({
    headers: [colors_1.default.gray(" " + branches.length + " branches")],
    data: branches
});
function setDiffScreen(compareCommitId, comparedCommitId) {
    var diff = comparedCommitId ?
        giv.getGitDiff(compareCommitId, comparedCommitId)
        : giv.getGitDiff(compareCommitId);
    givScreen.main.diff.setData({
        headers: [''],
        data: giv.coloringGitDiff(diff)
    });
    var modefiedFiles = comparedCommitId ?
        giv.getGitModifiedFiles(compareCommitId, comparedCommitId)
        : giv.getGitModifiedFiles(compareCommitId);
    givScreen.main.modefied.setData({
        headers: [colors_1.default.gray(" " + modefiedFiles.length + " Files")],
        data: modefiedFiles
    });
    givScreen.loading.diff.hide();
    Config.screen.render();
}
gitLog.length > 1 ?
    setDiffScreen(gitLog[0].id, gitLog[1].id)
    : setDiffScreen(gitLog[0].id);
var timeout = [];
var loadingTime = 300;
Config.screen.key('down', function () {
    var e_1, _a;
    if (state.commitIndex === gitLog.length - 1)
        return;
    if (timeout) {
        try {
            for (var timeout_1 = __values(timeout), timeout_1_1 = timeout_1.next(); !timeout_1_1.done; timeout_1_1 = timeout_1.next()) {
                var v = timeout_1_1.value;
                clearTimeout(v);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (timeout_1_1 && !timeout_1_1.done && (_a = timeout_1.return)) _a.call(timeout_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    state.commitIndex++;
    givScreen.loading.diff.show();
    var isLastLog = (state.commitIndex === gitLog.length - 1);
    timeout.push(setTimeout(function () {
        isLastLog ?
            setDiffScreen(gitLog[state.commitIndex].id)
            : setDiffScreen(gitLog[state.commitIndex].id, gitLog[state.commitIndex + 1].id);
    }, loadingTime));
});
Config.screen.key('up', function () {
    var e_2, _a;
    if (state.commitIndex === 0)
        return;
    if (timeout) {
        try {
            for (var timeout_2 = __values(timeout), timeout_2_1 = timeout_2.next(); !timeout_2_1.done; timeout_2_1 = timeout_2.next()) {
                var v = timeout_2_1.value;
                clearTimeout(v);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (timeout_2_1 && !timeout_2_1.done && (_a = timeout_2.return)) _a.call(timeout_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    state.commitIndex--;
    givScreen.loading.diff.show();
    var isLastLog = (state.commitIndex === gitLog.length - 1);
    timeout.push(setTimeout(function () {
        isLastLog ?
            setDiffScreen(gitLog[state.commitIndex].id)
            : setDiffScreen(gitLog[state.commitIndex].id, gitLog[state.commitIndex + 1].id);
    }, loadingTime));
});
Config.screen.key('h', function () {
    switchScreen('newBranch');
    givScreen.newBranch.createdLabel.hide();
    givScreen.newBranch.strErrorLabel.hide();
    givScreen.newBranch.branchErrorLabel.hide();
    givScreen.newBranch.name.focus();
    Config.screen.render();
    state.location = givScreenName.newBranch;
});
givScreen.newBranch.name.key(['enter'], function () {
    var newBranch = givScreen.newBranch;
    var name = newBranch.name.value.trim();
    newBranch.label.hide();
    newBranch.label2.hide();
    Config.screen.render();
    var branches = giv.getGitBranches().map(function (x) { return x[0].replace('*', '').trim(); });
    if (branches.indexOf(name) > -1) {
        newBranch.branchErrorLabel.show();
        Config.screen.render();
    }
    else if (name.length === 0) {
        newBranch.strErrorLabel.show();
        Config.screen.render();
    }
    else {
        giv.createGitNewBranch(name);
        newBranch.name.hide();
        newBranch.createdLabel.show();
        Config.screen.render();
        setTimeout(function () {
            screenInit();
            newBranch.name.value = '';
        }, 2000);
        return;
    }
    setTimeout(function () {
        newBranch.strErrorLabel.hide();
        newBranch.branchErrorLabel.hide();
        newBranch.label.show();
        newBranch.label2.show();
        Config.screen.render();
        newBranch.name.focus();
    }, 2000);
});
Config.screen.key(['escape', 'q', 'C-['], function () {
    if (state.location === givScreenName.newBranch) {
        screenInit();
        return;
    }
    process.exit(0);
});
Config.screen.key(['C-c'], function () { return process.exit(0); });
Config.screen.render();
