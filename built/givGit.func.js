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
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var colors_1 = __importDefault(require("colors"));
var tree_1 = require("./tree");
function getGitLog() {
    var sh = 'git log --pretty=format:\'{"id": "%h","commiter": "%cN","subject": "%s","date": "%cD"},\'';
    var log = child_process_1.execSync(sh).toString();
    return JSON.parse('[' + log.trim().slice(0, -1) + ']');
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
function getGitDiff(compareCommitId, comparedCommitId) {
    var sh = comparedCommitId ?
        "git diff " + compareCommitId + " " + comparedCommitId
        : "git diff " + compareCommitId;
    var diff = child_process_1.execSync(sh).toString();
    return diff.trim().split('\n');
}
exports.getGitDiff = getGitDiff;
function coloringGitDiff(diff) {
    var e_1, _a;
    var d = [];
    try {
        for (var diff_1 = __values(diff), diff_1_1 = diff_1.next(); !diff_1_1.done; diff_1_1 = diff_1.next()) {
            var v = diff_1_1.value;
            switch (v.charAt(0)) {
                case '-':
                    d.push(colors_1.default.red(v));
                    break;
                case '+':
                    d.push(colors_1.default.green(v));
                    break;
                case '@':
                    if (v.charAt(1) === '@') {
                        d.push(colors_1.default.cyan(v));
                        break;
                    }
                default:
                    d.push(colors_1.default.black(v));
            }
            var k = d.length - 1;
            var row = d.length;
            d[k] = colors_1.default.cyan(("" + row).padStart(("" + diff.length).length, ' ')) + colors_1.default.cyan('│ ') + d[k];
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (diff_1_1 && !diff_1_1.done && (_a = diff_1.return)) _a.call(diff_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return d.map(function (x) { return [x]; });
}
exports.coloringGitDiff = coloringGitDiff;
function getGitModifiedFiles(compareCommitId, comparedCommitId) {
    var sh = comparedCommitId ?
        "git diff " + compareCommitId + " " + comparedCommitId + " --name-only"
        : "git diff " + compareCommitId + " --name-only";
    var files = child_process_1.execSync(sh).toString();
    return files.trim().split('\n').map(function (x) { return [colors_1.default.black('- ') + x]; });
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
