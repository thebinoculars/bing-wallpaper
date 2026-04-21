const fs = require('fs/promises')
const { fetchBingData, modifyImageUrl, bingBaseURL } = require('./bing')

const chunk = (array, size) => {
	const result = []
	for (let i = 0; i < array.length; i += size) {
		result.push(array.slice(i, i + size))
	}
	return result
}

const syncData = async () => {
	try {
		const { images } = await fetchBingData()
		const imageData = images[0]
		const startDate = imageData.startdate
		const year = startDate.substring(0, 4)
		const month = startDate.substring(4, 6)
		const monthString = `${year}-${month}`

		const folderName = `archives/${monthString}`
		const jsonFilename = `${folderName}/data.json`
		const mdFilename = `${folderName}/README.md`

		try {
			await fs.mkdir(folderName, { recursive: true })
		} catch (e) {
			if (e.code !== 'EEXIST') throw e
		}

		let jsonData = []
		try {
			const jsonContent = await fs.readFile(jsonFilename, 'utf8')
			jsonData = JSON.parse(jsonContent)
		} catch (e) {
			if (e.code !== 'ENOENT') throw e
		}
		const existingItemIndex = jsonData.findIndex(
			(item) => item.startdate === imageData.startdate
		)
		if (existingItemIndex === -1) {
			jsonData.push(imageData)
			jsonData.sort((a, b) => (a.startdate > b.startdate ? -1 : 1))
			await fs.writeFile(jsonFilename, JSON.stringify(jsonData, null, 2))
		}

		const dynamicContent = await generateMarkdownContent(jsonData, monthString)

		await fs.writeFile(mdFilename, dynamicContent)
		await fs.writeFile(
			'README.md',
			await replaceMarkdownContent(dynamicContent)
		)
	} catch (error) {
		console.error('Something went wrong: ', error.message)
	}
}

const convertDate = (date) => {
	const year = date.substring(0, 4)
	const month = date.substring(4, 6)
	const day = date.substring(6, 8)

	return `${year}-${month}-${day}`
}

const generateTableRow = (length, cell) => {
	const content = Array.from({ length }, () => cell).join('|')
	return `|${content}|`
}

const generateMarkdownContent = async (jsonData, month) => {
	const rowNumber = 3
	const resolutions = [
		'240x320',
		'320x240',
		'400x240',
		'480x800',
		'640x480',
		'720x1280',
		'768x1280',
		'800x480',
		'800x600',
		'1024x768',
		'1280x768',
		'1366x768',
		'1920x1080',
		'1920x1200',
		'UHD',
	]

	const archiveFolders = await fs.readdir('archives', { withFileTypes: true })

	let content = `## Wallpaper for ${month}` + '\n'

	content += generateTableRow(rowNumber, `      `) + '\n'
	content += generateTableRow(rowNumber, ` :----: `) + '\n'
	content +=
		chunk(
			jsonData.map((data) => {
				const imageURL = modifyImageUrl(`${bingBaseURL}${data.url}`, {
					res: '320x240',
				})
				const downloadLinksMarkdown = resolutions
					.map((size) => {
						const imageBySizeURL = modifyImageUrl(`${bingBaseURL}${data.url}`, {
							res: size,
						})
						return `[${size}](${imageBySizeURL})`
					})
					.join(' ~ ')

				return `![${data.copyright}](${imageURL})<br />${convertDate(
					data.startdate
				)}<br />${downloadLinksMarkdown}`
			}),
			rowNumber
		)
			.map((items) => `|${items.join('|')}|`)
			.join('\n') + '\n\n'

	content += '## Archives\n'
	content += archiveFolders
		.filter((folder) => folder.isDirectory())
		.map((folder) => `[${folder.name}](/archives/${folder.name}/)`)
		.reverse()
		.join(' | ')

	return content
}

const replaceMarkdownContent = async (dynamicContent) => {
	const staticContent = await fs.readFile('template.md', 'utf8')
	return staticContent.replace(
		'<!-- GENERATED_CONTENT_PLACEHOLDER -->',
		dynamicContent
	)
}

syncData()
