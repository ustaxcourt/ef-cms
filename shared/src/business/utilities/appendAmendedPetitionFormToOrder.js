const fs = require('fs');
const path = require('path');
const { combineTwoPdfs } = require('./documentGenerators/combineTwoPdfs');

const amendedPetitionPdf = fs.readFileSync(
  path.join(__dirname, '../../../static/pdfs/amended-petition-form.pdf'),
);
exports.appendAmendedPetitionFormToOrder = async ({
  applicationContext,
  orderPdfData,
}) => {
  const orderWithAmendedPetitionForm = await combineTwoPdfs({
    applicationContext,
    firstPdf: new Uint8Array(orderPdfData),
    secondPdf: new Uint8Array(amendedPetitionPdf),
  });

  return Buffer.from(orderWithAmendedPetitionForm);
};
