# VS Code Repository Setup

DAWSON includes shared VS Code workspace settings and a scriptable extension list so engineers get the same base editor behavior.

- `.vscode/settings.json` configures the required editor behavior: two-space indentation, spaces instead of tabs, Prettier as the default formatter, format on save, ESLint fixes on save, LF line endings, final newlines, and trailing whitespace trimming.
- `.vscode-extensions` lists the expected VS Code extensions in a plain format for scriptable installation.

The formatter is the repo's Prettier configuration in `.prettierrc.js`: VS Code is configured to require that file before formatting.

## Quick Setup

```bash
# install expected extensions from the list
cat .vscode-extensions | xargs -n 1 code --install-extension

# ensure node modules and husky hooks are installed
npm ci
```

After installing dependencies, run `Developer: Reload Window` in VS Code so the workspace TypeScript SDK and extensions reload cleanly.
