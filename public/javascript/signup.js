/**
 * Created by Josh Pagley on 6/12/14.
 */
$(document).ready(function(){
    var name = "";
    var email = "";
    var address = "";
    var city = "";
    var state = "";
    var zip = "";
    var phone = "";
    var website = "";
    var denomination = "";
    var bio = "";
    var serviceDay = "";
    var serviceTime = "";
    var serviceTimePeriod = "";
    var services = [];
    var accountEmail = "";
    var accountPassword = "";

    $('#validationErrorMessageButton').click(function(){
        $('#validationErrorMessage').addClass('hide-form-validation-error');
    });

    $('#step3ValidationErrorMessageButton').click(function(){
        $('#step3ValidationErrorMessageButton').addClass('hide-form-validation-error');
    });

    /**
     * Step 1: Add Church Information
     */

    $('#step1Button').on('click', function(){
        //Hide all error messages
        $('#nameError').addClass('hide-form-validation-error');
        $('#emailError').addClass('hide-form-validation-error');
        $('#addressError').addClass('hide-form-validation-error');
        $('#cityError').addClass('hide-form-validation-error');
        $('#stateError').addClass('hide-form-validation-error');
        $('#zipError').addClass('hide-form-validation-error');

        var validationError = false;

        name = $('#name').val();
        email = $('#email').val();
        address = $('#address').val();
        city = $('#city').val();
        state = $('#state').val();
        zip = $('#zip').val();
        phone = $('#phone').val();
        website = $('#website').val();
        denomination = $('#denomination').val();
        bio = $('#bio').val();

        if(name == ""){
            $('#nameError').removeClass('hide-form-validation-error');
            validationError = true;
        }
        if(email == ""){
            $('#emailError').removeClass('hide-form-validation-error');
            validationError = true;
        }
        if(address == ""){
            $('#addressError').removeClass('hide-form-validation-error');
            validationError = true;
        }
        if(city == ""){
            $('#cityError').removeClass('hide-form-validation-error');
            validationError = true;
        }
        if(state == ""){
            $('#stateError').removeClass('hide-form-validation-error');
            validationError = true;
        }
        if(zip == ""){
            $('#zipError').removeClass('hide-form-validation-error');
            validationError = true;
        }

        if(validationError){
            $('#validationErrorMessage').removeClass('hide-form-validation-error');
        } else {
            $('#step1').addClass('hide-signup-step');
            $('#step2').removeClass('hide-signup-step');
        }

        $('#serviceTime').focus();

    });

    /**
     * Step 2: Add church services
     */

    $('#step2Button').click(function(){
        $('#step2').addClass('hide-signup-step');
        $('#step3').removeClass('hide-signup-step');
        $('#accountEmail').focus();
    });

    $('#step2BackButton').click(function(){
        $('#step2').addClass('hide-signup-step');
        $('#step1').removeClass('hide-signup-step');
    });

    var serviceCounter = 1;
    $('#addServiceButton').click(function(){
        serviceDay = $('#serviceDay').val();
        serviceTime = $('#serviceTime').val();
        serviceTimePeriod = $('#serviceTimePeriod').val();
        serviceTime = serviceTime + serviceTimePeriod;

        services.push({'count': serviceCounter, 'day': serviceDay, 'time': serviceTime});
        $('#serviceList').append(createServiceElement(serviceCounter, serviceDay, serviceTime));
        serviceCounter++;

        $('#serviceTime').val("");
        $('#serviceTime').focus();
    });

    function createServiceElement(serviceCounter, serviceDay, serviceTime){
        var span = '<div style="clear: both;"><span id="service">' + serviceDay + ' ' + serviceTime + '</span>';
        var button = '<button type="button" id="removeService'+ serviceCounter +'Button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button></div> ';
        return span + button;
    }

    $(document).on('click', '#removeService1Button', function(){
        removeServiceFromServicesList(1);
    });
    $(document).on('click', '#removeService1Button', function(){
        removeServiceFromServicesList(1);
    });
    $(document).on('click', '#removeService2Button', function(){
        removeServiceFromServicesList(2);
    });
    $(document).on('click', '#removeService3Button', function(){
        removeServiceFromServicesList(3);
    });
    $(document).on('click', '#removeService4Button', function(){
        removeServiceFromServicesList(4);
    });
    $(document).on('click', '#removeService5Button', function(){
        removeServiceFromServicesList(5);
    });
    $(document).on('click', '#removeService6Button', function(){
        removeServiceFromServicesList(6);
    });
    $(document).on('click', '#removeService7Button', function(){
        removeServiceFromServicesList(7);
    });
    $(document).on('click', '#removeService8Button', function(){
        removeServiceFromServicesList(8);
    });
    $(document).on('click', '#removeService9Button', function(){
        removeServiceFromServicesList(9);
    });
    $(document).on('click', '#removeService10Button', function(){
        removeServiceFromServicesList(10);
    });
    $(document).on('click', '#removeService11Button', function(){
        removeServiceFromServicesList(11);
    });
    $(document).on('click', '#removeService12Button', function(){
        removeServiceFromServicesList(12);
    });
    $(document).on('click', '#removeService13Button', function(){
        removeServiceFromServicesList(13);
    });
    $(document).on('click', '#removeService14Button', function(){
        removeServiceFromServicesList(14);
    });
    $(document).on('click', '#removeService15Button', function(){
        removeServiceFromServicesList(15);
    });
    $(document).on('click', '#removeService16Button', function(){
        removeServiceFromServicesList(16);
    });
    $(document).on('click', '#removeService17Button', function(){
        removeServiceFromServicesList(17);
    });
    $(document).on('click', '#removeService18Button', function(){
        removeServiceFromServicesList(18);
    });
    $(document).on('click', '#removeService19Button', function(){
        removeServiceFromServicesList(19);
    });
    $(document).on('click', '#removeService20Button', function(){
        removeServiceFromServicesList(20);
    });
    $(document).on('click', '#removeService21Button', function(){
        removeServiceFromServicesList(21);
    });
    $(document).on('click', '#removeService22Button', function(){
        removeServiceFromServicesList(22);
    });
    $(document).on('click', '#removeService23Button', function(){
        removeServiceFromServicesList(23);
    });
    $(document).on('click', '#removeService24Button', function(){
        removeServiceFromServicesList(24);
    });
    $(document).on('click', '#removeService25Button', function(){
        removeServiceFromServicesList(25);
    });

    function removeServiceFromServicesList(count){
        var counter = 0;
        services.forEach(function(serviceObject, index){
            if(serviceObject.count == count){
                services.splice(index, 1);
            } else {
                counter++;
            }
        });
        console.log(services);
        return;
    }

    /**
     * Step 3: Add credentials for administration account.
     */

    $('#step3BackButton').click(function(){
        $('#step3').addClass('hide-signup-step');
        $('#step2').removeClass('hide-signup-step');
    });

    $('#step3Button').click(function(){
        accountEmail = $('#accountEmail').val();
        accountPassword = $('#accountPassword').val();

        var validationError = false;

        if(accountEmail == ""){
            $('#accountEmailError').removeClass('hide-form-validation-error');
            validationError = true;
        }
        if(accountPassword == ""){
            $('#accountPasswordError').removeClass('hide-form-validation-error');
            validationError = true;
        }

        if(validationError){
            $('#validationErrorMessage').removeClass('hide-form-validation-error');
        } else {
            var accountObject = {
                name: name,
                email: email,
                address: address,
                city: city,
                state: state,
                zip: zip,
                phone: phone,
                website: website,
                denomination: denomination,
                bio: bio,
                services: services,
                accountEmail: accountEmail,
                accountPassword: accountPassword
            }

            console.log(accountObject);
            var createAccountRequest = $.post('/signup', accountObject);
            createAccountRequest.done(function(data){
                console.log('createAccountRequest done.');
                if(data.success){
                    window.location.replace("/portal");
                } else {
                    $('#responsePopupMessage').text('Oops! Please try creating an account later. Sorry :(');
                }
            });
            createAccountRequest.fail(function(data){
                console.log('createAccountRequest fail.');
                if(data){
                    console.log(data);
                    $('#responsePopup').removeClass('hide-response-popup-error');
                    $('#responsePopupMessage').text(data.message);
                } else {
                    $('#responsePopupMessage').text('Oops! Please try creating an account later. Sorry :(');
                }
            });
        }
    });

    $('#responsePopupButton').click(function(){
        $('#responsePopup').addClass('hide-response-popup-error');
    });



});

function displayProfileAvatar(input){
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#profileAvatar')
                .attr('src', e.target.result)
                .width(200)
                .height(200);
        };

        reader.readAsDataURL(input.files[0]);
    }
}