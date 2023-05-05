import { NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP } from '../../business/entities/EntityConstants';
import { union } from 'lodash';

/**
 * creates a lookup of changed contact fields
 *
 * @param {object} providers the providers object
 * @param {object} providers.newData updated contact information
 * @param {object} providers.oldData the old contact information
 * @returns {object} diff object with old and new values for each changed field
 */
export const getAddressPhoneDiff = ({ newData, oldData }) => {
  const diff = {};
  const fields = union(Object.keys(newData), Object.keys(oldData));
  fields.forEach(key => {
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
export const getDocumentTypeForAddressChange = ({ diff, newData, oldData }) => {
  let documentType;

  const initialDiff = diff || getAddressPhoneDiff({ newData, oldData });

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

  const isAddressChange = Object.keys(initialDiff).some(field =>
    addressFields.includes(field),
  );
  const isPhoneChange = !!initialDiff.phone;
  const isEmailChange = newData.email && newData.email !== oldData.email;

  if (isEmailChange) {
    documentType = NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP.find(
      e => e.eventCode === 'NOCE',
    );
  } else if (isAddressChange && !isPhoneChange) {
    documentType = NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP.find(
      e => e.eventCode === 'NCA',
    );
  } else if (isPhoneChange && !isAddressChange) {
    documentType = NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP.find(
      e => e.eventCode === 'NCP',
    );
  } else if (isAddressChange && isPhoneChange) {
    documentType = NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP.find(
      e => e.eventCode === 'NCAP',
    );
  }

  return documentType;
};
