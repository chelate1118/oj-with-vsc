import { IncomingMessage } from 'http'
import * as vscode from 'vscode'

const https = require('node:https');

export async function selectProblem() {
    var selectJudge = ''

    await vscode.window.showQuickPick(["Codeforces", "Beakjoon", "Atcoder"], {
        onDidSelectItem: item => selectJudge = item.toString()
    })
}

abstract class Problem {
    public get name() {
        return ''
    }
}

export class CodeforcesProblem extends Problem {
    public override get name() {
        return "Codeforces"
    }

    public static pickProblem() {
        this.quickPickContest()
    }

    private static async quickPickContest() {
        var array = new Array<string>();

        const url = `https://codeforces.com/api/contest.list`
        let body = ''

        https.get(url, (responce: IncomingMessage) => {
            responce.on('data', (d) => {
                body += d;
            })

            responce.on('end', async() => {                
                var resultArray: {
                    [element: string]: string
                }[] = JSON.parse(body).result

                resultArray.forEach(result => {
                    if (result.phase !== "BEFORE")
                        array.push(`[${result.id}] ${result.name}`)
                });

                var selectItem = ''
                await vscode.window.showQuickPick(array, {
                    onDidSelectItem: item => selectItem = item.toString()
                });

                var selectContestID = selectItem.split(']')[0].replace('[', '')

                this.quickPickProblem(parseInt(selectContestID))
            })
        })
    }

    private static quickPickProblem(contestID: number) {
        var array = new Array<string>();

        const url = `https://codeforces.com/api/problemset.problems`
        let body = ''

        https.get(url, (responce: IncomingMessage) => {
            responce.on('data', (d) => {
                body += d;
            })

            responce.on('end', async() => {
                var problemArray: {
                    [element: string]: string|number,
                }[] = JSON.parse(body).result.problems

                console.log(contestID);
                console.log(problemArray)
                
                problemArray.forEach(problem => {
                    if (problem.contestID == contestID) {
                        array.push(`[${problem.index}] ${problem.name}(${problem.points})`);
                    }
                })

                console.log(array)
            })
        })
    }
}

export class BOJProblem extends Problem {
    public override get name() {
        return "Beakjoon"
    }

    public static async pickProblem() {
        var array: object[];

        let maxPage = 1;
        for (let i = 1; i <= maxPage; i++) {
            const url = `https://solved.ac/api/v3/search/problem?query=%20&page=${i}`

            https.get(url, (responce: IncomingMessage) => {
                let body = ''

                responce.on('data', (d) => {
                    body += d;
                })

                responce.on('end', () => {
                    console.log(body);
                    console.log(JSON.parse(body).items)
                    if (JSON.parse(body).items.length == 0) {
                        maxPage = Math.min(maxPage, i);
                    }
                })
            })
        }

        console.log(maxPage);
    }
}