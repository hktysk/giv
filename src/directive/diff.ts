import Screen from '../screen'
import * as Git from '../git'

interface Diff {
  files: string[]
  jumps: number[]
  interval: number

  set(id:string): void
  setJumps(index: number): void
  jump(direction: 'before' | 'next'): void

  scroll(direction: 'up' | 'down', iteration: number): void
  scrollUp(iteration: number): void
  scrollDown(iteration: number): void
}

export default class diff implements Diff {
  files = []
  jumps = []
  interval = 8

  constructor(
    public s: Screen
  ) {}

  set(id: string): void {
    this.files = Git.getDiff(id)

    this.s.Diff.diff.resetScroll()
    this.s.Diff.diff.setContent(this.files[0])
    this.setJumps(0)

    const modefiedFiles: string[] = Git.getModified(id)
    this.s.Diff.modefied.clearItems()
    modefiedFiles.forEach(v => this.s.Diff.modefied.addItem([v]))

    this.s.screen.render()
  }

  setJumps(index: number): void {
    this.jumps = []
    let isRowNumber: boolean = false
    let isSymbol: boolean = false
    this.files[index].forEach((v: string, k: number) => {
      if (isRowNumber === true) {
        if (v.charAt(0) === '-' || v.charAt(0) === '+') {
          if (isSymbol === false) {
            this.jumps.push(k)
            isSymbol = true
          }
        } else {
          isSymbol = false
        }
      }
      if (v.slice(0, 2) === '@@') isRowNumber = true
    })
  }

  jump(direction: string): void {
    const now: number = this.s.Diff.diff.getScroll()
    const jumpLine: number = this.jumps.find((x: number) => {
      direction === 'before' ? x < now : x > now
    })
    this.s.Diff.diff.scrollTo(
      jumpLine ?
        jumpLine
        : direction === 'before' ? this.jumps[this.jumps.length - 1] : this.jumps[0]
    )
    this.s.screen.render()
  }

  scroll(direction: string, iteration: number): void {
    for (let i = 1; i <= iteration; i++) {
      setTimeout(() => {
        this.s.Diff.diff.scroll(direction === 'down' ? 1 : -1)
        this.s.screen.render()
      }, i * this.interval)
    }
  }

  scrollUp(iteration: number): void {
    this.scroll('up', iteration)
  }

  scrollDown(iteration: number): void {
    this.scroll('down', iteration)
  }
}
