import {
  INITIAL_DOCUMENT_TYPES,
  ROLES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { scanHelper as scanHelperComputed } from './scanHelper';
import { withAppContextDecorator } from '../../../src/withAppContext';

describe('scanHelper', () => {
  const stateWithEmptyFormDocuments = {
    form: {
      docketEntries: [],
    },
  };

  const scanHelper = withAppContextDecorator(
    scanHelperComputed,
    applicationContext,
  );

  it('sets hasScanFeature to true for petitionsclerk user roles', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.petitionsClerk,
    });

    const result = runCompute(scanHelper, {
      state: stateWithEmptyFormDocuments,
    });

    expect(result.hasScanFeature).toEqual(true);
  });

  it('sets hasScanFeature to true for docketclerk user roles', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.docketClerk,
    });

    const result = runCompute(scanHelper, {
      state: stateWithEmptyFormDocuments,
    });

    expect(result.hasScanFeature).toEqual(true);
  });

  it('sets hasScanFeature to true for adc user roles', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.adc,
    });

    const result = runCompute(scanHelper, {
      state: stateWithEmptyFormDocuments,
    });

    expect(result.hasScanFeature).toEqual(true);
  });

  it('sets hasScanFeature to false for petitioner user roles', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.petitioner,
    });

    const result = runCompute(scanHelper, {
      state: stateWithEmptyFormDocuments,
    });

    expect(result.hasScanFeature).toEqual(false);
  });

  it('sets hasScanFeature to false for practitioner user roles', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.privatePractitioner,
    });

    const result = runCompute(scanHelper, {
      state: stateWithEmptyFormDocuments,
    });

    expect(result.hasScanFeature).toEqual(false);
  });

  it('sets hasScanFeature to false for respondent user roles', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.irsPractitioner,
    });

    const result = runCompute(scanHelper, {
      state: stateWithEmptyFormDocuments,
    });

    expect(result.hasScanFeature).toEqual(false);
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
    expect(result.showScannerSourceModal).toEqual(true);
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

      expect(result.STINFileCompleted).toEqual(true);
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

      expect(result.STINFileCompleted).toEqual(true);
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
      expect(result.STINFileCompleted).toEqual(false);
    });

    it('should be true when document is in form.docketEntries', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [
              {
                eventCode: INITIAL_DOCUMENT_TYPES.stin.eventCode,
              },
            ],
          },
        },
      });

      expect(result.STINFileCompleted).toEqual(true);
    });

    it('should be false when document is not in form.docketEntries', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [],
          },
        },
      });

      expect(result.STINFileCompleted).toEqual(false);
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

      expect(result.RQTFileCompleted).toEqual(true);
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
      expect(result.RQTFileCompleted).toEqual(false);
    });

    it('should be true when document is in form.docketEntries', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [
              {
                eventCode:
                  INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
              },
            ],
          },
        },
      });

      expect(result.RQTFileCompleted).toEqual(true);
    });

    it('should be false when document is not in form.docketEntries', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [],
          },
        },
      });

      expect(result.RQTFileCompleted).toEqual(false);
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

      expect(result.APWFileCompleted).toEqual(true);
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
      expect(result.APWFileCompleted).toEqual(false);
    });

    it('should be true when document is in form.docketEntries', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [
              {
                eventCode:
                  INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee
                    .eventCode,
              },
            ],
          },
        },
      });

      expect(result.APWFileCompleted).toEqual(true);
    });

    it('should be false when document is not in form.docketEntries', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [],
          },
        },
      });

      expect(result.APWFileCompleted).toEqual(false);
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

      expect(result.PFileCompleted).toEqual(true);
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
      expect(result.PFileCompleted).toEqual(false);
    });

    it('should be true when document is in form.docketEntries', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [
              {
                eventCode: INITIAL_DOCUMENT_TYPES.petition.eventCode,
              },
            ],
          },
        },
      });

      expect(result.PFileCompleted).toEqual(true);
    });

    it('should be false when document is not in form.docketEntries', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [],
          },
        },
      });

      expect(result.PFileCompleted).toEqual(false);
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

      expect(result.DISCFileCompleted).toEqual(true);
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
      expect(result.DISCFileCompleted).toEqual(false);
    });

    it('should be true when document is in form.docketEntries', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [
              {
                eventCode: INITIAL_DOCUMENT_TYPES.corporateDisclosure.eventCode,
              },
            ],
          },
        },
      });

      expect(result.DISCFileCompleted).toEqual(true);
    });

    it('should be false when document is not in form.docketEntries', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [],
          },
        },
      });

      expect(result.DISCFileCompleted).toEqual(false);
    });
  });

  describe('ATPFileCompleted', () => {
    it('should be true when document is on form', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            attachmentToPetitionFile: {},
            docketEntries: [],
          },
        },
      });

      expect(result.ATPFileCompleted).toEqual(true);
    });

    it('should be false when document is not on form', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            attachmentToPetitionFile: null,
            docketEntries: [],
          },
        },
      });
      expect(result.ATPFileCompleted).toEqual(false);
    });

    it('should be true when document is in form.docketEntries', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [
              {
                eventCode:
                  INITIAL_DOCUMENT_TYPES.attachmentToPetition.eventCode,
              },
            ],
          },
        },
      });

      expect(result.ATPFileCompleted).toEqual(true);
    });

    it('should be false when document is not in form.docketEntries', () => {
      const result = runCompute(scanHelper, {
        state: {
          form: {
            docketEntries: [],
          },
        },
      });

      expect(result.ATPFileCompleted).toEqual(false);
    });
  });
});
