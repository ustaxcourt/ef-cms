import { Case } from '../../../shared/src/business/entities/cases/Case';
import { CaseInternal } from '../../../shared/src/business/entities/cases/CaseInternal';
import { ContactFactory } from '../../../shared/src/business/entities/contacts/ContactFactory';

export const petitionsClerkCreatesNewCaseAndSavesForLater = (
  test,
  fakeFile,
  trialLocation = 'Birmingham, Alabama',
) => {
  const primaryContactName = {
    key: 'contactPrimary.name',
    value: 'Shawn Johnson',
  };

  const formValues = [
    {
      key: 'dateReceivedMonth',
      value: '01',
    },
    {
      key: 'dateReceivedDay',
      value: '01',
    },
    {
      key: 'dateReceivedYear',
      value: '2001',
    },
    {
      key: 'mailingDate',
      value: 'Some Day',
    },
    {
      key: 'petitionFile',
      value: fakeFile,
    },
    {
      key: 'petitionFileSize',
      value: 1,
    },
    {
      key: 'stinFile',
      value: fakeFile,
    },
    {
      key: 'stinFileSize',
      value: 1,
    },
    {
      key: 'odsFile',
      value: fakeFile,
    },
    {
      key: 'odsFileSize',
      value: 1,
    },
    {
      key: 'ownershipDisclosureFile',
      value: fakeFile,
    },
    {
      key: 'ownershipDisclosureFileSize',
      value: 1,
    },
    {
      key: 'requestForPlaceOfTrialFile',
      value: fakeFile,
    },
    {
      key: 'requestForPlaceOfTrialFileSize',
      value: 1,
    },
    {
      key: 'applicationForWaiverOfFilingFeeFile',
      value: fakeFile,
    },
    {
      key: 'applicationForWaiverOfFilingFeeFileSize',
      value: 1,
    },
    {
      key: 'preferredTrialCity',
      value: trialLocation,
    },
    {
      key: 'procedureType',
      value: 'Small',
    },
    {
      key: 'caseType',
      value: 'Deficiency',
    },
    {
      key: 'partyType',
      value: ContactFactory.PARTY_TYPES.petitionerDeceasedSpouse,
    },
    {
      key: 'contactPrimary.countryType',
      value: 'international',
    },
    {
      key: 'contactPrimary.country',
      value: 'Switzerland',
    },
    primaryContactName,
    {
      key: 'contactPrimary.address1',
      value: '123 Abc Ln',
    },
    {
      key: 'contactPrimary.city',
      value: 'Cityville',
    },
    {
      key: 'contactPrimary.postalCode',
      value: '23-skidoo',
    },
    {
      key: 'contactPrimary.email',
      value: 'test@example.com',
    },
    {
      key: 'contactPrimary.phone',
      value: '1234567890',
    },
    {
      key: 'contactSecondary.name',
      value: 'Julius Lenhart',
    },
    {
      key: 'contactSecondary.inCareOf',
      value: 'Nora Stanton Barney',
    },
    {
      key: 'petitionPaymentStatus',
      value: Case.PAYMENT_STATUS.WAIVED,
    },
    {
      key: 'paymentDateWaivedDay',
      value: '05',
    },
    {
      key: 'paymentDateWaivedMonth',
      value: '05',
    },
    {
      key: 'paymentDateWaivedYear',
      value: '2005',
    },
  ];

  it('should default to parties tab when creating a new case', async () => {
    await test.runSequence('gotoStartCaseWizardSequence');
    await test.runSequence('reviewPetitionFromPaperSequence');

    expect(test.getState('currentPage')).toEqual('StartCaseInternal');
    expect(test.getState('currentViewMetadata.startCaseInternal.tab')).toBe(
      'partyInfo',
    );
  });

  it('should default to Regular procedureType when creating a new case', async () => {
    expect(test.getState('form.procedureType')).toEqual(
      CaseInternal.DEFAULT_PROCEDURE_TYPE,
    );
  });

  it('should generate case caption from primary and secondary contact information', async () => {
    for (const item of formValues) {
      if (item.key === 'partyType') {
        await test.runSequence(
          'updateStartCaseInternalPartyTypeSequence',
          item,
        );
      } else if (item.key === 'petitionPaymentStatus') {
        await test.runSequence('updatePetitionPaymentFormValueSequence', item);
      } else {
        await test.runSequence('updateFormValueSequence', item);
      }
    }

    await test.runSequence('updateFormValueAndSecondaryContactInfoSequence', {
      key: 'useSameAsPrimary',
      value: true,
    });
    await test.runSequence(
      'updateFormValueAndInternalCaseCaptionSequence',
      primaryContactName,
    );
    await test.runSequence('validatePetitionFromPaperSequence');

    expect(test.getState('form.caseCaption')).toBe(
      'Shawn Johnson & Julius Lenhart, Deceased, Shawn Johnson, Surviving Spouse, Petitioners',
    );
    expect(test.getState('form.contactSecondary.address1')).toBe(
      test.getState('form.contactPrimary.address1'),
    );
    expect(test.getState('form.contactSecondary.city')).toBe(
      test.getState('form.contactPrimary.city'),
    );
    expect(test.getState('form.contactSecondary.country')).toBe(
      test.getState('form.contactPrimary.country'),
    );
    expect(test.getState('form.contactSecondary.postalCode')).toBe(
      test.getState('form.contactPrimary.postalCode'),
    );
    expect(test.getState('form.contactSecondary.email')).toBe(
      test.getState('form.contactPrimary.email'),
    );
    expect(test.getState('form.contactSecondary.phone')).toBe(
      test.getState('form.contactPrimary.phone'),
    );
    expect(test.getState('form.contactSecondary.inCareOf')).toBe(
      'Nora Stanton Barney',
    );
  });

  it('should regenerate case caption when primary contact name is changed', async () => {
    await test.runSequence('updateFormValueAndInternalCaseCaptionSequence', {
      key: 'contactPrimary.name',
      value: 'Ada Lovelace',
    });

    expect(test.getState('form.caseCaption')).toBe(
      'Ada Lovelace & Julius Lenhart, Deceased, Ada Lovelace, Surviving Spouse, Petitioners',
    );

    const updatedCaseCaption = 'Ada Lovelace is awesome';
    await test.runSequence('updateFormValueSequence', {
      key: 'caseCaption',
      value: updatedCaseCaption,
    });

    expect(test.getState('form.caseCaption')).toBe(updatedCaseCaption);
  });

  it('should validate when all required information has been provided', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'petitionFile',
      value: fakeFile,
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'stinFile',
      value: fakeFile,
    });

    expect(test.getState('alertError')).toBeUndefined();
    expect(test.getState('validationErrors')).toEqual({});
  });

  it('should navigate to review screen when case information has been validated', async () => {
    await test.runSequence('reviewPetitionFromPaperSequence');

    expect(test.getState('currentPage')).toEqual('ReviewPetitionFromPaper');
  });

  it('should route to the party info tab when user selects to edit party info', async () => {
    await navigateToStartCaseInternalPartiesTab(test);
  });

  it('should route to the case info tab when user selects to edit case info', async () => {
    await test.runSequence('goBackToStartCaseInternalSequence', {
      tab: 'caseInfo',
    });

    expect(test.getState('currentPage')).toEqual('StartCaseInternal');
    expect(test.getState('currentViewMetadata.startCaseInternal.tab')).toBe(
      'caseInfo',
    );
  });

  it('should update case caption on the review screen when it has been edited', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'caseCaption',
      value: 'One fish, two fish',
    });

    await test.runSequence('reviewPetitionFromPaperSequence');

    expect(test.getState('currentPage')).toEqual('ReviewPetitionFromPaper');
    expect(test.getState('form.caseCaption')).toBe('One fish, two fish');
  });

  it('should route to the irs notice tab when user selects to edit irs notice info', async () => {
    await test.runSequence('goBackToStartCaseInternalSequence', {
      tab: 'irsNotice',
    });

    expect(test.getState('currentPage')).toEqual('StartCaseInternal');
    expect(test.getState('currentViewMetadata.startCaseInternal.tab')).toBe(
      'irsNotice',
    );
  });

  it('should update case type on the review screen when when it has been edited', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: Case.CASE_TYPES_MAP.interestAbatement,
    });

    await test.runSequence('reviewPetitionFromPaperSequence');

    expect(test.getState('currentPage')).toEqual('ReviewPetitionFromPaper');
    expect(test.getState('form.caseType')).toBe(
      Case.CASE_TYPES_MAP.interestAbatement,
    );
  });

  it('should default to the party info tab when editing an in progress case', async () => {
    await navigateToStartCaseInternalPartiesTab(test);
  });

  it('should update stin file on the review screen when it has been changed', async () => {
    fakeFile.name = 'differentFakeFile.pdf';
    await test.runSequence('updateFormValueSequence', {
      key: 'stinFile',
      value: fakeFile,
    });

    await test.runSequence('reviewPetitionFromPaperSequence');

    expect(test.getState('currentPage')).toEqual('ReviewPetitionFromPaper');
    expect(test.getState('form.stinFile').name).toBe('differentFakeFile.pdf');
  });

  it('should display a preview of the uploaded petition file', async () => {
    await test.runSequence('openPdfPreviewModalSequence', {
      file: test.getState('form.petitionFile'),
      modalId: 'PDFPreviewModal-petitionFile',
    });
    expect(test.getState('modal.showModal')).toBe(
      'PDFPreviewModal-petitionFile',
    );
    await test.runSequence('dismissModalSequence');
    expect(test.getState('modal.showModal')).toBeUndefined();
  });

  it('should display a preview of the uploaded stin file', async () => {
    await test.runSequence('openPdfPreviewModalSequence', {
      file: test.getState('form.stinFile'),
      modalId: 'PDFPreviewModal-stinFile',
    });
    expect(test.getState('modal.showModal')).toBe('PDFPreviewModal-stinFile');
    await test.runSequence('dismissModalSequence');
    expect(test.getState('modal.showModal')).toBeUndefined();
  });

  it('should display a preview of the uploaded ods file', async () => {
    await test.runSequence('openPdfPreviewModalSequence', {
      file: test.getState('form.odsFile'),
      modalId: 'PDFPreviewModal-odsFile',
    });
    expect(test.getState('modal.showModal')).toBe('PDFPreviewModal-odsFile');
    await test.runSequence('dismissModalSequence');
    expect(test.getState('modal.showModal')).toBeUndefined();
  });

  it('should allow deletion of an uploaded petition pdf', async () => {
    await test.runSequence('goBackToStartCaseInternalSequence', {
      tab: 'partyInfo',
    });
    expect(test.getState('currentPage')).toEqual('StartCaseInternal');

    await test.runSequence('openConfirmDeletePDFModalSequence');
    await test.runSequence('removeScannedPdfSequence');
    expect(test.getState('form.petitionFile')).toBeUndefined();
  });

  it('should upload a new petition file', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'petitionFile',
      value: fakeFile,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'petitionFileSize',
      value: 1,
    });

    await test.runSequence('reviewPetitionFromPaperSequence');
    expect(test.getState('currentPage')).toEqual('ReviewPetitionFromPaper');
    expect(test.getState('form.petitionFile')).toBe(fakeFile);
  });

  it('should allow deletion of an uploaded statement of identification pdf', async () => {
    await test.runSequence('goBackToStartCaseInternalSequence', {
      tab: 'partyInfo',
    });
    expect(test.getState('currentPage')).toEqual('StartCaseInternal');

    await test.setState(
      'currentViewMetadata.documentSelectedForScan',
      'stinFile',
    );
    await test.runSequence('openConfirmDeletePDFModalSequence');
    await test.runSequence('removeScannedPdfSequence');
    expect(test.getState('form.stinFile')).toBeUndefined();
  });

  it('should upload a new statement of identification file', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'stinFile',
      value: fakeFile,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'stinFileSize',
      value: 1,
    });

    await test.runSequence('reviewPetitionFromPaperSequence');
    expect(test.getState('currentPage')).toEqual('ReviewPetitionFromPaper');
    expect(test.getState('form.stinFile')).toBe(fakeFile);
  });

  it('should allow deletion of an uploaded request for place of trial pdf', async () => {
    await test.runSequence('goBackToStartCaseInternalSequence', {
      tab: 'partyInfo',
    });
    expect(test.getState('currentPage')).toEqual('StartCaseInternal');

    await test.setState(
      'currentViewMetadata.documentSelectedForScan',
      'requestForPlaceOfTrialFile',
    );
    await test.runSequence('openConfirmDeletePDFModalSequence');
    await test.runSequence('removeScannedPdfSequence');
    expect(test.getState('form.requestForPlaceOfTrialFile')).toBeUndefined();
  });

  it('should upload a new request for place of trial file', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'requestForPlaceOfTrialFile',
      value: fakeFile,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'requestForPlaceOfTrialFileSize',
      value: 1,
    });

    await test.runSequence('reviewPetitionFromPaperSequence');
    expect(test.getState('currentPage')).toEqual('ReviewPetitionFromPaper');

    expect(test.getState('form.requestForPlaceOfTrialFile')).toBe(fakeFile);
  });

  it('should allow the deletion an uploaded ownership disclosure statement file', async () => {
    await test.setState(
      'currentViewMetadata.documentSelectedForScan',
      'odsFile',
    );
    await test.runSequence('openConfirmDeletePDFModalSequence');
    await test.runSequence('removeScannedPdfSequence');
    expect(test.getState('form.odsFile')).toBeUndefined();
  });

  it('should upload a new ownership disclosure statement file', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'odsFile',
      value: fakeFile,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'odsFileSize',
      value: 1,
    });

    await test.runSequence('reviewPetitionFromPaperSequence');
    expect(test.getState('currentPage')).toEqual('ReviewPetitionFromPaper');

    expect(test.getState('form.odsFile')).toBe(fakeFile);
  });

  it('should allow deletion of an uploaded application for waiver of filing fee file', async () => {
    await test.setState(
      'currentViewMetadata.documentSelectedForScan',
      'apwFile',
    );
    await test.runSequence('openConfirmDeletePDFModalSequence');
    await test.runSequence('removeScannedPdfSequence');
    expect(test.getState('form.apwFile')).toBeUndefined();
  });

  it('should upload a new application for waiver of filing fee file', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'apwFile',
      value: fakeFile,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'apwFileSize',
      value: 1,
    });

    await test.runSequence('reviewPetitionFromPaperSequence');
    expect(test.getState('currentPage')).toEqual('ReviewPetitionFromPaper');

    expect(test.getState('form.apwFile')).toBe(fakeFile);
  });

  it('should contain an order for notice of attachments', async () => {
    await test.runSequence('goBackToStartCaseInternalSequence', {
      tab: 'caseInfo',
    });
    expect(test.getState('currentPage')).toEqual('StartCaseInternal');

    await test.runSequence('updateFormValueSequence', {
      key: 'noticeOfAttachments',
      value: true,
    });
    expect(test.getState('form.noticeOfAttachments')).toBe(true);
  });

  it('should contain an order for amended petition', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'orderForAmendedPetition',
      value: true,
    });
    expect(test.getState('form.orderForAmendedPetition')).toBe(true);
  });

  it('should contain an order for amended petition and filing fee', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'orderForAmendedPetitionAndFilingFee',
      value: true,
    });
    expect(test.getState('form.orderForAmendedPetitionAndFilingFee')).toBe(
      true,
    );
  });

  it('should contain an order for filing fee', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'orderForFilingFee',
      value: true,
    });
    expect(test.getState('form.orderForFilingFee')).toBe(true);
  });

  it('should contain an order for ownership disclosure statement', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'orderForOds',
      value: true,
    });
    expect(test.getState('form.orderForOds')).toBe(true);
  });

  it('should contain an order for ratification', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'orderForRatification',
      value: true,
    });
    expect(test.getState('form.orderForRatification')).toBe(true);
  });

  it('should contain an order designating place of trial', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'orderDesignatingPlaceOfTrial',
      value: true,
    });
    expect(test.getState('form.orderDesignatingPlaceOfTrial')).toBe(true);
  });

  it('should contain an order to show cause', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'orderToShowCause',
      value: true,
    });
    expect(test.getState('form.orderToShowCause')).toBe(true);
  });

  it('should navigate to Document QC inbox page when saving an in progress case for later', async () => {
    await test.runSequence('reviewPetitionFromPaperSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('currentPage')).toEqual('ReviewPetitionFromPaper');

    await test.runSequence('saveInternalCaseForLaterSequence');

    expect(test.getState('currentPage')).toEqual('Messages');
  });
};

/**
 * @param test
 */
async function navigateToStartCaseInternalPartiesTab(test) {
  await test.runSequence('goBackToStartCaseInternalSequence', {
    tab: 'partyInfo',
  });
  expect(test.getState('currentPage')).toEqual('StartCaseInternal');
  expect(test.getState('currentViewMetadata.startCaseInternal.tab')).toBe(
    'partyInfo',
  );
}
