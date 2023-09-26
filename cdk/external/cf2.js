var domainName = '__DOMAIN_NAME__'

function handler(event) {
  var request = event.request

  var host = request.headers.host
  var uri = request.uri
  var querystring = request.querystring

  console.log('request', request)

  if (!host) {
    return {
      statusCode: 400
    }
  }

  if (host.value === domainName || !domainName) {
    return request
  }

  var search = ''

  if (querystring) {
    search = '?'

    var keys = Object.keys(querystring)

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
}
