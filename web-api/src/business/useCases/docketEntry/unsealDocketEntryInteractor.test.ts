import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  mockDocketClerkUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { unsealDocketEntryInteractor } from './unsealDocketEntryInteractor';

describe('unsealDocketEntryInteractor', () => {
  const answerDocketEntryId = 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3859';

  it('should only allow docket clerks to unseal a docket entry', async () => {
    await expect(
      unsealDocketEntryInteractor(
        applicationContext,
        {
          docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
          docketNumber: '101-20',
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error when the docket entry is not found', async () => {
    await expect(
      unsealDocketEntryInteractor(
        applicationContext,
        {
          docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
          docketNumber: '101-20',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Docket entry not found');
  });

  it('should mark the docket entry as unsealed and save', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
    const unsealedDocketEntry = await unsealDocketEntryInteractor(
      applicationContext,
      {
        docketEntryId: answerDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );
    expect(unsealedDocketEntry).toBeDefined();
    expect(unsealedDocketEntry.isSealed).toEqual(false);
    expect(unsealedDocketEntry.sealedTo).toEqual(undefined);
  });
});
