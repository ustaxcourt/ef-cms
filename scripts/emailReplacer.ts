import * as crypto from 'crypto';
import * as fs from 'fs';
import * as readline from 'readline';

const DOMAIN_REPLACER = 'mig.ef-cms.ustaxcourt.gov';
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

export function sanitizeEmail(email: string) {
  const hash = crypto.createHash('md5').update(email).digest('hex');
  return `${hash}@${DOMAIN_REPLACER}`;
}

export async function sanitizeDumpFile(
  inputFilePath: string,
  outputFilePath: string,
) {
  const readStream = fs.createReadStream(inputFilePath, { encoding: 'utf-8' });
  const writeStream = fs.createWriteStream(outputFilePath, {
    encoding: 'utf-8',
  });

  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const sanitizedLine = line.replace(emailRegex, email => {
      return sanitizeEmail(email);
    });
    writeStream.write(sanitizedLine + '\n');
  }

  writeStream.end();
}
