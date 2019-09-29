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
var e_1, _a;
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
    help: 'help',
    newBranch: 'newBranch',
    checkoutBranch: 'checkoutBranch'
};
var state = {
    location: givScreenName.main.commit,
};
var Config = new giv.Config(blessed_1.default.screen({ smartCSR: true, title: 'giv' }));
var grid = new blessed_contrib_1.default.grid(Config.Main.Grid);
var givScreen = {
    main: {
        commit: grid.set(0, 0, 10, 20, blessed_1.default.listtable, Config.Main.CommitTable),
        branch: grid.set(10, 4, 10, 4, blessed_1.default.box, Config.Main.BranchTable),
        modefied: grid.set(10, 0, 10, 4, blessed_1.default.box, Config.Main.ModefiedTable),
        diff: grid.set(10, 8, 10, 12, blessed_1.default.box, Config.Main.DiffTable),
    },
    help: {
        text: blessed_1.default.text(Config.Help.Text)
    },
    newBranch: {
        name: blessed_1.default.textbox(Config.NewBranch.Name),
        label: blessed_1.default.text(Config.NewBranch.Label),
        label2: blessed_1.default.text(Config.NewBranch.Label2),
        createdLabel: blessed_1.default.text(Config.NewBranch.CreatedLabel),
        strErrorLabel: blessed_1.default.text(Config.NewBranch.StrErrorLabel),
        branchErrorLabel: blessed_1.default.text(Config.NewBranch.BranchErrorLabel)
    },
    checkoutBranch: {
        list: grid.set(5, 5, 10, 10, blessed_1.default.list, Config.CheckoutBranch.List)
    },
};
var checkoutBranches = giv.getGitBranches();
try {
    for (var checkoutBranches_1 = __values(checkoutBranches), checkoutBranches_1_1 = checkoutBranches_1.next(); !checkoutBranches_1_1.done; checkoutBranches_1_1 = checkoutBranches_1.next()) {
        var v = checkoutBranches_1_1.value;
        givScreen.checkoutBranch.list.addItem(v);
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (checkoutBranches_1_1 && !checkoutBranches_1_1.done && (_a = checkoutBranches_1.return)) _a.call(checkoutBranches_1);
    }
    finally { if (e_1) throw e_1.error; }
}
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
var gitMerges = giv.getGitMerges().map(function (x) { return x.id; });
var gitTree = giv.getGitTree();
var commits = [];
var subjectLimit = 75;
for (var i = 0; i < gitLog.length; i++) {
    var log = gitLog[i];
    var subject = log.subject;
    if (subject.length > subjectLimit) {
        subject = subject.slice(0, subjectLimit) + '...';
    }
    if (gitMerges.indexOf(log.id) > -1) {
        gitTree[i] = gitTree[i].replace('*', 'M');
        subject = colors_1.default.yellow('✔ ') + colors_1.default.cyan(subject);
    }
    else {
        subject = colors_1.default.green('» ') + subject;
    }
    subject = subject.padEnd(70, '  ');
    var date = moment_1.default(log.date);
    var TL = date.fromNow(true).replace('a few', '1').split(' ');
    TL[0] = TL[0].replace(/(an|a)/, '1').padStart(2, ' ');
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
givScreen.main.commit.setData(__spread([
    ['TL', 'GRAPH', 'MESSAGE', 'AUTHOR', 'DATE']
], commits));
givScreen.main.commit.setLabel(" " + colors_1.default.green(giv.getNowGitBranch()) + " ");
var branches = giv.getGitBranches();
givScreen.main.branch.setContent(colors_1.default.gray(" " + branches.length + " branches") + ("\n" + branches.join('\n')));
function setDiffScreen(compareCommitId, comparedCommitId) {
    var diff = comparedCommitId ?
        giv.getGitDiff(compareCommitId, comparedCommitId)
        : giv.getGitDiff(compareCommitId);
    givScreen.main.diff.setContent(giv.coloringGitDiff(diff).map(function (x) { return x[0]; }).join('\n'));
    var modefiedFiles = comparedCommitId ?
        giv.getGitModifiedFiles(compareCommitId, comparedCommitId)
        : giv.getGitModifiedFiles(compareCommitId);
    givScreen.main.modefied.setContent(colors_1.default.gray(" " + modefiedFiles.length + " Files") + ("\n" + modefiedFiles.join('\n')));
    Config.screen.render();
}
gitLog.length > 1 ?
    setDiffScreen(gitLog[0].id, gitLog[1].id)
    : setDiffScreen(gitLog[0].id);
givScreen.main.commit.on('select item', function (_, index) {
    index--;
    if (index === 0 && gitLog.length > 1 && index !== gitLog.length - 1) {
        setDiffScreen(gitLog[index].id, gitLog[index + 1].id);
    }
    else {
        setDiffScreen(gitLog[index].id);
    }
    givScreen.main.diff.resetScroll();
});
Config.screen.key('n', function () {
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
    var branches = giv.getGitBranches().map(function (x) { return x.replace('*', '').trim(); });
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
    if (state.location !== givScreenName.main.commit) {
        screenInit();
        return;
    }
    process.exit(0);
});
givScreen.main.commit.key('j', function () {
    for (var i = 1; i <= 10; i++) {
        setTimeout(function () {
            givScreen.main.diff.scroll(1);
            Config.screen.render();
        }, i * 20);
    }
});
givScreen.main.commit.key('k', function () {
    for (var i = 1; i <= 10; i++) {
        setTimeout(function () {
            givScreen.main.diff.scroll(-1);
            Config.screen.render();
        }, i * 20);
    }
});
Config.screen.key('h', function () {
    state.location = givScreenName.help;
    switchScreen('help');
    Config.screen.render();
});
Config.screen.key('b', function () {
    state.location = givScreenName.checkoutBranch;
    switchScreen('checkoutBranch');
    givScreen.checkoutBranch.list.focus();
    Config.screen.render();
});
givScreen.checkoutBranch.list.key('enter', function () {
    var index = givScreen.checkoutBranch.list.getItemIndex(this.selected);
    giv.checkoutGitBranch(checkoutBranches[index]);
    screenInit();
});
Config.screen.key(['C-c'], function () { return process.exit(0); });
Config.screen.render();
//listTable.focus()
