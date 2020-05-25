import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';
import { Position, Selection, TextDocument } from 'vscode';
import { generateCopyableText, generateSnippet, wrapTextInMarkdownCodeBlock } from '../../../lib/textHelpers';

const fixturesPath = '/../../../../src/test/fixtures/';
const uri = vscode.Uri.file(
	path.join(__dirname + fixturesPath + 'javascript-example.js')
);

interface TestSelection {
	selection: Selection;
	content: string;
}

describe('Text Helpers', () => {
	const testSelection1: TestSelection = {
		content: 'if (aValue) {\n  console.log(`Doing something with ${aValue}!`);\n}',
		selection: new Selection(2, 4, 4, 5)
	};
	const testSelection2: TestSelection = {
		content: 'doSomethingElse() {\n  throw new Error(\'Nope!\');\n}',
		selection: new Selection(7, 2, 9, 3)
	};
	const testSelection3: TestSelection = {
		content: '}\n\ndoSomethingElse() {',
		selection: new Selection(5, 0, 7, 21)
	};
	let document: TextDocument;

	before(async () => {
		document = await vscode.workspace.openTextDocument(uri);
	});

	context('generateSnippet', () => {
		it('generates the correct snippet for a single selection', () => {
			assert.deepEqual(testSelection1.content, generateSnippet(document, [testSelection1.selection]));
		});

		it('generates the correct snippet for multiple selections', () => {
			assert.deepEqual(testSelection1.content + '\n' + testSelection2.content,
				generateSnippet(document, [testSelection1.selection, testSelection2.selection])
			);
		});

		it('generates the correct snippet for multiple selections where one ends on the beginning of a newline', () => {
			assert.deepEqual(testSelection1.content + '\n' + testSelection2.content,
				generateSnippet(document, [
					new Selection(testSelection1.selection.start, new Position(5, 0)),
					testSelection2.selection
				])
			);
		});
	});

	context('generateCopyableText', () => {
		it('generates the correct text', () => {
			assert.deepEqual(testSelection1.content, generateCopyableText(document, testSelection1.selection));
		});

		it('generates the correct text when the cursor is on a newline', () => {
			assert.deepEqual(testSelection1.content,
				generateCopyableText(document, new Selection(testSelection1.selection.start, new Position(5, 0)))
			);
		});

		it('generates the correct text when selection contains empty line', () => {
			assert.deepEqual(testSelection3.content,
				generateCopyableText(document, testSelection3.selection)
			);
		});

		context('wrapTextInMarkdownCodeBlock', () => {
			it('returns the text wrapped in a Markdown code block', () => {
				const codeSnippet = 'console.log("Yo");';
				assert.equal(wrapTextInMarkdownCodeBlock(document, codeSnippet), '```\n' + codeSnippet + '\n```');
			});

			it('returns the wrapped text with a language identifier', () => {
				const codeSnippet = 'console.log("Yo");';
				assert.equal(wrapTextInMarkdownCodeBlock(document, codeSnippet, true), '```javascript\n' + codeSnippet + '\n```');
			});
		});
	});
});
