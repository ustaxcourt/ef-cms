import {
  DOCKET_ENTRY_SEALED_TO_TYPES,
  ROLES,
} from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import { sealDocketEntryInteractor } from './sealDocketEntryInteractor';

describe('sealDocketEntryInteractor', () => {
  const answerDocketEntryId = 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3859';

  it('should require a value for dockeEntrySealedTo', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
    });

    await expect(
      sealDocketEntryInteractor(applicationContext, {
        docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
        docketEntrySealedTo: undefined,
        docketNumber: '101-20',
      }),
    ).rejects.toThrow('Docket entry sealed to is required');
  });

  it('should only allow docket clerks to seal a docket entry', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
    });

    await expect(
      sealDocketEntryInteractor(applicationContext, {
        docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
        docketEntrySealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
        docketNumber: '101-20',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error when the docket entry is not found', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
    });

    await expect(
      sealDocketEntryInteractor(applicationContext, {
        docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
        docketEntrySealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
        docketNumber: '101-20',
      }),
    ).rejects.toThrow('Docket entry not found');
  });

  it('should throw an error when an invalid option is provided for docketEntrySealedTo', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    await expect(
      sealDocketEntryInteractor(applicationContext, {
        docketEntryId: answerDocketEntryId,
        docketEntrySealedTo: 'invalid',
        docketNumber: '101-20',
      }),
    ).rejects.toThrow(
      'The DocketEntry entity was invalid. {"sealedTo":"\'sealedTo\' must be one of [External, Public]"}',
    );
  });

  it('should mark the docket entry as sealed and save', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
    const sealedDocketEntry = await sealDocketEntryInteractor(
      applicationContext,
      {
        docketEntryId: answerDocketEntryId,
        docketEntrySealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
        docketNumber: MOCK_CASE.docketNumber,
      },
    );
    expect(sealedDocketEntry).toBeDefined();
    expect(sealedDocketEntry.isSealed).toEqual(true);
    expect(sealedDocketEntry.sealedTo).toEqual(
      DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
    );
  });
});
