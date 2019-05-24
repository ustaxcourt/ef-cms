const fs = require('fs');
const gs = require('ghostscript4js');
const tmp = require('tmp');

/**
 * sanitizes PDF input, removing interactive elements
 * @param pdfData {{Uint8Array}} unknown.. buffer?
 * @returns {Uint8Array}
 */
exports.sanitizePdf = async ({ pdfData }) => {
  let inputPdf, intermediatePostscript, outputPdf, result;
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
      '-dBATCH',
      '-dSAFER',
      '-dNOPAUSE',
      '-q',
      '-sDEVICE=ps2write',
      `-sOutputFile=${intermediatePostscript.name}`,
      `-f ${inputPdf.name}`,
    ].join(' ');
    const ps2pdf_cmd = [
      '-dQUIET',
      '-dBATCH',
      '-dSAFER',
      '-dNOPAUSE',
      '-dNOCACHE',
      '-sDEVICE=pdfwrite',
      '-dPDFSETTINGS=/prepress',
      '-sColorConversionStrategy=/LeaveColorUnchanged',
      '-dAutoFilterColorImages=true',
      '-dAutoFilterGrayImages=true',
      '-dDownsampleMonoImages=true',
      '-dDownsampleGrayImages=true',
      '-dDownsampleColorImages=true',
      `-sOutputFile=${outputPdf.name}`,
      `-f ${intermediatePostscript.name}`,
    ].join(' ');

    // run GS conversions
    gs.executeSync(pdf2ps_cmd);
    gs.executeSync(ps2pdf_cmd);

    // read GS results and return them
    result = fs.readFileSync(outputPdf.name);

    // remove temp-files we no longer need
    inputPdf.removeCallback();
    intermediatePostscript.removeCallback();
    outputPdf.removeCallback();
  } catch (err) {
    throw err;
  }
  return result;
};
