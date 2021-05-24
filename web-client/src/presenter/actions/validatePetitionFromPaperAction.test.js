import {
  aggregateStatisticsErrors,
  validatePetitionFromPaperAction,
} from './validatePetitionFromPaperAction';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('validatePetitionFromPaperAction', () => {
  let successStub;
  let errorStub;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
    presenter.providers.applicationContext = applicationContext;
  });

  it('runs validation on the petition from paper with a successful result', async () => {
    applicationContext
      .getUseCases()
      .validatePetitionFromPaperInteractor.mockReturnValue(null);

    await runAction(validatePetitionFromPaperAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('runs validation on the petition from paper with an invalid result', async () => {
    applicationContext
      .getUseCases()
      .validatePetitionFromPaperInteractor.mockReturnValue('validation errors');

    await runAction(validatePetitionFromPaperAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });

  it('aggregates statistics errors', async () => {
    const mockError = {
      caseCaption: 'Enter a case caption',
      irsDeficiencyAmount: '"statistics[0].irsDeficiencyAmount" is required',
      statistics: [
        { deficiency: 'enter deficiency amount', index: 1 },
        { index: 2, irsTotalPenalties: 'enter total penalties' },
      ],
      year: '"statistics[0].year" is required',
    };

    applicationContext
      .getUseCases()
      .validatePetitionFromPaperInteractor.mockReturnValue(mockError);

    await runAction(validatePetitionFromPaperAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          statistics: [
            { yearOrPeriod: 'Year' },
            { yearOrPeriod: 'Period' },
            { yearOrPeriod: 'Year' },
          ],
        },
      },
    });

    expect(errorStub.mock.calls[0][0].errors).toEqual({
      caseCaption: expect.anything(),
      statistics: [
        {},
        {
          enterAllValues:
            'Enter period, deficiency amount, and total penalties',
          index: 1,
        },
        {
          enterAllValues: 'Enter year, deficiency amount, and total penalties',
          index: 2,
        },
      ],
    });
  });

  it('should call the error path, providing an error display order and errorDisplayMap, when errors are found', async () => {
    applicationContext
      .getUseCases()
      .validatePetitionFromPaperInteractor.mockReturnValue({
        petitioners: [
          {
            inCareOf: 'Enter name for in care of',
          },
        ],
      });

    await runAction(validatePetitionFromPaperAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          statistics: [],
        },
      },
    });

    expect(errorStub.mock.calls[0][0].errorDisplayMap).toEqual({
      statistics: 'Statistics',
    });
  });

  it('should call the error path with contactPrimary errors from petitioners array', async () => {
    const mockInCareOfError = 'Enter name for in care of';
    applicationContext
      .getUseCases()
      .validatePetitionFromPaperInteractor.mockReturnValue({
        petitioners: [{ inCareOf: mockInCareOfError, index: 0 }],
      });

    await runAction(validatePetitionFromPaperAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(errorStub.mock.calls[0][0].errors).toEqual({
      contactPrimary: { inCareOf: mockInCareOfError },
    });
  });

  it('should call the error path with contactSecondary errors from petitioners array', async () => {
    const mockInCareOfError = 'Enter name for in care of';
    applicationContext
      .getUseCases()
      .validatePetitionFromPaperInteractor.mockReturnValue({
        petitioners: [{ inCareOf: mockInCareOfError, index: 1 }],
      });

    await runAction(validatePetitionFromPaperAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(errorStub.mock.calls[0][0].errors).toEqual({
      contactSecondary: { inCareOf: mockInCareOfError },
    });
  });

  describe('aggregateStatisticsErrors', () => {
    it('formats statistics errors for both UI validation and alertMessages', () => {
      const errors = {
        caseCaption: 'Enter a case caption',
        irsDeficiencyAmount: '"statistics[0].irsDeficiencyAmount" is required',
        statistics: [
          { deficiency: 'enter deficiency amount', index: 1 },
          { index: 2, irsTotalPenalties: 'enter total penalties' },
        ],
        year: '"statistics[0].year" is required',
      };

      const get = () => [
        { yearOrPeriod: 'Year' },
        { yearOrPeriod: 'Period' },
        { yearOrPeriod: 'Year' },
      ];

      const result = aggregateStatisticsErrors({ errors, get });

      expect(result).toMatchObject({
        errors: {
          caseCaption: 'Enter a case caption',
          statistics: [
            {},
            {
              enterAllValues:
                'Enter period, deficiency amount, and total penalties',
              index: 1,
            },
            {
              enterAllValues:
                'Enter year, deficiency amount, and total penalties',
              index: 2,
            },
          ],
        },
        statisticsErrorMessages: [
          'Enter period, deficiency amount, and total penalties',
          'Enter year, deficiency amount, and total penalties',
        ],
      });
    });

    it('does not format statistics errors and only returns the errors.statistics message on statisticsErrorMessages when there are no statistics on the form', () => {
      const errors = {
        caseCaption: 'Enter a case caption',
        statistics: '"statistics" must contain at least 1 items',
      };

      const get = () => []; // mock get call returns no results from from.statistics

      const result = aggregateStatisticsErrors({ errors, get });

      expect(result).toMatchObject({
        errors: {
          caseCaption: 'Enter a case caption',
          statistics: '"statistics" must contain at least 1 items',
        },
        statisticsErrorMessages: ['"statistics" must contain at least 1 items'],
      });
    });
  });
});
