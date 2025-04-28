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
  try {
    if (!fs.existsSync(inputFilePath)) {
      throw new Error(`Input file does not exist: ${inputFilePath}`);
    }

    const readStream = fs.createReadStream(inputFilePath, {
      encoding: 'utf-8',
    });
    const writeStream = fs.createWriteStream(outputFilePath, {
      encoding: 'utf-8',
    });

    const rl = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity,
    });
    let emailCount = 0;
    for await (const line of rl) {
      const sanitizedLine = line.replace(emailRegex, email => {
        emailCount++;
        return sanitizeEmail(email);
      });
      writeStream.write(sanitizedLine + '\n');
    }

    writeStream.end();

    console.log(`Found and anonymized ${emailCount} email addresses.`);
  } catch (error: any) {
    console.error('Error:', error?.message);
    process.exit(1);
  }
}
