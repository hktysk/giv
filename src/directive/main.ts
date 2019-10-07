import Screen from '../screen'
import * as Git from '../git'
import colors from 'colors'
import moment from 'moment'

interface Main {
  commit: {
    set(logs: Git.Log[], tree: string[]) :void
  }
  modefied: {
    set(id: string): void
  }
}

export default class main implements Main {

  constructor(
    public s: Screen
  ) {}

  commit = {
    set(logs: Git.Log[], tree: string[]): void {
      let commits: Array<string[]> = []
      const maxAuthorLength: number = Math.max(...logs.map(x => x.commiter.length))

      logs.forEach((log: Git.Log, k: number) => {
        let { id, commiter, subject, date } = log

        if (id === 'unknown') {
          commits.push(['unknown(unstaged changes)'])
          tree.unshift('')
          return
        }

        commiter = commiter.padEnd(maxAuthorLength, ' ')

        subject = tree[k].indexOf('M') > -1 ?
          [colors.yellow('✔'), colors.cyan(subject)].join(' ')
          : [colors.green('»'), colors.white(subject)].join(' ')

        let timeLine: string[] = moment(date)
        .fromNow(true)
        .replace('a few', '1')
        .split(' ')

        timeLine[0] = timeLine[0]
        .replace(/(an|a)/, '1')
        .padStart(2, ' ')

        timeLine[1] = timeLine[1]
        .replace(/(years|year)/, 'y')
        .replace(/(days|day)/, 'd')
        .replace(/(hours|hour)/, 'h')
        .replace(/(minutes|minute)/, 'm')
        .replace(/(seconds|second)/, 's')

        commits.push([
          [colors.cyan('❤'), colors.white(commiter)].join(' ') + ' '.repeat(2),
          [colors.cyan(timeLine[0]), colors.cyan(timeLine[1])].join(' ') + ' '.repeat(5),
          tree[k].replace(/M/, '✔') + ' ',
          subject,
        ])
      })

      this.s.Main.commit.clearItems()
      commits.forEach(v => this.s.Main.commit.addItem(v.join('')))
      this.s.Main.commit.setLabel(` ${ colors.cyan(Git.getNowBranch()) } `)
    }
  }

  modefied = {
    set(id: string): void {
      const modefiedFiles: string[] = Git.getModified(id)

      this.s.Main.modefied.setContent(
        colors.white(` ${ modefiedFiles.length } Files`)
        + `\n${ modefiedFiles.join('\n') }`
      )

      this.s.screen.render()
    }
  }
}
