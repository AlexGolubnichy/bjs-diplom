'use strict'
const userForm = new UserForm();
userForm.loginFormCallback = data => ApiConnector.login(data, response => {
    if (!response.success) {
        return userForm.setLoginErrorMessage(response.error);
    }
    userForm.loginFormAction(response);
    location.reload();
    return;
});

userForm.registerFormCallback = newData => ApiConnector.register(newData, response => {
    if (!response.success) {
        return userForm.setRegisterErrorMessage(response.error);
    }
    userForm.registerFormAction(response);
    location.reload();
    return;
});