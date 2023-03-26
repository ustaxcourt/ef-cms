/* istanbul ignore file */

// This utility is used to create signed documents for visual inspection
// without the need to run the entire application.

// To directly run via node:
//   npm install -g  @babel/core @babel/node
//   npx babel-node shared/src/business/utilities/createSignedDocumentsForInspection.js

const fs = require('fs');
const path = require('path');
const {
  applicationContext: applicationContext,
} = require('../../../../web-client/src/applicationContext');
const {
  generateSignedDocumentInteractor,
} = require('../useCases/generateSignedDocumentInteractor');

// see this for reference: shared/src/business/utilities/documentGenerators.test.js

const main = async () => {
  const inputDocumentsFolder = path.resolve(__dirname, './unsignedPdfs');
  const signedDocumentsFolder = path.resolve(__dirname, './signedPdfs');

  const inputFiles = fs
    .readdirSync(inputDocumentsFolder)
    .filter(filename => path.extname(filename) === '.pdf')
    .map(filename => path.join(inputDocumentsFolder, filename));

  for (let inputFileName of inputFiles) {
    const pdfData = new Uint8Array(fs.readFileSync(inputFileName));
    const signedResult = await generateSignedDocumentInteractor(
      applicationContext,
      {
        pageIndex: 0,
        pdfData,
        posX: 0,
        posY: 0,
        sigTextData: {
          signatureName: '(Signed) Maurice B. Foley',
          signatureTitle: 'Chief Judge',
        },
      },
    );

    fs.writeFileSync(
      path.join(signedDocumentsFolder, path.basename(inputFileName)),
      signedResult,
    );
  }
  return inputFiles.length;
};

main().then(r => console.log(`Signed ${r} files`));
