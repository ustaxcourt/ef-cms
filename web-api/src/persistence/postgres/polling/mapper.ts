import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { NewResponseStringKysely } from './schema';

const SIXTEEN_MINUTES = 16 * 60;

const getTtl = (ttl?: number): number => {
  return (
    ttl ?? Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS)) + SIXTEEN_MINUTES
  );
};

export const toKyselyNewResponseString = (d: {
  requestId: string;
  responseString: string;
  ttl?: number;
  userId: string;
}): NewResponseStringKysely => {
  const ttl = getTtl(d.ttl);

  return {
    requestId: d.requestId,
    responseString: d.responseString,
    ttl,
    userId: d.userId,
  };
};
