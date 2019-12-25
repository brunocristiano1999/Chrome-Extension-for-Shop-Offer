chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    $.ajax({
        type: "GET",
        url:"https://toolbarapi.modio.cz/get-shop-list",
        success: function (data) {
            var obj = JSON.parse(data, function (key, value) {
                if(key !== "status"){
                    var n = url.includes(value.toString().replace("http://",""));
                    if(n){
                        $("#no-offer").html('Fetching...');
                        $.ajax({
                            type: "GET",
                            url:"https://toolbarapi.modio.cz/get-data?url="+value,
                            success: function (data) {
                                var title = '';
                                var obj = JSON.parse(data, function (key, value) {
                                    if(key == 'title'){
                                        $("#no-offer").hide();
                                        $("#loader").hide();
                                        title = value;
                                    }
                                    if(key == "url") {
                                        $("#flag").append('<a style="width: 300px;" class="text-secondary" href="'+value+'" target="_blank">'+title+'</a><hr><br>');
                                    }

                                });
                            }
                        });
                    }
                }
            });
        }
    });

    setTimeout( function(){
        $("#no-offer").html('No Offer');
        $("#loader").hide();
    }  , 1000 );
});

