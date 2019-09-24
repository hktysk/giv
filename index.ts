import blessed from 'blessed'
import contrib from 'blessed-contrib'
import { execSync } from 'child_process'
import colors from 'colors'
import moment from 'moment'
import convertTree from './tree'

const screen: blessed.Widgets.Screen = blessed.screen()
const grid: contrib.grid = new contrib.grid({
  rows: 20,
  cols: 20,
  screen: screen
})
const commitsTable: contrib.Widgets.TableElement = grid.set(0, 0, 15, 13, contrib.table, {
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
})

const branchesTable: contrib.Widgets.TableElement = grid.set(15, 0, 5, 6, contrib.table, {
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
})

const modefiedFilesTable: contrib.Widgets.TableElement = grid.set(15, 6, 5, 7, contrib.table, {
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
})

const markdown: contrib.Widgets.MarkdownElement = grid.set(0, 13, 20, 7, contrib.markdown)

let index: number = 0
let exec: string = '[' + execSync('git log --pretty=format:\'{"subject": "%s","commiter": "%cN","date": "%cD"},\'').toString().trim().slice(0, -1) + ']'
let t = JSON.parse(exec)
let items: string[][] = []
const tree = convertTree(execSync('git log --graph --all --format="%x09"').toString().trim())

for (let i = 0; i < t.length; i++) {
  const v = t[i]
  let subject = v.subject.length > 36 ? v.subject.slice(0, 36) + '...' : v.subject
  subject = subject.indexOf('M') > -1 ? colors.yellow('✔ ') + colors.cyan(subject) : colors.green('» ') + subject
  let timeLine = moment(v.date).fromNow(true).split(' ')
  items.push([
    timeLine[0].padStart(2, ' ').replace('a', '1') + ' ' + colors.cyan(timeLine[1].replace(/(hours|hour)/, 'h').replace(/(minutes|minute)/, 'm').replace(/(seconds|second)/, 's')),
    tree[i].split('').map(x => colors.cyan(x)).join('').replace('M', colors.yellow('M')).replace('*', colors.green('c')),
    subject,
    colors.cyan('❤ ') + colors.green(v.commiter),
    colors.gray(moment(v.date).format('DD MMM HH:mm:ss').toLowerCase()),
  ])
}

const data: contrib.Widgets.TableData = {
  headers: [' TL', ' GRAPH', ' MESSAGE', ' AUTHOR', ' DATE'],
  data: items
}

branchesTable.focus()
modefiedFilesTable.focus()
commitsTable.focus()
commitsTable.setData(data)
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
screen.key('up', () => {
  if (index === 0) return
  index--
})

screen.key(['escape', 'q', 'C-c'], () => process.exit(0))
screen.render()
