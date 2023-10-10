import { COUNTRY_TYPES } from '../../shared/src/business/entities/EntityConstants';
import {
  contactPrimaryFromState,
  fakeFile,
  loginAs,
  setupTest,
} from './helpers';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';
import { petitionsClerkReviewsPaperCaseBeforeServing } from './journey/petitionsClerkReviewsPaperCaseBeforeServing';
import { petitionsClerkSubmitsPaperCaseToIrs } from './journey/petitionsClerkSubmitsPaperCaseToIrs';

describe('Admissions Clerk modified petitioner address and email', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCaseFromPaper(cerebralTest, fakeFile);
  petitionsClerkReviewsPaperCaseBeforeServing(cerebralTest, {
    hasIrsNoticeFormatted: 'No',
    ordersAndNoticesInDraft: ['Order Designating Place of Trial'],
    ordersAndNoticesNeeded: ['Order for Ratification of Petition'],
    petitionPaymentStatusFormatted: 'Waived 05/05/05',
    receivedAtFormatted: '01/01/01',
    shouldShowIrsNoticeDate: false,
  });
  petitionsClerkSubmitsPaperCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'admissionsclerk@example.com');

  it('updates petitioner address from domestic to international', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const { contactId } = contactPrimaryFromState(cerebralTest);
    await cerebralTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId,
        docketNumber: cerebralTest.docketNumber,
      },
    );

    const formValues = {
      'contact.address1': '18 Castle Street',
      'contact.city': 'Dublin',
      'contact.country': 'Ireland',
      'contact.countryType': COUNTRY_TYPES.INTERNATIONAL,
      'contact.postalCode': 'K78 CH24',
      'contact.state': 'Adamstown',
    };

    for (let [key, value] of Object.entries(formValues)) {
      await cerebralTest.runSequence('updateFormValueSequence', {
        key,
        value,
      });
    }

    await cerebralTest.runSequence('submitEditPetitionerSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
  });

  it('updates peitioner contact info to add email address', async () => {
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
      'contact.confirmEmail': 'thiswillbreak@example.com',
      'contact.updatedEmail': 'thiswillbreak@example.com',
    };

    for (let [key, value] of Object.entries(formValues)) {
      await cerebralTest.runSequence('updateFormValueSequence', {
        key,
        value,
      });
    }

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
});
