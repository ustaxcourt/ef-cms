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
  let PDF_MOCK;

  beforeAll(() => {
    applicationContext.getUseCases().getDocumentDownloadUrlInteractor = jest
      .fn()
      .mockReturnValue({ url: TEST_URL });

    GET_MOCK = jest.fn();
    HTTP_CLIENT_MOCK = {
      get: GET_MOCK,
    };

    applicationContext.getHttpClient = () => HTTP_CLIENT_MOCK;
    COVERSHEET_RESULTS = {
      consolidatedCases: 'consolidatedCasesResults',
      pdfData: { data: [12, 12, 12] },
    };
    applicationContext.getUseCases().getCoversheetInteractor = jest.fn(
      () => COVERSHEET_RESULTS,
    );

    PDF_MOCK = {
      copyPages: jest.fn(() => ['copyPages1']),
      getPageCount: jest.fn(() => 2),
      getPageIndices: jest.fn(() => 'getPageIndicesResults'),
      insertPage: jest.fn(),
      save: jest.fn(() => 'saveResults'),
    };

    let counter = 0;
    PDF_LIB_MOCK = {
      PDFDocument: {
        load: jest.fn(() => {
          counter++;
          return {
            ...PDF_MOCK,
            counter,
          };
        }),
      },
      catch: () => PDF_LIB_MOCK,
    };
    applicationContext.getPdfLib = () => PDF_LIB_MOCK;

    applicationContext.getUseCases().uploadDocumentInteractor = jest.fn();
    applicationContext.getUseCases().updateDocketEntriesPostCoversheetInteractor =
      jest.fn();

    presenter.providers.applicationContext = applicationContext;

    global.File = class {
      constructor() {
        this.foo = 'bar';
      }
    };
  });

  it('should download the file and append cover sheet on the pdf', async () => {
    const mockDocketEntryId = '456';
    const mockDocketNumber = '123-45';
    GET_MOCK.mockReturnValue({ data: 'fileResponseString' });
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

    // file gets downloaded
    const getDocumentDownloadUrlInteractorCalls =
      applicationContext.getUseCases().getDocumentDownloadUrlInteractor.mock
        .calls;
    expect(getDocumentDownloadUrlInteractorCalls.length).toEqual(1);
    expect(getDocumentDownloadUrlInteractorCalls[0][1]).toEqual({
      docketNumber: mockDocketNumber,
      key: mockDocketEntryId,
    });

    const getMockCalls = GET_MOCK.mock.calls;
    expect(getMockCalls.length).toEqual(1);
    expect(getMockCalls[0]).toEqual([
      TEST_URL,
      { responseType: 'arraybuffer' },
    ]);

    // get the coversheet
    const getCoversheetInteractorCalls =
      applicationContext.getUseCases().getCoversheetInteractor.mock.calls;
    expect(getCoversheetInteractorCalls.length).toEqual(1);
    expect(getCoversheetInteractorCalls[0][1]).toEqual({
      docketEntryId: mockDocketEntryId,
      docketNumber: mockDocketNumber,
    });

    // append coversheet
    const pdfLibLoadCalls = PDF_LIB_MOCK.PDFDocument.load.mock.calls;
    expect(pdfLibLoadCalls.length).toEqual(2);
    expect(pdfLibLoadCalls[0][0]).toEqual(new Uint8Array([12, 12, 12]));
    expect(pdfLibLoadCalls[1][0]).toEqual('fileResponseString');

    const copyPagesCalls = PDF_MOCK.copyPages.mock.calls;
    expect(copyPagesCalls.length).toEqual(1);
    expect(copyPagesCalls[0][0]).toMatchObject({
      counter: 1,
    });
    expect(copyPagesCalls[0][1]).toEqual('getPageIndicesResults');

    const insertPageCalls = PDF_MOCK.insertPage.mock.calls;
    expect(insertPageCalls.length).toEqual(1);
    expect(insertPageCalls[0]).toEqual([0, 'copyPages1']);

    const savePageCalls = PDF_MOCK.save.mock.calls;
    expect(savePageCalls.length).toEqual(1);

    const uploadDocumentInteractorCalls =
      applicationContext.getUseCases().uploadDocumentInteractor.mock.calls;
    expect(uploadDocumentInteractorCalls.length).toEqual(1);
    expect(uploadDocumentInteractorCalls[0][1].documentFile).toEqual({
      foo: 'bar',
    });

    expect(uploadDocumentInteractorCalls[0][1].key).toEqual(mockDocketEntryId);

    const updateDocketEntriesPostCoversheetInteractorCalls =
      applicationContext.getUseCases()
        .updateDocketEntriesPostCoversheetInteractor.mock.calls;
    expect(updateDocketEntriesPostCoversheetInteractorCalls.length).toEqual(1);
    expect(updateDocketEntriesPostCoversheetInteractorCalls[0][1]).toEqual({
      docketEntryId: mockDocketEntryId,
      docketNumber: mockDocketNumber,
      updatedDocketEntryData: {
        consolidatedCases: 'consolidatedCasesResults',
        numberOfPages: 2,
      },
    });
  });
});
