## mfValid - jQuery based form validation plugin

This is a simple yet useful plugin that aims at helping you with client side form validations. 

#### Usage

Javascript initialisation 
``` jquery-css
$(function(){
	    mfValid.init('#loginForm');
})

```

HTML markup and validation rules 
 ```angular2html
<form id="loginForm">
		
	<!-- mfValid Error Box -->
    <div class="mfv-errorBox"></div>
    
    <!-- mfv-checks enables the validation rules -->
    <input type="text" placeholder="Email address" name="email" mfv-checks="required:true;email:true" >
    <input type="password" placeholder="Password" name="password"  mfv-checks="required:true" >
    
    <!-- And mf-action defines the method that should be called if validation succeed -->
    <button type="submit" mfv-action="login.doLogin();">Login</button>

</form>
```

#### Validation rules and callbacks

**Validation Rules:**


* required: boolean *// field is required*
* min: int *// minimum int value*
* max: int *// maximul int value*
* email: string *// check if is valid email*
* emailInDB: boolean *// check if email is database*
* match: string *// match against words *

**Custom functions:**

* .launchCustomError(formID, errors) *// launch an mfValid error*
* .launchSuccessMessage(formID, message) *// launch a success message*
* .successRedirect(page) *// redirect to page *


Note* _This is still a work in progress plugin, but since it is used across couple projects, decided to add it here_
