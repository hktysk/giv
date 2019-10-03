import Screen from '../screen/screen.module'
import * as giv from '../giv.modules'

export const selectBranch = {
  show(s: Screen): void {
    s.show(s.SelectBranch)
    s.SelectBranch.checkoutError.hide()
    s.SelectBranch.list.focus()
    s.screen.render()
  },
  checkout(s: Screen): void {
    if (giv.isOkGitCheckout() === false) {
      s.SelectBranch.checkoutError.show()
      s.screen.render()

      setTimeout(() => {
        s.SelectBranch.checkoutError.hide()
        s.screen.render()
      }, 3000)

      return
    }

    const index = s.SelectBranch.list.getItemIndex(this.selected)
    giv.checkoutGitBranch(giv.getGitBranches()[index])
    s.init()
  }
}

export default selectBranch
