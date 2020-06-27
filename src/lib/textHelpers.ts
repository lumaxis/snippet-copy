import { QuickPickItem, Selection, TextDocument, window, workspace } from "vscode";
import { ExtensionConfig, MarkdownCodeBlockFlavor } from "../types/config";
import { contentOfLinesWithAdjustedIndentation, endOfLineCharacter, languageId, minimumIndentationForLineIndexes } from "./documentHelpers";
import { lineIndexesForSelection } from "./selectionHelpers";

type MarkdownCodeBlockFlavorQuickPickItems = QuickPickItem & {
	detail: MarkdownCodeBlockFlavor;
};

export async function generateSnippet(document: TextDocument, selections: Selection[], wrapInMarkdownCodeBlock = false): Promise<string> {
	const texts: string[] = [];
	selections.forEach(selection => {
		texts.push(generateCopyableText(document, selection));
	});

	const snippet = texts.join(endOfLineCharacter(document));

	if (wrapInMarkdownCodeBlock) {
		return wrapTextInMarkdownCodeBlock(document, snippet, await includeLanguageIdentifier(workspace.getConfiguration('snippet-copy') as ExtensionConfig));
	}

	return snippet;
}

export function generateCopyableText(document: TextDocument, selection: Selection): string {
	const lineIndexes = lineIndexesForSelection(selection);

	// Remove last line's index if there's no selected text on that line
	if (lineIndexes.length > 1 && selection.end.character === 0) {
		lineIndexes.pop();
	}

	const minimumIndentation = minimumIndentationForLineIndexes(document, lineIndexes);
	const text = contentOfLinesWithAdjustedIndentation(document, lineIndexes, minimumIndentation);

	return text;
}

export function wrapTextInMarkdownCodeBlock(document: TextDocument, text: string, addLanguageId = false): string {
	const codeBlockDelimiter = '```';
	const eolCharacter = endOfLineCharacter(document);
	const optionalLanguageIdentifier = addLanguageId ? languageId(document) : '';

	return codeBlockDelimiter + optionalLanguageIdentifier + eolCharacter +
		text + eolCharacter +
		codeBlockDelimiter;
}

export async function includeLanguageIdentifier(config: ExtensionConfig): Promise<boolean> {
	let markdownCodeBlockFlavor = config.markdownCodeBlock.flavor;

	if (markdownCodeBlockFlavor === 'prompt') {
		const prompt = await promptForMarkdownCodeBlockFlavor();

		if (prompt && isMarkdownCodeBlockFlavor(prompt.detail)) {
			markdownCodeBlockFlavor = prompt.detail;
		}
	}
	return markdownCodeBlockFlavor === 'includeLanguageIdentifier';
}

export async function promptForMarkdownCodeBlockFlavor(): Promise<MarkdownCodeBlockFlavorQuickPickItems | undefined> {
	const quickPickItems: MarkdownCodeBlockFlavorQuickPickItems[] = [
		{
			label: 'Plain fenced Markdown code block',
			detail: 'plain',
			description: 'Copy a plain, default Markdown code block'
		}, {
			label: 'Include Markdown language identifier',
			detail: 'includeLanguageIdentifier',
			description: "Copy a Markdown code block that includes the language identifier of the current document"
		}
	];
	return window.showQuickPick(quickPickItems, {
		matchOnDetail: true
	});
}

export function isMarkdownCodeBlockFlavor(value: string | undefined): value is MarkdownCodeBlockFlavor {
	const validValues: MarkdownCodeBlockFlavor[] = ['plain', 'includeLanguageIdentifier'];
	return !!value && validValues.includes(value as MarkdownCodeBlockFlavor);
}
