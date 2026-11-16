# Pulling Data for Case Services for the Yearly Congressional Budget Justification

## Description

This runbook describes the process of pulling data for case services for the yearly Congressional Budget Justification
(CBJ) report. The CBJ is a report that is submitted to Congress each year and provides information about the Court's
budget and performance.

## Prerequisites

- Environment switcher configured for prod
- AWS access in prod
- Standard development setup described in `running-locally.md`

## Steps for Pulling Data for Case Services for the Yearly Congressional Budget Justification

1. Use the environment switcher to set the environment to prod:
   ```bash
   source ./scripts/env/set-env.zsh ustc-prod
   ```
1. Set an environment variable for the fiscal year for which you want to pull data:
   ```bash
   export FISCAL_YEAR=2026
   ```
1. Run the reports:
   1. Admissions:
      ```bash
      scripts/reports/attorneys-admitted-in-year.ts -f "$FISCAL_YEAR"
      ```
   1. Cases closed in fiscal year:
      ```bash
      scripts/reports/cases-closed-in-year.ts -f "$FISCAL_YEAR"
      ```
   1. Cases filed in fiscal year:
      ```bash
      scripts/reports/cases-filed-in-year.ts -f "$FISCAL_YEAR"
      ```
   1. Cases filed in fiscal year (aggregate stats):
      ```bash
      scripts/reports/cases-filed-in-year.ts -f "$FISCAL_YEAR" -s \
        > "${HOME}/Documents/cases-filed-in-fy-${FISCAL_YEAR}_stats.txt"
      ```
   1. Closed dates of cases filed in fiscal year:
      ```bash
      scripts/reports/closed-dates.ts -f "$FISCAL_YEAR"
      ```
   1. Petitions filed by non-attorneys:
      ```bash
      scripts/reports/documents-filed-by-nonattorneys.ts -f -e P -y "$FISCAL_YEAR"
      ```
   1. Opinions issued in fiscal year:
        ```bash
        scripts/reports/event-codes-by-year.ts MOP,SOP,TCOP,OST -y "$FISCAL_YEAR" -f -d
        ```
   1. Limited entries of appearance filed in fiscal year:
      ```bash
      scripts/reports/event-codes-by-year.ts LEA -y "$FISCAL_YEAR" -f -d
      ```
   1. Limited entries of appearance filed in fiscal year (aggregate stats):
      1. This report generates a CSV file **and** outputs the aggregate stats to the console.
      1. Run the report, then copy the stats output to your clipboard:
         ```bash
         scripts/reports/lea-stats.ts -f "$FISCAL_YEAR"
         ```
      1. Open a new file in nano, paste the stats into the file, then save the file:
         ```bash
         nano "${HOME}/Documents/lea-stats-fy-${FISCAL_YEAR}.txt"
         ```
   1. Non-attorney practitioners:
      ```bash
      scripts/reports/non-attorney-practitioners.ts \
        > "${HOME}/Documents/non-attorney-practitioners-as-of-fy-${FISCAL_YEAR}.csv"
      ```
   1. Non-attorney practitioners (aggregate stats):
      ```bash
      scripts/reports/non-attorney-practitioners.ts --stats \
        > "${HOME}/Documents/non-attorney-practitioners-stats-as-of-fy-${FISCAL_YEAR}.csv"
      ```
   1. Practitioner stats:
      ```bash
      scripts/reports/practitioner-stats.ts -f "$FISCAL_YEAR" \
        > "${HOME}/Documents/practitioner-stats-fy-${FISCAL_YEAR}.txt"
      ```
   1. Count of cases filed in fiscal year with private practitioners representing the petitioner:
      ```bash
      scripts/reports/represented-count-by-year.ts -f "$FISCAL_YEAR" \
        > "${HOME}/Documents/represented-counts-fy-${FISCAL_YEAR}.txt"
      ```
   1. Count of all currently-open cases with private practitioners representing the petitioner:
      ```bash
      scripts/reports/represented-count-in-all-open-cases.ts \
        > "${HOME}/Documents/represented-counts-in-all-open-cases-fy-${FISCAL_YEAR}.txt"
      ```
   1. Trial sessions conducted in fiscal year:
      ```bash
      scripts/reports/trial-sessions.ts -f "$FISCAL_YEAR"
      ```
   1. Trial sessions conducted in fiscal year (aggregate stats):
      ```bash
      scripts/reports/trial-sessions.ts -f "$FISCAL_YEAR" -s \
        > "${HOME}/Documents/trial-sessions-stats-fy-${FISCAL_YEAR}.txt"
      ```
1. Numerous files will have been generated in your `~/Documents` directory. Send all of the generated files to the
DAWSON Product Owner and the Case Services Manager. They will synthesize the data into the Congressional Budget
Justification report.
