jest.mock('@web-client/presenter/computeds/confirmInitiateServiceModalHelper');
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { isDocketEntryMultiDocketableAction } from './isDocketEntryMultiDocketableAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { MOCK_LEAD_CASE_WITH_PAPER_SERVICE } from '@shared/test/mockCase';
import { shouldAllowMultiDocketing as shouldAllowMultiDocketingMock } from '@shared/business/utilities/shouldAllowMultiDocketing';
import { MOCK_ANSWER } from '@shared/test/mockDocketEntry';

describe('isDocketEntryMultiDocketableAction', () => {
  let pathYesStub;
  let pathNoStub;

  const shouldAllowMultiDocketing = jest.mocked(shouldAllowMultiDocketingMock);

  beforeAll(() => {
    pathYesStub = jest.fn();
    pathNoStub = jest.fn();

    shouldAllowMultiDocketing.mockReturnValue(true);

    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('should return the yes path if shouldAllowMultiDocketing is true', async () => {
    await runAction(isDocketEntryMultiDocketableAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
        form: {},
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('should return the no path if shouldAllowMultiDocketing is false', async () => {
    shouldAllowMultiDocketing.mockReturnValueOnce(false);
    await runAction(isDocketEntryMultiDocketableAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
        form: {},
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });

  it('should use docketEntry from state.form if form is populated', async () => {
    await runAction(isDocketEntryMultiDocketableAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
        form: MOCK_ANSWER,
      },
    });

    expect(shouldAllowMultiDocketing).toHaveBeenCalledWith(
      expect.objectContaining({
        docketEntry: MOCK_ANSWER,
      }),
    );
  });

  it('should use docketEntry from state.caseDetail if form is not populated', async () => {
    await runAction(isDocketEntryMultiDocketableAction, {
      modules: {
        presenter,
      },
      state: {
        docketEntryId:
          MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[0].docketEntryId,
        caseDetail: MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
        form: {},
      },
    });

    expect(shouldAllowMultiDocketing).toHaveBeenCalledWith(
      expect.objectContaining({
        docketEntry: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[0],
      }),
    );
  });
});
