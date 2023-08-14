import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  removeIrsPractitionerOnCase,
  removePrivatePractitionerOnCase,
} from './removePractitionerOnCase';

describe('removeIrsPractitionerOnCase', () => {
  it('should call delete using the provided docketNumber and userId', async () => {
    const mockDocketNumber = '123-89';
    const mockUserId = '4d55f245-6954-4437-860c-ed8bc86b8341';

    await removeIrsPractitionerOnCase({
      applicationContext,
      docketNumber: mockDocketNumber,
      userId: mockUserId,
    });

    expect(
      applicationContext.getDocumentClient().delete.mock.calls[0][0].Key,
    ).toEqual({
      pk: `case|${mockDocketNumber}`,
      sk: `irsPractitioner|${mockUserId}`,
    });
  });
});

describe('removePrivatePractitionerOnCase', () => {
  it('should call delete using the provided docketNumber and userId', async () => {
    const mockDocketNumber = '123-98';
    const mockUserId = 'e8d9ad7f-9c35-4ba7-93a3-c0356bc16a89';

    await removePrivatePractitionerOnCase({
      applicationContext,
      docketNumber: mockDocketNumber,
      userId: mockUserId,
    });

    expect(
      applicationContext.getDocumentClient().delete.mock.calls[0][0].Key,
    ).toEqual({
      pk: `case|${mockDocketNumber}`,
      sk: `privatePractitioner|${mockUserId}`,
    });
  });
});
