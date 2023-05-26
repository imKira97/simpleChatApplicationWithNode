//messageForm
const msgForm = document.getElementById("messageForm");
const btnSend = document.getElementById("sendBtn");

//all users
const userListDiv = document.getElementById("user-list-container");

const token = localStorage.getItem("token");
const config = {
  headers: {
    Authorization: token,
  },
};

//show login users
window.addEventListener("DOMContentLoaded", () => {
  axios
    .get("http:localhost:5000/user/getUser", config)
    .then((res) => {
      const userList = res.data.userList;
      const loginUserName = res.data.loginUser;
      document.getElementById("show_login_user_name").innerHTML = loginUserName;

      for (let i = 0; i < userList.length; i++) {
        toCreateListItem(res.data.userList[i]);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

//send Message
msgForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const messageText = document.getElementById("messageText").value;
  const dateTime = new Date();
  const data = { messageText: messageText, dateTime: dateTime };

  axios
    .post("http://localhost:5000/sendMessage", data, config)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(`err`);
    });
  document.getElementById("messageText").value = "";
});

function toCreateListItem(data) {
  const listUser = document.createElement("button");
  listUser.type = "button";
  listUser.className = "list-group-item list-group-item-action";
  listUser.id = `${data.id}`;
  listUser.appendChild(document.createTextNode(`${data.name}`));
  userListDiv.appendChild(listUser);
}
