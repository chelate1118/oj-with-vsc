import * as vscode from 'vscode'

const tokenTypes = ['class', 'variable'];
const tokenModifiers = ['input', 'output'];
const legend = new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);

const divider = '=='

const provider: vscode.DocumentSemanticTokensProvider = {
  provideDocumentSemanticTokens(
    document: vscode.TextDocument
  ): vscode.ProviderResult<vscode.SemanticTokens> {

    const lineCount = document.lineCount;

    let isInput = true;
    const tokensBuilder = new vscode.SemanticTokensBuilder(legend);

    for (let i = 0; i < lineCount; i++) {
      const element = document.lineAt(i);
      if (element.text == divider) {
        isInput = false;
        continue;
      }
      tokensBuilder.push(
        document.lineAt(i).range,
        isInput? 'class' : 'variable',
        [isInput? 'input' : 'output']
      )
    }

    return tokensBuilder.build();
  }
};

const selector = {
  language: 'Test Case',
  scheme: 'file'
}

vscode.languages.registerDocumentSemanticTokensProvider(selector, provider, legend)