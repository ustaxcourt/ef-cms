import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { validatePetitionFromPaperAction } from './validatePetitionFromPaperAction';

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
});
