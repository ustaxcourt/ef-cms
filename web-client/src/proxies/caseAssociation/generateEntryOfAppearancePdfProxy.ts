import { ClientApplicationContext } from '@web-client/applicationContext';
import { EntryOfAppearanceProps } from '@web-api/business/useCases/caseAssociationRequest/generateEntryOfAppearancePdfInteractor';
import { post } from '../requests';

export const generateEntryOfAppearancePdfInteractor = (
  applicationContext: ClientApplicationContext,
  {
    caseCaptionExtension,
    caseTitle,
    docketNumberWithSuffix,
    filers,
    petitioners,
  }: EntryOfAppearanceProps,
): Promise<{
  fileId: string;
  url: string;
}> => {
  return post({
    applicationContext,
    body: {
      caseCaptionExtension,
      caseTitle,
      docketNumberWithSuffix,
      filers,
      petitioners,
    },
    endpoint: `/cases/${docketNumberWithSuffix}/generate-entry-of-appearance`,
  });
};
