import { execSync, exec } from 'child_process'
import colors from 'colors'
import { convertTree } from './tree'

export interface GitLog {
  id: string
  commiter: string
  subject: string
  date: Date
}

export function getGitLog(): GitLog[] {
  const sh: string = 'git log --pretty=format:\'{"id": "%h","commiter": "%cN","subject": "%s","date": "%cD"},\''
  const log: string = execSync(sh).toString()
  return JSON.parse('[' + log.trim().slice(0, -1) + ']')
}

export function getGitTree(): string[] {
  const sh = 'git log --graph --format="%x09"'
  const gitTree: string = execSync(sh).toString().trim()
  return convertTree(gitTree)
}

export interface GitMerge {
  id: string
}
export function getGitMerges(): GitMerge[] {
  const sh: string = 'git log --merges --pretty=format:\'{"id": "%h"},\''
  const merges: string = execSync(sh).toString()
  return JSON.parse('[' + merges.trim().slice(0, -1) + ']')
}

export function getGitBranches(): string[] {
  const sh: string = `git branch --sort=-authordate`
  const branches: string = execSync(sh).toString()
  return branches.trim().split('\n')
}

export function getGitDiff(compareCommitId: string, comparedCommitId?: string): string[] {
  const sh: string = comparedCommitId ?
    `git diff ${ compareCommitId } ${ comparedCommitId }`
    : `git diff ${ compareCommitId }`
  const diff: string = execSync(sh).toString()
  return diff.trim().split('\n')
}

export function coloringGitDiff(diff: string[]): Array<string[]> {
  let d = []
  for (const v of diff) {
    switch(v.charAt(0)) {
      case '-':
        d.push(colors.red(v))
        break
      case '+':
        d.push(colors.green(v))
        break
      case '@':
        if (v.charAt(1) === '@') {
          d.push(colors.cyan(v))
          break
        }
      default:
        d.push(colors.black(v))
    }
    const k = d.length - 1
    const row = d.length
    d[k] = colors.cyan(`${ row }`.padStart(`${ diff.length }`.length, ' ')) + colors.cyan('│ ') + d[k]
  }
  return d.map(x => [x])
}

export function getGitModifiedFiles(compareCommitId: string, comparedCommitId?: string): Array<string[]> {
  const sh: string = comparedCommitId ?
    `git diff ${ compareCommitId } ${ comparedCommitId } --name-only`
    : `git diff ${ compareCommitId } --name-only`
  const files: string = execSync(sh).toString()
  return files.trim().split('\n').map(x => [x])
}

export function createGitNewBranch(name: string): void {
  const sh: string = `git checkout -b ${ name }`
  exec(sh)
}

export function checkoutGitBranch(name: string): void {
  const sh: string = `git checkout ${ name }`
  execSync(sh)
}

export function getNowGitBranch(): string {
  const sh: string = 'git rev-parse --abbrev-ref HEAD 2> /dev/null'
  return execSync(sh).toString().trim()
}

export function isOkGitCheckout(): boolean {
  const sh: string = 'git diff --name-only'
  return (execSync(sh).toString().trim().length === 0)
}
