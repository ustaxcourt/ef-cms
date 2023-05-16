import { FORMATS, formatNow } from '../business/utilities/DateHandler';

export const MOCK_LOCK = {
  pk: 'case|123-45',
  sk: 'lock',
  ttl: 1680530219,
};

export const MOCK_ACTIVE_LOCK = {
  ...MOCK_LOCK,
  ttl: Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS)) + 10,
};

export const MOCK_EXPIRED_LOCK = {
  ...MOCK_LOCK,
  ttl: Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS)) - 10,
};
