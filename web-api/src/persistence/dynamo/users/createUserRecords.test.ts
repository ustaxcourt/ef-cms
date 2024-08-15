import {
  COUNTRY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  caseServicesSupervisorUser,
  judgeColvin,
  legacyJudgeUser,
  petitionsClerkUser,
  privatePractitionerUser,
} from '@shared/test/mockUsers';
import { createUserRecords } from './createUserRecords';

describe('createUserRecords', () => {
  const mockPrivatePractitionerUser = {
    ...privatePractitionerUser,
    barNumber: 'pt1234', //intentionally lower case - should be converted to upper case when persisted
  };

  it('should persist a private practitioner user with name and barNumber mapping records', async () => {
    await createUserRecords({
      applicationContext,
      user: mockPrivatePractitionerUser,
      userId: mockPrivatePractitionerUser.userId,
    });

    expect(applicationContext.getDocumentClient().put.mock.calls.length).toBe(
      3,
    );

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        barNumber: 'pt1234',
        contact: {
          address1: '234 Main St',
          address2: 'Apartment 4',
          address3: 'Under the stairs',
          city: 'Chicago',
          country: COUNTRY_TYPES.DOMESTIC,
          countryType: COUNTRY_TYPES.DOMESTIC,
          phone: '+1 (555) 555-5555',
          postalCode: '61234',
          state: 'IL',
        },
        email: 'privatePractitionerPractitioner@example.com',
        entityName: 'User',
        name: 'Private Practitioner',
        pk: `user|${privatePractitionerUser.userId}`,
        practiceType: 'Private',
        role: ROLES.privatePractitioner,
        section: 'privatePractitioner',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        sk: `user|${privatePractitionerUser.userId}`,
        userId: '330d4b65-620a-489d-8414-6623653ebc4f',
      },
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[1][0],
    ).toMatchObject({
      Item: {
        pk: 'privatePractitioner|PRIVATE PRACTITIONER',
        sk: `user|${mockPrivatePractitionerUser.userId}`,
      },
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[2][0],
    ).toMatchObject({
      Item: {
        pk: 'privatePractitioner|PT1234',
        sk: `user|${mockPrivatePractitionerUser.userId}`,
      },
    });
  });

  it('should persist a petitions clerk user with a section mapping record', async () => {
    await createUserRecords({
      applicationContext,
      user: petitionsClerkUser,
      userId: petitionsClerkUser.userId,
    });

    expect(applicationContext.getDocumentClient().put).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        pk: 'section|petitions',
        sk: `user|${petitionsClerkUser.userId}`,
      },
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[1][0],
    ).toMatchObject({
      Item: {
        ...petitionsClerkUser,
        pk: `user|${petitionsClerkUser.userId}`,
        sk: `user|${petitionsClerkUser.userId}`,
      },
    });
  });

  it('should persist a judge user with a section mapping record for the chambers and the judge', async () => {
    await createUserRecords({
      applicationContext,
      user: judgeColvin,
      userId: judgeColvin.userId,
    });

    expect(applicationContext.getDocumentClient().put).toHaveBeenCalledTimes(3);
    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        pk: `section|${judgeColvin.section}`,
        sk: `user|${judgeColvin.userId}`,
      },
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[1][0],
    ).toMatchObject({
      Item: {
        pk: 'section|judge',
        sk: `user|${judgeColvin.userId}`,
      },
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[2][0],
    ).toMatchObject({
      Item: {
        ...judgeColvin,
        pk: `user|${judgeColvin.userId}`,
        sk: `user|${judgeColvin.userId}`,
      },
    });
  });

  it('should persist a legacy judge user with a section mapping record for the chambers and the judge', async () => {
    await createUserRecords({
      applicationContext,
      user: legacyJudgeUser,
      userId: legacyJudgeUser.userId,
    });

    expect(applicationContext.getDocumentClient().put.mock.calls.length).toBe(
      3,
    );
    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        pk: `section|${legacyJudgeUser.section}`,
        sk: `user|${legacyJudgeUser.userId}`,
      },
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[1][0],
    ).toMatchObject({
      Item: {
        pk: 'section|judge',
        sk: `user|${legacyJudgeUser.userId}`,
      },
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[2][0],
    ).toMatchObject({
      Item: {
        ...legacyJudgeUser,
        pk: `user|${legacyJudgeUser.userId}`,
        sk: `user|${legacyJudgeUser.userId}`,
      },
    });
  });

  it('should NOT persist mapping records for practitioner that does not have a barNumber', async () => {
    const privatePractitionerUserWithoutBarNumber = {
      ...privatePractitionerUser,
      barNumber: undefined,
    };

    await createUserRecords({
      applicationContext,
      user: privatePractitionerUserWithoutBarNumber,
      userId: privatePractitionerUserWithoutBarNumber.userId,
    });

    expect(applicationContext.getDocumentClient().put.mock.calls.length).toBe(
      1,
    );
    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        barNumber: undefined,
        contact: {
          address1: '234 Main St',
          address2: 'Apartment 4',
          address3: 'Under the stairs',
          city: 'Chicago',
          country: COUNTRY_TYPES.DOMESTIC,
          countryType: COUNTRY_TYPES.DOMESTIC,
          phone: '+1 (555) 555-5555',
          postalCode: '61234',
          state: 'IL',
        },
        email: 'privatePractitionerPractitioner@example.com',
        entityName: 'User',
        name: 'Private Practitioner',
        pk: `user|${privatePractitionerUserWithoutBarNumber.userId}`,
        practiceType: 'Private',
        role: ROLES.privatePractitioner,
        section: 'privatePractitioner',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        sk: `user|${privatePractitionerUserWithoutBarNumber.userId}`,
        userId: '330d4b65-620a-489d-8414-6623653ebc4f',
      },
    });
  });

  it('should persist a case services supervisor user with 3 section user mapping records (docket, petitions, and case services)', async () => {
    await createUserRecords({
      applicationContext,
      user: caseServicesSupervisorUser,
      userId: caseServicesSupervisorUser.userId,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        pk: `section|${caseServicesSupervisorUser.section}`,
        sk: `user|${caseServicesSupervisorUser.userId}`,
      },
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[1][0],
    ).toMatchObject({
      Item: {
        pk: 'section|docket',
        sk: `user|${caseServicesSupervisorUser.userId}`,
      },
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[2][0],
    ).toMatchObject({
      Item: {
        pk: 'section|petitions',
        sk: `user|${caseServicesSupervisorUser.userId}`,
      },
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[3][0],
    ).toMatchObject({
      Item: {
        pk: `user|${caseServicesSupervisorUser.userId}`,
        sk: `user|${caseServicesSupervisorUser.userId}`,
      },
    });
  });

  it('should NOT persist section mapping record when the user does not have a section', async () => {
    await createUserRecords({
      applicationContext,
      user: {
        ...petitionsClerkUser,
        section: undefined,
      },
      userId: petitionsClerkUser.userId,
    });

    expect(applicationContext.getDocumentClient().put).toHaveBeenCalledTimes(1);
    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        ...petitionsClerkUser,
        pk: `user|${petitionsClerkUser.userId}`,
        section: undefined,
        sk: `user|${petitionsClerkUser.userId}`,
      },
    });
  });
});
