import { Selection, TextDocument, workspace } from "vscode";
import { contentOfLinesWithAdjustedIndentation, endOfLineCharacter, languageId, minimumIndentationForLineIndexes } from "./documentHelpers";
import { lineIndexesForSelection } from "./selectionHelpers";

export function generateSnippet(document: TextDocument, selections: Selection[], markdownCodeBlock = false): string {
	const texts: string[] = [];
	selections.forEach(selection => {
		texts.push(generateCopyableText(document, selection));
	});

	const snippet = texts.join(endOfLineCharacter(document));

	if (markdownCodeBlock) {
		const config = workspace.getConfiguration('snippet-copy');

		return wrapTextInMarkdownCodeBlock(document, snippet, config.addLanguageIdentifierToMarkdownBlock);
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

	return 	codeBlockDelimiter + optionalLanguageIdentifier + eolCharacter +
					text + eolCharacter +
					codeBlockDelimiter;
}
