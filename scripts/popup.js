
'use strict'

var mainProcess = ( function() {   
    
    function getShopDomain(url) {
        var temp = url.toString();
        var arr = temp.split("/");  
        return arr[2];
    }

    return {
        onload: function () {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                var currentUrl = tabs[0].url;
                $.ajax({
                    type: "GET",
                    url:"https://toolbarapi.modio.cz/get-shop-list",
                    success: function (data) {
                        JSON.parse(data, function (key, value) {
                            if(key !== "status"){
                                var n = currentUrl.includes(getShopDomain(value));
                                if(n){
                                    $.ajax({
                                        type: "GET",
                                        url:"https://toolbarapi.modio.cz/get-data?url=" + value,
                                        success: function (data) {
                                            console.log(data);
                                            
                                            var title = '';
                                            JSON.parse(data, function (key, value) {
                                                if(key == 'title'){
                                                    title = value;
                                                }
                                                if(key == "url") {
                                                    $("#offerItem").append('<a class="item" href="' + value + '" target="_blank">' + title + '</a><div class="divider"></div>');
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            });
        }
    }
})();

window.onload = mainProcess.onload;