#!/usr/bin/env -S npx ts-node --transpile-only

import { getDbReader } from '@web-api/database';
import { upsertMinuteSheet } from '@web-api/persistence/postgres/minuteSheets/updateMinuteSheet';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { isEmpty } from 'lodash';
import {
  HEARING_OPTIONS,
  TRIAL_OPTIONS,
} from '@shared/business/entities/EntityConstants';
import { MinuteSheet } from '@shared/business/entities/trialSessionMinutes/MinuteSheet';

const DRY_RUN = process.env.DRY_RUN === 'true';

type MinuteSheetWithTrialHearing = {
  content: Omit<MinuteSheet, 'caseRecord'> & {
    caseRecord: Omit<MinuteSheet['caseRecord'], 'hearing' | 'trial'> & {
      trialHearing?: {
        date: string;
        note: string;
        transcriptOrdered: string;
        trialHearingType?: string;
      };
    };
  };
  trialSessionId: string;
  docketNumber: string;
};

type TransformedMinuteSheet = {
  trialSessionId: string;
  docketNumber: string;
  content: MinuteSheet;
};

const splitTrialHearing = (
  ms: MinuteSheetWithTrialHearing,
): MinuteSheetWithTrialHearing => {
  const hearingOptions = Object.keys(HEARING_OPTIONS);
  const trialOptions = Object.keys(TRIAL_OPTIONS);

  const blankTrialOrHearing = {
    date: '',
    note: '',
    transcriptOrdered: '',
    trialHearingType: '',
  };

  if (ms.content.caseRecord.trialHearing) {
    const { trialHearingType } = ms.content.caseRecord.trialHearing;

    if (hearingOptions.includes(trialHearingType!)) {
      (ms.content.caseRecord as any).hearing =
        ms.content.caseRecord.trialHearing;
      (ms.content.caseRecord as any).trial = blankTrialOrHearing;
    } else if (trialOptions.includes(trialHearingType!)) {
      (ms.content.caseRecord as any).trial = ms.content.caseRecord.trialHearing;
      (ms.content.caseRecord as any).hearing = blankTrialOrHearing;
    } else {
      (ms.content.caseRecord as any).trial = {
        date: ms.content.caseRecord.trialHearing.date || '',
        note: ms.content.caseRecord.trialHearing.note || '',
        transcriptOrdered:
          ms.content.caseRecord.trialHearing.transcriptOrdered || '',
        trialHearingType:
          ms.content.caseRecord.trialHearing.trialHearingType || '',
      };
    }
  }

  return ms;
};

const removeTrialHearing = (
  ms: MinuteSheetWithTrialHearing,
): TransformedMinuteSheet => {
  delete ms.content.caseRecord.trialHearing;
  return ms as TransformedMinuteSheet;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  // Get all minute sheet records
  const minuteSheets = await getDbReader(writer =>
    writer.selectFrom('dwMinuteSheet').selectAll().execute(),
  );

  if (isEmpty(minuteSheets)) {
    console.log('No records to process');
    return;
  }

  console.log(`Found ${minuteSheets.length} minute sheets to process`);
  const recordsWithTrialHearing = minuteSheets.filter(
    ms => (ms.content as any).caseRecord?.trialHearing,
  );
  console.log(
    `Records with trialHearing property: ${recordsWithTrialHearing.length}`,
  );

  // Transform dw_minute_sheet.content
  const transformedMinuteSheets = minuteSheets
    .map(ms => transformNullToUndefined(ms) as MinuteSheetWithTrialHearing)
    .map(ms => splitTrialHearing(ms))
    .map(ms => removeTrialHearing(ms));

  if (DRY_RUN) {
    console.log(
      `[DRY RUN] Would update ${transformedMinuteSheets.length} records`,
    );
    console.log(
      'Sample transformation:',
      JSON.stringify(transformedMinuteSheets[0], null, 2),
    );
    return;
  }

  let successCount = 0;
  let failureCount = 0;
  const failures: Array<{ docketNumber: string; error: string }> = [];

  // Update all minute sheet records
  for (const ms of transformedMinuteSheets) {
    try {
      await upsertMinuteSheet({ minuteSheetToUpsert: ms });
      successCount++;
    } catch (error) {
      failureCount++;
      failures.push({
        docketNumber: ms.docketNumber,
        error: error instanceof Error ? error.message : String(error),
      });
      console.error(`Failed to update ${ms.docketNumber}:`, error);
      // Continue to next record
    }
  }

  console.log(`\nResults: ${successCount} succeeded, ${failureCount} failed`);
  if (failures.length > 0) {
    console.error('Failed records:', JSON.stringify(failures, null, 2));
    process.exit(1);
  }
})();
