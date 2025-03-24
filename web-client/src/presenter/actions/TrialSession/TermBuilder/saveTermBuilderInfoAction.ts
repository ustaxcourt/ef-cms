import {
  STATE_KEYS,
  TERM_GENERATOR_DEFAULT_VALUES,
} from '@shared/business/entities/EntityConstants';
import { RawGenerateSuggestedTermForm } from '@shared/business/entities/trialSessions/GenerateSuggestedTermForm';
import { state } from '@web-client/presenter/app.cerebral';

export const saveTermBuilderInfoAction = ({ store, get }: ActionProps) => {
  const { termEndDate, termName, termStartDate } = get(state.modal);
  const TERM_GENERATOR_INFO: RawGenerateSuggestedTermForm = {
    termEndDate,
    termName,
    termStartDate,
    maxSessionsPerLocation:
      TERM_GENERATOR_DEFAULT_VALUES.MAX_SESSIONS_PER_LOCATION,
    maxSessionsPerWeek: TERM_GENERATOR_DEFAULT_VALUES.MAX_SESSIONS_PER_WEEK,
    smallCaseMinimumQuantity:
      TERM_GENERATOR_DEFAULT_VALUES.SMALL_CASE_MINIMUM_QUANTITY,
    smallCaseMaxQuantity: TERM_GENERATOR_DEFAULT_VALUES.SMALL_CASE_MAX_QUANTITY,
    regularCaseMinimumQuantity:
      TERM_GENERATOR_DEFAULT_VALUES.REGULAR_CASE_MINIMUM_QUANTITY,
    regularCaseMaxQuantity:
      TERM_GENERATOR_DEFAULT_VALUES.REGULAR_CASE_MAX_QUANTITY,
    hybridCaseMinimumQuantity:
      TERM_GENERATOR_DEFAULT_VALUES.HYBRID_CASE_MINIMUM_QUANTITY,
    hybridCaseMaxQuantity:
      TERM_GENERATOR_DEFAULT_VALUES.HYBRID_CASE_MAX_QUANTITY,
  };

  store.set(state[STATE_KEYS.TERM_BUILDER_INFORMATION], TERM_GENERATOR_INFO);
};
