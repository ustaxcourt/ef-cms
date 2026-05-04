#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { formatDate } from '../helpers/formatters';
import { generateCsv } from '../helpers/generate-csv';
import { getDbReader } from 'web-api/src/persistence/postgres/database';
import { sql } from 'kysely';
import { DateTime } from 'luxon';
import * as readline from 'readline';

const scriptConfig: ScriptConfig = {
  description:
    'search-minute-sheet-field - Searches the dwMinuteSheet table and returns the value of any field from the content JSONB, regardless of nesting level.',
  environment: {
    env: 'ENV',
  },
  parameters: {
    field: {
      position: 0,
      required: true,
      type: 'string',
    },
    searchValue: {
      long: 'search-value',
      required: false,
      type: 'string',
    },
    exact: {
      description:
        'Use exact matching for searchValue (default is partial match).',
      long: 'exact',
      required: false,
      short: 'e',
      type: 'boolean',
    },
    dateRange: {
      description:
        'Filter trial sessions by start date range in format "YYYY-MM-DD:YYYY-MM-DD" (inclusive on both ends).',
      long: 'date-range',
      required: false,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};

const { dateRange, exact, field, searchValue } = parseArgsAndEnvVars(
  scriptConfig,
) as {
  dateRange?: string;
  exact?: boolean;
  field: string;
  searchValue?: string;
};

const OUTPUT_DIR = `${process.env.HOME}/Documents`;

const MINUTE_SHEET_FIELD_SCHEMA = {
  trialSession: {
    id: '',
    judge: {
      fullName: '',
      title: '',
      userId: '',
    },
    trialClerk: '',
    courtReporter: '',
    isRemote: false,
  },
  caseRecord: {
    docketNumber: '',
    calendarCall: {
      date: '',
      note: '',
      transcriptOrdered: false,
      trialHearingType: '',
    },
    notCalled: {
      date: '',
      note: '',
      transcriptOrdered: false,
      trialHearingType: '',
    },
    recalls: [
      {
        date: '',
        note: '',
        transcriptOrdered: false,
        trialHearingType: '',
      },
    ],
    pretrialConference: {
      date: '',
      note: '',
      transcriptOrdered: false,
    },
    trial: {
      date: '',
      note: '',
      transcriptOrdered: false,
      trialHearingType: '',
    },
    hearing: {
      date: '',
      note: '',
      transcriptOrdered: false,
      trialHearingType: '',
    },
  },
  appearances: {
    petitioners: {
      noAppearance: false,
      appearances: [
        {
          name: '',
          datesOfAppearance: '',
          role: '',
          note: '',
        },
      ],
    },
    respondents: [
      {
        name: '',
        datesOfAppearance: '',
        role: '',
        note: '',
      },
    ],
  },
  jurisdiction: {
    retained: {
      date: '',
      note: '',
    },
    continued: {
      date: '',
      note: '',
    },
  },
  orders: {
    statusReport: {
      date: '',
      dueDate: '',
      note: '',
      orderedFor: '',
    },
    stipulatedDecision: {
      date: '',
      dueDate: '',
      note: '',
    },
  },
  proceedings: {
    motions: [
      {
        date: '',
        type: '',
        filedBy: '',
        status: '',
        objection: '',
        note: '',
        oralMotion: false,
      },
    ],
    actionsAndFilings: [
      {
        date: '',
        documentType: '',
        filedBy: '',
        status: '',
        note: '',
        isOnDocketRecord: false,
        oralMotion: false,
        objection: '',
      },
    ],
  },
  brief: {
    type: '',
    details: {
      opening: {
        dueDate: '',
        note: '',
        partyType: '',
      },
      answering: {
        dueDate: '',
        note: '',
        partyType: '',
      },
      reply: {
        dueDate: '',
        note: '',
        partyType: '',
      },
      surreply: {
        dueDate: '',
        note: '',
        partyType: '',
      },
      memoranda: {
        dueDate: '',
        note: '',
      },
      simultaneousSupplemental: {
        dueDate: '',
        note: '',
      },
    },
    dateSubmitted: '',
    hoursOfTrial: 0,
    benchOpinionDate: '',
    transcriptOrdered: false,
    note: '',
  },
  evidence: {
    petitionerWitnesses: [
      {
        name: '',
      },
    ],
    respondentWitnesses: [
      {
        name: '',
      },
    ],
    exhibits: [
      {
        description: '',
        status: '',
        note: '',
      },
    ],
  },
} as const;

// Recursively find all structural paths to a field in an object (case-insensitive).
const findAllFieldPaths = (
  obj: unknown,
  fieldName: string,
  prefix = '',
): string[] => {
  const lowerFieldName = fieldName.toLowerCase();
  const pathSet = new Set<string>();

  const search = (current: unknown, currentPrefix: string): void => {
    if (current === null || current === undefined) {
      return;
    }

    if (Array.isArray(current)) {
      // Use [] in the structural path instead of a specific index
      current.forEach(item => {
        search(item, `${currentPrefix}[]`);
      });
      return;
    }

    if (typeof current === 'object') {
      const objCurrent = current as Record<string, unknown>;

      // Check if this object has a matching key
      for (const key of Object.keys(objCurrent)) {
        if (key.toLowerCase() === lowerFieldName) {
          const path = currentPrefix ? `${currentPrefix}.${key}` : key;
          pathSet.add(path);
        }
      }

      // Recursively search in nested objects
      for (const [key, value] of Object.entries(objCurrent)) {
        const newPrefix = currentPrefix ? `${currentPrefix}.${key}` : key;
        search(value, newPrefix);
      }
    }
  };

  search(obj, prefix);
  return Array.from(pathSet);
};

// Convert a structural path like "evidence.exhibits[].status" to a PostgreSQL JSONPath like "$.evidence.exhibits[*].status"
const toJsonPath = (structuralPath: string): string => {
  const jsonPath = structuralPath
    .replace(/\[\]/g, '[*]')
    .replace(/^/, '$.')
    .replace(/\.\[/g, '[');
  return jsonPath;
};

const promptUserSelection = (options: string[]): Promise<string> => {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log(`\nFound multiple locations for field '${field}':\n`);
    options.forEach((option, index) => {
      console.log(`  ${index + 1}) ${option}`);
    });

    rl.question(
      `\nPlease select which location to use (1-${options.length}): `,
      answer => {
        rl.close();
        const selectedIndex = parseInt(answer, 10) - 1;
        if (selectedIndex >= 0 && selectedIndex < options.length) {
          resolve(options[selectedIndex]);
        } else {
          console.error('Invalid selection. Exiting.');
          process.exit(1);
        }
      },
    );
  });
};

// Flattens a nested object into a single-level object with dot-notation keys
const flattenObject = (obj: unknown, prefix = ''): Record<string, unknown> => {
  const result: Record<string, unknown> = {};

  if (obj === null || typeof obj !== 'object') {
    return result;
  }

  const isArray = Array.isArray(obj);
  const entries = isArray
    ? (obj as unknown[]).entries()
    : Object.entries(obj as Record<string, unknown>);

  for (const [key, value] of entries) {
    const normalizedKey = String(key);
    const newKey = prefix ? `${prefix}.${normalizedKey}` : normalizedKey;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey));
    } else if (Array.isArray(value)) {
      result[newKey] = `[Array: ${value.length} items]`;
    } else {
      result[newKey] = value;
    }
  }

  return result;
};

const getDateRangeFilter = (dateRange?: string): ReturnType<typeof sql> => {
  if (!dateRange) {
    return sql``;
  }

  const [startStr, endStr] = dateRange.split(':');
  const startRaw = startStr?.trim();
  const endRaw = endStr?.trim();

  let startDate: DateTime | undefined;
  let endDate: DateTime | undefined;

  if (startRaw) {
    startDate = DateTime.fromISO(startRaw, { setZone: true });
    if (!startDate.isValid) {
      throw new Error(
        'date-range start date must be a valid ISO-8601 date string',
      );
    }
  }

  if (endRaw) {
    endDate = DateTime.fromISO(endRaw, { setZone: true });
    if (!endDate.isValid) {
      throw new Error(
        'date-range end date must be a valid ISO-8601 date string',
      );
    }
  }

  if (startDate && endDate && endDate.toMillis() < startDate.toMillis()) {
    throw new Error('date-range end date must be on or after start date');
  }

  const conditions: ReturnType<typeof sql>[] = [];
  if (startDate) {
    conditions.push(sql`ts."start_date" >= ${startDate.toISODate()}::date`);
  }
  if (endDate) {
    conditions.push(sql`ts."start_date" <= ${endDate.toISODate()}::date`);
  }

  if (conditions.length === 0) {
    return sql``;
  }

  return sql.join(
    conditions.map(c => sql`AND ${c}`),
    sql` `,
  );
};

const searchMinuteSheetField = async (): Promise<{
  fieldKey: string;
  results: Record<string, unknown>[];
  selectedPath: string | undefined;
}> => {
  let selectedPath: string | undefined;

  const allPaths = findAllFieldPaths(MINUTE_SHEET_FIELD_SCHEMA, field);

  if (allPaths.length === 0) {
    console.log(
      `Field '${field}' not found in the minute sheet schema. Available fields:`,
    );
    const flattened = flattenObject(MINUTE_SHEET_FIELD_SCHEMA);
    const availableFields = Object.keys(flattened).sort();
    availableFields.forEach(f => console.log(`  ${f}`));
    return { fieldKey: field, results: [], selectedPath: undefined };
  } else if (allPaths.length === 1) {
    selectedPath = allPaths[0];
  } else {
    selectedPath = await promptUserSelection(allPaths);
  }

  const jsonPath = toJsonPath(selectedPath);

  type ResultRow = {
    docketNumber: string;
    startDate: Date | string | null;
    trialLocation: string | null;
    trialSessionId: string;
    value: unknown;
  };

  const trimmedSearch = searchValue?.trim() || null;
  const isNullSearch = trimmedSearch?.toUpperCase() === 'NULL';
  const column = sql`lower(trim(both '"' from vals.value::text))`;
  const valueJoin = isNullSearch
    ? sql`LEFT JOIN LATERAL jsonb_path_query(m."content"::jsonb, ${sql.lit(jsonPath)}::jsonpath) AS vals(value) ON TRUE`
    : sql`CROSS JOIN LATERAL jsonb_path_query(m."content"::jsonb, ${sql.lit(jsonPath)}::jsonpath) AS vals(value)`;
  const searchFilter = isNullSearch
    ? sql`AND (vals.value IS NULL OR vals.value::text = '' OR vals.value::text = 'null' OR vals.value::text = '""')`
    : !trimmedSearch
      ? sql``
      : exact
        ? sql`AND ${column} = lower(${trimmedSearch})`
        : sql.join(
            trimmedSearch
              .split(/\s+/)
              .map(word => sql`AND ${column} LIKE lower(${`%${word}%`})`),
            sql` `,
          );

  const dateRangeFilter = getDateRangeFilter(dateRange);

  const sqlQuery = sql<ResultRow>`
    SELECT 
      m."trial_session_id" as "trialSessionId",
      m."docket_number" as "docketNumber",
      ts."trial_location" as "trialLocation",
      ts."start_date" as "startDate",
      vals.value
    FROM "dw_minute_sheet" m
    LEFT JOIN "dw_trial_session" ts
      ON ts."trial_session_id"::text = m."trial_session_id"
    ${valueJoin}
    WHERE ${isNullSearch ? sql`TRUE` : sql`vals.value IS NOT NULL AND vals.value::text NOT IN ('', '""', 'null')`}
      ${searchFilter}
      ${dateRangeFilter}
  `;

  const rows = await getDbReader(reader => sqlQuery.execute(reader));

  const fieldKey = `${field} (${selectedPath})`;
  const results = rows.rows.map(row => ({
    docketNumber: row.docketNumber,
    startDate: row.startDate ? formatDate(row.startDate) : '',
    trialLocation: row.trialLocation || '',
    trialSessionId: row.trialSessionId,
    [fieldKey]: row.value,
  }));

  return { fieldKey, results, selectedPath };
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  try {
    const { fieldKey, results } = await searchMinuteSheetField();

    console.log(`Found ${results.length} records with field '${field}'.`);

    if (results.length === 0) {
      return;
    }
    const columns = [
      { header: 'trialSessionId', key: 'trialSessionId' },
      { header: 'docketNumber', key: 'docketNumber' },
      { header: 'trialLocation', key: 'trialLocation' },
      { header: 'startDate', key: 'startDate' },
      { header: fieldKey, key: fieldKey },
    ];

    const filename = `${OUTPUT_DIR}/minute-sheet-field-${field.replace(/\./g, '-')}.csv`;
    generateCsv({ columns, filename, rows: results });
    console.log(`Generated ${filename}`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
