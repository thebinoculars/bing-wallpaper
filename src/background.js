import { getImageURL } from '@/js/bing'
import {
	ACTION_CHANGE_BACKGROUND,
	ACTION_PREVIEW_BACKGROUND,
} from '@/js/constant'

chrome.runtime.onMessage.addListener((request) => {
	if (
		[ACTION_CHANGE_BACKGROUND, ACTION_PREVIEW_BACKGROUND].includes(
			request.action
		)
	) {
		getImageURL(request).then((url) => {
			console.log(`BING daily wallpaper: ${url}`)
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				if (tabs.length) {
					chrome.tabs.sendMessage(tabs[0].id, { action: request.action, url })
				} else {
					console.log('No active tab')
				}
			})
		})
	}
})
