import { loadPdfAction } from './loadPdfAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = {
  getFileReader: () =>
    function() {
      this.onload = null;
      this.onerror = null;
      this.readAsDataURL = function() {
        this.result = 'abc';
        this.onload();
      };
    },
  getPdfJs: () => ({
    promise: Promise.resolve({
      getPage: async () => ({
        getViewport: () => ({
          height: 100,
          width: 100,
        }),
        render: () => null,
      }),
      numPages: 5,
    }),
  }),
};

let pathError = jest.fn();

presenter.providers.path = {
  error: pathError,
};

describe('loadPdfAction', () => {
  beforeEach(() => {
    global.atob = x => x;
  });

  it('should return an error when given an invalid pdf', async () => {
    await runAction(loadPdfAction, {
      modules: {
        presenter,
      },
      props: {
        ctx: 'abc',
        file: 'nope',
      },
      state: {
        pdfPreviewModal: {},
      },
    });

    expect(pathError).toHaveBeenCalled();
  });

  it('should error out when the FileReader fails', async () => {
    presenter.providers.applicationContext.getFileReader = () =>
      function() {
        this.onload = null;
        this.onerror = null;
        this.readAsDataURL = function() {
          this.result = 'abc';
          this.onerror('An error called via reader.onerror.');
        };
      };

    const result = await runAction(loadPdfAction, {
      modules: {
        presenter,
      },
      props: {
        ctx: 'abc',
        file: 'nope',
      },
      state: {
        pdfPreviewModal: {},
      },
    });

    expect(result.state.pdfPreviewModal).toMatchObject({
      ctx: 'abc',
      error: 'An error called via reader.onerror.',
    });
  });
});
