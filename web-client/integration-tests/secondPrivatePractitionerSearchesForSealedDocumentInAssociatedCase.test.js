import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkSealsCase } from './journey/docketClerkSealsCase';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkAddsDocketEntryFromOrder } from './journey/petitionsClerkAddsDocketEntryFromOrder';
import { petitionsClerkCreateOrder } from './journey/petitionsClerkCreateOrder';
import { petitionsClerkServesOrder } from './journey/petitionsClerkServesOrder';
import { petitionsClerkSignsOrder } from './journey/petitionsClerkSignsOrder';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

const cerebralTest = setupTest();
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

describe('Petitions Clerk Counsel Association Journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Amazing',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Jimothy Schultz',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);
  // petitionsClerkViewsCaseDetail(cerebralTest);
  // create and serve an order
  petitionsClerkCreateOrder(cerebralTest);
  petitionsClerkSignsOrder(cerebralTest);
  petitionsClerkAddsDocketEntryFromOrder(cerebralTest);
  petitionsClerkServesOrder(cerebralTest);

  // seal the case
  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkSealsCase(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');

  it('Associate two private practitioners to a petitioner', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const practitionerBarNumber = 'PT1234';

    expect(cerebralTest.getState('caseDetail.privatePractitioners')).toEqual(
      [],
    );

    await cerebralTest.runSequence('openAddPrivatePractitionerModalSequence');

    expect(
      cerebralTest.getState('validationErrors.practitionerSearchError'),
    ).toBeDefined();

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'practitionerSearch',
      value: practitionerBarNumber,
    });

    await cerebralTest.runSequence('openAddPrivatePractitionerModalSequence');

    expect(
      cerebralTest.getState('validationErrors.practitionerSearchError'),
    ).toBeUndefined();
    expect(cerebralTest.getState('modal.practitionerMatches.length')).toEqual(
      1,
    );

    //default selected because there was only 1 match
    let practitionerMatch = cerebralTest.getState(
      'modal.practitionerMatches.0',
    );
    expect(cerebralTest.getState('modal.user.userId')).toEqual(
      practitionerMatch.userId,
    );

    const formattedCase = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });
    const contactPrimary = formattedCase.petitioners[0];

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: `representingMap.${contactPrimary.contactId}`,
      value: true,
    });

    expect(
      cerebralTest.getState('validationErrors.practitionerSearchError'),
    ).toBeUndefined();

    await cerebralTest.runSequence(
      'associatePrivatePractitionerWithCaseSequence',
    );

    expect(
      cerebralTest.getState('caseDetail.privatePractitioners.length'),
    ).toEqual(1);
    expect(
      cerebralTest.getState('caseDetail.privatePractitioners.0.representing'),
    ).toContain(contactPrimary.contactId);
  });
});
