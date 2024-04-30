import {
	ACTION_CHANGE_BACKGROUND,
	ACTION_PREVIEW_BACKGROUND,
} from '@/js/constant'
import '@/popup.css'

const widthElement = document.getElementById('width')
const heightElement = document.getElementById('height')
const resolutionElement = document.getElementById('resolution')
const qualityElement = document.getElementById('quality')
const widthValue = document.getElementById('width-value')
const heightValue = document.getElementById('height-value')
const qualityValue = document.getElementById('quality-value')

widthElement.addEventListener('input', () => {
	widthValue.textContent = widthElement.value
})

heightElement.addEventListener('input', () => {
	heightValue.textContent = heightElement.value
})

qualityElement.addEventListener('input', () => {
	qualityValue.textContent = qualityElement.value
})

document.getElementById('change-wallpaper').addEventListener('click', () => {
	chrome.runtime.sendMessage({
		action: ACTION_CHANGE_BACKGROUND,
		w: widthElement.value,
		h: heightElement.value,
		res: resolutionElement.value,
		qlt: qualityElement.value,
	})
})

document.getElementById('preview-wallpaper').addEventListener('click', () => {
	chrome.runtime.sendMessage({
		action: ACTION_PREVIEW_BACKGROUND,
		w: widthElement.value,
		h: heightElement.value,
		res: resolutionElement.value,
		qlt: qualityElement.value,
	})
})
