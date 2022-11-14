// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { setCurrentSource } from './files/source-path';
import { TestCaseSerializer } from './test-case/case-viewer';
import { OjwController } from './test-case/notebook-controller';

export const ojwController = new OjwController();

export function activate(context: vscode.ExtensionContext) {

	let selectSource = vscode.commands.registerCommand('chelate1118.oj-with.select-source', async() => {
		ojwController.controller.label = await setCurrentSource();
	})

	let testCaseViewerNotebook = vscode.workspace.registerNotebookSerializer(
		'test-case-view', new TestCaseSerializer());

	context.subscriptions.push(
		selectSource,
		testCaseViewerNotebook,
		ojwController
	);
}

export function deactivate() {}
