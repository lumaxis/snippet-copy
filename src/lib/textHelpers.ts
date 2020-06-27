import { QuickPickItem, Selection, TextDocument, window, workspace } from "vscode";
import { ExtensionConfig, IncludeLanguageIdentifier } from "../types/config";
import { contentOfLinesWithAdjustedIndentation, endOfLineCharacter, languageId, minimumIndentationForLineIndexes } from "./documentHelpers";
import { lineIndexesForSelection } from "./selectionHelpers";

type MarkdownCodeBlockFlavorQuickPickItems = QuickPickItem & {
	detail: IncludeLanguageIdentifier;
};

export async function generateSnippet(document: TextDocument, selections: Selection[], wrapInMarkdownCodeBlock = false): Promise<string> {
	const config = workspace.getConfiguration('snippet-copy') as ExtensionConfig;
	const texts: string[] = [];
	selections.forEach(selection => {
		texts.push(generateCopyableText(document, selection, config));
	});

	const snippet = texts.join(endOfLineCharacter(document));

	if (wrapInMarkdownCodeBlock) {
		return wrapTextInMarkdownCodeBlock(document, snippet, await includeLanguageIdentifier(workspace.getConfiguration('snippet-copy') as ExtensionConfig));
	}

	return snippet;
}

export function generateCopyableText(document: TextDocument, selection: Selection, config: ExtensionConfig): string {
	const lineIndexes = lineIndexesForSelection(selection);

	// Remove last line's index if there's no selected text on that line
	if (lineIndexes.length > 1 && selection.end.character === 0) {
		lineIndexes.pop();
	}

	const minimumIndentation = minimumIndentationForLineIndexes(document, lineIndexes);
	const text = contentOfLinesWithAdjustedIndentation(document, lineIndexes, minimumIndentation);

	if (config.convertTabsToSpaces.enabled) {
		return replaceLeadingTabsWithSpaces(text, config.convertTabsToSpaces.tabSize);
	}

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
	let includeLanguageIdentifier = config.markdownCodeBlock.includeLanguageIdentifier;

	if (includeLanguageIdentifier === 'prompt') {
		const prompt = await promptForMarkdownCodeBlockFlavor();

		if (prompt && isMarkdownCodeBlockFlavor(prompt.detail)) {
			includeLanguageIdentifier = prompt.detail;
		}
	}
	return includeLanguageIdentifier === 'always';
}

export function replaceLeadingTabsWithSpaces(text: string, tabSize = 2): string {
	const spaces = ' '.repeat(tabSize);

	return text.replace(/^\t+/gm, (tabs) => tabs.replace(/\t/g, spaces));
}

export async function promptForMarkdownCodeBlockFlavor(): Promise<MarkdownCodeBlockFlavorQuickPickItems | undefined> {
	const quickPickItems: MarkdownCodeBlockFlavorQuickPickItems[] = [
		{
			label: 'Plain fenced Markdown code block',
			detail: 'never',
			description: 'Copy a regular fenced Markdown code block without language identifier'
		}, {
			label: 'Include Markdown language identifier',
			detail: 'always',
			description: "Copy a Markdown code block that includes the language identifier of the current document"
		}
	];
	return window.showQuickPick(quickPickItems, {
		matchOnDetail: true
	});
}

export function isMarkdownCodeBlockFlavor(value: string | undefined): value is IncludeLanguageIdentifier {
	const validValues: IncludeLanguageIdentifier[] = ['never', 'always'];
	return !!value && validValues.includes(value as IncludeLanguageIdentifier);
}
