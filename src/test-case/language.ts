import * as vscode from 'vscode'

const tokenTypes = ['input', 'output', 'divider'];
const tokenModifiers = ['input', 'output'];
const legend = new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);

const divider = '=='

const provider: vscode.DocumentSemanticTokensProvider = {
    provideDocumentSemanticTokens(
      document: vscode.TextDocument
    ): vscode.ProviderResult<vscode.SemanticTokens> {
      
      const lineCount = document.lineCount;
      
      let diveder_line = lineCount;

      for (let i = 0; i < lineCount; i++) {
        const element = document.lineAt(i);
        if (element.text == divider) {
          diveder_line = i;
          break;
        }
      }

      const tokensBuilder = new vscode.SemanticTokensBuilder(legend);
      
      tokensBuilder.push(
        new vscode.Range(
          new vscode.Position(0, 0),
          document.lineAt(diveder_line-1).range.end
        ),
        'input',
        ['output']
      );

      console.log('called');

      return tokensBuilder.build();
    }
};

const selector = {
    language: 'Test Case',
    scheme: 'file'
}

vscode.languages.registerDocumentSemanticTokensProvider(selector, provider, legend)

console.log('executed')