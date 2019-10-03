import blessed from 'blessed'
import contrib from 'blessed-contrib'

/* grid.set() returns any type */
interface Frames {
  commit: any
  modefied: any
  contains: any
  diff: any
}

export default class Main implements Frames {

  constructor(
    public screen: blessed.Widgets.Screen,
    public grid: contrib.grid
  ) {}

  commit = this.grid.set(0, 0, 10, 20, blessed.listtable, {
    keys: true,
    mouse: true,
    parent: this.screen,
    label: 'COMMIT',
    width: '48%',
    height: '100%',
    fg: 'white',
    selectedFg: 'white',
    selectedBg: 'black',
    align: 'left',
    interactive: 'true',
    scrollable: true,
    alwaysScroll: true,
    border: { type: 'line', fg: 'white' },
    style: {
      focus: {
        border: { type: 'line', fg: 'white' },
      }
    },
    noCellBorders: true,
    tags: true, // 色付けする場合は必須,
    vi: false
  })

  modefied = this.grid.set(10, 0, 10, 4, blessed.box, {
    keys: true,
    parent: this.screen,
    fg: 'white',
    selectedFg: 'white',
    selectedBg: 'black',
    interactive: 'true',
    label: 'MODEFIED',
    width: '48%',
    height: '100%',
    border: { type: 'line', fg: 'cyan' },
    columnSpacing: 10,
    columnWidth: [16, 12, 12],
  })

  contains = this.grid.set(10, 4, 10, 4, blessed.box, {
    keys: true,
    parent: this.screen,
    label: 'CONTAINS',
    width: '48%',
    height: '100%',
    fg: 'white',
    selectedFg: 'white',
    selectedBg: 'black',
    align: 'left',
    interactive: 'true',
    scrollable: true,
    alwaysScroll: true,
    border: { type: 'line', fg: 'white' },
    style: {
      focus: {
        border: { type: 'line', fg: 'white' },
      }
    },
    noCellBorders: true,
    tags: true, // 色付けする場合は必須,
    vi: true
  })

  diff = this.grid.set(10, 8, 10, 12, blessed.box, {
    keys: true,
    parent: this.screen,
    fg: 'white',
    selectedFg: 'white',
    selectedBg: 'black',
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
      style: {
        bg: 'cyan'
      }
    },
    interactive: 'true',
    label: '',
    width: '48%',
    height: '100%',
    border: { type: 'line', fg: 'cyan' },
  })
}
