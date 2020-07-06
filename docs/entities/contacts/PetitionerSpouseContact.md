# contacts/PetitionerSpouseContact
 ```
---
  type: "object"
  keys: 
    countryType: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "domestic"
    address1: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
    address2: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
    address3: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
    city: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
    inCareOf: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
    name: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
    phone: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
    secondaryName: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
    title: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
    serviceIndicator: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
      allow: 
        - "Electronic"
        - "None"
        - "Paper"
    hasEAccess: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Flag that indicates if the contact has \"eAccess\" login credentials to the legacy system."
    email: 
      type: "string"
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
      whens: 
        - 
          ref: 
            path: 
              - "hasEAccess"
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
    state: 
      type: "string"
      flags: 
        only: true
        presence: "required"
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
    postalCode: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "pattern"
          args: 
            regex: "/^(\\d{5}|\\d{5}-\\d{4})$/"

 ```
