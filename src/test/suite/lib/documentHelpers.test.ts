import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';

import { minimumIndentationForLineIndexes, contentOfLinesWithAdjustedIndentation } from '../../../lib/documentHelpers';

const fixturesPath = '/../../../../src/test/fixtures/';
const uri = vscode.Uri.file(
	path.join(__dirname + fixturesPath + 'javascript-example.js')
);

describe('Document Helpers', function () {
	context('minimumIndentationLevelForLineIndexes', async () => {
		let document: vscode.TextDocument;

		before(async () => {
			document = await vscode.workspace.openTextDocument(uri);
		});

		it('calculates the correct minimum indentation level for a single line', () => {
			assert.equal(4, minimumIndentationForLineIndexes(document, [2]));
		});

		it('calculates the correct minimum indentation level for multiple lines', () => {
			assert.equal(2, minimumIndentationForLineIndexes(document, [1, 2, 3]));
		});
	});

	context('contentOfLinesWithAdjustedIndentation', async () => {
		let document: vscode.TextDocument;

		before(async () => {
			document = await vscode.workspace.openTextDocument(uri);
		});

		it('returns multiline text with the indentation adjusted correctly', () => {
			assert.equal('if (aValue) {\n  console.log(`Doing something with ${aValue}!`);\n}', contentOfLinesWithAdjustedIndentation(document, [1, 2, 3], 2));
		});

		it('returns single line text with the indentation adjusted correctly', () => {
			assert.equal('console.log(`Doing something with ${aValue}!`);', contentOfLinesWithAdjustedIndentation(document, [2], 4));
		});

		it('returns text with CRLF characters if file is using them', async () => {
			const uri = vscode.Uri.file(
				path.join(__dirname + fixturesPath + 'crlf-ruby-example.rb')
			);
			let crlfDocument = await vscode.workspace.openTextDocument(uri);

			assert.equal('def polish\r\n  puts "Polishing"\r\nend', contentOfLinesWithAdjustedIndentation(crlfDocument, [1, 2, 3], 2));
		});
	});
});
