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

export class TestCase {
    input: string
    output: string

    public constructor(input: string, output: string) {
        this.input = input
        this.output = output
    }

    public async test(sourcePath: string) {
        if (vscode.workspace.workspaceFolders == undefined) {
            vscode.window.showErrorMessage('Any workspace isn\'t existing')
            return 'workspace error';
        }
        
        let success = await compile(`${workspacePath}/${sourcePath}`, binaryPath);
        if (!success) return;
        
        let [err, stdout, _stderr] = await executeBinary(binaryPath, this.input);

        if(stdout == this.output) {
            vscode.window.showInformationMessage('finish test');
        }
        else {
            vscode.window.showWarningMessage('test failed', );
        }
    }
}

async function compile(sourcePath: string, binaryPath: string) {
    var finished = false;
    var success = true;

    execFile('g++', [sourcePath, '-o', binaryPath], (
        err: string, stdout: string, stderr: string
    ) => {
        if(err != null) {
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