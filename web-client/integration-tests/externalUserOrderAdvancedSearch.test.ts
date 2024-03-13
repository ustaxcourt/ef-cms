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
import { runCompute } from '@web-client/presenter/test.cerebral';
import { unassociatedUserSearchesForServedOrderInSealedCase } from './journey/unassociatedUserSearchesForServedOrderInSealedCase';
import { unassociatedUserSearchesForServedOrderInUnsealedCase } from './journey/unassociatedUserSearchesForServedOrderInUnsealedCase';
import { withAppContextDecorator } from '../src/withAppContext';

describe('external users perform an advanced search for orders', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
    cerebralTest.draftOrders = [];
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('petitioner creates an electronic case', async () => {
    const { docketNumber } = await uploadPetition(cerebralTest);

    expect(docketNumber).toBeDefined();

    cerebralTest.docketNumber = docketNumber;
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
  docketClerkSignsOrder(cerebralTest);
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

  loginAs(cerebralTest, 'irspractitioner@example.com');
  associatedUserSearchesForServedOrder(cerebralTest, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(cerebralTest, 'irspractitioner2@example.com');
  unassociatedUserSearchesForServedOrderInUnsealedCase(cerebralTest, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkSealsCase(cerebralTest);
  petitionsClerkAddsPractitionerToPrimaryContact(cerebralTest, 'PT5432');

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

  loginAs(cerebralTest, 'irspractitioner@example.com');
  associatedUserSearchesForServedOrder(cerebralTest, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(cerebralTest, 'irspractitioner2@example.com');
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

    expect(
      cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentTitle: 'Sealed Order',
          isCaseSealed: false,
          isDocketEntrySealed: true,
        }),
      ]),
    );
  });

  ['privatePractitioner@example.com', 'irspractitioner@example.com'].forEach(
    email => {
      loginAs(cerebralTest, email);
      it(`search for an order that has been sealed from the public in an unsealed case as an associated ${email} user`, async () => {
        cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

        cerebralTest.docketNumber = '999-15';

        await updateOrderForm(cerebralTest, {
          docketNumber: cerebralTest.docketNumber,
        });

        await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

        expect(
          cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
        ).toMatchObject(
          expect.arrayContaining([
            expect.objectContaining({
              docketEntryId: '6d83425c-8ef3-4c66-b776-6c7957c53f4d',
              docketNumber: cerebralTest.docketNumber,
            }),
            expect.objectContaining({
              docketEntryId: '1a92894e-83a5-48ba-9994-3ada44235deb',
              docketNumber: cerebralTest.docketNumber,
              isDocketEntrySealed: true,
            }),
          ]),
        );

        expect(
          cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
        ).not.toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              docketEntryId: '9de27a7d-7c6b-434b-803b-7655f82d5e07',
              docketNumber: cerebralTest.docketNumber,
            }),
          ]),
        );
      });

      it(`search for an order that has been sealed from all external users as an associated ${email} user`, async () => {
        cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

        cerebralTest.docketNumber = '999-15';

        await updateOrderForm(cerebralTest, {
          docketNumber: cerebralTest.docketNumber,
        });

        await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

        const orderSearchResultsFromState = cerebralTest.getState(
          `searchResults.${ADVANCED_SEARCH_TABS.ORDER}`,
        );

        const sealedToExternalDocketEntryId =
          'ffb6c3d7-bfd5-4a19-8d23-6fd75a1e362c';
        const sealedToExternalDocketEntry = orderSearchResultsFromState.find(
          docketEntry =>
            docketEntry.docketEntryId === sealedToExternalDocketEntryId,
        );
        expect(sealedToExternalDocketEntry).toBeUndefined();
      });
    },
  );
});
