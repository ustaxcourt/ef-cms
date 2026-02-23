import { get } from './requests';

export const getCaseMetadataInteractor = (
  applicationContext,
  { docketNumber }: { docketNumber: string },
) => {
  return get({
    applicationContext,
    endpoint: `/cases/${docketNumber}`,
    params: { excludeDocketEntries: 'true' },
  });
};
