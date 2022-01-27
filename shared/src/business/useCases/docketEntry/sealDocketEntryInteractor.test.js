import { MOCK_CASE } from '../../../test/mockCase';
import { ROLES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { sealDocketEntryInteractor } from './sealDocketEntryInteractor';

describe('sealDocketEntryInteractor', () => {
  it('should only allow docket clerks to seal a docket entry', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
    });

    await expect(
      sealDocketEntryInteractor(applicationContext, {
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
      sealDocketEntryInteractor(applicationContext, {
        docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
        docketNumber: '101-20',
      }),
    ).rejects.toThrow('Docket entry not found');
  });

  it('should mark the docket entry as sealed and save', async () => {
    const answerDocketEntryId = 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3859';
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    await sealDocketEntryInteractor(applicationContext, {
      docketEntryId: answerDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().updateDocketEntry.mock
        .calls[0][0],
    ).toMatchObject({});
  });
});
