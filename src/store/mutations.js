export default {
      //Получим параметры аккаунта
      getUser(state) {
        firebase
            .database()
            .ref("users/" + state.userIdBro)
            .once("value")
            .then(data => {
                console.log("Получили ", data);
                state.tableList = data;
            })
            .catch(error => {
                console.log("Не получили ", error);
            });
    },
}