import * as vscode from 'vscode'

const execFile = require('child_process').execFile;
const stream = require('stream');

const workspacePath: string = vscode.workspace.workspaceFolders![0].uri.path;
const binaryPath: string = workspacePath + '/exe';

export async function run(sourcePath: string, input: string) {
    switch (sourcePath.split('.').pop()) {
        case 'cpp':
            await compileCpp(`${workspacePath}/${sourcePath}`, binaryPath)
            await executeBinary(binaryPath, input)
            break;
        case 'py':
            
    }
}

async function runPy(sourcePath: string, input: string) {
    var finished = false;

    execFile('python', [sourcePath], (
        err: string, stdout: string, stderr: string
    ) => {
        finished = true;
    })

    const stdinStream = new stream.Readable();
    stdinStream.push(input);
    
    while(!finished) {
        console.log('Wait running');
        await sleep(100);
    }
}

async function compileCpp(sourcePath: string, binaryPath: string) {
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