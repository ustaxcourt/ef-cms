import { init } from './bulkImportJudgeUsers.helpers';

const main = async () => {
  const filePath = process.env.FILE_NAME;
  if (filePath) {
    await init(filePath);
  }
};

void main();
exports.main = main;
