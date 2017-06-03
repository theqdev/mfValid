/*
 *
 * mfValid Jquery plugin
 *
 * A plugin that aims at helping you with form validation
 *
 * Note* This is a still a in-development plugin
 *
 */

//TODO: Multiple init calls

mfValid = {

    errHtml : '<p>Oups, you got some erros. Please  take care of them and try again.</p>\
            <ul>',

    /* Automated form validation init */
    init: function(formID,successMsg){
        $(formID).unbind();
        $(formID).bind( "submit", function( event ) {
            event.preventDefault();
            errors = [];
            $(formID + ' input').each(function(){
                input = $(this);
                if(input.attr('mfv-checks')){
                    checks = input.attr('mfv-checks').split(';');
                    for(i = 0; i < checks.length; i++){
                        check = checks[i].split(':');
                        prop  = check[0];
                        val   = check[1];
                        switch(prop) {
                            case 'required':
                                if(val == 'true'){
                                    if($(input).val().length == 0){
                                        errors.push('"' + $(input).attr('placeholder') + '" can not be empty.');
                                    }
                                }
                                break;
                            case 'min':
                                if($(input).val().length < val){
                                    errors.push('"' + $(input).attr('placeholder') + '" must be at least ' + val + ' characters long.');
                                }
                                break;
                            case 'max':
                                if($(input).val().length > val){
                                    errors.push('"' + $(input).attr('placeholder') + '" must be under ' + val + ' characters long.');
                                }
                                break;

                            case 'email':
                                if(val == 'true'){
                                    if(!mfValid.validateEmail($(input).val())){
                                        errors.push('"' + $(input).attr('placeholder') + '" does not contain a valid email address.');
                                    }
                                }
                                break;

                            case 'emailInDB':
                                if(val == 'true'){
                                    $.ajax({
                                        type: "POST",
                                        url: app.baseUrl + 'register/checkForEmail',
                                        data: {email:$(input).val()},
                                        dataType: "json",
                                        async: false,
                                        success: function(data){
                                            if(data){
                                                errors.push('Sorry, it looks like this email has been registered already');
                                            }
                                        }
                                    });
                                }
                                break;

                            case 'match':
                                if($('#'+val).val() != $(input).val()){
                                    if(!mfValid.validateEmail($(input).val())){
                                        errors.push('"' + $(input).attr('placeholder') + '" doesn\'t match the value of "' + $('#'+val).attr('placeholder') + '"');
                                    }
                                }
                                break;

                            default:
                                break;
                        }

                    }
                }
            });
            // Displaying the errors
            if(errors.length){
                mfValid.launchCustomError(formID,errors);
                //$('body').scrollTo(formID);
            }
            else{
                if(typeof successMsg == 'undefined'){
                    $( formID +  ' .mfv-errorBox').empty();
                    $( formID +  ' .mfv-errorBox').removeClass('alert alert-danger');
                }
                else{
                    $( formID +  ' .mfv-errorBox').html(successMsg);
                    $( formID +  ' .mfv-errorBox').attr('class','mfv-errorBox alert alert-success');

                }
                eval($( formID +  ' button[type="submit"]').attr('mfv-action'));
            }

            //$('html, body').animate({
            //    scrollTop: $('body' ).offset().top
            //}, 1000);

        });
    },


    validateEmail: function(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },

    launchCustomError: function(formID,errors){
        errHtml = mfValid.errHtml;
        $( formID +  ' .mfv-errorBox').html('<ul>');
        if(typeof errors == 'string'){
            errHtml += '<li>'+errors+'</li>';
        }
        else{
            for(i=0;i<errors.length;i++){
                errHtml += '<li>'+errors[i]+'</li>';
            }
        }
        errHtml += '</ul>';
        $( formID +  ' .mfv-errorBox').html(errHtml);
        $( formID +  ' .mfv-errorBox').hide().addClass('alert alert-danger').fadeIn('slow');
    },

    launchSuccessMessage: function(formID,message){
        $( formID +  ' .mfv-errorBox').html(message);
        $( formID +  ' .mfv-errorBox').addClass('alert alert-success');
    },

    successRedirect: function(page){
        if(typeof page == 'undefined'){
            window.location.href = window.reload();
        }
        else{
            window.location.href =  page;
        }
    },

    /* Manual checks */
    check : function(prop, rule,val){
        switch(prop){
            case 'min':
                if(val.length < rule){
                    return false;
                }
                return true;
                break;

            case 'max':
                if(val.length > rule){
                    return false;
                }
                return true;
                break;

            case 'minInt':
                if(val < rule){
                    return false;
                }
                return true;
                break;

            case 'maxInt':
                if(val > rule){
                    return false;
                }
                return true;
                break;

            case 'email':
                if(rule == 'true'){
                    if(!mfValid.validateEmail(val)){
                        return false;
                    }
                    return true;
                }
                break;

        }
    },


};



//TODO: Move this fuxer or combine it with mfValid
function formValidate(checks,ids){

    $.each(checks, function( cid, check ) {
        if(check == 'against-value-check'){
            //
            // Check agains specific values (Most used for <select>'s ')
            //
            $.each(ids, function( id, value ) {
                //
                // This check it is based on 3 events: onClick,onExit,onChange
                //

                // STEP 1: Setting the syle when clicked
                $('#' + value).on('click', function(){
                        val = $('#' + value).val();
                        if(val == 'none'){
                            $('#' + value).css('box-shadow','0 1px 2px #D4360E');
                        }
                        else{
                            $('#' + value).css('box-shadow','0 1px 2px  #93C54B');
                        }
                    }
                );
                // STEP 2: Unsetting the style when mouse out
                $('#' + value).focusout(function(){
                    $('#' + value).css('box-shadow','none')
                });
                // STEP3: When actually typing
                $('#' + value).on('input', function() {
                    val = $(this).val();
                    if(val == 'none'){
                        $(this).css('box-shadow','0 1px 2px  #D4360E');
                    }
                    else{
                        $(this).css('box-shadow','0 1px 2px #93C54B');
                    }
                })
            });
        }

        if(check == 'empty-check'){
            //
            // Emptyness check
            //
            $.each(ids, function( id, value ) {
                //
                // This check it is based on 3 events: onClick,onExit,onChange
                //

                // STEP 1: Setting the syle when clicked
                $('#' + value).on('click', function(){
                        val = $('#' + value).val().length;
                        if(val == 0){
                            $('#' + value).css('box-shadow','0 1px 2px #D4360E');
                        }
                        else{
                            $('#' + value).css('box-shadow','0 1px 2px  #93C54B');
                        }
                    }
                );

                // STEP 2: Unsetting the style when mouse out
                $('#' + value).focusout(function(){
                    $('#' + value).css('box-shadow','none')
                });
                // STEP3: When actually typing
                $('#' + value).on('input', function() {
                    val = $(this).val().length;
                    if(val == 0){
                        $(this).css('box-shadow','0 1px 2px  #D4360E');
                    }
                    else{
                        $(this).css('box-shadow','0 1px 2px #93C54B');
                    }
                });
            });
        }

        if(check == 'chars-check'){
            //
            // Minimum characters check
            //
            $.each(ids, function( id, value ) {
                //
                // This check it is based on 3 events: onClick,onExit,onChange
                //

                // STEP 1: Setting the syle when clicked
                $('#' + ids[id][0]).on('click', function(){

                        val = $('#' + ids[id][0]).val().length;
                        if(val < length){
                            $('#' + ids[id][0]).css('box-shadow','0 1px 2px #D4360E');
                        }
                        else{
                            $('#' + ids[id][0]).css('box-shadow','0 1px 2px  #93C54B');
                        }
                    }
                );

                // STEP 2: Unsetting the style when mouse out
                $('#' + ids[id][0]).focusout(function(){
                    $('#' + ids[id][0]).css('box-shadow','none')
                });

                // STEP3: When actually typing
                $('#' + ids[id][0]).on('input', function() {
                    val = $(this).val().length;
                    if(val < ids[id][1]){
                        $(this).css('box-shadow','0 1px 2px  #D4360E');
                    }
                    else{
                        $(this).css('box-shadow','0 1px 2px #93C54B');
                    }
                });
            });
        }
    });

}

