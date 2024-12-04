import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import { DOCKET_ENTRY_SEALED_TO_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  mockDocketClerkUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { sealDocketEntryInteractor } from './sealDocketEntryInteractor';

describe('sealDocketEntryInteractor', () => {
  const answerDocketEntryId = 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3859';

  it('should require a value for dockeEntrySealedTo', async () => {
    await expect(
      sealDocketEntryInteractor(
        applicationContext,
        {
          docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
          //@ts-ignore this error is intentional
          docketEntrySealedTo: undefined,
          docketNumber: '101-20',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Docket entry sealed to is required');
  });

  it('should only allow docket clerks to seal a docket entry', async () => {
    await expect(
      sealDocketEntryInteractor(
        applicationContext,
        {
          docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
          docketEntrySealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
          docketNumber: '101-20',
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error when the docket entry is not found', async () => {
    await expect(
      sealDocketEntryInteractor(
        applicationContext,
        {
          docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
          docketEntrySealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
          docketNumber: '101-20',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Docket entry not found');
  });

  it('should throw an error when an invalid option is provided for docketEntrySealedTo', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    await expect(
      sealDocketEntryInteractor(
        applicationContext,
        {
          docketEntryId: answerDocketEntryId,
          docketEntrySealedTo: 'invalid',
          docketNumber: '101-20',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(
      'The DocketEntry entity was invalid. {"sealedTo":"\'sealedTo\' must be one of [External, Public]"}',
    );
  });

  it('should mark the docket entry as sealed and save', async () => {
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
      mockDocketClerkUser,
    );
    expect(sealedDocketEntry).toBeDefined();
    expect(sealedDocketEntry.isSealed).toEqual(true);
    expect(sealedDocketEntry.sealedTo).toEqual(
      DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
    );
  });
});
