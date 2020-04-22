import * as vscode from 'vscode';
import { generateSnippet } from './lib/textHelpers';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerTextEditorCommand('snippet-copy.copyWithoutLeadingIndentation', async (editor) => {
		const snippet = generateSnippet(editor);

		await vscode.env.clipboard.writeText(snippet);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
