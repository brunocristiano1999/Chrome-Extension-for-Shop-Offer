
Utils = {};

Utils.getBaseUrl = (url) => {
	return url.replace('http://', '').replace('https://', '').replace('www.', '').split(/[/?#]/)[0];
};

var mainProcess = ( function() {   
    return {
        onload: function () {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                let currentUrl = tabs[0].url;
                const domain = Utils.getBaseUrl(currentUrl);
                
                chrome.runtime.sendMessage({
                    reason: 'page_data_for_content',
                    domain: domain
                }, (page) => {
                    if(page != false) {
                        if(page.type != '') {
                            $("#modio-offerItem").append('<a class="modio-item" href="' + page.url + '" target="_blank">' + page.title + '</a><div class="modio-divider"></div>');
                        } else {
                            $("#modio-offerItem").append('<span class="modio-noOffer">No Offers</span>');
                        }
                    }
                });
            });
        }
    }
})();

window.onload = mainProcess.onload;