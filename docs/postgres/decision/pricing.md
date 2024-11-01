# RDS Aurora Postgres Serverless V2 Pricing Estimation

Generated using https://calculator.aws/#/createCalculator/AuroraPostgreSQL. 

Note: This will be offset with the removal of DynamoDB and reduced for OpenSearch (if not already committed).

## ACL Calculations (min - max)
- **0.5 - 1** (absolute min: 1GB - 2GB): $43 - $86
- **1 - 4** (2GB - 8GB): $86 - $350.40

## Flexion - Lower
- **EXP1**: 0.5 - 1
- **EXP2**: 0.5 - 1
- **EXP3**: 0.5 - 1
- **EXP4**: 0.5 - 1
- **EXP5**: 0.5 - 1

**Total**: $215 - $430

## USTC 

### Lower
- **EXP1**: 0.5 - 1
- **EXP2**: 0.5 - 1
- **EXP3**: 0.5 - 1
- **EXP4**: 0.5 - 1
- **EXP5**: 0.5 - 1

**Total**: $215 - $430

### Multi-Region
- **TEST**: 0.5 - 1 (Multi-Region) = $43 - $86 x 2
- **PROD**: 1 - 4 (Multi-Region) = $86 - $350.40 x 2

### Others
- **STG**: 0.5 - 1
- **DEV**: 0.5 - 1
- **IRS**: 0.5 - 1

**Total**: $128 - $258

## Totals
**USTC**: $558 - $1474.80

**FLEXION**: $215 - $430

## Media
![USTC Total Cost Estimates](./_media/postgres-estimates.png)