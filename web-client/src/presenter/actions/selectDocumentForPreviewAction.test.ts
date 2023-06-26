import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { selectDocumentForPreviewAction } from './selectDocumentForPreviewAction';

describe('selectDocumentForPreviewAction', () => {
  let createObjectURLMock;

  beforeAll(() => {
    createObjectURLMock = jest.fn();

    presenter.providers.router = {
      createObjectURL: createObjectURLMock,
    };
  });

  it('calls createObjectUrl to generate a url from the props.file', async () => {
    await runAction(selectDocumentForPreviewAction, {
      modules: {
        presenter,
      },
      props: {
        file: {
          name: 'test file',
        },
      },
    });

    expect(createObjectURLMock.mock.calls.length).toEqual(1);
    expect(createObjectURLMock.mock.calls[0][0]).toEqual({ name: 'test file' });
  });
});
