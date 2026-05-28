# VS Code Repository Setup

DAWSON includes shared VS Code workspace settings and recommended extensions so engineers get the same base editor behavior.

- `.vscode/settings.json` configures the required editor behavior: two-space indentation, spaces instead of tabs, Prettier as the default formatter, format on save, ESLint fixes on save, LF line endings, final newlines, and trailing whitespace trimming.
- `.vscode/extensions.json` lists the expected VS Code extensions using VS Code's workspace recommendations format.

The formatter is the repo's Prettier configuration in `.prettierrc.js`: VS Code is configured to require that file before formatting.

## Quick Setup

First, add the `code` CLI to your PATH so terminal commands can invoke VS Code:

1. Press `Command + Shift + P` to open the Command Palette
2. Select **Shell Command: Install 'code' command in PATH**

Then run the following in your terminal:

```bash
# install recommended workspace extensions
cat .vscode/extensions.json | jq -r '.recommendations[]' | xargs -n 1 code --install-extension

# ensure node modules and husky hooks are installed
npm ci
```

After installing dependencies, run `Developer: Reload Window` in VS Code so the workspace TypeScript SDK and extensions reload cleanly.
