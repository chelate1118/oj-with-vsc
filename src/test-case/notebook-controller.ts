import * as vscode from 'vscode';
import { currentSource } from '../files/source-path';
import { TestCase } from './test';

export var queue = new Array<[vscode.NotebookCell, boolean]>;

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
    if (cells.length === 0) { return; }
    if (queue.length === 0) {
      var first = true;
      for (let cell of cells) {
        queue.push([cell, first]);
        first = false;
      }
      this._doExecution(queue[0]);
    } else {
      var first = true;
      for (let cell of cells) {
        queue.push([cell, first]);
        first = false;
      }
    }
  }

  public async _doExecution(cell: [vscode.NotebookCell, boolean]): Promise<void> {
    const execution = this.controller.createNotebookCellExecution(cell[0]);
    execution.executionOrder = ++this._executionOrder;
    
    const tc = new TestCase(cell[0].document);
    tc.test(currentSource, execution, cell[1]);
  }
}
