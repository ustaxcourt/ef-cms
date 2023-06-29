import {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
} from '../../../shared/src/business/entities/EntityConstants';
import { contactPrimaryFromState } from '../helpers';

export const petitionsClerkViewsCaseDetail = (
  cerebralTest,
  expectedDocumentCount = 3,
) => {
  return it('Petitions clerk views case detail', async () => {
    cerebralTest.setState('caseDetail', {});

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(cerebralTest.getState('caseDetail.docketNumber')).toEqual(
      cerebralTest.docketNumber,
    );
    expect(cerebralTest.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.new,
    );
    expect(cerebralTest.getState('caseDetail.docketEntries').length).toEqual(
      expectedDocumentCount,
    );
    expect(cerebralTest.getState('caseDetail.associatedJudge')).toEqual(
      CHIEF_JUDGE,
    );

    const caseDetail = cerebralTest.getState('caseDetail');

    expect(caseDetail.associatedJudge).toBeDefined();
    expect(caseDetail.status).toBeDefined();
    expect(contactPrimaryFromState(cerebralTest).contactId).toBeDefined();
  });
};
