# VS Code Repository Setup

DAWSON includes shared VS Code workspace settings and recommended extensions so engineers get the same base editor behavior.

- `.vscode/settings.json` configures the required editor behavior: two-space indentation, spaces instead of tabs, Prettier as the default formatter, format on save, ESLint fixes on save, LF line endings, final newlines, and trailing whitespace trimming. Also configures the Jest extension with virtual folders for the client unit, client integration, API unit, shared unit, and script unit test suites. These commands use the repository's local Jest binary from `node_modules`, so installing Jest globally is not required.
- `.vscode/extensions.json` lists the expected VS Code extensions using VS Code's workspace recommendations format.

The formatter is the repo's Prettier configuration in `.prettierrc.js`: VS Code is configured to require that file before formatting.

## Quick Setup

### macOS

First, add the `code` CLI to your PATH so terminal commands can invoke VS Code:

1. Press `Command + Shift + P` to open the Command Palette
2. Search and select **Shell Command: Install 'code' command in PATH**

Then run the following in your terminal:

```bash
cat .vscode/extensions.json | jq -r '.recommendations[]' | xargs -n 1 code --install-extension

npm ci
```

Then press `Command + Shift + P`, search for `Developer: Reload Window`, and select it so the workspace TypeScript SDK and extensions reload cleanly.

### Windows

Install the recommended workspace extensions manually:

1. Open the repository in VS Code.
2. Select the Extensions icon in the Activity Bar.
3. Search for `@recommended`.
4. Install each extension listed under **Workspace Recommendations**.

Install dependencies from the repository root:

1. Open the VS Code terminal with **Terminal > New Terminal**.
2. Run `npm ci`.

Then press `Ctrl + Shift + P`, search for `Developer: Reload Window`, and select it so the workspace TypeScript SDK and extensions reload cleanly.
