import * as vscode from 'vscode'

const execFile = require('child_process').execFile;
const stream = require('stream');

var workspacePath: string;
var binaryPath: string;

if (vscode.workspace.workspaceFolders == undefined) {
    vscode.window.showErrorMessage('Any workspace isn\'t existing')
} else {
    workspacePath = vscode.workspace.workspaceFolders[0].uri.path
    binaryPath = workspacePath + '/exe'
}

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

    public async test(sourcePathWorkSpace: string) {
        if (vscode.workspace.workspaceFolders == undefined) {
            vscode.window.showErrorMessage('Any workspace isn\'t existing')
            return 'workspace error';
        }

        let success = await compile(`${workspacePath}/${sourcePathWorkSpace}`, binaryPath);
        if (!success) return;

        let [err, stdout, _stderr] = await executeBinary(binaryPath, this.input);

        if (isCorrectOutput(this.output, stdout!)) {
            vscode.window.showInformationMessage('Finish test');
        }
        else {
            vscode.window.showWarningMessage('Test failed', 'Show Info')
                .then(_selection => {
                    vscode.window.showInformationMessage(`Correct Output: ${this.output}\n`
                        + `Your Output: ${stdout}`, { modal: true })
                });
        }
    }
}

async function compile(sourcePath: string, binaryPath: string) {
    var finished = false;
    var success = true;

    execFile('g++', [sourcePath, '-o', binaryPath], (
        err: string, stdout: string, stderr: string
    ) => {
        if (err != null) {
            success = false;
            vscode.window.showErrorMessage('Compilation failed\n' + err);
        }
        finished = true;
    });

    while (!finished) {
        console.log('wait compile');
        await sleep(100);
    }

    return success;
}

async function executeBinary(path: string, input: string) {
    var finished = false;
    var err, stdout, stderr;

    const child_process = execFile(`${path}`, (
        error: string, stdoutput: string, stderror: string
    ) => {
        err = error;
        stdout = stdoutput;
        stderr = stderror;
        finished = true;
    })

    const stdinStream = new stream.Readable();
    stdinStream.push(input);
    stdinStream.push(null);
    stdinStream.pipe(child_process.stdin);

    while (!finished) {
        console.log('wait executing');
        await sleep(100);
    }

    return [err, stdout, stderr];
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isCorrectOutput(ans: string, output: string) {
    const ansWhiteSpace = ans.replace('\n', ' ')
    const outputWhiteSpace = output.replace('\n', ' ')

    var ansSp = ansWhiteSpace.split(' ');
    var outputSp = outputWhiteSpace.split(' ');

    ansSp = ansSp.filter(s => s.length > 0)
    outputSp = outputSp.filter(s => s.length > 0)

    console.log(ansSp)
    console.log(outputSp)

    return ansSp.length === outputSp.length && ansSp.every((val, ind) => val === outputSp[ind]);
}