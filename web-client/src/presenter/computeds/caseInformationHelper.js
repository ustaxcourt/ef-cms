import { state } from 'cerebral';

export const caseInformationHelper = get => {
  const caseDetail = get(state.caseDetail);
  const permissions = get(state.permissions);

  const showEditPractitionersButton =
    permissions.ASSOCIATE_USER_WITH_CASE &&
    caseDetail.practitioners &&
    !!caseDetail.practitioners.length;
  const showEditRespondentsButton =
    permissions.ASSOCIATE_USER_WITH_CASE &&
    caseDetail.respondents &&
    !!caseDetail.respondents.length;
  const showAddCounsel = permissions.ASSOCIATE_USER_WITH_CASE;

  return {
    showAddCounsel,
    showEditPractitioners: showEditPractitionersButton,
    showEditRespondents: showEditRespondentsButton,
  };
};
