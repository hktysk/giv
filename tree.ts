const gitTreeSymbol = {
  commit: '*',
  vertical: '|',
  merge: '\\',
  branch: '/'
}

const symbol = {
  commit: '*',
  merged: 'M',
  vertical: '│',
  horizontal: '─',
  merge: '╮' , //'┐',
  branch: '╯'  //'┘'
}

const r = (tree: Array<string[]>): string[] => {
  let t: string[] = []
  for (const k in tree) {
    t.push(tree[k].join('').trim())
  }

  return t.reverse()
}

export default function convertTree(s: string) {
  const gitTree: Array<string[]> = s.trim().split('\n').map(x => x.split(''))
  gitTree.reverse()

  let tree: Array<string[]> = []
  let left: boolean = false /* left means merged */
  for (let verticalIndex = 0; verticalIndex < gitTree.length; verticalIndex++) {
    if (left === false) {
      /*
        When merging,
        the commit symbol in the next level is lowered by one level,
        so there is no need for a new array
      */
      tree.push([])
    }

    let row: string[] = tree[tree.length - 1]
    let beforeRow: string[] = tree[tree.length - 2]
    let right: boolean = false /* right means branched */

    for (let horizontalIndex = 0; horizontalIndex < gitTree[verticalIndex].length; horizontalIndex++) {
      const v = gitTree[verticalIndex][horizontalIndex]

      if (left === true && horizontalIndex === 0) {
        /* The next line with the symbol for merging */
        for (const horizontalIndex2 in gitTree[verticalIndex]) {
          /*
            Shift the commit symbol down one level.
            Because gitTree merge inserts one extra line using '\'
          */
          if (gitTree[verticalIndex][horizontalIndex2] === symbol.commit) {
            row[horizontalIndex2] = symbol.commit
          }
        }

        for (let horizontalIndex2 = 0; horizontalIndex2 < row.length; horizontalIndex2++) {
          if (row[horizontalIndex2] === symbol.merge) {
            if (gitTree[verticalIndex][horizontalIndex2] === gitTreeSymbol.vertical) {
              row[horizontalIndex2] = symbol.vertical
            }
            if (row[horizontalIndex2 - 2] === ' ') { /* Remove extra white space */
              row[horizontalIndex2 - 2] = symbol.horizontal
              row[horizontalIndex2 - 1] = symbol.merge
              row.splice(horizontalIndex2, 1)
            }
          }
        }

        left = false

        /* This line does not need to be added to tree */
        break
      }

      switch(v) {
        case gitTreeSymbol.vertical:
          row.push(symbol.vertical)
          break

        case gitTreeSymbol.branch:
          /* Move the branch symbol down one level */
          beforeRow[horizontalIndex] = symbol.horizontal // Added horizontal symbol for better visibility
          const n = horizontalIndex + 1
          if (beforeRow[n] !== symbol.commit) beforeRow[n] = symbol.branch
          right = true
          break

        case gitTreeSymbol.merge:
          row.push(symbol.horizontal)
          row.push(symbol.merge)
          left = true
          break

        default:
          row.push(v)
      }
    }

    /*
      When branching,
      the branching symbol is lowered by one level,
      so there is no need to add this line
    */
    if (right === true) tree.pop()
  }


  /* Fine processing to make it easier to see */
  for (let verticalIndex = 0; verticalIndex < tree.length; verticalIndex++) {
    const row = tree[verticalIndex]
    const beforeRow = tree[verticalIndex - 1]
    const nextRow = tree[verticalIndex + 1]
    let commited = false

    for (let horizontalIndex = 0; horizontalIndex < row.length; horizontalIndex++) {

      if (row[horizontalIndex] === symbol.merge) {
        if (row[horizontalIndex - 1] === symbol.horizontal && row[horizontalIndex + 1] === symbol.horizontal) {
          row[horizontalIndex] = nextRow[horizontalIndex] === symbol.vertical ? symbol.vertical : '┬'
        }

        /* Replace the merge symbol with 'M' for clarity */
        row[row.indexOf(symbol.commit)] = symbol.merged
      }

      if (row[horizontalIndex] === symbol.branch) {
        if (row[horizontalIndex - 1] === symbol.horizontal && row[horizontalIndex + 1] === symbol.horizontal) {
          row[horizontalIndex] = beforeRow[horizontalIndex] === symbol.vertical ?  symbol.vertical : '┴'
        }
      }

      /* Remove unnecessary 'symbol.horizontal' when there is no commit */
      if (row[horizontalIndex] === symbol.commit) commited = true
      if (commited === false && row[horizontalIndex] === symbol.horizontal) {
        row[horizontalIndex] = ' '
      }
    }
  }

  return r(tree)
}
