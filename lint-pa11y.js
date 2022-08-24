const { execSync } = require('child_process');

/** Map of forbidden words and their match regex */
const words = {
  only: '\\s*only\\:',
};

let status = 0;
for (let word of Object.keys(words)) {
  const matchRegex = words[word];
  const gitCommand = `git diff --staged -G"${matchRegex}" --name-only`;
  const badFiles = execSync(gitCommand).toString();
  const filesAsArray = badFiles.split('\n');
  const jsFileRegex = /\.js$/;
  const onlyJsFiles = filesAsArray.filter(file =>
    jsFileRegex.test(file.trim()),
  );
  if (onlyJsFiles.length) {
    status = 1;
    console.log(
      `The following files contain a focused pa11y test with '${word}' in them:`,
    );
    console.log(onlyJsFiles.join('\n'));
  }
}
process.exit(status);
