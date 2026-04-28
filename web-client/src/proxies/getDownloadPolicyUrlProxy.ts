import { get } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getDownloadPolicyUrl = ({
  applicationContext,
  docketNumber,
  key,
}: {
  applicationContext: ClientApplicationContext;
  docketNumber: string;
  key: string;
}) => {
  return get({
    applicationContext,
    endpoint: `/case-documents/${docketNumber}/${key}/download-policy-url`,
  });
};
