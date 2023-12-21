import { setupTest } from './helpers';
import { unauthedUserNavigatesToPublicSite } from './journey/unauthedUserNavigatesToPublicSite';
import { unauthedUserSearchesForOpinionByDocketNumber } from './journey/unauthedUserSearchesForOpinionByDocketNumber';
import { unauthedUserSearchesForOpinionByKeyword } from './journey/unauthedUserSearchesForOpinionByKeyword';

const cerebralTest = setupTest();

describe('Unauthed user searches for an opinion by keyword', () => {
  unauthedUserNavigatesToPublicSite(cerebralTest);
  unauthedUserSearchesForOpinionByKeyword(cerebralTest);
});

describe('Unauthed user searches for a legacy sealed opinion by keyword', () => {
  cerebralTest.docketNumber = '129-20';
  unauthedUserNavigatesToPublicSite(cerebralTest);
  unauthedUserSearchesForOpinionByDocketNumber(cerebralTest);
});
