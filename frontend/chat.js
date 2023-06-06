const msgForm = document.getElementById("messageForm");
const btnSend = document.getElementById("sendBtn");
const token = localStorage.getItem("token");
let loginUserId;
let lastMessageId = localStorage.getItem("lastMessageId") || 0;
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
      loginUserId = res.data.id;
    })
    .catch((err) => {});
});

window.addEventListener("DOMContentLoaded", getMessage);

//setInterval(getMessage, 1000);

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
let chatArray = [];
async function getMessage() {
  document.querySelector(".message-container").innerHTML = "";
  let oldMessages = JSON.parse(localStorage.getItem("messages"));
  if (oldMessages == undefined || oldMessages.length == 0) {
    lastMessageId = 0;
  } else {
    lastMessageId = oldMessages[oldMessages.length - 1].id;
  }

  const res = await axios.get(
    `http://localhost:5000/getMessage?lastMessageId=${lastMessageId}`,
    config
  );
  let newMessages = res.data.data.messages;
  if (oldMessages) {
    chatArray = oldMessages.concat(newMessages);
  } else {
    chatArray = chatArray.concat(newMessages);
  }
  // if (chatArray.length > 10) {
  //   chatArray = chatArray.slice(chatArray.length - 10);
  // }

  localStorage.setItem("messages", JSON.stringify(chatArray));
  chatArray.forEach((chat) => {
    toCreateMessageDiv(chat, loginUserId);
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
