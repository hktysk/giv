import blessed from 'blessed'
import colors from 'colors'

interface Frames {
  name: blessed.Widgets.TextboxElement
  nameExplanation: blessed.Widgets.TextElement
  backExplanation: blessed.Widgets.TextElement
  creationSuccessText: blessed.Widgets.TextElement
  emptyErrorText: blessed.Widgets.TextElement
  registerdErrorText: blessed.Widgets.TextElement
}

export default class NewBranch implements Frames {

  constructor(
    public screen: blessed.Widgets.Screen
  ) {}

  name = blessed.textbox({
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
  })

  nameExplanation = blessed.text({
    parent: this.screen,
    top: '60%',
    left: 'center',
    content: "Please enter a new branch name."
  })

  backExplanation = blessed.text({
    parent: this.screen,
    top: '66%',
    left: 'center',
    content: "Create a new branch with 'Enter' and press 'ESC' or 'C- [' twice to go back"
  })

  creationSuccessText = blessed.text({
    parent: this.screen,
    top: '45%',
    left: 'center',
    content: colors.green('Successfully created a new branch !')
  })

  emptyErrorText = blessed.text({
    parent: this.screen,
    top: '60%',
    left: 'center',
    content: colors.magenta('Please enter at least one character')
  })

  registerdErrorText = blessed.text({
    parent: this.screen,
    top: '60%',
    left: 'center',
    content: colors.red('This name has already been registered')
  })
}
