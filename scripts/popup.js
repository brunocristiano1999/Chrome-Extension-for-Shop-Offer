
'use strict'

const getShopDomain = (url) => {
    return url.replace('http://', '').replace('https://', '').replace('www.', '').split(/[/?#]/)[0];
};

var mainProcess = ( function() {   
    var hasOffer = false;
    var isInShopList = true;

    return {
        onload: function () {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                let currentUrl = tabs[0].url;
                
                // $.getJSON("https://toolbarapi.modio.cz/get-shop-list", (data) => {
                // });

                $.ajax({
                    type: "GET",
                    url:"https://toolbarapi.modio.cz/get-shop-list",
                    success: function (data) {
                        JSON.parse(data, function (key, value) {
                            if(key !== "status"){
                                console.log(getShopDomain(value));
                                
                                var isExist = currentUrl.includes(getShopDomain(value));
                                if(isExist){
                                    $.ajax({
                                        type: "GET",
                                        url:"https://toolbarapi.modio.cz/get-data?url=" + value,
                                        success: function (data) {
                                            var title = '';
                                            JSON.parse(data, function (key, value) {
                                                if(key == 'title') {
                                                    title = value;
                                                }

                                                if(key == "url") {
                                                    $("#offerItem").append('<a class="item" href="' + value + '" target="_blank">' + title + '</a><div class="divider"></div>');
                                                    hasOffer = true;
                                                    isInShopList = true;
                                                }
                                            });

                                            if( hasOffer == false)
                                                $("#offerItem").append('<span>No Offers</span>');    
                                        }
                                    });
                                } else {
                                    isInShopList = false;
                                }
                            } 
                        });

                        // if(isInShopList == false)
                        //     $("#offerItem").append('<span>Not In Our Shoplist</span>');    
                    }
                });
            });
        }
    }
})();

window.onload = mainProcess.onload;