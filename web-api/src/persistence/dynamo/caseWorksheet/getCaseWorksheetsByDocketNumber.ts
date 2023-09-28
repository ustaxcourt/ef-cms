import {
  CaseWorksheet,
  RawCaseWorksheet,
} from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { batchGet } from '../../dynamodbClientService';
import { uniq } from 'lodash';

export const getCaseWorksheetsByDocketNumber = async ({
  applicationContext,
  docketNumbers,
}: {
  applicationContext: IApplicationContext;
  docketNumbers: string[];
}): Promise<RawCaseWorksheet[]> => {
  const result = await batchGet({
    applicationContext,
    keys: uniq(docketNumbers).map(docketNumber => ({
      pk: `case|${docketNumber}`,
      sk: `case-worksheet|${docketNumber}`,
    })),
  });

  return result.map(item => new CaseWorksheet(item).toRawObject());
};
