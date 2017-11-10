// Prototype

// Format string utility
String.prototype.format = function () {
    var str = this;
    for (var i = 0; i < arguments.length; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        str = str.replace(reg, arguments[i]);
    }
    return str;
};

//end prototype

// Custom validator required
(function ($, kendo) {
    $.extend(true, kendo.ui.validator, {
        rules: {
            required: function (input) {

                if (!$(input).is("[required]")) {
                    return true;
                }

                var name = $(input).attr("name");
                var value = "";

                if ($(input).is("[type=text]") || $(input).is("textarea")) {
                    value = $(input).val();
                }
                else {
                    if ($(input).is("select")) {
                        value = $(input).find(":selected").attr('value');

                        if (value === null || value === undefined || value === "") {
                            if ($(input).parent().find(".selected-value").length > 0) {
                                value = "selected";
                            }
                        }
                    }
                    else
                        if ($(input).is("[type=checkbox]")) {
                            _.each($(input).closest("form").find("[name='" + name + "']"), function (item) {
                                if ($(item).is(":checked")) {
                                    value = "checked";
                                }
                            });
                        }
                        else {
                            if ($(input).is("[type=radio]")) {
                                _.each($(input).closest("form").find("[name='" + name + "']"), function (item) {
                                    if ($(item).is(":checked")) {
                                        value = "checked";
                                    }
                                });
                            }
                            else {
                                if ($(input).attr("data-role") === "dropdownlist") {
                                    if ($(input).parent().find(".k-input").length > 0) {

                                        var lable = $(input).attr("k-option-label");
                                        var textSelect = ($(input).parent().find(".k-input").text() + "").trim();

                                        if (textSelect !== "" && lable !== "'" + textSelect + "'" && lable !== textSelect) {
                                            value = "selected";
                                        }

                                    }
                                }
                            }
                        }
                }

                if (value === null || value === undefined) {
                    value = "";
                }

                value = value.replace(/\n/g, '');
                value = value.trim();

                if (value === "") {
                    return false;
                }
                return true;
            }
        }
    });
})($, kendo);

// Window resize
$(window).resize(function () {
    fixPositionActionBar();
    fixMaxHeightDialog();
});


// Change html
(function ($, oldHtmlMethod) {

    // Override the core html method in the jQuery object.
    $.fn.html = function () {

        // Execute the original HTML method using the
        fixIeClearTextBox();
        fixClickBody();
        fixProcessFlow();
        fixPositionActionBar();
        visibleButton();
        fixMaxHeightDialog();
        showHide();

        if ($('.menu-select').length > 0 && $('.menu-select').attr("data-event-click") !== "true") {
            $('.menu-select').attr("data-event-click", "true");
            $('.menu-select').kendoMenu({ closeOnClick: true });
        }
        // Augmented arguments collection.
        return oldHtmlMethod.apply(this, arguments);
    };

})(jQuery, jQuery.fn.html);

// Fixing IE clear textbox
var fixIeClearTextBox = function () {

    if ($('.input-search-form').length > 0 && $('.input-search-form').attr("data-event") !== "fix_ie_clear_textbox") {

        $('.input-search-form').attr("data-event", "fix_ie_clear_textbox");

        $(".input-search-form").bind("mouseup", function (e) {
            if (e.which === 8) {
                return;
            }
            var _this = this;
            var oldValue = $(_this).val();

            if (oldValue === "") return;

            // When this event is fired after clicking on the clear button
            // the value is not cleared yet. We have to wait for it.
            var myVar = setInterval(function () {
                if ($(_this).val() === "") {
                    var event = $.Event("keypress");
                    event.which = 13; // Enter
                    $(_this).trigger(event);
                    clearInterval(myVar);
                }
            }, 1);
        });
    }
};

//Close Item Menu
var fixClickBody = function () {
    if ($('#MainWrapper').attr("data-event-click") !== 'clickBody') {
        $('#MainWrapper').attr("data-event-click", "clickBody");
        $('#MainWrapper').click(function (e) {
            if (!$(e.target).is('.btn-grid-item-menu,.icon-btn-grid-item-menu')) {
                $('.grid-item-menu').hide();
            }
            if (!$(e.target).is('.bulk-edit,.ul-bulk-edit')) {
                $('.ul-bulk-edit').hide();
            }

            fixPositionActionBar();
        });
    }
};

//Caches a jQuery object containing the Process Flow element
var fixProcessFlow = function () {
    if ($('#MainPanel').attr("data-event-scroll") !== 'scrollMainPanel') {
        $('#MainPanel').attr("data-event-scroll", "scrollMainPanel");
        $('#MainPanel').on("scroll", function () {

            var flow = $('.process_flow');
            var flow_moc = $('.process_flow_moc');
            var scroll = $('#MainPanel').length < 1 ? 0 : $('#MainPanel').scrollTop();

            if (scroll >= $('.process_flow').data('offset')) {
                flow.removeClass('affix_top').addClass('affix');
            } else {
                flow.removeClass('affix').addClass('affix_top');
            }

            if (scroll >= $('.process_flow_moc').data('offset')) {
                flow_moc.removeClass('affix_top').addClass('affix_moc');
            } else {
                flow_moc.removeClass('affix_moc').addClass('affix_top');
            }
        });
    }
};

// Fix position action bar
var fixPositionActionBar = function () {

    if ($('.panel_action_bar').length > 0 && $('.panel_action_bar').find(".col-left").length > 0) {
        $('.panel_action_bar').find(".col-left").css("min-height", $(window).height() - 230);
    }

};

// Visible button
var visibleButton = function () {
    if ($(".visible-button").length > 0) {
        if ($('.visible-button').length > 0 && $('.visible-button').attr("data-event") !== "click") {
            $('.visible-button').attr("data-event", "click");
            $(".panel_content").on("click", '.visible-button', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var self = e.target;

                if ($(self).is("#toogleBody")) {
                    if ($(self).text() === "Expand All") {
                        $(".panel_content").find(".box-title").addClass("panel-open").next("div.box-body").slideDown(function () {
                            $(self).text("Collapse All");
                        });
                    } else {
                        $(".panel_content").find(".box-title").removeClass("panel-open").next("div.box-body").slideUp(function () {
                            $(self).text("Expand All");
                        });
                    }
                } else {
                    $(self).closest(".box-title").toggleClass('panel-open').next('.box-body').slideToggle(function () {

                        var hasOpen = 0;
                        var hasClose = 0;

                        _.each($(".panel_content").find(".box-title"), function (ele, i) {
                            if ($(ele).attr('class') !== "box-title panel-open") {
                                hasOpen++;
                            } else {
                                hasClose++;
                            }
                        });

                        var btn = $("#toogleBody");
                        if (hasOpen === 0 && btn.text() === "Expand All") {
                            btn.text("Collapse All");
                        }
                        if (hasClose === 0 && btn.text() === "Collapse All") {
                            btn.text("Expand All");
                        }

                        fixPositionActionBar();
                    });
                }
            });
        }
    }
};

var showHide = function () {
    $(".visible-button1").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).parent().closest('h5').next().toggle();
        //$(".visible-button1 i").closest('icon-array-down').next().toggleClass("icon-arr-up");
        //$(".visible-button1 i").toggleClass("icon-arr-up");
        $(this).closest('i').next().toggleClass("icon-arr-up");
        //$(".visible-button1 i").closest('a').next().toggleClass("icon-arr-up");
        // update offset top of process_flow_moc
        var offsetTop = $('.process_flow').height() + 44;
        $(".process_flow_moc").css("top", offsetTop);
    });
}

// fix max-height .k-widget.k-dialog .k-content, .k-widget.k-windows .k-content
var fixMaxHeightDialog = function () {

    if ($('.k-widget.k-dialog').length > 0 && $('.k-widget.k-dialog').find(".k-content").length > 0) {
        var maxHeight = ($(window).height() - 140).toString() + 'px';
        $('.k-widget.k-dialog').find(".k-content").css("max-height", maxHeight);
    }

    if ($('.k-widget.k-windows').length > 0 && $('.k-widget.k-windows').find(".k-content").length > 0) {
        var maxHeight = ($(window).height() - 140).toString() + 'px';
        $('.k-widget.k-windows').find(".k-content").css("max-height", maxHeight);
    }

};

// fix Dialog Center
var fixDialogCenter = function (element) {
    if (element !== null && element !== undefined) {

        var heightWindow = $(window).height();

        var windows = $(element).parent();

        var heightKWindows = $(windows).height();

        var top = (heightWindow - heightKWindows) / 2;

        if (top > 0) {
            $(windows).css("top", top);
        }
        else {
            $(windows).css("top", 0);
        }
    }
};

// Utils
var utils = {
    isNull: function (value) {
        return value === undefined || value === null;
    },
    isEmpty: function (value) {
        return value !== undefined && value !== null && (value === "" || JSON.stringify(value) === '{}' || JSON.stringify(value) === '[]');
    },
    isNullOrEmpty: function (value) {
        return value === undefined || value === null || value === "" || JSON.stringify(value) === '{}' || JSON.stringify(value) === '[]';
    },
    isNullOrWhiteSpace: function (value) {
        return value === undefined || value === null || value.toString().trim() === "";
    },
    isUndefined: function (value) {
        return value === undefined;
    },
    filterMenuInit: function (e) {
        if (e.sender.dataSource.options.schema.model.fields[e.field] !== null && e.sender.dataSource.options.schema.model.fields[e.field] !== undefined && e.sender.dataSource.options.schema.model.fields[e.field].type === "date") {
            var beginOperator = e.container.find("[data-role=dropdownlist]:eq(0)").data("kendoDropDownList");
            beginOperator.value("gte");
            beginOperator.trigger("change");
            beginOperator.readonly();

            var logicOperator = e.container.find("[data-role=dropdownlist]:eq(1)").data("kendoDropDownList");
            logicOperator.readonly();

            var endOperator = e.container.find("[data-role=dropdownlist]:eq(2)").data("kendoDropDownList");
            endOperator.value("lte");
            endOperator.trigger("change");
            endOperator.readonly();
        }
        else {
            if (e.container.find(".k-header").length > 0 && e.container.find(".k-header").find(".k-input").length > 0) {
                e.container.find(".k-header").find(".k-input").hide();
            }
        }

        //hide filter-help-text
        if (e.container.find(".k-filter-help-text").length > 0) {
            e.container.attr("title", "");
            e.container.find(".k-filter-help-text").remove();
        }
    },
    getfilter: function (filter, listFilterOut) {
        listFilterOut = listFilterOut !== undefined && listFilterOut !== null ? listFilterOut : [];
        if (filter.filters !== null && filter.filters !== undefined) {
            _.each(filter.filters, function (m) {
                var outPut = [];
                utils.getfilter(m, listFilterOut);
                if (outPut.length > 0) {
                    listFilterOut.push(outPut);
                }
            });
        }
        else {
            listFilterOut.push({ field: filter.field, value: filter.value, operator: filter.operator });
        }
    },
    timeLine: function (datetime) {
        var date = $.format.toBrowserTimeZone(datetime, "dd MMM yyyy hh:mm a");
        var timedate = new Date(datetime).getTime();
        var timeNow = new Date().getTime();
        var seconds = (timeNow - timedate) / 1000;

        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds - hours * 3600) / 60);
        seconds = seconds - hours * 3600 - minutes * 60;
        var time = "";

        if (hours !== 0 && hours <= 23) {
            time = hours + " hours ";
        }
        if (minutes !== 0 || time !== "") {
            minutes = minutes < 10 && time !== "" ? "0" + minutes : String(minutes);
            time += minutes + " mins ago";
        }
        else {
            time = "just now";
        }

        if (hours >= 24) {
            time = date;
        }

        if (hours < 0) {
            time = "just now";
        }

        return time;
    },
    urlify: function urlify(text) {
        var data = "";
        if (text !== null && text !== undefined) {
            var urlHttpsRegex = /(https?:\/\/[^\s]+)/gi;
            var urlHttpRegex = /(http?:\/\/[^\s]+)/gi;
            data = text.replace(urlHttpsRegex, function (url) {
                return '<a target="_blank" href="' + url + '">' + url + '</a>';
            });
            data = text.replace(urlHttpRegex, function (url) {
                return '<a target="_blank" href="' + url + '">' + url + '</a>';
            });
            return data;
        }
        else {
            return '';
        }
    },
    validRequiredAction: function (action) {
        var isValid = true;
        var name = "";
        var msgRequired = "";
        var actionRequired = "";
        action = (',' + action + ',').toLowerCase();

        _.each($("[action-valid-required]"), function (input, index) {

            actionRequired = (',' + $(input).attr("action-valid-required") + ",").toLowerCase();

            if (actionRequired !== ',,' && actionRequired.indexOf(action) > -1) {
                var value = "";
                name = $(input).attr("name");

                if ($(input).is("[type=text]") || $(input).is("textarea")) {
                    value = $(input).val();
                }
                else {
                    if ($(input).is("select")) {
                        value = $(input).find(":selected").attr('value');

                        if (value === null || value === undefined || value === "") {
                            if ($(input).parent().find(".selected-value").length > 0) {
                                value = "selected";
                            }
                        }
                    }
                    else
                        if ($(input).is("[type=checkbox]")) {
                            _.each($(input).closest("form").find("[name='" + name + "']"), function (item) {
                                if ($(item).is(":checked")) {
                                    value = "checked";
                                }
                            });
                        }
                        else {
                            if ($(input).is("[type=radio]")) {
                                _.each($(input).closest("form").find("[name='" + name + "']"), function (item) {
                                    if ($(item).is(":checked")) {
                                        value = "checked";
                                    }
                                });
                            }
                            else {
                                if ($(input).attr("data-role") === "dropdownlist") {
                                    if ($(input).parent().find(".k-input").length > 0) {

                                        var lable = $(input).attr("k-option-label");
                                        var textSelect = ($(input).parent().find(".k-input").text() + "").trim();

                                        if (textSelect !== "" && lable !== "'" + textSelect + "'" && lable !== textSelect) {
                                            value = "selected";
                                        }

                                    }
                                }
                            }
                        }
                }

                if (value === null || value === undefined) {
                    value = "";
                }

                value = value.replace(/\n/g, '');
                value = value.trim();
                msgRequired = $(input).attr("data-required-msg");

                if (value === "") {
                    isValid = false;
                    _.each($(input).closest("form").find("[data-for='" + name + "']"), function (message, index) {
                        $(input).addClass("k-invalid");
                        $(message).addClass("k-widget");
                        $(message).addClass("k-tooltip");
                        $(message).addClass("k-tooltip-validation");
                        $(message).html(msgRequired);
                        $(message).show();
                    });
                }
                else {
                    _.each($(input).closest("form").find("[data-for='" + name + "']"), function (message, index) {
                        if ($(message).text() === msgRequired) {
                            $(message).html("");
                            $(message).hide();
                        }
                    });
                }
            }
        });

        return isValid;
    },
    clearValidRequiredAction: function () {
        var name = "";
        var msgRequired = "";
        _.each($("[action-valid-required]"), function (input, index) {
            name = $(input).attr("name");
            msgRequired = $(input).attr("data-required-msg");

            _.each($(input).closest("form").find("[data-for='" + name + "']"), function (message, index) {
                if ($(message).text() === msgRequired) {
                    $(message).html("");
                    $(message).hide();
                }
            });
        });
    },
    clearValid: function (container) {
        var filter = "";
        if (container !== '' && container !== undefined && container !== null) {
            filter = container + " ";
        }

        if ($(filter + ".k-invalid-msg").length > 0) {
            $(filter + ".k-invalid-msg").hide();
        }

        if ($(filter + ".k-invalid").length > 0) {
            $(filter + ".k-invalid").removeClass("k-invalid");
        }
    },
    fixDialogCenter: function (element) {
        var myVar = setInterval(function () {
            fixDialogCenter(element);
            clearInterval(myVar);
        }, 1);
    },
    dialog: {
        showConfirm: function (option, funcOk, funcClose) {
            if ($("#" + option.id).length > 0) {
                $("#" + option.id).parent().remove();
                $("#" + option.id).remove();
            }

            $('body').append("<div id='" + option.id + "'></div>");

            $("#" + option.id).kendoDialog({
                title: option.title,
                closeable: true,
                modal: true,
                content: option.content,
                width: option.width,
                actions: [{
                    text: option.lableClose
                },
                {
                    text: option.lableOk,
                    action: function () {
                        return funcOk();
                    },
                    primary: true
                }
                ],
                close: function () {
                    if (typeof funcClose === 'function') {
                        funcClose();
                    }
                }
            });
        },
        showDialog: function (option, funcClose) {
            if ($("#" + option.id).length > 0) {
                $("#" + option.id).parent().remove();
                $("#" + option.id).remove();
            }

            $('body').append("<div id='" + option.id + "'></div>");

            $("#" + option.id).kendoDialog({
                title: option.title,
                closeable: true,
                modal: true,
                content: option.content,
                width: option.width,
                actions: [{
                    text: option.lableClose
                }],
                close: function () {
                    if (typeof funcClose === 'function') {
                        funcClose();
                    }
                }
            });
        }
    },
    error: {
        showErrorGet: function (err) {

            if (err !== null && err !== undefined && err.statusCode === -1) {
                if ($('#toast-container').length === 0) {
                    toastr.options = {
                        "closeButton": false,
                        "newestOnTop": false,
                        "progressBar": true,
                        "positionClass": "toast-bottom-right",
                        "preventDuplicates": true,
                        "onclick": null,
                        "showDuration": "300",
                        "hideDuration": "1000",
                        "timeOut": "5000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    };
                    toastr["warning"](err.message, "Warning");
                }
            }
            else {
                console.log(err);
            }
        }
    },
    mapObject: function (fromObj, toObj) {
        for (var prop in fromObj) {
            if (typeof fromObj[prop] != "function" && toObj.hasOwnProperty(prop) && typeof toObj[prop] != "function") {
                toObj[prop] = fromObj[prop];
            }
        }
    }
};

var checkUserHasRoleKey = function (rolesString, roleKey) {
    return ("," + rolesString + ",").indexOf(","+roleKey+",") >= 0;
}
// isMobile
var isMobile = {
    Android: function () { return navigator.userAgent.match(/Android/i); },
    BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); },
    iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
    Opera: function () { return navigator.userAgent.match(/Opera Mini/i); },
    Windows: function () { return navigator.userAgent.match(/IEMobile/i); },
    any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera()); }
};