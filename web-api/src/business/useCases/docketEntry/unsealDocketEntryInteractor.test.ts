import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { unsealDocketEntryInteractor } from './unsealDocketEntryInteractor';

describe('unsealDocketEntryInteractor', () => {
  const answerDocketEntryId = 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3859';

  it('should only allow docket clerks to unseal a docket entry', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
    });

    await expect(
      unsealDocketEntryInteractor(applicationContext, {
        docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
        docketNumber: '101-20',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error when the docket entry is not found', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
    });

    await expect(
      unsealDocketEntryInteractor(applicationContext, {
        docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
        docketNumber: '101-20',
      }),
    ).rejects.toThrow('Docket entry not found');
  });

  it('should mark the docket entry as unsealed and save', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
    const unsealedDocketEntry = await unsealDocketEntryInteractor(
      applicationContext,
      {
        docketEntryId: answerDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
      },
    );
    expect(unsealedDocketEntry).toBeDefined();
    expect(unsealedDocketEntry.isSealed).toEqual(false);
    expect(unsealedDocketEntry.sealedTo).toEqual(undefined);
  });
});
