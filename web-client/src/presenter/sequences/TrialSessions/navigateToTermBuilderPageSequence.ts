import { navigateToTermBuilderPageAction } from '@web-client/presenter/actions/TrialSession/TermGenerator/navigateToTermBuilderPageAction';
import { saveTermBuilderInfoAction } from '@web-client/presenter/actions/TrialSession/TermGenerator/saveTermBuilderInfoAction';

export const navigateToTermBuilderPageSequence = [
  saveTermBuilderInfoAction,
  navigateToTermBuilderPageAction,
] as unknown as Function;
