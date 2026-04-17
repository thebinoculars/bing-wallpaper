const fetch = require('cross-fetch')

const bingBaseURL = 'https://www.bing.com'

const fetchBingData = () => {
	const searchParams = new URLSearchParams({
		format: 'js',
		idx: -1, // -1 today, 0 yesterday
		n: 1,
		mkt: 'vi-VN',
	})

	return fetch(`${bingBaseURL}/HPImageArchive.aspx?${searchParams}`)
		.then((response) => response.json())
		.catch((error) => {
			console.error('Error fetching Bing data:', error)
			throw error
		})
}

const getImageURL = async (params) => {
	try {
		const {
			images: [{ url }],
		} = await fetchBingData()
		return modifyImageUrl(`${bingBaseURL}${url}`, params)
	} catch (error) {
		console.error('Error fetching Bing image:', error)
		throw error
	}
}

const modifyImageUrl = (imageUrl, params = {}) => {
	const { w, h, res, qlt } = params

	let newImageUrl = imageUrl

	if (res) {
		const regex = /_\d+x\d+\.jpg/
		const newResolution = `_${res}.jpg`
		newImageUrl = newImageUrl.replace(regex, newResolution)
	}

	const url = new URL(newImageUrl)
	const searchParams = new URLSearchParams(url.search)

	if (w) {
		searchParams.set('w', w)
	}

	if (h) {
		searchParams.set('h', h)
	}

	if (qlt) {
		searchParams.set('qlt', qlt)
	}

	searchParams.delete('rf')
	searchParams.delete('pid')
	url.search = searchParams.toString()
	return url.toString()
}

module.exports = {
	bingBaseURL,
	getImageURL,
	modifyImageUrl,
	fetchBingData,
}
