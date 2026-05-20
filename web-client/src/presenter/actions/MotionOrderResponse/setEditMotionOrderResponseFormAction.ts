import { state } from '@web-client/presenter/app.cerebral';
import {
  additionalOrderTextArrayWithRequiredFirstField,
  normalizeAdditionalOrderTextArray,
} from '@web-client/utilities/normalizeAdditionalOrderTextArray';
import { DocketEntry } from 'shared/src/business/entities/DocketEntry';

export const setEditMotionOrderResponseFormAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const documentToEdit: DocketEntry & {
    draftOrderState?: DocketEntry['draftOrderState'] & {
      previousDocument: {
        docketEntryId: string;
      };
    };
  } = get(state.documentToEdit);
  const { draftOrderState } = documentToEdit;
  if (!draftOrderState) {
    throw new Error(
      'Draft order state is required to edit a motion order response',
    );
  }
  const { caseDetail, docketEntryIdToEdit } = props;
  const pathUrl = props.parentMessageId
    ? `/messages/${caseDetail.docketNumber}/message-detail/${props.parentMessageId}/${docketEntryIdToEdit}/motion-order-response-edit`
    : `/case-detail/${caseDetail.docketNumber}/documents/${docketEntryIdToEdit}/motion-order-response-edit`;

  const { additionalOrderText: legacyAdditionalOrderText, ...draftFields } =
    draftOrderState;

  const rawAdditionalOrderTextArray =
    draftOrderState.additionalOrderTextArray ??
    (legacyAdditionalOrderText ? [legacyAdditionalOrderText] : []);

  store.set(state.form, {
    ...draftFields,
    additionalOrderTextArray: additionalOrderTextArrayWithRequiredFirstField(
      normalizeAdditionalOrderTextArray(rawAdditionalOrderTextArray),
    ),
  });
  store.set(
    state.docketEntryId,
    draftOrderState.previousDocument.docketEntryId,
  );
  return { path: pathUrl };
};
