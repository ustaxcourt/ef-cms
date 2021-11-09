// import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  loginAs,
  setupTest,
  fakeFile,
  contactPrimaryFromState,
} from './helpers';
import { petitionsClerkSubmitsPaperCaseToIrs } from './journey/petitionsClerkSubmitsPaperCaseToIrs';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';
import { COUNTRY_TYPES } from '../../shared/src/business/entities/EntityConstants';

describe('Admissions Clerk modified petitioner address and email', () => {
  const cerebralTest = setupTest();

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCaseFromPaper(cerebralTest, fakeFile);
  petitionsClerkSubmitsPaperCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'admissionsclerk@example.com');

  // update address to be international
  it('blah ', async () => {
    console.log('cerebralTest.docketNumber', cerebralTest.docketNumber)
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

    const formValues = {
      'contact.countryType': COUNTRY_TYPES.INTERNATIONAL,
      'contact.country': 'Ireland',
      'contact.address1': '18 Castle Street',
      'contact.state': 'Adamstown',
      'contact.city': 'Dublin',
      'contact.postalCode': 'K78 CH24',
    };

    for (let [key, value] of Object.entries(formValues)) {
      await cerebralTest.runSequence('updateFormValueSequence', {
        key,
        value,
      });
    }

    // save
    await cerebralTest.runSequence('submitEditPetitionerSequence');
  });
  
  it('blah ', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    
    const contactPrimary = contactPrimaryFromState(cerebralTest);
    
    // edit again
    await cerebralTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contactPrimary.contactId,
        docketNumber: cerebralTest.docketNumber,
      },
    );

  // add email
    const formValues = {
      'contact.updatedEmail': 'thiswillbreak@example.com',
      'contact.confirmEmail': 'thiswillbreak@example.com',
    };

    for (let [key, value] of Object.entries(formValues)) {
      await cerebralTest.runSequence('updateFormValueSequence', {
        key,
        value,
      });
    }

    // save
    await cerebralTest.runSequence('submitEditPetitionerSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('modal.showModal')).toBe(
      'NoMatchingEmailFoundModal',
    );

    await cerebralTest.runSequence(
      'submitUpdatePetitionerInformationFromModalSequence',
    );

    expect(cerebralTest.getState('modal.showModal')).toBeUndefined();
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
  });









  // it('admissions clerk navigates to edit form', async () => {
  //   await refreshElasticsearchIndex();
  //   await cerebralTest.runSequence('gotoEditPractitionerUserSequence', {
  //     barNumber: cerebralTest.barNumber,
  //   });
  //   expect(cerebralTest.getState('currentPage')).toEqual(
  //     'EditPractitionerUser',
  //   );
  // });
});
