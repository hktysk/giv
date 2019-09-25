import blessed from 'blessed'
import contrib from 'blessed-contrib'
import colors from 'colors'
import moment from 'moment'
import * as giv from './giv.modules'

const givScreenName: giv.ScreenName = {
  commit: 'commit',
  branch: 'branch',
  modefied: 'modefied',
  diff: 'diff'
}

let state: {
  location: string,
  commitIndex: number
} = {
  location: givScreenName.commit,
  commitIndex: 0
}

const Config: giv.Config = new giv.Config(blessed.screen())
const grid: contrib.grid = new contrib.grid(Config.Grid)

const givScreen: giv.Screen = {
  commit: grid.set(0, 0, 15, 13, contrib.table, Config.CommitTable),
  branch: grid.set(15, 0, 5, 6, contrib.table, Config.BranchTable),
  modefied: grid.set(15, 6, 5, 7, contrib.table, Config.ModefiedTable),
  diff: grid.set(0, 13, 20, 7, contrib.table, Config.DiffTable)
}

givScreen.commit.focus()

const gitLog: giv.GitLog[] = giv.getGitLog()
const gitTree: string[] = giv.getGitTree()
let commits: Array<string[]> = []
const subjectLimit: number = 36

for (let i = 0; i < gitLog.length; i++) {
  const log: giv.GitLog = gitLog[i]

  let subject: string = log.subject
  if (subject.length > subjectLimit) {
    subject = subject.slice(0, subjectLimit) + '...'
  }
  subject = subject.indexOf('M') > -1 ?
    colors.yellow('✔ ') + colors.cyan(subject)
    : colors.green('» ') + subject

  const date: moment.Moment = moment(log.date)
  let TL: string[] = date.fromNow(true).replace('a few', '1').split(' ')
  TL[0] = TL[0].padStart(2, ' ').replace('a', '1')
  TL[1] = TL[1].replace(/(hours|hour)/, 'h').replace(/(minutes|minute)/, 'm').replace(/(seconds|second)/, 's')

  let tree: string = gitTree[i].split('').map(x => colors.cyan(x)).join('')
  tree = tree.replace('M', colors.yellow('M')).replace('*', colors.green('c'))

  commits.push([
    `${ TL[0] } ${ TL[1] }`,
    tree,
    subject,
    colors.cyan('❤ ') + colors.green(log.commiter),
    colors.gray(date.format('DD MMM HH:mm:ss').toLowerCase()),
  ])
}

givScreen.commit.setData({
  headers: [' TL', ' GRAPH', ' MESSAGE', ' AUTHOR', ' DATE'],
  data: commits
})

const branches: Array<string[]> = giv.getGitBranches()
givScreen.branch.setData({
  headers: [colors.gray(` ${ branches.length } branches`)],
  data: branches
})

function setDiffScreen (compareCommitId: string, comparedCommitId?: string): void {
  const diff: string[] = comparedCommitId ?
    giv.getGitDiff(compareCommitId, comparedCommitId)
    : giv.getGitDiff(compareCommitId)

  givScreen.diff.setData({
    headers: [''],
    data: giv.coloringGitDiff(diff)
  })

  const modefiedFiles: Array<string[]> = comparedCommitId ?
    giv.getGitModifiedFiles(compareCommitId, comparedCommitId)
    : giv.getGitModifiedFiles(compareCommitId)

  givScreen.modefied.setData({
    headers: [colors.gray(` ${ modefiedFiles.length } Files`)],
    data: modefiedFiles
  })
}

gitLog.length > 1 ?
  setDiffScreen(gitLog[0].id, gitLog[1].id)
  : setDiffScreen(gitLog[0].id)

Config.screen.key('down', () => {
  if (state.commitIndex === gitLog.length - 1) return
  state.commitIndex++;

  const isLastLog: boolean = (state.commitIndex === gitLog.length - 1)
  isLastLog ?
    setDiffScreen(gitLog[state.commitIndex].id)
  : setDiffScreen(gitLog[state.commitIndex].id, gitLog[state.commitIndex + 1].id)
})
Config.screen.key('up', () => {
  if (state.commitIndex === 0) return
  state.commitIndex--;

  const isFirstLog = (state.commitIndex === 0)
  isFirstLog ?
    setDiffScreen(gitLog[state.commitIndex].id)
  : setDiffScreen(gitLog[state.commitIndex].id, gitLog[state.commitIndex + 1].id)
})

Config.screen.key(['escape', 'q', 'C-c'], () => process.exit(0))
Config.screen.render()
