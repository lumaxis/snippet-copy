import * as assert from 'assert';
import * as vscode from 'vscode';
import { Range, TextDocument } from 'vscode';
import { adjustedRangeWithMinimumIndentation, contentOfLinesWithAdjustedIndentation, endOfLineCharacter, linesForIndexes, minimumIndentationForLineIndexes } from '../../../lib/documentHelpers';

const fixtureUri = (fileName: string) => {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	if (!workspaceFolder) { throw new Error('No workspace folder found'); }

	return vscode.Uri.joinPath(workspaceFolder.uri, fileName);
};

describe('Document Helpers', function () {
	let document: TextDocument;

	before(async () => {
		const uri = fixtureUri('javascript-example.js');
		document = await vscode.workspace.openTextDocument(uri);
	});

	context('linesForIndexes', () => {
		it('returns the correct lines', () => {
			const lines = linesForIndexes(document, [0, 1]);
			assert.strictEqual(lines.length, 2);
			assert.strictEqual(lines[0].lineNumber, 0);
			assert.strictEqual(lines[0].text, 'class MyThing {');
			assert.strictEqual(lines[1].lineNumber, 1);
			assert.strictEqual(lines[1].text, '  doSomething(aValue) {');
		});
	});

	context('minimumIndentationLevelForLineIndexes', () => {
		it('calculates the correct minimum indentation level for a single line', () => {
			assert.strictEqual(minimumIndentationForLineIndexes(document, [3]), 6);
		});

		it('calculates the correct minimum indentation level for multiple lines', () => {
			assert.strictEqual(minimumIndentationForLineIndexes(document, [1, 2, 3]), 2);
		});

		it('calculates the correct minimum indentation level when lines contain an empty line', () => {
			assert.strictEqual(minimumIndentationForLineIndexes(document, [11, 12, 13, 14]), 4);
		});
	});

	context('contentOfLinesWithAdjustedIndentation', () => {
		it('returns multiline text with the indentation adjusted correctly', () => {
			assert.strictEqual(contentOfLinesWithAdjustedIndentation(document, [2, 3, 4], 4), 'if (aValue) {\n  console.log(`Doing something with ${aValue}!`);\n}');
		});

		it('returns single line text with the indentation adjusted correctly', () => {
			assert.strictEqual(contentOfLinesWithAdjustedIndentation(document, [3], 6), 'console.log(`Doing something with ${aValue}!`);');
		});

		it('returns text with CRLF characters if file is using them', async () => {
			const crlfDocument = await vscode.workspace.openTextDocument(fixtureUri('crlf-ruby-example.rb'));

			assert.strictEqual(contentOfLinesWithAdjustedIndentation(crlfDocument, [1, 2, 3], 2), 'def polish\r\n  puts "Polishing"\r\nend');
		});
	});

	context('adjustedRangeWithMinimumIndentation', () => {
		it('adjusts the range', () => {
			const adjustedRange = adjustedRangeWithMinimumIndentation(new Range(2, 0, 2, 17), 4);
			assert.strictEqual(adjustedRange.start.line, 2);
			assert.strictEqual(adjustedRange.start.character, 4);
			assert.strictEqual(adjustedRange.end.line, 2);
			assert.strictEqual(adjustedRange.end.character, 17);
		});
	});

	context('endOfLineCharacter', () => {
		it('correctly returns LF', () => {
			assert.strictEqual(endOfLineCharacter(document), '\n');
		});

		it('correctly returns CRLF', async () => {
			assert.strictEqual(endOfLineCharacter(await vscode.workspace.openTextDocument(fixtureUri('crlf-ruby-example.rb'))), '\r\n');
		});
	});
});
