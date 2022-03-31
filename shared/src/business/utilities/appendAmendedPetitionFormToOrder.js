const fs = require('fs');
const path = require('path');
const { combineTwoPdfs } = require('./documentGenerators/combineTwoPdfs');

const amendedPetitionPdf = fs.readFileSync(
  path.join(__dirname, '../../../../static/pdfs/amended-petition-form.pdf'),
);
exports.appendAmendedPetitionFormToOrder = async ({
  applicationContext,
  orderPdfData,
}) => {
  console.log('11111111111');
  const orderWithAmendedPetitionForm = await combineTwoPdfs({
    applicationContext,
    firstPdf: new Uint8Array(orderPdfData),
    secondPdf: new Uint8Array(amendedPetitionPdf),
  });
  console.log(
    '1111111111orderWithAmendedPetitionForm1',
    orderWithAmendedPetitionForm,
  );
  return Buffer.from(orderWithAmendedPetitionForm);
};
