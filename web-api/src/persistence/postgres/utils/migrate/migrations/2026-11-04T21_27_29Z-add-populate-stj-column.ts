import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwCase')
    .addColumn('isStjEligible', 'boolean')
    .execute();

  await sql`
UPDATE dw_case update_dw_case
SET
  is_stj_eligible = (
    WITH
      stats AS (
        SELECT
          docket_number
        FROM
          dw_case
          CROSS JOIN LATERAL jsonb_array_elements(STATISTICS) AS stats
        WHERE
          (stats ->> 'irsTotalPenalties')::float + (stats ->> 'irsDeficiencyAmount')::float >= 50000
          AND case_type = 'Deficiency'
        GROUP BY
          docket_number
      ),
      hits AS (
        SELECT
          docket_number
        FROM
          dw_case
          LEFT JOIN stats USING (docket_number)
        WHERE
          case_type NOT IN ('Passport', 'Worker Classification', 'Partnership (BBA Section 1101)', 'Partnership (Section 6226)', 'Partnership (Section 6228)')
          AND "status" NOT IN ('Closed', 'Closed - Dismissed')
          AND (
            procedure_type = 'Small'
            OR case_type IN ('CDP (Lien/Levy)', 'Declaratory Judgment (Exempt Organization)', 'Declaratory Judgment (Retirement Plan)', 'Disclosure', 'Whistleblower', 'Interest Abatement')
            OR (
              case_type = 'Deficiency'
              AND stats.docket_number IS NULL
            )
          )
      )
    SELECT
      CASE
        WHEN hits.docket_number IS NOT NULL THEN TRUE
        ELSE FALSE
      END
    FROM
      dw_case
      LEFT JOIN hits USING (docket_number)
    WHERE
      "status" NOT IN ('Closed', 'Closed - Dismissed')
      AND docket_number = update_dw_case.docket_number
  )
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('dwCase').dropColumn('isStjEligible').execute();
}
