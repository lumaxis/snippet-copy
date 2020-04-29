import { commands, env, ExtensionContext } from 'vscode';
import { generateSnippet } from './lib/textHelpers';

export function activate(context: ExtensionContext) {
	context.subscriptions.push(
		commands.registerTextEditorCommand('snippet-copy.copySnippet', async (editor) => {
			const snippet = generateSnippet(editor.document, editor.selections, false);

			await env.clipboard.writeText(snippet);
		})
	);
	context.subscriptions.push(
		commands.registerTextEditorCommand('snippet-copy.copySnippetAsMarkdownCodeBlock', async (editor) => {
			const snippet = generateSnippet(editor.document, editor.selections, true);

			await env.clipboard.writeText(snippet);
		})
	);
}

export function deactivate() { }
