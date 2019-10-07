import Screen from '../screen/screen.module'

export default class help {

  constructor(
    public s: Screen
  ) {}

  show(): void {
    this.s.show(this.s.Help)
    this.s.screen.render()
  }
}
