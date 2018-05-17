$(function() {
    var dateObj = (function() {
        var _date = new Date();
        return {
            getDate: function() {
                return _date;
            },
            setDate: function(date) {
                _date = date;
            }
        };
    })();

    //2 function run
    renderHtml();
    bindEvent();

    //a function using create html element 
    function renderHtml() {
        var calendar = document.getElementById("calendar");
        var titleBox = document.createElement("div"); //You can set last month or next month or title by click this
        var bodyBox = document.createElement("div"); //Data show

        titleBox.className = 'calendar-title-box';
        titleBox.innerHTML = "<span class = 'prev-month' id = 'prevMonth'></span>" +
            "<span class = 'calendar-title' id = 'calendarTitle'></span>" +
            "<span id = 'nextMonth' class = 'next-month'></span>";

        calendar.appendChild(titleBox);

        bodyBox.className = 'calendar-body-box';
        var _headHtml = "<dl class = 'seminar_week'>" +
            "<dt class = 'semi_sun'>日</dt>" +
            "<dt class = 'semi_mon'>月</dt>" +
            "<dt class = 'semi_tue'>火</dt>" +
            "<dt class = 'semi_wed'>水</dt>" +
            "<dt class = 'semi_thu'>木</dt>" +
            "<dt class = 'semi_fri'>金</dt>" +
            "<dt class = 'semi_sat'>土</dt>" +
            "</dl>";

        var _bodyHtml = "<div>";
        for (var i = 0; i < 6; i++) {
            _bodyHtml += "<ul class = 'seminar_days'>" +
                "<li></li>" +
                "<li></li>" +
                "<li></li>" +
                "<li></li>" +
                "<li></li>" +
                "<li></li>" +
                "<li></li>" +
                "</ul>";

        }


        bodyBox.innerHTML = "<div id = 'calendarTable' class = 'calendar-table'>" +
            _headHtml + _bodyHtml +
            "</div></div><div class='status-mark'></div>"

        calendar.appendChild(bodyBox);
    }

    //main function to show seminar data
    function showCalendarData(idInfo, dateInfo, semiInfo, statusInfo, placeInfo, classInfo, nameInfo, placeDateInfo) {
        var _year = dateObj.getDate().getFullYear();
        var _month = dateObj.getDate().getMonth() + 1;
        var _dateStr = getDateStr(dateObj.getDate());
        var _dateInfo = dateInfo;
        var _semiInfo = semiInfo;
        var _statusInfo = statusInfo; //displayCheck
        var _placeInfo = placeInfo;
        var _classInfo = classInfo;
        var _idInfo = idInfo;
        var _nameInfo = nameInfo;
        var _placeDateInfo = placeDateInfo;
        var _currentMonth = new Date().getMonth() + 1;
        var _currentYear = new Date().getFullYear();
        //var _imgInfo = imgInfo;
        var _dayNum = new Date(_year, _month, 0).getDate();
        var _dayMon = _month;
        var _bodyCol = $(".seminar_days");
        var _prevMonth = $("#prevMonth");
        var _nextMonth = $("#nextMonth");
        var _statusMark = $(".status-mark");
        //change to string
        for (var i = 0; i < _dateInfo.length; i++) {
            _dateInfo[i] = getDateStr(_dateInfo[i]);
        }
        //Setting the title area.
        var calendarTitle = document.getElementById("calendarTitle");
        var titleStr = _dateStr.substr(0, 4) + "年" + _dateStr.substr(4, 2) + "月";
        calendarTitle.innerText = titleStr;
        //Setting the table area.
        var _table = document.getElementById("calendarTable");
        _tds = _table.getElementsByTagName("li");
        var _firstDay = new Date(_year, _month - 1, 1);

        //show day in calendar
        for (var i = 0; i < _tds.length; i++) {
            var _thisDay = new Date(_year, _month - 1, i + 1 - _firstDay.getDay());
            var _thisDayStr = getDateStr(_thisDay);
            var idx = _dateInfo.indexOf(_thisDayStr);
            _tds[i].innerHTML = '<dl><dt>' + _thisDay.getDate() + '</dt></dl>';
            if (_thisDayStr.substr(4, 2) == _dayMon && _thisDayStr.substr(6, 2) == _dayNum && (_tds.length - i - 1) >= 7) {
                _bodyCol[5].remove();
            }
            //judge which data should be showed
            while (idx != -1) {
                if (_statusInfo[idx] !== 1) {
                    switch (_placeInfo[idx]) {
                        case "東京":
                            if (_classInfo[idx] == 3) {
                                if (_thisDayStr < getDateStr(new Date())) {
                                    /*if (_imgInfo[idx] !== null) {
                                        _tds[i].innerHTML += '<img src="' + _imgInfo[idx] + '"' + 'width=130px' + 'height=50px' + '/>';
                                    } else {

                                    }*/
                                    _tds[i].innerHTML += '<div class="type_large"><span class="type_large_mark">' + '締切' + '</span><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + '大型' + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a class="big_semi_color" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                    break;
                                } else {
                                    if (_statusInfo[idx] == 2 || _statusInfo[idx] == 3 || _statusInfo[idx] == 4) {
                                        _tds[i].innerHTML += '<div class="type_large"><span class="type_large_mark">' + '受付終了' + '</span><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + '大型' + '</span>' + ' ' + '<a class="big_semi_color" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                        break;
                                    } else {
                                        _tds[i].innerHTML += '<div class="type_large"><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + '大型' + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a class="big_semi_color" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                        break;
                                    }
                                }
                            } else {
                                if (_thisDayStr < getDateStr(new Date())) {
                                    _tds[i].innerHTML += '<div class="type_area"><span class="type_large_mark">' + '締切' + '</span><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a style="text-decoration:none" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                    break;
                                } else {
                                    if (_statusInfo[idx] == 2 || _statusInfo[idx] == 3 || _statusInfo[idx] == 4) {
                                        _tds[i].innerHTML += '<div class="type_area"><span class="type_large_mark">' + '受付終了' + '</span><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a style="text-decoration:none" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                        break;
                                    } else {
                                        _tds[i].innerHTML += '<div class="type_area"><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a style="text-decoration:none" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                        break;
                                    }
                                }
                            }
                        case "大阪":
                            if (_classInfo[idx] == 3) {
                                if (_thisDayStr < getDateStr(new Date())) {
                                    _tds[i].innerHTML += '<div class="type_large"><span class="type_large_mark">' + '締切' + '</span><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + '大型' + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a class="big_semi_color" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                    break;
                                } else {
                                    if (_statusInfo[idx] == 2 || _statusInfo[idx] == 3 || _statusInfo[idx] == 4) {
                                        _tds[i].innerHTML += '<div class="type_large"><span class="type_large_mark">' + '受付終了' + '</span><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + '大型' + '</span>' + ' ' + '<a class="big_semi_color" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                        break;
                                    } else {
                                        _tds[i].innerHTML += '<div class="type_large"><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + '大型' + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a class="big_semi_color" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                        break;
                                    }
                                }
                            } else {
                                if (_thisDayStr < getDateStr(new Date())) {
                                    _tds[i].innerHTML += '<div class="type_area"><span class="type_large_mark">' + '締切' + '</span><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a style="text-decoration:none" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                    break;
                                } else {
                                    if (_statusInfo[idx] == 2 || _statusInfo[idx] == 3 || _statusInfo[idx] == 4) {
                                        _tds[i].innerHTML += '<div class="type_area"><span class="type_large_mark">' + '受付終了' + '</span><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a style="text-decoration:none" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                        break;
                                    } else {
                                        _tds[i].innerHTML += '<div class="type_area"><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a style="text-decoration:none" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                        break;
                                    }
                                }
                            }
                        case "金沢":
                            if (_classInfo[idx] == 3) {
                                if (_thisDayStr < getDateStr(new Date())) {
                                    _tds[i].innerHTML += '<div class="type_large"><span class="type_large_mark">' + '締切' + '</span><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + '大型' + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a class="big_semi_color" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                    break;
                                } else {
                                    if (_statusInfo[idx] == 2 || _statusInfo[idx] == 3 || _statusInfo[idx] == 4) {
                                        _tds[i].innerHTML += '<div class="type_large"><span class="type_large_mark">' + '受付終了' + '</span><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + '大型' + '</span>' + ' ' + '<a class="big_semi_color" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                        break;
                                    } else {
                                        _tds[i].innerHTML += '<div class="type_large"><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + '大型' + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a class="big_semi_color" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                        break;
                                    }
                                }
                            } else {
                                if (_thisDayStr < getDateStr(new Date())) {
                                    _tds[i].innerHTML += '<div class="type_area"><span class="type_large_mark">' + '締切' + '</span><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a style="text-decoration:none" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                    break;
                                } else {
                                    if (_statusInfo[idx] == 2 || _statusInfo[idx] == 3 || _statusInfo[idx] == 4) {
                                        _tds[i].innerHTML += '<div class="type_area"><span class="type_large_mark">' + '受付終了' + '</span><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a style="text-decoration:none" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                        break;
                                    } else {
                                        _tds[i].innerHTML += '<div class="type_area"><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a style="text-decoration:none" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                        break;
                                    }
                                }
                            }
                        case "熊本":
                            if (_classInfo[idx] == 3) {
                                if (_thisDayStr < getDateStr(new Date())) {
                                    _tds[i].innerHTML += '<div class="type_large"><span class="type_large_mark">' + '締切' + '</span><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + '大型' + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a class="big_semi_color" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                    break;
                                } else {
                                    if (_statusInfo[idx] == 2 || _statusInfo[idx] == 3 || _statusInfo[idx] == 4) {
                                        _tds[i].innerHTML += '<div class="type_large"><span class="type_large_mark">' + '受付終了' + '</span><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + '大型' + '</span>' + ' ' + '<a class="big_semi_color" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                        break;
                                    } else {
                                        _tds[i].innerHTML += '<div class="type_large"><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + '大型' + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a class="big_semi_color" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                        break;
                                    }
                                }
                            } else {
                                if (_thisDayStr < getDateStr(new Date())) {
                                    _tds[i].innerHTML += '<div class="type_area"><span class="type_large_mark">' + '締切' + '</span><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a style="text-decoration:none" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                    break;
                                } else {
                                    if (_statusInfo[idx] == 2 || _statusInfo[idx] == 3 || _statusInfo[idx] == 4) {
                                        _tds[i].innerHTML += '<div class="type_area"><span class="type_large_mark">' + '受付終了' + '</span><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a style="text-decoration:none" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                        break;
                                    } else {
                                        _tds[i].innerHTML += '<div class="type_area"><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a style="text-decoration:none" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                        break;
                                    }
                                }
                            }
                        case "松本":
                            if (_classInfo[idx] == 3) {
                                if (_thisDayStr < getDateStr(new Date())) {
                                    _tds[i].innerHTML += '<div class="type_large"><span class="type_large_mark">' + '締切' + '</span><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + '大型' + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a class="big_semi_color" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                    break;
                                } else {
                                    if (_statusInfo[idx] == 2 || _statusInfo[idx] == 3 || _statusInfo[idx] == 4) {
                                        _tds[i].innerHTML += '<div class="type_large"><span class="type_large_mark">' + '受付終了' + '</span><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + '大型' + '</span>' + ' ' + '<a class="big_semi_color" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                        break;
                                    } else {
                                        _tds[i].innerHTML += '<div class="type_large"><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + '大型' + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a class="big_semi_color" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                        break;
                                    }
                                }
                            } else {
                                if (_thisDayStr < getDateStr(new Date())) {
                                    _tds[i].innerHTML += '<div class="type_area"><span class="type_large_mark">' + '締切' + '</span><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a style="text-decoration:none" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                    break;
                                } else {
                                    if (_statusInfo[idx] == 2 || _statusInfo[idx] == 3 || _statusInfo[idx] == 4) {
                                        _tds[i].innerHTML += '<div class="type_area"><span class="type_large_mark">' + '受付終了' + '</span><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a style="text-decoration:none" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                        break;
                                    } else {
                                        _tds[i].innerHTML += '<div class="type_area"><span class="type_large_mark">' + _placeInfo[idx] + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span>' + ' ' + '<a style="text-decoration:none" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx] + '</a></div>';
                                        break;
                                    }
                                }
                            }
                        case "WEBセミナー":
                            if (_thisDayStr < getDateStr(new Date())) {
                                _tds[i].innerHTML += '<div class="type_web"><span class="type_large_mark">' + '締切' + '</span><span class="type_large_mark">' + _semiInfo[idx].substr(0, 9) + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span><a style="text-decoration:none" href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx].substr(9) + '</a></div>';
                                break;
                            } else {
                                _tds[i].innerHTML += '<div class="type_web"><span class="type_large_mark">' + _semiInfo[idx].substr(0, 9) + '</span><span class="type_large_mark">' + _placeDateInfo[idx].substr(15) + '</span><a href="/seminar/detail/' + _idInfo[idx] + '">' + _semiInfo[idx].substr(9) + '</a></div>';
                                break;

                            }
                    }
                    idx = _dateInfo.indexOf(_thisDayStr, idx + 1);
                } else {
                    idx = _dateInfo.indexOf(_thisDayStr, idx + 1);
                }
            }

            //give a style to the day
            if (_thisDayStr == getDateStr(new Date())) {
                _tds[i].className = 'semi_today';
            } else if (_thisDayStr < getDateStr(new Date())) {
                _tds[i].className = 'past_day';
            } else {
                _tds[i].className = '';
            }
        }

        if (_year < _currentYear) {
            _statusMark.html("<div class='nodata_msg sp'>お申込できるセミナーはございません</div>");
        } else if (_month < _currentMonth) {
            _statusMark.html("<div class='nodata_msg sp'>お申込できるセミナーはございません</div>");
        } else {
            _statusMark.html("");
        }

        if (_year < _currentYear) {
            _nextMonth.show();
        } else if (_month - _currentMonth >= 2) {
            _nextMonth.hide();
        } else {
            _nextMonth.show();
        }

        if (_year < 2015) {
            _prevMonth.hide();
        } else if (_year == 2015 && _month <= 4) {
            _prevMonth.hide();
        } else {
            _prevMonth.show();
        }
    }

    //bind event to the arrow
    function bindEvent() {
        var prevMonth = document.getElementById("prevMonth");
        var nextMonth = document.getElementById("nextMonth");
        var _month = dateObj.getDate().getMonth() + 1;
        var _currentMonth = new Date().getMonth() + 1;
        addEvent(prevMonth, 'click', toPrevMonth);
        addEvent(nextMonth, 'click', toNextMonth);
    }

    function addEvent(element, event, func) {
        if (element.addEventListener) {
            element.addEventListener(event, function(e) {
                func(e);
            });
        } else if (element.attachEvent) {
            element.attachEvent('on' + event, function(e) {
                func(e);
            });
        } else {
            element['on' + event] = function(e) {
                func(e);
            }
        }
    }

    function toPrevMonth() {
        var date = dateObj.getDate();
        dateObj.setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
        if (subMenu1.hasClass("status")) {
            if (subMenu10.hasClass("status")) {
                ajaxSetup(placeTokyo);
            } else if (subMenu11.hasClass("status")) {
                ajaxSetup(placeKanazawa);
            } else if (subMenu12.hasClass("status")) {
                ajaxSetup(placeMatsumoto);
            } else if (subMenu13.hasClass("status")) {
                ajaxSetup(placeOsaka);
            } else if (subMenu14.hasClass("status")) {
                ajaxSetup(placeKumamoto);
            } else if (subMenu7.hasClass("big-status")) {
                ajaxSetupForBigSemi(arrayGet);
            } else {
                if (subMenu9.hasClass("web-status")) {
                    ajaxSetup(arrayWeb);
                } else {
                    ajaxSetup(arrayGet);
                }
            }
        } else if (subMenu2.hasClass("status")) {
            if (subMenu10.hasClass("status")) {
                ajaxSetup(placeTokyo);
            } else if (subMenu11.hasClass("status")) {
                ajaxSetup(placeKanazawa);
            } else if (subMenu12.hasClass("status")) {
                ajaxSetup(placeMatsumoto);
            } else if (subMenu13.hasClass("status")) {
                ajaxSetup(placeOsaka);
            } else if (subMenu14.hasClass("status")) {
                ajaxSetup(placeKumamoto);
            } else if (subMenu7.hasClass("big-status")) {
                ajaxSetupForBigSemi(arrayEast);
            } else {
                if (subMenu9.hasClass("web-status")) {
                    ajaxSetup(arrayWeb);
                } else {
                    ajaxSetup(arrayEast);
                }
            }
        } else if (subMenu3.hasClass("status")) {
            if (subMenu10.hasClass("status")) {
                ajaxSetup(placeTokyo);
            } else if (subMenu11.hasClass("status")) {
                ajaxSetup(placeKanazawa);
            } else if (subMenu12.hasClass("status")) {
                ajaxSetup(placeMatsumoto);
            } else if (subMenu13.hasClass("status")) {
                ajaxSetup(placeOsaka);
            } else if (subMenu14.hasClass("status")) {
                ajaxSetup(placeKumamoto);
            } else if (subMenu7.hasClass("big-status")) {
                ajaxSetupForBigSemi(arrayWest);
            } else {
                if (subMenu9.hasClass("web-status")) {
                    ajaxSetup(arrayWeb);
                } else {
                    ajaxSetup(arrayWest);
                }
            }
        } else if (subMenu4.hasClass("status")) {
            if (subMenu10.hasClass("status")) {
                ajaxSetup(placeTokyo);
            } else if (subMenu11.hasClass("status")) {
                ajaxSetup(placeKanazawa);
            } else if (subMenu12.hasClass("status")) {
                ajaxSetup(placeMatsumoto);
            } else if (subMenu13.hasClass("status")) {
                ajaxSetup(placeOsaka);
            } else if (subMenu14.hasClass("status")) {
                ajaxSetup(placeKumamoto);
            } else if (subMenu7.hasClass("big-status")) {
                ajaxSetupForBigSemi(arrayMiddle);
            } else {
                if (subMenu9.hasClass("web-status")) {
                    ajaxSetup(arrayWeb);
                } else {
                    ajaxSetup(arrayMiddle);
                }
            }
        } else if (subMenu5.hasClass("status")) {
            if (subMenu10.hasClass("status")) {
                ajaxSetup(placeTokyo);
            } else if (subMenu11.hasClass("status")) {
                ajaxSetup(placeKanazawa);
            } else if (subMenu12.hasClass("status")) {
                ajaxSetup(placeMatsumoto);
            } else if (subMenu13.hasClass("status")) {
                ajaxSetup(placeOsaka);
            } else if (subMenu14.hasClass("status")) {
                ajaxSetup(placeKumamoto);
            } else if (subMenu7.hasClass("big-status")) {
                ajaxSetupForBigSemi(arrayKyushu);
            } else {
                if (subMenu9.hasClass("web-status")) {
                    ajaxSetup(arrayWeb);
                } else {
                    ajaxSetup(arrayKyushu);
                }
            }
        } else if (subMenu9.hasClass("status")) {
            if (subMenu10.hasClass("status")) {
                ajaxSetup(placeTokyo);
            } else if (subMenu11.hasClass("status")) {
                ajaxSetup(placeKanazawa);
            } else if (subMenu12.hasClass("status")) {
                ajaxSetup(placeMatsumoto);
            } else if (subMenu13.hasClass("status")) {
                ajaxSetup(placeOsaka);
            } else if (subMenu14.hasClass("status")) {
                ajaxSetup(placeKumamoto);
            } else {
                ajaxSetup(arrayWeb);
            }
        }
    }

    function toNextMonth() {
        var date = dateObj.getDate();
        dateObj.setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
        if (subMenu1.hasClass("status")) {
            if (subMenu10.hasClass("status")) {
                ajaxSetup(placeTokyo);
            } else if (subMenu11.hasClass("status")) {
                ajaxSetup(placeKanazawa);
            } else if (subMenu12.hasClass("status")) {
                ajaxSetup(placeMatsumoto);
            } else if (subMenu13.hasClass("status")) {
                ajaxSetup(placeOsaka);
            } else if (subMenu14.hasClass("status")) {
                ajaxSetup(placeKumamoto);
            } else if (subMenu7.hasClass("big-status")) {
                ajaxSetupForBigSemi(arrayGet);
            } else {
                if (subMenu9.hasClass("web-status")) {
                    ajaxSetup(arrayWeb);
                } else {
                    ajaxSetup(arrayGet);
                }
            }
        } else if (subMenu2.hasClass("status")) {
            if (subMenu10.hasClass("status")) {
                ajaxSetup(placeTokyo);
            } else if (subMenu11.hasClass("status")) {
                ajaxSetup(placeKanazawa);
            } else if (subMenu12.hasClass("status")) {
                ajaxSetup(placeMatsumoto);
            } else if (subMenu13.hasClass("status")) {
                ajaxSetup(placeOsaka);
            } else if (subMenu14.hasClass("status")) {
                ajaxSetup(placeKumamoto);
            } else if (subMenu7.hasClass("big-status")) {
                ajaxSetupForBigSemi(arrayEast);
            } else {
                if (subMenu9.hasClass("web-status")) {
                    ajaxSetup(arrayWeb);
                } else {
                    ajaxSetup(arrayEast);
                }
            }
        } else if (subMenu3.hasClass("status")) {
            if (subMenu10.hasClass("status")) {
                ajaxSetup(placeTokyo);
            } else if (subMenu11.hasClass("status")) {
                ajaxSetup(placeKanazawa);
            } else if (subMenu12.hasClass("status")) {
                ajaxSetup(placeMatsumoto);
            } else if (subMenu13.hasClass("status")) {
                ajaxSetup(placeOsaka);
            } else if (subMenu14.hasClass("status")) {
                ajaxSetup(placeKumamoto);
            } else if (subMenu7.hasClass("big-status")) {
                ajaxSetupForBigSemi(arrayWest);
            } else {
                if (subMenu9.hasClass("web-status")) {
                    ajaxSetup(arrayWeb);
                } else {
                    ajaxSetup(arrayWest);
                }
            }
        } else if (subMenu4.hasClass("status")) {
            if (subMenu10.hasClass("status")) {
                ajaxSetup(placeTokyo);
            } else if (subMenu11.hasClass("status")) {
                ajaxSetup(placeKanazawa);
            } else if (subMenu12.hasClass("status")) {
                ajaxSetup(placeMatsumoto);
            } else if (subMenu13.hasClass("status")) {
                ajaxSetup(placeOsaka);
            } else if (subMenu14.hasClass("status")) {
                ajaxSetup(placeKumamoto);
            } else if (subMenu7.hasClass("big-status")) {
                ajaxSetupForBigSemi(arrayMiddle);
            } else {
                if (subMenu9.hasClass("web-status")) {
                    ajaxSetup(arrayWeb);
                } else {
                    ajaxSetup(arrayMiddle);
                }
            }
        } else if (subMenu5.hasClass("status")) {
            if (subMenu10.hasClass("status")) {
                ajaxSetup(placeTokyo);
            } else if (subMenu11.hasClass("status")) {
                ajaxSetup(placeKanazawa);
            } else if (subMenu12.hasClass("status")) {
                ajaxSetup(placeMatsumoto);
            } else if (subMenu13.hasClass("status")) {
                ajaxSetup(placeOsaka);
            } else if (subMenu14.hasClass("status")) {
                ajaxSetup(placeKumamoto);
            } else if (subMenu7.hasClass("big-status")) {
                ajaxSetupForBigSemi(arrayKyushu);
            } else {
                if (subMenu9.hasClass("web-status")) {
                    ajaxSetup(arrayWeb);
                } else {
                    ajaxSetup(arrayKyushu);
                }
            }
        } else if (subMenu9.hasClass("status")) {
            if (subMenu10.hasClass("status")) {
                ajaxSetup(placeTokyo);
            } else if (subMenu11.hasClass("status")) {
                ajaxSetup(placeKanazawa);
            } else if (subMenu12.hasClass("status")) {
                ajaxSetup(placeMatsumoto);
            } else if (subMenu13.hasClass("status")) {
                ajaxSetup(placeOsaka);
            } else if (subMenu14.hasClass("status")) {
                ajaxSetup(placeKumamoto);
            } else {
                ajaxSetup(arrayWeb);
            }
        }
    }

    function getDateStr(date) {
        var _year = date.getFullYear();
        var _month = date.getMonth() + 1;
        var _d = date.getDate();

        _month = (_month > 9) ? ("" + _month) : ("0" + _month);
        _d = (_d > 9) ? ("" + _d) : ("0" + _d);
        return _year + _month + _d;
    }
    //ajax function
    function ajaxSetup(array) {
        $.ajax({
            url: "/show",
            type: "GET",
            beforeSend: function(xmlHttp) {
                xmlHttp.setRequestHeader("If-Modified-Since", "0");
                xmlHttp.setRequestHeader("Cache-Control", "no-cache");
            },
            data: {},
            dataType: "json",
            success: function(data) {
                var dateStr = new Array; //for date data
                var semiStr = new Array; //for seminar name data
                var statusStr = new Array; //for judge whether show data or not
                var placeStr = new Array; //for seminar place
                var classStr = new Array; //for semianr type
                var idStr = new Array;
                var nameStr = new Array;
                var placeDateStr = new Array;
                //var imgStr = new Array;
                if (data.success == true) {
                    for (var i = 0; i < data.dateInfo.length; i++) {
                        array.forEach(function(element) {
                            if (data.placeInfo[i] == element) {
                                switch (element) {
                                    case "東京":
                                        placeStr[i] = data.placeInfo[i];
                                        break;
                                    case "大阪":
                                        placeStr[i] = data.placeInfo[i];
                                        break;
                                    case "金沢":
                                        placeStr[i] = data.placeInfo[i];
                                        break;
                                    case "熊本":
                                        placeStr[i] = data.placeInfo[i];
                                        break;
                                    case "松本":
                                        placeStr[i] = data.placeInfo[i];
                                        break;
                                }
                            }
                        });
                        dateStr[i] = new Date(Date.parse(data.dateInfo[i]));
                        semiStr[i] = data.semiInfo[i];
                        statusStr[i] = data.statusInfo[i];
                        classStr[i] = data.classInfo[i];
                        if (classStr[i] == 2) {
                            placeStr[i] = "WEBセミナー";
                        }
                        idStr[i] = data.idInfo[i];
                        nameStr[i] = data.nameInfo[i];
                        placeDateStr[i] = data.placeDateInfo[i];
                        //imgStr[i] = data.imgInfo[i];
                    }
                    showCalendarData(idStr, dateStr, semiStr, statusStr, placeStr, classStr, nameStr, placeDateStr);
                }
            }
        })
    }

    function ajaxSetupForBigSemi(array) {
        $.ajax({
            url: "/show",
            type: "GET",
            data: {},
            beforeSend: function(xmlHttp) {
                xmlHttp.setRequestHeader("If-Modified-Since", "0");
                xmlHttp.setRequestHeader("Cache-Control", "no-cache");
            },
            dataType: "json",
            success: function(data) {
                var dateStr = new Array;
                var semiStr = new Array;
                var statusStr = new Array;
                var placeStr = new Array;
                var classStr = new Array;
                var idStr = new Array;
                var nameStr = new Array;
                var placeDateStr = new Array;
                //var imgStr = new Array;
                if (data.success == true) {
                    for (var i = 0; i < data.dateInfo.length; i++) {
                        array.forEach(function(element) {
                            if (data.placeInfo[i] == element && data.classInfo[i] == 3) {
                                switch (element) {
                                    case "東京":
                                        placeStr[i] = data.placeInfo[i];
                                        break;
                                    case "大阪":
                                        placeStr[i] = data.placeInfo[i];
                                        break;
                                    case "金沢":
                                        placeStr[i] = data.placeInfo[i];
                                        break;
                                    case "熊本":
                                        placeStr[i] = data.placeInfo[i];
                                        break;
                                    case "松本":
                                        placeStr[i] = data.placeInfo[i];
                                        break;
                                }
                            }
                        });
                        dateStr[i] = new Date(Date.parse(data.dateInfo[i]));
                        semiStr[i] = data.semiInfo[i];
                        statusStr[i] = data.statusInfo[i];
                        classStr[i] = data.classInfo[i];
                        idStr[i] = data.idInfo[i];
                        nameStr[i] = data.nameInfo[i];
                        placeDateStr[i] = data.placeDateInfo[i];
                        //imgStr[i] = data.imgInfo[i];
                    }
                    showCalendarData(idStr, dateStr, semiStr, statusStr, placeStr, classStr, nameStr, placeDateStr);
                }
            }
        })
    }

    var subSemi = $("#subseminar ul");
    var subSeMu = $("#subseminar li");
    var subStatus = $("#plcae li");
    var subMenu1 = $("#get");
    var subMenu2 = $("#east");
    var subMenu3 = $("#west");
    var subMenu4 = $("#middle");
    var subMenu5 = $("#kyushu");
    var subMenu6 = $("#getall");
    var subMenu7 = $("#outside");
    var subMenu8 = $("#inside");
    var subMenu9 = $("#web");
    var subMenu10 = $("#mg");
    var subMenu11 = $("#kanazawa");
    var subMenu12 = $("#mastumoto");
    var subMenu13 = $("#osaka");
    var subMenu14 = $("#kumamoto");
    var arrayGet = ["東京", "大阪", "金沢", "熊本", "松本"];
    var arrayEast = ["東京"];
    var arrayWest = ["大阪"];
    var arrayMiddle = ["金沢", "松本"];
    var arrayKyushu = ["熊本"];
    var placeTokyo = ["東京"];
    var placeOsaka = ["大阪"];
    var placeKanazawa = ["金沢"];
    var placeKumamoto = ["熊本"];
    var placeMatsumoto = ["松本"];
    var arrayWeb = ["WEBセミナー"];
    //全国
    subMenu1.on("click", function() {
        subSemi.hide();
        subSeMu.removeClass("status");
        subMenu1.removeClass("semiBlack");
        subMenu9.removeClass("web-status");
        subMenu7.removeClass("big-status");
        subMenu7.removeClass("semiMenu");
        subMenu8.removeClass("semiMenu");
        subMenu9.removeClass("semiMenu");
        subMenu7.addClass("semiColor");
        subMenu8.addClass("semiColor");
        subMenu9.addClass("semiColor");
        subMenu10.addClass("semiBlack");
        subMenu11.addClass("semiBlack");
        subMenu12.addClass("semiBlack");
        subMenu13.addClass("semiBlack");
        subMenu14.addClass("semiBlack");
        ajaxSetup(arrayGet);
    });

    subMenu1.click();
    //関東
    subMenu2.on("click", function() {
        subSemi.hide();
        subSeMu.removeClass("status");
        subMenu2.removeClass("semiBlack");
        subMenu9.removeClass("web-status");
        subMenu7.removeClass("big-status");
        subMenu7.removeClass("semiMenu");
        subMenu8.removeClass("semiMenu");
        subMenu9.removeClass("semiMenu");
        subMenu7.addClass("semiColor");
        subMenu8.addClass("semiColor");
        subMenu9.addClass("semiColor");
        subMenu10.addClass("semiBlack");
        subMenu11.addClass("semiBlack");
        subMenu12.addClass("semiBlack");
        subMenu13.addClass("semiBlack");
        subMenu14.addClass("semiBlack");
        ajaxSetup(arrayEast);
    });
    //関西
    subMenu3.on("click", function() {
        subSemi.hide();
        subSeMu.removeClass("status");
        subMenu3.removeClass("semiBlack");
        subMenu9.removeClass("web-status");
        subMenu7.removeClass("big-status");
        subMenu7.removeClass("semiMenu");
        subMenu8.removeClass("semiMenu");
        subMenu9.removeClass("semiMenu");
        subMenu7.addClass("semiColor");
        subMenu8.addClass("semiColor");
        subMenu9.addClass("semiColor");
        subMenu10.addClass("semiBlack");
        subMenu11.addClass("semiBlack");
        subMenu12.addClass("semiBlack");
        subMenu13.addClass("semiBlack");
        subMenu14.addClass("semiBlack");
        ajaxSetup(arrayWest);
    });
    //中部
    subMenu4.on("click", function() {
        subSemi.hide();
        subSeMu.removeClass("status");
        subMenu4.removeClass("semiBlack");
        subMenu9.removeClass("web-status");
        subMenu7.removeClass("big-status");
        subMenu7.removeClass("semiMenu");
        subMenu8.removeClass("semiMenu");
        subMenu9.removeClass("semiMenu");
        subMenu7.addClass("semiColor");
        subMenu8.addClass("semiColor");
        subMenu9.addClass("semiColor");
        subMenu10.addClass("semiBlack");
        subMenu11.addClass("semiBlack");
        subMenu12.addClass("semiBlack");
        subMenu13.addClass("semiBlack");
        subMenu14.addClass("semiBlack");
        ajaxSetup(arrayMiddle);
    });
    //九州
    subMenu5.on("click", function() {
        subSemi.hide();
        subSeMu.removeClass("status");
        subMenu5.removeClass("semiBlack");
        subMenu9.removeClass("web-status");
        subMenu7.removeClass("big-status");
        subMenu7.removeClass("semiMenu");
        subMenu8.removeClass("semiMenu");
        subMenu9.removeClass("semiMenu");
        subMenu7.addClass("semiColor");
        subMenu8.addClass("semiColor");
        subMenu9.addClass("semiColor");
        subMenu10.addClass("semiBlack");
        subMenu11.addClass("semiBlack");
        subMenu12.addClass("semiBlack");
        subMenu13.addClass("semiBlack");
        subMenu14.addClass("semiBlack");
        ajaxSetup(arrayKyushu);
    });
    //すべて
    subMenu6.on("click", function() {
        subSemi.hide();
        subSeMu.removeClass("status");
        if (subMenu1.hasClass("semiMenu")) {
            ajaxSetup(arrayGet);
        } else if (subMenu2.hasClass("semiMenu")) {
            ajaxSetup(arrayEast);
        } else if (subMenu3.hasClass("semiMenu")) {
            ajaxSetup(arrayWest);
        } else if (subMenu4.hasClass("semiMenu")) {
            ajaxSetup(arrayMiddle);
        } else if (subMenu5.hasClass("semiMenu")) {
            ajaxSetup(arrayKyushu);
        }
    });
    //大型
    subMenu7.on("click", function() {
        subSemi.hide();
        subSeMu.removeClass("status");
        subMenu7.removeClass("semiBlack");
        if (subMenu1.hasClass("semiMenu")) {
            ajaxSetupForBigSemi(arrayGet);
            subMenu7.addClass("big-status");
        } else if (subMenu2.hasClass("semiMenu")) {
            ajaxSetupForBigSemi(arrayEast);
            subMenu7.addClass("big-status");
        } else if (subMenu3.hasClass("semiMenu")) {
            ajaxSetupForBigSemi(arrayWest);
            subMenu7.addClass("big-status");
        } else if (subMenu4.hasClass("semiMenu")) {
            ajaxSetupForBigSemi(arrayMiddle);
            subMenu7.addClass("big-status");
        } else if (subMenu5.hasClass("semiMenu")) {
            ajaxSetupForBigSemi(arrayKyushu);
            subMenu7.addClass("big-status");
        }
    });
    //支店
    subMenu8.on("click", function() {
        subMenu1.addClass("semiBlack");
        subMenu2.addClass("semiBlack");
        subMenu3.addClass("semiBlack");
        subMenu4.addClass("semiBlack");
        subMenu5.addClass("semiBlack");
        subMenu8.removeClass("semiBlack");
        subSemi.show();
    });
    //WEB
    subMenu9.on("click", function() {
        subSemi.hide();
        subMenu1.addClass("semiBlack");
        subMenu2.addClass("semiBlack");
        subMenu3.addClass("semiBlack");
        subMenu4.addClass("semiBlack");
        subMenu5.addClass("semiBlack");
        subSeMu.removeClass("status");
        subMenu1.addClass("semiBlack");
        subMenu9.addClass("web-status");
        subMenu9.removeClass("semiBlack");
        ajaxSetup(arrayWeb);
    });
    //東京分室
    subMenu10.on("click", function() {
        subMenu10.removeClass("semiBlack");
        ajaxSetup(placeTokyo);
    });
    //金沢支店
    subMenu11.on("click", function() {
        subMenu11.removeClass("semiBlack");
        ajaxSetup(placeKanazawa);
    });
    //松本支店
    subMenu12.on("click", function() {
        subMenu12.removeClass("semiBlack");
        ajaxSetup(placeMatsumoto);
    });
    //大阪支店
    subMenu13.on("click", function() {
        subMenu13.removeClass("semiBlack");
        ajaxSetup(placeOsaka);
    });
    //熊本支店
    subMenu14.on("click", function() {
        subMenu14.removeClass("semiBlack");
        ajaxSetup(placeKumamoto);
    });

    $(".calendar-position li").on("click", function() {
        $(this).addClass("semiMenu").siblings().removeClass("semiMenu");
        $(this).addClass("status").siblings().removeClass("status");
        $(this).addClass("big-status").siblings().removeClass("big-status");
        $(this).addClass("web-status").siblings().removeClass("web-status");
    })


});