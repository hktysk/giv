import Screen from '../screen/screen.module'

export const help = {
  show(s: Screen): void {
    s.show(s.Help)
    s.screen.render()
  }
}

export default help
