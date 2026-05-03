import { Kysely } from 'kysely';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import {
  HEARING_OPTIONS,
  TRIAL_OPTIONS,
} from '@shared/business/entities/EntityConstants';

export async function up(db: Kysely<any>): Promise<void> {
  const minuteSheets = await db
    .selectFrom('dwMinuteSheet')
    .selectAll()
    .execute();

  console.log(`Processing ${minuteSheets.length} minute sheets`);

  const hearingOptions = Object.keys(HEARING_OPTIONS);
  const trialOptions = Object.keys(TRIAL_OPTIONS);

  let processedCount = 0;

  for (const ms of minuteSheets) {
    const content = transformNullToUndefined(ms.content);

    // Only process records with trialHearing property
    if (!content?.caseRecord?.trialHearing) {
      continue;
    }

    const { trialHearing } = content.caseRecord;
    const blankTrialOrHearing = {
      date: '',
      note: '',
      transcriptOrdered: '',
      trialHearingType: '',
    };

    // Split based on trialHearingType
    if (hearingOptions.includes(trialHearing.trialHearingType || '')) {
      content.caseRecord.hearing = trialHearing;
      content.caseRecord.trial = blankTrialOrHearing;
    } else if (trialOptions.includes(trialHearing.trialHearingType || '')) {
      content.caseRecord.trial = trialHearing;
      content.caseRecord.hearing = blankTrialOrHearing;
    } else {
      // When trialHearingType doesn't match known options, populate trial with data
      content.caseRecord.trial = {
        date: trialHearing.date || '',
        note: trialHearing.note || '',
        transcriptOrdered: trialHearing.transcriptOrdered || '',
        trialHearingType: trialHearing.trialHearingType || '',
      };
      content.caseRecord.hearing = blankTrialOrHearing;
    }

    delete content.caseRecord.trialHearing;

    await db
      .updateTable('dwMinuteSheet')
      .set({ content: JSON.stringify(content) })
      .where('trialSessionId', '=', ms.trialSessionId)
      .where('docketNumber', '=', ms.docketNumber)
      .execute();

    processedCount++;
  }

  console.log(`Migration complete: ${processedCount} records updated`);
}

export async function down(db: Kysely<any>): Promise<void> {
  const minuteSheets = await db
    .selectFrom('dwMinuteSheet')
    .selectAll()
    .execute();

  let processedCount = 0;

  for (const ms of minuteSheets) {
    const { content } = ms;

    if (!content?.caseRecord) continue;

    // Only process records with hearing/trial split
    if (content.caseRecord.trialHearing) continue;

    const { hearing, trial } = content.caseRecord;

    // Determine which one has data
    const hasHearingData =
      hearing && (hearing.date || hearing.note || hearing.transcriptOrdered);
    const hasTrialData =
      trial && (trial.date || trial.note || trial.transcriptOrdered);

    // Merge back into trialHearing
    if (hasHearingData) {
      content.caseRecord.trialHearing = hearing;
    } else if (hasTrialData) {
      content.caseRecord.trialHearing = trial;
    } else {
      content.caseRecord.trialHearing = {
        date: '',
        note: '',
        transcriptOrdered: '',
        trialHearingType: '',
      };
    }

    delete content.caseRecord.hearing;
    delete content.caseRecord.trial;

    await db
      .updateTable('dwMinuteSheet')
      .set({ content: JSON.stringify(content) })
      .where('trialSessionId', '=', ms.trialSessionId)
      .where('docketNumber', '=', ms.docketNumber)
      .execute();

    processedCount++;
  }

  console.log(`Rollback complete: ${processedCount} records updated`);
}
