import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { runCompute } from 'cerebral/test';
import { scanHelper as scanHelperComputed } from './scanHelper';
import { withAppContextDecorator } from '../../../src/withAppContext';

describe('scanHelper', () => {
  const { INITIAL_DOCUMENT_TYPES_MAP } = applicationContext.getConstants();

  const stateWithEmptyFormDocuments = {
    form: {
      documents: [],
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
        form: { documents: [] },
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
        form: { documents: [] },
        scanner: {
          sources: mockSources,
        },
      },
    });
    expect(result.sources.length).toEqual(2);
  });

  it('sets applicationForWaiverOfFilingFeeFileCompleted if document is on form', () => {
    const result = runCompute(scanHelper, {
      state: {
        form: {
          applicationForWaiverOfFilingFeeFile: null,
          documents: [],
        },
      },
    });
    expect(result.applicationForWaiverOfFilingFeeFileCompleted).toBeFalsy();

    const result2 = runCompute(scanHelper, {
      state: {
        form: {
          applicationForWaiverOfFilingFeeFile: {},
          documents: [],
        },
      },
    });
    expect(result2.applicationForWaiverOfFilingFeeFileCompleted).toBeTruthy();
  });

  it('sets petitionFileCompleted if document is on form', () => {
    const result = runCompute(scanHelper, {
      state: {
        form: {
          documents: [],
          petitionFile: null,
        },
      },
    });
    expect(result.petitionFileCompleted).toBeFalsy();

    const result2 = runCompute(scanHelper, {
      state: {
        form: {
          documents: [],
          petitionFile: {},
        },
      },
    });
    expect(result2.petitionFileCompleted).toBeTruthy();
  });

  it('sets ownershipDisclosureFileCompleted if document is on form', () => {
    const result = runCompute(scanHelper, {
      state: {
        form: {
          documents: [],
          ownershipDisclosureFile: null,
        },
      },
    });
    expect(result.ownershipDisclosureFileCompleted).toBeFalsy();

    const result2 = runCompute(scanHelper, {
      state: {
        form: {
          documents: [],
          ownershipDisclosureFile: {},
        },
      },
    });
    expect(result2.ownershipDisclosureFileCompleted).toBeTruthy();
  });

  describe('stinFileCompleted', () => {
    it('should be true when document is on form', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            documents: [],
            stinFile: {},
          },
        },
      });

      expect(result.stinFileCompleted).toBeTruthy();
    });

    // it('should be false when document is not on form', () => {
    //   const result = runCompute(scanHelper, {
    //     state: {
    //       form: {
    //         documents: [],
    //         requestForPlaceOfTrialFile: null,
    //       },
    //     },
    //   });
    //   expect(result.requestForPlaceOfTrialFileCompleted).toBeFalsy();
    // });

    // it('should be true when document is in form.documents', () => {
    //   const result = runCompute(scanHelper, {
    //     state: {
    //       form: {
    //         documents: [
    //           {
    //             documentType:
    //               INITIAL_DOCUMENT_TYPES_MAP.requestForPlaceOfTrialFile,
    //           },
    //         ],
    //       },
    //     },
    //   });

    //   expect(result.requestForPlaceOfTrialFileCompleted).toBeTruthy();
    // });

    // it('should be false when document is not in form.documents', () => {
    //   const result = runCompute(scanHelper, {
    //     state: {
    //       form: {
    //         documents: [],
    //       },
    //     },
    //   });

    //   expect(result.requestForPlaceOfTrialFileCompleted).toBeFalsy();
    // });

    // it('sets stinFileCompleted if document is on form', () => {
    //   const result = runCompute(scanHelper, {
    //     state: {
    //       form: {
    //         documents: [],
    //         stinFile: null,
    //       },
    //     },
    //   });
    //   expect(result.stinFileCompleted).toBeFalsy();

    //   const result2 = runCompute(scanHelper, {
    //     state: {
    //       form: {
    //         documents: [],
    //         stinFile: {},
    //       },
    //     },
    //   });
    //   expect(result2.stinFileCompleted).toBeTruthy();
    // });
  });

  describe('requestForPlaceOfTrialFileCompleted', () => {
    it('should be true when document is on form', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            documents: [],
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
            documents: [],
            requestForPlaceOfTrialFile: null,
          },
        },
      });
      expect(result.requestForPlaceOfTrialFileCompleted).toBeFalsy();
    });

    it('should be true when document is in form.documents', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            documents: [
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

    it('should be false when document is not in form.documents', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            documents: [],
          },
        },
      });

      expect(result.requestForPlaceOfTrialFileCompleted).toBeFalsy();
    });
  });
});
