import * as vscode from 'vscode';
import { ojwController } from '../extension';
import { workspacePath } from '../test-case/test';

export var currentSource = '/main.cpp';

export function setSourcePath(path: string) {
    currentSource = path;
    ojwController.controller.label = path;
}

export async function pickSourcePath() {
    let sourcesUri = await vscode.workspace.findFiles('**/*.cpp');
    let sourcesPath = new Array<string>;

    sourcesUri.forEach((value: vscode.Uri) => {
        sourcesPath.push(value.path.replace(`${workspacePath}`, ''));
    })

    sourcesPath.sort()

    await vscode.window.showQuickPick(sourcesPath, {
        onDidSelectItem: item => {
            currentSource = item.toString()
        },
        placeHolder: "Select source file to run"
    });
    
    setSourcePath(currentSource)
}