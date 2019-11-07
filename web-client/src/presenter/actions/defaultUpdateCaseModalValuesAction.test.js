import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { defaultUpdateCaseModalValuesAction } from './defaultUpdateCaseModalValuesAction';
import { runAction } from 'cerebral/test';

describe('defaultUpdateCaseModalValuesAction', () => {
  it('should default the state.modal values for the update case modal to the state.caseDetail values', async () => {
    const result = await runAction(defaultUpdateCaseModalValuesAction, {
      state: {
        caseDetail: {
          associatedJudge: 'Chief Judge',
          caseCaption: 'A case caption',
          status: Case.STATUS_TYPES.new,
        },
        modal: {},
      },
    });

    expect(result.state.modal).toMatchObject({
      associatedJudge: 'Chief Judge',
      caseCaption: 'A case caption',
      caseStatus: Case.STATUS_TYPES.new,
    });
  });
});
