import { TextDocument, Selection } from "vscode";
import { calculateSelectionLineIndexes, calculateMinimumIndentationInSelection, adjustIndentationInSelection } from "./selectionHelpers";

export function generateCopyableText(document: TextDocument, selection: Selection) {
	const lineIndexes = calculateSelectionLineIndexes(selection);

	if (lineIndexes.length > 1 && selection.end.character === 0) {
		lineIndexes.pop();
	}

	const minimumIndentation = calculateMinimumIndentationInSelection(document, lineIndexes);
	const text = adjustIndentationInSelection(document, lineIndexes, minimumIndentation);

	return text;
}
