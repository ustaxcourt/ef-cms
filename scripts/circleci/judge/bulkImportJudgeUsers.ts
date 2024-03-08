import { init } from './bulkImportJudgeUsers.helpers';

const main = async () => {
  const file = process.env.FILE_NAME;
  if (file) {
    const outputMap = {};
    await init(file, outputMap);
    console.log('Judges Map: ', outputMap);
  }
};

void main();
exports.main = main;
