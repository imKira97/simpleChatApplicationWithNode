const msgForm = document.getElementById("messageForm");
const btnSend = document.getElementById("sendBtn");
const token = localStorage.getItem("token");
const config = {
  headers: {
    Authorization: token,
  },
};

window.addEventListener("DOMContentLoaded", () => {
  axios
    .get("http://localhost:5000/", config)
    .then((res) => {
      document.getElementById("show_login_user_name").innerHTML =
        res.data.userName;
    })
    .catch((err) => {});
});

window.addEventListener("DOMContentLoaded", getMessage);

setInterval(getMessage, 1000);

//sendMessage
msgForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const messageText = document.getElementById("messageText").value;
  const data = { messageText: messageText };

  axios
    .post("http://localhost:5000/sendMessage", data, config)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
  document.getElementById("messageText").value = "";
  getMessage();
});

//getMessage
let lastMessageId = 0;
function getMessage() {
  axios
    .get("http://localhost:5000/getMessage", config)
    .then((res) => {
      console.log(res);
      const loginUserId = res.data.data.loginUser;
      const message = res.data.data.messages;
      for (let i = 0; i < message.length; i++) {
        if (message[i].id > lastMessageId) {
          toCreateMessageDiv(message[i], loginUserId);
        }
      }
      if (message.length > 0) {
        lastMessageId = message[message.length - 1].id;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

//to create message box in UI
function toCreateMessageDiv(message, userId) {
  const messageContainer = document.querySelector(".message-container");
  const chatDiv = document.createElement("div");
  if (userId === message.userid) {
    chatDiv.className = "message right";
    chatDiv.innerHTML = `${message.user}: ${message.message}`;
  } else {
    chatDiv.className = "message left";
    chatDiv.innerHTML = `${message.user}:${message.message}`;
  }
  messageContainer.appendChild(chatDiv);
}
