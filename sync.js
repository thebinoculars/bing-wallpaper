const fs = require('fs')
const { promisify } = require('util')
const chunk = require('lodash/chunk')
const { fetchBingData, modifyImageUrl, bingBaseURL } = require('./src/js/bing')

const writeFileAsync = promisify(fs.writeFile)
const readFileAsync = promisify(fs.readFile)

const syncData = async () => {
	try {
		const { images } = await fetchBingData()
		const imageData = images[0]
		const currentDate = new Date()
		const month = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
			.toString()
			.padStart(2, '0')}`
		const folderName = `archives/${month}`
		const jsonFilename = `${folderName}/data.json`
		const mdFilename = `${folderName}/README.md`

		if (!fs.existsSync(folderName)) {
			fs.mkdirSync(folderName, { recursive: true })
		}

		let jsonData = []
		if (fs.existsSync(jsonFilename)) {
			const jsonContent = await readFileAsync(jsonFilename, 'utf8')
			jsonData = JSON.parse(jsonContent)
		}
		const existingItemIndex = jsonData.findIndex(
			(item) => item.enddate === imageData.enddate
		)
		if (existingItemIndex === -1) {
			jsonData.push(imageData)
			jsonData.sort((a, b) => (a.enddate > b.enddate ? -1 : 1))
			await writeFileAsync(jsonFilename, JSON.stringify(jsonData, null, 2))
		}

		const staticContent = await readFileAsync('content.md', 'utf8')
		await writeFileAsync(mdFilename, generateMarkdownContent(jsonData, staticContent))
		await writeFileAsync('README.md', generateMarkdownContent(jsonData, staticContent, true))
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

const generateMarkdownContent = (jsonData, staticContent, hasFooter = false) => {
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

	const archiveFolders = fs.readdirSync('archives', { withFileTypes: true })

	let content = staticContent + '\n' + '## Daily Wallpaper' + '\n'

	content += generateTableRow(rowNumber, `      `) + '\n'
	content += generateTableRow(rowNumber, ` :----: `) + '\n'
	content +=
		chunk(
			jsonData.map((data) => {
				const imageURL = modifyImageUrl(`${bingBaseURL}${data.url}`)
				const downloadLinksMarkdown = resolutions
					.map((size) => {
						const imageBySizeURL = modifyImageUrl(`${bingBaseURL}${data.url}`, {
							res: size,
						})
						return `[${size}](${imageBySizeURL})`
					})
					.join(' ~ ')

				return `![${data.copyright}](${imageURL}) ${convertDate(
					data.enddate
				)} <br /> ${downloadLinksMarkdown}`
			}),
			rowNumber
		)
			.map((items) => `|${items.join('|')}|`)
			.join('\n') + '\n\n'

	if (hasFooter) {
		content += '## Archives\n'
		content += archiveFolders
			.filter((folder) => folder.isDirectory())
			.map((folder) => `[${folder.name}](/archives/${folder.name}/)`)
			.join('|')
	}

	return content
}

syncData()
