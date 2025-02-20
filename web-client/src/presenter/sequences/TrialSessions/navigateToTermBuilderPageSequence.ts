import { navigateToTermBuilderPageAction } from '@web-client/presenter/actions/TrialSession/TermBuilder/navigateToTermBuilderPageAction';
import { saveTermBuilderInfoAction } from '@web-client/presenter/actions/TrialSession/TermBuilder/saveTermBuilderInfoAction';

export const navigateToTermBuilderPageSequence = [
  saveTermBuilderInfoAction,
  navigateToTermBuilderPageAction,
] as unknown as Function;
