import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { defaultUpdateCaseModalValuesAction } from './defaultUpdateCaseModalValuesAction';
import { runAction } from 'cerebral/test';

describe('defaultUpdateCaseModalValuesAction', () => {
  const { CHIEF_JUDGE, STATUS_TYPES } = applicationContext.getConstants();

  it('should default the state.modal values for the update case modal to the state.caseDetail values', async () => {
    const result = await runAction(defaultUpdateCaseModalValuesAction, {
      state: {
        caseDetail: {
          associatedJudge: CHIEF_JUDGE,
          caseCaption: 'A case caption',
          status: STATUS_TYPES.new,
        },
        modal: {},
      },
    });

    expect(result.state.modal).toMatchObject({
      associatedJudge: CHIEF_JUDGE,
      caseCaption: 'A case caption',
      caseStatus: STATUS_TYPES.new,
    });
  });
});
