/* eslint-disable no-console */
const gs = require('ghostscript4js');

/*

Follow the Ghostscript4JS prerequisite installation steps at
https://www.npmjs.com/package/ghostscript4js#prerequisites
Or for MacOS:
`brew install ghostscript`
Add the following to your ~/.bash_profile or ~/.bashrc
`export GS4JS_HOME="/usr/local/lib"` 
const gs = require('ghostscript4js');

consult docs at https://www.ghostscript.com/doc/current/VectorDevices.htm#Extensions

Convert PDF to PS:
gs -dBATCH -dSAFER -dNOPAUSE -q -sDEVICE=ps2write -sOutputFile=intermediate.ps -f FILENAME

Convert PS to PDF:
gs -dBATCH -dSAFER -dNOPAUSE -q -sDEVICE=pdfwrite -sOutputFile=pdf-from-ps.pdf -dPDFSETTINGS=/prepress -dHaveTrueTypes=true -dEmbedAllFonts=true -dSubsetFonts=false -f example.ps
*/

const args = process.argv.slice(2);
const [inputFile, outputFile='output.pdf'] = args;

const pdf2psArgs = ['-dBATCH',
  '-dSAFER',
  '-dNOPAUSE',
  '-q',
  '-sDEVICE=ps2write',
  '-sOutputFile=intermediate.ps',
  `-f ${inputFile}`,
];

const ps2pdfArgs = [
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
  `-sOutputFile=${outputFile}`,
  '-f intermediate.ps',
];

const ps2pdf_cmd = ps2pdfArgs.join(' ');
const pdf2ps_cmd = pdf2psArgs.join(' ');

try {
  // Take decision based on Ghostscript version
  const version = gs.version();
  console.log('GS Version', version);

  gs.executeSync(pdf2ps_cmd);
  console.log('Created PS intermediate.ps');

  gs.executeSync(ps2pdf_cmd);
  console.log(`Created PDF ${outputFile}`);
} catch (err) {
  console.log(err, err.message);
  throw err;
}
