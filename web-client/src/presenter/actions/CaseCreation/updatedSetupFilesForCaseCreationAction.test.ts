import { runAction } from '@web-client/presenter/test.cerebral';
import { updatedSetupFilesForCaseCreationAction } from '@web-client/presenter/actions/CaseCreation/updatedSetupFilesForCaseCreationAction';

describe('updatedSetupFilesForCaseCreationAction', () => {
  it('should return all files from petitionFormatted in state', async () => {
    const result = await runAction(updatedSetupFilesForCaseCreationAction, {
      state: {
        petitionFormatted: {
          applicationForWaiverOfFilingFeeFile:
            'TEST_applicationForWaiverOfFilingFeeFile',
          corporateDisclosureFile: 'TEST_corporateDisclosureFile',
          hasIrsNotice: true,
          irsNotices: [{ file: 'TEST_attachmentToPetitionFile' }],
          petitionFile: 'TEST_petitionFile',
          primaryDocumentFile: 'TEST_primaryDocumentFile',
          requestForPlaceOfTrialFile: 'TEST_requestForPlaceOfTrialFile',
          stinFile: 'TEST_stinFile',
        },
      },
    });

    expect(result.output).toEqual({
      files: {
        applicationForWaiverOfFilingFee:
          'TEST_applicationForWaiverOfFilingFeeFile',
        attachmentToPetition: ['TEST_attachmentToPetitionFile'],
        corporateDisclosure: 'TEST_corporateDisclosureFile',
        petition: 'TEST_petitionFile',
        primary: 'TEST_primaryDocumentFile',
        requestForPlaceOfTrial: 'TEST_requestForPlaceOfTrialFile',
        stin: 'TEST_stinFile',
      },
    });
  });

  it('should return all files from petitionFormatted in state and use default when petitionFile is falsey', async () => {
    const result = await runAction(updatedSetupFilesForCaseCreationAction, {
      state: {
        petitionFormatted: {
          applicationForWaiverOfFilingFeeFile:
            'TEST_applicationForWaiverOfFilingFeeFile',
          corporateDisclosureFile: 'TEST_corporateDisclosureFile',
          hasIrsNotice: true,
          irsNotices: [{ file: 'TEST_attachmentToPetitionFile' }],
          petitionFile: '',
          primaryDocumentFile: 'TEST_primaryDocumentFile',
          requestForPlaceOfTrialFile: 'TEST_requestForPlaceOfTrialFile',
          stinFile: 'TEST_stinFile',
        },
      },
    });

    expect(result.output).toEqual({
      files: {
        applicationForWaiverOfFilingFee:
          'TEST_applicationForWaiverOfFilingFeeFile',
        attachmentToPetition: ['TEST_attachmentToPetitionFile'],
        corporateDisclosure: 'TEST_corporateDisclosureFile',
        petition: undefined,
        primary: 'TEST_primaryDocumentFile',
        requestForPlaceOfTrial: 'TEST_requestForPlaceOfTrialFile',
        stin: 'TEST_stinFile',
      },
    });
  });
});
