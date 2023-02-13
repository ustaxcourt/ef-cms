import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { refreshCaseAction } from './refreshCaseAction';
import { runAction } from 'cerebral/test';

describe('refreshCaseAction', () => {
  const DOCKET_NUMBER = '101-20';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .getCaseInteractor.mockReturnValue(MOCK_CASE);
  });

  it('should call getCaseInteractor with state.caseDetail.docketNumber', async () => {
    await runAction(refreshCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: DOCKET_NUMBER,
        },
      },
    });

    expect(
      applicationContext.getUseCases().getCaseInteractor.mock.calls[0][1]
        .docketNumber,
    ).toEqual(DOCKET_NUMBER);
  });

  it('should set state.caseDetail to the object returned by getCaseInteractor', async () => {
    const result = await runAction(refreshCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: DOCKET_NUMBER,
        },
      },
    });

    expect(result.state.caseDetail).toEqual(MOCK_CASE);
  });
});
