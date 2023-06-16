import {
  PARTY_TYPES,
  PAYMENT_STATUS,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { caseDetailEditHelper as caseDetailEditHelperComputed } from './caseDetailEditHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const caseDetailEditHelper = withAppContextDecorator(
  caseDetailEditHelperComputed,
  applicationContext,
);

describe('case detail edit computed', () => {
  it('sets partyTypes from constants', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        form: {
          partyType: PARTY_TYPES.conservator,
        },
      },
    });
    expect(result.partyTypes).toBeDefined();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is conservator', () => {
    const result = runCompute(caseDetailEditHelper, {
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
    const result = runCompute(caseDetailEditHelper, {
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
    const result = runCompute(caseDetailEditHelper, {
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
    const result = runCompute(caseDetailEditHelper, {
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
    const result = runCompute(caseDetailEditHelper, {
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
    const result = runCompute(caseDetailEditHelper, {
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
    const result = runCompute(caseDetailEditHelper, {
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
    const result = runCompute(caseDetailEditHelper, {
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
    const result = runCompute(caseDetailEditHelper, {
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
    const result = runCompute(caseDetailEditHelper, {
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
    const result = runCompute(caseDetailEditHelper, {
      state: {
        form: {
          partyType: PARTY_TYPES.partnershipBBA,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is partnershipOtherThanTaxMatters', () => {
    const result = runCompute(caseDetailEditHelper, {
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
    const result = runCompute(caseDetailEditHelper, {
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
    const result = runCompute(caseDetailEditHelper, {
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
    const result = runCompute(caseDetailEditHelper, {
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
    const result = runCompute(caseDetailEditHelper, {
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
    const result = runCompute(caseDetailEditHelper, {
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
    const result = runCompute(caseDetailEditHelper, {
      state: {
        form: {
          partyType: PARTY_TYPES.trust,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showCorporateDisclosureStatement true, sets document id if partyType is corporation', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        form: {
          docketEntries: [
            {
              docketEntryId: '8eef49b4-9d40-4773-84ab-49e1e59e49cd',
              documentType: 'Corporate Disclosure Statement',
            },
          ],
          partyType: PARTY_TYPES.corporation,
        },
      },
    });
    expect(result.showCorporateDisclosureStatement).toBeTruthy();
    expect(result.corporateDisclosureStatementDocumentId).toEqual(
      '8eef49b4-9d40-4773-84ab-49e1e59e49cd',
    );
  });

  it('sets showCorporateDisclosureStatement true if partyType is corporation but there is no document for CDS', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        form: {
          docketEntries: [
            {
              docketEntryId: '8eef49b4-9d40-4773-84ab-49e1e59e49cd',
              documentType: 'Petition',
            },
          ],
          partyType: PARTY_TYPES.corporation,
        },
      },
    });
    expect(result.showCorporateDisclosureStatement).toBeTruthy();
  });

  it('sets showCorporateDisclosureStatement false if partyType is petitioner', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        form: {
          partyType: PARTY_TYPES.petitioner,
        },
      },
    });
    expect(result.showCorporateDisclosureStatement).toBeFalsy();
  });

  it('sets showReadOnlyTrialLocation true if isPaper is undefined and preferred trial city is selected', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        form: {
          partyType: PARTY_TYPES.petitioner,
          preferredTrialCity: 'Fresno, California',
        },
      },
    });
    expect(result.showReadOnlyTrialLocation).toBeTruthy();
    expect(result.showNoTrialLocationSelected).toBeFalsy();
    expect(result.showRQTDocumentLink).toBeFalsy();
  });

  it('sets showRQTDocumentLink true if isPaper is true and a request for place of trial document exists', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        form: {
          docketEntries: [
            {
              docketEntryId: '123',
              documentTitle: 'Request for Place of Trial at Somewhere, USA',
              documentType: 'Request for Place of Trial',
            },
          ],
          isPaper: true,
          partyType: PARTY_TYPES.petitioner,
        },
      },
    });
    expect(result.showRQTDocumentLink).toBeTruthy();
    expect(result.requestForPlaceOfTrialDocumentId).toEqual('123');
    expect(result.requestForPlaceOfTrialDocumentTitle).toEqual(
      'Request for Place of Trial at Somewhere, USA',
    );
    expect(result.showNoTrialLocationSelected).toBeFalsy();
    expect(result.showReadOnlyTrialLocation).toBeFalsy();
  });

  it('sets requestForPlaceOfTrialDocumentId to docketEntryId and requestForPlaceOfTrialDocumentTitle to documentTitle when documentType is "Request for Place of Trial"', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        form: {
          docketEntries: [
            {
              docketEntryId: '123',
              documentTitle: 'Request for Place of Trial at Somewhere, USA',
              documentType: 'Request for Place of Trial',
            },
          ],
          isPaper: true,
          partyType: PARTY_TYPES.petitioner,
        },
      },
    });
    expect(result.requestForPlaceOfTrialDocumentId).toEqual('123');
    expect(result.requestForPlaceOfTrialDocumentTitle).toEqual(
      'Request for Place of Trial at Somewhere, USA',
    );
  });

  it('does not set requestForPlaceOfTrialDocumentId to docketEntryId and requestForPlaceOfTrialDocumentTitle to documentTitle when documentType is undefined', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        form: {
          docketEntries: [
            {
              docketEntryId: '456',
              documentTitle: 'Something',
              documentType: undefined,
            },
          ],
          isPaper: true,
          partyType: PARTY_TYPES.petitioner,
        },
      },
    });
    expect(result.requestForPlaceOfTrialDocumentId).toBeUndefined();
    expect(result.requestForPlaceOfTrialDocumentTitle).toBeUndefined();
  });

  it('sets showOrderForFilingFee true if petitionPaymentStatus is unpaid', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        form: {
          petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
        },
      },
    });
    expect(result.showOrderForFilingFee).toBeTruthy();
  });

  it('sets showOrderForFilingFee false if petitionPaymentStatus is paid', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        form: {
          petitionPaymentStatus: PAYMENT_STATUS.PAID,
        },
      },
    });
    expect(result.showOrderForFilingFee).toBeFalsy();
  });

  it('sets showOrderForFilingFee false if petitionPaymentStatus is waived', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        form: {
          petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
        },
      },
    });
    expect(result.showOrderForFilingFee).toBeFalsy();
  });

  it('sets receivedAtFormatted to formatted string', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        form: {
          receivedAt: '2001-12-01T20:00:00.000Z',
        },
      },
    });
    expect(result.receivedAtFormatted).toEqual('12/01/2001');
  });
});
