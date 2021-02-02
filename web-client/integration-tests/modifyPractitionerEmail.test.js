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
const mockUpdatedEmail = 'error@example.com';

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
  it('practitioner creates a case', async () => {
    caseDetail = await uploadPetition(
      test,
      {},
      'privatePractitioner2@example.com',
    );
    expect(caseDetail.docketNumber).toBeDefined();

    await refreshElasticsearchIndex();
  });

  it('practitioner updates email address to one that is already in use', async () => {
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
      value: mockUpdatedEmail,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'confirmEmail',
      value: mockUpdatedEmail,
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

    expect(window.location.replace).toHaveBeenCalledWith(
      'http://localhost:5678/email-verification-success',
    );
  });

  loginAs(test, 'privatePractitioner2@example.com');
  it('practitioner logs in and checks verified email address', async () => {
    const userFromState = test.getState('user');

    expect(userFromState.email).toEqual(mockUpdatedEmail);

    const header = runCompute(headerHelper, {
      state: test.getState(),
    });

    expect(header.showVerifyEmailWarningNotification).toBeFalsy();

    await refreshElasticsearchIndex();

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const privatePractitioners = test.getState(
      'caseDetail.privatePractitioners',
    );
    const privatePractitioner = privatePractitioners.find(
      practitioner => practitioner.userId === userFromState.userId,
    );

    expect(privatePractitioner.email).toEqual(mockUpdatedEmail);
  });
});
