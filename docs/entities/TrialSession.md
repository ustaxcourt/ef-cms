# TrialSession
 ```
---
  type: "object"
  keys: 
    address1: 
      type: "string"
      flags: 
        presence: "optional"
      allow: 
        - ""
    address2: 
      type: "string"
      flags: 
        presence: "optional"
      allow: 
        - ""
    city: 
      type: "string"
      flags: 
        presence: "optional"
      allow: 
        - ""
    courtReporter: 
      type: "string"
      flags: 
        presence: "optional"
    courthouseName: 
      type: "string"
      flags: 
        presence: "optional"
      allow: 
        - ""
    createdAt: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "optional"
    entityName: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "TrialSession"
    irsCalendarAdministrator: 
      type: "string"
      flags: 
        presence: "optional"
    isCalendared: 
      type: "boolean"
      flags: 
        presence: "required"
    judge: 
      type: "object"
      flags: 
        presence: "optional"
    maxCases: 
      type: "number"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "greater"
          args: 
            limit: 0
        - 
          name: "integer"
    notes: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "max"
          args: 
            limit: 400
    noticeIssuedDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "optional"
    postalCode: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "pattern"
          args: 
            regex: "/^(\\d{5}|\\d{5}-\\d{4})$/"
    sessionType: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "Regular"
        - "Small"
        - "Hybrid"
        - "Special"
        - "Motion/Hearing"
    startDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "required"
    startTime: 
      type: "string"
      rules: 
        - 
          name: "pattern"
          args: 
            regex: "/^(([0-1][0-9])|([2][0-3])):([0-5][0-9])$/"
    state: 
      type: "string"
      flags: 
        presence: "optional"
      allow: 
        - ""
    swingSession: 
      type: "boolean"
      flags: 
        presence: "optional"
    swingSessionId: 
      type: "string"
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
      whens: 
        - 
          ref: 
            path: 
              - "swingSession"
          is: 
            type: "any"
            flags: 
              only: true
              presence: "required"
            allow: 
              - 
                override: true
              - true
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "string"
            flags: 
              presence: "optional"
    term: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "Winter"
        - "Fall"
        - "Spring"
        - "Summer"
    termYear: 
      type: "string"
      flags: 
        presence: "required"
    trialClerk: 
      type: "object"
      flags: 
        presence: "optional"
    trialLocation: 
      type: "string"
      flags: 
        presence: "required"
    trialSessionId: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
    caseOrder: 
      type: "array"
      items: 
        - 
          type: "object"
          keys: 
            docketNumber: 
              type: "string"
              flags: 
                presence: "required"
                description: "Docket number of the case."
              rules: 
                - 
                  name: "pattern"
                  args: 
                    regex: "/^([1-9]\\d{2,4}-\\d{2})$/"
            isManuallyAdded: 
              type: "boolean"
              flags: 
                presence: "optional"
            removedFromTrial: 
              type: "boolean"
              flags: 
                presence: "optional"
            disposition: 
              type: "string"
              whens: 
                - 
                  ref: 
                    path: 
                      - "removedFromTrial"
                  is: 
                    type: "any"
                    flags: 
                      only: true
                      presence: "required"
                    allow: 
                      - 
                        override: true
                      - true
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
            removedFromTrialDate: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                  - "YYYY-MM-DD"
              whens: 
                - 
                  ref: 
                    path: 
                      - "removedFromTrial"
                  is: 
                    type: "any"
                    flags: 
                      only: true
                      presence: "required"
                    allow: 
                      - 
                        override: true
                      - true
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
