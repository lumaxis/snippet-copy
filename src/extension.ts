import * as vscode from 'vscode';
import { generateCopyableText } from './lib/textHelpers';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerTextEditorCommand('snippet-copy.copyWithoutLeadingIndentation', async (editor) => {
		if (editor.selections.length === 1) {
			const document = editor.document;
			if (!document) { return; };

			const text = generateCopyableText(document, editor.selection);

			if (!text) { return; };

			await vscode.env.clipboard.writeText(text);
		} else {
			// TODO: Handle error case
			vscode.window.showWarningMessage('Copying without leading indentation from multiple selections is currently not supported');
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
