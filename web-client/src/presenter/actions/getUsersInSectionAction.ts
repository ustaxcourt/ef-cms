import { RawUser } from '@shared/business/entities/User';
import { sortBy } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const getUsersInSectionAction =
  ({ section }: { section?: string }) =>
  async ({
    applicationContext,
    get,
    props,
  }: ActionProps<{
    section: string;
  }>): Promise<{ users: RawUser[] }> => {
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
      const user = get(state.user);
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
