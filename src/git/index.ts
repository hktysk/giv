import { execSync, exec } from 'child_process'
import colors from 'colors'
import { convertTree } from './tree'
export * from './tree'

export interface Log {
  id: string
  commiter: string
  subject: string
  date?: Date
}

export function getLog(name?: string): Log[] {
  let sh: string = 'git log --pretty=format:\'{"id": "%h","commiter": "%cN","subject": "%s","date": "%cD"},\''
  if (name) sh += ` ${ name }`
  const log: string = execSync(sh).toString()
  let r: Log[] = JSON.parse('[' + log.trim().slice(0, -1) + ']')
  if (execSync('git diff').toString().length > 0) {
    r.unshift({
      id: 'unknown',
      commiter: 'unknown',
      subject: 'unknown'
    })
  }

  return r
}

export function getTree(name?: string): string[] {
  let sh = 'git log --graph --format="%x09"'
  if (name) sh += ` ${ name }`
  const gitTree: string = execSync(sh).toString().trim()
  return convertTree(gitTree)
}

export interface Merge {
  id: string
}
export function getMerge(name?: string): Merge[] {
  let sh: string = 'git log --merges --pretty=format:\'{"id": "%h"},\''
  if (name) sh += ` ${ name }`
  const merges: string = execSync(sh).toString()
  return JSON.parse('[' + merges.trim().slice(0, -1) + ']')
}

export function getAllBranches(): string[] {
  const sh: string = `git branch --sort=-authordate`
  const branches: string = execSync(sh).toString()
  return branches.trim().split('\n')
}

export function getDiff(id: string): string[] {
  const sh: string = id === 'unknown' ? 'git diff -U9999' : `git show -U9999 ${ id }`

  let diff: string[] = execSync(sh).toString().trim().split('\n')
  diff.reverse()
  let d: Array<string[]> = []
  let t: string[] = []
  for (const v of diff) {
    t.push(v)
    if (v.slice(0, 4) === 'diff') {
      t.reverse()
      d.push(t)
      t = []
    }
    if (v.slice(0, 2) === '@@') {
      t.splice(t.length - 1, 0, '')
    }
  }

  t.reverse()
  d = d.map(x => [...t, ...x])

  d.reverse()
  return d.map(x => coloringDiff(x).join('\n'))
}

export function coloringDiff(diff: string[]): string[] {
  let d = []
  let isInfoRow: number = 0
  for (const v of diff) {
    switch(v.charAt(0)) {
      case '-':
        d.push(colors.magenta(v))
        break
      case '+':
        d.push(colors.green(v))
        break
      case '@':
        if (v.charAt(1) === '@') {
          const s = v.split('@@')
          d.push(colors.yellow(`@@${ s[1] }@@`) + colors.white(s[2]))
          isInfoRow = d.length + 1
          break
        }
      default:
        d.push(isInfoRow === 0 ?  colors.cyan(v) : colors.white(v))
    }
    const k = d.length - 1
    const row = d.length - isInfoRow
    d[k] = isInfoRow === 0 || row <= 0 ?
      ' ' + d[k]
      : colors.white(`${ row > 0 ? row : '' }`.padStart(`${ diff.length }`.length, ' ')) + colors.white('│ ') + d[k]
  }
  return d
}

export function getModified(id: string): string[] {
  const sh: string = id === 'unknown' ?
    `git diff --name-only`
    : `git show ${ id } --name-only --oneline`
  const files: string = execSync(sh).toString()
  const [, ...modefied] = files.trim().split('\n').map(x => colors.white('- ') + colors.cyan(x))
  return modefied
}

export function createNewBranch(name: string): void {
  const sh: string = `git checkout -b ${ name }`
  exec(sh)
}

export function checkoutBranch(name: string): void {
  const sh: string = `git checkout ${ name }`
  execSync(sh)
}

export function getNowBranch(): string {
  const sh: string = 'git rev-parse --abbrev-ref HEAD 2> /dev/null'
  return execSync(sh).toString().trim()
}

export function isOkCheckout(): boolean {
  const sh: string = 'git diff --name-only'
  return (execSync(sh).toString().trim().length === 0)
}

export function getContains(id: string): string[] {
  const sh: string = `git branch --contains ${ id }`
  return execSync(sh).toString().split('\n')
}
