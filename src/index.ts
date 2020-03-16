import blessed from 'blessed'
import CreateScreen from './screen'
import Directive from './directive'
import * as Git from './git'

/*******************************
* Initial setting
/******************************/
const s = new CreateScreen(
  blessed.screen({
    smartCSR: true,
    fullUnicode: true,
    title: 'giv'
  })
)

s.init() // Show Main screen and hide other screens

const directive = new Directive(s)

/********************************
* Prepare state
/*******************************/
let state: {
  isMainScreen: boolean
} = {
  isMainScreen: true
}

const dispatch: {
  cheangedMainScreen(): boolean
  init(): boolean,
} = {
  cheangedMainScreen: () => (state.isMainScreen = false),
  init: () => (state.isMainScreen = true),
}

/*********************************
* Process for setting items.
*********************************/
let logs: Git.Log[]
let tree: string[] // Store git tree line by line

function setScreenItems(name?: string): void {
  // 'name' means branch name
  logs = Git.getLog(name && name)
  tree = Git.coloringTree(
    Git.getTree(name && name),
    logs.map(x => x.id),
    Git.getMerge(name && name)
  )

  directive.main.commit.set(logs, tree, name && name)
  directive.main.modefied.set(logs[0].id)

  s.SelectBranch.list.clearItems()
  Git.getAllBranches().forEach(name => s.SelectBranch.list.addItem(name))

  s.render()
}

// This function is used in the enter event of commit
function setDiffItems(i: number): void {
  directive.diff.set(logs[i].id)
  s.Diff.modefied.focus()
  dispatch.cheangedMainScreen() // Make sure to move the screen
  s.show(s.Diff)
}


/* Set initial items */
setScreenItems()


/*****************************
* Events
/****************************/

/* Main screen events */
s.Main.commit.key('d', () => s.Main.commit.scroll(10))
s.Main.commit.key('u', () => s.Main.commit.scroll(-10))
s.Main.commit.key('g', () => s.Main.commit.resetScroll())
s.Main.commit.key('S-g', () => s.Main.commit.scroll(directive.main.commits.length))

s.Main.commit.on('select item', function() {
  directive.main.modefied.set(logs[this.selected].id)
})
s.Main.commit.key('enter', function() {
  setDiffItems(this.selected)
})

/* Diff screen events */
s.Diff.modefied.on('select item', function() {
  s.Diff.diff.resetScroll()
  // The diff of each file is stored in directive.diff.files
  s.Diff.diff.setContent(
    Git.coloringDiff(directive.diff.files[this.selected]).join('\n')
  )
  // 'setJumps()' finds the changed part of the file (-/ +) and records its line number
  directive.diff.setJumps(this.selected)
})
s.Diff.modefied.key('o', () => directive.diff.jump('next'))
s.Diff.modefied.key('i', () => directive.diff.jump('before'))
s.Diff.modefied.key('j', () => directive.diff.scrollDown(1))
s.Diff.modefied.key('k', () => directive.diff.scrollUp(1))
s.Diff.modefied.key('u', () => directive.diff.scrollUp(10))
s.Diff.modefied.key('d', () => directive.diff.scrollDown(10))
s.Diff.modefied.key('g', () => {
  // Scroll to first line
  s.Diff.diff.resetScroll()
  s.render()
})
s.Diff.modefied.key('S-g', () => {
  // Scroll to last line
  s.Diff.diff.scroll(s.Diff.diff.getScrollHeight())
  s.render()
})

/* NewBranch screen events */
s.key('n', () => {
  directive.newBranch.show()
  dispatch.cheangedMainScreen()
})
s.NewBranch.name.key('enter', () => directive.newBranch.register())

/* SelectBranch screen events */
s.key('b', () => {
  directive.selectBranch.show()
  dispatch.cheangedMainScreen()
})
s.SelectBranch.list.key('enter', function() {
  const name = this.value.replace('* ', '')
  directive.selectBranch.checkout(name)
})
s.SelectBranch.list.key('v', function() {
  // switch view mode
  const name = this.value.replace('* ', '')
  setScreenItems(name)
  s.init()
  dispatch.init()
})

/* Help screen events */
s.key('h', () => {
  directive.help.show()
  dispatch.cheangedMainScreen()
})


/* Events common to all screens */
s.key('r', () => {
  s.init()
  dispatch.init()
  setScreenItems()
})
s.key(['escape', 'q', 'C-['], () => {
  if (state.isMainScreen === false) {
    s.init()
    dispatch.init()
    return
  }

  process.exit(0)
})
s.key(['C-c'], () => process.exit(0))
