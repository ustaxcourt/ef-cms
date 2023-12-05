import { RawUser } from '@shared/business/entities/User';
import { sortBy } from 'lodash';

export const getUsersInSectionAction =
  ({ section }: { section?: string }) =>
  async ({
    applicationContext,
    props,
  }: ActionProps): Promise<{ users: RawUser[] }> => {
    const caseServicesSupervisorSelectedSection = props.section;
    const { CASE_SERVICES_SUPERVISOR_SECTION } =
      applicationContext.getConstants();

    let sectionToGet = section;

    if (
      section === CASE_SERVICES_SUPERVISOR_SECTION &&
      caseServicesSupervisorSelectedSection
    ) {
      sectionToGet = caseServicesSupervisorSelectedSection;
    }

    if (!sectionToGet) {
      const user = applicationContext.getCurrentUser();
      sectionToGet = user.section;
    }

    const users = await applicationContext
      .getUseCases()
      .getUsersInSectionInteractor(applicationContext, {
        section: sectionToGet!,
      });

    return {
      users: sortBy(users, 'name'),
    };
  };
