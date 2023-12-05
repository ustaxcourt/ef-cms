import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { shouldShowPreviewAction } from './shouldShowPreviewAction';

const mockFile = {
  name: 'mockfile.pdf',
};

describe('shouldShowPreviewAction', () => {
  let pathYesStub;
  let pathNoStub;

  beforeAll(() => {
    pathYesStub = jest.fn();
    pathNoStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('returns the yes path if the given documentSelectedForScan is on state.form', () => {
    runAction(shouldShowPreviewAction, {
      modules: {
        presenter,
      },
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'primaryDocumentFile',
        },
        form: {
          primaryDocumentFile: mockFile,
        },
      },
    });
    expect(pathYesStub).toHaveBeenCalled();
  });

  it('returns the no path if the given documentSelectedForScan is NOT on state.form', () => {
    runAction(shouldShowPreviewAction, {
      modules: {
        presenter,
      },
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'primaryDocumentFile',
        },
        form: {},
      },
    });
    expect(pathNoStub).toHaveBeenCalled();
  });
});
