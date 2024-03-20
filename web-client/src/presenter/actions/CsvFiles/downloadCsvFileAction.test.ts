import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { downloadCsvFileAction } from '@web-client/presenter/actions/CsvFiles/downloadCsvFileAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('downloadCsvFileAction', () => {
  const TEST_FILE_NAME = 'TEST_FILE_NAME';
  const TEST_URL = 'TEST_URL';

  beforeEach(() => {
    applicationContext.getHttpClient().get = jest.fn().mockResolvedValue({
      data: 'csv data',
    });

    presenter.providers.applicationContext = applicationContext;
  });

  it('should download csv file', async () => {
    const results = await runAction(downloadCsvFileAction, {
      modules: {
        presenter,
      },
      props: {
        csvInfo: {
          fileName: TEST_FILE_NAME,
          url: TEST_URL,
        },
      },
    });

    expect(results.output).toEqual({
      csvString: 'csv data',
      fileName: TEST_FILE_NAME,
    });
  });
  it('should return an empty string if csv file download failed', async () => {
    applicationContext.getHttpClient().get = jest.fn().mockRejectedValue(null);
    const results = await runAction(downloadCsvFileAction, {
      modules: {
        presenter,
      },
      props: {
        csvInfo: {
          fileName: TEST_FILE_NAME,
          url: TEST_URL,
        },
      },
    });
    expect(results.output).toEqual({
      csvString: '',
      fileName: TEST_FILE_NAME,
    });
  });
});
