import { MOCK_CASE } from '../../../test/mockCase';
import {
  STIPULATED_DECISION_EVENT_CODE,
  TRANSCRIPT_EVENT_CODE,
} from '../EntityConstants';
import { getDocketEntriesEFiledByPractitioner }  from './PublicCase';

describe('PublicCase getDocketEntriesEFiledByPractitioner', () => {
  const rawCase = {...MOCK_CASE, privatePractitioners: [{userId: MOCK_CASE.docketEntries[0].userId}]};

  it('should return a list of docket entry ids associated with practitioner e-filed docs', () => {
    const list = getDocketEntriesEFiledByPractitioner(rawCase);

    expect(list).toEqual( MOCK_CASE.docketEntries[0].docketEntryI);
  });

  
});
