const {
  CONTACT_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../entities/EntityConstants');
const {
  getContactPrimary,
  getContactSecondary,
  getPetitionerById,
} = require('../entities/cases/Case');
const {
  setServiceIndicatorsForCase,
} = require('./setServiceIndicatorsForCase');

describe('setServiceIndicatorsForCases', () => {
  let baseCaseDetail;

  const PRIMARY_CONTACT_ID = '0f9a8128-53fb-416c-98b5-91c077511ee4';
  const SECONDARY_CONTACT_ID = '7682af03-7123-4f1b-bcc9-f62714fd2084';
  const OTHER_CONTACT_ID = '3534de5d-2de9-4b6d-9394-a3c92eda2b41';

  const basePractitioner = {
    email: 'practitioner1@example.com',
    name: 'Test Practitioner',
    representing: [],
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

  beforeEach(() => {
    baseCaseDetail = {
      isPaper: false,
      petitioners: [
        {
          contactId: PRIMARY_CONTACT_ID,
          contactType: CONTACT_TYPES.primary,
          email: 'petitioner@example.com',
          name: 'Test Petitioner',
        },
      ],
      privatePractitioners: [],
    };
  });

  it(`should return ${SERVICE_INDICATOR_TYPES.SI_PAPER} for a Petitioner without an email (contactPrimary) with no representing counsel filing by paper`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      isPaper: true,
      petitioners: [{ ...baseCaseDetail.petitioners[0], email: undefined }],
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(getContactPrimary(result).serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );
  });

  it(`should return ${SERVICE_INDICATOR_TYPES.SI_ELECTRONIC} for a Petitioner (contactPrimary) with no representing counsel filing electronically`, async () => {
    const caseDetail = { ...baseCaseDetail };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(getContactPrimary(result).serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });

  it(`should return ${SERVICE_INDICATOR_TYPES.SI_ELECTRONIC} for a Petitioner (contactSecondary) with an email and no representing counsel`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      petitioners: [
        ...baseCaseDetail.petitioners,
        {
          contactType: CONTACT_TYPES.secondary,
          email: 'petitioner2@example.com',
          name: 'Test Petitioner2',
        },
      ],
      privatePractitioners: [{ ...basePractitioner }],
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(getContactSecondary(result).serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });

  it(`should return ${SERVICE_INDICATOR_TYPES.SI_ELECTRONIC} for a Petitioner (contactSecondary) with an email and no representing counsel on a paper case`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      isPaper: true,
      petitioners: [
        ...baseCaseDetail.petitioners,
        {
          contactType: CONTACT_TYPES.secondary,
          email: 'petitioner2@example.com',
          name: 'Test Petitioner2',
        },
      ],
      privatePractitioners: [{ ...basePractitioner }],
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(getContactSecondary(result).serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });

  it(`should return ${SERVICE_INDICATOR_TYPES.SI_NONE} for a Petitioner (contactPrimary) with ${SERVICE_INDICATOR_TYPES.SI_NONE} already set as an override`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      petitioners: [
        {
          contactType: CONTACT_TYPES.primary,
          email: 'petitioner@example.com',
          name: 'Test Petitioner',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
        },
      ],
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(getContactPrimary(result).serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_NONE,
    );
  });

  it(`should return ${SERVICE_INDICATOR_TYPES.SI_NONE} for a Petitioner (contactPrimary) with representing counsel filing by paper`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      isPaper: true,
      privatePractitioners: [
        { ...basePractitioner, representing: [PRIMARY_CONTACT_ID] },
      ],
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(getContactPrimary(result).serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_NONE,
    );
  });

  it(`should return ${SERVICE_INDICATOR_TYPES.SI_NONE} for a Petitioner (contactPrimary) with representing counsel filing electronically`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      isPaper: false,
      privatePractitioners: [
        { ...basePractitioner, representing: [PRIMARY_CONTACT_ID] },
      ],
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(getContactPrimary(result).serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_NONE,
    );
  });

  it(`should return ${SERVICE_INDICATOR_TYPES.SI_PAPER} for a Petitioner (contactSecondary) with no representing counsel`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      petitioners: [
        ...baseCaseDetail.petitioners,
        {
          contactType: CONTACT_TYPES.secondary,
          name: 'Test Petitioner2',
        },
      ],
      privatePractitioners: [{ ...basePractitioner }],
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(getContactSecondary(result).serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );
  });

  it(`should return ${SERVICE_INDICATOR_TYPES.SI_PAPER} for a Petitioner (contactPrimary) with no representing counsel and no email`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      petitioners: [
        {
          contactId: PRIMARY_CONTACT_ID,
          contactType: CONTACT_TYPES.primary,
          email: null,
          name: 'Test Petitioner',
        },
      ],
      privatePractitioners: [],
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(getContactPrimary(result).serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );
  });

  it(`should return ${SERVICE_INDICATOR_TYPES.SI_NONE} for a Petitioner (contactSecondary) with a serviceIndicator already set as an override`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      petitioners: [
        ...baseCaseDetail.petitioners,
        {
          contactType: CONTACT_TYPES.secondary,
          name: 'Test Petitioner2',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
        },
      ],
      privatePractitioners: [{ ...basePractitioner }],
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(getContactSecondary(result).serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_NONE,
    );
  });

  it(`should return ${SERVICE_INDICATOR_TYPES.SI_NONE} for a Petitioner (contactSecondary) with representing counsel`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      petitioners: [
        ...baseCaseDetail.petitioners,
        {
          contactId: SECONDARY_CONTACT_ID,
          contactType: CONTACT_TYPES.secondary,
          name: 'Test Petitioner2',
        },
      ],
      privatePractitioners: [
        { ...basePractitioner, representing: [SECONDARY_CONTACT_ID] },
      ],
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(getContactSecondary(result).serviceIndicator).toEqual(
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

  it(`should return ${SERVICE_INDICATOR_TYPES.SI_NONE} for an other petitioner with representing counsel`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      petitioners: [
        ...baseCaseDetail.petitioners,
        {
          contactId: OTHER_CONTACT_ID,
          contactType: CONTACT_TYPES.otherPetitioner,
          name: 'Test Petitioner2',
        },
      ],
      privatePractitioners: [
        { ...basePractitioner, representing: [OTHER_CONTACT_ID] },
      ],
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(
      getPetitionerById(result, OTHER_CONTACT_ID).serviceIndicator,
    ).toEqual(SERVICE_INDICATOR_TYPES.SI_NONE);
  });
});
