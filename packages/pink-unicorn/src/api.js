import SwaggerClient from 'swagger-client'
import Validator from 'swagger-model-validator'
import { isEmpty, merge } from 'lodash'

// SwaggerClient.http.withCredentials = true

const apiSpecs = ONEAPI || {}
const validator = new Validator()
const execute = SwaggerClient.execute
SwaggerClient.execute = (options) => {
  const pathParams = {}
  const pathProperties = {}
  const result = execute({
    ...options,
    parameterBuilders: {
      path: ({req, value, parameter}) => {
        pathParams[ parameter.name ] = value
        pathProperties[ parameter.name ] = parameter
        req.url = req.url.split(`{${parameter.name}}`).join(encodeURIComponent(value))
      },

      query: ({req, value, parameter}) => {
        pathParams[ parameter.name ] = value
        pathProperties[ parameter.name ] = parameter

        req.query = req.query || {}

        if (value === false && parameter.type === 'boolean') {
          value = 'false'
        }

        if (value === 0 && ['number', 'integer'].indexOf(parameter.type) > -1) {
          value = '0'
        }

        if (value) {
          req.query[parameter.name] = {
            collectionFormat: parameter.collectionFormat,
            value
          }
        } else if (parameter.allowEmptyValue && value !== undefined) {
          const paramName = parameter.name
          req.query[paramName] = req.query[paramName] || {}
          req.query[paramName].allowEmptyValue = true
        }
      },
    }
  })

  if (!isEmpty(pathProperties)) {
    const validation = validator.validate(pathParams, {
      properties: pathProperties
    })

    if (!validation.valid) {
      throw new Error(validation.GetErrorMessages().join('\n'))
    }
  }

  return result
}

const clients = {}

export function client (name, spec) {
  if (!(spec || apiSpecs[ name ])) {
    return Promise.reject(new Error(`Client "${name}" not found`))
  }

  if (!clients[ name ]) {
    clients[ name ] = new SwaggerClient({
      spec: apiSpecs[ name ] ? merge({}, apiSpecs[ name ], spec) : spec,
      v2OperationIdCompatibilityMode: true,
    })
  }

  return clients[ name ]
}
