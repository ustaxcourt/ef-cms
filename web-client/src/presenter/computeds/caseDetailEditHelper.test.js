import { runCompute } from 'cerebral/test';

import { ContactFactory } from '../../../../shared/src/business/entities/contacts/ContactFactory';
import { caseDetailEditHelper } from './caseDetailEditHelper';

describe('case detail edit computed', () => {
  it('sets partyTypes from constants ', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.conservator,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.partyTypes).toBeDefined();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is conservator', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.conservator,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is corporation', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.corporation,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is custodian', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.custodian,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is donor', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.donor,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is estate', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.estate,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is estateWithoutExecutor', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.estateWithoutExecutor,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is guardian', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.guardian,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is nextFriendForIncompetentPerson', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.nextFriendForIncompetentPerson,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is nextFriendForMinor', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.nextFriendForMinor,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is partnershipAsTaxMattersPartner', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.partnershipAsTaxMattersPartner,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is partnershipBBA', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.partnershipBBA,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is partnershipOtherThanTaxMatters', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.partnershipOtherThanTaxMatters,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is petitioner', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.petitioner,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is petitionerDeceasedSpouse', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.petitionerDeceasedSpouse,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is petitionerSpouse', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is survivingSpouse', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.survivingSpouse,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is transferee', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.transferee,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is trust', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.trust,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showOwnershipDisclosureStatement true, sets document id if partyType is corporation', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          documents: [
            {
              documentId: '8eef49b4-9d40-4773-84ab-49e1e59e49cd',
              documentType: 'Ownership Disclosure Statement',
            },
          ],
          partyType: ContactFactory.PARTY_TYPES.corporation,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.showOwnershipDisclosureStatement).toBeTruthy();
    expect(result.ownershipDisclosureStatementDocumentId).toEqual(
      '8eef49b4-9d40-4773-84ab-49e1e59e49cd',
    );
  });

  it('sets showOwnershipDisclosureStatement true if partyType is corporation but there is no document for ODS', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          documents: [
            {
              documentId: '8eef49b4-9d40-4773-84ab-49e1e59e49cd',
              documentType: 'Petition',
            },
          ],
          partyType: ContactFactory.PARTY_TYPES.corporation,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.showOwnershipDisclosureStatement).toBeTruthy();
  });

  it('sets showOwnershipDisclosureStatement false if partyType is petitioner', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.petitioner,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.showOwnershipDisclosureStatement).toBeFalsy();
  });

  it('sets showReadOnlyTrialLocation true if isPaper is undefined and preferred trial city is selected', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          partyType: ContactFactory.PARTY_TYPES.petitioner,
          preferredTrialCity: 'Somewhere, USA',
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.showReadOnlyTrialLocation).toBeTruthy();
    expect(result.showNoTrialLocationSelected).toBeFalsy();
    expect(result.showRQTDocumentLink).toBeFalsy();
  });

  it('sets showNoTrialLocationSelected true if isPaper is true and a request for place of trial document does not exist', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          documents: [],
          isPaper: true,
          partyType: ContactFactory.PARTY_TYPES.petitioner,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.showNoTrialLocationSelected).toBeTruthy();
    expect(result.showReadOnlyTrialLocation).toBeFalsy();
    expect(result.showRQTDocumentLink).toBeFalsy();
  });

  it('sets showRQTDocumentLink true if isPaper is true and a request for place of trial document exists', () => {
    const result = runCompute(caseDetailEditHelper, {
      state: {
        caseDetail: {
          documents: [
            {
              documentId: '123',
              documentTitle: 'Request for Place of Trial at Somewhere, USA',
              documentType: 'Request for Place of Trial',
            },
          ],
          isPaper: true,
          partyType: ContactFactory.PARTY_TYPES.petitioner,
        },
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
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
});
