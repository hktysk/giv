import Screen from '../screen/screen.module'

export const diff = {
  iterationCount: 10,
  interval: 10,

  scroll(s: Screen, direction: 'up' | 'down'): void {
    for (let i = 1; i <= this.iterationCount; i++) {
      setTimeout(() => {
        s.Main.diff.scroll(direction === 'down' ? 1 : -1)
        s.screen.render()
      }, i * this.interval)
    }
  },

  scrollUp(s: Screen): void {
    this.scroll(s, 'up')
  },

  scrollDown(s: Screen): void {
    this.scroll(s, 'down')
  }
}

export default diff
