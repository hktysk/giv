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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var giv = __importStar(require("../giv.modules"));
var colors_1 = __importDefault(require("colors"));
var moment_1 = __importDefault(require("moment"));
exports.main = {
    commit: {
        set: function (s, logs, tree) {
            var commits = [];
            var maxAuthorLength = Math.max.apply(Math, __spread(logs.map(function (x) { return x.commiter.length; })));
            logs.forEach(function (log, k) {
                var id = log.id, commiter = log.commiter, subject = log.subject, date = log.date;
                if (id === 'unknown') {
                    commits.push(['unknown(unstaged changes)']);
                    tree.unshift('');
                    return;
                }
                commiter = commiter.padEnd(maxAuthorLength, ' ');
                subject = tree[k].indexOf('M') > -1 ?
                    [colors_1.default.yellow('✔'), colors_1.default.cyan(subject)].join(' ')
                    : [colors_1.default.green('»'), colors_1.default.white(subject)].join(' ');
                var timeLine = moment_1.default(date)
                    .fromNow(true)
                    .replace('a few', '1')
                    .split(' ');
                timeLine[0] = timeLine[0]
                    .replace(/(an|a)/, '1')
                    .padStart(2, ' ');
                timeLine[1] = timeLine[1]
                    .replace(/(years|year)/, 'y')
                    .replace(/(days|day)/, 'd')
                    .replace(/(hours|hour)/, 'h')
                    .replace(/(minutes|minute)/, 'm')
                    .replace(/(seconds|second)/, 's');
                commits.push([
                    [colors_1.default.cyan('❤'), colors_1.default.white(commiter)].join(' ') + ' '.repeat(2),
                    [colors_1.default.cyan(timeLine[0]), colors_1.default.cyan(timeLine[1])].join(' ') + ' '.repeat(5),
                    tree[k].replace(/M/, '✔') + ' ',
                    subject,
                ]);
            });
            commits.forEach(function (v) { return s.Main.commit.addItem(v.join('')); });
            s.Main.commit.setLabel(" " + colors_1.default.cyan(giv.getNowGitBranch()) + " ");
        }
    },
    modefied: {
        set: function (s, id) {
            var modefiedFiles = giv.getGitModifiedFiles(id);
            s.Main.modefied.setContent(colors_1.default.white(" " + modefiedFiles.length + " Files")
                + ("\n" + modefiedFiles.map(function (x) { return x.map(function (e) { return colors_1.default.cyan(e); }); }).join('\n')));
            s.screen.render();
        }
    }
};
