import { CaseInternal } from '../../../shared/src/business/entities/cases/CaseInternal';
import { PARTY_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const petitionsClerkVerifiesOrderForOdsCheckbox = (test, fakeFile) => {
  return it('Petitions clerk verifies that the Order for ODS checkbox is correctly checked and unchecked', async () => {
    await test.runSequence('gotoStartCaseWizardSequence');

    expect(test.getState('currentPage')).toEqual('StartCaseInternal');

    await test.runSequence('updateStartCaseInternalPartyTypeSequence', {
      key: 'partyType',
      value: PARTY_TYPES.petitioner,
    });

    expect(test.getState('form.orderForOds')).toBeFalsy();

    await test.runSequence('updateStartCaseInternalPartyTypeSequence', {
      key: 'partyType',
      value: PARTY_TYPES.corporation,
    });

    expect(test.getState('form.orderForOds')).toBeTruthy();

    await test.runSequence('submitPetitionFromPaperSequence');

    expect(
      test.getState('validationErrors.ownershipDisclosureFile'),
    ).toBeUndefined();

    await test.runSequence('updateFormValueSequence', {
      key: 'orderForOds',
      value: false,
    });

    await test.runSequence('submitPetitionFromPaperSequence');

    expect(test.getState('validationErrors.ownershipDisclosureFile')).toEqual(
      CaseInternal.VALIDATION_ERROR_MESSAGES.ownershipDisclosureFile,
    );

    await test.runSequence('updateFormValueSequence', {
      key: 'orderForOds',
      value: true,
    });

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

    await test.runSequence('updateFormValueSequence', {
      key: 'orderForOds',
      value: false,
    });

    await test.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'currentViewMetadata.documentSelectedForScan',
      value: 'petitionFile',
    });

    await test.runSequence('setDocumentUploadModeSequence', {
      documentUploadMode: 'upload',
    });

    await test.runSequence('setDocumentForUploadSequence', {
      documentType: 'petitionFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(test.getState('form.orderForOds')).toBeFalsy();
  });
};
