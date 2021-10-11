import { setupTest } from './helpers';
import { unauthedUserInvalidSearchForOpinion } from './journey/unauthedUserInvalidSearchForOpinion';
import { unauthedUserNavigatesToPublicSite } from './journey/unauthedUserNavigatesToPublicSite';
import { unauthedUserSearchesForOpinionByKeyword } from './journey/unauthedUserSearchesForOpinionByKeyword';

const cerebralTest = setupTest();

// To be enabled once public has permission to search for opinions
describe.skip('Unauthed user searches for an opinion by keyword', () => {
  unauthedUserNavigatesToPublicSite(cerebralTest);
  unauthedUserInvalidSearchForOpinion(cerebralTest);
  unauthedUserSearchesForOpinionByKeyword(cerebralTest);
});
