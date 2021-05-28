# contacts/PetitionerPrimaryContact(INTERNATIONAL)
 ```
---
  type: "object"
  keys: 
    country: 
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
            limit: 500
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
        - "international"
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
    contactId: 
      type: "string"
      flags: 
        presence: "required"
        description: "Unique contact ID only used by the system."
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
    contactType: 
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
        - "primary"
        - "secondary"
        - "otherFilers"
        - "intervenor"
        - "participant"
        - "otherPetitioners"
        - "otherPetitioner"
    hasEAccess: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Flag that indicates if the contact has credentials to both the legacy and new system."
    email: 
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
    inCareOf: 
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
    isAddressSealed: 
      type: "boolean"
      flags: 
        presence: "required"
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
    sealedAndUnavailable: 
      type: "boolean"
      flags: 
        presence: "optional"
    secondaryName: 
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
    serviceIndicator: 
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
        - "Electronic"
        - "None"
        - "Paper"
    title: 
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
    postalCode: 
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

 ```
