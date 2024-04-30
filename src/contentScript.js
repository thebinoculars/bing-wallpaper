import {
	ACTION_CHANGE_BACKGROUND,
	ACTION_PREVIEW_BACKGROUND,
} from '@/js/constant'

chrome.runtime.onMessage.addListener((request) => {
	switch (request.action) {
		case ACTION_CHANGE_BACKGROUND:
			document.body.style.background = `url('${request.url}') no-repeat center center fixed`
			document.body.style.backgroundSize = `cover`
			break
		case ACTION_PREVIEW_BACKGROUND:
			window.open(request.url, '_blank')
			break
		default:
			break
	}
})
