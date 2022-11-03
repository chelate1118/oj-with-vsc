// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TestCase } from './test-case/test';
import { TestCaseSerializer } from './test-case/case-viewer';
import { OjwController } from './test-case/notebook-controller';

export function activate(context: vscode.ExtensionContext) {
	require('./test-case/test-case-token')

	let submitAction = vscode.commands.registerCommand('chelate1118.oj-with.submit', () => {
		vscode.window.showInformationMessage('Code Submitted');
	});

	let testRun = vscode.commands.registerCommand('chelate1118.oj-with.test', async() => {
		vscode.window.showInformationMessage('testing start...');
		// await new TestCase().test('test.cpp');
	})

	let testCaseViewerNotebook = vscode.workspace.registerNotebookSerializer(
		'test-case-view', new TestCaseSerializer());

	context.subscriptions.push(
		submitAction,
		testRun,
		testCaseViewerNotebook,
		new OjwController()
	);
}

export function deactivate() {}
