# NewPractitioner
 ```
---
  type: "object"
  keys: 
    name: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 100
    role: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - null
    judgeFullName: 
      type: "string"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 100
      whens: 
        - 
          ref: 
            path: 
              - "role"
          is: 
            type: "any"
            flags: 
              only: true
              presence: "required"
            allow: 
              - 
                override: true
              - "judge"
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
    judgeTitle: 
      type: "string"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 100
      whens: 
        - 
          ref: 
            path: 
              - "role"
          is: 
            type: "any"
            flags: 
              only: true
              presence: "required"
            allow: 
              - 
                override: true
              - "judge"
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
    contact: 
      type: "object"
      flags: 
        presence: "optional"
      keys: 
        address1: 
          type: "string"
          flags: 
            presence: "required"
          rules: 
            - 
              name: "min"
              args: 
                limit: 1
            - 
              name: "max"
              args: 
                limit: 100
        address2: 
          type: "string"
          flags: 
            presence: "optional"
          rules: 
            - 
              name: "min"
              args: 
                limit: 1
            - 
              name: "max"
              args: 
                limit: 100
          allow: 
            - null
        address3: 
          type: "string"
          flags: 
            presence: "optional"
          rules: 
            - 
              name: "min"
              args: 
                limit: 1
            - 
              name: "max"
              args: 
                limit: 100
          allow: 
            - null
        city: 
          type: "string"
          flags: 
            presence: "required"
          rules: 
            - 
              name: "min"
              args: 
                limit: 1
            - 
              name: "max"
              args: 
                limit: 100
        countryType: 
          type: "string"
          flags: 
            only: true
            presence: "required"
          rules: 
            - 
              name: "min"
              args: 
                limit: 1
          allow: 
            - "domestic"
            - "international"
        country: 
          type: "string"
          rules: 
            - 
              name: "min"
              args: 
                limit: 1
          whens: 
            - 
              ref: 
                path: 
                  - "countryType"
              is: 
                type: "any"
                flags: 
                  only: true
                  presence: "required"
                allow: 
                  - 
                    override: true
                  - "international"
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
        phone: 
          type: "string"
          flags: 
            presence: "required"
          rules: 
            - 
              name: "min"
              args: 
                limit: 1
            - 
              name: "max"
              args: 
                limit: 100
        postalCode: 
          type: "any"
          whens: 
            - 
              ref: 
                path: 
                  - "countryType"
              is: 
                type: "any"
                flags: 
                  only: true
                  presence: "required"
                allow: 
                  - 
                    override: true
                  - "international"
              then: 
                type: "string"
                flags: 
                  presence: "required"
                rules: 
                  - 
                    name: "min"
                    args: 
                      limit: 1
                  - 
                    name: "max"
                    args: 
                      limit: 100
              otherwise: 
                type: "string"
                flags: 
                  presence: "required"
                rules: 
                  - 
                    name: "min"
                    args: 
                      limit: 1
                  - 
                    name: "pattern"
                    args: 
                      regex: "/^(\\d{5}|\\d{5}-\\d{4})$/"
        state: 
          type: "string"
          flags: 
            only: true
          rules: 
            - 
              name: "min"
              args: 
                limit: 1
          allow: 
            - "AK"
            - "AL"
            - "AR"
            - "AZ"
            - "CA"
            - "CO"
            - "CT"
            - "DC"
            - "DE"
            - "FL"
            - "GA"
            - "HI"
            - "IA"
            - "ID"
            - "IL"
            - "IN"
            - "KS"
            - "KY"
            - "LA"
            - "MA"
            - "MD"
            - "ME"
            - "MI"
            - "MN"
            - "MO"
            - "MS"
            - "MT"
            - "NC"
            - "ND"
            - "NE"
            - "NH"
            - "NJ"
            - "NM"
            - "NV"
            - "NY"
            - "OH"
            - "OK"
            - "OR"
            - "PA"
            - "RI"
            - "SC"
            - "SD"
            - "TN"
            - "TX"
            - "UT"
            - "VA"
            - "VT"
            - "WA"
            - "WI"
            - "WV"
            - "WY"
            - "AA"
            - "AE"
            - "AP"
            - "AS"
            - "FM"
            - "GU"
            - "MH"
            - "MP"
            - "PR"
            - "PW"
            - "VI"
            - "N/A"
          whens: 
            - 
              ref: 
                path: 
                  - "countryType"
              is: 
                type: "any"
                flags: 
                  only: true
                  presence: "required"
                allow: 
                  - 
                    override: true
                  - "international"
              then: 
                type: "any"
                flags: 
                  presence: "optional"
                allow: 
                  - null
              otherwise: 
                type: "any"
                flags: 
                  presence: "required"
    email: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
    entityName: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - "Practitioner"
    isUpdatingInformation: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Whether the contact information for the user is being updated."
    pendingEmail: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "email"
          args: 
            options: 
              tlds: false
        - 
          name: "max"
          args: 
            limit: 100
      allow: 
        - null
    pendingEmailVerificationToken: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
      allow: 
        - null
    section: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - "adc"
        - "admissions"
        - "chambers"
        - "clerkofcourt"
        - "docket"
        - "floater"
        - "petitions"
        - "reportersOffice"
        - "trialClerks"
        - "ashfordsChambers"
        - "buchsChambers"
        - "carluzzosChambers"
        - "cohensChambers"
        - "colvinsChambers"
        - "copelandsChambers"
        - "foleysChambers"
        - "galesChambers"
        - "goekesChambers"
        - "greavesChambers"
        - "gustafsonsChambers"
        - "guysChambers"
        - "halpernsChambers"
        - "holmesChambers"
        - "jonesChambers"
        - "kerrigansChambers"
        - "laubersChambers"
        - "legacyJudgesChambers"
        - "leydensChambers"
        - "marshallsChambers"
        - "marvelsChambers"
        - "morrisonsChambers"
        - "negasChambers"
        - "panuthosChambers"
        - "parisChambers"
        - "pughsChambers"
        - "ruwesChambers"
        - "thorntonsChambers"
        - "torosChambers"
        - "urdasChambers"
        - "vasquezsChambers"
        - "weilersChambers"
        - "wellsChambers"
        - "admin"
        - "admissionsclerk"
        - "docketclerk"
        - "general"
        - "inactivePractitioner"
        - "irsPractitioner"
        - "irsSuperuser"
        - "judge"
        - "legacyJudge"
        - "petitioner"
        - "petitionsclerk"
        - "privatePractitioner"
        - "trialclerk"
    token: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
    userId: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - null
    additionalPhone: 
      type: "string"
      flags: 
        presence: "optional"
        description: "An alternate phone number for the practitioner."
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 100
      allow: 
        - null
    admissionsDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DD"
        presence: "required"
        description: "The date the practitioner was admitted to the Tax Court bar."
      rules: 
        - 
          name: "max"
          args: 
            date: "now"
    admissionsStatus: 
      type: "string"
      flags: 
        only: true
        presence: "required"
        description: "The Tax Court bar admission status for the practitioner."
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - "Active"
        - "Suspended"
        - "Disbarred"
        - "Resigned"
        - "Deceased"
        - "Inactive"
    barNumber: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - null
    birthYear: 
      type: "number"
      flags: 
        presence: "required"
        description: "The year the practitioner was born."
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
            limit: 2021
    employer: 
      type: "string"
      flags: 
        only: true
        presence: "required"
        description: "The employer designation for the practitioner."
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - "IRS"
        - "DOJ"
        - "Private"
    firmName: 
      type: "string"
      flags: 
        presence: "optional"
        description: "The firm name for the practitioner."
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 100
      allow: 
        - null
    firstName: 
      type: "string"
      flags: 
        presence: "required"
        description: "The first name of the practitioner."
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 100
    lastName: 
      type: "string"
      flags: 
        presence: "required"
        description: "The last name of the practitioner."
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 100
    middleName: 
      type: "string"
      flags: 
        presence: "optional"
        description: "The optional middle name of the practitioner."
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 100
      allow: 
        - null
    originalBarState: 
      type: "string"
      flags: 
        only: true
        presence: "required"
        description: "The state in which the practitioner passed their bar examination."
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - "AK"
        - "AL"
        - "AR"
        - "AZ"
        - "CA"
        - "CO"
        - "CT"
        - "DC"
        - "DE"
        - "FL"
        - "GA"
        - "HI"
        - "IA"
        - "ID"
        - "IL"
        - "IN"
        - "KS"
        - "KY"
        - "LA"
        - "MA"
        - "MD"
        - "ME"
        - "MI"
        - "MN"
        - "MO"
        - "MS"
        - "MT"
        - "NC"
        - "ND"
        - "NE"
        - "NH"
        - "NJ"
        - "NM"
        - "NV"
        - "NY"
        - "OH"
        - "OK"
        - "OR"
        - "PA"
        - "RI"
        - "SC"
        - "SD"
        - "TN"
        - "TX"
        - "UT"
        - "VA"
        - "VT"
        - "WA"
        - "WI"
        - "WV"
        - "WY"
        - "AA"
        - "AE"
        - "AP"
        - "AS"
        - "FM"
        - "GU"
        - "MH"
        - "MP"
        - "PR"
        - "PW"
        - "VI"
        - "N/A"
    practitionerNotes: 
      type: "string"
      flags: 
        presence: "optional"
        description: "The optional notes of the practitioner."
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 500
      allow: 
        - null
        - ""
    practitionerType: 
      type: "string"
      flags: 
        only: true
        presence: "required"
        description: "The type of practitioner - either Attorney or Non-Attorney."
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - "Attorney"
        - "Non-Attorney"
    serviceIndicator: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - "Electronic"
        - "None"
        - "Paper"
    suffix: 
      type: "string"
      flags: 
        presence: "optional"
        description: "The name suffix of the practitioner."
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 100
      allow: 
        - ""
    updatedEmail: 
      type: "alternatives"
      matches: 
        - 
          ref: 
            path: 
              - "confirmEmail"
          is: 
            type: "any"
            flags: 
              presence: "required"
            invalid: 
              - null
          then: 
            type: "string"
            flags: 
              presence: "required"
            rules: 
              - 
                name: "min"
                args: 
                  limit: 1
              - 
                name: "email"
                args: 
                  options: 
                    tlds: false
              - 
                name: "max"
                args: 
                  limit: 100
          otherwise: 
            type: "string"
            flags: 
              presence: "optional"
            rules: 
              - 
                name: "min"
                args: 
                  limit: 1
              - 
                name: "email"
                args: 
                  options: 
                    tlds: false
              - 
                name: "max"
                args: 
                  limit: 100
            allow: 
              - null
    confirmEmail: 
      type: "string"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "email"
          args: 
            options: 
              tlds: false
        - 
          name: "max"
          args: 
            limit: 100
      whens: 
        - 
          ref: 
            path: 
              - "updatedEmail"
          is: 
            type: "any"
            flags: 
              presence: "required"
            invalid: 
              - null
          then: 
            type: "any"
            flags: 
              only: true
              presence: "required"
            allow: 
              - 
                ref: 
                  path: 
                    - "updatedEmail"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null

 ```
