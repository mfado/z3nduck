/*
Mark Fado - mfado@zendesk.com
2015-01-30

USAGE: Call the main function goDaffy() with no parameters. It will probably work.

Requires the following Script Properties (File > Project Properties > Script Properties)
- zd_username (bob@ross.com)
- zd_subdomain (support)
- zd_token (ULTRA_TOP_SECRET_API_TOKEN)
- db_token
*/

function pushToDucksboard(widget, result) {
    var url = "https://push.ducksboard.com/values/" + widget;
    var options = {
        "method": "post",
        "headers": setHeaders("db")
    };

    options.payload = result;

    var success = true;
    try {
        var response = UrlFetchApp.fetch(url, options);
    } catch (e) {
        success = false;
        Logger.log("Push to Ducksboard failed...");
        Logger.log(e.message);
    }
}

function buildView(groupID) {
    var data = {
        "view": {
            "conditions": {
                "all": [{
                    "field": "group_id",
                    "operator": "is",
                    "value": groupID
                }, {
                    "field": "status",
                    "operator": "less_than",
                    "value": "pending"
                }, {
                    "field": "assignee_id",
                    "operator": "is",
                    "value": ""
                }]
            },
            "output": {
                "columns": ["subject", "updated_at", "updated_assignee", "nice_id"],
                "sort_by": "updated_at",
                "sort_order": "asc"
            }
        }
    };
    var payload = JSON.stringify(data);
    var url = "https://support.zendesk.com/api/v2/views/preview.json";

    var options = {
        "method": "post",
        "contentType": "application/json",
        "headers": setHeaders("zd"),
        "payload": payload
    };

    var success = true;
    try {
        var response = UrlFetchApp.fetch(url, options);
    } catch (e) {
        success = false;
        Logger.log("Pull from Zendesk failed...");
        Logger.log(e.message);
    }

    if (success) {
        var last_update = JSON.parse(response.getContentText()).rows[0].updated;
        var currentTime = (new Date()).getTime();
        var dt = new Date(getDateFromIso(last_update));
        var diff = currentTime - (Date.parse(dt));
        var x = secondsToString(diff / 1000);
        //Logger.log(x)

        obj = {
            "value": x
        };
        return obj;
    }
}

function goDaffy() {
     /*
     My test ducksboard
     
    // T1 count
    objT1 = buildView(20751853);
    // T2 count
    objT2 = buildView(20760138);
    // T3 count
    objT3 = buildView(20745432);
  
    // push to row 1 widgets
    pushToDucksboard(621024, JSON.stringify(objT1)); // t1
    pushToDucksboard(621026, JSON.stringify(objT2)); // t2
    pushToDucksboard(621027, JSON.stringify(objT3)); // t3
  
  // push to row 2 column 1 widget
    pushToDucksboard(620828, JSON.stringify(objT1)); // t1
    pushToDucksboard(620829, JSON.stringify(objT2)); // t2
    pushToDucksboard(620830, JSON.stringify(objT3)); // t3
  
  // push to row 2 column 2 widget
    pushToDucksboard(620852, JSON.stringify(objT1)); // t1
    pushToDucksboard(620853, JSON.stringify(objT2)); // t2
    pushToDucksboard(620854, JSON.stringify(objT3)); // t3
    */
  
  
    // Pointing to Support ops ducksboard
     objT1 = buildView(20751853);
    // T2 count
    objT2 = buildView(20760138);
    // T3 count
    objT3 = buildView(20745432);
  
  Logger.log(objT1)
  Logger.log(objT2)
  Logger.log(objT3)
  
    // push to singular widgets
  testobj = {"value":"123.1"};
  pushToDucksboard(624728, JSON.stringify(objT1)); // t1
    pushToDucksboard(624732, JSON.stringify(objT2)); // t2
    pushToDucksboard(624736, JSON.stringify(objT3)); // t3
  
  // push to "bars" widget
    pushToDucksboard(624742, JSON.stringify(objT1)); // t1
    pushToDucksboard(624743, JSON.stringify(objT2)); // t2
    pushToDucksboard(624744, JSON.stringify(objT3)); // t3
  
  // push to box widget
    pushToDucksboard(624738, JSON.stringify(objT1)); // t1
    pushToDucksboard(624739, JSON.stringify(objT2)); // t2
    pushToDucksboard(624740, JSON.stringify(objT3)); // t3 
  
  
  

  /*
    // Tier 2
    obj = buildView(20760138);
    pushToDucksboard(593039, JSON.stringify(obj));
    // Tier 3
    obj = buildView(20745432);
    pushToDucksboard(611481, JSON.stringify(obj));
    */
}

// helpers

function getP(propertyName) {
    return PropertiesService.getScriptProperties().getProperty(propertyName);
}

function setHeaders(type) {
    var zd_auth = getP('zd_username') + ":" + getP('zd_token');
    var db_auth = getP('db_token') + ":" + "whatever";
    var unamepass = (type == "zd") ? zd_auth : db_auth;
    var digest = Utilities.base64Encode(unamepass);
    var digestfull = "Basic " + digest;
    var httpheaders = {
        "Authorization": digestfull,
        "Accept": "application/json"
    };
    return httpheaders;
}

function secondsToString(seconds) {
  /*
    var numdays = Math.floor((seconds % 31536000) / 86400);
    var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    var numseconds = Math.floor((((seconds % 31536000) % 86400) % 3600) % 60);
    // return numdays + " day" + prettyTime(numdays) + " " + numhours + " hour" + prettyTime(numhours) + " " + numminutes + " minute" + prettyTime(numminutes) + " " + numseconds + " second" + prettyTime(numseconds);
    */
  var numhours = seconds/3600;
  //Logger.log("not rounded: " + numhours);
  var rounded = (Math.round(seconds/3600 * 10) / 10);
  //Logger.log("rounded: " + rounded);
  return rounded;
}

function prettyTime(unit) {
    return (unit == 1) ? "" : "s";
}

function getDateFromIso(string) {
    try {
        var aDate = new Date();
        var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
            "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
            "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
        var d = string.match(new RegExp(regexp));

        var offset = 0;
        var date = new Date(d[1], 0, 1);

        if (d[3]) {
            date.setMonth(d[3] - 1);
        }
        if (d[5]) {
            date.setDate(d[5]);
        }
        if (d[7]) {
            date.setHours(d[7]);
        }
        if (d[8]) {
            date.setMinutes(d[8]);
        }
        if (d[10]) {
            date.setSeconds(d[10]);
        }
        if (d[12]) {
            date.setMilliseconds(Number("0." + d[12]) * 1000);
        }
        if (d[14]) {
            offset = (Number(d[16]) * 60) + Number(d[17]);
            offset *= ((d[15] == '-') ? 1 : -1);
        }

        offset -= date.getTimezoneOffset();
        time = (Number(date) + (offset * 60 * 1000));
        return aDate.setTime(Number(time));
    } catch (e) {
        return;
    }
}
