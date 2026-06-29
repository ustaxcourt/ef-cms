import { clearJurisdictionRadioAction } from '../../actions/StatusReportOrder/clearJurisdictionRadioAction';
import { setFormValueAction } from '../../actions/setFormValueAction';
export const updateStatusReportOrderFormValueSequence = [
  setFormValueAction,
  clearJurisdictionRadioAction,
] as unknown as (props: {
  allowEmptyString?: boolean;
  key: string;
  value: string | boolean | string[];
  index?: number;
}) => void;
