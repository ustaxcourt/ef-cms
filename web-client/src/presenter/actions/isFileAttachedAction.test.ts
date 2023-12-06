import { isFileAttachedAction } from './isFileAttachedAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('isFileAttachedAction', () => {
  const mockPrimaryDocumentFile = 'a file';
  let pathYesStub;
  let pathNoStub;

  beforeEach(() => {
    pathYesStub = jest.fn();
    pathNoStub = jest.fn();

    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('should call path.yes when state.form.primaryDocumentFile is defined', async () => {
    await runAction(isFileAttachedAction, {
      modules: {
        presenter,
      },
      state: { form: { primaryDocumentFile: mockPrimaryDocumentFile } },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('should call path.no when state.form.primaryDocumentFile is NOT defined', async () => {
    await runAction(isFileAttachedAction, {
      modules: {
        presenter,
      },
      state: { form: {} },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });
});
