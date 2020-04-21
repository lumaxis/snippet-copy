import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';

import { generateCopyableText } from '../../../lib/textHelpers';
// import * as myExtension from '../extension';

const fixturesPath = '/../../../../src/test/fixtures/';
const uri = vscode.Uri.file(
	path.join(__dirname + fixturesPath + 'javascript-example.js')
);

describe('Text Helpers', () => {
	let document: vscode.TextDocument;

	before(async () => {
		document = await vscode.workspace.openTextDocument(uri);
	});

	context('generateCopyableText', () => {
		it('generates the correct text', () => {
			assert.deepEqual('if (aValue) {\n  console.log(`Doing something with ${aValue}!`);\n}', generateCopyableText(document, new vscode.Selection(1, 2, 3, 3)));
		});

		it('generates the correct text when the cursor is on a newline', () => {
			assert.deepEqual('if (aValue) {\n  console.log(`Doing something with ${aValue}!`);\n}', generateCopyableText(document, new vscode.Selection(1, 2, 4, 0)));
		});
	});
});
