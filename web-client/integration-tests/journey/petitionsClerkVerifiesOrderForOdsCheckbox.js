import { CaseInternal } from '../../../shared/src/business/entities/cases/CaseInternal';
import { PARTY_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const petitionsClerkVerifiesOrderForOdsCheckbox = (
  cerebralTest,
  fakeFile,
) => {
  return it('Petitions clerk verifies that the Order for ODS checkbox is correctly checked and unchecked', async () => {
    await cerebralTest.runSequence('gotoStartCaseWizardSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('StartCaseInternal');

    await cerebralTest.runSequence('updateStartCaseInternalPartyTypeSequence', {
      key: 'partyType',
      value: PARTY_TYPES.petitioner,
    });

    expect(cerebralTest.getState('form.orderForOds')).toBeFalsy();

    await cerebralTest.runSequence('updateStartCaseInternalPartyTypeSequence', {
      key: 'partyType',
      value: PARTY_TYPES.corporation,
    });

    expect(cerebralTest.getState('form.orderForOds')).toBeTruthy();

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(
      cerebralTest.getState('validationErrors.ownershipDisclosureFile'),
    ).toBeUndefined();

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'orderForOds',
      value: false,
    });

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(
      cerebralTest.getState('validationErrors.ownershipDisclosureFile'),
    ).toEqual(CaseInternal.VALIDATION_ERROR_MESSAGES.ownershipDisclosureFile);

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'orderForOds',
      value: true,
    });

    // simulate switching to ODS document tab
    await cerebralTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'currentViewMetadata.documentSelectedForScan',
      value: 'ownershipDisclosureFile',
    });

    await cerebralTest.runSequence('setDocumentUploadModeSequence', {
      documentUploadMode: 'upload',
    });

    await cerebralTest.runSequence('setDocumentForUploadSequence', {
      documentType: 'ownershipDisclosureFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(cerebralTest.getState('form.orderForOds')).toBeFalsy();

    await cerebralTest.runSequence('openConfirmDeletePDFModalSequence');

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'ConfirmDeletePDFModal',
    );

    await cerebralTest.runSequence('removeScannedPdfSequence');

    expect(
      cerebralTest.getState('form.ownershipDisclosureFile'),
    ).toBeUndefined();
    expect(cerebralTest.getState('form.orderForOds')).toBeTruthy();

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'orderForOds',
      value: false,
    });

    await cerebralTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'currentViewMetadata.documentSelectedForScan',
      value: 'petitionFile',
    });

    await cerebralTest.runSequence('setDocumentUploadModeSequence', {
      documentUploadMode: 'upload',
    });

    await cerebralTest.runSequence('setDocumentForUploadSequence', {
      documentType: 'petitionFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(cerebralTest.getState('form.orderForOds')).toBeFalsy();
  });
};
