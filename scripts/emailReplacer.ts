import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

/**
 * Creates an anonymized email address by hashing the original email
 * @param email The original email address
 * @param domain The domain to use for the anonymized email
 * @returns An anonymized email address
 */
function mockEmail(email: string, domain: string): string {
  const hash = crypto.createHash('md5').update(email).digest('hex');
  return `${hash}@${domain}`;
}

/**
 * Replace all email addresses in a text file with anonymized versions
 * @param inputFilePath Path to input file
 * @param outputFilePath Path to output file (optional - defaults to input file with "-sanitized" suffix)
 * @param domain Domain to use for anonymized emails (defaults to 'mig.ef-cms.ustaxcourt.gov')
 */
export function replaceEmailAddresses(
  inputFilePath: string,
  outputFilePath?: string,
  domain: string = 'mig.ef-cms.ustaxcourt.gov',
): void {
  try {
    if (!fs.existsSync(inputFilePath)) {
      throw new Error(`Input file does not exist: ${inputFilePath}`);
    }

    const fileContent = fs.readFileSync(inputFilePath, 'utf8');

    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;

    let emailCount = 0;
    const sanitizedContent = fileContent.replace(emailRegex, match => {
      emailCount++;
      return mockEmail(match, domain);
    });

    const finalOutputPath =
      outputFilePath ||
      (() => {
        const parsedPath = path.parse(inputFilePath);
        return path.join(
          parsedPath.dir,
          `${parsedPath.name}-sanitized${parsedPath.ext}`,
        );
      })();

    fs.writeFileSync(finalOutputPath, sanitizedContent);

    console.log(
      `Email addresses anonymized. Sanitized file saved to: ${finalOutputPath}`,
    );
    console.log(`Found and anonymized ${emailCount} email addresses.`);
  } catch (error: any) {
    console.error('Error:', error?.message);
    process.exit(1);
  }
}
