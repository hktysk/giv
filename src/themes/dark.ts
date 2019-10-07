import Theme from './type'

export const dark: Theme = {
  bg: 234,
  fg: 'white',
  selectedBg: 'white',
  selectedFg: 'black',
  git: {
    tree: {
      symbol: {
        merge: 'yellow',
        other: 'green',
        line: 'cyan'
      }
    },
    message: {
      symbol: {
        merge: 'yellow',
        other: 'cyan'
      },
      text: {
        merge: 'cyan',
        other: 'white'
      }
    }
  }
}

export default dark
