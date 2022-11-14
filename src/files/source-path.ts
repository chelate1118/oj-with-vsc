import * as vscode from 'vscode';
import { workspacePath } from '../test-case/test';

export let currentSource = '/main.cpp'

export async function setCurrentSource() {
    let sourcesUri = await vscode.workspace.findFiles('**/*.cpp');
    let sourcesPath = new Array<string>;

    sourcesUri.forEach((value: vscode.Uri) => {
        sourcesPath.push(value.path.replace(`${workspacePath}`, ''));
    })

    await vscode.window.showQuickPick(sourcesPath, {
        onDidSelectItem: item => {
            currentSource = item.toString()
        },
        placeHolder: "Select source file to run"
    });
    
    return currentSource;
}