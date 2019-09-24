const blessed = require('blessed')
const contrib = require('blessed-contrib')

const screen = blessed.screen()
const table = contrib.table({
  fg: 'white',
  selectedFg: 'white',
  selectedBg: 'blue',
  interactive: 'true',
  label: 'Active Processes',
  width: '30%',
  height: '30%',
  border: { type: 'line', fg: 'cyan' },
  columnSpacing: 10,
  columnWidth: [16, 12, 12]
})
const data = {
  headers: ['col1', 'col2', 'col3'],
  data: [
    ['aiuo', 'kakiku', 'naninu'],
    ['aiuo', 'kakiku', 'naninu']
  ]
}
table.focus()
table.setData(data)

screen.key(['escape', 'q', 'C-c'], () => process.exit(0))
screen.render()
