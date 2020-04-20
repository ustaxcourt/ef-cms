import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { generateDocketRecordPdfUrlAction } from './generateDocketRecordPdfUrlAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

const mockCreateObjectUrl = jest.fn();

describe('generateDocketRecordPdfUrlAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    global.window = global;

    global.Blob = () => {};

    presenter.providers.router = {
      createObjectURL: () => {
        mockCreateObjectUrl();
        return '123456-abcdef';
      },
    };
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
          caseId: 'ca123',
          docketNumber: '123-45',
        },
        sessionMetadata: {
          docketRecordSort: {
            ca123: 'byDate',
          },
        },
      },
    });
    expect(
      applicationContext.getUseCases().generateDocketRecordPdfInteractor,
    ).toHaveBeenCalled();
    expect(mockCreateObjectUrl).toHaveBeenCalled();
    expect(result.output).toHaveProperty('pdfUrl');
  });
});
