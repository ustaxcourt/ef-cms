import { docketClerkCreatesAnOrderWithAddedDocketNumbers } from './journey/docketClerkCreatesAnOrderWithAddedDocketNumbers';
import { docketClerkEditsOrderAndChecksAddedDocketNumbers } from './journey/docketClerkEditsOrderAndChecksAddedDocketNumbers';
import { loginAs, setupTest } from './helpers';

describe('Docketclerk creates an order with added docket numbers on the cover sheet', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  it('set the docket number', () => {
    cerebralTest.docketNumber = '111-19';
  });

  // loginAs(cerebralTest, 'docketclerk@example.com');

  it('set the docket number', async () => {
    await cerebralTest.runSequence('signOutSequence');
  });
  // docketClerkCreatesAnOrderWithAddedDocketNumbers(cerebralTest);
  // docketClerkEditsOrderAndChecksAddedDocketNumbers(cerebralTest);
});

// what are the inner working of --detectOpenHandles
// Figure out exaclt where the error is been thrown and work backwards.
//How do we get from the location of that error to the end error thrown by cerebral test
