import { CaseInternal } from '../../../shared/src/business/entities/cases/CaseInternal';

export const petitionsClerkVerifiesOrderDesignatingPlaceOfTrialCheckbox = (
  test,
  fakeFile,
) => {
  return it('Petitions clerk verifies that the Order Designating Place of Trial checkbox is correctly checked and unchecked', async () => {
    await test.runSequence('gotoStartCaseWizardSequence');

    expect(test.getState('currentPage')).toEqual('StartCaseInternal');

    expect(test.getState('form.orderDesignatingPlaceOfTrial')).toBeTruthy();

    await test.runSequence('updateOrderForDesignatingPlaceOfTrialSequence', {
      key: 'orderDesignatingPlaceOfTrial',
      value: false,
    });

    await test.runSequence('submitPetitionFromPaperSequence');

    expect(test.getState('validationErrors')).toMatchObject({
      chooseAtLeastOneValue:
        CaseInternal.VALIDATION_ERROR_MESSAGES.chooseAtLeastOneValue,
    });

    await test.runSequence('updateOrderForDesignatingPlaceOfTrialSequence', {
      key: 'orderDesignatingPlaceOfTrial',
      value: true,
    });

    await test.runSequence('updateOrderForDesignatingPlaceOfTrialSequence', {
      key: 'preferredTrialCity',
      value: 'Boise, Idaho',
    });

    expect(test.getState('form.orderDesignatingPlaceOfTrial')).toBeFalsy();

    await test.runSequence('updateOrderForDesignatingPlaceOfTrialSequence', {
      key: 'preferredTrialCity',
      value: '',
    });

    expect(test.getState('form.orderDesignatingPlaceOfTrial')).toBeTruthy();

    // simulate switching to RQT document tab
    await test.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'currentViewMetadata.documentSelectedForScan',
      value: 'requestForPlaceOfTrialFile',
    });

    await test.runSequence('setDocumentUploadModeSequence', {
      documentUploadMode: 'upload',
    });

    await test.runSequence('setDocumentForUploadSequence', {
      documentType: 'requestForPlaceOfTrialFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(test.getState('form.orderDesignatingPlaceOfTrial')).toBeFalsy();

    await test.runSequence('openConfirmDeletePDFModalSequence');

    expect(test.getState('modal.showModal')).toEqual('ConfirmDeletePDFModal');

    await test.runSequence('removeScannedPdfSequence');

    expect(test.getState('form.requestForPlaceOfTrialFile')).toBeUndefined();
    expect(test.getState('form.orderDesignatingPlaceOfTrial')).toBeTruthy();

    await test.runSequence('updateFormValueSequence', {
      key: 'orderDesignatingPlaceOfTrial',
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

    expect(test.getState('form.orderDesignatingPlaceOfTrial')).toBeFalsy();
  });
};
