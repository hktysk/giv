import Screen from '../screen'
import * as Git from '../git'

interface SelectBranch {
  show(): void
  checkout(name: string): void
}

export default class selectBranch implements SelectBranch {

  constructor(
    public s: Screen
  ) {}

  show(): void {
    this.s.show(this.s.SelectBranch)
    this.s.SelectBranch.checkoutError.hide()
    this.s.SelectBranch.list.focus()
    this.s.render()
  }
  checkout(name: string): void {
    if (Git.isOkCheckout() === false) {
      this.s.SelectBranch.checkoutError.show()
      this.s.render()

      setTimeout(() => {
        this.s.SelectBranch.checkoutError.hide()
        this.s.render()
      }, 3000)

      return
    }

    Git.checkoutBranch(name)
    this.s.init()
  }
}
