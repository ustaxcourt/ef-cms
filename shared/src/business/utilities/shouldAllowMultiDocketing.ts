import { NON_MULTI_DOCKETABLE_EVENT_CODES } from '@shared/business/entities/EntityConstants';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { User } from '@shared/business/entities/User';

export const shouldAllowMultiDocketing = ({ docketEntry, isLead }) => {
  const wasExternallyFiled = User.isExternalUser(docketEntry.filedByRole);

  const isMultiDocketed = DocketEntry.isMultiDocketed(docketEntry);

  const wasNotExternallySingleFiled = !wasExternallyFiled || isMultiDocketed;

  const isMultiDocketable = !NON_MULTI_DOCKETABLE_EVENT_CODES.includes(
    docketEntry.eventCode,
  );

  return isLead && isMultiDocketable && wasNotExternallySingleFiled;
};
