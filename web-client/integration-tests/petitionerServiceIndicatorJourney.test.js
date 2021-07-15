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

const cerebralTest = setupTest();
cerebralTest.draftOrders = [];

describe('Petitioner Service Indicator Journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCaseFromPaper(cerebralTest, fakeFile);
  petitionsClerkSubmitsPaperCaseToIrs(cerebralTest);

  // verify it is paper

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('Docket Clerk verifies petitioner service indicator is paper', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    const contactPrimary = caseDetailFormatted.petitioners[0];

    expect(contactPrimary.serviceIndicator).toEqual('Paper');
  });

  loginAs(cerebralTest, 'admissionsclerk@example.com');
  it('Admissions Clerk updates petitioner email address', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const contactPrimary = contactPrimaryFromState(cerebralTest);

    await cerebralTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contactPrimary.contactId,
        docketNumber: cerebralTest.docketNumber,
      },
    );

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.updatedEmail',
      value: 'petitioner@example.com',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.confirmEmail',
      value: 'petitioner@example.com',
    });

    await cerebralTest.runSequence('submitEditPetitionerSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'MatchingEmailFoundModal',
    );

    await cerebralTest.runSequence(
      'submitUpdatePetitionerInformationFromModalSequence',
    );

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(cerebralTest.getState('alertSuccess.message')).toEqual(
      'Changes saved.',
    );
  });

  // verify it is electronic

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('Docket Clerk verifies petitioner service indicator is now electronic', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const contactPrimary = contactPrimaryFromState(cerebralTest);
    expect(contactPrimary.serviceIndicator).toEqual('Electronic');
  });

  loginAs(cerebralTest, 'irsPractitioner@example.com');
  it('IRS Practitioner verifies service indicator is electronic', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetail');

    const contactPrimary = contactPrimaryFromState(cerebralTest);
    expect(contactPrimary.serviceIndicator).toEqual('Electronic');
  });

  // seal address
  loginAs(cerebralTest, 'docketclerk@example.com');
  it('Docket Clerk seals address and verifies petitioner service indicator is electronic', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    let contactPrimary = contactPrimaryFromState(cerebralTest);

    await cerebralTest.runSequence('openSealAddressModalSequence', {
      contactToSeal: contactPrimary,
    });

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'SealAddressModal',
    );

    await cerebralTest.runSequence('sealAddressSequence');
    expect(cerebralTest.getState('alertSuccess.message')).toContain(
      'Address sealed for',
    );

    contactPrimary = contactPrimaryFromState(cerebralTest);
    expect(contactPrimary.serviceIndicator).toEqual('Electronic');
  });

  loginAs(cerebralTest, 'irsPractitioner@example.com');
  it('IRS Practitioner verifies service indicator for contact is electronic, with sealed address', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetail');

    const contactPrimary = contactPrimaryFromState(cerebralTest);
    expect(contactPrimary.serviceIndicator).toEqual('Electronic');
  });

  // add private practitioner
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkAddsPractitionersToCase(cerebralTest, true);

  // verify None for docket clerk
  // verify None for irsPractitioner

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('Docket Clerk verifies petitioner service indicator shows none, with sealed address', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const contactPrimary = contactPrimaryFromState(cerebralTest);
    expect(contactPrimary.serviceIndicator).toEqual('None');
  });

  loginAs(cerebralTest, 'irsPractitioner1@example.com'); // unassociated practitioner
  it('IRS Practitioner verifies service indicator for contact shows none with sealed address', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetail');

    const contactPrimary = contactPrimaryFromState(cerebralTest);
    expect(contactPrimary.serviceIndicator).toEqual('None');
  });

  // explicitly set petitioner to Paper
  loginAs(cerebralTest, 'docketclerk@example.com');
  it('Updates petitioner service indicator to paper', async () => {
    const contactToEdit = contactPrimaryFromState(cerebralTest);

    await cerebralTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contactToEdit.contactId,
        docketNumber: cerebralTest.docketNumber,
      },
    );

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.serviceIndicator',
      value: 'Paper',
    });

    await cerebralTest.runSequence('submitEditPetitionerSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(cerebralTest.getState('alertSuccess.message')).toEqual(
      'Changes saved.',
    );

    const contactPrimary = contactPrimaryFromState(cerebralTest);
    expect(contactPrimary.serviceIndicator).toEqual('Paper');
  });

  // verify Paper for irsPractitioner
  loginAs(cerebralTest, 'irsPractitioner@example.com');
  it('IRS Practitioner verifies service indicator for contact is paper, with sealed address', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetail');

    const contactPrimary = contactPrimaryFromState(cerebralTest);
    expect(contactPrimary.serviceIndicator).toEqual('Paper');
  });

  // explicitly set petitioner to Paper
  loginAs(cerebralTest, 'docketclerk@example.com');
  it('Updates petitioner service indicator to none', async () => {
    let contactPrimary = contactPrimaryFromState(cerebralTest);

    await cerebralTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contactPrimary.contactId,
        docketNumber: cerebralTest.docketNumber,
      },
    );

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.serviceIndicator',
      value: 'None',
    });

    await cerebralTest.runSequence('submitEditPetitionerSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(cerebralTest.getState('alertSuccess.message')).toEqual(
      'Changes saved.',
    );

    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    contactPrimary = caseDetailFormatted.petitioners[0];
    expect(contactPrimary.serviceIndicator).toEqual('None');
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('Removes private practitioner from case and check service indicator is electronic when contact has an email', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const barNumber = cerebralTest.getState(
      'caseDetail.privatePractitioners.0.barNumber',
    );

    await cerebralTest.runSequence('gotoEditPetitionerCounselSequence', {
      barNumber,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual(
      'EditPetitionerCounsel',
    );

    await cerebralTest.runSequence('openRemovePetitionerCounselModalSequence');

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'RemovePetitionerCounselModal',
    );

    await cerebralTest.runSequence('removePetitionerCounselFromCaseSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    const contactPrimary = contactPrimaryFromState(cerebralTest);
    expect(contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
    expect(contactPrimary.email).toBeDefined();
  });

  loginAs(cerebralTest, 'irsPractitioner@example.com');
  it('IRS Practitioner verifies service indicator for contact is electronic, with sealed address', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetail');

    const contactPrimary = contactPrimaryFromState(cerebralTest);
    expect(contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });
});
