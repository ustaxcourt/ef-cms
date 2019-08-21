const fs = require('fs');
const path = require('path');
const templatesPath = path.join(__dirname, '../templates/');
const printChangeOfAddressTemplate = fs.readFileSync(
  templatesPath + 'printChangeOfAddressTemplate.html',
  'utf8',
);

/**
 * hydrates printChangeOfAddressTemplate with contact and case info
 *
 * @param {object} caseDetail the case being updated
 * @param {object} newData updated contact information
 * @param {object} oldData the old contact information
 * @returns {string} pdfContentHtml in string form
 */
exports.generateChangeOfAddressTemplate = ({
  caseDetail,
  newData,
  oldData,
}) => {
  let oldAddress = '';
  let newAddress = '';
  let oldCityStateZip = '';
  let newCityStateZip = '';
  const diff = {};
  const newContactFields = Object.keys(newData);

  // Get changes diff
  newContactFields.map(key => {
    const oldValue = oldData[key];
    const newValue = newData[key];
    if (oldValue !== newValue) {
      diff[key] = {
        newData: newData[key],
        oldData: oldData[key],
      };
    }
  });

  if (diff.address1) {
    oldAddress += `<div>${diff.address1.oldData}</div>`;
    newAddress += `<div>${diff.address1.newData}</div>`;
  }

  if (diff.address2) {
    oldAddress += `<div>${diff.address2.oldData}</div>`;
    newAddress += `<div>${diff.address2.newData}</div>`;
  }

  if (diff.address3) {
    oldAddress += `<div>${diff.address3.oldData}</div>`;
    newAddress += `<div>${diff.address3.newData}</div>`;
  }

  if (diff.city) {
    oldCityStateZip += diff.city.oldData;
    newCityStateZip += diff.city.newData;
  }

  if (diff.state) {
    oldCityStateZip += (diff.city ? ', ' : '') + diff.state.oldData;
    newCityStateZip += (diff.city ? ', ' : '') + diff.state.newData;
  }

  if (diff.postalCode) {
    oldCityStateZip +=
      (diff.city || diff.state ? ' ' : '') + diff.postalCode.oldData;
    newCityStateZip +=
      (diff.city || diff.state ? ' ' : '') + diff.postalCode.newData;
  }

  if (newCityStateZip !== '') {
    oldAddress += `<div>${oldCityStateZip}</div>`;
    newAddress += `<div>${newCityStateZip}</div>`;
  }

  if (diff.phone) {
    oldAddress += `<div>${diff.phone.oldData}</div>`;
    newAddress += `<div>${diff.phone.newData}</div>`;
  }

  const pdfContentHtml = printChangeOfAddressTemplate
    .replace(/{{ oldAddress }}/g, oldAddress)
    .replace(/{{ newAddress }}/g, newAddress)
    .replace(/{{ caption }}/g, caseDetail.caseCaption)
    .replace(/{{ captionPostfix }}/g, caseDetail.caseCaptionPostfix)
    .replace(
      /{{ docketNumber }}/g,
      `${caseDetail.docketNumber}${caseDetail.docketNumberSuffix || ''}`,
    );
  return pdfContentHtml;
};
