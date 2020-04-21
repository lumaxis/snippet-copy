import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';

import { calculateSelectionLineIndexes, calculateMinimumIndentationInSelection, adjustIndentationInSelection } from '../../../lib/selectionHelpers';
// import * as myExtension from '../extension';

const fixturesPath = '/../../../../src/test/fixtures/';
const uri = vscode.Uri.file(
	path.join(__dirname + fixturesPath + 'javascript-example.js')
);

describe('Selection Helpers', function () {
	context('calculateSelectionLineIndexes', () => {
		it('calculates the correct line indexes from an empty selection', () => {
			assert.deepEqual([0], calculateSelectionLineIndexes(new vscode.Selection(0, 0, 0, 0)));
		});

		it('calculates the correct line indexes from a single line selection', () => {
			assert.deepEqual([1], calculateSelectionLineIndexes(new vscode.Selection(1, 2, 1, 15)));
		});

		it('calculates the correct line indexes from a multiline selection', () => {
			assert.deepEqual([1, 2, 3], calculateSelectionLineIndexes(new vscode.Selection(1, 2, 3, 3)));
		});

		it('calculates the correct line indexes from an reversed selection ', () => {
			assert.deepEqual([1, 2, 3], calculateSelectionLineIndexes(new vscode.Selection(3, 0, 1, 0)));
		});
	});

	context('calculateMinimumIndentationInSelection', async () => {
		let document: vscode.TextDocument;

		before(async () => {
			document = await vscode.workspace.openTextDocument(uri);
		});

		it('calculates the correct minimum indentation level for a single line', () => {
			assert.equal(4, calculateMinimumIndentationInSelection(document, [2]));
		});

		it('calculates the correct minimum indentation level for multiple lines', () => {
			assert.equal(2, calculateMinimumIndentationInSelection(document, [1, 2, 3]));
		});
	});

	context('adjustIndentationInSelection', async () => {
		let document: vscode.TextDocument;

		before(async () => {
			document = await vscode.workspace.openTextDocument(uri);
		});

		it('returns multiline text with the indentation adjusted correctly', () => {
			assert.equal('if (aValue) {\n  console.log(`Doing something with ${aValue}!`);\n}', adjustIndentationInSelection(document, [1, 2, 3], 2));
		});

		it('returns single line text with the indentation adjusted correctly', () => {
			assert.equal('console.log(`Doing something with ${aValue}!`);', adjustIndentationInSelection(document, [2], 4));
		});

		it('returns text with CRLF characters if file is using them', async () => {
			const uri = vscode.Uri.file(
				path.join(__dirname + fixturesPath + 'crlf-ruby-example.rb')
			);
			let crlfDocument = await vscode.workspace.openTextDocument(uri);

			assert.equal('def polish\n\r  puts "Polishing"\n\rend', adjustIndentationInSelection(crlfDocument, [1, 2, 3], 2));
		});
	});
});
