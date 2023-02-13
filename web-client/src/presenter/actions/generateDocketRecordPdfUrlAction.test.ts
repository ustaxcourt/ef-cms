import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { generateDocketRecordPdfUrlAction } from './generateDocketRecordPdfUrlAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('generateDocketRecordPdfUrlAction', () => {
  const mockPdfUrl = { url: 'www.example.com' };
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .generateDocketRecordPdfInteractor.mockResolvedValue(mockPdfUrl);
    global.window = global;
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

    expect(result.output.pdfUrl).toBe(mockPdfUrl.url);
  });

  it('should call the interactor including party details if props.isAssociated is true', async () => {
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
        .calls[0][1].includePartyDetail,
    ).toEqual(true);
  });

  it('should call the interactor excluding party details if props.isAssociated is false', async () => {
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
        .calls[0][1].includePartyDetail,
    ).toEqual(false);
  });
});
