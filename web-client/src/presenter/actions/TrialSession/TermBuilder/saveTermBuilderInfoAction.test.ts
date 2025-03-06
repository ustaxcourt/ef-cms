import { runAction } from '@web-client/presenter/test.cerebral';
import {
  STATE_KEYS,
  TRIAL_SESSION_TERM_GENERATOR,
} from '@shared/business/entities/EntityConstants';
import { saveTermBuilderInfoAction } from '@web-client/presenter/actions/TrialSession/TermBuilder/saveTermBuilderInfoAction';

describe('saveTermBuilderInfoAction', () => {
  it('should set state with all the correct term builder info', async () => {
    const { state } = await runAction(saveTermBuilderInfoAction, {
      state: {
        modal: {
          termEndDate: 'TEST_termEndDate',
          termName: 'TEST_termName',
          termStartDate: 'TEST_termStartDate',
        },
      },
    });
    expect(state[STATE_KEYS.TERM_BUILDER_INFORMATION]).toEqual({
      termEndDate: 'TEST_termEndDate',
      termName: 'TEST_termName',
      termStartDate: 'TEST_termStartDate',
      maxSessionsPerLocation:
        TRIAL_SESSION_TERM_GENERATOR.MAX_SESSIONS_PER_LOCATION,
      maxSessionsPerWeek: TRIAL_SESSION_TERM_GENERATOR.MAX_SESSIONS_PER_WEEK,
      smallCaseMinimumQuantity:
        TRIAL_SESSION_TERM_GENERATOR.SMALL_CASE_MINIMUM_QUANTITY,
      smallCaseMaxQuantity:
        TRIAL_SESSION_TERM_GENERATOR.SMALL_CASE_MAX_QUANTITY,
      regularCaseMinimumQuantity:
        TRIAL_SESSION_TERM_GENERATOR.REGULAR_CASE_MINIMUM_QUANTITY,
      regularCaseMaxQuantity:
        TRIAL_SESSION_TERM_GENERATOR.REGULAR_CASE_MAX_QUANTITY,
      hybridCaseMinimumQuantity:
        TRIAL_SESSION_TERM_GENERATOR.HYBRID_CASE_MINIMUM_QUANTITY,
      hybridCaseMaxQuantity:
        TRIAL_SESSION_TERM_GENERATOR.HYBRID_CASE_MAX_QUANTITY,
    });
  });
});
