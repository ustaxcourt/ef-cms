exports.handler = () => {
  //TODO: Do something when this script execution exits with code 0 (approve circle CI workflow)
  const { exec } = require('child_process');
  exec('sh ./wait-for-reindex-to-finish.sh', (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
      console.log(`exec error: ${error}`);
    }
  });
};
