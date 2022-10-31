// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TestCase } from './test';

export function activate(context: vscode.ExtensionContext) {
	
	let submitAction = vscode.commands.registerCommand('chelate1118.oj-with.submit', () => {
		vscode.window.showInformationMessage('Code Submitted');
	});

	let testRun = vscode.commands.registerCommand('chelate1118.oj-with.test', () => {
		vscode.window.showInformationMessage('testing start...');
		let [_x, y, _z] = new TestCase('10\n', '10').test('test.cpp');
		vscode.window.showInformationMessage(y);
	})

	context.subscriptions.push(submitAction, testRun);
}

export function deactivate() {}
