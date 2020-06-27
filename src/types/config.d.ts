import { WorkspaceConfiguration } from "vscode";

export type IncludeLanguageIdentifier = 'always' | 'never';

export type ExtensionConfig = WorkspaceConfiguration & {
	markdownCodeBlock: {
		includeLanguageIdentifier: IncludeLanguageIdentifier | 'prompt'
	};
	addLanguageIdentifierToMarkdownBlock?: boolean;
	convertTabsToSpaces: {
		enabled: boolean;
		tabSize: number;
	}
};
