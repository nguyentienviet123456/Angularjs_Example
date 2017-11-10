app.factory('serviceHelper', ['apiHelper', '$q', 'constants', function (apiHelper, $q, constants) {
    var services = {};
    var _requiredRule = function (input) {

        if (!$(input).is("[required]")) {
            return true;
        }

        if (input.is("[norequired=Draft]")) {
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
    };

    services.requiredRule = _requiredRule;
    return services;
}]);