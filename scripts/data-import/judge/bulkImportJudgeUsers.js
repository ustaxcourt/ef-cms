const { init } = require('./bulkImportJudgeUsers.helpers');

if (!process.env.ENV) {
  process.env.ENV = process.argv[1];
}

const main = async () => {
  const file = process.argv[2];
  if (file) {
    const outputMap = {};
    await init(file, outputMap);
    console.log('Judges Map: ', outputMap);
  }
};

main();
