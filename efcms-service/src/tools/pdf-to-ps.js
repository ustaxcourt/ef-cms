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

// these don't work.
// const ps2pdf = '-psconv -q -dNOPAUSE -sDEVICE=pdfwrite -o out.pdf -f example.ps';
// const pdf2ps = '-psconv -q -dNOPAUSE -sDEVICE=pdfwrite -o out.pdf -f in.ps';

/*
Works on the command-line, converts ps to pdf
gs -o output.pdf -sDEVICE=pdfwrite -dPDFSETTINGS=/prepress -dHaveTrueTypes=true -dEmbedAllFonts=true -dSubsetFonts=false -c ".setpdfwrite <</NeverEmbed [ ]>> setdistillerparams" -f example.ps


This owrks, also.
gs -o output.pdf -sDEVICE=pdfwrite -dPDFSETTINGS=/prepress -dHaveTrueTypes=true -dEmbedAllFonts=true -dSubsetFonts=false -f example.ps

But doesn't work as args to gs below.
*/
const pdftops = '-sDEVICE=pdfwrite -sOutputFile=output.pdf -dPDFSETTINGS=/prepress -dHaveTrueTypes=true -dEmbedAllFonts=true -dSubsetFonts=false -f example.ps';

try {
  // Take decision based on Ghostscript version
  const version = gs.version();
  console.log('GS Version', version);
  gs.executeSync(pdftops);
} catch (err) {
  console.log(err, err.message);
  throw err;
}
