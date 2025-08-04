import { RawCaseDeadline } from '@shared/business/entities/CaseDeadline';
import { getDbReader } from '@web-api/database';
import { writeFileSync } from 'fs';

console.clear();

const CONSOLE_INFO: string[] = [];
function log(): void {
  console.clear();
  console.log(CONSOLE_INFO.join('\n'));
}

type CaseDeadlineDTO = Pick<
  RawCaseDeadline,
  'docketNumber' | 'caseDeadlineId' | 'description' | 'deadlineDate'
>;

type PotentialConsolidatedCaseDeadlineInfo = {
  leadDocketNumber: string;
  childrenDeadline: CaseDeadlineDTO[];
  leadCaseDeadlineInfo: CaseDeadlineDTO;
};

async function getAllLeadCaseDeadlines() {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwCase as c')
      .innerJoin('dwCaseDeadline as cd', 'cd.docketNumber', 'c.docketNumber')
      .where('leadDocketNumber', 'is not', null)
      .whereRef('c.docketNumber', '=', 'c.leadDocketNumber')
      .select([
        'c.leadDocketNumber',
        'cd.associatedJudge',
        'cd.associatedJudgeId',
        'cd.caseDeadlineId',
        'cd.createdAt',
        'cd.deadlineDate',
        'cd.description',
        'cd.docketNumber',
        'cd.sortableDocketNumber',
      ])
      .execute(),
  );
}

const CHILDREN_CACHE: { [key: string]: any } = {};
async function getChildrenCasesByLeadDocketNumber(leadDocketNumber: string) {
  if (CHILDREN_CACHE[leadDocketNumber]) return CHILDREN_CACHE[leadDocketNumber];
  const RESULTS = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .where('leadDocketNumber', '=', leadDocketNumber)
      .where('docketNumber', '!=', leadDocketNumber)
      .select('docketNumber')
      .execute(),
  );
  CHILDREN_CACHE[leadDocketNumber] = RESULTS;
  return RESULTS;
}

async function getMatchingChildrenCaseDeadlinesWithMatchingInfo(
  docketNumbers: string[],
  deadlineDate: Date,
  description: string,
) {
  return (
    await getDbReader(reader =>
      reader
        .selectFrom('dwCaseDeadline')
        .where('docketNumber', 'in', docketNumbers)
        .where('deadlineDate', '=', deadlineDate)
        .selectAll()
        .execute(),
    )
  )
    .map(cd => ({
      ...cd,
      descriptionTrimed: cd.description.trim(),
    }))
    .filter(cd => cd.descriptionTrimed === description.trim());
}

async function getPotentialConsolidatedCaseDeadlineInfo(): Promise<
  PotentialConsolidatedCaseDeadlineInfo[]
> {
  CONSOLE_INFO.push('-- GETTING ALL LEAD CASE DEADLINES');
  log();
  const LEAD_CASE_DEADLINES = await getAllLeadCaseDeadlines();
  CONSOLE_INFO.push(
    `-- THERE WERE (${LEAD_CASE_DEADLINES.length}) LEAD CASE DEADLINES`,
  );
  log();
  const CASE_DEADLINE_GROUP_INFO: PotentialConsolidatedCaseDeadlineInfo[] = [];

  CONSOLE_INFO.push(
    '-- WILL LOOP AND GATHER CHILDREN DATA FOR EACH LEAD CASE DEADLINE',
  );
  const LOG_INDEX = CONSOLE_INFO.length;
  CONSOLE_INFO.push('---- LOOP PROGRESS (0%)');
  log();

  for (let index = 0; index < LEAD_CASE_DEADLINES.length; index++) {
    const entry = LEAD_CASE_DEADLINES[index];

    const { leadDocketNumber, caseDeadlineId, ...LEAD_CASE_DEADLINE } = entry;

    const CHILDREN_CASE_IN_GROUP = await getChildrenCasesByLeadDocketNumber(
      leadDocketNumber!,
    );

    const CHILDREN_CASEDEADLINE =
      await getMatchingChildrenCaseDeadlinesWithMatchingInfo(
        CHILDREN_CASE_IN_GROUP.map(cc => cc.docketNumber),
        LEAD_CASE_DEADLINE.deadlineDate,
        LEAD_CASE_DEADLINE.description,
      );

    const potentialConsolidatedCaseDeadlineInfo: PotentialConsolidatedCaseDeadlineInfo =
      {
        leadDocketNumber: leadDocketNumber!,
        leadCaseDeadlineInfo: {
          docketNumber: LEAD_CASE_DEADLINE.docketNumber,
          caseDeadlineId,
          description: LEAD_CASE_DEADLINE.description,
          deadlineDate: LEAD_CASE_DEADLINE.deadlineDate.toString(),
        },
        childrenDeadline: CHILDREN_CASEDEADLINE.map(cc => ({
          docketNumber: cc.docketNumber,
          caseDeadlineId: cc.caseDeadlineId,
          description: cc.description,
          deadlineDate: cc.deadlineDate.toString(),
        })),
      };

    if (potentialConsolidatedCaseDeadlineInfo.childrenDeadline.length)
      CASE_DEADLINE_GROUP_INFO.push(potentialConsolidatedCaseDeadlineInfo);

    CONSOLE_INFO[LOG_INDEX] =
      `---- LOOP PROGRESS (${Math.floor((index / LEAD_CASE_DEADLINES.length) * 100)}%)`;
    log();
  }
  CONSOLE_INFO[LOG_INDEX] = '---- LOOP PROGRESS (100%)';
  log();

  return CASE_DEADLINE_GROUP_INFO;
}

async function app() {
  CONSOLE_INFO.push('- Starting Application');
  log();

  const potentialConsolidatedCaseDeadlineInfo: PotentialConsolidatedCaseDeadlineInfo[] =
    await getPotentialConsolidatedCaseDeadlineInfo();

  const INFO_FILE_PATH = './POTENTIAL_GROUP_CASEDEADLINE.json';
  writeFileSync(
    INFO_FILE_PATH,
    JSON.stringify(potentialConsolidatedCaseDeadlineInfo, null, 2),
  );

  CONSOLE_INFO.push(`-- Saved Results: "${INFO_FILE_PATH}"`);
  log();
}

void app();
