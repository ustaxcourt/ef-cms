import { runAction } from 'cerebral/test';
import { setPetitionIdAction } from './setPetitionIdAction';

describe('setPetitionIdAction', () => {
  const DOCKET_NUMBER = '101-20';
  const DOCKET_ENTRY_ID = '0f7a59d7-569c-4416-84ea-7c10ae4ad55c';

  it('returns docketNumber and docketEntryId for the Petition document from props.caseDetail', async () => {
    const result = await runAction(setPetitionIdAction, {
      props: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: DOCKET_ENTRY_ID,
              documentType: 'Petition',
            },
          ],
          docketNumber: DOCKET_NUMBER,
        },
      },
    });

    expect(result.output).toEqual({
      docketEntryId: DOCKET_ENTRY_ID,
      docketNumber: DOCKET_NUMBER,
    });
  });
});
