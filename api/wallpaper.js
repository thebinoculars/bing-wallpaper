const { getImageURL } = require('../scripts/bing')

exports.handler = async ({ queryStringParameters: params }) => {
	try {
		const url = await getImageURL(params)
		return {
			statusCode: 302,
			headers: {
				Location: url,
			},
		}
	} catch (e) {
		console.error('API Error:', e.message)
		return {
			statusCode: 500,
			body: JSON.stringify({ message: 'Internal server error' }),
		}
	}
}
