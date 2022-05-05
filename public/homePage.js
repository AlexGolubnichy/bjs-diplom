'use strict'
const logout = new LogoutButton();
logout.action = exit => ApiConnector.logout(response => {
    if (response.success) {
        location.reload();
    }
});

ApiConnector.current(current => {
    if (current.success) {
        ProfileWidget.showProfile(current.data);
    }
});

const rates = new RatesBoard();
function ratesUpdate() {
    ApiConnector.getStocks(response => {
        if (response.success) {
            rates.clearTable();
            rates.fillTable(response.data);
        }
    });
}

ratesUpdate();
setTimeout(ratesUpdate, 60000);


const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = credit => ApiConnector.addMoney(credit, response => {
    if (response.success) {
        moneyManager.addMoneyAction();
        ProfileWidget.showProfile(response.data);
        return moneyManager.setMessage(true, 'Успешное пополнение счета на' + credit.currency + credit.amount);;
    }
    return moneyManager.setMessage(false, 'Ошибка: ' + response.error);
});

moneyManager.conversionMoneyCallback = exchange => ApiConnector.convertMoney(exchange, response => {
    if (response.success) {
        moneyManager.conversionMoneyAction();
        ProfileWidget.showProfile(response.data);
        return moneyManager.setMessage(true, 'Успешная конвертация суммы ' + exchange.fromCurrency + exchange.fromAmount);
    }
    return moneyManager.setMessage(false, 'Ошибка: ' + response.error);
});

moneyManager.sendMoneyCallback = debit => ApiConnector.transferMoney(debit, response => {
    if (response.success) {
        moneyManager.sendMoneyAction();
        ProfileWidget.showProfile(response.data);
        return moneyManager.setMessage(true, 'Успешный перевод ' + debit.currency + debit.amount + ' получателю ' + debit.to);
    }
    return moneyManager.setMessage(false, 'Ошибка: ' + response.error);
});

const favorite = new FavoritesWidget();

ApiConnector.getFavorites(response => {
    if (response.success) {
        favorite.clearTable();
        favorite.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
 });

 favorite.addUserCallback = addUser => ApiConnector.addUserToFavorites(addUser, response => {
    if (response.success) {
        favorite.clearTable();
        favorite.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
        return moneyManager.setMessage(true, 'Добавлен новый пользователь #' + addUser.id + ': ' + addUser.name);
    }
    return moneyManager.setMessage(false, 'Ошибка: ' + response.error);
});

favorite.removeUserCallback = deletedUser => ApiConnector.removeUserFromFavorites(deletedUser, response => {
    if (response.success) {
        favorite.clearTable();
        favorite.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
        return moneyManager.setMessage(true, 'Пользователь ' + deletedUser + ' удален');
    }
    return moneyManager.setMessage(false, 'Ошибка: ' + response.error);
});