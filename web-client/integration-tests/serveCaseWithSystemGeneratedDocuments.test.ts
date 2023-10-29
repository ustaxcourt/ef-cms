import {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
} from '../../shared/src/business/entities/EntityConstants';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { caseDetailSubnavHelper as caseDetailSubnavHelperComputed } from '../src/presenter/computeds/caseDetailSubnavHelper';
import { fakeFile, loginAs, setupTest } from './helpers';
import { faker } from '@faker-js/faker';
import { petitionsClerkServesPaperCaseToIRS } from './petitionsClerkServesPaperCaseToIRS';
import { reviewSavedPetitionHelper as reviewSavedPetitionHelperComputed } from '../src/presenter/computeds/reviewSavedPetitionHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Petitions Clerk Serves Paper Petition With System Generated Documents', () => {
  const cerebralTest = setupTest();

  const reviewSavedPetitionHelper = withAppContextDecorator(
    reviewSavedPetitionHelperComputed,
  );

  const caseDetailSubnavHelper = withAppContextDecorator(
    caseDetailSubnavHelperComputed,
  );

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const ordersAndNoticesToGenerate = {
    O: {
      stateKey: 'orderDesignatingPlaceOfTrial',
      title: 'Order Designating Place of Trial',
    },
    OAP: {
      stateKey: 'orderForAmendedPetition',
      title: 'Order for Amended Petition',
    },
    OAPF: {
      stateKey: 'orderForAmendedPetitionAndFilingFee',
      title: 'Order for Amended Petition and Filing Fee',
    },
    OF: {
      stateKey: 'orderForFilingFee',
      title: 'Order for Filing Fee',
    },
    OSCP: {
      stateKey: 'orderToShowCause',
      title: 'Order to Show Cause',
    },
  };

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  it('should create a case from paper', async () => {
    await cerebralTest.runSequence('gotoStartCaseWizardSequence');

    const mockContactPrimary = {
      key: 'contactPrimary.name',
      value: `${faker.person.firstName()} ${faker.person.lastName()}`,
    };

    let formValues = [
      {
        key: 'mailingDate',
        value: faker.date.recent().toDateString(),
      },
      {
        key: 'petitionFile',
        value: fakeFile,
      },
      {
        key: 'petitionFileSize',
        value: 1,
      },
      {
        key: 'cdsFile',
        value: fakeFile,
      },
      {
        key: 'cdsFileSize',
        value: 1,
      },
      {
        key: 'corporateDisclosureFile',
        value: fakeFile,
      },
      {
        key: 'corporateDisclosureFileSize',
        value: 1,
      },
      {
        key: 'requestForPlaceOfTrialFile',
        value: fakeFile,
      },
      {
        key: 'requestForPlaceOfTrialFileSize',
        value: 1,
      },
      {
        key: 'applicationForWaiverOfFilingFeeFile',
        value: fakeFile,
      },
      {
        key: 'applicationForWaiverOfFilingFeeFileSize',
        value: 1,
      },
      {
        key: 'preferredTrialCity',
        value: 'Birmingham, Alabama',
      },
      {
        key: 'procedureType',
        value: 'Small',
      },
      {
        key: 'caseType',
        value: CASE_TYPES_MAP.deficiency,
      },
      {
        key: 'partyType',
        value: PARTY_TYPES.petitioner,
      },
      {
        key: 'contactPrimary.countryType',
        value: COUNTRY_TYPES.INTERNATIONAL,
      },
      {
        key: 'contactPrimary.country',
        value: 'Switzerland',
      },
      mockContactPrimary,
      {
        key: 'contactPrimary.address1',
        value: faker.location.streetAddress(),
      },
      {
        key: 'contactPrimary.city',
        value: 'abc',
      },
      {
        key: 'contactPrimary.postalCode',
        value: faker.location.zipCode(),
      },
      {
        key: 'contactPrimary.phone',
        value: faker.phone.number(),
      },
      {
        key: 'petitionPaymentStatus',
        value: PAYMENT_STATUS.UNPAID,
      },
    ];

    for (const item of formValues) {
      if (item.key === 'partyType') {
        await cerebralTest.runSequence(
          'updateStartCaseInternalPartyTypeSequence',
          item,
        );
      } else if (item.key === 'petitionPaymentStatus') {
        await cerebralTest.runSequence(
          'updatePetitionPaymentFormValueSequence',
          item,
        );
      } else {
        await cerebralTest.runSequence('updateFormValueSequence', item);
      }
    }

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'receivedAt',
        toFormat: FORMATS.ISO,
        value: `${faker.number.int({ max: 11, min: 1 })}/${faker.number.int({
          max: 28,
          min: 1,
        })}/${faker.number.int({ max: 2021, min: 2001 })}`,
      },
    );

    for (const item of Object.values(ordersAndNoticesToGenerate)) {
      await cerebralTest.runSequence('updateFormValueSequence', {
        key: item.stateKey,
        value: true,
      });
    }

    await cerebralTest.runSequence(
      'updateFormValueAndCaseCaptionSequence',
      mockContactPrimary,
    );

    await cerebralTest.runSequence('validatePetitionFromPaperSequence');

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(cerebralTest.getState('alertError')).toBeUndefined();
    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('currentPage')).toEqual('ReviewSavedPetition');

    cerebralTest.docketNumber = cerebralTest.getState(
      'caseDetail.docketNumber',
    );
  });

  it('should display the orders and notices that will be generated after service', () => {
    const helper = runCompute(reviewSavedPetitionHelper, {
      state: cerebralTest.getState(),
    });

    for (let document of Object.values(ordersAndNoticesToGenerate)) {
      expect(helper.ordersAndNoticesInDraft).toContain(document.title);
    }
  });

  petitionsClerkServesPaperCaseToIRS(cerebralTest);

  it('should display the count of draft documents in the drafts tab after petition is served', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const helper = runCompute(caseDetailSubnavHelper, {
      state: cerebralTest.getState(),
    });

    expect(helper.draftDocketEntryCount).toEqual(
      Object.keys(ordersAndNoticesToGenerate).length,
    );
  });

  it('should display the orders and notices that will be generated after service', () => {
    const eventCodes = Object.keys(ordersAndNoticesToGenerate);
    for (const eventCodesIndex in eventCodes) {
      const docketEntry = cerebralTest
        .getState('caseDetail.docketEntries')
        .find(d => d.eventCode === eventCodes[eventCodesIndex]);

      expect(docketEntry.isDraft).toEqual(true);
    }
  });
});
