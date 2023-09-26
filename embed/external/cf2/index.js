var domainName = '__DOMAIN_NAME__'

function handler({ request }) {
  var {
    headers: { host },
    uri,
    querystring
  } = request

  var hostName = host?.value

  if (!hostName) {
    return {
      statusCode: 400
    }
  }

  if (hostName === domainName) {
    return request
  }

  var search = ''

  if (querystring) {
    search = '?'

    var keys = Object.keys(querystring)

    keys.forEach((key) => {
      var { value, multiValue } = querystring[key]

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
