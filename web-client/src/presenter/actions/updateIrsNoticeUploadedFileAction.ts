import { ClientApplicationContext } from '@web-client/applicationContext';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const updateIrsNoticeIndexPropertyAction = ({
  applicationContext,
  props,
  store,
}: ActionProps) => {
  const { key, property, toFormat, value } = props;
  const updatedValue = toFormat
    ? formatValue(applicationContext, value, toFormat)
    : value;
  if (props.value !== '' && props.value !== null) {
    store.set(state.irsNoticeUploadFormInfo[+key][property], updatedValue);
  } else {
    store.unset(state.irsNoticeUploadFormInfo[+key][property]);
  }
};

function formatValue(
  applicationContext: ClientApplicationContext,
  value: string,
  toFormat: keyof typeof FORMATS,
): string {
  if (!value) return value;

  try {
    const inputFormat = applicationContext
      .getUtilities()
      .getDateFormat(value, [FORMATS.MDYYYY, FORMATS.MMDDYYYY]);

    const luxonDate = applicationContext
      .getUtilities()
      .prepareDateFromString(value, inputFormat) as unknown as string;

    const formattedDate = applicationContext
      .getUtilities()
      .formatDateString(luxonDate, toFormat);

    return formattedDate;
  } catch {
    return value;
  }
}
