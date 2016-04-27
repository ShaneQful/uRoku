function Application(UIContext) {
    this._uiContextClass = UIContext;
    this._initialized = false;
};
Application.prototype.init = function() {
    if (this._uiContextClass && !this._initialized) {
        this._initialized = true;
        var UI = new this._uiContextClass();
        UI.init();

        function networkCall(type, url, callback, errorcallback) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status === 200) {
                        callback(request.responseText);
                    } else {
                        errorcallback();
                    }
                }
            };
            request.open(type, url, true);
            request.send(null);
        }

        var remoteButtons = [
                    {
                        icon: "img/ic_arrow_back_black_24px.svg",
                        name: "Back"
                    },{
                        icon: "img/ic_keyboard_arrow_up_black_24px.svg",
                        name: "Up"
                    },{
                        icon: "img/ic_home_black_24px.svg",
                        name: "Home"
                    },{
                        icon: "img/ic_keyboard_arrow_left_black_24px.svg",
                        name: "Left"
                    },{
                        icon: null,
                        name: "Select"
                    },{
                        icon: "img/ic_keyboard_arrow_right_black_24px.svg",
                        name: "Right"
                    },{
                        icon: "img/ic_replay_black_24px.svg",
                        name: "InstantReplay"
                    },{
                        icon: "img/ic_keyboard_arrow_down_black_24px.svg",
                        name: "Down"
                    },{
                        icon: "img/ic_flare_black_24px.svg",
                        name: "Info"
                    },{
                        icon: "img/ic_fast_rewind_black_24px.svg",
                        name: "Rev"
                    },{
                        icon: "img/ic_play_arrow_black_24px.svg",
                        name: "Play"
                    },{
                        icon: "img/ic_fast_forward_black_24px.svg",
                        name: "Fwd"
                    },{
                        empty: true
                    },{
                        icon: "img/ic_keyboard_black_24px.svg",
                        name: "Keyboard"
                    },{
                        empty: true
                    }

                ];
        document.querySelector(".uroku-remote").innerHTML = remoteButtons.map(function (el) {
            var html = '<div class="uroku-remote-button-areas">'
            if (el.empty) {
                html += '<div class="uroku-remote-button-areas-blank"></div>';
            } else {
                html += '<button class="button" data-role="button" id="' + el.name +'">'
                html += (el.icon ? '<img title="' + el.name + '" src="' + el.icon + '"/>' : el.name) + '</button>';
            }
            html += '</div>';
            return html;
        }).join('');

        var ip = '192.168.1.65';

        remoteButtons.filter(function(el) { return !el.empty; }).map(function (el) { return el.name; }).forEach(function (id) {
            UI.button(id).click(function () {
                if (id !==  Keyboard) {
                    networkCall("POST", "http://" + ip + ":8060/keypress/" + id);
                } else {
                    //TODO: Dialog stuff
                }
            });
        });

        function getJSONResponse(response) {
            return response.split("</app>").filter(function (el) {
                return el.indexOf("id") !== -1;
            }).map(function (el) {
                return {
                    id: el.match(/id="\d+"/)[0].replace(/[^\d]*/g, ''),
                    name: el.match(/>\w(\s|\w)+/)[0].replace(">", "")
                };
            });
        }
        networkCall("GET", "http://" + ip + ":8060/query/apps", function (response) {
            var jsonResponse = getJSONResponse(response);
            var html = jsonResponse.map(function (el) {
                return '<li><aside><img width="50px;" src="http://' + ip + ':8060/query/icon/' + el.id +
                        '"/></aside><a href="#" style="padding-left:25px;">' + el.name + '</a></li>';
            }).join("");
            document.querySelector(".uroku-apps ul").innerHTML = html;
            document.querySelector(".uroku-apps progress").style.display = 'none';
            document.querySelector("#uroku-app-list").style.display = 'block';

            var list = document.querySelectorAll(".uroku-apps li");
            for (var i = 0; i < list.length; i += 1) {
                function attachEvent(el, idx) {
                    el.addEventListener('click', function () {
                        console.log("http://" + ip + ":8060/launch/" + jsonResponse[idx].id);
                        networkCall("POST", "http://" + ip + ":8060/launch/" + jsonResponse[idx].id);
                    });
                }
                attachEvent(list[i], i);
            }
        }, function (response) {
            alert("Sorry there appears to have been an issue contacting your roku!");
        });
    }
};
Application.prototype.initialized = function() {
    return this._initialized;
};

