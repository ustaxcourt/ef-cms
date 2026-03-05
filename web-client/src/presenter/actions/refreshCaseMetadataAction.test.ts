import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { refreshCaseMetadataAction } from './refreshCaseMetadataAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('refreshCaseMetadataAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should fetch case metadata and merge it into existing state while preserving docket entries', async () => {
    const existingDocketEntries = [
      { docketEntryId: '1', description: 'Petition' },
      { docketEntryId: '2', description: 'Order' },
    ];

    applicationContext
      .getUseCases()
      .getCaseInteractor.mockResolvedValue({
        caseCaption: 'Updated Caption',
        docketNumber: '101-20',
        status: 'General Docket - Not at Issue',
      });

    const result = await runAction(refreshCaseMetadataAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          caseCaption: 'Old Caption',
          docketEntries: existingDocketEntries,
          docketNumber: '101-20',
          status: 'New',
        },
      },
    });

    expect(
      applicationContext.getUseCases().getCaseInteractor,
    ).toHaveBeenCalledWith(expect.anything(), { docketNumber: '101-20' });
    expect(result.state.caseDetail.caseCaption).toEqual('Updated Caption');
    expect(result.state.caseDetail.status).toEqual(
      'General Docket - Not at Issue',
    );
    expect(result.state.caseDetail.docketEntries).toEqual(
      existingDocketEntries,
    );
  });
});
