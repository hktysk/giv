import convertTree from './tree'

describe('gitTree convert newTree', () => {

const input = `*
|\\
| *
* |
* |
|\\ \\
| * |
* | |
|\\ \\ \\
| | |/
| |/|
| * |
* | |
* | |
|\\ \\ \\
| |/ /
| | /
| |/
|/|
| *
|/
*
*
`

const ans  =`
*─┐
│ *
* │
*─│─┐
│ * │
*─│─│─┐
│ *─│─┘
* │ │
*─│─│─┐
│ *─┴─┘
*─┘
*`.trim()

  it('check Answer', (): void => {
    const r: string[] = convertTree(input)
    expect(r.join('\n').trim()).toBe(ans)
  })
})
