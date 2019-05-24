const gs = require('ghostscript4js');

/*

Follow the Ghostscript4JS prerequisite installation steps at
https://www.npmjs.com/package/ghostscript4js#prerequisites
Or for MacOS:
`brew install ghostscript`
Add the following to your ~/.bash_profile or ~/.bashrc
`export GS4JS_HOME="/usr/local/lib"` 
const gs = require('ghostscript4js');

*/

const args = process.argv.slice(2);
const [inputFile, outputFile='output.pdf'] = args;

const pdf2ps = `-dBATCH -dSAFER -dNOPAUSE -q -sDEVICE=ps2write -sOutputFile=intermediate.ps -f ${inputFile}`;
const ps2pdf = `-dBATCH -dSAFER -dNOPAUSE -q -sDEVICE=pdfwrite -sOutputFile=${outputFile} -dPDFSETTINGS=/prepress -dHaveTrueTypes=true -dEmbedAllFonts=true -dSubsetFonts=false -f intermediate.ps`;

try {
  // Take decision based on Ghostscript version
  const version = gs.version();
  console.log('GS Version', version);

  gs.executeSync(pdf2ps);
  console.log('Created PS intermediate.ps');

  gs.executeSync(ps2pdf);
  console.log(`Created PDF ${outputFile}`);
} catch (err) {
  console.log(err, err.message);
  throw err;
}
