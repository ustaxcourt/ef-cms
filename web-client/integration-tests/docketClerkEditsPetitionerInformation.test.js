import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  contactPrimaryFromState,
  loginAs,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

const cerebralTest = setupTest();
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

describe('docket clerk edits the petitioner information', () => {
  beforeEach(() => {
    jest.setTimeout(50000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  let caseDetail;

  loginAs(cerebralTest, 'petitioner@example.com');

  it('login as a tax payer and create a case', async () => {
    caseDetail = await uploadPetition(cerebralTest, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Secondary Person',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'CT',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');

  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');

  it('login as the docketclerk and edit the case contact information', async () => {
    const contactPrimary = contactPrimaryFromState(cerebralTest);

    await cerebralTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contactPrimary.contactId,
        docketNumber: caseDetail.docketNumber,
      },
    );

    expect(contactPrimary.address1).toEqual('734 Cowley Parkway');

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: '',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.phone',
      value: '',
    });

    expect(cerebralTest.getState('form.contact.address1')).toBeUndefined();

    await cerebralTest.runSequence('submitEditPetitionerSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      contact: {
        address1: 'Enter mailing address',
        phone: 'Enter phone number',
      },
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.phone',
      value: '1234567890',
    });

    await cerebralTest.runSequence('submitEditPetitionerSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      contact: {
        address1: 'Enter mailing address',
      },
    });

    await cerebralTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contactPrimary.contactId,
        docketNumber: caseDetail.docketNumber,
      },
    );

    expect(cerebralTest.getState('form.contact.address2')).toEqual(
      'Cum aut velit volupt',
    );

    expect(cerebralTest.getState('form.contact.address3')).toEqual(
      'Et sunt veritatis ei',
    );

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: '123 Some Street',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.address2',
      value: '',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.address3',
      value: '',
    });
  });

  it('verify that the paper service modal is displayed after submitting the address, the address was updated, and a Notice of Change of Address was generated and served', async () => {
    await cerebralTest.runSequence('submitEditPetitionerSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const contactPrimary = contactPrimaryFromState(cerebralTest);

    expect(contactPrimary.address1).toEqual('123 Some Street');

    expect(contactPrimary.address2).toBeUndefined();
    expect(contactPrimary.address3).toBeUndefined();

    const noticeDocument = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(d => d.documentTitle === 'Notice of Change of Address');
    expect(noticeDocument.servedAt).toBeDefined();
  });
});
