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

	![Command in Command Palette](https://github.com/lumaxis/snippet-copy/raw/main/images/command-palette.png)

- 📝 The **Context Menu** on selected text in the editor

	![Command in Context Menu](https://github.com/lumaxis/snippet-copy/raw/main/images/context-menu.png)

### Copy Snippet

Simply get a copy of your currently selected code or text snippet added to your clipboard – without any leading indentation that you would otherwise need to remove manually.

### Copy Snippet as Markdown Code Block

This command has an additional configuration option that let's you determine if the Markdown code block should contain the file's language identifier which enables [syntax highlighting](https://help.github.com/en/github/writing-on-github/creating-and-highlighting-code-blocks#syntax-highlighting) in some places:

```json
"snippet-copy.addLanguageIdToMarkdownBlock": false // Default is false
```

---

With an icon lovingly crafted by [@dipree](https://github.com/dipree) 🌺
