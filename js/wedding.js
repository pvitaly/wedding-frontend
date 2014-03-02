var insta_next_url;
var clientId = '26dbb2b64b414f6599c6e02103c7f55d';
var noMorePages = false;
var firstGet = true;
var min_tag_id;
var tag = "pekerwedding";

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

//    $('#rsvpCodeForm').validate({
//        submitHandler: function(form) {
//            $.ajax({
//                type: "GET",
//                url: "rest/getGuest?uniqueId=" + $("#rsvpCode").val(),
//                error: function(xhr, status, error) {
//                    $('#rsvpCodeModal').effect("shake");
//                    $("#rsvpCode").val('');
//                }
//            }).done(function(data) {
//
//                // if code not found, display message and exit out of this ajax call
//                if ($.isEmptyObject(data)) {
//                    $('#rsvpCodeModal').effect("shake");
//                    $("#rsvpCode").val('');
//                    return;
//                }
//
//                $('#rsvpCodeModal').modal('hide');
//                $("#rsvpCode").val('');
//
//                $('#guestName').val(data.firstName + ' ' + data.lastName);
//
//                if (!data.plusOneAllowed) {
//                    $('#plusOneDecision').hide();
//                    noPlusOne();
//                } else {
//                    $('#yesPlusOne').button('toggle');
//                    if (data.plusOneFirstName !== '') {
//                        $('#plusOneName').val(data.plusOneFirstName + ' ' + data.plusOneLastName);
//                    }
//                }
//
//                $('#rsvpModal').modal('show');
//            });
//        },
//        rules: {
//            rsvpCode: {
//                required: true,
//                rangelength: [5, 5]
//            }
//        },
//        messages: {
//            rsvpCode: {
//                required: "Please enter your RSVP code.",
//                rangelength: "RSVP code must be 5 characters long."
//            },
//        }
//    });


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

        if ($('.navbar-toggle').css('display') != 'none') {
            $('.navbar-toggle').click();
        }

        if ($(this).data('id') == 'rsvp') {
            return;
        }

        if ($(this).data('id') == 'home') {
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
    
    $('#codeSubmitBtn').on('click', function() {

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
            } else {
                $('#plusOneDecision').show();
                if (data.plusOneFirstName !== '') {
                    $('#plusOneName').val(data.plusOneName);
                }
            }

            if (!data.kidsAllowed) {
                $('#partySizeDiv').hide();
            } else {
                $('#partySizeDiv').show();
            }

            $('#rsvpModal').modal('show');
        });

    });

    $('#rsvpSubmitBtn').on('click', function() {
        var response = $('#response').val();

        if (response === 'accept') {

            acceptRsvp();

        } else if (response === 'decline') {
            declineRsvp();
        }

    });

    function acceptRsvp() {
        var plusOne = $('#plusOne');
        var numberOfKids = $('#numberOfKids');
        var messageFromGuest = $('#messageFromGuest');

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
            url: "rest/accept/" + $("#guestCode").val() + "/" + $('#guestName').val() + "/" +
                    plusOne.val() + "/" + $('#plusOneName').val() + "/" + numberOfKids.val() + "/" + messageFromGuest.val(),
            error: function(xhr, status, error) {
                $('#rsvpModal').effect("shake");
            }
        }).done(function(data) {
            $('#rsvpModal').modal('hide');

            $('#rsvpMessage').text("Thank you for accepting our invitation. We cannot wait to spend our most special day with you!");
            $('#rsvpMessageModal').modal('show');
        });
    }

    function declineRsvp() {
        $.ajax({
            type: "PUT",
            url: "rest/decline/" + $("#guestCode").val() + "/" + $('#messageFromGuest').val(),
            error: function(xhr, status, error) {
                $('#rsvpModal').effect("shake");
            }
        }).done(function(data) {
            $('#rsvpModal').modal('hide');

            $('#rsvpMessage').text("Thank you for taking the time to respond to our invitation. Our regrets you will not be able to make it, but we hope to see you soon.");
            $('#rsvpMessageModal').modal('show');
        });
    }

    $('#accept').on('change', function() {
        $('#response').val("accept");
    });

    $('#decline').on('change', function() {
        $('#response').val("decline");
    });

    $('#noPlusOne').on('change', function() {
        $('#plusOne').val(false);
        noPlusOne();
    });

    $('#yesPlusOne').on('change', function() {
        $('#plusOne').val(true);
        yesPlusOne();
    });

    $('#partySize').on('change', function() {
        $('#numberOfKids').val($(this).val());
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