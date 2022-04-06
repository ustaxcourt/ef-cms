import {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
} from '../../shared/src/business/entities/EntityConstants';
import { caseDetailSubnavHelper as caseDetailSubnavHelperComputed } from '../src/presenter/computeds/caseDetailSubnavHelper';
import { reviewSavedPetitionHelper as reviewSavedPetitionHelperComputed } from '../src/presenter/computeds/reviewSavedPetitionHelper';

import { fakeFile, loginAs, setupTest } from './helpers';
import { runCompute } from 'cerebral/test';
import { servePetitionToIRS } from './userFlows/servePetition.test';
import { withAppContextDecorator } from '../src/withAppContext';
const { faker } = require('@faker-js/faker');

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

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  it('should create a case from paper', async () => {
    await cerebralTest.runSequence('gotoStartCaseWizardSequence');

    const mockContactPrimary = {
      key: 'contactPrimary.name',
      value: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };

    let formValues = [
      {
        key: 'receivedAtMonth',
        value: faker.datatype.number({ max: 11, min: 1 }),
      },
      {
        key: 'receivedAtDay',
        value: faker.datatype.number({ max: 28, min: 1 }),
      },
      {
        key: 'receivedAtYear',
        value: faker.datatype.number({ max: 2021, min: 2001 }),
      },
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
        key: 'odsFile',
        value: fakeFile,
      },
      {
        key: 'odsFileSize',
        value: 1,
      },
      {
        key: 'ownershipDisclosureFile',
        value: fakeFile,
      },
      {
        key: 'ownershipDisclosureFileSize',
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
        value: faker.address.streetAddress(),
      },
      {
        key: 'contactPrimary.city',
        value: 'abc',
      },
      {
        key: 'contactPrimary.postalCode',
        value: faker.address.zipCode(),
      },
      {
        key: 'contactPrimary.phone',
        value: faker.phone.phoneNumber(),
      },
      {
        key: 'petitionPaymentStatus',
        value: PAYMENT_STATUS.UNPAID,
      },
      {
        key: 'orderToShowCause',
        value: true,
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

    expect(helper.ordersAndNoticesInDraft).toContain('Order for Filing Fee');
    expect(helper.ordersAndNoticesInDraft).toContain('Order to Show Cause');
  });

  servePetitionToIRS(cerebralTest);

  it('should display the count of draft documents in the drafts tab after petition is served', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const helper = runCompute(caseDetailSubnavHelper, {
      state: cerebralTest.getState(),
    });

    expect(helper.draftDocketEntryCount).toEqual(2);
  });

  it('should display the orders and notices that will be generated after service', () => {
    const orderForFilingFeeDocketEntry = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(d => d.eventCode === 'OF');

    const orderToShowCauseDocketEntry = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(d => d.eventCode === 'OSCP');

    expect(orderForFilingFeeDocketEntry.isDraft).toEqual(true);
    expect(orderToShowCauseDocketEntry.isDraft).toEqual(true);
  });
});
