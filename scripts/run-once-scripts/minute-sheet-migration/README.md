# Minute Sheet Migration

## Overview

This directory contains run-once scripts that transform the shape of the
`dw_minute_sheet.content` JSON blob such that preexisting minute sheets will work
alongside application code changes.

## 001-split-trial-hearing

**Ran on:** [Add date when executed in each environment]

For story [#9265](https://github.com/ustaxcourt/ef-cms/issues/9265), the
`caseRecord` property's `trialHearing` property was split into separate `trial`
and `hearing` properties.

```json
// Before
{
    "trialSession": {
        // ...
    },
    "caseRecord": {
        // ...
        "trialHearing": {
            "date": "14-Jun-1997",
            "note": "Tempore assumenda c",
            "transcriptOrdered": true,
            "trialHearingType": "trial"
        }
    },
    // ...
}

// After
{
    "trialSession": {
        // ...
    },
    "caseRecord": {
        // ...
        "trial": {
            "date": "14-Jun-1997",
            "note": "Tempore assumenda c",
            "transcriptOrdered": true,
            "trialHearingType": "trial"
        },
        "hearing": {
            "date": "",
            "note": "",
            "transcriptOrdered": "",
            "trialHearingType": ""
        }
    }
    // ...
}
```
