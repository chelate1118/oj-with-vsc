// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TestCase } from './test-case/test';
import { SampleSerializer } from './test-case/case-viewer';

export function activate(context: vscode.ExtensionContext) {
	
	let submitAction = vscode.commands.registerCommand('chelate1118.oj-with.submit', () => {
		vscode.window.showInformationMessage('Code Submitted');
	});

	let testRun = vscode.commands.registerCommand('chelate1118.oj-with.test', async() => {
		vscode.window.showInformationMessage('testing start...');
		await new TestCase('10\n', '10\nHello, Worl!').test('test.cpp');
	})

	let testCaseViewerNotebook = vscode.workspace.registerNotebookSerializer(
		'test-case-view', new SampleSerializer());

	context.subscriptions.push(
		submitAction,
		testRun,
		testCaseViewerNotebook
	);
}

export function deactivate() {}
