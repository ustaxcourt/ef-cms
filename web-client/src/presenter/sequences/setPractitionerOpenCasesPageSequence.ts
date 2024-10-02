import { setPractitionerOpenCasesPageAction } from '@web-client/presenter/actions/setPractitionerOpenCasesPageAction';

export const setPractitionerOpenCasesPageSequence = [
  setPractitionerOpenCasesPageAction,
] as unknown as ({ pageNumber }: { pageNumber: number }) => void;
