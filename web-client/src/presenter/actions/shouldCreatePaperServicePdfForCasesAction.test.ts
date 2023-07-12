import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { shouldCreatePaperServicePdfForCasesAction } from './shouldCreatePaperServicePdfForCasesAction';

describe('shouldCreatePaperServicePdfForCasesAction', () => {
  let pathYesStub;
  let pathNoStub;

  beforeAll(() => {
    pathYesStub = jest.fn();
    pathNoStub = jest.fn();

    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('should return the no path if trialNoticePdfsKeys is empty', () => {
    runAction(shouldCreatePaperServicePdfForCasesAction, {
      modules: {
        presenter,
      },
      props: {
        trialNoticePdfsKeys: [],
      },
      state: {},
    });
    expect(pathNoStub).toHaveBeenCalled();
  });

  it('should return the yes path if trialNoticePdfsKeys is set', () => {
    runAction(shouldCreatePaperServicePdfForCasesAction, {
      modules: {
        presenter,
      },
      props: {
        trialNoticePdfsKeys: ['123-123'],
      },
      state: {},
    });
    expect(pathYesStub).toHaveBeenCalled();
  });
});
