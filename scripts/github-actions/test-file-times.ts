import { testFileTimes } from './test-file-times.helpers';

if (require.main === module) {
  const args = process.argv.slice(2);
  testFileTimes(args);
}
