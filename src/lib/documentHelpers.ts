import { EndOfLine, Range, TextDocument, TextLine } from "vscode";

export function linesForIndexes(document: TextDocument, lineIndexes: number[]): TextLine[] {
	return lineIndexes.map((lineIndex) => {
		return document.lineAt(lineIndex);
	});
}

export function minimumIndentationForLineIndexes(document: TextDocument, lineIndexes: number[]): number {
	const indentationLevels = lineIndexes.map((lineIndex) => {
		return document.lineAt(lineIndex).firstNonWhitespaceCharacterIndex;
	});

	const minimumIndentationLevelInSelection = Math.min(...indentationLevels);
	return minimumIndentationLevelInSelection;
}

export function contentOfLinesWithAdjustedIndentation(document: TextDocument, lineIndexes: number[], minimumIndentation: number): string {
	const lines = linesForIndexes(document, lineIndexes);
	const contentOfLinesWithAdjustedIndentation = lines.map((line) => {
		const adjustedRange = adjustedRangeWithMinimumIndentation(line.range, minimumIndentation);
		return document.getText(adjustedRange);
	});

	const eolCharacter = endOfLineCharacter(document);
	return contentOfLinesWithAdjustedIndentation.join(eolCharacter);
}

export function adjustedRangeWithMinimumIndentation(range: Range, minimumIndentation: number): Range {
	if (range.start.character !== 0) {
		console.warn('Adjusting range: Range does not start at character 0, this is not expected.');
	}

	const adjustedRange = new Range(range.start.line, range.start.character + minimumIndentation, range.end.line, range.end.character);
	return adjustedRange;
}

export function endOfLineCharacter(document: TextDocument): string {
	return document.eol === EndOfLine.CRLF ? '\r\n' : '\n';
}
