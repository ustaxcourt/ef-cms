const gs = require('ghostscript4js');

/*
  Creates a PNG from a PDF. Great!
  But not what we need...
*/

try {
  // Take decision based on Ghostscript version
  const version = gs.version();
  console.log(version);
  gs.executeSync('-sDEVICE=pngalpha -o output.png -sDEVICE=pngalpha -r144 example.pdf');
} catch (err) {
  // Handle error
  console.log('Error', err);
  throw err;
}