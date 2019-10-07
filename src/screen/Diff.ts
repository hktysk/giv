import blessed from 'blessed'
import contrib from 'blessed-contrib'

/* grid.set() returns any type */
interface Frames {
  modefied: any
  diff: any
}

export default class Diff implements Frames {

  constructor(
    public screen: blessed.Widgets.Screen,
    public grid: contrib.grid
  ) {}

  modefied = this.grid.set(15, 0, 5, 20, blessed.list, {
    keys: true,
    parent: this.screen,
    selectedFg: 'black',
    selectedBg: 'cyan',
    interactive: 'true',
    width: '48%',
    height: '100%',
    border: { type: 'line' },
    style: {
      bg: 234,
      border: {
        fg: 'cyan',
        bg: 234
      },
      label: {
        bg: 234
      }
    },
  })

  diff = this.grid.set(0, 0, 15, 20, blessed.box, {
    keys: true,
    parent: this.screen,
    selectedFg: 'white',
    selectedBg: 'black',
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
      style: {
        bg: 'cyan'
      }
    },
    border: { type: 'line' },
    style: {
      bg: 234,
      border: {
        fg: 234,
        bg: 234
      },
      label: {
        bg: 234
      }
    },
    interactive: 'true',
    label: '',
    width: '48%',
    height: '100%',
    vi: false
  })
}
