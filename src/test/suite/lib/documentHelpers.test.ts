import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';
import { Range, TextDocument } from 'vscode';
import { adjustedRangeWithMinimumIndentation, contentOfLinesWithAdjustedIndentation, endOfLineCharacter, linesForIndexes, minimumIndentationForLineIndexes } from '../../../lib/documentHelpers';


const fixturesPath = '/../../../../src/test/fixtures/';
const uri = vscode.Uri.file(
	path.join(__dirname + fixturesPath + 'javascript-example.js')
);

describe('Document Helpers', function () {
	let document: TextDocument;

	before(async () => {
		document = await vscode.workspace.openTextDocument(uri);
	});

	context('linesForIndexes', () => {
		it('returns the correct lines', () => {
			const lines = linesForIndexes(document, [0, 1]);
			assert.equal(lines.length, 2);
			assert.equal(lines[0].lineNumber, 0);
			assert.equal(lines[0].text, 'class MyThing {');
			assert.equal(lines[1].lineNumber, 1);
			assert.equal(lines[1].text, '  doSomething(aValue) {');
		});
	});

	context('minimumIndentationLevelForLineIndexes', async () => {
		it('calculates the correct minimum indentation level for a single line', () => {
			assert.equal(minimumIndentationForLineIndexes(document, [3]), 6);
		});

		it('calculates the correct minimum indentation level for multiple lines', () => {
			assert.equal(minimumIndentationForLineIndexes(document, [1, 2, 3]), 2);
		});

		it('calculates the correct minimum indentation level when lines contain an empty line', () => {
			assert.equal(minimumIndentationForLineIndexes(document, [11, 12, 13, 14]), 4);
		});
	});

	context('contentOfLinesWithAdjustedIndentation', async () => {
		it('returns multiline text with the indentation adjusted correctly', () => {
			assert.equal(contentOfLinesWithAdjustedIndentation(document, [2, 3, 4], 4), 'if (aValue) {\n  console.log(`Doing something with ${aValue}!`);\n}');
		});

		it('returns single line text with the indentation adjusted correctly', () => {
			assert.equal(contentOfLinesWithAdjustedIndentation(document, [3], 6), 'console.log(`Doing something with ${aValue}!`);');
		});

		it('returns text with CRLF characters if file is using them', async () => {
			const uri = vscode.Uri.file(
				path.join(__dirname + fixturesPath + 'crlf-ruby-example.rb')
			);
			let crlfDocument = await vscode.workspace.openTextDocument(uri);

			assert.equal(contentOfLinesWithAdjustedIndentation(crlfDocument, [1, 2, 3], 2), 'def polish\r\n  puts "Polishing"\r\nend');
		});
	});

	context('adjustedRangeWithMinimumIndentation', () => {
		it('adjusts the range', () => {
			const adjustedRange = adjustedRangeWithMinimumIndentation(new Range(2, 0, 2, 17), 4);
			assert.equal(adjustedRange.start.line, 2);
			assert.equal(adjustedRange.start.character, 4);
			assert.equal(adjustedRange.end.line, 2);
			assert.equal(adjustedRange.end.character, 17);
		});
	});

	context('endOfLineCharacter', () => {
		it('correctly returns LF', async () => {
			assert.equal(endOfLineCharacter(document), '\n');
		});

		it('correctly returns CRLF', async () => {
			const uri = vscode.Uri.file(
				path.join(__dirname + fixturesPath + 'crlf-ruby-example.rb')
			);
			assert.equal(endOfLineCharacter(await vscode.workspace.openTextDocument(uri)), '\r\n');
		});
	});
});
