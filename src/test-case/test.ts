import * as vscode from 'vscode'

const execFile = require('child_process').execFile;
const stream = require('stream');

const workspacePath: string = vscode.workspace.workspaceFolders![0].uri.path;
const binaryPath: string = workspacePath + '/exe';

const divider: string = require('../test-case/test-case-token').divider

export class TestCase {
    input: string
    output: string

    public constructor(data: vscode.TextDocument) {
        this.input = ''
        this.output = ''
        var isInput = true;

        for (let i = 0; i < data.lineCount; i++) {
            if (isInput && data.lineAt(i).text == divider) {
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
        execution: vscode.NotebookCellExecution
    ) {
        if (vscode.workspace.workspaceFolders == undefined) {
            vscode.window.showErrorMessage('Any workspace isn\'t existing')
            return 'workspace error';
        }

        const sourcePath = `${workspacePath}/${sourcePathWorkSpace}`;
        this.compileAndRun(sourcePath, binaryPath, this.input, execution);
    }

    private compileAndRun(
        sourcePath: string,
        binaryPath: string,
        input: string,
        execution: vscode.NotebookCellExecution
    ) {

        execFile('g++', [sourcePath, '-o', binaryPath], (
            err: Error, stdout: string, stderr: string
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
            if (err != null) {
                execution.replaceOutput([
                    new vscode.NotebookCellOutput([
                        vscode.NotebookCellOutputItem.error(err)
                    ])
                ])
                execution.end(false, Date.now());
            } else {
                execution.replaceOutput([
                    new vscode.NotebookCellOutput([
                        vscode.NotebookCellOutputItem.text(stdout)
                    ])
                ])

                execution.end(this.isCorrectOutput(stdout), Date.now())
            }
        })

        const stdinStream = new stream.Readable();
        stdinStream.push(input);
        stdinStream.push(null);
        stdinStream.pipe(child_process.stdin);
    }

    private isCorrectOutput(ans: string) {
        if (this.output === '') return true;
        const ansWhiteSpace = ans.replace('\n', ' ')
        const outputWhiteSpace = this.output.replace('\n', ' ')

        var ansSp = ansWhiteSpace.split(' ');
        var outputSp = outputWhiteSpace.split(' ');

        ansSp = ansSp.filter(s => s.length > 0)
        outputSp = outputSp.filter(s => s.length > 0)

        return ansSp.length === outputSp.length && ansSp.every((val, ind) => val === outputSp[ind]);
    }
}