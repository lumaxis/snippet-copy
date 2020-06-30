<p align="center">
  <img
    width="100"
    src="https://raw.githubusercontent.com/lumaxis/snippet-copy/main/images/icon.png"
    alt="Snippet Copy"
  />
	<h1 align="center">Snippet Copy</h1>
</p>

Ever wanted to copy part of a source file as a snippet and paste it somewhere else, like in Slack or in a GitHub comment?

Previously, you either got a bunch of unnecessary indentation that made the snippet ugly to read or you had to manually un-tab the snippet, copy, and then reset the indentation.
With **Snippet Copy** you can automatically get a snippet added to your clipboard with all the leading indentation already removed!

## Features

All features can be used via different ways in VS Code

- ⌨️ The **Command Palette** and the pre-configured **Keyboard Shortcuts**

	![Command in Command Palette](https://github.com/lumaxis/snippet-copy/raw/main/images/command-palette-light.png)

- 📝 The **Context Menu** on selected text in the editor

	![Command in Context Menu](https://github.com/lumaxis/snippet-copy/raw/main/images/context-menu-light.png)

### Copy Snippet

Simply get a copy of your currently selected code or text snippet added to your clipboard – without any leading indentation that you would otherwise need to remove manually.

### Copy Snippet as Markdown Code Block

Copies the currently selected snippet without leading indentation and automatically wraps it in a [fenced Markdown code block](https://help.github.com/en/github/writing-on-github/creating-and-highlighting-code-blocks).  
The code block can automatically include the language identifier for automatic syntax highlighting on some websites or tools. See below for details.

## Options

### Include Language Identifier

The "Copy Snippet as Markdown Code Block" command can optionally include the current VS Code document's language identifier in the Markdown code block. Including a language identifier enables [syntax highlighting](https://help.github.com/en/github/writing-on-github/creating-and-highlighting-code-blocks#syntax-highlighting) in some places (like in Issue or Pull Request comments on GitHub) but is incompatible with other tools, such as Slack.

This behavior can be controlled through a configuration setting:

```json
"snippet-copy.markdownCodeBlock.includeLanguageIdentifier": "prompt" // Default is to always prompt on use
```

Possible options are:

| Option    | Description                                                                              |
| --------- | ---------------------------------------------------------------------------------------- |
| `"prompt"`  | Default. Prompts you whenever the "Copy Snippet as Markdown Code Block" command is used. |
| `"always"`  | Always include the document's language identifier in the Markdown code block.            |
| `"never"`   | Never include the language identifer.                                                    |

### Convert Tabs to Spaces

Many tools or websites often render tabs very widely or generally in a weird way and make therefore them not very pleasant to look at. Snippet Copy therefore by default automatically converts a tab character to two spaces.

This can be adjusted in settings:

```json
"snippet-copy.convertTabsToSpaces": {
    "enabled": true,
    "tabSize": 2
}
```

| Setting     | Description                                                        |
| ----------- | ------------------------------------------------------------------ |
| `"enabled"` | `true` by default. Whether to convert tabs to spaces.              |
| `"tabSize"` | `2` is the default. How many spaces to convert a tab character to. |

---

With an icon lovingly crafted by [@dipree](https://github.com/dipree) 🌺
