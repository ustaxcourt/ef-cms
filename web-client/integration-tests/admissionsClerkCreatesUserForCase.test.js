import {
  contactPrimaryFromState,
  fakeFile,
  loginAs,
  setupTest,
} from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import faker from 'faker';

const test = setupTest();

const validEmail = `${faker.internet.userName()}_no_error@example.com`;

describe('admissions clerk creates user for case', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(test, fakeFile);

  loginAs(test, 'admissionsclerk@example.com');
  it('admissions clerk verifies petitioner on case has no email', async () => {
    const contactPrimary = contactPrimaryFromState(test);

    await test.runSequence('gotoEditPetitionerInformationInternalSequence', {
      contactId: contactPrimary.contactId,
      docketNumber: test.docketNumber,
    });

    expect(contactPrimary.email).toBeUndefined();

    expect(test.getState('currentPage')).toEqual(
      'EditPetitionerInformationInternal',
    );

    expect(test.getState('form.contact.email')).toBeUndefined();
    expect(test.getState('form.contact.serviceIndicator')).toBe('Paper');
  });

  it('admissions clerk adds an existing email address for petitioner on case', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'contact.email',
      value: 'petitioner@example.com',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.confirmEmail',
      value: 'petitioner@example.com',
    });

    await test.runSequence('submitEditPetitionerSequence');

    expect(test.getState('modal.showModal')).toBe('MatchingEmailFoundModal');

    await test.runSequence('dismissModalSequence');

    expect(test.getState('currentPage')).toEqual(
      'EditPetitionerInformationInternal',
    );
  });

  it('admissions clerk adds a new email address for petitioner on case', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'contact.email',
      value: validEmail,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.confirmEmail',
      value: validEmail,
    });

    await test.runSequence('submitEditPetitionerSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('modal.showModal')).toBe('NoMatchingEmailFoundModal');

    await test.runSequence(
      'submitUpdatePetitionerInformationFromModalSequence',
    );

    expect(test.getState('modal.showModal')).toBeUndefined();
  });

  it('admissions clerk checks pending email for petitioner on case with unverified email', async () => {
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    expect(test.getState('screenMetadata.contactPrimaryPendingEmail')).toBe(
      validEmail,
    );
  });
});
