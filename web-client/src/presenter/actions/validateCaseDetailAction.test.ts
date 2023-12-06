import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateCaseDetailAction } from './validateCaseDetailAction';

describe('validateCaseDetail', () => {
  let successStub;
  let errorStub;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };

    applicationContext
      .getUseCases()
      .validateCaseDetailInteractor.mockReturnValue(null);

    applicationContext
      .getUseCases()
      .validatePetitionFromPaperInteractor.mockReturnValue(null);
  });

  it('should call the success path when no errors are found', async () => {
    await runAction(validateCaseDetailAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          docketEntries: [],
          docketNumber: '123-45',
          irsNoticeDate: '2009-10-13',
        },
      },
    });
    expect(
      applicationContext.getUseCases().validateCaseDetailInteractor.mock
        .calls[0][1].caseDetail,
    ).toMatchObject({
      docketNumber: '123-45',
      irsNoticeDate: '2009-10-13',
    });
    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('should call the error path when any errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateCaseDetailInteractor.mockReturnValue('error');

    await runAction(validateCaseDetailAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
        form: {
          docketEntries: [],
          irsNoticeDate: '2009-10-13',
        },
      },
    });
    expect(errorStub.mock.calls.length).toEqual(1);
  });

  it('aggregates statistics errors if present', async () => {
    applicationContext
      .getUseCases()
      .validateCaseDetailInteractor.mockReturnValue({
        statistics: [
          { deficiency: 'enter deficiency amount', index: 1 },
          { index: 2, irsTotalPenalties: 'enter total penalties' },
        ],
      });

    await runAction(validateCaseDetailAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          docketEntries: [],
          statistics: [
            { yearOrPeriod: 'Year' },
            { yearOrPeriod: 'Period' },
            { yearOrPeriod: 'Year' },
          ],
        },
      },
    });

    expect(errorStub.mock.calls[0][0].errors.statistics).toEqual([
      {},
      {
        enterAllValues: 'Enter period, deficiency amount, and total penalties',
        index: 1,
      },
      {
        enterAllValues: 'Enter year, deficiency amount, and total penalties',
        index: 2,
      },
    ]);
  });

  it('calls the validatePetitionFromPaperInteractor when the case is a paper filing', async () => {
    await runAction(validateCaseDetailAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          docketEntries: [],
          docketNumber: '123-45',
          irsNoticeDate: '2009-10-13',
          isPaper: true,
        },
      },
    });
    expect(
      applicationContext.getUseCases().validateCaseDetailInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validatePetitionFromPaperInteractor,
    ).toHaveBeenCalled();
  });

  it('should call the error path with contactSecondary errors from petitioners array', async () => {
    const mockInCareOfError = 'Enter name for in care of';
    applicationContext
      .getUseCases()
      .validateCaseDetailInteractor.mockReturnValue({
        petitioners: [{ inCareOf: mockInCareOfError, index: 1 }],
      });

    await runAction(validateCaseDetailAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          docketEntries: [
            { documentType: 'Petition' },
            { documentType: 'Statement of Taxpayer Identification' },
            { documentType: 'Application for Waiver of Filing Fee' },
          ],
          docketNumber: '123-45',
          irsNoticeDate: '2009-10-13',
        },
      },
    });

    expect(errorStub.mock.calls[0][0].errors).toEqual({
      contactSecondary: { inCareOf: mockInCareOfError },
    });
  });

  it('should call the error path with contactPrimary errors from petitioners array', async () => {
    const mockInCareOfError = 'Enter name for in care of';
    applicationContext
      .getUseCases()
      .validateCaseDetailInteractor.mockReturnValue({
        petitioners: [{ inCareOf: mockInCareOfError, index: 0 }],
      });

    await runAction(validateCaseDetailAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          docketEntries: [
            { documentType: 'Petition' },
            { documentType: 'Statement of Taxpayer Identification' },
            { documentType: 'Application for Waiver of Filing Fee' },
          ],
          docketNumber: '123-45',
          irsNoticeDate: '2009-10-13',
        },
      },
    });

    expect(errorStub.mock.calls[0][0].errors).toEqual({
      contactPrimary: { inCareOf: mockInCareOfError },
    });
  });
});
