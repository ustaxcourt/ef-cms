import { PARTY_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { PaperPetition } from '../../../shared/src/business/entities/cases/PaperPetition';

export const petitionsClerkVerifiesOrderForCdsCheckbox = (
  cerebralTest,
  fakeFile,
) => {
  return it('Petitions clerk verifies that the Order for CDS checkbox is correctly checked and unchecked', async () => {
    await cerebralTest.runSequence('gotoStartCaseWizardSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('StartCaseInternal');

    await cerebralTest.runSequence('updateStartCaseInternalPartyTypeSequence', {
      key: 'partyType',
      value: PARTY_TYPES.petitioner,
    });

    expect(cerebralTest.getState('form.orderForCds')).toBeFalsy();

    await cerebralTest.runSequence('updateStartCaseInternalPartyTypeSequence', {
      key: 'partyType',
      value: PARTY_TYPES.corporation,
    });

    expect(cerebralTest.getState('form.orderForCds')).toBeTruthy();

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(
      cerebralTest.getState('validationErrors.corporateDisclosureFile'),
    ).toBeUndefined();

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'orderForCds',
      value: false,
    });

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(
      cerebralTest.getState('validationErrors.corporateDisclosureFile'),
    ).toEqual(PaperPetition.VALIDATION_ERROR_MESSAGES.corporateDisclosureFile);

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'orderForCds',
      value: true,
    });

    // simulate switching to CDS document tab
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

    expect(cerebralTest.getState('form.orderForCds')).toBeFalsy();

    await cerebralTest.runSequence('openConfirmDeletePDFModalSequence');

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'ConfirmDeletePDFModal',
    );

    await cerebralTest.runSequence('removeScannedPdfSequence');

    expect(
      cerebralTest.getState('form.corporateDisclosureFile'),
    ).toBeUndefined();
    expect(cerebralTest.getState('form.orderForCds')).toBeTruthy();

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'orderForCds',
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

    expect(cerebralTest.getState('form.orderForCds')).toBeFalsy();
  });
};
