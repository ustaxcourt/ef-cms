import { runAction } from '@web-client/presenter/test.cerebral';
import {
  STATE_KEYS,
  TERM_GENERATOR_DEFAULT_VALUES,
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
        TERM_GENERATOR_DEFAULT_VALUES.MAX_SESSIONS_PER_LOCATION,
      maxSessionsPerWeek: TERM_GENERATOR_DEFAULT_VALUES.MAX_SESSIONS_PER_WEEK,
      smallCaseMinimumQuantity:
        TERM_GENERATOR_DEFAULT_VALUES.SMALL_CASE_MINIMUM_QUANTITY,
      smallCaseMaxQuantity:
        TERM_GENERATOR_DEFAULT_VALUES.SMALL_CASE_MAX_QUANTITY,
      regularCaseMinimumQuantity:
        TERM_GENERATOR_DEFAULT_VALUES.REGULAR_CASE_MINIMUM_QUANTITY,
      regularCaseMaxQuantity:
        TERM_GENERATOR_DEFAULT_VALUES.REGULAR_CASE_MAX_QUANTITY,
      hybridCaseMinimumQuantity:
        TERM_GENERATOR_DEFAULT_VALUES.HYBRID_CASE_MINIMUM_QUANTITY,
      hybridCaseMaxQuantity:
        TERM_GENERATOR_DEFAULT_VALUES.HYBRID_CASE_MAX_QUANTITY,
    });
  });
});
