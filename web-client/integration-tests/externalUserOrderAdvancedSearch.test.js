import { ADVANCED_SEARCH_TABS } from '../../shared/src/business/entities/EntityConstants';
import { advancedDocumentSearchHelper as advancedDocumentSearchHelperComputed } from '../src/presenter/computeds/AdvancedSearch/advancedDocumentSearchHelper';
import { associatedUserSearchesForServedOrder } from './journey/associatedUserSearchesForServedOrder';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkSealsCase } from './journey/docketClerkSealsCase';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  updateOrderForm,
  uploadPetition,
} from './helpers';
import { petitionsClerkAddsPractitionerToPrimaryContact } from './journey/petitionsClerkAddsPractitionerToPrimaryContact';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { runCompute } from 'cerebral/test';
import { unassociatedUserSearchesForServedOrderInSealedCase } from './journey/unassociatedUserSearchesForServedOrderInSealedCase';
import { unassociatedUserSearchesForServedOrderInUnsealedCase } from './journey/unassociatedUserSearchesForServedOrderInUnsealedCase';
import { withAppContextDecorator } from '../src/withAppContext';

describe('external users perform an advanced search for orders', () => {
  const cerebralTest = setupTest();
  cerebralTest.draftOrders = [];

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case #1', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(cerebralTest);
  petitionsClerkAddsPractitionersToCase(cerebralTest, true);
  petitionsClerkAddsRespondentsToCase(cerebralTest);
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(cerebralTest, {
    documentContents: 'this is a thing that I can search for, Jiminy Cricket',
    documentTitle: 'Order',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkSignsOrder(cerebralTest, 0);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 0);
  docketClerkServesDocument(cerebralTest, 0);

  loginAs(cerebralTest, 'privatePractitioner@example.com');
  associatedUserSearchesForServedOrder(cerebralTest, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(cerebralTest, 'privatePractitioner1@example.com');
  unassociatedUserSearchesForServedOrderInUnsealedCase(cerebralTest, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(cerebralTest, 'irsPractitioner@example.com');
  associatedUserSearchesForServedOrder(cerebralTest, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(cerebralTest, 'irsPractitioner2@example.com');
  unassociatedUserSearchesForServedOrderInUnsealedCase(cerebralTest, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkSealsCase(cerebralTest);
  petitionsClerkAddsPractitionerToPrimaryContact(cerebralTest, 'PT5432');

  // case is sealed, no docket entries are sealed, prac is associated with case => show icon and return result
  // case is sealed, no docket entries are sealed, prac NOT associated with case => no results for that case
  loginAs(cerebralTest, 'privatePractitioner1@example.com');
  it('search for order in sealed case as the second practitioner associated to the petitioner', async () => {
    await refreshElasticsearchIndex();

    await updateOrderForm(cerebralTest, {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

    const advancedDocumentSearchHelper = withAppContextDecorator(
      advancedDocumentSearchHelperComputed,
    );
    const searchHelper = runCompute(advancedDocumentSearchHelper, {
      state: cerebralTest.getState(),
    });

    expect(searchHelper.searchResults[0].showSealedIcon).toBe(true);
    expect(
      cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: cerebralTest.docketNumber,
        }),
      ]),
    );
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('removes second private practitioner associated to the petitioner from case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoEditPetitionerCounselSequence', {
      barNumber: 'PT5432',
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
  });

  loginAs(cerebralTest, 'privatePractitioner1@example.com');
  it('search for order in sealed case as an unassociated practitioner', async () => {
    await refreshElasticsearchIndex();

    await updateOrderForm(cerebralTest, {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

    expect(
      cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).toEqual([]);
  });

  loginAs(cerebralTest, 'privatePractitioner@example.com');
  associatedUserSearchesForServedOrder(cerebralTest, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(cerebralTest, 'privatePractitioner2@example.com');
  unassociatedUserSearchesForServedOrderInSealedCase(cerebralTest, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(cerebralTest, 'irsPractitioner@example.com');
  associatedUserSearchesForServedOrder(cerebralTest, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(cerebralTest, 'irsPractitioner2@example.com');
  unassociatedUserSearchesForServedOrderInSealedCase(cerebralTest, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(cerebralTest, 'privatePractitioner2@example.com');
  it('search for sealed order in unsealed case as an unassociated practitioner', async () => {
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.docketNumber = '999-15';

    await updateOrderForm(cerebralTest, {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

    const advancedDocumentSearchHelper = withAppContextDecorator(
      advancedDocumentSearchHelperComputed,
    );

    const searchHelper = runCompute(advancedDocumentSearchHelper, {
      state: cerebralTest.getState(),
    });

    console.log('searchHelper.searchResults', searchHelper.searchResults);

    expect(searchHelper.searchResults).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentTitle: 'Sealed Order',
          isCaseSealed: false,
          isDocketEntrySealed: true,
          showSealedIcon: true,
        }),
        expect.objectContaining({
          documentTitle: "This is a legacy judge's order 4",
          isCaseSealed: false,
          isDocketEntrySealed: false,
          showSealedIcon: false,
        }),
      ]),
    );
  });

  loginAs(cerebralTest, 'privatePractitioner@example.com');
  it('search for sealed order in unsealed case as an associated practitioner', async () => {
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.docketNumber = '999-15';

    await updateOrderForm(cerebralTest, {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

    const advancedDocumentSearchHelper = withAppContextDecorator(
      advancedDocumentSearchHelperComputed,
    );
    const searchHelper = runCompute(advancedDocumentSearchHelper, {
      state: cerebralTest.getState(),
    });

    expect(searchHelper.searchResults).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: cerebralTest.docketNumber,
          showSealedIcon: true,
        }),
        expect.objectContaining({
          docketNumber: cerebralTest.docketNumber,
          showSealedIcon: true,
        }),
      ]),
    );
  });
});
