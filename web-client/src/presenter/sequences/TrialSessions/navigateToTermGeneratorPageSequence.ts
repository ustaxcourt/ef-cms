import { navigateToTermGeneratorPageAction } from '@web-client/presenter/actions/TrialSession/TermGenerator/navigateToTermGeneratorPageAction';
import { saveTermGeneratorNameAndDatesAction } from '@web-client/presenter/actions/TrialSession/TermGenerator/saveTermGeneratorNameAndDatesAction';

export const navigateToTermGeneratorPageSequence = [
  saveTermGeneratorNameAndDatesAction,
  navigateToTermGeneratorPageAction,
] as unknown as Function;
