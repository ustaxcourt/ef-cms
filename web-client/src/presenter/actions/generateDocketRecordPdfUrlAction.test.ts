import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { generateDocketRecordPdfUrlAction } from './generateDocketRecordPdfUrlAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('generateDocketRecordPdfUrlAction', () => {
  const mockPdfUrl = { url: 'www.example.com' };
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .generateDocketRecordPdfInteractor.mockResolvedValue(mockPdfUrl);
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
});
