const GITHUB_REPO = 'thebinoculars/bing-wallpaper'
const BASE_URL = `https://raw.githubusercontent.com/${GITHUB_REPO}/refs/heads/master/archives`

const cache = {}

let currentDate = null

const elements = {
	datePicker: document.getElementById('date-picker'),
	prevDay: document.getElementById('prev-day'),
	nextDay: document.getElementById('next-day'),
	loading: document.getElementById('loading'),
	error: document.getElementById('error'),
	wallpaperImage: document.getElementById('wallpaper-image'),
	imageTitle: document.getElementById('image-title'),
}

function formatDateToYYYYMM(date) {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	return `${year}-${month}`
}

function formatDateToYYYYMMDD(date) {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

function formatBingDate(date) {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}${month}${day}`
}

async function fetchArchiveData(yearMonth) {
	const url = `${BASE_URL}/${yearMonth}/data.json`

	if (cache[yearMonth]) {
		return cache[yearMonth]
	}

	try {
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error(`Failed to fetch data for ${yearMonth}`)
		}
		const data = await response.json()
		cache[yearMonth] = data
		return data
	} catch (error) {
		throw new Error(`Unable to load archive data: ${error.message}`)
	}
}

function displayImage(imageData) {
	elements.loading.classList.add('hidden')
	elements.error.classList.add('hidden')

	const imageUrl = `https://www.bing.com${imageData.urlbase}_1920x1080.jpg`
	elements.wallpaperImage.src = imageUrl
	elements.wallpaperImage.alt = imageData.copyright

	document.title = imageData.copyright
	elements.imageTitle.textContent = imageData.copyright
}

function showError(message) {
	elements.loading.classList.add('hidden')
	elements.error.classList.remove('hidden')
	elements.error.textContent = message
}

async function loadImageForDate(date, tryYesterday = true) {
	currentDate = date
	elements.datePicker.value = formatDateToYYYYMMDD(date)

	elements.loading.classList.remove('hidden')
	elements.error.classList.add('hidden')

	const yearMonth = formatDateToYYYYMM(date)
	const bingDate = formatBingDate(date)

	try {
		const data = await fetchArchiveData(yearMonth)
		const imageData = data.find((item) => item.startdate === bingDate)

		if (!imageData) {
			if (tryYesterday) {
				const yesterday = new Date(date)
				yesterday.setDate(yesterday.getDate() - 1)
				await loadImageForDate(yesterday, false)
			} else {
				showError(`No wallpaper found for ${formatDateToYYYYMMDD(date)}`)
			}
			return
		}

		displayImage(imageData)
	} catch (error) {
		if (tryYesterday) {
			const yesterday = new Date(date)
			yesterday.setDate(yesterday.getDate() - 1)
			await loadImageForDate(yesterday, false)
		} else {
			showError(error.message)
		}
	}
}

function goToPreviousDay() {
	if (!currentDate) return

	const prevDate = new Date(currentDate)
	prevDate.setDate(prevDate.getDate() - 1)
	loadImageForDate(prevDate)
}

function goToNextDay() {
	if (!currentDate) return

	const nextDate = new Date(currentDate)
	nextDate.setDate(nextDate.getDate() + 1)
	loadImageForDate(nextDate)
}

function init() {
	elements.datePicker.addEventListener('change', (e) => {
		const selectedDate = new Date(e.target.value)
		loadImageForDate(selectedDate)
	})

	elements.prevDay.addEventListener('click', goToPreviousDay)
	elements.nextDay.addEventListener('click', goToNextDay)

	loadImageForDate(new Date())
}

document.addEventListener('DOMContentLoaded', init)
