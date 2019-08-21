import { state } from 'cerebral';
import printChangeOfAddressTemplate from '../../views/DocketRecord/printChangeOfAddressTemplate.html';

/**
 * updates primary contact information
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {object} providers.get the cerebral store used for getting state.form
 * @returns {object} alertSuccess, caseId, tab
 */
export const updatePrimaryContactAction = async ({
  applicationContext,
  get,
}) => {
  const caseBackup = get(state.caseDetailBackup);
  const caseToUpdate = get(state.caseDetail);
  const contactInfo = get(state.caseDetail.contactPrimary);

  let oldAddress = '';
  let newAddress = '';
  let oldCityStateZip = '';
  let newCityStateZip = '';
  const diff = {};
  const newContactFields = Object.keys(contactInfo);

  // Get changes diff
  newContactFields.map(key => {
    const oldValue = caseBackup.contactPrimary[key];
    const newValue = contactInfo[key];
    if (oldValue !== newValue) {
      diff[key] = {
        newData: contactInfo[key],
        oldData: caseBackup.contactPrimary[key],
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

  const contentHtml = printChangeOfAddressTemplate
    .replace(/{{ oldAddress }}/g, oldAddress)
    .replace(/{{ newAddress }}/g, newAddress);

  const updatedCase = await applicationContext
    .getUseCases()
    .updatePrimaryContactInteractor({
      applicationContext,
      caseId: caseToUpdate.caseId,
      contactInfo,
    });

  return {
    alertSuccess: {
      message: 'Please confirm the information below is correct.',
      title: 'Your changes have been saved.',
    },
    caseId: updatedCase.docketNumber,
    tab: 'caseInfo',
  };
};
