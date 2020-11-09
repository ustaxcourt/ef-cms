// connect to S3 documents bucket
// get all the documents in S3
// for each document
//   scrapePdfContents
//   save the text content to S3 with a documentContentsId as the file name
//   how do we know what docket entry that document belongs to?
//   add documentContentsId to the docket entry (this will trigger update in ES)

const AWS = require('aws-sdk');
const { isEmpty } = require('lodash');
const { v4: uuidv4 } = require('uuid');

const check = (value, message) => {
  if (!value) {
    console.log(message);
    process.exit(1);
  }
};

const { EFCMS_DOMAIN, ENV, REGION } = process.env;

check(EFCMS_DOMAIN, 'You must have EFCMS_DOMAIN set in your environment');
check(REGION, 'You must have REGION set in your environment');
check(ENV, 'You must have ENV set in your environment');

const BUCKET_NAME = `${EFCMS_DOMAIN}-documents-${ENV}-${REGION}`;

const run = async () => {
  const storageClient = new AWS.S3({
    endpoint: 's3.us-east-1.amazonaws.com',
    region: 'us-east-1',
    s3ForcePathStyle: true,
  });

  const { Contents, IsTruncated } = await storageClient
    .listObjectsV2({
      Bucket: BUCKET_NAME,
      MaxKeys: 1,
    })
    .promise();

  console.log('contents', JSON.stringify(Contents, null, 2));

  const getPdfJs = async () => {
    const pdfjsLib = require('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

    return pdfjsLib;
  };

  let pdfjsLib;

  pdfjsLib = await getPdfJs();

  // for (const documentData of Contents) {
  //   const { Body: pdfBuffer } = await storageClient
  //     .getObject({
  //       Bucket: BUCKET_NAME,
  //       Key: documentData.Key,
  //     })
  //     .promise();

  //   try {
  //     const document = await pdfjsLib.getDocument(pdfBuffer).promise;

  //     let scrapedText = '';

  //     for (let i = 1; i <= document.numPages; i++) {
  //       const page = await document.getPage(i);
  //       const pageTextContent = await page.getTextContent({
  //         disableCombineTextItems: false,
  //         normalizeWhitespace: false,
  //       });

  //       let lastY = null,
  //         pageText = '';

  //       for (let item of pageTextContent.items) {
  //         if (lastY === item.transform[5] || !lastY) {
  //           pageText += ' ' + item.str;
  //         } else {
  //           pageText += '\n' + item.str;
  //         }
  //         lastY = item.transform[5];
  //       }

  //       if (!isEmpty(pageText)) {
  //         scrapedText = `${scrapedText}\n\n${pageText}`;
  //       }
  //     }

  //     console.log(JSON.stringify(scrapedText, null, 2));

  //     const documentContentsId = uuidv4();

  //     await storageClient
  //       .putObject({
  //         Body: Buffer.from(JSON.stringify(scrapedText)),
  //         Bucket: BUCKET_NAME,
  //         ContentType: 'application/pdf',
  //         Key: documentContentsId,
  //       })
  //       .promise();

  //     console.log('documentContentsId', documentContentsId);
  //   } catch (e) {
  //     const pdfjsVersion = pdfjsLib && pdfjsLib.version;
  //     // throw new Error(`Error scraping PDF with PDF.JS v${pdfjsVersion}`);
  //     throw new Error(e);
  //   }
  // }

  // while (IsTruncated) {
  //   await storageClient
  //     .listObjectsV2({
  //       Bucket: `${EFCMS_DOMAIN}-documents-${ENV}-${REGION}`,
  //       MaxKeys: 1000,
  //     })
  //     .promise();
  // }
};

run();
