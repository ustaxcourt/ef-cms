import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { scanHelper as scanHelperComputed } from './scanHelper';
import { withAppContextDecorator } from '../../../src/withAppContext';

describe('scanHelper', () => {
  const { INITIAL_DOCUMENT_TYPES_MAP } = applicationContext.getConstants();

  const stateWithEmptyFormDocuments = {
    form: {
      docketEntries: [],
    },
  };

  const scanHelper = withAppContextDecorator(
    scanHelperComputed,
    applicationContext,
  );

  it('sets hasScanFeature to `true` for `petitionsclerk` user roles', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.petitionsClerk,
    });

    const result = runCompute(scanHelper, {
      state: stateWithEmptyFormDocuments,
    });

    expect(result.hasScanFeature).toBeTruthy();
  });

  it('sets hasScanFeature to `true` for `docketclerk` user roles', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.docketClerk,
    });

    const result = runCompute(scanHelper, {
      state: stateWithEmptyFormDocuments,
    });

    expect(result.hasScanFeature).toBeTruthy();
  });

  it('sets hasScanFeature to `true` for `adc` user roles', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.adc,
    });

    const result = runCompute(scanHelper, {
      state: stateWithEmptyFormDocuments,
    });

    expect(result.hasScanFeature).toBeTruthy();
  });

  it('sets hasScanFeature to `false` for `petitioner` user roles', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.petitioner,
    });

    const result = runCompute(scanHelper, {
      state: stateWithEmptyFormDocuments,
    });

    expect(result.hasScanFeature).toBeFalsy();
  });

  it('sets hasScanFeature to `false` for `practitioner` user roles', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.privatePractitioner,
    });

    const result = runCompute(scanHelper, {
      state: stateWithEmptyFormDocuments,
    });

    expect(result.hasScanFeature).toBeFalsy();
  });

  it('sets hasScanFeature to `false` for `respondent` user roles', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.irsPractitioner,
    });

    const result = runCompute(scanHelper, {
      state: stateWithEmptyFormDocuments,
    });

    expect(result.hasScanFeature).toBeFalsy();
  });

  it('shows the scanner source selection modal', () => {
    const result = runCompute(scanHelper, {
      state: {
        form: { docketEntries: [] },
        modal: {
          showModal: 'SelectScannerSourceModal',
        },
      },
    });
    expect(result.showScannerSourceModal).toBeTruthy();
  });

  it('gets the scanner sources from state', () => {
    const mockSources = ['Test Source 1', 'Test Source 2'];
    const result = runCompute(scanHelper, {
      state: {
        form: { docketEntries: [] },
        scanner: {
          sources: mockSources,
        },
      },
    });
    expect(result.sources.length).toEqual(2);
  });

  describe('stinFileCompleted', () => {
    it('should be true when document is on form and case has not been created yet', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            stinFile: {},
          },
        },
      });

      expect(result.stinFileCompleted).toBeTruthy();
    });

    it('should be true when document is on form', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [],
            stinFile: {},
          },
        },
      });

      expect(result.stinFileCompleted).toBeTruthy();
    });

    it('should be false when document is not on form', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [],
            stinFile: null,
          },
        },
      });
      expect(result.stinFileCompleted).toBeFalsy();
    });

    it('should be true when document is in form.docketEntries', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [
              {
                documentType: INITIAL_DOCUMENT_TYPES_MAP.stinFile,
              },
            ],
          },
        },
      });

      expect(result.stinFileCompleted).toBeTruthy();
    });

    it('should be false when document is not in form.docketEntries', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [],
          },
        },
      });

      expect(result.stinFileCompleted).toBeFalsy();
    });
  });

  describe('requestForPlaceOfTrialFileCompleted', () => {
    it('should be true when document is on form', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [],
            requestForPlaceOfTrialFile: {},
          },
        },
      });

      expect(result.requestForPlaceOfTrialFileCompleted).toBeTruthy();
    });

    it('should be false when document is not on form', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [],
            requestForPlaceOfTrialFile: null,
          },
        },
      });
      expect(result.requestForPlaceOfTrialFileCompleted).toBeFalsy();
    });

    it('should be true when document is in form.docketEntries', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [
              {
                documentType:
                  INITIAL_DOCUMENT_TYPES_MAP.requestForPlaceOfTrialFile,
              },
            ],
          },
        },
      });

      expect(result.requestForPlaceOfTrialFileCompleted).toBeTruthy();
    });

    it('should be false when document is not in form.docketEntries', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [],
          },
        },
      });

      expect(result.requestForPlaceOfTrialFileCompleted).toBeFalsy();
    });
  });

  describe('applicationForWaiverOfFilingFeeFileCompleted', () => {
    it('should be true when document is on form', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            applicationForWaiverOfFilingFeeFile: {},
            docketEntries: [],
          },
        },
      });

      expect(result.applicationForWaiverOfFilingFeeFileCompleted).toBeTruthy();
    });

    it('should be false when document is not on form', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            applicationForWaiverOfFilingFeeFile: null,
            docketEntries: [],
          },
        },
      });
      expect(result.applicationForWaiverOfFilingFeeFileCompleted).toBeFalsy();
    });

    it('should be true when document is in form.docketEntries', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [
              {
                documentType:
                  INITIAL_DOCUMENT_TYPES_MAP.applicationForWaiverOfFilingFeeFile,
              },
            ],
          },
        },
      });

      expect(result.applicationForWaiverOfFilingFeeFileCompleted).toBeTruthy();
    });

    it('should be false when document is not in form.docketEntries', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [],
          },
        },
      });

      expect(result.applicationForWaiverOfFilingFeeFileCompleted).toBeFalsy();
    });
  });

  describe('petitionFileCompleted', () => {
    it('should be true when document is on form', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [],
            petitionFile: {},
          },
        },
      });

      expect(result.petitionFileCompleted).toBeTruthy();
    });

    it('should be false when document is not on form', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [],
            petitionFileCompleted: null,
          },
        },
      });
      expect(result.petitionFileCompleted).toBeFalsy();
    });

    it('should be true when document is in form.docketEntries', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [
              {
                documentType: INITIAL_DOCUMENT_TYPES_MAP.petitionFile,
              },
            ],
          },
        },
      });

      expect(result.petitionFileCompleted).toBeTruthy();
    });

    it('should be false when document is not in form.docketEntries', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [],
          },
        },
      });

      expect(result.petitionFileCompleted).toBeFalsy();
    });
  });

  describe('corporateDisclosureFileCompleted', () => {
    it('should be true when document is on form', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            corporateDisclosureFile: {},
            docketEntries: [],
          },
        },
      });

      expect(result.corporateDisclosureFileCompleted).toBeTruthy();
    });

    it('should be false when document is not on form', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            corporateDisclosureFile: null,
            docketEntries: [],
          },
        },
      });
      expect(result.corporateDisclosureFileCompleted).toBeFalsy();
    });

    it('should be true when document is in form.docketEntries', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [
              {
                documentType:
                  INITIAL_DOCUMENT_TYPES_MAP.corporateDisclosureFile,
              },
            ],
          },
        },
      });

      expect(result.corporateDisclosureFileCompleted).toBeTruthy();
    });

    it('should be false when document is not in form.docketEntries', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [],
          },
        },
      });

      expect(result.corporateDisclosureFileCompleted).toBeFalsy();
    });
  });
});
