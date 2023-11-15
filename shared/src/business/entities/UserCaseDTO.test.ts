import { UserCaseDTO } from '@shared/business/entities/UserCaseDTO';
import { createISODateString } from '@shared/business/utilities/DateHandler';

describe('UserCase', () => {
  const TEST_ISO_DATE = createISODateString();
  const userCaseRawData = {
    caseCaption: 'Guy Fieri, Petitioner',
    closedDate: TEST_ISO_DATE,
    createdAt: TEST_ISO_DATE,
    docketNumber: '104-21',
    docketNumberWithSuffix: '104-21S',
    isRequestingUserAssociated: true,
    leadDocketNumber: undefined,
    petitionPaymentStatus: 'Paid',
    status: 'Closed',
    zTrashProp: 'John was here',
    zTrashPropThree: 'Rachel was not here',
    zTrashPropTwo: 'Nechama was here',
  };

  it('should save all the defined properties in the entity and exclude others', () => {
    const userCaseDTO = new UserCaseDTO(userCaseRawData);
    expect(userCaseDTO).toEqual({
      caseCaption: 'Guy Fieri, Petitioner',
      closedDate: TEST_ISO_DATE,
      createdAt: TEST_ISO_DATE,
      docketNumber: '104-21',
      docketNumberWithSuffix: '104-21S',
      isRequestingUserAssociated: true,
      leadDocketNumber: undefined,
      petitionPaymentStatus: 'Paid',
      status: 'Closed',
    });
  });
});
