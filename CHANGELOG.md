# Change Log

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
