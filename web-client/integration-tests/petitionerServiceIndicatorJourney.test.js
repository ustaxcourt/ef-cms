import { SERVICE_INDICATOR_TYPES } from '../../shared/src/business/entities/EntityConstants';
import {
  contactPrimaryFromState,
  fakeFile,
  loginAs,
  setupTest,
} from './helpers';
import { formattedCaseDetail } from '../src/presenter/computeds/formattedCaseDetail';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';
import { petitionsClerkSubmitsPaperCaseToIrs } from './journey/petitionsClerkSubmitsPaperCaseToIrs';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const test = setupTest();
test.draftOrders = [];

describe('Petitioner Service Indicator Journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCaseFromPaper(test, fakeFile);
  petitionsClerkSubmitsPaperCaseToIrs(test);

  // verify it is paper

  loginAs(test, 'docketclerk@example.com');
  it('Docket Clerk verifies petitioner service indicator is paper', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const contactPrimary = caseDetailFormatted.petitioners[0];

    expect(contactPrimary.serviceIndicator).toEqual('Paper');
  });

  loginAs(test, 'admissionsclerk@example.com');
  it('Admissions Clerk updates petitioner email address', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const contactPrimary = contactPrimaryFromState(test);

    await test.runSequence('gotoEditPetitionerInformationInternalSequence', {
      contactId: contactPrimary.contactId,
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.updatedEmail',
      value: 'petitioner@example.com',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.confirmEmail',
      value: 'petitioner@example.com',
    });

    await test.runSequence('submitEditPetitionerSequence');
    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('modal.showModal')).toEqual('MatchingEmailFoundModal');

    await test.runSequence(
      'submitUpdatePetitionerInformationFromModalSequence',
    );

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('alertSuccess.message')).toEqual('Changes saved.');
  });

  // verify it is electronic

  loginAs(test, 'docketclerk@example.com');
  it('Docket Clerk verifies petitioner service indicator is now electronic', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const contactPrimary = contactPrimaryFromState(test);
    expect(contactPrimary.serviceIndicator).toEqual('Electronic');
  });

  loginAs(test, 'irsPractitioner@example.com');
  it('IRS Practitioner verifies service indicator is electronic', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetail');

    const contactPrimary = contactPrimaryFromState(test);
    expect(contactPrimary.serviceIndicator).toEqual('Electronic');
  });

  // seal address
  loginAs(test, 'docketclerk@example.com');
  it('Docket Clerk seals address and verifies petitioner service indicator is electronic', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    let contactPrimary = contactPrimaryFromState(test);

    await test.runSequence('openSealAddressModalSequence', {
      contactToSeal: contactPrimary,
    });

    expect(test.getState('modal.showModal')).toEqual('SealAddressModal');

    await test.runSequence('sealAddressSequence');
    expect(test.getState('alertSuccess.message')).toContain(
      'Address sealed for',
    );

    contactPrimary = contactPrimaryFromState(test);
    expect(contactPrimary.serviceIndicator).toEqual('Electronic');
  });

  loginAs(test, 'irsPractitioner@example.com');
  it('IRS Practitioner verifies service indicator for contact is electronic, with sealed address', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetail');

    const contactPrimary = contactPrimaryFromState(test);
    expect(contactPrimary.serviceIndicator).toEqual('Electronic');
  });

  // add private practitioner
  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkAddsPractitionersToCase(test, true);

  // verify None for docket clerk
  // verify None for irsPractitioner

  loginAs(test, 'docketclerk@example.com');
  it('Docket Clerk verifies petitioner service indicator shows none, with sealed address', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const contactPrimary = contactPrimaryFromState(test);
    expect(contactPrimary.serviceIndicator).toEqual('None');
  });

  loginAs(test, 'irsPractitioner1@example.com'); // unassociated practitioner
  it('IRS Practitioner verifies service indicator for contact shows none with sealed address', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetail');

    const contactPrimary = contactPrimaryFromState(test);
    expect(contactPrimary.serviceIndicator).toEqual('None');
  });

  // explicitly set petitioner to Paper
  loginAs(test, 'docketclerk@example.com');
  it('Updates petitioner service indicator to paper', async () => {
    const contactToEdit = contactPrimaryFromState(test);

    await test.runSequence('gotoEditPetitionerInformationInternalSequence', {
      contactId: contactToEdit.contactId,
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.serviceIndicator',
      value: 'Paper',
    });

    await test.runSequence('submitEditPetitionerSequence');

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('alertSuccess.message')).toEqual('Changes saved.');

    const contactPrimary = contactPrimaryFromState(test);
    expect(contactPrimary.serviceIndicator).toEqual('Paper');
  });

  // verify Paper for irsPractitioner
  loginAs(test, 'irsPractitioner@example.com');
  it('IRS Practitioner verifies service indicator for contact is paper, with sealed address', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetail');

    const contactPrimary = contactPrimaryFromState(test);
    expect(contactPrimary.serviceIndicator).toEqual('Paper');
  });

  // explicitly set petitioner to Paper
  loginAs(test, 'docketclerk@example.com');
  it('Updates petitioner service indicator to none', async () => {
    let contactPrimary = contactPrimaryFromState(test);

    await test.runSequence('gotoEditPetitionerInformationInternalSequence', {
      contactId: contactPrimary.contactId,
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.serviceIndicator',
      value: 'None',
    });

    await test.runSequence('submitEditPetitionerSequence');

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('alertSuccess.message')).toEqual('Changes saved.');

    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    contactPrimary = caseDetailFormatted.petitioners[0];
    expect(contactPrimary.serviceIndicator).toEqual('None');
  });

  loginAs(test, 'docketclerk@example.com');
  it('Removes private practitioner from case and check service indicator is electronic when contact has an email', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const barNumber = test.getState(
      'caseDetail.privatePractitioners.0.barNumber',
    );

    await test.runSequence('gotoEditPetitionerCounselSequence', {
      barNumber,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('EditPetitionerCounsel');

    await test.runSequence('openRemovePetitionerCounselModalSequence');

    expect(test.getState('modal.showModal')).toEqual(
      'RemovePetitionerCounselModal',
    );

    await test.runSequence('removePetitionerCounselFromCaseSequence');

    expect(test.getState('validationErrors')).toEqual({});

    const contactPrimary = contactPrimaryFromState(test);
    expect(contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
    expect(contactPrimary.email).toBeDefined();
  });

  loginAs(test, 'irsPractitioner@example.com');
  it('IRS Practitioner verifies service indicator for contact is electronic, with sealed address', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetail');

    const contactPrimary = contactPrimaryFromState(test);
    expect(contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });
});
