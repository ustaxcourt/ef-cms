import { STATE_KEYS } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { generateDocketRecordPdfUrlAction } from './generateDocketRecordPdfUrlAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('generateDocketRecordPdfUrlAction', () => {
  const docketRecordPdfGenerationResults = {
    fileId: 'fileId',
    url: 'www.example.com',
  };
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .generateDocketRecordPdfInteractor.mockResolvedValue(
        docketRecordPdfGenerationResults,
      );
  });

  it('creates a pdf and returns an object URL', async () => {
    const result = await runAction(generateDocketRecordPdfUrlAction, {
      modules: {
        presenter,
      },
      props: {
        contentHtml:
          '<!doctype html><html><head></head><body>Hello World</body></html>',
        docketNumber: '123-45',
      },
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
        sessionMetadata: {
          docketRecordSort: {
            '123-45': 'byDate',
          },
        },
      },
    });

    expect(result.output).toMatchObject({
      fileId: 'fileId',
      pdfUrl: 'www.example.com',
    });
  });

  it('should call the interactor with includePartyDetail and isIndirectlyAssociated as true if props.isAssociated is true', async () => {
    await runAction(generateDocketRecordPdfUrlAction, {
      modules: {
        presenter,
      },
      props: {
        contentHtml:
          '<!doctype html><html><head></head><body>Hello World</body></html>',
        docketNumber: '123-45',
        isAssociated: true,
      },
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
        sessionMetadata: {
          docketRecordSort: {
            '123-45': 'byDate',
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().generateDocketRecordPdfInteractor.mock
        .calls[0][1],
    ).toMatchObject({ includePartyDetail: true, isIndirectlyAssociated: true });
  });

  it('should call the interactor with includePartyDetail and isIndirectlyAssociated as false if props.isAssociated is false', async () => {
    await runAction(generateDocketRecordPdfUrlAction, {
      modules: {
        presenter,
      },
      props: {
        contentHtml:
          '<!doctype html><html><head></head><body>Hello World</body></html>',
        docketNumber: '123-45',
        isAssociated: false,
      },
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
        sessionMetadata: {
          docketRecordSort: {
            '123-45': 'byDate',
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().generateDocketRecordPdfInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      includePartyDetail: false,
      isIndirectlyAssociated: false,
    });
  });

  it('should call the interactor with the correct table sort information from state', async () => {
    await runAction(generateDocketRecordPdfUrlAction, {
      modules: {
        presenter,
      },
      props: {
        contentHtml:
          '<!doctype html><html><head></head><body>Hello World</body></html>',
        docketNumber: '123-45',
        isAssociated: false,
      },
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
        [STATE_KEYS.DOCKET_RECORD_TABLE_SORT]: {
          sortField: 'sortField_test',
          sortOrder: 'sortOrder_test',
        },
      },
    });

    expect(
      applicationContext.getUseCases().generateDocketRecordPdfInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketRecordTableSort: {
        sortField: 'sortField_test',
        sortOrder: 'sortOrder_test',
      },
    });
  });
});
