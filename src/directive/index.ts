import Screen from '../screen'
import main from './main'
import diff from './diff'
import newBranch from './newBranch'
import selectBranch from './selectBranch'
import help from './help'

export default class {

  constructor(
    public s: Screen
  ) {}

  main = new main(this.s)
  diff = new diff(this.s)
  newBranch = new newBranch(this.s)
  selectBranch = new selectBranch(this.s)
  help = new help(this.s)
}
