import blessed from 'blessed'
import contrib from 'blessed-contrib'
import Main from './Main'
import Diff from './Diff'
import NewBranch from './NewBranch'
import SelectBranch from './SelectBranch'
import Help from './Help'

export default class {

  constructor(
    public screen: blessed.Widgets.Screen
  ) {}

  key = this.screen.key

  grid: contrib.grid = new contrib.grid({
    rows: 20,
    cols: 20,
    screen: this.screen
  })

  Main = new Main(this.screen, this.grid)
  Diff = new Diff(this.screen, this.grid)
  NewBranch  = new NewBranch(this.screen)
  SelectBranch = new SelectBranch(this.screen, this.grid)
  Help = new Help(this.screen)

  all = [
    this.Main,
    this.Diff,
    this.NewBranch,
    this.SelectBranch,
    this.Help
  ]

  hide() {
    for (const s of this.all) {
      for (const k in s) {
        if ('hide' in s[k]) s[k].hide()
      }
    }
  }

  show(s: any) {
    this.hide()
    for (const k in s) {
      if ('show' in s[k]) s[k].show()
    }
    this.screen.render()
  }

  init() {
    this.hide()
    this.show(this.Main)
    this.Main.commit.focus()
  }

  render() {
    this.screen.render()
  }
}
