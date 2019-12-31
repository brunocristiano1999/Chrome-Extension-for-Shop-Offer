Feed = {};

Feed.update = () => {
    $.getJSON('https://toolbarapi.modio.cz/get-shop-list', (data) => {
			chrome.storage.local.get('pages', (currentPages) => {
				if (!currentPages.hasOwnProperty('pages')) { // initialize
					currentPages = {'pages': {}};
				}

                const pages = {'pages': {}};
                const temp = data.list;
                let count = 0;
                
				temp.map((item) => {
					const page = {
                        id: count,
						domain: Utils.getBaseUrl(temp[count]),
						expireAt: 0,
						animateAt: 0,
						hiddenUntil: 0,
						cashback: {},
						sales: {}
					};
                    pages.pages[count] = page;
                    count++;
				});

				chrome.storage.local.set(pages);

				// Set feed update
                chrome.storage.local.set({'feedUpdate': moment().unix()});
			});
		});
};

Utils = {};

Utils.getBaseUrl = (url) => {
	return url.replace('http://', '').replace('https://', '').replace('www.', '').split(/[/?#]/)[0];
};

chrome.runtime.onInstalled.addListener((details) => {
    switch(details.reason) {
        case "install":
            Feed.update();
            //chrome.tabs.create({ url: "https://www.modio.cz/"});
            break;
        }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.reason) {
        case 'page_data_for_content':
            chrome.tabs.query({active: true}, (tabs) => {
                if (referrals[sender.tab.id] && referrals[sender.tab.id].collision) {
					Pages.setHide(request.domain, moment().add(1, 'day').unix());					
                    console.log("1");
                    
                    sendResponse(false);
				} else {	
                    console.log("2");				
					Pages.getPageForContent(request.domain, (page) => {						
						if (page) {
                            
                            
							sendResponse(page);
						} else {
                            console.log("3");
                            
							sendResponse(false);
						}
					});
				}
            });
            
            return true;
    }
})

const referrals = {};

chrome.webRequest.onBeforeRedirect.addListener(
	(details) => {
		if (!referrals[details.tabId] || referrals[details.tabId].finished) {
			referrals[details.tabId] = {
				finished: false,
				collision: false
			}
		}			

		if (Referral.detect(details.url)) {
			referrals[details.tabId].collision = true;			
		}
	},
	{
		'urls': ['<all_urls>'],
		'types': ['main_frame']
	},
	['responseHeaders']
);

chrome.webRequest.onCompleted.addListener(
	(details) => {
		if (referrals[details.tabId]) {
			referrals[details.tabId].finished = true;
		}
	},
	{
		'urls': ['<all_urls>'],
		'types': ['main_frame']
	},
	['responseHeaders']
);

chrome.tabs.onRemoved.addListener((tabId) => {
	delete referrals[tabId];
});
