import colors from 'colors'

const symbol = {
  commit: '*',
  merged: 'M',
  vertical: '│',
  horizontal: '─',
  merge: '╮' , //'┐',
  branch: '╯'  //'┘'
}

function allIndexOf<T>(ary: T[] | T[], val: T | T): number[] {
  let indexes: number[] = [], i: number = -1
  while((i = ary.indexOf(val, i + 1)) != -1) {
    indexes.push(i)
  }

  return indexes
}

export function convertTree(s: string, merges: string[]): string[] {

  let info: string[] = s.trim().split('\n')
  let hashes: string[] = []
  let normalParents: string[] = []
  let secondsParents: string[] = []
  let parents: Array<string[]> = []
  let positions: number[] = []

  while (info.length > 1) {
    hashes.push(info[0])
    const p = info[1].split(' ')
    normalParents.push(p[0])
    secondsParents.push(p.length > 1 ? p[1] : '')
    parents.push(p)
    positions.push(0)

    info = info.slice(2)
  }

  /* Pritter */
  let tree: Array<string[]> = []
  let branch: boolean = false
  let shorted: number[] = []
  interface Corner {
    row: number
    pos: number
    shorted: number
    keyStr: string
  }
  let corner: Corner[] = []

  for (let vertical = 0; vertical < hashes.length; vertical++) {
    if (vertical === 0) {
      const isMerge: boolean = (merges.indexOf(hashes[0]) > -1)
      const row: string[] = isMerge ?
        [symbol.merged, symbol.horizontal, symbol.merge]
        : [symbol.commit]
      tree.push(row)
      positions[0] = 0
      continue
    }

    tree.push([])
    let index = tree.length - 1
    let current = {
      row: tree[index],
      hash: hashes[index],
      parent: parents[index],
      position: positions[index],
    }
    const before = {
      row: tree[index - 1],
      hash: hashes[index - 1],
      parent: parents[index - 1],
      position: positions[index - 1],
    }

    const isMerge: boolean = (merges.indexOf(current.hash) > -1)
    const inParents: number[] = []
    parents.forEach((v, k) => {
      if (v[0] === current.hash) {
        inParents.push(k)
        return
      }
      if (v.length > 1) {
        if (v[1] === current.hash) inParents.push(k)
      }
    })

    before.row.forEach(() => current.row.push(' '))

    for (const k in current.row) {
      switch(before.row[k]) {
        case symbol.commit:
        case symbol.merged:
        case symbol.merge:
        case symbol.vertical:
        case '┌':
        case '┤':
        case '┼':
          current.row[k] = symbol.vertical
          break

        default:
          current.row[k] = ' '
      }
    }


    // Normal
    let child = inParents[inParents.length - 1]
    let pos = positions[child]

    if (branch && merges.indexOf(hashes[child]) === -1) {
      branch = false
    }

    if (merges.indexOf(hashes[child]) > -1) {
      if (current.hash === parents[child][1]) {
        if (shorted.indexOf(child) > -1) {
          pos = positions[child]
        } else {
          // shortedを除いたらこれだけでいいのでは
          let mergeSymbol = tree[child].indexOf(symbol.merge)
          if (mergeSymbol === - 1) mergeSymbol = tree[child].indexOf('┼')

          pos = mergeSymbol > -1 ? mergeSymbol : tree[child].indexOf('┤')
        }
      } else {
        if (hashes.indexOf(parents[child][1]) > hashes.indexOf(current.hash)) {
          pos = tree[child].indexOf(symbol.merged)
          if (pos === - 1) pos = tree[child].indexOf('┼')
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

    const b = current.row[pos]
    before.row[pos] = before.row[pos] === symbol.branch ? '┤' : before.row[pos]
    current.row[pos] = isMerge ? symbol.merged : symbol.commit
    positions[index] = pos

    if (inParents.length > 1) {
      branch = true
      // Branch
      let max: number
      if (merges.indexOf(hashes[child]) > -1) {
        if (parents[child][0] === current.hash) {
          if (parents[child].length > 1 && parents[child][1] !== current.hash) {
            child = inParents.find(x => {
              const normal: boolean = (parents[x][0] === current.hash && parents[x].length === 1)
              const compareHash: boolean = (hashes.indexOf(parents[x][1]) > hashes.indexOf(current.hash))
              return (normal || compareHash)
            })
          }
          max = positions[child]
        } else {
          max = tree[child].length - 1
        }
      } else {
        max = Math.max(...inParents.map(x => {
          if (merges.indexOf(hashes[x]) > -1) {
            if (parents[x][1] !== current.hash) {
              return 0
            } else if (shorted.indexOf(x) === -1) {
              return tree[x].length - 1
            } else {
              return positions[x]
            }
          } else {
            return positions[x]
          }
        }))
      }
      const min: number = Math.min(...inParents.map(x => current.hash === normalParents[x] ? positions[x] : current.row.length))
      current.row[pos] = b
      current.row[min] = isMerge ? symbol.merged : symbol.commit
      positions[index] = min
      const childPos: number[] = inParents.map(x => positions[x])
      current.row.forEach((v, k) => {
        const child = inParents[childPos.indexOf(k)]
        //const Parents: string[] = parents[hashes.indexOf(current.hash)]
        const childParents: string[] = parents[child]
        const isVertical: boolean = (v === symbol.vertical)
        const childIsMerge: boolean = (merges.indexOf(hashes[child]) > -1)

        interface Is {
          normal: boolean
          max: boolean
          normalEndBranch: boolean
          caseSecondsParentsEndBranch: boolean
        }
        const is: Is = {
          normal: (k > min && k < max && v === ' '),
          max: (k === max),
          normalEndBranch: (childPos.indexOf(k) > -1 && isVertical && k !== min && childParents[0] === current.hash),
          caseSecondsParentsEndBranch: (isVertical && childIsMerge && childParents[1] === current.hash)
        }

        if (is.normal) {
          current.row[k] = symbol.horizontal
        } else if (is.max) {
          current.row[k] = symbol.branch
          if (
            childParents && childParents.length > 1 && tree[child].indexOf(symbol.merge) === -1
            || isMerge && current.row.indexOf('┴') === -1
          ) {
            current.row[k] = '┤'
          }

          if (before.row[k] === symbol.branch) before.row[k] = '┤'
        } else if (is.normalEndBranch) {
          const isLast: boolean = (k === current.row.length - 1)
          const isNextHoraizontal: boolean = (!isLast && current.row[k + 1] === symbol.horizontal)

          current.row[k] = isLast || isNextHoraizontal ? symbol.branch : '┴'
        } else if (is.caseSecondsParentsEndBranch) {
          const n = shorted.indexOf(child) > -1 ?
            positions[child]
            : tree[child].indexOf(symbol.merge)

          current.row[n] = '┴'
        }
      })
    }

    /* left justify the vertical symbol  */
    let currentPos: number[] = []
    current.row.forEach((v, k) => {
      if (v !== ' ') currentPos.push(k)
    })
    currentPos.forEach(v => {
      if (v < 4) return
      const chk: boolean = (current.row[v - 3] === ' ' && current.row[v - 2] === ' ' && current.row[v - 1] === ' ')
      if (!chk) return
      let keyStr: string = current.row[v]
      let move: number = 0
      let index: number = v
      while (index > 2) {
        index--
        if (current.row[index - 1] !== ' ') break
        current.row[index] = symbol.horizontal
        move++
      }
      if (move === 0) return
      current.row[v] = '┘'
      current.row[v - move] = keyStr === symbol.vertical ? '┌' : keyStr
      keyStr = current.row[v - move]

      let k: number = tree.length - 1
      let continueCorner: Corner = null

      if (keyStr === '┌') {
        for (let i = tree.length - 2; i > 0; i--) {
          if (shorted.indexOf(i) > -1) {
            continueCorner = corner.find(x => x.row === i && x.pos === v)
            break
          }
          if (tree[i][v] !== symbol.vertical) {
            break
          }
        }

        for (let i = tree.length - 2; i > 0; i--) {
          if (continueCorner) {
            if (v - move === positions[continueCorner.shorted]) move = 0
            positions[continueCorner.shorted] -= Math.abs(move)
            shorted.push(continueCorner.shorted)
            break
          }
          if (tree[i][v] !== symbol.commit && tree[i][v] !== symbol.merged && tree[i][v] !== symbol.merge && tree[i][v] !== '┤') {
            continue
          }
          if (v - move === positions[i]) move = 0
          k = i
          break
        }
      }

     if (!continueCorner) {
        positions[k] = v - move
        shorted.push(k)
      }

      corner.push({
        row: tree.length - 1,
        pos: v - move,
        shorted: shorted[shorted.length - 1],
        keyStr
      })
    })

    while(current.row[current.row.length - 1] === ' ') {
      current.row.splice(current.row.length - 1, 1)
    }

    if (isMerge) {
      const isFinishedTwoBeforeMerge: boolean = (
        merges.indexOf(hashes[tree.length - 3]) > -1
        && hashes.indexOf(parents[tree.length - 3][1]) < hashes.indexOf(current.hash) // double branch
        && parents[hashes.indexOf(parents[hashes.indexOf(hashes[tree.length - 3])][1])][0] !== current.hash // double merge
      )
      if (!branch || isFinishedTwoBeforeMerge) {
        // Merge
        current.row.push(symbol.horizontal)
        current.row.push(symbol.merge)
        current.row.forEach((x, k) => {
          if (k > pos && x === ' ') current.row[k] = symbol.horizontal
        })
      } else {
        const n = current.row.indexOf('┴')
        if (n > -1) {
          const isCross = (
            current.row[n + 1] === symbol.horizontal
            || current.row[n + 1] === symbol.branch
          )
          current.row[n] = isCross ? '┼' : symbol.merge
          branch = false
        }
      }
    }

  }

  tree.push(tree[tree.length - 1].indexOf(symbol.commit) === 2 ? ['I', symbol.horizontal, symbol.branch] : ['I']) // initialHash
  return tree.map(x => x.join(''))
}

export function coloringTree(tree: string[], commitId: string[], mergeId: string[]): string[] {
  tree.forEach((v, k) => {
    if (mergeId.indexOf(commitId[k]) > -1) {
      v = v.replace('*', 'M')
    }

    v = v.split('')
    .map(x => colors.cyan(x))
    .join('')

    v = v
    .replace('M', colors.yellow('M'))
    .replace('*', colors.cyan('◉'))

    tree[k] = v
  })

  return tree
}
