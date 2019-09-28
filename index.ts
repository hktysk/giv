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
  help: 'help',
  newBranch: 'newBranch',
  checkoutBranch: 'checkoutBranch'
}

let state: {
  location: string,
} = {
  location: givScreenName.main.commit,
}

const Config: giv.Config = new giv.Config(blessed.screen({ smartCSR: true, title: 'giv' }))
const grid: contrib.grid = new contrib.grid(Config.Main.Grid)

const givScreen: giv.Screen = {
  main: {
    commit: grid.set(0, 0, 10, 20, blessed.listtable, Config.Main.CommitTable),
    branch: grid.set(10, 4, 10, 4, blessed.box, Config.Main.BranchTable),
    modefied: grid.set(10, 0, 10, 4, blessed.box, Config.Main.ModefiedTable),
    diff: grid.set(10, 8, 10, 12, blessed.box, Config.Main.DiffTable),
  },
  help: {
    text: blessed.text(Config.Help.Text)
  },
  newBranch: {
    name: blessed.textbox(Config.NewBranch.Name),
    label: blessed.text(Config.NewBranch.Label),
    label2: blessed.text(Config.NewBranch.Label2),
    createdLabel: blessed.text(Config.NewBranch.CreatedLabel),
    strErrorLabel: blessed.text(Config.NewBranch.StrErrorLabel),
    branchErrorLabel: blessed.text(Config.NewBranch.BranchErrorLabel)
  },
  checkoutBranch: {
    list: blessed.list(Config.CheckoutBranch.List)
  },
}

const checkoutBranches = giv.getGitBranches()
for (const v of checkoutBranches) {
  givScreen.checkoutBranch.list.addItem(v)
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
const gitMerges: string[] = giv.getGitMerges().map(x => x.id)
const gitTree: string[] = giv.getGitTree()
let commits: Array<string[]> = []
const subjectLimit: number = 75

for (let i = 0; i < gitLog.length; i++) {
  const log: giv.GitLog = gitLog[i]

  let subject: string = log.subject
  if (subject.length > subjectLimit) {
    subject = subject.slice(0, subjectLimit) + '...'
  }
  if (gitMerges.indexOf(log.id) > -1) {
    gitTree[i] = gitTree[i].replace('*', 'M')
    subject = colors.yellow('✔ ') + colors.cyan(subject)
  } else {
    subject = colors.green('» ') + subject
  }
  subject = subject.padEnd(70, '  ')

  const date: moment.Moment = moment(log.date)
  let TL: string[] = date.fromNow(true).replace('a few', '1').split(' ')
  TL[0] = TL[0].replace(/(an|a)/, '1').padStart(2, ' ')
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

givScreen.main.commit.setData([
  ['TL', 'GRAPH', 'MESSAGE', 'AUTHOR', 'DATE'],
  ...commits
])

const branches: string[] = giv.getGitBranches()
givScreen.main.branch.setContent(colors.gray(` ${ branches.length } branches`) + `\n${ branches.join('\n')}`)

function setDiffScreen (compareCommitId: string, comparedCommitId?: string): void {
  const diff: string[] = comparedCommitId ?
    giv.getGitDiff(compareCommitId, comparedCommitId)
    : giv.getGitDiff(compareCommitId)

  givScreen.main.diff.setContent(giv.coloringGitDiff(diff).map(x => x[0]).join('\n'))

  const modefiedFiles: Array<string[]> = comparedCommitId ?
    giv.getGitModifiedFiles(compareCommitId, comparedCommitId)
    : giv.getGitModifiedFiles(compareCommitId)

  givScreen.main.modefied.setContent(colors.gray(` ${ modefiedFiles.length } Files`) + `\n${ modefiedFiles.join('\n') }`)

  Config.screen.render()
}

gitLog.length > 1 ?
  setDiffScreen(gitLog[0].id, gitLog[1].id)
  : setDiffScreen(gitLog[0].id)

givScreen.main.commit.on('select item', (_, index) => {
  index--
  if (index === 0 && gitLog.length > 1 && index !== gitLog.length - 1) {
    setDiffScreen(gitLog[index].id, gitLog[index + 1].id)
  } else {
    setDiffScreen(gitLog[index].id)
  }
  givScreen.main.diff.resetScroll()
})

Config.screen.key('n', () => {
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
  const branches: string[] = giv.getGitBranches().map(x => x.replace('*', '').trim())

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
  if (state.location !== givScreenName.main.commit) {
    screenInit()
    return
  }
  process.exit(0)
})

givScreen.main.commit.key('j', () => {
  for (let i = 1; i <= 10; i++) {
    setTimeout(() => {
      givScreen.main.diff.scroll(1)
      Config.screen.render()
    }, i * 20)
  }
})

givScreen.main.commit.key('k', () => {
  for (let i = 1; i <= 10; i++) {
    setTimeout(() => {
      givScreen.main.diff.scroll(-1)
      Config.screen.render()
    }, i * 20)
  }
})

Config.screen.key('h', () => {
  state.location = givScreenName.help
  switchScreen('help')
  Config.screen.render()
})

Config.screen.key('b', () => {
  state.location = givScreenName.checkoutBranch
  switchScreen('checkoutBranch')
  givScreen.checkoutBranch.list.focus()
  Config.screen.render()
})

givScreen.checkoutBranch.list.key('enter', function() {
  const index = givScreen.checkoutBranch.list.getItemIndex(this.selected)
  giv.checkoutGitBranch(checkoutBranches[index])
  screenInit()
})

Config.screen.key(['C-c'], () => process.exit(0))
Config.screen.render()

//listTable.focus()
