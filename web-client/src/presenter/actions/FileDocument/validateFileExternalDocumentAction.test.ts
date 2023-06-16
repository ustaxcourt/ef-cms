import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateFileExternalDocumentAction } from './validateFileExternalDocumentAction';

describe('validateFileExternalDocumentAction', () => {
  let pathSuccessStub;
  let pathErrorStub;

  beforeAll(() => {
    pathSuccessStub = jest.fn();
    pathErrorStub = jest.fn();

    presenter.providers.path = {
      error: pathErrorStub,
      success: pathSuccessStub,
    };
  });

  it('should validate with success if there are selected cases with which to file a document', async () => {
    await runAction(validateFileExternalDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          casesToFileDocument: {
            '101-19': true,
          },
        },
      },
    });

    expect(pathSuccessStub).toHaveBeenCalled();
  });

  it('should validate with an error if there are NO selected cases with which to file a document', async () => {
    await runAction(validateFileExternalDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          casesToFileDocument: {},
        },
      },
    });

    expect(pathErrorStub).toHaveBeenCalled();
  });
});
