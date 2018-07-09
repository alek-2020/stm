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

    scrollButtonsToEnd() {
        let container = document.querySelector(".desk-btns__rel-cont");
        let bigDiv = document.querySelector(".desk-btns__cont");
        console.log(
          "скролл",
          container.scrollLeft,
          bigDiv.clientWidth,
          container.offsetWidth
        );
        container.scrollLeft = bigDiv.clientWidth - container.offsetWidth;
      },

    //   let container = document.querySelector(".desk-btns__rel-cont");
    //   let bigDiv = document.querySelector(".desk-btns__cont");
    //   console.log(
    //     "скролл",
    //     container.scrollLeft,
    //     bigDiv.clientWidth,
    //     container.offsetWidth
    //   );
    //         container.scrollLeft = bigDiv.clientWidth - container.offsetWidth;

      
  
}