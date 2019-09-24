"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var blessed_1 = __importDefault(require("blessed"));
var blessed_contrib_1 = __importDefault(require("blessed-contrib"));
var child_process_1 = require("child_process");
var colors_1 = __importDefault(require("colors"));
var moment_1 = __importDefault(require("moment"));
var tree_1 = __importDefault(require("./tree"));
var screen = blessed_1.default.screen();
var grid = new blessed_contrib_1.default.grid({
    rows: 20,
    cols: 20,
    screen: screen
});
var commitsTable = grid.set(0, 0, 15, 13, blessed_contrib_1.default.table, {
    keys: true,
    parent: screen,
    fg: 'white',
    selectedFg: 'white',
    selectedBg: 'black',
    interactive: 'true',
    label: 'COMMIT',
    width: '48%',
    height: '100%',
    border: { type: 'line', fg: 'cyan' },
    columnSpacing: 0,
    columnWidth: [10, 10, 40, 13, 23],
    alwaysScroll: true
});
var branchesTable = grid.set(15, 0, 5, 6, blessed_contrib_1.default.table, {
    keys: true,
    parent: screen,
    fg: 'white',
    selectedFg: 'white',
    selectedBg: 'blue',
    interactive: 'true',
    label: 'BRANCH',
    width: '48%',
    height: '100%',
    border: { type: 'line', fg: 'cyan' },
    columnSpacing: 10,
    columnWidth: [16, 12, 12],
});
var modefiedFilesTable = grid.set(15, 6, 5, 7, blessed_contrib_1.default.table, {
    keys: true,
    parent: screen,
    fg: 'white',
    selectedFg: 'white',
    selectedBg: 'blue',
    interactive: 'true',
    label: 'MODEFIED',
    width: '48%',
    height: '100%',
    border: { type: 'line', fg: 'cyan' },
    columnSpacing: 10,
    columnWidth: [16, 12, 12],
});
var markdown = grid.set(0, 13, 20, 7, blessed_contrib_1.default.markdown);
var index = 0;
var exec = '[' + child_process_1.execSync('git log --pretty=format:\'{"subject": "%s","commiter": "%cN","date": "%cD"},\'').toString().trim().slice(0, -1) + ']';
var t = JSON.parse(exec);
var items = [];
var tree = tree_1.default(child_process_1.execSync('git log --graph --all --format="%x09"').toString().trim());
for (var i = 0; i < t.length; i++) {
    var v = t[i];
    var subject = v.subject.length > 36 ? v.subject.slice(0, 36) + '...' : v.subject;
    subject = subject.indexOf('M') > -1 ? colors_1.default.yellow('✔ ') + colors_1.default.cyan(subject) : colors_1.default.green('» ') + subject;
    var timeLine = moment_1.default(v.date).fromNow(true).split(' ');
    items.push([
        timeLine[0].padStart(2, ' ').replace('a', '1') + ' ' + colors_1.default.cyan(timeLine[1].replace(/(hours|hour)/, 'h').replace(/(minutes|minute)/, 'm').replace(/(seconds|second)/, 's')),
        tree[i].split('').map(function (x) { return colors_1.default.cyan(x); }).join('').replace('M', colors_1.default.yellow('M')).replace('*', colors_1.default.green('c')),
        subject,
        colors_1.default.cyan('❤ ') + colors_1.default.green(v.commiter),
        colors_1.default.gray(moment_1.default(v.date).format('DD MMM HH:mm:ss').toLowerCase()),
    ]);
}
var data = {
    headers: [' TL', ' GRAPH', ' MESSAGE', ' AUTHOR', ' DATE'],
    data: items
};
branchesTable.focus();
modefiedFilesTable.focus();
commitsTable.focus();
commitsTable.setData(data);
/*screen.key('down', () => {
  if (index === items.length - 1) return
  if (index < items.length - 1) {
    const s: string[] = execSync(`cat diff`).toString().split('\n')
    let diff = []
    for (const v of s) {
      if (v.charAt(0) === '-') {
        diff.push(colors.red(v))
      } else if (v.charAt(0) === '+') {
        diff.push(colors.green(v))
      } else if(v.charAt(0) === '@' && v.charAt(1) === '@') {
        diff.push(colors.cyan(v))
      } else {
        diff.push(v)
      }
    }
    markdown.setMarkdown(diff.join('\n'))
    markdown.focus()
  }
  index++
})*/
screen.key('up', function () {
    if (index === 0)
        return;
    index--;
});
screen.key(['escape', 'q', 'C-c'], function () { return process.exit(0); });
screen.render();
