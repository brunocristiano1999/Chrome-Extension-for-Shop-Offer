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
						type: '',
						title: '',
						url: '',
					};
                    pages.pages[count] = page;
                    count++;
				});

				chrome.storage.local.set(pages);
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
            chrome.tabs.create({ url: "https://www.modio.cz/"});
            break;
        }
});

Pages = {};

Pages.getPageForContent = (domain, callback) => {
	chrome.storage.local.get('pages', (pages) => {
		const parsed = psl.parse(domain);
        
		const result = _.find(pages.pages, (item) => {
			return (item.domain === domain || item.domain === parsed.domain);
		});

		if (result) {
			Pages.updatePage(result, (page) => {
				chrome.storage.local.set(pages);
                callback(page);
		    });
		} else {
			callback(false);
		}
	});
};

Pages.updatePage = (page, callback) => {
	chrome.storage.local.get('pages', (pages) => {
        $.getJSON('https://toolbarapi.modio.cz/get-data?url=' + page.domain, (data) => {	
            const temp = data.data;
            console.log("data", data);
            

            if(temp.length > 0) {
                page.type = temp[0].type;
                page.title = temp[0].title;
                page.url = temp[0].url;
            }

            chrome.storage.local.set(pages);
            callback(page);
        });
	});	
};


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.reason) {
        case 'page_data_for_content':
            chrome.tabs.query({active: true}, (tabs) => {
                Pages.getPageForContent(request.domain, (page) => {						
                    if (page) {
                        sendResponse(page);
                    } else {
                        sendResponse(false);
                    }
                });
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
