import { commands, env, ExtensionContext } from 'vscode';
import { generateSnippet } from './lib/textHelpers';

export function activate(context: ExtensionContext): void {
	context.subscriptions.push(
		commands.registerTextEditorCommand('snippet-copy.copySnippet', async (editor) => {
			const snippet = await generateSnippet(editor.document, editor.selections, false);

			void env.clipboard.writeText(snippet);
		})
	);
	context.subscriptions.push(
		commands.registerTextEditorCommand('snippet-copy.copySnippetAsMarkdownCodeBlock', async (editor) => {
			const snippet = await generateSnippet(editor.document, editor.selections, true);

			void env.clipboard.writeText(snippet);
		})
	);
}
