import { CaseInternal } from '../../../shared/src/business/entities/cases/CaseInternal';
import { PARTY_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const petitionsClerkVerifiesOrderForDiscCheckbox = (
  cerebralTest,
  fakeFile,
) => {
  return it('Petitions clerk verifies that the Order for DISC checkbox is correctly checked and unchecked', async () => {
    await cerebralTest.runSequence('gotoStartCaseWizardSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('StartCaseInternal');

    await cerebralTest.runSequence('updateStartCaseInternalPartyTypeSequence', {
      key: 'partyType',
      value: PARTY_TYPES.petitioner,
    });

    expect(cerebralTest.getState('form.orderForDisc')).toBeFalsy();

    await cerebralTest.runSequence('updateStartCaseInternalPartyTypeSequence', {
      key: 'partyType',
      value: PARTY_TYPES.corporation,
    });

    expect(cerebralTest.getState('form.orderForDisc')).toBeTruthy();

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(
      cerebralTest.getState('validationErrors.corporateDisclosureFile'),
    ).toBeUndefined();

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'orderForDisc',
      value: false,
    });

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(
      cerebralTest.getState('validationErrors.corporateDisclosureFile'),
    ).toEqual(CaseInternal.VALIDATION_ERROR_MESSAGES.corporateDisclosureFile);

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'orderForDisc',
      value: true,
    });

    // simulate switching to DISC document tab
    await cerebralTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'currentViewMetadata.documentSelectedForScan',
      value: 'corporateDisclosureFile',
    });

    await cerebralTest.runSequence('setDocumentUploadModeSequence', {
      documentUploadMode: 'upload',
    });

    await cerebralTest.runSequence('setDocumentForUploadSequence', {
      documentType: 'corporateDisclosureFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(cerebralTest.getState('form.orderForDisc')).toBeFalsy();

    await cerebralTest.runSequence('openConfirmDeletePDFModalSequence');

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'ConfirmDeletePDFModal',
    );

    await cerebralTest.runSequence('removeScannedPdfSequence');

    expect(
      cerebralTest.getState('form.corporateDisclosureFile'),
    ).toBeUndefined();
    expect(cerebralTest.getState('form.orderForDisc')).toBeTruthy();

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'orderForDisc',
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

    expect(cerebralTest.getState('form.orderForDisc')).toBeFalsy();
  });
};
