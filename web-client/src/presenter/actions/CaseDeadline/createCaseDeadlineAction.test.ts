import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createCaseDeadlineAction } from './createCaseDeadlineAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContextForClient;

describe('createCaseDeadlineAction', () => {
  let successStub;
  let errorStub;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('calls createCaseDeadlineInteractor', async () => {
    await runAction(createCaseDeadlineAction, {
      modules: {
        presenter,
      },
      props: {
        computedDate: '2019-07-04',
      },
      state: {
        caseDetail: { docketNumber: '123-20' },
        form: {
          description: 'sdsdfslkdj',
        },
        user: {
          token: 'docketclerk',
        },
      },
    });
    expect(successStub.mock.calls.length).toEqual(1);
  });
});
