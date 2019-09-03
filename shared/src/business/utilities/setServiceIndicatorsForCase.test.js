import {
  constants,
  setServiceIndicatorsForCase,
} from './setServiceIndicatorsForCase';

const baseCaseDetail = {
  contactPrimary: {
    email: 'petitioner@example.com',
    name: 'Test Petitioner',
  },
  isPaper: false,
};

const basePractitioner = {
  email: 'practitioner1@example.com',
  name: 'Test Practitioner',
  representingPrimary: true,
  role: 'practitioner',
};

const baseRespondent = {
  email: 'flexionustc+respondent@gmail.com',
  name: 'Test Respondent',
  respondentId: '123-abc-123-abc',
  role: 'respondent',
  userId: 'abc-123-abc-123',
};

describe('setServiceIndicatorsForCases', () => {
  it(`should return ${constants.SI_PAPER} for a Petitioner (contactPrimary) with no representing counsel filing by paper`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      isPaper: true,
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(result.contactPrimary.serviceIndicator).toEqual(constants.SI_PAPER);
  });

  it(`should return ${constants.SI_ELECTRONIC} for a Petitioner (contactPrimary) with no representing counsel filing electronically`, async () => {
    const caseDetail = { ...baseCaseDetail };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(result.contactPrimary.serviceIndicator).toEqual(
      constants.SI_ELECTRONIC,
    );
  });

  it(`should return ${constants.SI_NONE} for a Petitioner (contactPrimary) with representing counsel filing by paper`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      isPaper: true,
      practitioners: [{ ...basePractitioner }],
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(result.contactPrimary.serviceIndicator).toEqual(constants.SI_NONE);
  });

  it(`should return ${constants.SI_NONE} for a Petitioner (contactPrimary) with representing counsel filing electronically`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      isPaper: false,
      practitioners: [{ ...basePractitioner }],
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(result.contactPrimary.serviceIndicator).toEqual(constants.SI_NONE);
  });

  it(`should return ${constants.SI_PAPER} for a Petitioner (contactSecondary) with no representing counsel`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      contactSecondary: {
        name: 'Test Petitioner2',
      },
      practitioners: [{ ...basePractitioner }],
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(result.contactSecondary.serviceIndicator).toEqual(
      constants.SI_PAPER,
    );
  });

  it(`should return ${constants.SI_NONE} for a Petitioner (contactSecondary) with representing counsel`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      contactSecondary: {
        name: 'Test Petitioner2',
      },
      practitioners: [{ ...basePractitioner, representingSecondary: true }],
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(result.contactSecondary.serviceIndicator).toEqual(constants.SI_NONE);
  });

  it(`should return ${constants.SI_PAPER} for a Practitioner WITHOUT an account filing by paper`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      isPaper: true,
      practitioners: [{ ...basePractitioner }],
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(result.practitioners[0].serviceIndicator).toEqual(
      constants.SI_PAPER,
    );
  });

  it(`should return ${constants.SI_ELECTRONIC} for a Practitioner WITH an account filing by paper`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      isPaper: true,
      practitioners: [{ ...basePractitioner, userId: '321-cba-321-cba' }],
    };

    const result = setServiceIndicatorsForCase(caseDetail);

    expect(result.practitioners[0].serviceIndicator).toEqual(
      constants.SI_ELECTRONIC,
    );
  });

  it(`should return ${constants.SI_ELECTRONIC} for a Respondent`, async () => {
    const caseDetail = {
      ...baseCaseDetail,
      respondents: [{ ...baseRespondent }],
    };
    const result = setServiceIndicatorsForCase(caseDetail);

    expect(result.respondents[0].serviceIndicator).toEqual(
      constants.SI_ELECTRONIC,
    );
  });
});
