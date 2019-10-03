import * as giv from '../giv.modules'
import Screen from '../screen/screen.module'

export const newBranch = {
  show(s: Screen): void {
    s.show(s.NewBranch)
    s.NewBranch.creationSuccessText.hide()
    s.NewBranch.emptyErrorText.hide()
    s.NewBranch.registerdErrorText.hide()
    s.NewBranch.name.focus()
    s.screen.render()
  },
  register(s: Screen): void {
    const name: string = s.NewBranch.name.value.trim()

    s.NewBranch.nameExplanation.hide()
    s.NewBranch.backExplanation.hide()
    s.screen.render()

    const branches: string[] = giv.getGitBranches().map(x => x.replace('*', '').trim())

    if(branches.indexOf(name) > -1) {
      s.NewBranch.registerdErrorText.show()
    } else if(name.length === 0) {
      s.NewBranch.emptyErrorText.show()
    } else {
      giv.createGitNewBranch(name)
      s.NewBranch.name.hide()
      s.NewBranch.creationSuccessText.show()
      s.screen.render()

      setTimeout(() => {
        s.init()
        s.NewBranch.name.value = ''
      }, 2000)

      return
    }

    s.screen.render()
    setTimeout(this.show, 2000)
  }
}

export default newBranch
