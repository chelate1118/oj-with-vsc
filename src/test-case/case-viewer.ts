import { TextDecoder, TextEncoder } from 'util';
import * as vscode from 'vscode';
import { currentSource, setSourcePath } from '../files/source-path';

interface RawNotebookCell {
    language: string;
    value: string;
    kind: vscode.NotebookCellKind;
}

interface NotebookData {
    sourcePath: string;
    data: RawNotebookCell[];
}

export class TestCaseSerializer implements vscode.NotebookSerializer {
    async deserializeNotebook(
        content: Uint8Array,
        _token: vscode.CancellationToken
    ): Promise<vscode.NotebookData> {
        var contents = new TextDecoder().decode(content);

        let raw: RawNotebookCell[];
        try {
            let notebookData: NotebookData = JSON.parse(contents);
            raw = notebookData.data;
            setSourcePath(notebookData.sourcePath);
        } catch {
            raw = [];
        }

        const cells = raw.map(
            item => new vscode.NotebookCellData(item.kind, item.value, 'Test Case')
        );

        return new vscode.NotebookData(cells);
    }

    async serializeNotebook(
        data: vscode.NotebookData,
        _token: vscode.CancellationToken
    ): Promise<Uint8Array> {
        let contents: NotebookData;
        let cells: RawNotebookCell[] = [];

        for (const cell of data.cells) {
            cells.push({
                kind: cell.kind,
                language: 'Test Case',
                value: cell.value
            });
        }

        contents = {
            sourcePath: currentSource,
            data: cells
        };

        return new TextEncoder().encode(JSON.stringify(contents));
    }
}