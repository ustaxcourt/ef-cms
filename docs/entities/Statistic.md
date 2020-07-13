# Statistic
 ```
---
  type: "object"
  keys: 
    determinationDeficiencyAmount: 
      type: "alternatives"
      flags: 
        description: "The amount of the deficiency determined by the Court."
      matches: 
        - 
          ref: 
            path: 
              - "determinationTotalPenalties"
          is: 
            type: "any"
            flags: 
              presence: "required"
            invalid: 
              - null
          then: 
            type: "number"
            flags: 
              presence: "required"
          otherwise: 
            type: "number"
            flags: 
              presence: "optional"
            allow: 
              - null
    determinationTotalPenalties: 
      type: "alternatives"
      flags: 
        description: "The total amount of penalties for the period or year determined by the Court."
      matches: 
        - 
          ref: 
            path: 
              - "determinationDeficiencyAmount"
          is: 
            type: "any"
            flags: 
              presence: "required"
            invalid: 
              - null
          then: 
            type: "number"
            flags: 
              presence: "required"
          otherwise: 
            type: "number"
            flags: 
              presence: "optional"
            allow: 
              - null
    entityName: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "Statistic"
    irsDeficiencyAmount: 
      type: "number"
      flags: 
        presence: "required"
        description: "The amount of the deficiency on the IRS notice."
    irsTotalPenalties: 
      type: "number"
      flags: 
        presence: "required"
        description: "The total amount of penalties for the period or year on the IRS notice."
    statisticId: 
      type: "string"
      flags: 
        presence: "required"
        description: "Unique statistic ID only used by the system."
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
    yearOrPeriod: 
      type: "string"
      flags: 
        presence: "required"
        only: true
        description: "Whether the statistics are for a year or period."
      allow: 
        - "Year"
        - "Period"
    lastDateOfPeriod: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        description: "Last date of the statistics period."
      rules: 
        - 
          name: "max"
          args: 
            date: "now"
      whens: 
        - 
          ref: 
            path: 
              - "yearOrPeriod"
          is: 
            type: "any"
            flags: 
              only: true
              presence: "required"
            allow: 
              - 
                override: true
              - "Period"
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    year: 
      type: "number"
      flags: 
        description: "The year of the statistics period."
      rules: 
        - 
          name: "integer"
        - 
          name: "min"
          args: 
            limit: 1900
        - 
          name: "max"
          args: 
            limit: 2020
      whens: 
        - 
          ref: 
            path: 
              - "yearOrPeriod"
          is: 
            type: "any"
            flags: 
              only: true
              presence: "required"
            allow: 
              - 
                override: true
              - "Year"
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null

 ```
