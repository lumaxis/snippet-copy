import { Selection } from "vscode";

export function lineIndexesForSelection(selection: Selection): number[] {
	const numberOfLinesInSelection = 1 + (selection.end.line - selection.start.line);
	const lineIndexes = Array.from({ length: numberOfLinesInSelection }, (_, k) => k + selection.start.line);

	return lineIndexes;
}

