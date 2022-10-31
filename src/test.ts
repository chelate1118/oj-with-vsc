import * as vscode from 'vscode'

const execFile = require('child_process').execFile;
var workspacePath: string;
var binaryPath: string;

if (vscode.workspace.workspaceFolders == undefined) {
    vscode.window.showErrorMessage('Any workspace isn\'t existing')
} else {
    workspacePath = vscode.workspace.workspaceFolders[0].uri.path
    binaryPath = workspacePath + '/exe'
}

enum Result {
    RE,
    CE,
    TLE,
    WA,
    AC
}

export class TestCase {
    input: string
    output: string

    public constructor(input: string, output: string) {
        this.input = input
        this.output = output
    }

    public *test(sourcePath: string) {
        if (vscode.workspace.workspaceFolders == undefined) {
            vscode.window.showErrorMessage('Any workspace isn\'t existing')
            return 'workspace error';
        }

        compile(`${workspacePath}/${sourcePath}`, binaryPath);

        let [err, stdout, _stderr] = executeBinary(binaryPath, this.input)
        var output = '.';

        if(typeof(stdout) == 'string') {
            output = stdout;
        }

        if (err != null) {
            return 'error';
        }

        return output;
    }
}

function compile(sourcePath: string, binaryPath: string) {
    execFile('g++', [sourcePath, '-o', binaryPath], (
        err: string, stdout: string, stderr: string
    ) => {
        console.log(`err: ${err}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    })
}

function executeBinary(path: string, input: string) {
    const execFile = require('child_process').execFile;
    const stream = require('stream');

    var err, stdout, stderr;

    console.log(`path: ${path}`);
    console.log(`input: ${input}`);

    const child_process = execFile(`./${path}`, (
        error: string, stdoutput: string, stderror: string
    ) => {
        err = error;
        stdout = stdoutput;
        stderr = stderror;
    })

    const stdinStream = new stream.Readable();
    stdinStream.push(input);
    stdinStream.push(null);
    stdinStream.pipe(child_process.stdin);

    return [err, stdout, stderr];
}