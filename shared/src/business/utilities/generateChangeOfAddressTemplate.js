/**
 * creates a lookup of changed contact fields
 *
 * @param {object} providers the providers object
 * @param {object} providers.newData updated contact information
 * @param {object} providers.oldData the old contact information
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

/**
 * returns the appropriate documentType given the old and new contact data
 *
 * @param {object} providers the providers object
 * @param {object} providers.diff the initial diff
 * @param {object} providers.newData updated contact information
 * @param {object} providers.oldData the old contact information
 * @returns {string} documentType for the address / phone change scenario
 */
const getDocumentTypeForAddressChange = ({ diff, newData, oldData }) => {
  let documentType;
  if (!diff) {
    diff = getAddressPhoneDiff({ newData, oldData });
  }

  const addressFields = [
    'country',
    'countryType',
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
    documentType = {
      eventCode: 'NCA',
      title: 'Notice of Change of Address',
    };
  }

  if (isPhoneChange && !isAddressChange) {
    documentType = {
      eventCode: 'NCP',
      title: 'Notice of Change of Telephone Number',
    };
  }

  if (isAddressChange && isPhoneChange) {
    documentType = {
      eventCode: 'NCAP',
      title: 'Notice of Change of Address and Telephone Number',
    };
  }

  return documentType;
};

module.exports = {
  getAddressPhoneDiff,
  getDocumentTypeForAddressChange,
};
