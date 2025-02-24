import { clearModalAction } from '@web-client/presenter/actions/clearModalAction';
import { navigateToTermBuilderPageAction } from '@web-client/presenter/actions/TrialSession/TermBuilder/navigateToTermBuilderPageAction';
import { saveTermBuilderInfoAction } from '@web-client/presenter/actions/TrialSession/TermBuilder/saveTermBuilderInfoAction';

export const navigateToTermBuilderPageSequence = [
  clearModalAction,
  saveTermBuilderInfoAction,
  navigateToTermBuilderPageAction,
] as unknown as Function;
