import blessed from 'blessed'
import { Widgets } from 'blessed-contrib'
import colors from 'colors'

export interface ScreenName {
  main: {
    commit: string
    branch: string
    modefied: string
    diff: string
  }
  help: string
  newBranch: string
  checkoutBranch: string
}

export interface Screen {
  main: {
    commit: blessed.Widgets.TableElement
    branch: blessed.Widgets.BoxElement
    modefied: blessed.Widgets.BoxElement
    diff: blessed.Widgets.BoxElement
  }
  help: {
    text: any
  }
  newBranch: {
    name: blessed.Widgets.TextboxElement
    label: any
    label2: any
    createdLabel: any
    strErrorLabel: any
    branchErrorLabel: any
  },
  checkoutBranch: {
    list: blessed.Widgets.ListElement
  }
}

export interface givConfig {
  screen: blessed.Widgets.Screen
  Main: {
    Grid: Widgets.GridOptions
    CommitTable: any
    BranchTable: any
    ModefiedTable: Widgets.TableOptions
    DiffTable: any
  }
  Help: {
    Text:any
  }
  NewBranch: {
    Name: blessed.Widgets.TextboxOptions
    Label: any
    Label2: any
    CreatedLabel: any
    StrErrorLabel: any
    BranchErrorLabel: any
  },
  CheckoutBranch: {
    List: any
  }
}

export class Config implements givConfig {

  constructor(public screen: blessed.Widgets.Screen) {}

  Main = {
    Grid: {
      rows: 20,
      cols: 20,
      screen: this.screen
    },
    CommitTable: {
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
    },
    BranchTable: {
      keys: true,
      mouse: true,
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
    },
    ModefiedTable: {
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
    },
    DiffTable: {
      keys: true,
      mouse: true,
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
    }
  }

  Help = {
    Text: {
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
      }
  }

  NewBranch = {
    Name: {
      parent: this.screen,
      input: true,
      inputOnFocus: true,
      top: '43%',
      left: 'center',
      width: '50%',
      height: '11%',
      padding: {
        left: 2,
        top: 1,
        right: 2
      },
      vi: false,
      style: {
        fg: 'white',
        bg: 'black'
      }
    },
    Label: {
      parent: this.screen,
      top: '60%',
      left: 'center',
      content: "Please enter a new branch name."
    },
    Label2: {
      parent: this.screen,
      top: '66%',
      left: 'center',
      content: "Create a new branch with 'Enter' and press 'ESC' or 'C- [' twice to go back"
    },
    CreatedLabel: {
      parent: this.screen,
      top: '45%',
      left: 'center',
      content: colors.green('Successfully created a new branch !')
    },
    StrErrorLabel: {
      parent: this.screen,
      top: '60%',
      left: 'center',
      content: colors.magenta('Please enter at least one character')
    },
    BranchErrorLabel: {
      parent: this.screen,
      top: '60%',
      left: 'center',
      content: colors.red('This name has already been registered')
    }
  }

  CheckoutBranch = {
    List: {
      keys: true,
      mouse: true,
      parent: this.screen,
      label: 'COMMIT',
      top: 'center',
      left: 'center',
      fg: 'white',
      selectedFg: 'white',
      selectedBg: 'black',
      scrollable: true,
      alwaysScroll: true,
    }
  }
}
