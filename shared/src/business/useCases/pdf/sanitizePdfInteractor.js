const fs = require('fs');
const tmp = require('tmp');
const util = require('util');
const { exec } = require('child_process');

const execPromise = util.promisify(exec);

/**
 * sanitizes PDF input, removing interactive elements, saves altered PDF to persistence
 * @param applicationContext
 * @param documentId
 * @returns {Uint8Array} modified PDF data
 */
exports.sanitizePdfInteractor = async ({ applicationContext, documentId }) => {
  let inputPdf, intermediatePostscript, outputPdf, newPdfData;

  applicationContext.logger.time('Fetching S3 File');
  let { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: documentId,
    })
    .promise();
  try {
    // write original PDF to disk
    inputPdf = tmp.fileSync();
    fs.writeSync(inputPdf.fd, Buffer.from(pdfData));
    fs.closeSync(inputPdf.fd);

    // create temp working files
    intermediatePostscript = tmp.fileSync();
    fs.closeSync(intermediatePostscript.fd);

    outputPdf = tmp.fileSync();
    fs.closeSync(outputPdf.fd);

    const pdf2ps_cmd = [
      'gs',
      '-q',
      '-dQUIET',
      '-dBATCH',
      '-dSAFER',
      '-dNOPAUSE',
      '-sDEVICE=ps2write',
      `-sOutputFile=${intermediatePostscript.name}`,
      `-f ${inputPdf.name}`,
    ].join(' ');
    const ps2pdf_cmd = [
      'gs',
      '-q',
      '-dQUIET',
      '-dBATCH',
      '-dSAFER',
      '-dNOPAUSE',
      '-dNOCACHE',
      '-sDEVICE=pdfwrite',
      '-dPDFSETTINGS=/prepress',
      '-dColorConversionStrategy=/LeaveColorUnchanged',
      '-dAutoFilterColorImages=true',
      '-dAutoFilterGrayImages=true',
      '-dDownsampleMonoImages=true',
      '-dDownsampleGrayImages=true',
      '-dDownsampleColorImages=true',
      `-dPrinted=true`,
      `-sOutputFile=${outputPdf.name}`,
      `-f ${intermediatePostscript.name}`,
    ].join(' ');

    // run GS conversions
    await execPromise(pdf2ps_cmd);
    await execPromise(ps2pdf_cmd);

    // read GS results and return them
    newPdfData = fs.readFileSync(outputPdf.name);

    // remove temp-files we no longer need
    inputPdf.removeCallback();
    intermediatePostscript.removeCallback();
    outputPdf.removeCallback();
  } catch (err) {
    applicationContext.getStorageClient().putObjectTagging({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: documentId,
      Tagging: {
        TagSet: [
          {
            Key: 'sanitize-pdf',
            Value: 'error',
          },
        ],
      },
    });
    throw err;
  }

  applicationContext.logger.time('Saving S3 Document');
  await applicationContext
    .getPersistenceGateway()
    .saveDocument({ applicationContext, document: newPdfData, documentId });
  applicationContext.logger.timeEnd('Saving S3 Document');

  applicationContext.getStorageClient().putObjectTagging({
    Bucket: applicationContext.environment.documentsBucketName,
    Key: documentId,
    Tagging: {
      TagSet: [
        {
          Key: 'sanitize-pdf',
          Value: 'success',
        },
      ],
    },
  });

  return newPdfData;
};
