import { applicationContext } from '../../applicationContext';
import { petitionerUser } from '@shared/test/mockUsers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { startCaseInternalHelper as startCaseInternalHelperComputed } from './startCaseInternalHelper';
import { withAppContextDecorator } from '../../withAppContext';

const startCaseInternalHelper = withAppContextDecorator(
  startCaseInternalHelperComputed,
  applicationContext,
);

describe('case detail edit computed', () => {
  let PARTY_TYPES;

  ({ PARTY_TYPES } = applicationContext.getConstants());

  describe('partyTypes', () => {
    it('sets partyTypes from constants', () => {
      const result = runCompute(startCaseInternalHelper, {
        state: {},
      });
      expect(result.partyTypes).toBeDefined();
    });
  });

  describe('showPrimaryContact and showSecondaryContact', () => {
    it('sets showPrimaryContact true, showSecondaryContact false when the partyType is conservator', () => {
      const result = runCompute(startCaseInternalHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.conservator,
          },
        },
      });
      expect(result.showPrimaryContact).toBeTruthy();
      expect(result.showSecondaryContact).toBeFalsy();
    });

    it('sets showPrimaryContact true, showSecondaryContact false when the partyType is corporation', () => {
      const result = runCompute(startCaseInternalHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.corporation,
          },
        },
      });
      expect(result.showPrimaryContact).toBeTruthy();
      expect(result.showSecondaryContact).toBeFalsy();
    });

    it('sets showPrimaryContact true, showSecondaryContact false when the partyType is custodian', () => {
      const result = runCompute(startCaseInternalHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.custodian,
          },
        },
      });
      expect(result.showPrimaryContact).toBeTruthy();
      expect(result.showSecondaryContact).toBeFalsy();
    });

    it('sets showPrimaryContact true, showSecondaryContact false when the partyType is donor', () => {
      const result = runCompute(startCaseInternalHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.donor,
          },
        },
      });
      expect(result.showPrimaryContact).toBeTruthy();
      expect(result.showSecondaryContact).toBeFalsy();
    });

    it('sets showPrimaryContact true, showSecondaryContact false when the partyType is estate', () => {
      const result = runCompute(startCaseInternalHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.estate,
          },
        },
      });
      expect(result.showPrimaryContact).toBeTruthy();
      expect(result.showSecondaryContact).toBeFalsy();
    });

    it('sets showPrimaryContact true, showSecondaryContact false when the partyType is estateWithoutExecutor', () => {
      const result = runCompute(startCaseInternalHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.estateWithoutExecutor,
          },
        },
      });
      expect(result.showPrimaryContact).toBeTruthy();
      expect(result.showSecondaryContact).toBeFalsy();
    });

    it('sets showPrimaryContact true, showSecondaryContact false when the partyType is guardian', () => {
      const result = runCompute(startCaseInternalHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.guardian,
          },
        },
      });
      expect(result.showPrimaryContact).toBeTruthy();
      expect(result.showSecondaryContact).toBeFalsy();
    });

    it('sets showPrimaryContact true, showSecondaryContact false when the partyType is nextFriendForIncompetentPerson', () => {
      const result = runCompute(startCaseInternalHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.nextFriendForIncompetentPerson,
          },
        },
      });
      expect(result.showPrimaryContact).toBeTruthy();
      expect(result.showSecondaryContact).toBeFalsy();
    });

    it('sets showPrimaryContact true, showSecondaryContact false when the partyType is nextFriendForMinor', () => {
      const result = runCompute(startCaseInternalHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.nextFriendForMinor,
          },
        },
      });
      expect(result.showPrimaryContact).toBeTruthy();
      expect(result.showSecondaryContact).toBeFalsy();
    });

    it('sets showPrimaryContact true, showSecondaryContact false when the partyType is partnershipAsTaxMattersPartner', () => {
      const result = runCompute(startCaseInternalHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.partnershipAsTaxMattersPartner,
          },
        },
      });
      expect(result.showPrimaryContact).toBeTruthy();
      expect(result.showSecondaryContact).toBeFalsy();
    });

    it('sets showPrimaryContact true, showSecondaryContact false when the partyType is partnershipBBA', () => {
      const result = runCompute(startCaseInternalHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.partnershipBBA,
          },
        },
      });
      expect(result.showPrimaryContact).toBeTruthy();
      expect(result.showSecondaryContact).toBeFalsy();
    });

    it('sets showPrimaryContact true, showSecondaryContact false when the partyType is partnershipOtherThanTaxMatters', () => {
      const result = runCompute(startCaseInternalHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.partnershipOtherThanTaxMatters,
          },
        },
      });
      expect(result.showPrimaryContact).toBeTruthy();
      expect(result.showSecondaryContact).toBeFalsy();
    });

    it('sets showPrimaryContact true, showSecondaryContact false when the partyType is petitioner', () => {
      const result = runCompute(startCaseInternalHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.petitioner,
          },
        },
      });
      expect(result.showPrimaryContact).toBeTruthy();
      expect(result.showSecondaryContact).toBeFalsy();
    });

    it('sets showPrimaryContact true, showSecondaryContact true when the partyType is petitionerDeceasedSpouse', () => {
      const result = runCompute(startCaseInternalHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.petitionerDeceasedSpouse,
          },
        },
      });
      expect(result.showPrimaryContact).toBeTruthy();
      expect(result.showSecondaryContact).toBeTruthy();
    });

    it('sets showPrimaryContact true, showSecondaryContact true when the partyType is petitionerSpouse', () => {
      const result = runCompute(startCaseInternalHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.petitionerSpouse,
          },
        },
      });
      expect(result.showPrimaryContact).toBeTruthy();
      expect(result.showSecondaryContact).toBeTruthy();
    });

    it('sets showPrimaryContact true, showSecondaryContact false when the partyType is survivingSpouse', () => {
      const result = runCompute(startCaseInternalHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.survivingSpouse,
          },
        },
      });
      expect(result.showPrimaryContact).toBeTruthy();
      expect(result.showSecondaryContact).toBeFalsy();
    });

    it('sets showPrimaryContact true, showSecondaryContact false when the partyType is transferee', () => {
      const result = runCompute(startCaseInternalHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.transferee,
          },
        },
      });
      expect(result.showPrimaryContact).toBeTruthy();
      expect(result.showSecondaryContact).toBeFalsy();
    });

    it('sets showPrimaryContact true, showSecondaryContact false when the partyType is trust', () => {
      const result = runCompute(startCaseInternalHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.trust,
          },
        },
      });
      expect(result.showPrimaryContact).toBeTruthy();
      expect(result.showSecondaryContact).toBeFalsy();
    });
  });

  describe('showOrderForCorporateDisclosureStatement', () => {
    it('sets showOrderForCorporateDisclosureStatement true if partyType is corporation', () => {
      const result = runCompute(startCaseInternalHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.corporation,
          },
        },
      });
      expect(result.showOrderForCorporateDisclosureStatement).toBeTruthy();
    });

    it('sets showOrderForCorporateDisclosureStatement false if partyType is petitioner', () => {
      const result = runCompute(startCaseInternalHelper, {
        state: {
          form: {
            partyType: PARTY_TYPES.petitioner,
          },
        },
      });
      expect(result.showOrderForCorporateDisclosureStatement).toBeFalsy();
    });
  });

  describe('showOrderForFilingFee', () => {
    it('sets showOrderForFilingFee true if petitionPaymentStatus is unpaid', () => {
      const result = runCompute(startCaseInternalHelper, {
        state: {
          form: {
            petitionPaymentStatus:
              applicationContext.getConstants().PAYMENT_STATUS.UNPAID,
          },
        },
      });
      expect(result.showOrderForFilingFee).toBeTruthy();
    });

    it('sets showOrderForFilingFee false if petitionPaymentStatus is NOT unpaid', () => {
      const result = runCompute(startCaseInternalHelper, {
        state: {
          form: {
            petitionPaymentStatus:
              applicationContext.getConstants().PAYMENT_STATUS.PAID,
          },
        },
      });
      expect(result.showOrderForFilingFee).toBeFalsy();
    });
  });

  describe('documentTabs', () => {
    it('should set and format documentTabs for displaying header contents', () => {
      const result = runCompute(startCaseInternalHelper, {
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
  });
});
