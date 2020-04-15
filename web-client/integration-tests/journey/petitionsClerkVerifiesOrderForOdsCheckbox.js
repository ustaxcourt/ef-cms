import { ContactFactory } from '../../../shared/src/business/entities/contacts/ContactFactory';

export const petitionsClerkVerifiesOrderForOdsCheckbox = (test, fakeFile) => {
  return it('Petitions clerk verifies that the Order for ODS checkbox is correctly checked and unchecked', async () => {
    await test.runSequence('gotoStartCaseWizardSequence');

    expect(test.getState('currentPage')).toEqual('StartCaseInternal');

    await test.runSequence('updateStartCaseInternalPartyTypeSequence', {
      key: 'partyType',
      value: ContactFactory.PARTY_TYPES.petitioner,
    });

    expect(test.getState('form.orderForOds')).toBeFalsy();

    await test.runSequence('updateStartCaseInternalPartyTypeSequence', {
      key: 'partyType',
      value: ContactFactory.PARTY_TYPES.corporation,
    });

    expect(test.getState('form.orderForOds')).toBeTruthy();

    // simulate switching to ODS document tab
    await test.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'currentViewMetadata.documentSelectedForScan',
      value: 'ownershipDisclosureFile',
    });

    await test.runSequence('setDocumentUploadModeSequence', {
      documentUploadMode: 'upload',
    });

    await test.runSequence('setDocumentForUploadSequence', {
      documentType: 'ownershipDisclosureFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(test.getState('form.orderForOds')).toBeFalsy();

    await test.runSequence('openConfirmDeletePDFModalSequence');

    expect(test.getState('modal.showModal')).toEqual('ConfirmDeletePDFModal');

    await test.runSequence('removeScannedPdfSequence');

    expect(test.getState('form.ownershipDisclosureFile')).toBeUndefined();
    expect(test.getState('form.orderForOds')).toBeTruthy();
  });
};
