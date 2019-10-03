import blessed from 'blessed'
import colors from 'colors'

/* grid.set() returns any type */
interface Frames {
  text: blessed.Widgets.TextElement
}

export default class Help implements Frames {

  constructor(
    public screen: blessed.Widgets.Screen,
  ) {}

  text = blessed.text({
    parent: this.screen,
    top: 'center',
    left: 'center',
    fg: 'white',
    content: [
      '[a]add stage',
      '[b]checkout branch',
      '[c]commit',
      '[f]full screen',
      '[h]help',
      '[n]create new branch',
      '[j]diff view scroll to bottom',
      '[k]diff view scroll to top',
      '[q][C-\'[\'][esc]exit'
    ].join('\n') + colors.cyan('\n\n\n\n\n[esc][q][C-\'[\'] back to main view')
  })
}
