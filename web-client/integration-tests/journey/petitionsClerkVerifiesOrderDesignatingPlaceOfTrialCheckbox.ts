import { CaseInternal } from '../../../shared/src/business/entities/cases/CaseInternal';

export const petitionsClerkVerifiesOrderDesignatingPlaceOfTrialCheckbox = (
  cerebralTest,
  fakeFile,
) => {
  return it('Petitions clerk verifies that the Order Designating Place of Trial checkbox is correctly checked and unchecked', async () => {
    await cerebralTest.runSequence('gotoStartCaseWizardSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('StartCaseInternal');

    expect(
      cerebralTest.getState('form.orderDesignatingPlaceOfTrial'),
    ).toBeTruthy();

    await cerebralTest.runSequence(
      'updateOrderForDesignatingPlaceOfTrialSequence',
      {
        key: 'orderDesignatingPlaceOfTrial',
        value: false,
      },
    );

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(cerebralTest.getState('validationErrors')).toMatchObject({
      chooseAtLeastOneValue:
        CaseInternal.VALIDATION_ERROR_MESSAGES.chooseAtLeastOneValue,
    });

    await cerebralTest.runSequence(
      'updateOrderForDesignatingPlaceOfTrialSequence',
      {
        key: 'orderDesignatingPlaceOfTrial',
        value: true,
      },
    );

    await cerebralTest.runSequence(
      'updateOrderForDesignatingPlaceOfTrialSequence',
      {
        key: 'preferredTrialCity',
        value: 'Boise, Idaho',
      },
    );

    expect(
      cerebralTest.getState('form.orderDesignatingPlaceOfTrial'),
    ).toBeFalsy();

    await cerebralTest.runSequence(
      'updateOrderForDesignatingPlaceOfTrialSequence',
      {
        key: 'preferredTrialCity',
        value: '',
      },
    );

    expect(
      cerebralTest.getState('form.orderDesignatingPlaceOfTrial'),
    ).toBeTruthy();

    // simulate switching to RQT document tab
    await cerebralTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'currentViewMetadata.documentSelectedForScan',
      value: 'requestForPlaceOfTrialFile',
    });

    await cerebralTest.runSequence('setDocumentUploadModeSequence', {
      documentUploadMode: 'upload',
    });

    await cerebralTest.runSequence('setDocumentForUploadSequence', {
      documentType: 'requestForPlaceOfTrialFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(
      cerebralTest.getState('form.orderDesignatingPlaceOfTrial'),
    ).toBeFalsy();

    await cerebralTest.runSequence('openConfirmDeletePDFModalSequence');

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'ConfirmDeletePDFModal',
    );

    await cerebralTest.runSequence('removeScannedPdfSequence');

    expect(
      cerebralTest.getState('form.requestForPlaceOfTrialFile'),
    ).toBeUndefined();
    expect(
      cerebralTest.getState('form.orderDesignatingPlaceOfTrial'),
    ).toBeTruthy();

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'orderDesignatingPlaceOfTrial',
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

    expect(
      cerebralTest.getState('form.orderDesignatingPlaceOfTrial'),
    ).toBeFalsy();
  });
};
