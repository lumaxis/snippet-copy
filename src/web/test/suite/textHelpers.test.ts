import * as assert from 'assert';
import * as td from 'testdouble';
import * as vscode from 'vscode';
import { Position, Selection, TextDocument } from 'vscode';
import { generateCopyableText, generateSnippet, includeLanguageIdentifier, isMarkdownCodeBlockFlavor, replaceLeadingTabsWithSpaces, wrapTextInMarkdownCodeBlock } from '../../../lib/textHelpers';
import { ExtensionConfig } from '../../../types/config';

const fixtureUri = (fileName: string) => {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	if (!workspaceFolder) { throw new Error('No workspace folder found'); }

	return vscode.Uri.joinPath(workspaceFolder.uri, fileName);
};

interface TestSelection {
	selection: Selection;
	expectedResult: string;
}

describe('Text Helpers', () => {
	const javaScriptTestSelection1: TestSelection = {
		expectedResult: 'if (aValue) {\n  console.log(`Doing something with ${aValue}!`);\n}',
		selection: new Selection(2, 4, 4, 5)
	};
	const javaScriptTestSelection2: TestSelection = {
		expectedResult: 'doSomethingElse() {\n  throw new Error(\'Nope!\');\n}',
		selection: new Selection(7, 2, 9, 3)
	};
	const javaScriptTestSelection3: TestSelection = {
		expectedResult: '}\n\ndoSomethingElse() {',
		selection: new Selection(5, 0, 7, 21)
	};
	const pythonTestSelection1: TestSelection = {
		expectedResult: 'def fizzBuzz\n  logging.info("	FizzBuzz")',
		selection: new Selection(2, 1, 3, 27)
	};
	let document1: TextDocument;
	let document2: TextDocument;

	before(async () => {
		document1 = await vscode.workspace.openTextDocument(fixtureUri('javascript-example.js'));
		document2 = await vscode.workspace.openTextDocument(fixtureUri('tabs-python-example.py'));
	});

	context('generateSnippet', () => {
		it('generates the correct snippet for a single selection', async () => {
			assert.deepStrictEqual(javaScriptTestSelection1.expectedResult, await generateSnippet(document1, [javaScriptTestSelection1.selection]));
		});

		it('generates the correct snippet for multiple selections', async () => {
			assert.deepStrictEqual(javaScriptTestSelection1.expectedResult + '\n' + javaScriptTestSelection2.expectedResult,
				await generateSnippet(document1, [javaScriptTestSelection1.selection, javaScriptTestSelection2.selection])
			);
		});

		it('generates the correct snippet for multiple selections where one ends on the beginning of a newline', async () => {
			assert.deepStrictEqual(javaScriptTestSelection1.expectedResult + '\n' + javaScriptTestSelection2.expectedResult,
				await generateSnippet(document1, [
					new Selection(javaScriptTestSelection1.selection.start, new Position(5, 0)),
					javaScriptTestSelection2.selection
				])
			);
		});
	});

	context('generateCopyableText', () => {
		it('generates the correct text', () => {
			const config: unknown = td.object({ convertTabsToSpaces: { enabled: false, tabSize: 2 } });

			assert.deepStrictEqual(generateCopyableText(document1, javaScriptTestSelection1.selection, config as ExtensionConfig),
				javaScriptTestSelection1.expectedResult);
		});

		it('generates the correct text when the cursor is on a newline', () => {
			const config: unknown = td.object({ convertTabsToSpaces: { enabled: false, tabSize: 2 } });

			assert.deepStrictEqual(generateCopyableText(document1, new Selection(javaScriptTestSelection1.selection.start, new Position(5, 0)), config as ExtensionConfig),
				javaScriptTestSelection1.expectedResult
			);
		});

		it('generates the correct text when selection contains empty line', () => {
			const config: unknown = td.object({ convertTabsToSpaces: { enabled: false, tabSize: 2 } });

			assert.deepStrictEqual(generateCopyableText(document1, javaScriptTestSelection3.selection, config as ExtensionConfig),
				javaScriptTestSelection3.expectedResult
			);
		});

		it('generates the correct text when selection contains tabs and replacement is enabled', () => {
			const config: unknown = td.object({ convertTabsToSpaces: { enabled: true, tabSize: 2 } });

			assert.deepStrictEqual(generateCopyableText(document2, pythonTestSelection1.selection, config as ExtensionConfig),
				pythonTestSelection1.expectedResult
			);
		});
	});

	context('wrapTextInMarkdownCodeBlock', () => {
		it('returns the text wrapped in a Markdown code block', () => {
			const codeSnippet = 'console.log("Yo");';
			assert.strictEqual(wrapTextInMarkdownCodeBlock(document1, codeSnippet), '```\n' + codeSnippet + '\n```');
		});

		it('returns the wrapped text with a language identifier', () => {
			const codeSnippet = 'console.log("Yo");';
			assert.strictEqual(wrapTextInMarkdownCodeBlock(document1, codeSnippet, true), '```javascript\n' + codeSnippet + '\n```');
		});
	});

	context('includeLanguageIdentifier', () => {
		it('returns true if setting is "includeLanguageIdentifier"', async () => {
			const config: unknown = td.object({ markdownCodeBlock: { includeLanguageIdentifier: 'always' } });

			assert.strictEqual(await includeLanguageIdentifier(config as ExtensionConfig), true);
		});

		it('returns false if setting is "plain"', async () => {
			const config: unknown = td.object({ markdownCodeBlock: { includeLanguageIdentifier: 'never' } });

			assert.strictEqual(await includeLanguageIdentifier(config as ExtensionConfig), false);
		});

		it('returns false if setting is true', async () => {
			const config: unknown = td.object({ markdownCodeBlock: { includeLanguageIdentifier: true } });

			assert.strictEqual(await includeLanguageIdentifier(config as ExtensionConfig), false);
		});
	});

	context('replaceLeadingTabsWithSpaces', () => {
		it('returns the correct text with the default tabSize', () => {
			assert.strictEqual(replaceLeadingTabsWithSpaces('	'), '  ');
		});

		it('returns the correct text with the custom tabSize', () => {
			assert.strictEqual(replaceLeadingTabsWithSpaces('	', 3), '   ');
		});

		it('correctly replaces in a multiline string but does not replace tabs in the middle of the string', () => {
			assert.strictEqual(replaceLeadingTabsWithSpaces(`	console.log("	Hello")
		console.log("World")`), `  console.log("	Hello")
    console.log("World")`);
		});
	});

	context('isMarkdownCodeBlockFlavor', () => {
		it('returns true if value is "never"', () => {
			assert.strictEqual(isMarkdownCodeBlockFlavor('never'), true);
		});

		it('returns true if value is "always"', () => {
			assert.strictEqual(isMarkdownCodeBlockFlavor('always'), true);
		});

		it('returns false if value is any other string', () => {
			assert.strictEqual(isMarkdownCodeBlockFlavor('prompt'), false);
		});

		it('returns false if value is undefined', () => {
			assert.strictEqual(isMarkdownCodeBlockFlavor(undefined), false);
		});

	});
});
