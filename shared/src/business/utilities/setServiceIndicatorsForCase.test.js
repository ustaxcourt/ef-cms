import { ROLES, SERVICE_INDICATOR_TYPES } from '../entities/EntityConstants';
import { setServiceIndicatorsForCase } from './setServiceIndicatorsForCase';

let baseCaseDetail;

const basePractitioner = {
  email: 'practitioner1@example.com',
  name: 'Test Practitioner',
  representingPrimary: true,
  role: ROLES.privatePractitioner,
  serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
};

const baseRespondent = {
  email: 'flexionustc+respondent@gmail.com',
  name: 'Test Respondent',
  respondentId: '123-abc-123-abc',
  role: ROLES.irsPractitioner,
  serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
  userId: 'abc-123-abc-123',
};

describe('setServiceIndicatorsForCases', () => {
  beforeEach(() => {
    baseCaseDetail = {
      contactPrimary: {
        email: 'petitioner@example.com',
        name: 'Test Petitioner',
      },
      isPaper: false,
    };
  });

  it(`should return ${SERVICE_INDICATOR_TYPES.SI_PAPER} for a Petitioner (contactPrimary) with no representing counsel filing by paper`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      isPaper: true,
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(result.contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );
  });

  it(`should return ${SERVICE_INDICATOR_TYPES.SI_ELECTRONIC} for a Petitioner (contactPrimary) with no representing counsel filing electronically`, async () => {
    const caseDetail = { ...baseCaseDetail };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(result.contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });

  it(`should return ${SERVICE_INDICATOR_TYPES.SI_NONE} for a Petitioner (contactPrimary) with ${SERVICE_INDICATOR_TYPES.SI_NONE} already set as an override`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      contactPrimary: {
        email: 'petitioner@example.com',
        name: 'Test Petitioner',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
      },
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(result.contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_NONE,
    );
  });

  it(`should return ${SERVICE_INDICATOR_TYPES.SI_NONE} for a Petitioner (contactPrimary) with representing counsel filing by paper`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      isPaper: true,
      privatePractitioners: [{ ...basePractitioner }],
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(result.contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_NONE,
    );
  });

  it(`should return ${SERVICE_INDICATOR_TYPES.SI_NONE} for a Petitioner (contactPrimary) with representing counsel filing electronically`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      isPaper: false,
      privatePractitioners: [{ ...basePractitioner }],
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(result.contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_NONE,
    );
  });

  it(`should return ${SERVICE_INDICATOR_TYPES.SI_PAPER} for a Petitioner (contactSecondary) with no representing counsel`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      contactSecondary: {
        name: 'Test Petitioner2',
      },
      privatePractitioners: [{ ...basePractitioner }],
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(result.contactSecondary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );
  });

  it(`should return ${SERVICE_INDICATOR_TYPES.SI_NONE} for a Petitioner (contactSecondary) with a serviceIndicator already set as an override`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      contactSecondary: {
        name: 'Test Petitioner2',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
      },
      privatePractitioners: [{ ...basePractitioner }],
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(result.contactSecondary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_NONE,
    );
  });

  it(`should return ${SERVICE_INDICATOR_TYPES.SI_NONE} for a Petitioner (contactSecondary) with representing counsel`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      contactSecondary: {
        name: 'Test Petitioner2',
      },
      privatePractitioners: [
        { ...basePractitioner, representingSecondary: true },
      ],
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(result.contactSecondary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_NONE,
    );
  });

  it('should not modify the serviceIndicator on the Practitioner', async () => {
    const caseDetail = {
      ...baseCaseDetail,
      isPaper: true,
      privatePractitioners: [{ ...basePractitioner }],
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(result.privatePractitioners[0].serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );
  });

  it('should not modify the serviceIndicator on the Respondent', async () => {
    const caseDetail = {
      ...baseCaseDetail,
      irsPractitioners: [{ ...baseRespondent }],
    };
    const result = setServiceIndicatorsForCase(caseDetail);

    expect(result.irsPractitioners[0].serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );
  });
});
