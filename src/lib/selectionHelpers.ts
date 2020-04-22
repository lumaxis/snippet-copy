import { Selection, TextDocument, Range, EndOfLine } from "vscode";

export function calculateSelectionLineIndexes(selection: Selection): number[] {
	const selectionStart = selection.start;
	const selectionEnd = selection.end;

	const lineIndexes = Array.from({ length: 1 + (selectionEnd.line - selectionStart.line) }, (_, k) => k + selectionStart.line);

	return lineIndexes;
}

export function calculateMinimumIndentationInSelection(document: TextDocument, lineIndexes: number[]): number {
	const indentationLevels = lineIndexes.map((lineIndex) => {
		return document.lineAt(lineIndex).firstNonWhitespaceCharacterIndex;
	});

	const minimumIndentationLevelInSelection = Math.min(...indentationLevels);
	return minimumIndentationLevelInSelection;
}

export function adjustIndentationInSelection(document: TextDocument, lineIndexes: number[], minimumIndentation: number) {
	const endOfLineCharacter = document.eol === EndOfLine.CRLF ? '\r\n' : '\n';

	return lineIndexes.map((lineIndex) => {
		const line = document.lineAt(lineIndex);
		const range = line.range;
		const lineStart = range.start.character;
		const lineEnd = range.end.character;

		return document.getText(new Range(lineIndex, lineStart + minimumIndentation, lineIndex, lineEnd));
	}).join(endOfLineCharacter);
}
