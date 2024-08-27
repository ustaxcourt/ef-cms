import {
  CASE_TYPES_MAP,
  FILING_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import {
  irsPractitionerUser,
  petitionerUser,
  privatePractitionerUser,
} from '@shared/test/mockUsers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { startCaseHelper as startCaseHelperComputed } from './startCaseHelper';
import { withAppContextDecorator } from '../../withAppContext';

describe('startCaseHelper', () => {
  const { PARTY_TYPES } = applicationContext.getConstants();

  const startCaseHelper = withAppContextDecorator(
    startCaseHelperComputed,
    applicationContext,
  );

  it('sets showPetitionFileValid false when the petition file is not added to the petition', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: {},
        user: petitionerUser,
      },
    });
    expect(result.showPetitionFileValid).toBeFalsy();
  });

  it('sets showPetitionFileValid when the petition file is added to the petition', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: { petitionFile: true },
        user: petitionerUser,
      },
    });
    expect(result.showPetitionFileValid).toBeTruthy();
  });

  it('sets showCorporateDisclosure when the party is business', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: {
          filingType: 'A business',
          partyType: true,
          petitionFile: true,
        },
        user: petitionerUser,
      },
    });
    expect(result.showCorporateDisclosure).toBeTruthy();
  });

  it('clears showCorporateDisclosure when the party is not business', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: {
          filingType: 'not A business',
          partyType: true,
          petitionFile: true,
        },
        user: petitionerUser,
      },
    });
    expect(result.showCorporateDisclosure).toBeFalsy();
  });

  it('sets showHasIrsNoticeOptions when hasIrsNotice is Yes', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: {
          hasIrsNotice: true,
        },
        user: petitionerUser,
      },
    });
    expect(result.showHasIrsNoticeOptions).toBeTruthy();
    expect(result.showNotHasIrsNoticeOptions).toBeFalsy();
  });

  it('sets showNotHasIrsNoticeOptions when hasIrsNotice is No', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: {
          hasIrsNotice: false,
        },
        user: petitionerUser,
      },
    });
    expect(result.showNotHasIrsNoticeOptions).toBeTruthy();
    expect(result.showHasIrsNoticeOptions).toBeFalsy();
  });

  it('returns petitioner filing types if user is petitioner role', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: {
          hasIrsNotice: false,
        },
        user: petitionerUser,
      },
    });
    expect(result.filingTypes).toEqual(FILING_TYPES.petitioner);
  });

  it('returns privatePractitioner filing types if user is privatePractitioner role', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: {
          hasIrsNotice: false,
        },
        user: privatePractitionerUser,
      },
    });
    expect(result.filingTypes).toEqual(FILING_TYPES.privatePractitioner);
  });

  it('returns petitioner filing types by default if user is not petitioner or privatePractitioner role', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: {
          hasIrsNotice: false,
        },
        user: irsPractitionerUser,
      },
    });
    expect(result.filingTypes).toEqual(FILING_TYPES.petitioner);
  });

  it('should set contactPrimaryLabel correctly when form.partyType is one of petitioner', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: {
          contactPrimary: { name: 'Michael G. Scott' },
          partyType: PARTY_TYPES.petitioner,
        },
        user: petitionerUser,
      },
    });

    expect(result.contactPrimaryLabel).toEqual('Your contact information');
  });

  it('should set contactPrimaryLabel correctly when form.partyType is one of petitionerDeceasedSpouse', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: {
          contactPrimary: { name: 'Michael G. Scott' },
          contactSecondary: { name: 'Carol Stills' },
          partyType: PARTY_TYPES.petitionerDeceasedSpouse,
        },
        user: petitionerUser,
      },
    });

    expect(result.contactPrimaryLabel).toEqual('Your contact information');
  });

  it('should set contactPrimaryLabel correctly when form.partyType is one of petitionerSpouse', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: {
          contactPrimary: { name: 'Michael G. Scott' },
          contactSecondary: { name: 'Carol Stills' },
          partyType: PARTY_TYPES.petitionerSpouse,
        },
        user: petitionerUser,
      },
    });

    expect(result.contactPrimaryLabel).toEqual('Your contact information');
  });

  it('should set contactSecondaryLabel correctly when form.partyType is one of petitionerDeceasedSpouse', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: {
          contactPrimary: { name: 'Michael G. Scott' },
          contactSecondary: { name: 'Carol Stills' },
          partyType: PARTY_TYPES.petitionerDeceasedSpouse,
        },
        user: petitionerUser,
      },
    });

    expect(result.contactSecondaryLabel).toEqual(
      'Spouse’s contact information',
    );
  });

  it('should set contactSecondaryLabel correctly when form.partyType is one of petitionerSpouse', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: {
          contactPrimary: { name: 'Michael G. Scott' },
          contactSecondary: { name: 'Carol Stills' },
          partyType: PARTY_TYPES.petitionerSpouse,
        },
        user: petitionerUser,
      },
    });

    expect(result.contactSecondaryLabel).toEqual(
      'Spouse’s contact information',
    );
  });

  it('should set contactPrimaryLabel correctly when form.partyType is NOT petitioner, petitionerDeceasedSpouse, or petitionerSpouse', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: {
          contactPrimary: { name: '' },
          partyType: PARTY_TYPES.trust,
        },
        user: petitionerUser,
      },
    });

    expect(result.contactPrimaryLabel).toEqual('Contact Information');
  });

  it('should set contactSecondaryLabel correctly when form.partyType is NOT  petitionerDeceasedSpouse or petitionerSpouse', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: {
          contactPrimary: { name: '' },
          partyType: PARTY_TYPES.trust,
        },
        user: petitionerUser,
      },
    });

    expect(result.contactSecondaryLabel).toEqual('Contact Information');
  });

  it('should set and format documentTabs for displaying header contents', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: {
          contactPrimary: { name: '' },
          partyType: PARTY_TYPES.trust,
        },
        user: petitionerUser,
      },
    });

    expect(result.documentTabs).toEqual([
      {
        documentTitle: 'Petition',
        documentType: 'petitionFile',
        eventCode: 'P',
        fileName: 'petitionFile',
        sort: 0,
        tabTitle: 'Petition',
      },
      {
        documentType: 'stinFile',
        eventCode: 'STIN',
        fileName: 'stinFile',
        sort: 1,
        tabTitle: 'STIN',
      },
      {
        documentTitle: 'Attachment to Petition',
        documentType: 'attachmentToPetitionFile',
        eventCode: 'ATP',
        fileName: 'attachmentToPetitionFile',
        sort: 2,
        tabTitle: 'ATP',
      },
      {
        documentTitle: 'Request for Place of Trial at [Place]',
        documentType: 'requestForPlaceOfTrialFile',
        eventCode: 'RQT',
        fileName: 'requestForPlaceOfTrialFile',
        sort: 3,
        tabTitle: 'RQT',
      },
      {
        documentTitle: 'Corporate Disclosure Statement',
        documentType: 'corporateDisclosureFile',
        eventCode: 'DISC',
        fileName: 'corporateDisclosureFile',
        sort: 4,
        tabTitle: 'CDS',
      },
      {
        documentTitle: 'Application for Waiver of Filing Fee',
        documentType: 'applicationForWaiverOfFilingFeeFile',
        eventCode: 'APW',
        fileName: 'applicationForWaiverOfFilingFeeFile',
        sort: 5,
        tabTitle: 'APW',
      },
    ]);
  });

  it('should set notice legend correctly when user is petitioner', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: {
          hasIrsNotice: false,
        },
        user: petitionerUser,
      },
    });
    expect(result.noticeLegend).toEqual(
      'Did you receive a notice from the IRS?',
    );
  });

  it('should set notice legend correctly when user is private practitioner', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: {
          hasIrsNotice: false,
        },
        user: privatePractitionerUser,
      },
    });
    expect(result.noticeLegend).toEqual(
      'Did the petitioner receive a notice from the IRS?',
    );
  });

  describe('formattedCaseType', () => {
    it('should be Disclosure if form.caseType is Disclosure1', () => {
      const result = runCompute(startCaseHelper, {
        state: {
          form: {
            caseType: 'Disclosure1',
          },
          user: petitionerUser,
        },
      });

      expect(result.formattedCaseType).toEqual(CASE_TYPES_MAP.disclosure);
    });

    it('should be Disclosure if form.caseType is Disclosure2', () => {
      const result = runCompute(startCaseHelper, {
        state: {
          form: {
            caseType: 'Disclosure2',
          },
          user: petitionerUser,
        },
      });

      expect(result.formattedCaseType).toEqual(CASE_TYPES_MAP.disclosure);
    });

    it('should be form.caseType if form.caseType is not Disclosure1 or Disclosure2', () => {
      const result = runCompute(startCaseHelper, {
        state: {
          form: {
            caseType: CASE_TYPES_MAP.deficiency,
          },
          user: petitionerUser,
        },
      });

      expect(result.formattedCaseType).toEqual(CASE_TYPES_MAP.deficiency);
    });
  });

  describe('irsNoticeRequiresRedactionAcknowledgement', () => {
    it('should be true when file is present in at least one notice in state.irsNoticeUploadFormInfo', () => {
      const result = runCompute(startCaseHelper, {
        state: {
          form: {},
          irsNoticeUploadFormInfo: [
            {
              file: {},
            },
            {},
          ],
          user: petitionerUser,
        },
      });

      expect(result.irsNoticeRequiresRedactionAcknowledgement).toEqual(true);
    });

    it('should be false when file is not present in any notice in state.irsNoticeUploadFormInfo', () => {
      const result = runCompute(startCaseHelper, {
        state: {
          form: {},
          irsNoticeUploadFormInfo: [{}, {}],
          user: petitionerUser,
        },
      });

      expect(result.irsNoticeRequiresRedactionAcknowledgement).toEqual(false);
    });
  });
});
