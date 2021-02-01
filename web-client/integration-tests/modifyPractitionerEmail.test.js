import {
  getPendingEmailVerificationTokenForUser,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { headerHelper as headerHelperComputed } from '../src/presenter/computeds/headerHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const headerHelper = withAppContextDecorator(headerHelperComputed);

const test = setupTest();

describe('Modify Practitioner Email', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  let caseDetail;
  test.createdDocketNumbers = [];

  loginAs(test, 'privatePractitioner2@example.com');
  it('login as a practitioner and create a case', async () => {
    caseDetail = await uploadPetition(
      test,
      {},
      'privatePractitioner2@example.com',
    );
    expect(caseDetail.docketNumber).toBeDefined();
  });

  it('practitioner udpates email address to one that is already in use', async () => {
    await test.runSequence('gotoChangeLoginAndServiceEmailSequence');

    await test.runSequence('updateFormValueSequence', {
      key: 'email',
      value: 'emailexists@example.com',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'confirmEmail',
      value: 'emailexists@example.com',
    });

    await test.runSequence('submitChangeLoginAndServiceEmailSequence');

    expect(test.getState('validationErrors.email')).toBeDefined();
  });

  it('practitioner successfully udpates email address', async () => {
    await test.runSequence('gotoChangeLoginAndServiceEmailSequence');

    await test.runSequence('updateFormValueSequence', {
      key: 'email',
      value: 'error@example.com',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'confirmEmail',
      value: 'error@example.com',
    });

    await test.runSequence('submitChangeLoginAndServiceEmailSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('modal.showModal')).toEqual('VerifyNewEmailModal');

    await test.runSequence(
      'closeVerifyEmailModalAndNavigateToMyAccountSequence',
      {
        path: '/my-account',
      },
    );

    expect(test.getState('currentPage')).toEqual('MyAccount');

    const header = runCompute(headerHelper, {
      state: test.getState(),
    });

    expect(header.showVerifyEmailWarningNotification).toBeTruthy();
  });

  it('practitioner verifies updated email address', async () => {
    const user = test.getState('user');
    const userFromPersistence = await getPendingEmailVerificationTokenForUser(
      user.userId,
    );

    const emailVerificationToken =
      userFromPersistence.pendingEmailVerificationToken;

    await test.runSequence('navigateToPathSequence', {
      path: `/verify-email?token=${emailVerificationToken}`,
    });
  });

  //verify the email (how?????)
  //grab pending token value from dynamo, go to verification url
  //make sure user email is updated, banner goes away
  //make sure cases are updated with new email
});
