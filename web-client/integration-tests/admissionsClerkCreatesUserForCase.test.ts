import { contactPrimaryFromState, loginAs, setupTest } from './helpers';
import { faker } from '@faker-js/faker';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

describe('admissions clerk creates user for case', () => {
  const cerebralTest = setupTest();

  const validEmail = `${faker.internet.userName()}_no_error@example.com`;

  let petitionerContactId;

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest);

  loginAs(cerebralTest, 'admissionsclerk@example.com');
  it('admissions clerk verifies petitioner on case has no email', async () => {
    const contactPrimary = contactPrimaryFromState(cerebralTest);
    petitionerContactId = contactPrimary.contactId;

    await cerebralTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contactPrimary.contactId,
        docketNumber: cerebralTest.docketNumber,
      },
    );

    expect(contactPrimary.email).toBeUndefined();

    expect(cerebralTest.getState('currentPage')).toEqual(
      'EditPetitionerInformationInternal',
    );

    expect(cerebralTest.getState('form.contact.updatedEmail')).toBeUndefined();
    expect(cerebralTest.getState('form.contact.serviceIndicator')).toBe(
      'Paper',
    );
  });

  it('admissions clerk adds an existing email address for petitioner on case', async () => {
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.updatedEmail',
      value: 'petitioner@example.com',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.confirmEmail',
      value: 'petitioner@example.com',
    });

    await cerebralTest.runSequence('submitEditPetitionerSequence');

    expect(cerebralTest.getState('modal.showModal')).toBe(
      'MatchingEmailFoundModal',
    );

    await cerebralTest.runSequence('dismissModalSequence');

    expect(cerebralTest.getState('currentPage')).toEqual(
      'EditPetitionerInformationInternal',
    );
  });

  it('admissions clerk adds a new email address for petitioner on case', async () => {
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.updatedEmail',
      value: validEmail,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.confirmEmail',
      value: validEmail,
    });

    await cerebralTest.runSequence('submitEditPetitionerSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('modal.showModal')).toBe(
      'NoMatchingEmailFoundModal',
    );

    await cerebralTest.runSequence(
      'submitUpdatePetitionerInformationFromModalSequence',
    );

    expect(cerebralTest.getState('modal.showModal')).toBeUndefined();
  });

  it('admissions clerk checks pending email for petitioner on case with unverified email', () => {
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    expect(cerebralTest.getState('screenMetadata.pendingEmails')).toEqual({
      [petitionerContactId]: validEmail,
    });
  });
});
