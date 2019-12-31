Utils = {};

Utils.getBaseUrl = (url) => {
	return url.replace('http://', '').replace('https://', '').replace('www.', '').split(/[/?#]/)[0];
};

chrome.runtime.sendMessage({
    reason: 'page_data_for_content',
    domain: Utils.getBaseUrl(location.host)
}, (page) => {
});