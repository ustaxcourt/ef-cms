import { getPetitionIdAction } from './getPetitionIdAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getPetitionIdAction,', () => {
  const mockDocketNumber = '999-90';
  const mockPetitionId = '8a66e3bc-9141-4375-ad30-3c814582541d';
  const mockNonPetitionDocumentId = '2c36e3bc-9141-4375-ad30-3c814582541d';

  it('should return the petition docketEntryId and docetNumber as props', async () => {
    const { output } = await runAction(getPetitionIdAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          docketEntries: [
            { docketEntryId: mockPetitionId, documentType: 'Petition' },
            {
              docketEntryId: mockNonPetitionDocumentId,
              documentType: 'Order',
            },
          ],
          docketNumber: mockDocketNumber,
        },
      },
      state: {},
    });

    expect(output).toMatchObject({
      docketEntryId: mockPetitionId,
      docketNumber: mockDocketNumber,
    });
  });
});
