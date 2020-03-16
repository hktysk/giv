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

  commit = this.grid.set(0, 0, 13, 20, blessed.list, {
    keys: true,
    //mouse: true,
    parent: this.screen,
    scrollable: true,
    alwaysScroll: true,
    label: 'COMMIT',
    width: '48%',
    height: '100%',
    selectedFg: 'black',
    selectedBg: 'white',
    align: 'left',
    //interactive: false,
    border: { type: 'line' },
    style: {
      fg: 'white',
      bg: 234,
      border: {
        fg: 'cyan',
        bg: 234
      },
      label: {
        bg: 234
      }
    },
    noCellBorders: true,
    tags: true, // 色付けする場合は必須,
    wrap: false,
    vi: true,
    search: true
  })

  modefied = this.grid.set(13, 0, 7, 20, blessed.box, {
    keys: true,
    parent: this.screen,
    selectedFg: 'white',
    selectedBg: 'black',
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

  contains = this.grid.set(0, 0, 0, 0, blessed.box, {
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

  diff = this.grid.set(0, 0, 0, 0, blessed.box, {
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
