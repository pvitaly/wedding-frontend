var insta_next_url;
var clientId = '26dbb2b64b414f6599c6e02103c7f55d';
var noMorePages = false;
var firstGet = true;
var min_tag_id;
var tag = "pekerwedding";

var kidsAllowed = false;
var plusOneAllowed = false;
var responseFilled = true;
var plusOneFilled = true;
var bringingKidsFilled = true;
var formComplete = true;

function createPhotoElement(photo) {

    var innerHtml = $('<img style="padding:2px;">')
            .addClass('instagram-image')
            .attr('src', photo.images.thumbnail.url);

    innerHtml = $('<a>')
            .attr('target', '_blank')
            .attr('href', photo.link)
            .append(innerHtml);

    return innerHtml;
}

function didLoadInstagram(event, response) {

    var that = this;

    if (!noMorePages) {
        if (response.pagination.next_url != undefined) {
            insta_next_url = response.pagination.next_url;
            if (firstGet) {
                min_tag_id = response.pagination.min_tag_id;
                firstGet = false;
            }
        } else {
            noMorePages = true;

            if (min_tag_id == undefined) {
                if (response.pagination.min_tag_id != undefined) {
                    insta_next_url = "https://api.instagram.com/v1/tags/" + tag + "/media/recent?min_tag_id="
                            + response.pagination.min_tag_id;
                }
            } else {
                insta_next_url = "https://api.instagram.com/v1/tags/" + tag + "/media/recent?min_tag_id="
                        + min_tag_id;
            }

        }
    } else {
        if (response.pagination.next_url != undefined) {
            insta_next_url = response.pagination.next_url;
        } else {
            if (response.pagination.min_tag_id != undefined) {
                insta_next_url = "https://api.instagram.com/v1/tags/" + tag + "/media/recent?min_tag_id="
                        + response.pagination.min_tag_id;
            }
        }

    }

    if (response.data.length > 0) {
        $.each(response.data, function(i, photo) {
            $(that).append(createPhotoElement(photo));
        });
    }
}

$(document).ready(function() {

    $('.instagram').on('didLoadInstagram', didLoadInstagram);

    $('.instagram').instagram({
        clientId: clientId,
        hash: tag,
        url: insta_next_url
    });

    $('#moreinsta').on('click', function() {
        $('.instagram').instagram({
            clientId: clientId,
            hash: tag,
            url: insta_next_url
        });
    });

    $('#fixednav li a').on('click', function() {

        if ($('.navbar-toggle').css('display') !== 'none') {
            $('.navbar-toggle').click();
        }

        if ($(this).data('id') === 'rsvp') {
            return;
        }

        if ($(this).data('id') === 'home') {
            $('#fixednav li').each(function() {
                $(this).find('a').css('color', '');
                $($(this).find('a').data('id')).fadeOut("slow", "linear");
            });
            return;
        }

        $('#fixednav li').each(function() {
            $($(this).find('a').data('id')).css('display', 'none');
            $(this).find('a').css('color', '');
        });

        $(this).css('color', '#999');
        $($(this).data('id')).fadeIn("slow", "linear");

    });

    $('#ceremony-map').zoom({
        magnify: 1
    });

    $('#rsvpCodeModal').on('shown.bs.modal', function() {
        $('#rsvpCode').focus();
    });

    $('#rsvpCodeForm').submit(function() {
        return false;
    });

    $('#rsvpCodeForm').validate({
        rules: {
            rsvpCode: {
                required: true,
                minlength: 5,
                maxlength: 5
            }
        },
        messages: {
            rsvpCode: {
                required: "We need your invitation code, please."
            }
        },
        submitHandler: function() {
            $.ajax({
                type: "GET",
                url: "rest/getGuest?uniqueId=" + $("#rsvpCode").val(),
                error: function(xhr, status, error) {
                    $('#rsvpCodeModal').effect("shake");
                    $("#rsvpCode").val('');
                }
            }).done(function(data) {

                // if code not found, display message and exit out of this ajax call
                if ($.isEmptyObject(data)) {
                    $('#rsvpCodeModal').effect("shake");
                    $("#rsvpCode").val('');
                    return;
                }

                if (data.guestStatusEnum !== "WAITING") {
                    $('#rsvpCodeModal').modal('hide');
                    $("#rsvpCode").val('');

                    $('#rsvpMessage').text("Uh oh, it looks like you have already responded! If you think you made a mistake, give us a call!");
                    $('#rsvpMessageModal').modal('show');

                    return;
                }

                $('#rsvpCodeModal').modal('hide');
                $("#rsvpCode").val('');

                $('#guestName').val(data.guestName);
                $('#guestCode').val(data.uniqueId);

                if (!data.plusOneAllowed) {
                    $('#plusOneDecision').hide();
                    plusOneAllowed = false;
                } else {
                    plusOneAllowed = true;
                    $('#plusOneDecision').show();
                    if (data.plusOneFirstName !== '') {
                        $('#plusOneName').val(data.plusOneName);
                    }
                }

                if (!data.kidsAllowed) {
                    kidsAllowed = false;
                    $('#partySizeDiv').hide();
                } else {
                    kidsAllowed = true;
                    $('#partySizeDiv').show();
                }

                if (data.isInWeddingParty) {
                    $("#helpText").text("You must be in the wedding party... select from below.")
                    $('#acceptText').text("I have to come!");
                    $('#declineText').text("Wait... is this optional?!?");
                    $('#declineLabel').attr("id", "acceptLabel2");
                }
                $('#rsvpModal').modal('show');
            });
        }
    });

//    $('#codeSubmitBtn').on('click', function() {
//
//        $.ajax({
//            type: "GET",
//            url: "rest/getGuest?uniqueId=" + $("#rsvpCode").val(),
//            error: function(xhr, status, error) {
//                $('#rsvpCodeModal').effect("shake");
//                $("#rsvpCode").val('');
//            }
//        }).done(function(data) {
//
//            // if code not found, display message and exit out of this ajax call
//            if ($.isEmptyObject(data)) {
//                $('#rsvpCodeModal').effect("shake");
//                $("#rsvpCode").val('');
//                return;
//            }
//
//            if (data.guestStatusEnum !== "WAITING") {
//                $('#rsvpCodeModal').modal('hide');
//                $("#rsvpCode").val('');
//
//                $('#rsvpMessage').text("Uh oh, it looks like you have already responded! If you think you made a mistake, give us a call!");
//                $('#rsvpMessageModal').modal('show');
//
//                return;
//            }
//
//            $('#rsvpCodeModal').modal('hide');
//            $("#rsvpCode").val('');
//
//            $('#guestName').val(data.guestName);
//            $('#guestCode').val(data.uniqueId);
//
//            if (!data.plusOneAllowed) {
//                $('#plusOneDecision').hide();
//            } else {
//                $('#plusOneDecision').show();
//                if (data.plusOneFirstName !== '') {
//                    $('#plusOneName').val(data.plusOneName);
//                }
//            }
//
//            if (!data.kidsAllowed) {
//                $('#partySizeDiv').hide();
//            } else {
//                $('#partySizeDiv').show();
//            }
//
//            if (data.isInWeddingParty) {
//                $("#helpText").text("You must be in the wedding party... select from below.")
//                $('#acceptText').text("I have to come!");
//                $('#declineText').text("Wait... is this optional?!?");
//                $('#declineLabel').attr("id", "acceptLabel2");
//            }
//            $('#rsvpModal').modal('show');
//        });
//
//    });
    $('#rsvpSubmitBtn').on('click', function() {
        var response = $('#response').val();

        if ($('#guestCode').val() === "") {
            return;
        }

        if (response === "") {
            $('#responseError').show();
            responseFilled = false;
        } else {
            if (response === 'decline') {
                $('#confirmMessageDiv').append('<p>You declined our invitation.');
                doConfirmModal();
                return;
            }
            responseFilled = true;
            $('#responseError').hide();
        }

        if ($('#plusOne').val() === "" && plusOneAllowed) {
            $('#plusOneError').show();
            plusOneFilled = false;
        } else {
            plusOneFilled = true;
            $('#plusOneError').hide();
        }

        if ($('#numberOfKids').val() === "" && kidsAllowed) {
            $('#kidsError').show();
            bringingKidsFilled = false;
        } else {
            $('#kidsError').hide();
            bringingKidsFilled = true;
        }

        if (responseFilled) {
            formComplete = true;
            if (plusOneAllowed && !plusOneFilled) {
                formComplete = false;
            }
            if (kidsAllowed && !bringingKidsFilled) {
                formComplete = false;
            }
        } else {
            formComplete = false;
        }

        if (!formComplete) {
            $('#rsvpModal').effect("shake");
            return;
        }

        if (response === 'accept') {
            $('#confirmMessageDiv').append('<p>You accepted our invitation.');
        } else {
            $('#confirmMessageDiv').append('<p>You declined our invitation.');
            doConfirmModal();
            return;
        }

        if (plusOneAllowed) {
            if ($('#plusOne').val() === "true") {
                $('#confirmMessageDiv').append('<p>You are bringing a guest.');
            } else {
                $('#confirmMessageDiv').append('<p>You are NOT bringing a guest.');
            }
        }

        if (kidsAllowed) {
            $('#confirmMessageDiv').append('<p>There are a total of ' + $('#numberOfKids').val() + ' in you party.');
        }

        doConfirmModal();

    });
    
    function doConfirmModal() {
        $('#rsvpModal').modal('hide');
        $('#rsvpConfirmModal').modal('show');
    }

    $('#rsvpConfirmBtn').on('click', function() {
        var response = $('#response').val();
        if (response === 'accept') {
            acceptRsvp();
        } else if (response === 'decline') {
            declineRsvp();
        }

    });

    $('#rsvpConfirmGoBackBtn').on('click', function() {
        $('#confirmMessageDiv').text("");
        $('#rsvpConfirmModal').modal('hide');
        $('#rsvpModal').modal('show');
    });

    function hideResponseError() {
        responseFilled = true;
        $('#responseError').hide();
    }

    function hidePlusOneError() {
        plusOneFilled = true;
        $('#plusOneError').hide();
    }

    function hideKidsError() {
        $('#kidsError').hide();
        bringingKidsFilled = true;
    }

    function acceptRsvp() {
        var plusOne = $('#plusOne');
        var numberOfKids = $('#numberOfKids');
        var messageFromGuest = $('#messageFromGuest');
        var guestName = $('#guestName');
        var plusOneName = $('#plusOneName');

        if (guestName.val() === "") {
            guestName.val("null");
        }

        if (plusOneName.val() === "") {
            plusOneName.val("null");
        }

        if (plusOne.val() === "") {
            plusOne.val(false);
        }

        if (numberOfKids.val() === "" || numberOfKids.val() === "...") {
            numberOfKids.val(0);
        }

        if (messageFromGuest.val() === "") {
            messageFromGuest.val("null");
        }

        $.ajax({
            type: "PUT",
            url: "rest/accept/" + $("#guestCode").val() + "/" + guestName.val() + "/" +
                    plusOne.val() + "/" + plusOneName.val() + "/" + numberOfKids.val() + "/" + messageFromGuest.val(),
            error: function(xhr, status, error) {
                $('#rsvpModal').effect("shake");
            }
        }).done(function(data) {
            $('#rsvpConfirmModal').modal('hide');

            $('#rsvpMessage').text("Thank you for accepting our invitation. We cannot wait to spend our most special day with you!");
            $('#rsvpMessageModal').modal('show');

            cleanUpRsvpModal();
        });
    }

    function declineRsvp() {
        var messageFromGuest = $('#messageFromGuest');

        if (messageFromGuest.val() === "") {
            messageFromGuest.val("null");
        }

        $.ajax({
            type: "PUT",
            url: "rest/decline/" + $("#guestCode").val() + "/" + messageFromGuest.val(),
            error: function(xhr, status, error) {
                $('#rsvpModal').effect("shake");
            }
        }).done(function(data) {
            $('#rsvpConfirmModal').modal('hide');

            $('#rsvpMessage').text("Thank you for taking the time to respond to our invitation. Our regrets you will not be able to make it, but we hope to see you soon.");
            $('#rsvpMessageModal').modal('show');

            cleanUpRsvpModal();
        });
    }

    function cleanUpRsvpModal() {
        $('#guestCode').val("");
        $('#response').val("");
        $('#plusOne').val("");
        $('#bringingKids').val("");
        $('#numberOfKids').val("");
        $('#messageFromGuest').val("");
        $('#acceptLabel').removeClass('active');
        $('#declineLabel').removeClass('active');
        $('#acceptLabel').removeClass('greyout');
        $('#acceptLabel2').removeClass('greyout');
        $('#declineLabel').removeClass('greyout');
        $('#yesPlusOneLabel').removeClass('active');
        $('#noPlusOneLabel').removeClass('active');
        $('#partySize').val('');
        $("#helpText").text("Select from the options below.")
        $('#acceptText').text("I Accept");
        $('#declineText').text("I Decline");
        $('#declineLabel').attr("id", "declineLabel");
        $('#acceptLabel2').attr("id", "declineLabel");
        $('#partySizeDiv').hide();
        $('#confirmMessageDiv').text("");
        noPlusOne();
        cleanUpFormBooleans();

    }

    function cleanUpFormBooleans() {
        kidsAllowed = false;
        plusOneAllowed = false;
        responseFilled = true;
        plusOneFilled = true;
        bringingKidsFilled = true;
        formComplete = true;
    }

    $('#rsvpModal').on('click', '#acceptLabel', function() {
        if (!$('#declineLabel').hasClass('greyout')) {
            $('#declineLabel').addClass('greyout');
        }

        if (!$('#acceptLabel2').hasClass('greyout')) {
            $('#acceptLabel2').addClass('greyout');
        }

        if ($('#acceptLabel').hasClass('greyout')) {
            $('#acceptLabel').removeClass('greyout');
        }

        $('#response').val("accept");
        hideResponseError();
    });

    $('#rsvpModal').on('click', '#acceptLabel2', function(event) {
        event.stopImmediatePropagation();

        if (!$('#declineLabel').hasClass('greyout')) {
            $('#declineLabel').addClass('greyout');
        }

        if (!$('#acceptLabel2').hasClass('greyout')) {
            $('#acceptLabel2').addClass('greyout');
        }

        $('#response').val("accept");
        $('#declineLabel').addClass('greyout');
        $('#acceptLabel').addClass('active');
        hideResponseError();
    });

    $('#rsvpModal').on('click', '#declineLabel', function() {
        if (!$('#acceptLabel').hasClass('greyout')) {
            $('#acceptLabel').addClass('greyout');
        }

        if (!$('#acceptLabel2').hasClass('greyout')) {
            $('#acceptLabel2').addClass('greyout');
        }

        if ($('#declineLabel').hasClass('greyout')) {
            $('#declineLabel').removeClass('greyout');
        }

        $('#response').val("decline");
        hideResponseError();
    });

    $('#rsvpModal').on('change', '#noPlusOne', function() {
        $('#plusOne').val(false);
        noPlusOne();
        hidePlusOneError();
    });

    $('#rsvpModal').on('change', '#yesPlusOne', function() {
        $('#plusOne').val(true);
        yesPlusOne();
        hidePlusOneError();
    });

    $('#rsvpModal').on('change', '#partySize', function() {
        $('#numberOfKids').val($(this).val());
        if ($(this).val() !== "") {
            $('#kidsError').hide();
            bringingKidsFilled = true;
        } else {
            $('#kidsError').show();
            bringingKidsFilled = false;
        }
    });

    $('#rsvpCloseBtn').on('click', function() {
        cleanUpRsvpModal();
    });

    function noPlusOne() {
        $('#plusOneName').hide();
        $('#guestNameDiv').removeClass('col-lg-6');
        $('#guestNameDiv').addClass('col-lg-12');
    }

    function yesPlusOne() {
        $('#plusOneName').show();
        $('#guestNameDiv').removeClass('col-lg-12');
        $('#guestNameDiv').addClass('col-lg-6');
    }

    $('.carousel').carousel({
        interval: false
    });


});