import { DOCKET_SECTION, PETITIONS_SECTION } from '../entities/EntityConstants';
import { getDocQcSectionForUser } from './getDocQcSectionForUser';

describe('getWorkQueueFilters', () => {
  describe('getDocQcSectionForUser', () => {
    it('returns the petitions section if the user is in the petitions section', () => {
      expect(getDocQcSectionForUser({ section: PETITIONS_SECTION })).toEqual(
        PETITIONS_SECTION,
      );
    });

    it('returns the docket section when the user is not in the petitions or case services section', () => {
      expect(getDocQcSectionForUser({ section: DOCKET_SECTION })).toEqual(
        DOCKET_SECTION,
      );
    });
  });
});
