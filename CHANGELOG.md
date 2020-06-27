# Change Log

## [Unreleased]

### Features

- Rename VS Code commands to be shorter and more concise.
    - `Copy Snippet Without Leading Indentation` is now `Copy Snippet`
    - `Copy Snippet Without Leading Indentation as Markdown Code Block` is now `Copy Snippet as Markdown Code Block`

## [0.2.3]

### Fixes

- Use absolute image links

## [0.2.2]

Quick update to rename the default branch to "main"

## [0.2.1]

### Fixes

- Ignore empty or whitespace-only lines when calculating minimum indentation of the snippet (#17)
- Fix banner color in VS Code Marketplace

### Chore

- Improve setup to keep third-party dependencies up-to-date
- Improve development setup by launching debug session without other extensions

## [0.2.0]

### Features

- The extension now has a shiny new icon! Thanks @dipree 🙌🏼
- Add additional command to copy snippet with surrounding Markdown code block syntax  
  The command is called `Copy Snippet Without Leading Indentation as Markdown Code Block` in the Command Palette and its default keyboard shortcut is `Win/Meta/Cmd+Ctrl+Shift+c`
- Add configuration option to add language identifier to Markdown code blocks  
  This option can be found under the identifier `snippet-copy.addLanguageIdentifierToMarkdownBlock` and its default is `false`.
- Add support for copying snippets from multiple selections

### Chores

- Increase automatic testing to improve stability
- Update third-party dependencies

## [0.1.1]

### Bugfixes

- Fix an issue with copied text when CRLF is used (#1)

## [0.1.0] - 2020-04-22

Initial release

### Features

- Copy text via keyboard shortcut
- Copy text via command palette
- Copy text via context menu
