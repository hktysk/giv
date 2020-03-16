import Screen from '../screen'
import * as Git from '../git'

interface Diff {
  files: Array<string[]>
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
    this.s.Diff.diff.setContent(Git.coloringDiff(this.files[0]).join('\n'))
    this.setJumps(0)

    const modefiedFiles: string[] = Git.getModified(id)
    this.s.Diff.modefied.clearItems()
    modefiedFiles.forEach(v => this.s.Diff.modefied.addItem(v))

    this.s.render()
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
    // TODO: findだと一番最初と一番最後しか該当しないので書き直す
    let index: number = 0
    let diff: number = now
    this.jumps.forEach((v, k) => {
      const abs = Math.abs(v - now)
       if (abs < diff) {
         diff = abs
         index = k
       }
    })
    direction === 'next' ? index++ : index--;
    let jumpLine: number
    if (index === this.jumps.length && direction === 'next') {
      jumpLine = this.jumps[0]
    } else if (index === -1 && direction === 'before') {
      jumpLine = this.jumps[this.jumps.length - 1]
    } else {
      jumpLine = this.jumps[index]
    }
    this.s.Diff.diff.scrollTo(jumpLine)
    this.s.render()
  }

  scroll(direction: string, iteration: number): void {
    for (let i = 1; i <= iteration; i++) {
      setTimeout(() => {
        this.s.Diff.diff.scroll(direction === 'down' ? 1 : -1)
        this.s.render()
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
