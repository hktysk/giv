import blessed from 'blessed'
import { Widgets } from 'blessed-contrib'

export interface ScreenName {
  commit: string,
  branch: string,
  modefied: string,
  diff: string
}

export interface Screen {
  commit: Widgets.TableElement,
  branch: Widgets.TableElement,
  modefied: Widgets.TableElement,
  diff: Widgets.TableElement
}

export interface givConfig {
  screen: blessed.Widgets.Screen,
  Grid: Widgets.GridOptions,
  CommitTable: Widgets.TableOptions,
  BranchTable: Widgets.TableOptions,
  ModefiedTable: Widgets.TableOptions,
  DiffTable: Widgets.TableOptions
}

export class Config implements givConfig {

  constructor(public screen: blessed.Widgets.Screen) {}

  Grid = {
    rows: 20,
    cols: 20,
    screen: this.screen
  }

  CommitTable = {
    keys: true,
    parent: this.screen,
    fg: 'white',
    selectedFg: 'white',
    selectedBg: 'black',
    interactive: 'true',
    label: 'COMMIT',
    width: '48%',
    height: '100%',
    border: { type: 'line', fg: 'cyan' },
    columnSpacing: 0,
    columnWidth: [10, 10, 40, 13, 23],
    alwaysScroll: true
  }

  BranchTable = {
    keys: true,
    parent: this.screen,
    fg: 'white',
    selectedFg: 'white',
    selectedBg: 'black',
    interactive: 'true',
    label: 'BRANCH',
    width: '48%',
    height: '100%',
    border: { type: 'line', fg: 'cyan' },
    columnSpacing: 10,
    columnWidth: [16, 12, 12],
  }

  ModefiedTable = {
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
  }

  DiffTable = {
    keys: true,
    parent: this.screen,
    fg: 'white',
    selectedFg: 'white',
    selectedBg: 'black',
    interactive: 'true',
    label: '',
    width: '48%',
    height: '100%',
    border: { type: 'line', fg: 'cyan' },
    columnSpacing: 10,
    columnWidth: [1000],
  }
}
