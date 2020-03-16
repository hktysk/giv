import Screen from '../screen'

export default class help {

  constructor(
    public s: Screen
  ) {}

  show(): void {
    this.s.show(this.s.Help)
    this.s.render()
  }
}
