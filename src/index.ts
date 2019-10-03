import blessed from 'blessed'
import contrib from 'blessed-contrib'
import colors from 'colors'
import moment from 'moment'
import * as giv from './giv.modules'
import * as directive from './directive/index'
import sc from './screen/screen.module'

let state: {
  isMainScreen: boolean,
} = {
  isMainScreen: true
}

const dispatch: {
  cheangedMainScreen(): boolean
  init(): boolean
} = {
  cheangedMainScreen: (): boolean => (state.isMainScreen = false),
  init: (): boolean => (state.isMainScreen = true)
}

const Screen: blessed.Widgets.Screen = blessed.screen({
  smartCSR: true,
  title: 'giv'
})
const s = new sc(Screen)
giv.getGitBranches().forEach(name => s.SelectBranch.list.addItem(name))

s.init()

const gitLog: giv.GitLog[] = giv.getGitLog()
const gitMerges: string[] = giv.getGitMerges().map(x => x.id)
let tree: string[] = giv.getGitTree()
tree = giv.coloringTree(tree, gitLog.map(x => x.id), gitMerges)
let commits: Array<string[]> = []
const subjectMax: number = 75
const subjectMin: number = 70

for (let i = 0; i < gitLog.length; i++) {
  const log: giv.GitLog = gitLog[i]
  let subject: string = log.subject

  if (subject.length > subjectMax) {
    subject = subject.slice(0, subjectMax) + '...'
  }
  subject = tree.indexOf('M') > -1 ?
    `${ colors.yellow('✔') } ${ colors.cyan(subject)}`
    : `${ colors.green('»') } ${ subject }`

  subject = subject.padEnd(subjectMin, '  ')

  const date: moment.Moment = moment(log.date)
  let TL: string[] = date.fromNow(true).replace('a few', '1').split(' ')

  TL[0] = TL[0]
  .replace(/(an|a)/, '1')
  .padStart(2, ' ')

  TL[1] = TL[1]
  .replace(/(hours|hour)/, 'h')
  .replace(/(minutes|minute)/, 'm')
  .replace(/(seconds|second)/, 's')

  commits.push([
    `${ TL[0] } ${ TL[1] }`,
    tree[i],
    subject,
    colors.cyan('❤ ') + colors.green(log.commiter),
    colors.gray(date.format('DD MMM HH:mm:ss').toLowerCase()),
  ])
}

s.Main.commit.setData([
  ['TL', 'GRAPH', 'MESSAGE', 'AUTHOR', 'DATE'],
  ...commits
])
s.Main.commit.setLabel(` ${ colors.green(giv.getNowGitBranch()) } `)


function setDiffScreen (compareCommitId: string, comparedCommitId?: string): void {
  const diff: string[] = comparedCommitId ?
    giv.getGitDiff(compareCommitId, comparedCommitId)
    : giv.getGitDiff(compareCommitId)

  s.Main.diff.setContent(
    giv.coloringGitDiff(diff)
    .map(x => x[0])
    .join('\n')
  )

  const modefiedFiles: Array<string[]> = comparedCommitId ?
    giv.getGitModifiedFiles(compareCommitId, comparedCommitId)
    : giv.getGitModifiedFiles(compareCommitId)

  s.Main.modefied.setContent(
    colors.gray(` ${ modefiedFiles.length } Files`)
    + `\n${ modefiedFiles.join('\n') }`
  )

  const contains: string[] = giv.getGitContains(compareCommitId)
  s.Main.contains.setContent(
    colors.gray(` ${ contains.length } branches`)
    + `\n${ contains.join('\n')}`
  )

  Screen.render()
}

gitLog.length > 1 ?
  setDiffScreen(gitLog[0].id, gitLog[1].id)
  : setDiffScreen(gitLog[0].id)

s.Main.commit.on('select item', (_: any, index: number) => {
  index--
  if (index === 0 && gitLog.length > 1 && index !== gitLog.length - 1) {
    setDiffScreen(gitLog[index].id, gitLog[index + 1].id)
  } else {
    setDiffScreen(gitLog[index].id)
  }
  s.Main.diff.resetScroll()
})

Screen.key('n', () => {
  directive.newBranch.show(s)
  dispatch.cheangedMainScreen()
})
s.NewBranch.name.key(['enter'], () => directive.newBranch.register(s))
s.Main.commit.key('j', () => directive.diff.scrollDown(s))
s.Main.commit.key('k', () => directive.diff.scrollUp(s))

Screen.key('h', () => {
  directive.help.show(s)
  dispatch.cheangedMainScreen()
})

Screen.key('b', () => {
  directive.selectBranch.show(s)
  dispatch.cheangedMainScreen()
})

s.SelectBranch.list.key('enter', function() {
  directive.selectBranch.checkout(s, this.selected)
})

Screen.key(['escape', 'q', 'C-['], () => {
  if (state.isMainScreen === false) {
    s.init()
    dispatch.init()
    return
  }

  process.exit(0)
})

Screen.key(['C-c'], () => process.exit(0))

Screen.render()
