import blessed from 'blessed'
import contrib from 'blessed-contrib'
import colors from 'colors'
import moment from 'moment'
import * as giv from './giv.modules'

const givScreenName: giv.ScreenName = {
  main: {
    commit: 'commit',
    branch: 'branch',
    modefied: 'modefied',
    diff: 'diff'
  },
  newBranch: 'newBranch'
}

let state: {
  location: string,
  commitIndex: number
} = {
  location: givScreenName.main.commit,
  commitIndex: 0
}

const Config: giv.Config = new giv.Config(blessed.screen())
const grid: contrib.grid = new contrib.grid(Config.Main.Grid)

const givScreen: giv.Screen = {
  main: {
    commit: grid.set(0, 0, 15, 13, contrib.table, Config.Main.CommitTable),
    branch: grid.set(15, 0, 5, 6, contrib.table, Config.Main.BranchTable),
    modefied: grid.set(15, 6, 5, 7, contrib.table, Config.Main.ModefiedTable),
    diff: grid.set(0, 13, 20, 7, contrib.table, Config.Main.DiffTable),
  },
  loading: {
    diff: grid.set(0, 13, 20, 7, blessed.text, Config.Loading.Diff)
  },
  newBranch: {
    name: blessed.textbox(Config.NewBranch.Name),
    label: blessed.text(Config.NewBranch.Label),
    label2: blessed.text(Config.NewBranch.Label2),
    createdLabel: blessed.text(Config.NewBranch.CreatedLabel),
    strErrorLabel: blessed.text(Config.NewBranch.StrErrorLabel),
    branchErrorLabel: blessed.text(Config.NewBranch.BranchErrorLabel)
  }
}

function switchScreen(screenName: string): void {
  for (const k in givScreen) {
    if (k === screenName) {
      for (const k2 in givScreen[k]) givScreen[k][k2].show()
      continue
    }
    for (const k2 in givScreen[k]) givScreen[k][k2].hide()
  }
}
function screenInit(): void {
  switchScreen('main')
  state.location = givScreenName.main.commit
  Config.screen.render()
  givScreen.main.commit.focus()
}

switchScreen('main')
givScreen.main.commit.focus()

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

givScreen.main.commit.setData({
  headers: [' TL', ' GRAPH', ' MESSAGE', ' AUTHOR', ' DATE'],
  data: commits
})

const branches: Array<string[]> = giv.getGitBranches()
givScreen.main.branch.setData({
  headers: [colors.gray(` ${ branches.length } branches`)],
  data: branches
})

function setDiffScreen (compareCommitId: string, comparedCommitId?: string): void {
  const diff: string[] = comparedCommitId ?
    giv.getGitDiff(compareCommitId, comparedCommitId)
    : giv.getGitDiff(compareCommitId)

  givScreen.main.diff.setData({
    headers: [''],
    data: giv.coloringGitDiff(diff)
  })

  const modefiedFiles: Array<string[]> = comparedCommitId ?
    giv.getGitModifiedFiles(compareCommitId, comparedCommitId)
    : giv.getGitModifiedFiles(compareCommitId)

  givScreen.main.modefied.setData({
    headers: [colors.gray(` ${ modefiedFiles.length } Files`)],
    data: modefiedFiles
  })

  givScreen.loading.diff.hide()
  Config.screen.render()
}

gitLog.length > 1 ?
  setDiffScreen(gitLog[0].id, gitLog[1].id)
  : setDiffScreen(gitLog[0].id)

let timeout: NodeJS.Timeout[] = []
let loadingTime = 300
Config.screen.key('down', () => {
  if (state.commitIndex === gitLog.length - 1) return
  if (timeout) {
    for (const v of timeout)  clearTimeout(v)
  }
  state.commitIndex++;

  givScreen.loading.diff.show()

  const isLastLog: boolean = (state.commitIndex === gitLog.length - 1)
  timeout.push(setTimeout(() => {
    isLastLog ?
      setDiffScreen(gitLog[state.commitIndex].id)
    : setDiffScreen(gitLog[state.commitIndex].id, gitLog[state.commitIndex + 1].id)
  }, loadingTime))
})
Config.screen.key('up', () => {
  if (state.commitIndex === 0) return
  if (timeout) {
    for (const v of timeout)  clearTimeout(v)
  }
  state.commitIndex--;

  givScreen.loading.diff.show()

  const isLastLog: boolean = (state.commitIndex === gitLog.length - 1)
  timeout.push(setTimeout(() => {
    isLastLog ?
      setDiffScreen(gitLog[state.commitIndex].id)
    : setDiffScreen(gitLog[state.commitIndex].id, gitLog[state.commitIndex + 1].id)
  }, loadingTime))
})

Config.screen.key('h', () => {
  switchScreen('newBranch')
  givScreen.newBranch.createdLabel.hide()
  givScreen.newBranch.strErrorLabel.hide()
  givScreen.newBranch.branchErrorLabel.hide()
  givScreen.newBranch.name.focus()
  Config.screen.render()
  state.location = givScreenName.newBranch
})

givScreen.newBranch.name.key(['enter'], () => {
  const newBranch = givScreen.newBranch
  const name: string = newBranch.name.value.trim()

  newBranch.label.hide()
  newBranch.label2.hide()
  Config.screen.render()
  const branches: string[] = giv.getGitBranches().map(x => x[0].replace('*', '').trim())

  if(branches.indexOf(name) > -1) {
    newBranch.branchErrorLabel.show()
    Config.screen.render()
  } else if(name.length === 0) {
    newBranch.strErrorLabel.show()
    Config.screen.render()
  } else {
    giv.createGitNewBranch(name)
    newBranch.name.hide()
    newBranch.createdLabel.show()
    Config.screen.render()
    setTimeout(() => {
      screenInit()
      newBranch.name.value = ''
    }, 2000)
    return
  }

  setTimeout(() => {
    newBranch.strErrorLabel.hide()
    newBranch.branchErrorLabel.hide()
    newBranch.label.show()
    newBranch.label2.show()
    Config.screen.render()
    newBranch.name.focus()
  }, 2000)
})

Config.screen.key(['escape', 'q', 'C-['], () => {
  if (state.location === givScreenName.newBranch) {
    screenInit()
    return
  }
  process.exit(0)
})
Config.screen.key(['C-c'], () => process.exit(0))
Config.screen.render()

