const msgForm = document.getElementById("messageForm");
const btnSend = document.getElementById("sendBtn");
const createGroupBtn = document.getElementById("createGroupBtn");
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
  document.querySelector(".message-container").textContent = "";
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

createGroupBtn.addEventListener("click", () => {
  axios
    .get("http:localhost:5000/getUserList", config)
    .then((res) => {
      const userList = res.data.userList;
      console.log(userList);
      for (let i = 0; i < userList.length; i++) {
        toCreateUserListItem(res.data.userList[i]);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

const userListDiv = document.getElementById("user-list-modal");
function toCreateUserListItem(data) {
  const listItem = document.createElement("div");
  listItem.classList.add("list-group-item");

  const label = document.createElement("label");
  label.setAttribute("for", data.id);
  label.textContent = data.name;

  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", data.id);
  checkbox.setAttribute("value", data.name);

  listItem.appendChild(checkbox);
  listItem.appendChild(label);

  userListDiv.appendChild(listItem);
}
