import { commands, env, ExtensionContext } from 'vscode';
import { generateSnippet } from '../lib/textHelpers';

export function activate(context: ExtensionContext): void {
	context.subscriptions.push(
		commands.registerTextEditorCommand('snippet-copy.copySnippet', (editor) => {
			void generateSnippet(editor.document, editor.selections, false)
				.then((snippet) => {
					return env.clipboard.writeText(snippet);
				});
		})
	);

	context.subscriptions.push(
		commands.registerTextEditorCommand('snippet-copy.copySnippetAsMarkdownCodeBlock', (editor) => {
			void generateSnippet(editor.document, editor.selections, true)
				.then((snippet) => {
					return env.clipboard.writeText(snippet);
				});
		})
	);
}
