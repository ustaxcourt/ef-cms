import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getPdfFileAction } from './getPdfFileAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getPdfFileAction', () => {
  let createObjectURLStub;

  beforeAll(() => {
    global.File = jest.fn();
    createObjectURLStub = jest.fn();

    presenter.providers.applicationContext = applicationContextForClient;
    presenter.providers.router = {
      createObjectURL: createObjectURLStub,
    };
  });

  it('throws error if htmlString is empty', async () => {
    await expect(
      runAction(getPdfFileAction, {
        props: { htmlString: '' },
        state: {},
      }),
    ).rejects.toThrow();
  });

  it('gets the pdf file/blob for a court issued document', async () => {
    await runAction(getPdfFileAction, {
      modules: {
        presenter,
      },
      props: { htmlString: '<p>hi</p>' },
      state: {},
    });

    expect(
      applicationContextForClient.getUseCases()
        .createCourtIssuedOrderPdfFromHtmlInteractor,
    ).toBeCalled();
    expect(createObjectURLStub).toBeCalled();
    expect(global.File).toBeCalled();
  });
});
