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

  loginAs(test, 'docketclerk');
  //   Case xx1-20
  // Create sign, serve Order to Show Cause
  it('set docket number', async () => {
    test.docketNumber = createdCases[0].docketNumber;
    test.draftOrders = [];
  });
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  // docketClerkServesOrder(test, 0);

  // // Create, sign and serve Order "for the Cause of Something"
  // docketClerkCreatesAnOrder(test, {
  //   documentTitle: 'Order of Dismissal',
  //   eventCode: 'OD',
  //   expectedDocumentType: 'Order of Dismissal',
  // });
  // docketClerkServesOrder(test, 0);

  // // Case xx2-20
  // // Create sign, serve Order for Dismissal
  // it('set docket number', async () => {
  //   test.docketNumber = createdCases[1].docketNumber;
  // });
  // docketClerkCreatesAnOrder(test, {
  //   documentTitle: 'Order of Dismissal for Lack of Jurisdiction',
  //   eventCode: 'ODJ',
  //   expectedDocumentType: 'Order of Dismissal for Lack of Jurisdiction',
  // });
  // docketClerkServesOrder(test, 0);

  // // Case xx3-20
  // // Create, sign, serve Order for Dismissal
  // it('set docket number', async () => {
  //   test.docketNumber = createdCases[2].docketNumber;
  // });
  // docketClerkCreatesAnOrder(test, {
  //   documentTitle: 'Order of something',
  //   eventCode: 'O',
  //   expectedDocumentType: 'Order',
  // });
  // docketClerkServesOrder(test, 0);

  // go to advanced order search

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
