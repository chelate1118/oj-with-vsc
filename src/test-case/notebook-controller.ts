import * as vscode from 'vscode'
import { TestCase } from './test';

export class OjwController {
    readonly controllerId = 'test-case-view';
    readonly notebookType = 'test-case-view';
    readonly label = 'Test Case View';
    readonly supportedLanguages = ['Test Case'];
  
    private readonly _controller: vscode.NotebookController;
    private _executionOrder = 0;
  
    constructor() {
      this._controller = vscode.notebooks.createNotebookController(
        this.controllerId,
        this.notebookType,
        this.label
      );
  
      this._controller.supportedLanguages = this.supportedLanguages;
      this._controller.supportsExecutionOrder = true;
      this._controller.executeHandler = this._execute.bind(this);
    }

    dispose(): void {
      this._controller.dispose();
    }
  
    private _execute(
      cells: vscode.NotebookCell[],
      _notebook: vscode.NotebookDocument,
      _controller: vscode.NotebookController
    ): void {
      for (let cell of cells) {
        this._doExecution(cell);
      }
    }
  
    private async _doExecution(cell: vscode.NotebookCell): Promise<void> {
      const execution = this._controller.createNotebookCellExecution(cell);
      execution.executionOrder = ++this._executionOrder;
      execution.start(Date.now());
      
      const tc = new TestCase(cell.document)
      const stdout: string = (await tc.test('test.cpp'))!

      if (tc.output === '') {
        execution.replaceOutput([
          new vscode.NotebookCellOutput([
            vscode.NotebookCellOutputItem.text(
              stdout
            )
          ])
        ]);
      }
      else {
        execution.replaceOutput([
          new vscode.NotebookCellOutput([
            vscode.NotebookCellOutputItem.text(
              `Answer:${tc.output}\nOutput:${stdout}`
            )
          ])
        ]);
      }

      execution.end(true, Date.now());
    }
  }