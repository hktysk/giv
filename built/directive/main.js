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
var Git = __importStar(require("../git"));
var colors_1 = __importDefault(require("colors"));
var moment_1 = __importDefault(require("moment"));
var main = /** @class */ (function () {
    function main(s) {
        var _this = this;
        this.s = s;
        this.commits = [];
        this.commit = {
            set: function (logs, tree, name) {
                _this.commits = [];
                var maxAuthorLength = Math.max.apply(Math, __spread(logs.map(function (x) { return x.author.length; })));
                logs.forEach(function (log, k) {
                    var id = log.id, author = log.author, subject = log.subject, date = log.date;
                    if (id === 'unknown') {
                        _this.commits.push('unknown(unstaged changes)');
                        tree.unshift('');
                        return;
                    }
                    author = author.padEnd(maxAuthorLength, ' ');
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
                        .replace(/(years|year)/, 'Y')
                        .replace(/(months|month)/, 'M')
                        .replace(/(days|day)/, 'd')
                        .replace(/(hours|hour)/, 'h')
                        .replace(/(minutes|minute)/, 'm')
                        .replace(/(seconds|second)/, 's');
                    _this.commits.push([
                        [colors_1.default.cyan('❤'), colors_1.default.white(author)].join(' ') + ' '.repeat(2),
                        [colors_1.default.cyan(timeLine[0]), colors_1.default.cyan(timeLine[1])].join(' ') + ' '.repeat(5),
                        tree[k].replace(/M/, '✔') + ' ',
                        subject,
                    ].join(''));
                });
                _this.s.Main.commit.clearItems();
                _this.commits.forEach(function (v) { return _this.s.Main.commit.addItem(v); });
                var label = name ? colors_1.default.cyan(name) + colors_1.default.white('(view mode)') : colors_1.default.cyan(Git.getNowBranch());
                _this.s.Main.commit.setLabel(" " + label + " ");
            }
        };
        this.modefied = {
            set: function (id) {
                var modefiedFiles = Git.getModified(id);
                _this.s.Main.modefied.setContent(colors_1.default.white(" " + modefiedFiles.length + " Files")
                    + ("\n" + modefiedFiles.join('\n')));
                _this.s.render();
            }
        };
    }
    return main;
}());
exports.default = main;
