import { MOCK_CASE_DEADLINE } from '@shared/test/mockCaseDeadline';
import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { createCaseDeadlineAction } from './createCaseDeadlineAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('createCaseDeadlineAction', () => {
  let successStub;

  beforeAll(() => {
    successStub = jest.fn();

    presenter.providers.applicationContext = applicationContextForClient;

    presenter.providers.path = {
      success: successStub,
    };
  });

  it('calls createCaseDeadlineInteractor', async () => {
    await runAction(createCaseDeadlineAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { docketNumber: '123-20' },
        form: {
          deadlineDate: MOCK_CASE_DEADLINE.deadlineDate,
          description: MOCK_CASE_DEADLINE.description,
        },
        user: {
          token: 'docketclerk',
        },
      },
    });

    expect(successStub.mock.calls.length).toEqual(1);
  });
});
