const fs = require('fs');
const path = require('path');
const templatesPath = path.join(__dirname, '../templates/');
const printChangeOfAddressTemplate = fs.readFileSync(
  templatesPath + 'printChangeOfAddressTemplate.html',
  'utf8',
);

/**
 * creates a lookup of changed contact fields
 *
 * @param {object} newData updated contact information
 * @param {object} oldData the old contact information
 * @returns {object} diff object with old and new values for each changed field
 */
const getAddressPhoneDiff = ({ newData, oldData }) => {
  const diff = {};
  const fields = Object.keys(newData);
  fields.map(key => {
    const oldValue = oldData[key];
    const newValue = newData[key];
    if (oldValue !== newValue) {
      diff[key] = {
        newData: newData[key],
        oldData: oldData[key],
      };
    }
  });
  return diff;
};

exports.getAddressPhoneDiff = getAddressPhoneDiff;

/**
 * returns the appropiate documentType given the old and new contact data
 *
 * @param {object} newData updated contact information
 * @param {object} oldData the old contact information
 * @returns {string} documentType for the address / phone change scenario
 */
const getDocumentTypeForAddressChange = ({ diff, newData, oldData }) => {
  let documentType;
  if (!diff) {
    diff = getAddressPhoneDiff({ newData, oldData });
  }

  const addressFields = [
    'address1',
    'address2',
    'address3',
    'city',
    'state',
    'postalCode',
  ];

  const isAddressChange = Object.keys(diff).some(field =>
    addressFields.includes(field),
  );
  const isPhoneChange = !!diff.phone;

  if (isAddressChange && !isPhoneChange) {
    documentType = 'Notice of Change of Address';
  }

  if (isPhoneChange && !isAddressChange) {
    documentType = 'Notice of Change of Telephone Number';
  }

  if (isAddressChange && isPhoneChange) {
    documentType = 'Notice of Change of Address and Telephone Number';
  }

  return documentType;
};

exports.getDocumentTypeForAddressChange = getDocumentTypeForAddressChange;

/**
 * hydrates printChangeOfAddressTemplate with contact and case info
 *
 * @param {object} caseDetail the case being updated
 * @param {string} documentTitle the document title to use on the pdf
 * @param {object} newData updated contact information
 * @param {object} oldData the old contact information
 * @returns {string} pdfContentHtml in string form
 */
exports.generateChangeOfAddressTemplate = ({
  caseDetail,
  documentTitle,
  newData,
  oldData,
}) => {
  let oldAddress = '';
  let newAddress = '';

  if (!documentTitle) {
    documentTitle = getDocumentTypeForAddressChange({ newData, oldData });
  }

  if (documentTitle === 'Notice of Change of Telephone Number') {
    oldAddress = `<div>${oldData.phone}</dvi>`;
    newAddress = `<div>${newData.phone}</dvi>`;
  } else {
    oldAddress = `<div>${oldData.address1}</div>`;
    newAddress = `<div>${newData.address1}</div>`;

    if (oldData.address2) {
      oldAddress += `<div>${oldData.address2}</div>`;
    }

    if (newData.address2) {
      newAddress += `<div>${newData.address2}</div>`;
    }

    if (oldData.address3) {
      oldAddress += `<div>${oldData.address3}</div>`;
    }

    if (newData.address3) {
      newAddress += `<div>${newData.address3}</div>`;
    }

    oldAddress += `<div>${oldData.city}, ${oldData.state} ${oldData.postalCode}</div>`;
    newAddress += `<div>${newData.city}, ${newData.state} ${newData.postalCode}</div>`;

    if (documentTitle === 'Notice of Change of Address and Telephone Number') {
      oldAddress += `<div>${oldData.phone}</dvi>`;
      newAddress += `<div>${newData.phone}</dvi>`;
    }
  }

  const pdfContentHtml = printChangeOfAddressTemplate
    .replace(/{{ oldAddress }}/g, oldAddress)
    .replace(/{{ newAddress }}/g, newAddress)
    .replace(/{{ documentTitle }}/g, documentTitle)
    .replace(/{{ caption }}/g, caseDetail.caseCaption)
    .replace(/{{ captionPostfix }}/g, caseDetail.caseCaptionPostfix)
    .replace(
      /{{ docketNumber }}/g,
      `${caseDetail.docketNumber}${caseDetail.docketNumberSuffix || ''}`,
    );
  return pdfContentHtml;
};
