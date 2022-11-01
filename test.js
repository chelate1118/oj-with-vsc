"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCase = void 0;
const vscode = require("vscode");
const execFile = require('child_process').execFile;
const stream = require('stream');
var workspacePath;
var binaryPath;
if (vscode.workspace.workspaceFolders == undefined) {
    vscode.window.showErrorMessage('Any workspace isn\'t existing');
}
else {
    workspacePath = vscode.workspace.workspaceFolders[0].uri.path;
    binaryPath = workspacePath + '/exe';
}
var Result;
(function (Result) {
    Result[Result["RE"] = 0] = "RE";
    Result[Result["CE"] = 1] = "CE";
    Result[Result["TLE"] = 2] = "TLE";
    Result[Result["WA"] = 3] = "WA";
    Result[Result["AC"] = 4] = "AC";
})(Result || (Result = {}));
class TestCase {
    constructor(input, output) {
        this.input = input;
        this.output = output;
    }
    async test(sourcePath) {
        if (vscode.workspace.workspaceFolders == undefined) {
            vscode.window.showErrorMessage('Any workspace isn\'t existing');
            return 'workspace error';
        }
        let success = await compile(`${workspacePath}/${sourcePath}`, binaryPath);
        if (!success)
            return;
        let [err, stdout, _stderr] = await executeBinary(binaryPath, this.input);
        if (stdout == this.output) {
            vscode.window.showInformationMessage('finish test');
        }
        else {
            vscode.window.showWarningMessage('test failed');
        }
    }
}
exports.TestCase = TestCase;
async function compile(sourcePath, binaryPath) {
    var finished = false;
    var success = true;
    execFile('g++', [sourcePath, '-o', binaryPath], (err, stdout, stderr) => {
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
async function executeBinary(path, input) {
    var finished = false;
    var err, stdout, stderr;
    const child_process = execFile(`${path}`, (error, stdoutput, stderror) => {
        err = error;
        stdout = stdoutput;
        stderr = stderror;
        finished = true;
    });
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
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//# sourceMappingURL=test.js.map