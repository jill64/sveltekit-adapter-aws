/* eslint-disable no-var */
import { ViewerRequestHandler } from 'cf2-builder'

export default ((event) => {
  var domainName = '__DOMAIN_NAME__'

  console.log(event)

  var request = event.request

  var host = request.headers.host
  var uri = request.uri
  var querystring = request.querystring

  if (!host) {
    return {
      statusCode: 400
    }
  }

  var keys = Object.keys(querystring)
  var values = Object.values(querystring)

  if (host.value === domainName || !domainName) {
    request.querystring = {}

    request.headers['x-forwarded-host'] = {
      value: host.value
    }

    keys.forEach((key, index) => {
      request.querystring[encodeURIComponent(key)] = values[index]
    })

    return request
  }

  var search = ''

  if (keys.length) {
    search = '?'

    keys.forEach((key) => {
      var val = querystring[key]
      var value = val.value
      var multiValue = val.multiValue

      if (search !== '?') {
        search = search + '&'
      }

      search = search + key + '=' + value

      if (multiValue) {
        multiValue.forEach((value) => {
          search = search + '&' + key + '=' + value
        })
      }
    })
  }

  return {
    statusCode: 308,
    headers: {
      location: {
        value: 'https://' + domainName + uri + search
      }
    }
  }
}) satisfies ViewerRequestHandler
