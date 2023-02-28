import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { shouldLoadCaseAction } from './shouldLoadCaseAction';

describe('shouldLoadCaseAction', () => {
  let pathLoadStub = jest.fn();
  let pathIgnoreStub = jest.fn();

  beforeAll(() => {
    presenter.providers.path = {
      ignore: pathIgnoreStub,
      load: pathLoadStub,
    };
  });

  it('returns the ignore path if caseDetail.docketNumber matches props.docketNumber', () => {
    runAction(shouldLoadCaseAction, {
      modules: {
        presenter,
      },
      props: { docketNumber: '105-19' },
      state: { caseDetail: { docketNumber: '105-19' } },
    });
    expect(pathIgnoreStub).toHaveBeenCalled();
  });

  it('returns the load path if caseDetail.docketNumber does not match props.docketNumber', () => {
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
