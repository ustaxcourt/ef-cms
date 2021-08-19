const {
  ANSWER_CUTOFF_AMOUNT_IN_DAYS,
  ANSWER_CUTOFF_UNIT,
  CASE_STATUS_TYPES,
} = require('../EntityConstants');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { prepareDateFromString } = require('../../utilities/DateHandler');

describe('checkForReadyForTrial', () => {
  it('should not change the status if no answer docketEntries have been filed', () => {
    const caseToCheck = new Case(
      {
        docketEntries: [],
        status: CASE_STATUS_TYPES.generalDocket,
      },
      {
        applicationContext,
      },
    ).checkForReadyForTrial();
    expect(caseToCheck.status).toEqual(CASE_STATUS_TYPES.generalDocket);
  });

  it('should not change the status if an answer docket entry has been filed, but the cutoff has not elapsed', () => {
    const caseToCheck = new Case(
      {
        docketEntries: [
          {
            createdAt: prepareDateFromString().toISOString(),
            eventCode: 'A',
          },
        ],
        status: CASE_STATUS_TYPES.generalDocket,
      },
      {
        applicationContext,
      },
    ).checkForReadyForTrial();
    expect(caseToCheck.status).toEqual(CASE_STATUS_TYPES.generalDocket);
  });

  it('should not change the status if a non answer docket entry has been filed before the cutoff', () => {
    const caseToCheck = new Case(
      {
        docketEntries: [
          {
            createdAt: prepareDateFromString()
              .subtract(1, 'year')
              .toISOString(),
            eventCode: 'ZZZs',
          },
        ],
        status: CASE_STATUS_TYPES.generalDocket,
      },
      {
        applicationContext,
      },
    ).checkForReadyForTrial();
    expect(caseToCheck.status).toEqual(CASE_STATUS_TYPES.generalDocket);
  });

  it("should NOT change the status to 'Ready for Trial' when an answer document has been filed on the cutoff", () => {
    // eslint-disable-next-line spellcheck/spell-checker
    /*
    Note: As of this writing on 2020-03-20, there may be a bug in the `moment` library as it pertains to
    leap-years and/or leap-days and maybe daylight saving time, too. Meaning that if *this* test runs
    at a time when it is calculating date/time differences across the existence of a leap year and DST, it may fail.
    */
    const caseToCheck = new Case(
      {
        docketEntries: [
          {
            createdAt: prepareDateFromString()
              .subtract(ANSWER_CUTOFF_AMOUNT_IN_DAYS, ANSWER_CUTOFF_UNIT)
              .toISOString(),
            eventCode: 'A',
          },
        ],
        status: CASE_STATUS_TYPES.generalDocket,
      },
      {
        applicationContext,
      },
    ).checkForReadyForTrial();

    expect(caseToCheck.status).not.toEqual(
      CASE_STATUS_TYPES.generalDocketReadyForTrial,
    );
  });

  it("should not change the status to 'Ready for Trial' when an answer document has been filed before the cutoff but case is not 'Not at issue'", () => {
    const createdAt = prepareDateFromString()
      .subtract(ANSWER_CUTOFF_AMOUNT_IN_DAYS + 10, ANSWER_CUTOFF_UNIT)
      .toISOString();

    const caseToCheck = new Case(
      {
        docketEntries: [
          {
            createdAt,
            eventCode: 'A',
          },
        ],
        status: CASE_STATUS_TYPES.new,
      },
      {
        applicationContext,
      },
    ).checkForReadyForTrial();

    expect(caseToCheck.status).toEqual(CASE_STATUS_TYPES.new);
  });

  it("should change the status to 'Ready for Trial' when an answer document has been filed before the cutoff", () => {
    const createdAt = prepareDateFromString()
      .subtract(ANSWER_CUTOFF_AMOUNT_IN_DAYS + 10, ANSWER_CUTOFF_UNIT)
      .toISOString();

    const caseToCheck = new Case(
      {
        docketEntries: [
          {
            createdAt,
            eventCode: 'A',
          },
        ],
        status: CASE_STATUS_TYPES.generalDocket,
      },
      {
        applicationContext,
      },
    ).checkForReadyForTrial();

    expect(caseToCheck.status).toEqual(
      CASE_STATUS_TYPES.generalDocketReadyForTrial,
    );
  });
});
