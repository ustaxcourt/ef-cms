import { runCompute } from 'cerebral/test';

import { ContactFactory } from '../../../../shared/src/business/entities/contacts/ContactFactory';
import { startCaseInternalHelper } from './startCaseInternalHelper';

describe('case detail edit computed', () => {
  it('sets partyTypes from constants ', () => {
    const result = runCompute(startCaseInternalHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
      },
    });
    expect(result.partyTypes).toBeDefined();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is conservator', () => {
    const result = runCompute(startCaseInternalHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.conservator,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is corporation', () => {
    const result = runCompute(startCaseInternalHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.corporation,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is custodian', () => {
    const result = runCompute(startCaseInternalHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.custodian,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is donor', () => {
    const result = runCompute(startCaseInternalHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.donor,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is estate', () => {
    const result = runCompute(startCaseInternalHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.estate,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is estateWithoutExecutor', () => {
    const result = runCompute(startCaseInternalHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.estateWithoutExecutor,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is guardian', () => {
    const result = runCompute(startCaseInternalHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.guardian,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is nextFriendForIncompetentPerson', () => {
    const result = runCompute(startCaseInternalHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.nextFriendForIncompetentPerson,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is nextFriendForMinor', () => {
    const result = runCompute(startCaseInternalHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.nextFriendForMinor,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is partnershipAsTaxMattersPartner', () => {
    const result = runCompute(startCaseInternalHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.partnershipAsTaxMattersPartner,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is partnershipBBA', () => {
    const result = runCompute(startCaseInternalHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.partnershipBBA,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is partnershipOtherThanTaxMatters', () => {
    const result = runCompute(startCaseInternalHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.partnershipOtherThanTaxMatters,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is petitioner', () => {
    const result = runCompute(startCaseInternalHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.petitioner,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is petitionerDeceasedSpouse', () => {
    const result = runCompute(startCaseInternalHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.petitionerDeceasedSpouse,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is petitionerSpouse', () => {
    const result = runCompute(startCaseInternalHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is survivingSpouse', () => {
    const result = runCompute(startCaseInternalHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.survivingSpouse,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showPrimaryContact true, showSecondaryContact false when the partyType is transferee', () => {
    const result = runCompute(startCaseInternalHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.transferee,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
  });

  it('sets showPrimaryContact true, showSecondaryContact true when the partyType is trust', () => {
    const result = runCompute(startCaseInternalHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.trust,
        },
      },
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
  });

  it('sets showOwnershipDisclosureStatement true if partyType is corporation', () => {
    const result = runCompute(startCaseInternalHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.corporation,
        },
      },
    });
    expect(result.showOwnershipDisclosureStatement).toBeTruthy();
  });

  it('sets showOwnershipDisclosureStatement false if partyType is petitioner', () => {
    const result = runCompute(startCaseInternalHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
        },
        form: {
          partyType: ContactFactory.PARTY_TYPES.petitioner,
        },
      },
    });
    expect(result.showOwnershipDisclosureStatement).toBeFalsy();
  });
});
