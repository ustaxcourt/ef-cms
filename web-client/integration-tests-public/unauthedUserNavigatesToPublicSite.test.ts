import { setupTest } from './helpers';
import { unauthedUserNavigatesToPublicSite } from './journey/unauthedUserNavigatesToPublicSite';

const cerebralTest = setupTest();
describe('Unauthed user navigates to public site', () => {
  unauthedUserNavigatesToPublicSite(cerebralTest);
});
