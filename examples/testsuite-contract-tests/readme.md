# OpenAPI Postman test suite generation

This example contains the setup of Portman contract test generation, which will convert the OpenAPI document to a Postman collection, while adding Postman tests. The generated tests are focussed on the API contracts (the definition of the request/response with all properties), hence the reference to "API contract testing".

_use-case_: convert OpenAPI to Postman with a range of Portman contract tests, automatically generated, without any complex configuration or manually written tests.

## CLI usage

```ssh
portman --cliOptionsFile ./examples/testsuite-contract-tests/portman-cli-options.json
```

Configured by using the portman-cli config.

This is an example where we take the OpenAPI defined in `crm.yml`, with only 1 entity (leads) to keep the example simple and convert to Postman with all the default contract tests generated out-of-the-box.

## Portman settings

The portman settings (in JSON format) consists out of multiple parts:

- **version** : which refers the JSON test suite version (not relevant but might handy for future backward compatibility options).
- **tests** : which refers the definitions for the generated contract & variance tests.
    - **contractTests** : refers to the options to enabled autogenerated contract tests.
    - **contentTests**:  which refers the additional Postman tests that check the content.
    - **variationTests** : refers to the options to define variation tests.
    - **extendTests**:  which refers the custom additions of manual created Postman tests.

In this example we focus on the **contractTests** section and settings.

file: examples/testsuite-contract-tests/portman-config.crm.json

```json
{
  "version": 1.0,
  "tests": {
    "contractTests": [
      {
        "openApiOperation": "*::/crm/*",
        "statusSuccess": {
          "enabled": true
        }
      },
      {
        "openApiOperation": "*::/crm/*",
        "responseTime": {
          "enabled": true,
          "maxMs": 300
        }
      },
      {
        "openApiOperation": "*::/crm/*",
        "contentType": {
          "enabled": true
        }
      },
      {
        "openApiOperation": "*::/crm/*",
        "jsonBody": {
          "enabled": true
        }
      },
      {
        "openApiOperation": "*::/crm/*",
        "schemaValidation": {
          "enabled": true
        }
      },
      {
        "openApiOperation": "*::/crm/*",
        "headersPresent": {
          "enabled": true
        }
      }
    ]
  }
}
```

## Portman - "contractTests" properties

Version 1.0

The following contract tests can be enabled by using the following properties:

- **statusSuccess (Boolean)**: Adds the test if the response of the Postman request return a 2xx
- **responseTime (Boolean)**: Adds the test to verify if the response of the Postman request is returned within a number of ms.
- **contentType (Boolean)**: Adds the test if the response header is matching the expected content-type defined in the OpenAPI spec.
- **jsonBody (Boolean)**: Adds the test if the response body is matching the expected content-type defined in the OpenAPI spec.
- **schemaValidation (Boolean)**: Adds the test if the response body is matching the JSON schema defined in the OpenAPI spec. The JSON schema is inserted inline in the Postman test.
- **headersPresent (Boolean)**: Adds the test to verify if the Postman response header has the header names present, like defined in the OpenAPI spec.

## Example explained

We instruct Portman to generate tests, for which the 'tests' section as defined in the **portmanConfigFile** json file, will be used.

file: examples/testsuite-contract-tests/portman-config.crm.json >>

```json
  "tests": {
    "contractTests": [
      {
        "openApiOperation": "*::/crm/*",
        "statusSuccess": {
          "enabled": true
        }
      },
      {
        "openApiOperation": "*::/crm/*",
        "responseTime": {
          "enabled": true,
          "maxMs": 300
        }
      },
      {
        "openApiOperation": "*::/crm/*",
        "contentType": {
          "enabled": true
        }
      },
      {
        "openApiOperation": "*::/crm/*",
        "jsonBody": {
          "enabled": true
        }
      },
      {
        "openApiOperation": "*::/crm/*",
        "schemaValidation": {
          "enabled": true
        }
      },
      {
        "openApiOperation": "*::/crm/*",
        "headersPresent": {
          "enabled": true
        }
      }
    ]
```

The result will be that initial OpenAPI file, with all request and response details will be used to generate the specific tests. Per Postman request, you can find the specific tests in the "Tests" tab in the Postman application.

file: examples/testsuite-contract-tests/crm.postman.json >>

Postman request "Leads"" >> Get lead"

```js
// Validate status 2xx
pm.test('[GET]::/crm/leads/:id - Status code is 2xx', function () {
  pm.response.to.be.success
})

// Validate response time
pm.test('[GET]::/crm/leads/:id - Response time is less than 300ms', function () {
  pm.expect(pm.response.responseTime).to.be.below(300)
})

// Validate if response header has matching content-type
pm.test('[GET]::/crm/leads/:id - Content-Type is application/json', function () {
  pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json')
})

// Validate if response has JSON Body
pm.test('[GET]::/crm/leads/:id - Response has JSON Body', function () {
  pm.response.to.have.jsonBody()
})

// Response Validation
const schema = {
  type: 'object',
  required: ['status_code', 'status', 'service', 'resource', 'operation', 'data'],
  properties: {
    status_code: { type: 'integer', description: 'HTTP Response Status Code', example: 200 },
    status: { type: 'string', description: 'HTTP Response Status', example: 'OK' },
    service: { type: 'string', description: 'Apideck ID of service provider', example: 'zoho-crm' },
    resource: { type: 'string', description: 'Unified API resource name', example: 'companies' },
    operation: { type: 'string', description: 'Operation performed', example: 'one' },
    data: {
      required: ['name', 'company_name'],
      'x-pii': ['name', 'email', 'first_name', 'last_name'],
      properties: {
        id: { type: 'string', example: '12345', readOnly: true },
        owner_id: { type: 'string', example: '54321' },
        company_id: { type: ['string', 'null'], example: '2' },
        company_name: { type: ['string', 'null'], example: 'Spacex' },
        contact_id: { type: ['string', 'null'], example: '2' },
        name: { type: 'string', example: 'Elon Musk' },
        first_name: { type: ['string', 'null'], example: 'Elon' },
        last_name: { type: ['string', 'null'], example: 'Musk' },
        description: { type: ['string', 'null'], example: 'A thinker' },
        prefix: { type: ['string', 'null'], example: 'Sir' },
        title: { type: ['string', 'null'], example: 'CEO' },
        status: { type: ['string', 'null'], example: 'New' },
        monetary_amount: { type: ['number', 'null'], example: 75000 },
        currency: { type: ['string', 'null'], example: 'USD' },
        fax: { type: ['string', 'null'], example: '+12129876543' },
        websites: {
          type: 'array',
          items: {
            type: 'object',
            required: ['url'],
            properties: {
              id: { type: ['string', 'null'], example: '12345' },
              url: { type: 'string', example: 'http://example.com' },
              type: {
                type: 'string',
                'x-graphql-type-name': 'WebsiteType',
                enum: ['primary', 'secondary', 'work', 'personal', 'other'],
                example: 'primary'
              }
            }
          }
        },
        addresses: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: ['string', 'null'], example: '123' },
              type: {
                type: 'string',
                'x-graphql-type-name': 'AddressType',
                enum: ['primary', 'secondary', 'home', 'office', 'shipping', 'billing', 'other'],
                example: 'primary'
              },
              name: { type: ['string', 'null'], example: 'HQ US' },
              line1: {
                type: ['string', 'null'],
                example: 'Main street',
                description: 'Line 1 of the address e.g. number, street, suite, apt #, etc.'
              },
              line2: {
                type: ['string', 'null'],
                example: 'apt #',
                description: 'Line 2 of the address'
              },
              city: {
                type: ['string', 'null'],
                example: 'San Francisco',
                description: 'Name of city.'
              },
              state: { type: ['string', 'null'], example: 'CA', description: 'Name of state' },
              postal_code: {
                type: ['string', 'null'],
                example: '94104',
                description: 'Zip code or equivalent.'
              },
              country: {
                type: ['string', 'null'],
                example: 'US',
                description: 'country code according to ISO 3166-1 alpha-2.'
              },
              latitude: { type: ['string', 'null'], example: '40.759211' },
              longitude: { type: ['string', 'null'], example: '-73.984638' }
            }
          }
        },
        social_links: {
          type: 'array',
          items: {
            required: ['url'],
            type: 'object',
            properties: {
              id: { type: ['string', 'null'], example: '12345' },
              url: { type: 'string', example: 'https://www.twitter.com/apideck-io' },
              type: { type: ['string', 'null'], example: 'twitter' }
            }
          }
        },
        phone_numbers: {
          type: 'array',
          items: {
            required: ['number'],
            type: 'object',
            properties: {
              id: { type: ['string', 'null'], example: '12345' },
              number: { type: 'string', example: '111-111-1111' },
              type: {
                type: 'string',
                'x-graphql-type-name': 'PhoneType',
                enum: [
                  'primary',
                  'secondary',
                  'home',
                  'office',
                  'mobile',
                  'assistant',
                  'fax',
                  'other'
                ],
                example: 'primary'
              }
            }
          }
        },
        emails: {
          type: 'array',
          items: {
            required: ['email'],
            type: 'object',
            properties: {
              id: { type: 'string', example: '123' },
              email: { type: 'string', format: 'email', example: 'elon@musk.com' },
              type: {
                type: 'string',
                'x-graphql-type-name': 'EmailType',
                enum: ['primary', 'secondary', 'work', 'personal', 'billing', 'other'],
                example: 'primary'
              }
            }
          }
        },
        custom_fields: {
          type: 'array',
          items: {
            type: 'object',
            required: ['id'],
            additionalProperties: false,
            properties: {
              id: { type: 'string', example: 'custom_technologies' },
              value: {
                anyOf: [
                  { type: ['string', 'null'], example: 'Uses Salesforce and Marketo' },
                  { type: ['number', 'null'], example: 10 },
                  { type: ['boolean', 'null'], example: true },
                  { type: 'array', items: { type: 'string' } }
                ]
              }
            }
          }
        },
        tags: { type: 'array', items: { type: 'string' }, example: ['New'] },
        updated_at: { type: 'string', example: '2020-09-30T07:43:32.000Z', readOnly: true },
        created_at: { type: 'string', example: '2020-09-30T07:43:32.000Z', readOnly: true }
      },
      type: 'object'
    }
  }
}

// Validate if response matches JSON schema
pm.test('[GET]::/crm/leads/:id - Schema is valid', function () {
  pm.response.to.have.jsonSchema(schema, { unknownFormats: ['int32', 'int64'] })
})

// Validate if response header is present
pm.test('[GET]::/crm/leads/:id - Response header Operation-Location is present', function () {
  pm.response.to.have.header('Operation-Location')
})
```

### statusSuccess

```json
"contractTests": [
      {
        "openApiOperation": "*::/crm/*",
        "statusSuccess": {
          "enabled": true
        }
      }
]
```

Generates a check to verify if the HTTP status code is within the 2xx range

```js
// Validate status 2xx
pm.test('[GET]::/crm/leads/:id - Status code is 2xx', function () {
  pm.response.to.be.success
})
```

### responseTime

```json
"contractTests": [
      {
        "openApiOperation": "*::/crm/*",
        "responseTime": {
          "enabled": true,
          "maxMs": 300
        }
      }
]
```

Generates a check to measure the response time, to be a maximum ms (which is set to 300ms in our example).

```js
// Validate response time
pm.test('[GET]::/crm/leads/:id - Response time is less than 300ms', function () {
  pm.expect(pm.response.responseTime).to.be.below(300)
})
```

### contentType

```json
"contractTests": [
      {
        "openApiOperation": "*::/crm/*",
        "contentType": {
          "enabled": true
        }
      }
]
```

Generates a check to validate the content-type headers, based on the content-type defined in the OpenAPI response.

```js
// Validate if response header has matching content-type
pm.test('[GET]::/crm/leads/:id - Content-Type is application/json', function () {
  pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json')
})
```

### jsonBody

```json
"contractTests": [
      {
        "openApiOperation": "*::/crm/*",
        "jsonBody": {
          "enabled": true
        }
      }
]
```

Generates a check to validate if the response body is a JSON object, based on the content-type defined in the OpenAPI response..

```js
// Response should have JSON Body
pm.test('[GET] /crm/leads/{id} - Response has JSON Body', function () {
  pm.response.to.have.jsonBody()
})
```

### headersPresent

```json
"contractTests": [
      {
        "openApiOperation": "*::/crm/*",
        "headersPresent": {
          "enabled": true
        }
      }
]
```

Generates a check to validate if the response has a certain HTTP header present, based on the header properties defined in the OpenAPI response.

```js
// Validate if response header is present
pm.test('[GET]::/crm/leads/:id - Response header Operation-Location is present', function () {
  pm.response.to.have.header('Operation-Location')
})
```

### schemaValidation

```json
"contractTests": [
      {
        "openApiOperation": "*::/crm/*",
        "schemaValidation": {
          "enabled": true
        }
      }
]
```

Generates a check to validate if the response respects all the defined response properties, allowed property types, required fields, allowed enums, .... It does a full JSON schema verification, based on the OpenAPI response properties.

```js
// Response Validation
const schema = {
  type: 'object',
  required: ['status_code', 'status', 'service', 'resource', 'operation', 'data'],
  properties: {
    status_code: { type: 'integer', description: 'HTTP Response Status Code', example: 200 },
    status: { type: 'string', description: 'HTTP Response Status', example: 'OK' },
    service: { type: 'string', description: 'Apideck ID of service provider', example: 'zoho-crm' },
    resource: { type: 'string', description: 'Unified API resource name', example: 'companies' },
    operation: { type: 'string', description: 'Operation performed', example: 'one' },
    data: {
      required: ['name', 'company_name'],
      'x-pii': ['name', 'email', 'first_name', 'last_name'],
      properties: {
        id: { type: 'string', example: '12345', readOnly: true },
        owner_id: { type: 'string', example: '54321' },
        company_id: { type: ['string', 'null'], example: '2' },
        company_name: { type: ['string', 'null'], example: 'Spacex' },
        contact_id: { type: ['string', 'null'], example: '2' },
        name: { type: 'string', example: 'Elon Musk' },
        first_name: { type: ['string', 'null'], example: 'Elon' },
        last_name: { type: ['string', 'null'], example: 'Musk' },
        description: { type: ['string', 'null'], example: 'A thinker' },
        prefix: { type: ['string', 'null'], example: 'Sir' },
        title: { type: ['string', 'null'], example: 'CEO' },
        status: { type: ['string', 'null'], example: 'New' },
        monetary_amount: { type: ['number', 'null'], example: 75000 },
        currency: { type: ['string', 'null'], example: 'USD' },
        fax: { type: ['string', 'null'], example: '+12129876543' },
        websites: {
          type: 'array',
          items: {
            type: 'object',
            required: ['url'],
            properties: {
              id: { type: ['string', 'null'], example: '12345' },
              url: { type: 'string', example: 'http://example.com' },
              type: {
                type: 'string',
                'x-graphql-type-name': 'WebsiteType',
                enum: ['primary', 'secondary', 'work', 'personal', 'other'],
                example: 'primary'
              }
            }
          }
        },
        addresses: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: ['string', 'null'], example: '123' },
              type: {
                type: 'string',
                'x-graphql-type-name': 'AddressType',
                enum: ['primary', 'secondary', 'home', 'office', 'shipping', 'billing', 'other'],
                example: 'primary'
              },
              name: { type: ['string', 'null'], example: 'HQ US' },
              line1: {
                type: ['string', 'null'],
                example: 'Main street',
                description: 'Line 1 of the address e.g. number, street, suite, apt #, etc.'
              },
              line2: {
                type: ['string', 'null'],
                example: 'apt #',
                description: 'Line 2 of the address'
              },
              city: {
                type: ['string', 'null'],
                example: 'San Francisco',
                description: 'Name of city.'
              },
              state: { type: ['string', 'null'], example: 'CA', description: 'Name of state' },
              postal_code: {
                type: ['string', 'null'],
                example: '94104',
                description: 'Zip code or equivalent.'
              },
              country: {
                type: ['string', 'null'],
                example: 'US',
                description: 'country code according to ISO 3166-1 alpha-2.'
              },
              latitude: { type: ['string', 'null'], example: '40.759211' },
              longitude: { type: ['string', 'null'], example: '-73.984638' }
            }
          }
        },
        social_links: {
          type: 'array',
          items: {
            required: ['url'],
            type: 'object',
            properties: {
              id: { type: ['string', 'null'], example: '12345' },
              url: { type: 'string', example: 'https://www.twitter.com/apideck-io' },
              type: { type: ['string', 'null'], example: 'twitter' }
            }
          }
        },
        phone_numbers: {
          type: 'array',
          items: {
            required: ['number'],
            type: 'object',
            properties: {
              id: { type: ['string', 'null'], example: '12345' },
              number: { type: 'string', example: '111-111-1111' },
              type: {
                type: 'string',
                'x-graphql-type-name': 'PhoneType',
                enum: [
                  'primary',
                  'secondary',
                  'home',
                  'office',
                  'mobile',
                  'assistant',
                  'fax',
                  'other'
                ],
                example: 'primary'
              }
            }
          }
        },
        emails: {
          type: 'array',
          items: {
            required: ['email'],
            type: 'object',
            properties: {
              id: { type: 'string', example: '123' },
              email: { type: 'string', format: 'email', example: 'elon@musk.com' },
              type: {
                type: 'string',
                'x-graphql-type-name': 'EmailType',
                enum: ['primary', 'secondary', 'work', 'personal', 'billing', 'other'],
                example: 'primary'
              }
            }
          }
        },
        custom_fields: {
          type: 'array',
          items: {
            type: 'object',
            required: ['id'],
            additionalProperties: false,
            properties: {
              id: { type: 'string', example: 'custom_technologies' },
              value: {
                anyOf: [
                  { type: ['string', 'null'], example: 'Uses Salesforce and Marketo' },
                  { type: ['number', 'null'], example: 10 },
                  { type: ['boolean', 'null'], example: true },
                  { type: 'array', items: { type: 'string' } }
                ]
              }
            }
          }
        },
        tags: { type: 'array', items: { type: 'string' }, example: ['New'] },
        updated_at: { type: 'string', example: '2020-09-30T07:43:32.000Z', readOnly: true },
        created_at: { type: 'string', example: '2020-09-30T07:43:32.000Z', readOnly: true }
      },
      type: 'object'
    }
  }
}

// Validate if response matches JSON schema
pm.test('[GET]::/crm/leads/:id - Schema is valid', function () {
  pm.response.to.have.jsonSchema(schema, { unknownFormats: ['int32', 'int64'] })
})
```