import { INITIAL_DOCUMENT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  mockAdcUser,
  mockDocketClerkUser,
  mockIrsPractitionerUser,
  mockPetitionerUser,
  mockPetitionsClerkUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';
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
      state: { ...stateWithEmptyFormDocuments, user: mockPetitionsClerkUser },
    });

    expect(result.hasScanFeature).toEqual(true);
  });

  it('sets hasScanFeature to true for docketclerk user roles', () => {
    const result = runCompute(scanHelper, {
      state: { ...stateWithEmptyFormDocuments, user: mockDocketClerkUser },
    });

    expect(result.hasScanFeature).toEqual(true);
  });

  it('sets hasScanFeature to true for adc user roles', () => {
    const result = runCompute(scanHelper, {
      state: { ...stateWithEmptyFormDocuments, user: mockAdcUser },
    });

    expect(result.hasScanFeature).toEqual(true);
  });

  it('sets hasScanFeature to false for petitioner user roles', () => {
    const result = runCompute(scanHelper, {
      state: { ...stateWithEmptyFormDocuments, user: mockPetitionerUser },
    });

    expect(result.hasScanFeature).toEqual(false);
  });

  it('sets hasScanFeature to false for practitioner user roles', () => {
    const result = runCompute(scanHelper, {
      state: {
        ...stateWithEmptyFormDocuments,
        user: mockPrivatePractitionerUser,
      },
    });

    expect(result.hasScanFeature).toEqual(false);
  });

  it('sets hasScanFeature to false for respondent user roles', () => {
    const result = runCompute(scanHelper, {
      state: { ...stateWithEmptyFormDocuments, user: mockIrsPractitionerUser },
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
        user: mockPetitionerUser,
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
        user: mockPetitionerUser,
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
          user: mockPetitionerUser,
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
          user: mockPetitionerUser,
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
          user: mockPetitionerUser,
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
          user: mockPetitionerUser,
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
          user: mockPetitionerUser,
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
          user: mockPetitionerUser,
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
          user: mockPetitionerUser,
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
          user: mockPetitionerUser,
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
          user: mockPetitionerUser,
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
          user: mockPetitionerUser,
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
          user: mockPetitionerUser,
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
          user: mockPetitionerUser,
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
          user: mockPetitionerUser,
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
          user: mockPetitionerUser,
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
          user: mockPetitionerUser,
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
          user: mockPetitionerUser,
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
          user: mockPetitionerUser,
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
          user: mockPetitionerUser,
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
          user: mockPetitionerUser,
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
          user: mockPetitionerUser,
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
          user: mockPetitionerUser,
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
          user: mockPetitionerUser,
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
          user: mockPetitionerUser,
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
          user: mockPetitionerUser,
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
          user: mockPetitionerUser,
        },
      });

      expect(result.ATPFileCompleted).toEqual(false);
    });
  });
});
