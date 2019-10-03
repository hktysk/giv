import blessed from 'blessed'
import contrib from 'blessed-contrib'
import colors from 'colors'

/* grid.set() returns any type */
interface Frames {
  list: any
  checkoutError: blessed.Widgets.TextElement
}

export default class SelectBranch implements Frames {

  constructor(
    public screen: blessed.Widgets.Screen,
    public grid: contrib.grid
  ) {}

  list = this.grid.set(5, 5, 10, 10, blessed.list, {
    keys: true,
    mouse: true,
    parent: this.screen,
    label: colors.cyan(' [enter]checkout [v]only commit view '),
    top: 'center',
    left: 'center',
    fg: 'white',
    selectedFg: 'white',
    selectedBg: 'black',
    border: { type: 'line', fg: 'cyan' },
    scrollable: true,
    alwaysScroll: true,
  })

  checkoutError = blessed.text({
    parent: this.screen,
    top: '15%',
    left: 'center',
    content: colors.magenta('Please execute commit or stash first.')
  })
}
