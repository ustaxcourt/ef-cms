import {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  PENALTY_TYPES,
  PROCEDURE_TYPES_MAP,
} from '../EntityConstants';
import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('isStjEligible', () => {
  it(`should return false when does not meet criteria`, () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.generalDocket,
        caseType: CASE_TYPES_MAP.innocentSpouse,
        procedureType: PROCEDURE_TYPES_MAP.regular,
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    const isStjEligible = Case.isStjEligible(caseEntity);

    expect(isStjEligible).toBe(false);
  });

  it(`should return true when case is small`, () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.generalDocket,
        caseType: CASE_TYPES_MAP.innocentSpouse,
        procedureType: PROCEDURE_TYPES_MAP.small,
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    const isStjEligible = Case.isStjEligible(caseEntity);

    expect(isStjEligible).toBe(true);
  });

  it(`should return true when case is an eligible case type`, () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.generalDocket,
        caseType: CASE_TYPES_MAP.disclosure,
        procedureType: PROCEDURE_TYPES_MAP.regular,
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    const isStjEligible = Case.isStjEligible(caseEntity);

    expect(isStjEligible).toBe(true);
  });

  it(`should return true when case is type deficiency and statistics are low`, () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.generalDocket,
        caseType: CASE_TYPES_MAP.deficiency,
        procedureType: PROCEDURE_TYPES_MAP.regular,
        statistics: [
          {
            determinationDeficiencyAmount: 123,
            determinationTotalPenalties: 456,
            irsDeficiencyAmount: 40000.0,
            irsTotalPenalties: 100.0,
            penalties: [
              {
                name: 'Penalty 1 (IRS)',
                penaltyAmount: 100.0,
                penaltyType: PENALTY_TYPES.IRS_PENALTY_AMOUNT,
              },
            ],
            statisticId: '7452b87f-7ba3-45c7-ae4b-bd1eab37c866',
            year: 2012,
            yearOrPeriod: 'Year',
          },
          {
            determinationDeficiencyAmount: 123,
            determinationTotalPenalties: 456,
            irsDeficiencyAmount: 40000.0,
            irsTotalPenalties: 100.0,
            penalties: [
              {
                name: 'Penalty 1 (IRS)',
                penaltyAmount: 100.0,
                penaltyType: PENALTY_TYPES.IRS_PENALTY_AMOUNT,
              },
            ],
            statisticId: '7452b87f-7ba3-45c7-ae4b-bd1eab37c867',
            year: 2012,
            yearOrPeriod: 'Year',
          },
        ],
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    const isStjEligible = Case.isStjEligible(caseEntity);

    expect(isStjEligible).toBe(true);
  });

  it(`should return false when case is type deficiency and statistics are high`, () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.generalDocket,
        caseType: CASE_TYPES_MAP.deficiency,
        procedureType: PROCEDURE_TYPES_MAP.regular,
        statistics: [
          {
            determinationDeficiencyAmount: 123,
            determinationTotalPenalties: 456,
            irsDeficiencyAmount: 40000.0,
            irsTotalPenalties: 100.0,
            penalties: [
              {
                name: 'Penalty 1 (IRS)',
                penaltyAmount: 100.0,
                penaltyType: PENALTY_TYPES.IRS_PENALTY_AMOUNT,
              },
            ],
            statisticId: '7452b87f-7ba3-45c7-ae4b-bd1eab37c866',
            year: 2012,
            yearOrPeriod: 'Year',
          },
          {
            determinationDeficiencyAmount: 123,
            determinationTotalPenalties: 456,
            irsDeficiencyAmount: 40000.0,
            irsTotalPenalties: 10000.0,
            penalties: [
              {
                name: 'Penalty 1 (IRS)',
                penaltyAmount: 10000.0,
                penaltyType: PENALTY_TYPES.IRS_PENALTY_AMOUNT,
              },
            ],
            statisticId: '7452b87f-7ba3-45c7-ae4b-bd1eab37c867',
            year: 2013,
            yearOrPeriod: 'Year',
          },
        ],
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    const isStjEligible = Case.isStjEligible(caseEntity);

    expect(isStjEligible).toBe(false);
  });

  it(`should return false when case is an ineligible case type`, () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.generalDocket,
        caseType: CASE_TYPES_MAP.passport,
        procedureType: PROCEDURE_TYPES_MAP.small,
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    const isStjEligible = Case.isStjEligible(caseEntity);

    expect(isStjEligible).toBe(false);
  });
});
