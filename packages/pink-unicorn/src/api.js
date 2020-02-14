import SwaggerClient from 'swagger-client'
import Validator from 'swagger-model-validator'
import { isEmpty } from 'lodash'

SwaggerClient.http.withCredentials = true

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
      }
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
      spec: spec || apiSpecs[ name ],
      v2OperationIdCompatibilityMode: true,
    })
  }

  return clients[ name ]
}
