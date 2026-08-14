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

    // Persistence timestamps (Joi ISO_DATE / createISODateString shape). Do not use
    // formatDateString(FORMATS.ISO) — that Luxon token emits a numeric offset, which
    // @joi/date 3 rejects.
    if (toFormat === FORMATS.ISO) {
      return applicationContext
        .getUtilities()
        .createISODateString(value, inputFormat);
    }

    const luxonDate = applicationContext
      .getUtilities()
      .prepareDateFromString(value, inputFormat) as unknown as string;

    return applicationContext
      .getUtilities()
      .formatDateString(luxonDate, toFormat);
  } catch {
    return value;
  }
}
