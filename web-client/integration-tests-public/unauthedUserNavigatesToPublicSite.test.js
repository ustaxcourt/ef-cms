import { setupTest } from './helpers';
import unauthedUserNavigatesToPublicSite from './journey/unauthedUserNavigatesToPublicSite';

const test = setupTest();
describe('Unauthed user navigates to public site', () => {
  unauthedUserNavigatesToPublicSite(test);
});
