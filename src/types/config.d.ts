import { WorkspaceConfiguration } from "vscode";

export type MarkdownCodeBlockFlavor = 'plain' | 'includeLanguageIdentifier';

export type ExtensionConfig = WorkspaceConfiguration & {
	markdownCodeBlock: {
		flavor: MarkdownCodeBlockFlavor | 'prompt'
	};
	addLanguageIdentifierToMarkdownBlock?: boolean;
};
