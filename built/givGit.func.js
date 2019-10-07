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
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var colors_1 = __importDefault(require("colors"));
var tree_1 = require("./tree");
function getGitLog() {
    var sh = 'git log --pretty=format:\'{"id": "%h","commiter": "%cN","subject": "%s","date": "%cD"},\'';
    var log = child_process_1.execSync(sh).toString();
    var r = JSON.parse('[' + log.trim().slice(0, -1) + ']');
    if (child_process_1.execSync('git diff').toString().length > 0) {
        r.unshift({
            id: 'unknown',
            commiter: 'unknown',
            subject: 'unknown'
        });
    }
    return r;
}
exports.getGitLog = getGitLog;
function getGitTree() {
    var sh = 'git log --graph --format="%x09"';
    var gitTree = child_process_1.execSync(sh).toString().trim();
    return tree_1.convertTree(gitTree);
}
exports.getGitTree = getGitTree;
function getGitMerges() {
    var sh = 'git log --merges --pretty=format:\'{"id": "%h"},\'';
    var merges = child_process_1.execSync(sh).toString();
    return JSON.parse('[' + merges.trim().slice(0, -1) + ']');
}
exports.getGitMerges = getGitMerges;
function getGitBranches() {
    var sh = "git branch --sort=-authordate";
    var branches = child_process_1.execSync(sh).toString();
    return branches.trim().split('\n');
}
exports.getGitBranches = getGitBranches;
function getGitDiff(id) {
    var e_1, _a;
    var sh = id === 'unknown' ? 'git diff -U9999' : "git show -U9999 " + id;
    var diff = child_process_1.execSync(sh).toString().trim().split('\n');
    diff.reverse();
    var d = [];
    var t = [];
    try {
        for (var diff_1 = __values(diff), diff_1_1 = diff_1.next(); !diff_1_1.done; diff_1_1 = diff_1.next()) {
            var v = diff_1_1.value;
            t.push(v);
            if (v.slice(0, 4) === 'diff') {
                t.reverse();
                d.push(t);
                t = [];
            }
            if (v.slice(0, 2) === '@@') {
                t.splice(t.length - 1, 0, '');
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (diff_1_1 && !diff_1_1.done && (_a = diff_1.return)) _a.call(diff_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    t.reverse();
    d = d.map(function (x) { return __spread(t, x); });
    d.reverse();
    return d;
}
exports.getGitDiff = getGitDiff;
function coloringGitDiff(diff) {
    var e_2, _a;
    var d = [];
    var isInfoRow = 0;
    try {
        for (var diff_2 = __values(diff), diff_2_1 = diff_2.next(); !diff_2_1.done; diff_2_1 = diff_2.next()) {
            var v = diff_2_1.value;
            switch (v.charAt(0)) {
                case '-':
                    d.push(colors_1.default.magenta(v));
                    break;
                case '+':
                    d.push(colors_1.default.green(v));
                    break;
                case '@':
                    if (v.charAt(1) === '@') {
                        var s = v.split('@@');
                        d.push(colors_1.default.yellow("@@" + s[1] + "@@") + colors_1.default.white(s[2]));
                        isInfoRow = d.length + 1;
                        break;
                    }
                default:
                    d.push(isInfoRow === 0 ? colors_1.default.cyan(v) : colors_1.default.white(v));
            }
            var k = d.length - 1;
            var row = d.length - isInfoRow;
            d[k] = isInfoRow === 0 || row <= 0 ?
                ' ' + d[k]
                : colors_1.default.white(("" + (row > 0 ? row : '')).padStart(("" + diff.length).length, ' ')) + colors_1.default.white('│ ') + d[k];
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (diff_2_1 && !diff_2_1.done && (_a = diff_2.return)) _a.call(diff_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return d.map(function (x) { return [x]; });
}
exports.coloringGitDiff = coloringGitDiff;
function getGitModifiedFiles(id) {
    var sh = id === 'unknown' ?
        "git diff --name-only"
        : "git show " + id + " --name-only --oneline";
    var files = child_process_1.execSync(sh).toString();
    var _a = __read(files.trim().split('\n').map(function (x) { return [colors_1.default.white('- ') + x]; })), modefied = _a.slice(1);
    return modefied;
}
exports.getGitModifiedFiles = getGitModifiedFiles;
function createGitNewBranch(name) {
    var sh = "git checkout -b " + name;
    child_process_1.exec(sh);
}
exports.createGitNewBranch = createGitNewBranch;
function checkoutGitBranch(name) {
    var sh = "git checkout " + name;
    child_process_1.execSync(sh);
}
exports.checkoutGitBranch = checkoutGitBranch;
function getNowGitBranch() {
    var sh = 'git rev-parse --abbrev-ref HEAD 2> /dev/null';
    return child_process_1.execSync(sh).toString().trim();
}
exports.getNowGitBranch = getNowGitBranch;
function isOkGitCheckout() {
    var sh = 'git diff --name-only';
    return (child_process_1.execSync(sh).toString().trim().length === 0);
}
exports.isOkGitCheckout = isOkGitCheckout;
function getGitContains(id) {
    var sh = "git branch --contains " + id;
    return child_process_1.execSync(sh).toString().split('\n');
}
exports.getGitContains = getGitContains;
