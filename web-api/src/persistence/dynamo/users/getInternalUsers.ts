import {
  ADC_SECTION,
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { getUsersInSection } from './getUsersInSection';

export const getInternalUsers = async ({
  applicationContext,
}: {
  applicationContext: IApplicationContext;
}) => {
  const users = [
    ...(await getUsersInSection({
      applicationContext,
      section: `section|${DOCKET_SECTION}`,
    })),
    ...(await getUsersInSection({
      applicationContext,
      section: `section|${PETITIONS_SECTION}`,
    })),
    ...(await getUsersInSection({
      applicationContext,
      section: `section|${ADC_SECTION}`,
    })),
  ];

  return users;
};
