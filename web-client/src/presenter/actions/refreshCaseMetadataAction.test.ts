import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { refreshCaseMetadataAction } from './refreshCaseMetadataAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('refreshCaseMetadataAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should fetch case metadata and replace state while preserving docket entries and messages', async () => {
    const existingDocketEntries = [
      { docketEntryId: '1', description: 'Petition' },
      { docketEntryId: '2', description: 'Order' },
    ];

    const existingMessages = [
      { messageId: 'm1', subject: 'Test message' },
    ];

    applicationContext
      .getUseCases()
      .getCaseInteractor.mockResolvedValue({
        caseCaption: 'Updated Caption',
        docketEntries: [],
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
          messages: existingMessages,
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
    expect(result.state.caseDetail.messages).toEqual(existingMessages);
  });

  it('should clear stale fields that are absent from the refreshed case', async () => {
    applicationContext
      .getUseCases()
      .getCaseInteractor.mockResolvedValue({
        caseCaption: 'Test Caption',
        docketEntries: [],
        docketNumber: '101-20',
        isSealed: false,
        status: 'General Docket - Not at Issue',
      });

    const result = await runAction(refreshCaseMetadataAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          caseCaption: 'Test Caption',
          docketEntries: [],
          docketNumber: '101-20',
          isSealed: true,
          sealedDate: '2024-01-01T00:00:00.000Z',
          status: 'General Docket - Not at Issue',
        },
      },
    });

    expect(result.state.caseDetail.isSealed).toBe(false);
    expect(result.state.caseDetail.sealedDate).toBeUndefined();
  });
});
