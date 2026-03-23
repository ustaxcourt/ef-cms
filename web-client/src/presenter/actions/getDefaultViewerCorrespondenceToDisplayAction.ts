import { cloneDeep } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { type RawCorrespondence } from '@shared/business/entities/Correspondence';

export const getDefaultViewerCorrespondenceToDisplayAction = ({
  applicationContext,
  get,
  props,
}: ActionProps): {
  viewerCorrespondenceToDisplay: RawCorrespondence;
} => {
  const { correspondenceId } = props;
  let viewerCorrespondenceToDisplay: RawCorrespondence;
  let foundCorrespondence: RawCorrespondence | undefined;
  const user = get(state.user);

  const caseDetail = get(state.caseDetail);

  const { correspondence } = applicationContext
    .getUtilities()
    .formatCase(applicationContext, cloneDeep(caseDetail), user);

  if (correspondenceId) {
    foundCorrespondence = correspondence.find(
      d => d.correspondenceId === correspondenceId,
    );
  }
  if (foundCorrespondence) {
    viewerCorrespondenceToDisplay = foundCorrespondence;
  } else {
    viewerCorrespondenceToDisplay = correspondence[0];
  }

  return {
    viewerCorrespondenceToDisplay,
  };
};
