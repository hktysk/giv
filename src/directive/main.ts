import Screen from '../screen'
import * as Git from '../git'
import colors from 'colors'
import moment from 'moment'

interface Main {
  commits: string[]
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

  commits: string[] = []

  commit = {
    set: (logs: Git.Log[], tree: string[], name?: string): void => {
      this.commits = []
      const maxAuthorLength: number = Math.max(...logs.map(x => x.author.length))

      logs.forEach((log: Git.Log, k: number) => {
        let { id, author, subject, date } = log

        if (id === 'unknown') {
          this.commits.push('unknown(unstaged changes)')
          tree.unshift('')
          return
        }

        author = author.padEnd(maxAuthorLength, ' ')

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
        .replace(/(years|year)/, 'Y')
        .replace(/(months|month)/, 'M')
        .replace(/(days|day)/, 'd')
        .replace(/(hours|hour)/, 'h')
        .replace(/(minutes|minute)/, 'm')
        .replace(/(seconds|second)/, 's')

        this.commits.push([
          [colors.cyan('❤'), colors.white(author)].join(' ') + ' '.repeat(2),
          [colors.cyan(timeLine[0]), colors.cyan(timeLine[1])].join(' ') + ' '.repeat(5),
          tree[k].replace(/M/, '✔') + ' ',
          subject,
        ].join(''))
      })

      this.s.Main.commit.clearItems()
      this.commits.forEach(v => this.s.Main.commit.addItem(v))
      const label = name ? colors.cyan(name) + colors.white('(view mode)') : colors.cyan(Git.getNowBranch())
      this.s.Main.commit.setLabel(` ${ label } `)
    }
  }

  modefied = {
    set: (id: string): void => {
      const modefiedFiles: string[] = Git.getModified(id)

      this.s.Main.modefied.setContent(
        colors.white(` ${ modefiedFiles.length } Files`)
        + `\n${ modefiedFiles.join('\n') }`
      )

      this.s.render()
    }
  }
}
