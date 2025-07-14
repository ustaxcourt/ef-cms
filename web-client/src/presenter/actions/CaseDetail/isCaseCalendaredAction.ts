import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';

export const isCaseCalendaredAction = ({ path, props }: ActionProps) => {
  const { caseDetail } = props;

  if (!caseDetail || !caseDetail.status) {
    return path.no();
  }

  return caseDetail.status === CASE_STATUS_TYPES.calendared
    ? path.yes()
    : path.no();
};