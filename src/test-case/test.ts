import * as vscode from 'vscode'
import { ojwController } from '../extension';
import { queue } from './notebook-controller';
import { Language } from './test-case-token';

const execFile = require('child_process').execFile;
const stream = require('stream');

export const workspacePath: string = vscode.workspace.workspaceFolders![0].uri.path;
const binaryPath: string = workspacePath + '/.ojw_exe';

export class TestCase {
    input: string
    output: string

    public constructor(data: vscode.TextDocument) {
        this.input = ''
        this.output = ''
        var isInput = true;

        for (let i = 0; i < data.lineCount; i++) {
            if (isInput && data.lineAt(i).text == Language.divider) {
                isInput = false;
                continue;
            }

            if (isInput)
                this.input += data.lineAt(i).text + '\n'
            else {
                this.output += data.lineAt(i).text + '\n'
            }
        }
    }

    public async test(
        sourcePathWorkSpace: string,
        execution: vscode.NotebookCellExecution,
        compile: boolean
    ) {
        if (vscode.workspace.workspaceFolders == undefined) {
            vscode.window.showErrorMessage('Any workspace isn\'t existing')
            return 'workspace error';
        }

        const sourcePath = `${workspacePath}${sourcePathWorkSpace}`;
        this.compileAndRun(sourcePath, binaryPath, this.input, execution, compile);
    }

    private compileAndRun(
        sourcePath: string,
        binaryPath: string,
        input: string,
        execution: vscode.NotebookCellExecution,
        compile: boolean
    ) {
        if (!compile) {
            this.executeBinary(binaryPath, input, execution);
            return;
        }
        execFile('g++', [sourcePath, '-DONLINE_JUDGE', '-o', binaryPath], (
            err: Error, _stdout: string, _stderr: string
        ) => {
            if (err != null) {
                execution.start();
                execution.replaceOutput([
                    new vscode.NotebookCellOutput([
                        vscode.NotebookCellOutputItem.text(
                            err.message
                        )
                    ])
                ])
                queue.length = 0;
                execution.end(false);
            } else {
                this.executeBinary(binaryPath, input, execution)
            }
        });
    }

    private executeBinary(
        path: string,
        input: string,
        execution: vscode.NotebookCellExecution
    ) {
        execution.start(Date.now());

        const child_process = execFile(`${path}`, (
            err: Error, stdout: string, stderr: string
        ) => {
            let finishTime = Date.now();
            if (err != null) {
                execution.replaceOutput([
                    new vscode.NotebookCellOutput([
                        vscode.NotebookCellOutputItem.error(err)
                    ])
                ])
                execution.end(false, finishTime);
                queue.shift();
                if (queue.length > 0)
                    ojwController._doExecution(queue[0]);
            } else {
                execution.replaceOutput([
                    new vscode.NotebookCellOutput([
                        vscode.NotebookCellOutputItem.text(stdout)
                    ])
                ])

                execution.end(this.isCorrectOutput(stdout), finishTime)
                queue.shift();
                if (queue.length > 0)
                    ojwController._doExecution(queue[0]);
            }
        })

        const stdinStream = new stream.Readable();
        stdinStream.push(input);
        stdinStream.push(null);
        stdinStream.pipe(child_process.stdin);
    }

    private isCorrectOutput(ans: string) {
        if (this.output === '') return true;
        const ansWhiteSpace = ans.replaceAll('\n', ' ')
        const outputWhiteSpace = this.output.replaceAll('\n', ' ')

        var ansSp = ansWhiteSpace.split(' ');
        var outputSp = outputWhiteSpace.split(' ');

        ansSp = ansSp.filter(s => s.length > 0)
        outputSp = outputSp.filter(s => s.length > 0)

        return ansSp.length === outputSp.length && ansSp.every((val, ind) => val === outputSp[ind]);
    }
}