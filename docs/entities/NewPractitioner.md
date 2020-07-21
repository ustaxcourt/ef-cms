# NewPractitioner
 ```
---
  type: "object"
  keys: 
    barNumber: 
      type: "string"
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
              name: "max"
              args: 
                limit: 100
        address2: 
          type: "string"
          flags: 
            presence: "optional"
          rules: 
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
              name: "max"
              args: 
                limit: 100
        countryType: 
          type: "string"
          flags: 
            only: true
            presence: "required"
          allow: 
            - "domestic"
            - "international"
        country: 
          type: "string"
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
                    name: "max"
                    args: 
                      limit: 100
              otherwise: 
                type: "string"
                flags: 
                  presence: "required"
                rules: 
                  - 
                    name: "pattern"
                    args: 
                      regex: "/^(\\d{5}|\\d{5}-\\d{4})$/"
        state: 
          type: "string"
          flags: 
            only: true
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
    entityName: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "Practitioner"
    section: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
      allow: 
        - "adc"
        - "admissions"
        - "chambers"
        - "clerkofcourt"
        - "docket"
        - "petitions"
        - "trialClerks"
        - "armensChambers"
        - "ashfordsChambers"
        - "buchsChambers"
        - "carluzzosChambers"
        - "cohensChambers"
        - "colvinsChambers"
        - "copelandsChambers"
        - "foleysChambers"
        - "galesChambers"
        - "gerbersChambers"
        - "goekesChambers"
        - "gustafsonsChambers"
        - "guysChambers"
        - "halpernsChambers"
        - "holmesChambers"
        - "jacobsChambers"
        - "jonesChambers"
        - "kerrigansChambers"
        - "laubersChambers"
        - "leydensChambers"
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
        - "wellsChambers"
        - "admin"
        - "admissionsclerk"
        - "docketclerk"
        - "floater"
        - "inactivePractitioner"
        - "irsPractitioner"
        - "irsSuperuser"
        - "judge"
        - "petitioner"
        - "petitionsclerk"
        - "privatePractitioner"
        - "trialclerk"
    token: 
      type: "string"
      flags: 
        presence: "optional"
    userId: 
      type: "string"
      flags: 
        presence: "optional"
      allow: 
        - null
    name: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
    role: 
      type: "string"
      flags: 
        presence: "optional"
      allow: 
        - null
    judgeFullName: 
      type: "string"
      rules: 
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
              presence: "optional"
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
              presence: "optional"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    additionalPhone: 
      type: "string"
      flags: 
        presence: "optional"
        description: "An alternate phone number for the practitioner."
      rules: 
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
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
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
        presence: "required"
    alternateEmail: 
      type: "string"
      flags: 
        presence: "optional"
        description: "An alternate email address for the practitioner."
      rules: 
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
            limit: 2020
    employer: 
      type: "string"
      flags: 
        only: true
        presence: "required"
        description: "The employer designation for the practitioner."
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
          name: "max"
          args: 
            limit: 100
      allow: 
        - null
    firstName: 
      type: "string"
      flags: 
        presence: "required"
    lastName: 
      type: "string"
      flags: 
        presence: "required"
    middleName: 
      type: "string"
      flags: 
        presence: "optional"
        description: "The optional middle name of the practitioner."
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
      allow: 
        - null
    originalBarState: 
      type: "string"
      flags: 
        presence: "required"
        description: "The state in which the practitioner passed their bar examination."
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
    practitionerType: 
      type: "string"
      flags: 
        only: true
        presence: "required"
        description: "The type of practitioner - either Attorney or Non-Attorney."
      allow: 
        - "Attorney"
        - "Non-Attorney"
    suffix: 
      type: "string"
      flags: 
        presence: "optional"
        description: "The name suffix of the practitioner."
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
      allow: 
        - ""

 ```
