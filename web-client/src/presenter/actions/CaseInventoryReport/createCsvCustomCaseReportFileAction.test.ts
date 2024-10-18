jest.mock(
  '@shared/proxies/customCaseReport/createCsvCustomCaseReportFileProxy',
);
import { cloneDeep } from 'lodash';
import { createCsvCustomCaseReportFileAction } from '@web-client/presenter/actions/CaseInventoryReport/createCsvCustomCaseReportFileAction';
import { createCsvCustomCaseReportFileInteractor as createCsvCustomCaseReportFileInteractorMock } from '@shared/proxies/customCaseReport/createCsvCustomCaseReportFileProxy';
import { initialCustomCaseReportState } from '../../customCaseReportState';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

const createCsvCustomCaseReportFileInteractor =
  createCsvCustomCaseReportFileInteractorMock as jest.Mock;

describe('createCsvCustomCaseReportFileAction', () => {
  beforeEach(() => {
    createCsvCustomCaseReportFileInteractor.mockResolvedValue(null);
  });
  it('should call createCsvCustomCaseReportFileInteractor with correct parameters', async () => {
    const CustomCaseReportState = cloneDeep(initialCustomCaseReportState);
    CustomCaseReportState.filters.caseStatuses = ['CAV'];
    CustomCaseReportState.filters.caseTypes = ['CDP (Lien/Levy)'];
    CustomCaseReportState.filters.judges = ['Buch'];
    CustomCaseReportState.filters.preferredTrialCities = ['Detroit, Michigan'];
    CustomCaseReportState.filters.endDate = '03/12/2024';
    CustomCaseReportState.filters.startDate = '03/12/2024';
    CustomCaseReportState.totalCases = 555;

    await runAction(createCsvCustomCaseReportFileAction, {
      modules: {
        presenter,
      },
      state: {
        clientConnectionId: 'TEST_CLIENT_CONNECTION_ID',
        customCaseReport: CustomCaseReportState,
        judges: [
          {
            name: 'Buch',
            userId: 'user-id-buch',
          },
        ],
      },
    });

    const createCsvCustomCaseReportCall =
      createCsvCustomCaseReportFileInteractor.mock.calls;

    expect(createCsvCustomCaseReportCall.length).toEqual(1);
    expect(createCsvCustomCaseReportCall[0][0]).toEqual({
      caseStatuses: ['CAV'],
      caseTypes: ['CDP (Lien/Levy)'],
      clientConnectionId: 'TEST_CLIENT_CONNECTION_ID',
      endDate: '2024-03-13T03:59:59.999Z',
      filingMethod: 'all',
      highPriority: false,
      judges: ['user-id-buch'],
      preferredTrialCities: ['Detroit, Michigan'],
      procedureType: 'All',
      startDate: '2024-03-12T04:00:00.000Z',
      totalCount: 555,
    });
  });
});
