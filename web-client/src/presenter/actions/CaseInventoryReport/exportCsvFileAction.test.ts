import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { exportCsvFileAction } from '@web-client/presenter/actions/CaseInventoryReport/exportCsvFileAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('exportCsvFileAction', () => {
  beforeEach(() => {
    applicationContext.getUtilities().downloadCsv = jest.fn();
    presenter.providers.applicationContext = applicationContext;
  });

  const TEST_CSV_STRING = 'TEST_CSV_STRING';
  const TEST_FILE_NAME = 'TEST_FILE_NAME';

  it('should return the csv data string and title', async () => {
    await runAction(exportCsvFileAction, {
      modules: {
        presenter,
      },
      props: {
        csvString: TEST_CSV_STRING,
        fileName: TEST_FILE_NAME,
      },
    });

    const downloadCsvCalls =
      applicationContext.getUtilities().downloadCsv.mock.calls;

    expect(downloadCsvCalls.length).toEqual(1);
    expect(downloadCsvCalls[0][0]).toEqual({
      csvString: TEST_CSV_STRING,
      fileName: TEST_FILE_NAME,
    });
  });
});
