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
function replaceEmailAddresses(
  inputFilePath: string,
  outputFilePath?: string,
  domain: string = 'mig.ef-cms.ustaxcourt.gov',
): void {
  try {
    // Check if input file exists
    if (!fs.existsSync(inputFilePath)) {
      throw new Error(`Input file does not exist: ${inputFilePath}`);
    }

    // Read input file content
    const fileContent = fs.readFileSync(inputFilePath, 'utf8');

    // Regular expression to match email addresses
    // This regex follows RFC 5322 standard for email validation
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;

    // Replace all email addresses with anonymized versions
    const sanitizedContent = fileContent.replace(emailRegex, match => {
      return mockEmail(match, domain);
    });

    // Determine output file path if not provided
    const finalOutputPath =
      outputFilePath ||
      (() => {
        const parsedPath = path.parse(inputFilePath);
        return path.join(
          parsedPath.dir,
          `${parsedPath.name}-sanitized${parsedPath.ext}`,
        );
      })();

    // Write sanitized content to the output file
    fs.writeFileSync(finalOutputPath, sanitizedContent);

    console.log(
      `Email addresses anonymized. Sanitized file saved to: ${finalOutputPath}`,
    );
    console.log(
      `Found and anonymized ${(fileContent.match(emailRegex) || []).length} email addresses.`,
    );
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Check if this script is being run directly
if (require.main === module) {
  // Get command line arguments
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(
      'Usage: ts-node emailReplacer.ts <inputFile> [outputFile] [domain]',
    );
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1]; // Optional
  const domain = args[2] || 'mig.ef-cms.ustaxcourt.gov'; // Optional

  replaceEmailAddresses(inputFile, outputFile, domain);
}

// Export the functions for use as a module
export { replaceEmailAddresses, mockEmail };
