import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { generateCoversheetAction } from './generateCoversheetAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('generateCoversheetAction', () => {
  const TEST_URL = 'TEST_URL';
  let HTTP_CLIENT_MOCK;
  let GET_MOCK;
  let COVERSHEET_RESULTS;
  let PDF_LIB_MOCK;

  beforeAll(() => {
    applicationContext.getUseCases().getDocumentDownloadUrlInteractor = jest
      .fn()
      .mockReturnValue({ url: TEST_URL });

    GET_MOCK = jest.fn();
    HTTP_CLIENT_MOCK = {
      get: GET_MOCK,
    };

    applicationContext.getHttpClient = () => HTTP_CLIENT_MOCK;
    applicationContext.getUseCases().getCoversheetInteractor = () =>
      COVERSHEET_RESULTS;

    PDF_LIB_MOCK = {};
    applicationContext.getPdfLib = () => PDF_LIB_MOCK;
    presenter.providers.applicationContext = applicationContext;
  });

  it('should download the file and append cover sheet on the pdf', async () => {
    const mockDocketEntryId = '456';
    const mockDocketNumber = '123-45';
    await runAction(generateCoversheetAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntryId: mockDocketEntryId,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
      },
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor.mock.calls[0][1],
    ).toMatchObject({
      docketEntryId: mockDocketEntryId,
      docketNumber: mockDocketNumber,
    });
  });
});
