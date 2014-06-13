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

    $('#validationErrorMessageButton').click(function(){
        $('#validationErrorMessage').addClass('hide-form-validation-error');
    });

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

    });

    $('#step2Button').click(function(){
        $('#step2').addClass('hide-signup-step');
        $('#step3').removeClass('hide-signup-step');
    });

    $('#step2BackButton').click(function(){
        $('#step2').addClass('hide-signup-step');
        $('#step1').removeClass('hide-signup-step');
    });



})