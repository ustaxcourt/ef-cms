import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { shouldLoadCaseAction } from './shouldLoadCaseAction';

describe('shouldLoadCaseAction', () => {
  let pathLoadStub = jest.fn();
  let pathIgnoreStub = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    presenter.providers.path = {
      ignore: pathIgnoreStub,
      load: pathLoadStub,
    };
  });

  it('returns the ignore path if no caseDetail.docketNumber matches props.docketNumber', async () => {
    runAction(shouldLoadCaseAction, {
      modules: {
        presenter,
      },
      props: { docketNumber: '105-19' },
      state: { caseDetail: { docketNumber: '105-19' } },
    });
    expect(pathIgnoreStub).toHaveBeenCalled();
  });

  it('returns the load path if state does not already contain detail according to props.docketNumber', async () => {
    runAction(shouldLoadCaseAction, {
      modules: {
        presenter,
      },
      props: { docketNumber: '106-19' },
      state: {
        caseDetail: {
          docketNumber: '101-19',
        },
      },
    });
    expect(pathLoadStub).toHaveBeenCalled();
  });
});
