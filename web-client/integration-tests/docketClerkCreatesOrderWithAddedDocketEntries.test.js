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

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesAnOrderWithAddedDocketNumbers(cerebralTest);
  docketClerkEditsOrderAndChecksAddedDocketNumbers(cerebralTest);
});
