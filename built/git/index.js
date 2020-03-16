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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var colors_1 = __importDefault(require("colors"));
var tree_1 = require("./tree");
__export(require("./tree"));
var opts = {
    maxBuffer: 1024 * 10240
};
function getLog(name) {
    var sh = 'git log --pretty=format:\'%H\n%aN\n%s\n%aD\' --author-date-order';
    if (name)
        sh += " " + name;
    var log = child_process_1.execSync(sh, opts).toString().trim().split('\n');
    var r = [];
    while (log.length > 0) {
        var _a = __read(log, 4), id = _a[0], author = _a[1], subject = _a[2], date = _a[3];
        r.push({
            id: id,
            author: author,
            /*
             '{' And '}' need to be escaped.
              Because an error occurs when adding to the list of blessed
            */
            subject: subject.replace(/{/g, '\\{').replace(/}/g, '\\}'),
            date: new Date(date)
        });
        log = log.slice(4);
    }
    if (!name && child_process_1.execSync('git diff', opts).toString().length > 0) {
        r.unshift({
            id: 'unknown',
            author: 'unknown',
            subject: 'unknown'
        });
    }
    return r;
}
exports.getLog = getLog;
function getTree(name) {
    var sh = 'git log --oneline --author-date-order --pretty=format:\'%H\n%P\' --date=raw';
    if (name)
        sh += " " + name;
    var gitTree = child_process_1.execSync(sh, opts).toString().trim();
    return tree_1.convertTree(gitTree, getMerge(name && name));
}
exports.getTree = getTree;
function getMerge(name) {
    var sh = 'git log --merges --pretty=format:\'"%H",\'';
    if (name)
        sh += " " + name;
    var merges = child_process_1.execSync(sh, opts).toString();
    return JSON.parse('[' + merges.trim().slice(0, -1) + ']');
}
exports.getMerge = getMerge;
function getAllBranches() {
    var sh = "git branch --sort=-authordate";
    var branches = child_process_1.execSync(sh, opts).toString();
    return branches.trim().split('\n');
}
exports.getAllBranches = getAllBranches;
function getDiff(id) {
    var e_1, _a;
    var sh = id === 'unknown' ? 'git diff -U9999 --pretty=fuller' : "git show -U9999 --pretty=fuller " + id;
    var diff = child_process_1.execSync(sh, opts).toString().trim().split('\n');
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
exports.getDiff = getDiff;
function coloringDiff(diff) {
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
    return d;
}
exports.coloringDiff = coloringDiff;
function getModified(id) {
    var sh = id === 'unknown' ?
        "git diff --name-only"
        : "git show " + id + " --name-only --oneline";
    var files = child_process_1.execSync(sh, opts).toString();
    var modefied = files.trim().split('\n').map(function (x) { return colors_1.default.white('- ') + colors_1.default.cyan(x); });
    return id === 'unknown' ? modefied : modefied.slice(1);
}
exports.getModified = getModified;
function createNewBranch(name) {
    var sh = "git checkout -b " + name;
    child_process_1.exec(sh, opts);
}
exports.createNewBranch = createNewBranch;
function checkoutBranch(name) {
    var sh = "git checkout " + name;
    child_process_1.execSync(sh, opts);
}
exports.checkoutBranch = checkoutBranch;
function getNowBranch() {
    var sh = 'git rev-parse --abbrev-ref HEAD 2> /dev/null';
    return child_process_1.execSync(sh, opts).toString().trim();
}
exports.getNowBranch = getNowBranch;
function isOkCheckout() {
    var sh = 'git diff --name-only';
    return (child_process_1.execSync(sh, opts).toString().trim().length === 0);
}
exports.isOkCheckout = isOkCheckout;
function getContains(id) {
    var sh = "git branch --contains " + id;
    return child_process_1.execSync(sh, opts).toString().split('\n');
}
exports.getContains = getContains;
