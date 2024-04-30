const { getImageURL } = require('../src/js/bing')

exports.handler = async ({ queryStringParameters: params }) => {
	try {
    const url = await getImageURL(params)
    return {
      statusCode: 302,
      headers: {
        Location: url
      }
    }
	} catch (e) {
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: e.message
			})
		}
	}
}