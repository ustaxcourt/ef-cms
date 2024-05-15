import { getStep1DataAction } from '@web-client/presenter/actions/getStep1DataAction';
import { getStep2DataAction } from '@web-client/presenter/actions/getStep2DataAction';
import { getStep3DataAction } from '@web-client/presenter/actions/getStep3DataAction';
import { getStep4DataAction } from '@web-client/presenter/actions/getStep4DataAction';
import { getStep5DataAction } from '@web-client/presenter/actions/getStep5DataAction';
import { saveNewPetitionDataAction } from '@web-client/presenter/actions/saveNewPetitionDataAction';

export const savePetitionDataSequence = [
  getStep1DataAction,
  getStep2DataAction,
  getStep3DataAction,
  getStep4DataAction,
  getStep5DataAction,
  saveNewPetitionDataAction,
];
