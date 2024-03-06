import {
  CASE_TYPES_MAP,
  FILING_TYPES,
  ROLES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { startCaseHelper as startCaseHelperComputed } from './startCaseHelper';
import { withAppContextDecorator } from '../../withAppContext';

describe('startCaseHelper', () => {
  const { PARTY_TYPES } = applicationContext.getConstants();

  const startCaseHelper = withAppContextDecorator(
    startCaseHelperComputed,
    applicationContext,
  );

  beforeAll(() => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.petitioner,
    });
  });

  it('sets showPetitionFileValid false when the petition file is not added to the petition', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: {},
      },
    });
    expect(result.showPetitionFileValid).toBeFalsy();
  });

  it('sets showPetitionFileValid when the petition file is added to the petition', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: { petitionFile: true },
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
      },
    });
    expect(result.filingTypes).toEqual(FILING_TYPES.petitioner);
  });

  it('returns privatePractitioner filing types if user is privatePractitioner role', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.privatePractitioner,
    });

    const result = runCompute(startCaseHelper, {
      state: {
        form: {
          hasIrsNotice: false,
        },
      },
    });
    expect(result.filingTypes).toEqual(FILING_TYPES.privatePractitioner);
  });

  it('returns petitioner filing types by default if user is not petitioner or privatePractitioner role', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.irsPractitioner,
    });

    const result = runCompute(startCaseHelper, {
      state: {
        form: {
          hasIrsNotice: false,
        },
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

  describe('formattedCaseType', () => {
    it('should be Disclosure if form.caseType is Disclosure1', () => {
      const result = runCompute(startCaseHelper, {
        state: {
          form: {
            caseType: 'Disclosure1',
          },
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
        },
      });

      expect(result.formattedCaseType).toEqual(CASE_TYPES_MAP.deficiency);
    });
  });
});
