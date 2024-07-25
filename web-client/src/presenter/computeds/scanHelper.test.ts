import { INITIAL_DOCUMENT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import {
  adcUser,
  docketClerkUser,
  irsPractitionerUser,
  petitionerUser,
  petitionsClerkUser,
  privatePractitionerUser,
} from '@shared/test/mockUsers';
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
    const result = runCompute(scanHelper, {
      state: { ...stateWithEmptyFormDocuments, user: petitionsClerkUser },
    });

    expect(result.hasScanFeature).toEqual(true);
  });

  it('sets hasScanFeature to true for docketclerk user roles', () => {
    const result = runCompute(scanHelper, {
      state: { ...stateWithEmptyFormDocuments, user: docketClerkUser },
    });

    expect(result.hasScanFeature).toEqual(true);
  });

  it('sets hasScanFeature to true for adc user roles', () => {
    const result = runCompute(scanHelper, {
      state: { ...stateWithEmptyFormDocuments, user: adcUser },
    });

    expect(result.hasScanFeature).toEqual(true);
  });

  it('sets hasScanFeature to false for petitioner user roles', () => {
    const result = runCompute(scanHelper, {
      state: { ...stateWithEmptyFormDocuments, user: petitionerUser },
    });

    expect(result.hasScanFeature).toEqual(false);
  });

  it('sets hasScanFeature to false for practitioner user roles', () => {
    const result = runCompute(scanHelper, {
      state: {
        ...stateWithEmptyFormDocuments,
        user: privatePractitionerUser,
      },
    });

    expect(result.hasScanFeature).toEqual(false);
  });

  it('sets hasScanFeature to false for respondent user roles', () => {
    const result = runCompute(scanHelper, {
      state: { ...stateWithEmptyFormDocuments, user: irsPractitionerUser },
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
        user: petitionerUser,
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
        user: petitionerUser,
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
          user: petitionerUser,
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
          user: petitionerUser,
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
          user: petitionerUser,
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
          user: petitionerUser,
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
          user: petitionerUser,
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
          user: petitionerUser,
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
          user: petitionerUser,
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
          user: petitionerUser,
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
          user: petitionerUser,
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
          user: petitionerUser,
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
          user: petitionerUser,
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
          user: petitionerUser,
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
          user: petitionerUser,
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
          user: petitionerUser,
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
          user: petitionerUser,
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
          user: petitionerUser,
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
          user: petitionerUser,
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
          user: petitionerUser,
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
          user: petitionerUser,
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
          user: petitionerUser,
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
          user: petitionerUser,
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
          user: petitionerUser,
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
          user: petitionerUser,
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
          user: petitionerUser,
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
          user: petitionerUser,
        },
      });

      expect(result.ATPFileCompleted).toEqual(false);
    });
  });

  describe('disableModalSelect', () => {
    it('should be true when scan mode and scanner are not selected', () => {
      const result = runCompute(scanHelper, {
        state: {
          modal: {
            scanMode: null,
            scanner: null,
          },
          scanner: {
            sources: ['sourceA, sourceB'],
          },
        },
      });

      expect(result.disableModalSelect).toEqual(true);
    });

    it('should be true when scan mode is not selected', () => {
      const result = runCompute(scanHelper, {
        state: {
          modal: {
            scanMode: null,
            scanner: 'someScanner',
          },
          scanner: {
            sources: ['sourceA, sourceB'],
          },
        },
      });

      expect(result.disableModalSelect).toEqual(true);
    });

    it('should be true when scanner is not selected', () => {
      const result = runCompute(scanHelper, {
        state: {
          modal: {
            scanMode: 'someScanMode',
            scanner: null,
          },
          scanner: {
            sources: ['sourceA, sourceB'],
          },
        },
      });

      expect(result.disableModalSelect).toEqual(true);
    });

    it('should be true when the scanner sources property in state is an empty array', () => {
      const result = runCompute(scanHelper, {
        state: {
          modal: {
            scanMode: 'someScanMode',
            scanner: 'someScanner',
          },
          scanner: {
            sources: [],
          },
        },
      });

      expect(result.disableModalSelect).toEqual(true);
    });

    it('should be true when there the scanner sources property in state is undefined', () => {
      const result = runCompute(scanHelper, {
        state: {
          modal: {
            scanMode: 'someScanMode',
            scanner: 'someScanner',
          },
        },
      });

      expect(result.disableModalSelect).toEqual(true);
    });

    it('should be false when scan mode and scanner are selected', () => {
      const result = runCompute(scanHelper, {
        state: {
          modal: {
            scanMode: 'someScanMode',
            scanner: 'someScanner',
          },
          scanner: {
            sources: ['sourceA, sourceB'],
          },
        },
      });

      expect(result.disableModalSelect).toEqual(false);
    });
  });
});
