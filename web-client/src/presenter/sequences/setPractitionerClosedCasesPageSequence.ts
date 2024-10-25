import { setPractitionerClosedCasesPageAction } from '@web-client/presenter/actions/setPractitionerClosedCasesPageAction';

export const setPractitionerClosedCasesPageSequence = [
  setPractitionerClosedCasesPageAction,
] as unknown as ({ pageNumber }: { pageNumber: number }) => void;
