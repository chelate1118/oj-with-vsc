import * as vscode from 'vscode';

const tokenTypes = ['class', 'variable'];
const tokenModifiers = ['input', 'output'];
const legend = new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);

export class Language {
  static get divider(): string {
    return vscode.workspace.getConfiguration('oj-with').get('separator')!;
  }
}

const provider: vscode.DocumentSemanticTokensProvider = {
  provideDocumentSemanticTokens(
    document: vscode.TextDocument
  ): vscode.ProviderResult<vscode.SemanticTokens> {

    const lineCount = document.lineCount;

    let isInput = true;
    const tokensBuilder = new vscode.SemanticTokensBuilder(legend);

    for (let i = 0; i < lineCount; i++) {
      const element = document.lineAt(i);
      if (isInput && element.text === Language.divider) {
        isInput = false;
        continue;
      }
      tokensBuilder.push(
        document.lineAt(i).range,
        isInput? 'class' : 'variable',
        [isInput? 'input' : 'output']
      );
    }

    return tokensBuilder.build();
  }
};

const selectorNote: vscode.DocumentFilter = {
  language: 'test-case',
  notebookType: 'test-case-view',
};

vscode.languages.registerDocumentSemanticTokensProvider(selectorNote, provider, legend);