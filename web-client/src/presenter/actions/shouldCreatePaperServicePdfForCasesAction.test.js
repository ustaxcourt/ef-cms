import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
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

  it('should return the no path if trialNoticePdfsKeys is not set', () => {
    runAction(shouldCreatePaperServicePdfForCasesAction, {
      modules: {
        presenter,
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
        trialNoticePdfsKeys: '123-123',
      },
      state: {},
    });
    expect(pathYesStub).toHaveBeenCalled();
  });
});
