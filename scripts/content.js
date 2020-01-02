Utils = {};

Utils.getBaseUrl = (url) => {
	return url.replace('http://', '').replace('https://', '').replace('www.', '').split(/[/?#]/)[0];
};

chrome.runtime.sendMessage({
    reason: 'page_data_for_content',
    domain: Utils.getBaseUrl(location.host)
}, (page) => {
    if (page != false) {
        let box = "<div class='modio-container'><div class='modio-header'><img id='modio-logo'src='../assets/images/logo.png' alt='logo'><span id='modio-close'>x</span></div>" + 
        "<div class='modio-banner'><div id='modio-bannerText'>O F F E R</div></div><div class='modio-offer'><div id='modio-offerItem'>" + 
        "</div></div><div class='modio-footer'><div id='modio-footerButton'><span id='modio-footerLogo'></span></div></div>" ;
        $('body').append(box);
        $("#modio-offerItem").append('<a class="modio-item" href="' + page.url + '" target="_blank">' + page.title + '</a><div class="modio-divider"></div>');
     
        $("#modio-close").click((e) => {
            e.preventDefault();

            $(".modio-container").fadeOut();
        })
    }
});

