import * as vscode from 'vscode'
import { currentSource } from '../files/source-path';
import { TestCase } from './test';

export class OjwController {
  readonly controllerId = 'test-case-view';
  readonly notebookType = 'test-case-view';
  readonly supportedLanguages = ['Test Case'];

  readonly controller: vscode.NotebookController;
  private _executionOrder = 0;

  constructor() {
    this.controller = vscode.notebooks.createNotebookController(
      this.controllerId,
      this.notebookType,
      currentSource
    );

    this.controller.supportedLanguages = this.supportedLanguages;
    this.controller.supportsExecutionOrder = true;
    this.controller.executeHandler = this.execute.bind(this);
  }

  dispose(): void {
    this.controller.dispose();
  }

  execute(
    cells: vscode.NotebookCell[],
    _notebook: vscode.NotebookDocument,
    _controller: vscode.NotebookController
  ): void {
    for (let cell of cells) {
      this._doExecution(cell);
    }
  }

  private async _doExecution(cell: vscode.NotebookCell): Promise<void> {
    const execution = this.controller.createNotebookCellExecution(cell);
    execution.executionOrder = ++this._executionOrder;
    
    const tc = new TestCase(cell.document)
    tc.test(currentSource, execution)
  }
}