import Screen from '../screen'
import * as Git from '../git'

interface NewBranch {
  show(): void
  register(): void
}

export default class newBranch implements NewBranch {

  constructor(
    public s: Screen
  ) {}

  show(): void {
    this.s.show(this.s.NewBranch)
    this.s.NewBranch.creationSuccessText.hide()
    this.s.NewBranch.emptyErrorText.hide()
    this.s.NewBranch.registerdErrorText.hide()
    this.s.NewBranch.name.focus()
    this.s.render()
  }

  register(): void {
    const name: string = this.s.NewBranch.name.value.trim()

    this.s.NewBranch.nameExplanation.hide()
    this.s.NewBranch.backExplanation.hide()
    this.s.render()

    const branches: string[] = Git.getAllBranches().map(x => x.replace('*', '').trim())

    if(branches.indexOf(name) > -1) {
      this.s.NewBranch.registerdErrorText.show()
    } else if(name.length === 0) {
      this.s.NewBranch.emptyErrorText.show()
    } else {
      Git.createNewBranch(name)
      this.s.NewBranch.name.hide()
      this.s.NewBranch.creationSuccessText.show()
      this.s.render()

      setTimeout(() => {
        this.s.init()
        this.s.NewBranch.name.value = ''
      }, 2000)

      return
    }

    this.s.render()
    setTimeout(this.show, 2000)
  }
}
