import { TextDocument, Selection, TextEditor } from "vscode";
import { lineIndexesForSelection } from "./selectionHelpers";
import { endOfLineCharacter, minimumIndentationForLineIndexes, contentOfLinesWithAdjustedIndentation } from "./documentHelpers";

export function generateSnippet(editor: TextEditor): string {
	const document = editor.document;

	let texts: string[] = [];
	editor.selections.forEach(selection => {
		texts.push(generateCopyableText(document, selection));
	});

	const snippet = texts.join(endOfLineCharacter(document));

	return snippet;
}

export function generateCopyableText(document: TextDocument, selection: Selection) {
	const lineIndexes = lineIndexesForSelection(selection);

	// Remove last line's index if there's no selected text on that line
	if (lineIndexes.length > 1 && selection.end.character === 0) {
		lineIndexes.pop();
	}

	const minimumIndentation = minimumIndentationForLineIndexes(document, lineIndexes);
	const text = contentOfLinesWithAdjustedIndentation(document, lineIndexes, minimumIndentation);

	return text;
}
