type TermColor = number | string /* can use 256-color */
type TextColors =
  'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'gray'
  | 'grey'

export default interface Theme {
  bg: TermColor
  fg: TermColor
  selectedBg: TermColor
  selectedFg: TermColor
  git: {
    tree: {
      symbol: {
        merge: TextColors
        other: TextColors
        line: TextColors
      }
    }
    message: {
      symbol: {
        merge: TextColors
        other: TextColors
      }
      text: {
        merge: TextColors
        other: TextColors
      }
    }
  }
}
