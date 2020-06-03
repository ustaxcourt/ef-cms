# Practitioner
 ```
---
  type: "object"
  keys: 
    barNumber: 
      type: "string"
      flags: 
        presence: "required"
        description: "A unique identifier comprising of the practitioner initials, date, and series number."
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
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
              otherwise: 
                type: "string"
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
                  presence: "optional"
                allow: 
                  - null
              otherwise: 
                type: "string"
                flags: 
                  presence: "required"
                rules: 
                  - 
                    name: "max"
                    args: 
                      limit: 100
    email: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
    entityName: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "Practitioner"
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
      type: "alternatives"
      matches: 
        - 
          ref: 
            path: 
              - "admissionsStatus"
          is: 
            type: "any"
            flags: 
              only: true
            allow: 
              - "Active"
          then: 
            type: "string"
            flags: 
              only: true
              presence: "required"
            allow: 
              - "irsPractitioner"
              - "privatePractitioner"
          otherwise: 
            type: "string"
            flags: 
              only: true
              presence: "required"
            allow: 
              - "inactivePractitioner"
    judgeFullName: 
      type: "any"
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
            type: "string"
            flags: 
              presence: "optional"
            rules: 
              - 
                name: "max"
                args: 
                  limit: 100
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    judgeTitle: 
      type: "any"
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
            type: "string"
            flags: 
              presence: "optional"
            rules: 
              - 
                name: "max"
                args: 
                  limit: 100
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    section: 
      type: "string"
      flags: 
        presence: "optional"
    token: 
      type: "string"
      flags: 
        presence: "optional"
    userId: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
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
        only: true
        presence: "required"
        description: "The Tax Court bar admission status for the practitioner."
      allow: 
        - "Active"
        - "Suspended"
        - "Disbarred"
        - "Resigned"
        - "Deceased"
        - "Inactive"
    alternateEmail: 
      type: "string"
      flags: 
        presence: "optional"
        description: "An alternate email address for the practitioner."
      rules: 
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
        description: "The first name of the practitioner."
      rules: 
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
