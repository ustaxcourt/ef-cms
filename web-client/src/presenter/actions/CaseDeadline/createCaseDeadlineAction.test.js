import { createCaseDeadlineAction } from './createCaseDeadlineAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = {
  getUseCases: () => ({
    createCaseDeadlineInteractor: () => 'something',
  }),
  getUtilities: () => ({
    createISODateString: () => '2019-03-01T21:42:29.073Z',
  }),
};

describe('createCaseDeadlineAction', () => {
  it('calls createCaseDeadlineInteractor', async () => {
    const result = await runAction(createCaseDeadlineAction, {
      modules: {
        presenter,
      },
      props: {
        computedDate: '2019-07-04',
      },
      state: {
        caseDetail: { caseId: 'abc' },
        form: {
          description: 'sdsdfslkdj',
        },
        user: {
          token: 'docketclerk',
        },
      },
    });
    expect(result.state.createCaseDeadline).toEqual('something');
  });
});
