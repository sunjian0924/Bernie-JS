var jsdom = require("jsdom"); 
var prettyjson = require('prettyjson');
var fs = require('fs');
var json2csv = require('json2csv');

var csvPrint = function(schedule, date) {
    json2csv({data: schedule, fields: ["time", "location", "course", "consultant", "clients"]}, function(err, csv) {
        if (err)  {
            //console.log(err);
        }
        fs.writeFile("server/plugins/reportGenerator/output/" + date + ".csv", csv, function(err) {
            if(err) {
                //console.log(err);
            } else {
                //console.log("The file was saved!");
            }
        }); 
    });
}

var filterCanceled = function(myTableArray) {
    var result = [];
    myTableArray.forEach(function(element) {
        if (element[8] === "") {
            result.push(element);
        }
    });
    return result;
}

/*
    input specs:

    [   '4/3/2015',                                  -- date               /\d{1,2}\/\d{1,2}\/\d{4}/g  
        '1:00 PM',                                   -- time               /\d{1,2}\:\d{1,2}\ AM|\d{1,2}\:\d{1,2}\ PM/g
        'Rachel Claire Jacoby',                      -- person name
        'BERNIE - Tutorial Assistance Program',      -- center name
        'Christopher Taylor',                        -- person name
        'MTH-151 Sobecki 1520',                      -- course name
        'Tutoring',                                  -- reason
        '9377518790',                                -- phone number
        '',                                          -- status
        '' ]

    Due to the nature of this plugin, only time has to be checked
*/


var checkInput = function(myTableArray) {
    var reg = /\d{1,2}\:\d{1,2}\ AM|\d{1,2}\:\d{1,2}\ PM/;
    var count = 0;
    var size = myTableArray.length;
    for (var i = size - 1; i >= 0; i--) {
        if (!reg.test(myTableArray[i][1])) {
            count++;
            myTableArray.splice(i, 1);
        }
    }
    return count;
}

var rawSchedule = function(myTableArray) {

    var schedule = {};
    myTableArray.forEach(function(element) {
        var temp = {};
        temp.clients = [];
        temp.clients.push(element[2]);
        temp.consultant = element[4];
        temp.course = element[5];
        temp.group = "no";
        if (schedule[element[1]]) {
            schedule[element[1]].forEach(function(e) {
                if (e.consultant === temp.consultant) {
                    temp.group = "yes";
                    e.group = "yes";
                    e.clients.push(temp.clients[0]);
                }
            });
            if (temp.group !== "yes") {
                schedule[element[1]].push(temp);
            }
        } else {
            schedule[element[1]] = [];
            schedule[element[1]].push(temp);
        }
    });

    return schedule;
}

var intermediateSchedule = function(schedule1, schedule2) {

    var result = {};
    for (var k1 in schedule1) {
        var size = schedule1[k1].length;
        for (var i = size -1; i > -1; i--) {
            if (schedule1[k1][i].group === 'yes') {
                schedule1[k1].splice(i, 1);
            }
        }
    }
    for (var k2 in schedule2) {
        var size = schedule2[k2].length;
        for (var i = size -1; i > -1; i--) {
            if (schedule2[k2][i].group === 'no') {
                schedule2[k2].splice(i, 1);
            }
        }
    }
    result["single"] = schedule1;
    result["group"] = schedule2;
    return result;
}

var finalSchedule2 = function(schedule) {

    var result = [];
    var actionS = function(time, cNum) {
        var Sslots = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];
        var cubicle = cNum < 8 ? Sslots[cNum] : "N/A";
        if (schedule.single[time].length != 0) {
            var temp = {};
            temp["time"] = time;
            temp["course"] = schedule.single[time][0].course;
            var clients = "";
            schedule.single[time][0].clients.forEach(function(element) {
                clients += element;
                clients += ", ";
            });
            temp["clients"] = clients;
            temp["consultant"] = schedule.single[time][0].consultant;
            temp["location"] = cubicle;
            result.push(temp);
            schedule.single[time].splice(0, 1);
        } else {
            delete schedule.single[time];
        }
    }
    var action1 = function(time, cNum) {
        var Gslots = ["G1", "G2", "G3", "G4"];
        var cubicle = cNum < 4 ? Gslots[cNum] : "N/A";
        if (schedule.group[time].length != 0) {
            var temp = {};
            temp["time"] = time;
            temp["course"] = schedule.group[time][0].course;
            var clients = "";
            schedule.group[time][0].clients.forEach(function(element) {
                clients += element;
                clients += ", ";
            });
            temp["clients"] = clients;
            temp["consultant"] = schedule.group[time][0].consultant;
            temp["location"] = cubicle;
            result.push(temp);
            schedule.group[time].splice(0, 1);
        } else {
            delete schedule.group[time];
        }

    }
    var action2 = function(time, cNum) {
        var Gslots = ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10", "G11"];
        var cubicle = cNum < 11 ? Gslots[cNum] : "N/A";
        if (schedule.group[time].length != 0) {
            var temp = {};
            temp["time"] = time;
            temp["course"] = schedule.group[time][0].course;
            var clients = "";
            schedule.group[time][0].clients.forEach(function(element) {
                clients += element;
                clients += ", ";
            });
            temp["clients"] = clients;
            temp["consultant"] = schedule.group[time][0].consultant;
            temp["location"] = cubicle;
            result.push(temp);
            schedule.group[time].splice(0, 1);
        } else {
            delete schedule.group[time];
        }
    }
    var mapping = {
        "8"  : action1,  
        "9"  : action1, 
        "10" : action1,
        "11" : action1,  
        "12" : action1, 
        "1"  : action1, 
        "2"  : action1, 
        "3"  : action1, 
        "4"  : action1,
        "5"  : action2, 
        "6"  : action2, 
        "7"  : action2
    };
    var single = 0;
    while (Object.keys(schedule.single).length !== 0) {      
        var lastTime = {val: 0};
        for (var k1 in schedule.single) {
            var curTime = k1.split(":")[0];
            if (lastTime.val != curTime) {
                actionS(k1, single);
                lastTime.val = curTime;
            }
        }
        ++single;
    } 
    var group = 0;
    while (Object.keys(schedule.group).length !== 0) {
        var group = 0;
        var lastTime = {val: 0};
        for (var k1 in schedule.group) {
            var curTime = k1.split(":")[0];
            if (lastTime.val != curTime) {
                mapping[curTime](k1, group);
                lastTime.val = curTime;
            }
        }
        ++group;
    }
    return result;
}

var finalSchedule = function(schedule) {
    var result = [];
    var action1 = function(time) {
        var Gslots = ["G1", "G2", "G3", "G4"];
        var Sslots = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

        schedule[time].forEach(function(e) {
            var temp = {};
            temp["time"] = time;
            var clients = "";
            e.clients.forEach(function(element) {
                clients += element;
                clients += ", ";
            });
            temp["clients"] = clients;
            temp["consultant"] = e.consultant;
            var location;
            if (e.group === "yes") {
                location = Gslots.shift();
            } else {
                location = Sslots.shift();
            }
            if (location) {
                temp["location"] = location;
            } else {
                temp["location"] = "N/A";
            }
            temp["course"] = e.course;
            result.push(temp);
        });

    };
    var action2 = function(time) {

        var Gslots = ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10", "G11"];
        var Sslots = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];
        
        schedule[time].forEach(function(e) {
            var temp = {};
            temp["time"] = time;
            var clients = "";
            e.clients.forEach(function(element) {
                clients += element;
                clients += ", ";
            });
            temp["clients"] = clients;
            temp["consultant"] = e.consultant;
            var location;
            if (e.group === "yes") {
                location = Gslots.shift();
            } else {
                location = Sslots.shift();
            }
            if (location) {
                temp["location"] = location;
            } else {
                temp["location"] = "N/A";
            }
            temp["course"] = e.course;
            result.push(temp);
        });
    };

    var mapping = {
        "8"  : action1,  
        "9"  : action1, 
        "10" : action1,
        "11" : action1,  
        "12" : action1, 
        "1"  : action1, 
        "2"  : action1, 
        "3"  : action1, 
        "4"  : action1,
        "5"  : action2, 
        "6"  : action2, 
        "7"  : action2
    };
    for (var k1 in schedule) {
        mapping[k1.split(":")[0]](k1);
    }
    return result;
}

var getDate = function(rawDate) {
    var temp = rawDate.split('/');
    return temp[0] + '-' + temp[1] + '-' + temp[2];
}

fs.readFile('server/plugins/reportGenerator/input/input.html', {"encoding" : "utf8" }, function(err, data) {
    if (err) throw err;
    jsdom.env({
        html: data,
        scripts: ["http://code.jquery.com/jquery.js"],
        done: function (errors, window) {
            var $ = window.$;
            var myTableArray = [];
            $("table.reportListing tbody tr").each(function() {
                var arrayOfThisRow = [];
                var tableData = $(this).find('td');
                if (tableData.length > 0) {
                    tableData.each(function() { arrayOfThisRow.push($(this).text()); });
                    myTableArray.push(arrayOfThisRow);
                }
            });
            // get rid of the first element
            myTableArray.splice(0, 1);
            myTableArray = filterCanceled(myTableArray);
            /*var schedule = rawSchedule(myTableArray);
            schedule = finalSchedule(schedule);*/
            var schedule = intermediateSchedule(rawSchedule(myTableArray), rawSchedule(myTableArray));
            schedule = finalSchedule2(schedule);

            var date = getDate(myTableArray[0][0]);
            console.log(date);
            csvPrint(schedule, date);
        }
    });
});
