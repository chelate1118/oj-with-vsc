// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { currentSource, setCurrentSource } from './files/source-path';
import { BOJProblem, CodeforcesProblem } from './online-judge/problem';
import { TestCaseSerializer } from './test-case/case-viewer';
import { OjwController } from './test-case/notebook-controller';

export function activate(context: vscode.ExtensionContext) {
	const ojwController = new OjwController();

	let submitAction = vscode.commands.registerCommand('chelate1118.oj-with.submit', () => {
		vscode.window.showInformationMessage('Code Submitted');
	});

	let selectSource = vscode.commands.registerCommand('chelate1118.oj-with.select-source', async() => {
		ojwController.controller.label = await setCurrentSource();
	})

	let selectProblem = vscode.commands.registerCommand('chelate1118.oj-with.problem', async() => {
		var selectJudge = ''

		await vscode.window.showQuickPick(["Codeforces", "Beakjoon", "Atcoder"], {
			onDidSelectItem: item => selectJudge = item.toString()
		})
		
		if (selectJudge === "Codeforces") {
			CodeforcesProblem.pickProblem()
		}
	})

	let testCaseViewerNotebook = vscode.workspace.registerNotebookSerializer(
		'test-case-view', new TestCaseSerializer());

	context.subscriptions.push(
		submitAction,
		selectSource,
		testCaseViewerNotebook,
		ojwController,
		selectProblem
	);
}

export function deactivate() {}
