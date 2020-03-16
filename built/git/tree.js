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
Object.defineProperty(exports, "__esModule", { value: true });
var colors_1 = __importDefault(require("colors"));
var symbol = {
    commit: '*',
    merged: 'M',
    vertical: '│',
    horizontal: '─',
    merge: '╮',
    branch: '╯' //'┘'
};
function allIndexOf(ary, val) {
    var indexes = [], i = -1;
    while ((i = ary.indexOf(val, i + 1)) != -1) {
        indexes.push(i);
    }
    return indexes;
}
function convertTree(s, merges) {
    var info = s.trim().split('\n');
    var hashes = [];
    var normalParents = [];
    var secondsParents = [];
    var parents = [];
    var positions = [];
    while (info.length > 1) {
        hashes.push(info[0]);
        var p = info[1].split(' ');
        normalParents.push(p[0]);
        secondsParents.push(p.length > 1 ? p[1] : '');
        parents.push(p);
        positions.push(0);
        info = info.slice(2);
    }
    /* Pritter */
    var tree = [];
    var branch = false;
    var shorted = [];
    var corner = [];
    var _loop_1 = function (vertical) {
        if (vertical === 0) {
            var isMerge_1 = (merges.indexOf(hashes[0]) > -1);
            var row = isMerge_1 ?
                [symbol.merged, symbol.horizontal, symbol.merge]
                : [symbol.commit];
            tree.push(row);
            positions[0] = 0;
            return "continue";
        }
        tree.push([]);
        var index = tree.length - 1;
        var current = {
            row: tree[index],
            hash: hashes[index],
            parent: parents[index],
            position: positions[index],
        };
        var before = {
            row: tree[index - 1],
            hash: hashes[index - 1],
            parent: parents[index - 1],
            position: positions[index - 1],
        };
        var isMerge = (merges.indexOf(current.hash) > -1);
        var inParents = [];
        parents.forEach(function (v, k) {
            if (v[0] === current.hash) {
                inParents.push(k);
                return;
            }
            if (v.length > 1) {
                if (v[1] === current.hash)
                    inParents.push(k);
            }
        });
        before.row.forEach(function () { return current.row.push(' '); });
        for (var k in current.row) {
            switch (before.row[k]) {
                case symbol.commit:
                case symbol.merged:
                case symbol.merge:
                case symbol.vertical:
                case '┌':
                case '┤':
                case '┼':
                    current.row[k] = symbol.vertical;
                    break;
                default:
                    current.row[k] = ' ';
            }
        }
        // Normal
        var child = inParents[inParents.length - 1];
        var pos = positions[child];
        if (branch && merges.indexOf(hashes[child]) === -1) {
            branch = false;
        }
        if (merges.indexOf(hashes[child]) > -1) {
            if (current.hash === parents[child][1]) {
                if (shorted.indexOf(child) > -1) {
                    pos = positions[child];
                }
                else {
                    // shortedを除いたらこれだけでいいのでは
                    var mergeSymbol = tree[child].indexOf(symbol.merge);
                    if (mergeSymbol === -1)
                        mergeSymbol = tree[child].indexOf('┼');
                    pos = mergeSymbol > -1 ? mergeSymbol : tree[child].indexOf('┤');
                }
            }
            else {
                if (hashes.indexOf(parents[child][1]) > hashes.indexOf(current.hash)) {
                    pos = tree[child].indexOf(symbol.merged);
                    if (pos === -1)
                        pos = tree[child].indexOf('┼');
                }
            }
        }
        //console.log(hashes)
        //console.log(parents)
        //console.log(merges)
        //console.log(hashes[child])
        //console.log(current.hash)
        //console.log(pos)
        //console.log(child)
        //console.log(tree[child])
        //console.log(merges.indexOf(hashes[child]) > -1)
        var b = current.row[pos];
        before.row[pos] = before.row[pos] === symbol.branch ? '┤' : before.row[pos];
        current.row[pos] = isMerge ? symbol.merged : symbol.commit;
        positions[index] = pos;
        if (inParents.length > 1) {
            branch = true;
            // Branch
            var max_1;
            if (merges.indexOf(hashes[child]) > -1) {
                if (parents[child][0] === current.hash) {
                    if (parents[child].length > 1 && parents[child][1] !== current.hash) {
                        child = inParents.find(function (x) {
                            var normal = (parents[x][0] === current.hash && parents[x].length === 1);
                            var compareHash = (hashes.indexOf(parents[x][1]) > hashes.indexOf(current.hash));
                            return (normal || compareHash);
                        });
                    }
                    max_1 = positions[child];
                }
                else {
                    max_1 = tree[child].length - 1;
                }
            }
            else {
                max_1 = Math.max.apply(Math, __spread(inParents.map(function (x) {
                    if (merges.indexOf(hashes[x]) > -1) {
                        if (parents[x][1] !== current.hash) {
                            return 0;
                        }
                        else if (shorted.indexOf(x) === -1) {
                            return tree[x].length - 1;
                        }
                        else {
                            return positions[x];
                        }
                    }
                    else {
                        return positions[x];
                    }
                })));
            }
            var min_1 = Math.min.apply(Math, __spread(inParents.map(function (x) { return current.hash === normalParents[x] ? positions[x] : current.row.length; })));
            current.row[pos] = b;
            current.row[min_1] = isMerge ? symbol.merged : symbol.commit;
            positions[index] = min_1;
            var childPos_1 = inParents.map(function (x) { return positions[x]; });
            current.row.forEach(function (v, k) {
                var child = inParents[childPos_1.indexOf(k)];
                //const Parents: string[] = parents[hashes.indexOf(current.hash)]
                var childParents = parents[child];
                var isVertical = (v === symbol.vertical);
                var childIsMerge = (merges.indexOf(hashes[child]) > -1);
                var is = {
                    normal: (k > min_1 && k < max_1 && v === ' '),
                    max: (k === max_1),
                    normalEndBranch: (childPos_1.indexOf(k) > -1 && isVertical && k !== min_1 && childParents[0] === current.hash),
                    caseSecondsParentsEndBranch: (isVertical && childIsMerge && childParents[1] === current.hash)
                };
                if (is.normal) {
                    current.row[k] = symbol.horizontal;
                }
                else if (is.max) {
                    current.row[k] = symbol.branch;
                    if (childParents && childParents.length > 1 && tree[child].indexOf(symbol.merge) === -1
                        || isMerge && current.row.indexOf('┴') === -1) {
                        current.row[k] = '┤';
                    }
                    if (before.row[k] === symbol.branch)
                        before.row[k] = '┤';
                }
                else if (is.normalEndBranch) {
                    var isLast = (k === current.row.length - 1);
                    var isNextHoraizontal = (!isLast && current.row[k + 1] === symbol.horizontal);
                    current.row[k] = isLast || isNextHoraizontal ? symbol.branch : '┴';
                }
                else if (is.caseSecondsParentsEndBranch) {
                    var n = shorted.indexOf(child) > -1 ?
                        positions[child]
                        : tree[child].indexOf(symbol.merge);
                    current.row[n] = '┴';
                }
            });
        }
        /* left justify the vertical symbol  */
        var currentPos = [];
        current.row.forEach(function (v, k) {
            if (v !== ' ')
                currentPos.push(k);
        });
        currentPos.forEach(function (v) {
            if (v < 4)
                return;
            var chk = (current.row[v - 3] === ' ' && current.row[v - 2] === ' ' && current.row[v - 1] === ' ');
            if (!chk)
                return;
            var keyStr = current.row[v];
            var move = 0;
            var index = v;
            while (index > 2) {
                index--;
                if (current.row[index - 1] !== ' ')
                    break;
                current.row[index] = symbol.horizontal;
                move++;
            }
            if (move === 0)
                return;
            current.row[v] = '┘';
            current.row[v - move] = keyStr === symbol.vertical ? '┌' : keyStr;
            keyStr = current.row[v - move];
            var k = tree.length - 1;
            var continueCorner = null;
            if (keyStr === '┌') {
                var _loop_2 = function (i) {
                    if (shorted.indexOf(i) > -1) {
                        continueCorner = corner.find(function (x) { return x.row === i && x.pos === v; });
                        return "break";
                    }
                    if (tree[i][v] !== symbol.vertical) {
                        return "break";
                    }
                };
                for (var i = tree.length - 2; i > 0; i--) {
                    var state_1 = _loop_2(i);
                    if (state_1 === "break")
                        break;
                }
                for (var i = tree.length - 2; i > 0; i--) {
                    if (continueCorner) {
                        if (v - move === positions[continueCorner.shorted])
                            move = 0;
                        positions[continueCorner.shorted] -= Math.abs(move);
                        shorted.push(continueCorner.shorted);
                        break;
                    }
                    if (tree[i][v] !== symbol.commit && tree[i][v] !== symbol.merged && tree[i][v] !== symbol.merge && tree[i][v] !== '┤') {
                        continue;
                    }
                    if (v - move === positions[i])
                        move = 0;
                    k = i;
                    break;
                }
            }
            if (!continueCorner) {
                positions[k] = v - move;
                shorted.push(k);
            }
            corner.push({
                row: tree.length - 1,
                pos: v - move,
                shorted: shorted[shorted.length - 1],
                keyStr: keyStr
            });
        });
        while (current.row[current.row.length - 1] === ' ') {
            current.row.splice(current.row.length - 1, 1);
        }
        if (isMerge) {
            var isFinishedTwoBeforeMerge = (merges.indexOf(hashes[tree.length - 3]) > -1
                && hashes.indexOf(parents[tree.length - 3][1]) < hashes.indexOf(current.hash) // double branch
                && parents[hashes.indexOf(parents[hashes.indexOf(hashes[tree.length - 3])][1])][0] !== current.hash // double merge
            );
            if (!branch || isFinishedTwoBeforeMerge) {
                // Merge
                current.row.push(symbol.horizontal);
                current.row.push(symbol.merge);
                current.row.forEach(function (x, k) {
                    if (k > pos && x === ' ')
                        current.row[k] = symbol.horizontal;
                });
            }
            else {
                var n = current.row.indexOf('┴');
                if (n > -1) {
                    var isCross = (current.row[n + 1] === symbol.horizontal
                        || current.row[n + 1] === symbol.branch);
                    current.row[n] = isCross ? '┼' : symbol.merge;
                    branch = false;
                }
            }
        }
    };
    for (var vertical = 0; vertical < hashes.length; vertical++) {
        _loop_1(vertical);
    }
    tree.push(tree[tree.length - 1].indexOf(symbol.commit) === 2 ? ['I', symbol.horizontal, symbol.branch] : ['I']); // initialHash
    return tree.map(function (x) { return x.join(''); });
}
exports.convertTree = convertTree;
function coloringTree(tree, commitId, mergeId) {
    tree.forEach(function (v, k) {
        if (mergeId.indexOf(commitId[k]) > -1) {
            v = v.replace('*', 'M');
        }
        v = v.split('')
            .map(function (x) { return colors_1.default.cyan(x); })
            .join('');
        v = v
            .replace('M', colors_1.default.yellow('M'))
            .replace('*', colors_1.default.cyan('◉'));
        tree[k] = v;
    });
    return tree;
}
exports.coloringTree = coloringTree;
