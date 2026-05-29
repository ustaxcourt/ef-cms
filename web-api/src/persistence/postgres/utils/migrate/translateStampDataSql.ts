import { GRANT_DENY_MOTION_OPTIONS } from '@shared/business/entities/EntityConstants';

/**
 * SQL fragments for stamp_data -> draft_order_state translation.
 * Keep in sync with `translateStampDataToDraftOrderState` in shared.
 */
export const GRANT_DENY_MOTION_ORDER_TYPE_SQL = `'${GRANT_DENY_MOTION_OPTIONS.orderType}'`;

export const TRANSLATE_STAMP_FIELDS_SQL_FRAGMENT = `
  jsonb_strip_nulls(jsonb_build_object(
    'disposition',              SOURCE->>'disposition',
    'deniedAsMoot',             (SOURCE->>'deniedAsMoot')::boolean,
    'deniedWithoutPrejudice',   (SOURCE->>'deniedWithoutPrejudice')::boolean,
    'strickenFromTrialSession', CASE
      WHEN COALESCE(SOURCE->>'strickenFromTrialSession', '') <> '' THEN true
      ELSE NULL
    END,
    'jurisdiction',             CASE
      WHEN SOURCE->>'jurisdictionalOption' = 'Jurisdiction is retained by the undersigned'
        THEN 'retained'
      WHEN SOURCE->>'jurisdictionalOption' = 'The case is restored to the general docket'
        THEN 'restoredToGeneralDocket'
      ELSE NULL
    END,
    'dueDateMessage',           CASE
      WHEN SOURCE->>'dueDateMessage' = 'The parties shall file a status report by'
        THEN 'statusReport'
      WHEN SOURCE->>'dueDateMessage' = 'The parties shall file a status report or proposed stipulated decision by'
        THEN 'statusReportOrStipulatedDecision'
      ELSE NULL
    END,
    'dueDate',                  CASE
      WHEN SOURCE->>'date' ~ '^[0-9]{2}/[0-9]{2}/[0-9]{2}$'
        THEN to_char(to_date(SOURCE->>'date', 'MM/DD/YY'), 'YYYY-MM-DD')
      ELSE NULL
    END,
    'additionalOrderText',      CASE
      WHEN COALESCE(SOURCE->>'customText', '') <> ''
        THEN jsonb_build_array(SOURCE->>'customText')
      ELSE jsonb_build_array('')
    END,
    'orderType',                ${GRANT_DENY_MOTION_ORDER_TYPE_SQL}
  ))
`;

/**
 * Resolves the motion docket entry id for a legacy stamped order row.
 * `ROW` must be a SQL row alias (e.g. `dw_docket_entry` or `NEW`).
 */
export const buildPreviousDocumentSql = (rowAlias: string): string => `
  CASE
    WHEN COALESCE(${rowAlias}.stamp_data->>'docketEntryId', ${rowAlias}.stamp_data->>'motionDocketEntryId', '') <> ''
      THEN jsonb_build_object(
        'docketEntryId',
        COALESCE(${rowAlias}.stamp_data->>'docketEntryId', ${rowAlias}.stamp_data->>'motionDocketEntryId')
      )
    WHEN ${rowAlias}.previous_document IS NOT NULL
      AND COALESCE(${rowAlias}.previous_document->>'docketEntryId', '') <> ''
      THEN jsonb_build_object(
        'docketEntryId',
        ${rowAlias}.previous_document->>'docketEntryId'
      )
    WHEN (
      regexp_match(
        COALESCE(NULLIF(${rowAlias}.document_title, ''), ${rowAlias}.free_text, ''),
        '^Order - (.+?) - (?:GRANTED|DENIED)',
        'i'
      )
    ) IS NOT NULL
      THEN (
        SELECT jsonb_build_object('docketEntryId', motion.docket_entry_id)
        FROM dw_docket_entry motion
        WHERE motion.docket_number = ${rowAlias}.docket_number
          AND motion.docket_entry_id <> ${rowAlias}.docket_entry_id
          AND COALESCE(motion.is_draft, false) = false
          AND (
            motion.document_type = (
              regexp_match(
                COALESCE(NULLIF(${rowAlias}.document_title, ''), ${rowAlias}.free_text, ''),
                '^Order - (.+?) - (?:GRANTED|DENIED)',
                'i'
              )
            )[1]
            OR motion.document_title = (
              regexp_match(
                COALESCE(NULLIF(${rowAlias}.document_title, ''), ${rowAlias}.free_text, ''),
                '^Order - (.+?) - (?:GRANTED|DENIED)',
                'i'
              )
            )[1]
          )
        ORDER BY motion.filing_date DESC NULLS LAST
        LIMIT 1
      )
    ELSE NULL
  END
`;

export const buildDraftOrderStateFromStampDataSql = (
  stampDataSource: string,
  rowAlias: string,
): string => `
  ${TRANSLATE_STAMP_FIELDS_SQL_FRAGMENT.replace(/SOURCE/g, stampDataSource)}
  || jsonb_strip_nulls(jsonb_build_object(
    'previousDocument', ${buildPreviousDocumentSql(rowAlias)}
  ))
`;
