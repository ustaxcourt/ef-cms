import {
  STATE_KEYS,
  TRIAL_SESSION_TERM_GENERATOR,
} from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const saveTermBuilderInfoAction = ({ store, get }: ActionProps) => {
  const { termEndDate, termName, termStartDate } = get(state.modal);
  const TERM_GENERATOR_INFO = {
    termEndDate,
    termName,
    termStartDate,
    maxSessionsPerLocation:
      TRIAL_SESSION_TERM_GENERATOR.MAX_SESSIONS_PER_LOCATION,
    maxSessionsPerWeek: TRIAL_SESSION_TERM_GENERATOR.MAX_SESSIONS_PER_WEEK,
    smallCaseMinimumQuantity:
      TRIAL_SESSION_TERM_GENERATOR.SMALL_CASE_MINIMUM_QUANTITY,
    smallCaseMaxQuantity: TRIAL_SESSION_TERM_GENERATOR.SMALL_CASE_MAX_QUANTITY,
    regularCaseMinimumQuantity:
      TRIAL_SESSION_TERM_GENERATOR.REGULAR_CASE_MINIMUM_QUANTITY,
    regularCaseMaxQuantity:
      TRIAL_SESSION_TERM_GENERATOR.REGULAR_CASE_MAX_QUANTITY,
    hybridCaseMinimumQuantity:
      TRIAL_SESSION_TERM_GENERATOR.HYBRID_CASE_MINIMUM_QUANTITY,
    hybridCaseMaxQuantity:
      TRIAL_SESSION_TERM_GENERATOR.HYBRID_CASE_MAX_QUANTITY,
  };

  store.set(state[STATE_KEYS.TERM_BUILDER_INFORMATION], TERM_GENERATOR_INFO);
};
