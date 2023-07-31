import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setPDFForStampAction } from './setPDFForStampAction';

describe('setPDFForStampAction', () => {
  let mockPDFObj;
  let removeCoverMock;
  let getPagesMock;

  beforeAll(() => {
    mockPDFObj = {
      numPages: 1,
    };

    removeCoverMock = jest.fn();
    getPagesMock = jest.fn();

    applicationContext
      .getUseCases()
      .loadPDFForSigningInteractor.mockImplementation(({ onlyCover }) => {
        if (onlyCover === true) {
          removeCoverMock();
          getPagesMock();
        }
        return mockPDFObj;
      });

    presenter.providers.applicationContext = applicationContext;
  });

  it('should set state.pdfForSigning.pdfjsObj and state.pdfForSigning.docketEntryId', async () => {
    const docketEntryId = '123';
    const result = await runAction(setPDFForStampAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId,
            },
          ],
        },
        docketEntryId,
      },
      state: {
        pdfForSigning: {
          docketEntryId: null,
          pdfjsObj: null,
        },
      },
    });

    expect(result.state.pdfForSigning.docketEntryId).toEqual(docketEntryId);
    expect(result.state.pdfForSigning.pdfjsObj).toEqual(mockPDFObj);
  });

  it('should call loadPDFForSigningInteractor', async () => {
    const docketEntryId = '123';
    await runAction(setPDFForStampAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: { docketNumber: '123-20' },
        docketEntryId,
      },
      state: {
        pdfForSigning: {
          docketEntryId: null,
          pdfjsObj: null,
        },
      },
    });

    expect(
      applicationContext.getUseCases().loadPDFForSigningInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketEntryId,
      docketNumber: '123-20',
      onlyCover: true,
    });
  });
});
