import { DynamoDB } from 'aws-sdk';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  contactPrimaryFromState,
  fakeFile,
  getUserRecordById,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
} from './helpers';
import { getCaseByDocketNumber } from '../../shared/src/persistence/dynamo/cases/getCaseByDocketNumber';
import { getDocketNumbersByUser } from '../../shared/src/persistence/dynamo/cases/getDocketNumbersByUser';
import { getUserById } from '../../shared/src/persistence/dynamo/users/getUserById';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { setUserEmailFromPendingEmailInteractor } from '../../shared/src/business/useCases/users/setUserEmailFromPendingEmailInteractor';
import { updateCase } from '../../shared/src/persistence/dynamo/cases/updateCase';
import { updateCaseAndAssociations } from '../../shared/src/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { updateUser } from '../../shared/src/persistence/dynamo/users/updateUser';

const test = setupTest();

const callCognitoTriggerForPendingEmail = async userId => {
  // mock application context similar to that in cognito-triggers.js
  const apiApplicationContext = {
    getCurrentUser: () => ({}),
    getDocumentClient: () => {
      return new DynamoDB.DocumentClient({
        endpoint: 'http://localhost:8000',
        region: 'us-east-1',
      });
    },
    getEnvironment: () => ({
      dynamoDbTableName: 'efcms-local',
      stage: process.env.STAGE,
    }),
    getPersistenceGateway: () => ({
      getCaseByDocketNumber,
      getDocketNumbersByUser,
      getUserById,
      updateCase,
      updateUser,
    }),
    getUseCaseHelpers: () => ({ updateCaseAndAssociations }),
    logger: {
      debug: () => {},
      error: () => {},
      info: () => {},
    },
  };

  const user = await getUserRecordById(userId);
  await setUserEmailFromPendingEmailInteractor(apiApplicationContext, {
    user,
  });
};

describe('admissions clerk adds petitioner without existing cognito account to case', () => {
  const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();

  const EMAIL_TO_ADD = `new${Math.random()}@example.com`;

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(test, fakeFile);

  loginAs(test, 'admissionsclerk@example.com');
  it('admissions clerk adds petitioner email without existing cognito account to case', async () => {
    await refreshElasticsearchIndex();

    let contactPrimary = contactPrimaryFromState(test);

    await test.runSequence('gotoEditPetitionerInformationInternalSequence', {
      contactId: contactPrimary.contactId,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual(
      'EditPetitionerInformationInternal',
    );
    expect(test.getState('form.updatedEmail')).toBeUndefined();
    expect(test.getState('form.confirmEmail')).toBeUndefined();

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.updatedEmail',
      value: EMAIL_TO_ADD,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.confirmEmail',
      value: EMAIL_TO_ADD,
    });

    await test.runSequence('submitEditPetitionerSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('modal.showModal')).toBe('NoMatchingEmailFoundModal');
    expect(test.getState('currentPage')).toEqual(
      'EditPetitionerInformationInternal',
    );

    await test.runSequence(
      'submitUpdatePetitionerInformationFromModalSequence',
    );

    expect(test.getState('modal.showModal')).toBeUndefined();
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    contactPrimary = contactPrimaryFromState(test);

    expect(contactPrimary.email).toBeUndefined();
    expect(contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );

    test.userId = contactPrimary.contactId;

    await refreshElasticsearchIndex();
  });

  it('petitioner verifies email via cognito', async () => {
    await callCognitoTriggerForPendingEmail(test.userId);
  });

  loginAs(test, 'admissionsclerk@example.com');
  it('admissions clerk verifies petitioner email is no longer pending and service preference was updated to electronic', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const contactPrimary = contactPrimaryFromState(test);

    expect(contactPrimary.email).toEqual(EMAIL_TO_ADD);
    expect(contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });
});
