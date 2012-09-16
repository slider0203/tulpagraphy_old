/* File Created: June 8, 2012 */
(function (Character, $, undefined) {
    var CharacterViewModel = ko.mapping.fromJS(data);

    Character.GetData = function () {
        $.ajax({
            type: 'GET',
            url: '/Player/GetCharacter',
            dataType: 'json',
            success: function (data) {
                var model = new Character.ViewModel();
                ko.mapping.fromJS(data,model);
            }
        });
    };
} (window.Character = window.Character || {}, jQuery));
$(document).ready(function () {
    Character.GetData();
    alert(Character);
});