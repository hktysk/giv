import { execSync, exec } from 'child_process'
import colors from 'colors'
import convertTree from './tree'

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
  const sh = 'git log --graph --all --format="%x09"'
  const gitTree: string = execSync(sh).toString().trim()
  return convertTree(gitTree)
}

export function getGitBranches(): Array<string[]> {
  const sh: string = `git branch --sort=-authordate`
  const branches: string = execSync(sh).toString()
  return branches.trim().split('\n').map(x => [x])
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
