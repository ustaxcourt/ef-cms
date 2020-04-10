import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkAddsDocketEntryFromOrderOfDismissal } from './journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkServesOrder } from './journey/docketClerkServesOrder';

import { loginAs, setupTest, uploadPetition } from './helpers';

const test = setupTest({
  useCases: {
    loadPDFForSigningInteractor: () => Promise.resolve(null),
  },
});

describe('docket clerk order advanced search', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    test.draftOrders = [];
  });

  const caseCreationCount = 3;
  let createdCases = [];

  loginAs(test, 'petitioner');
  for (let i = 0; i < caseCreationCount; i++) {
    it(`create case ${i + 1}`, async () => {
      const caseDetail = await uploadPetition(test);
      createdCases.push(caseDetail);
    });
  }

  // loginAs(test, 'docketclerk');
  // it('set docket number', async () => {
  //   test.docketNumber = createdCases[0].docketNumber;
  // });
  // docketClerkCreatesAnOrder(test, {
  //   documentTitle: 'Order',
  //   eventCode: 'O',
  //   expectedDocumentType: 'Order',
  //   signedAtFormatted: '01/02/2020',
  // });
  // docketClerkAddsDocketEntryFromOrder(test, 0);
  // docketClerkServesOrder(test, 0);

  // it('set docket number', async () => {
  //   test.docketNumber = createdCases[0].docketNumber;
  // });
  // docketClerkCreatesAnOrder(test, {
  //   documentTitle: 'Order of Dismissal',
  //   eventCode: 'OD',
  //   expectedDocumentType: 'Order of Dismissal',
  // });
  // docketClerkAddsDocketEntryFromOrderOfDismissal(test, 1);
  // docketClerkServesOrder(test, 1);

  // it('set docket number', async () => {
  //   test.docketNumber = createdCases[1].docketNumber;
  // });
  // docketClerkCreatesAnOrder(test, {
  //   documentTitle: 'Order of Dismissal',
  //   eventCode: 'OD',
  //   expectedDocumentType: 'Order of Dismissal',
  // });
  // docketClerkAddsDocketEntryFromOrderOfDismissal(test, 2);
  // docketClerkServesOrder(test, 2);

  it('set docket number', async () => {
    test.docketNumber = createdCases[2].docketNumber;
  });
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order of something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkAddsDocketEntryFromOrder(test, 0);
  docketClerkServesOrder(test, 0);

  // go to advanced order search
  // await runAction(navigateToPathAction, {
  //   modules: {
  //     presenter,
  //   },
  //   props: {
  //     path: '/search',
  //   },
  // });

  // search for 'red fish'
  // expect zero results

  // search for 'glasses'
  // expect 4 results, 'glasses' results on top of list

  // search for 'sunglasses'
  // expect 2 exact results

  // search with empty string
  // expect error message

  // petitionsClerkCreatesNewCase(test, fakeFile);
  // petitionsClerkAdvancedSearchForCase(test);
});
