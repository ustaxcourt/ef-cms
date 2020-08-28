# IrsPractitioner
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
          name: "min"
          args: 
            limit: 1
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
        - "IrsPractitioner"
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
        only: true
        presence: "required"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - "irsPractitioner"
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
        presence: "required"
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

 ```
