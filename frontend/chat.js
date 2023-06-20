const msgForm = document.getElementById("messageForm");
const btnSend = document.getElementById("sendBtn");
const createGroupBtn = document.getElementById("createGroupBtn");
const token = localStorage.getItem("token");
let loginUserId;
let lastMessageId = localStorage.getItem("lastMessageId") || 0;
let groupName;

let chatArray = [];
let groupId;
const config = {
  headers: {
    Authorization: token,
  },
};

window.addEventListener("DOMContentLoaded", async () => {
  await axios
    .get("http://localhost:5000/", config)
    .then((res) => {
      document.getElementById("show_login_user_name").innerHTML =
        res.data.userName;
      loginUserId = res.data.id;
      document.getElementById("sendMessageDiv").style.display = "none";
    })
    .catch((err) => {
      console.log(err);
    });

  await axios
    .get("http://localhost:5000/getGroup", config)
    .then((res) => {
      const results = res.data.results;
      for (let i = 0; i < results.length; i++) {
        createGroupList(results[i]);
      }
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
});
const chatList = document.getElementById("mychat-list-container");
function createGroupList(data) {
  const groupButton = document.createElement("button");
  groupButton.type = "button";
  groupButton.className = "list-group-item list-group-item-action";
  groupButton.id = `${data.id}`;

  groupButton.appendChild(document.createTextNode(`${data.groupName}`));

  groupButton.addEventListener("click", async () => {
    groupMessageDiv(data.id, data.groupName);
  });

  chatList.appendChild(groupButton);
}

async function groupMessageDiv(gId, gName) {
  //check for admin

  groupId = gId;
  groupName = gName;
  console.log(groupId, groupName);
  document.getElementById("show_group_name").innerHTML = `${groupName}`;
  document.querySelector(".message-container").innerHTML = "";
  document.getElementById("sendMessageDiv").style.display = "block";
  document.getElementById("groupMenuButton").style.display = "block";

  await axios
    .get(`http://localhost:5000/isAdmin?groupId=${groupId}`, config)
    .then((res) => {
      const userIsAdmin = res.data.isUserAdmin;
      console.log(userIsAdmin);
      if (userIsAdmin === "true") {
        console.log("user is admin");
      } else {
        console.log(`user is not admin`);
      }
      console.log("click");
      chatArray = [];
      getMessage(groupId, groupName);
    })
    .catch((err) => {
      console.log(err);
    });
}

//setInterval(getMessage, 1000);

//sendMessage
msgForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const messageText = document.getElementById("messageText").value;
  console.log(groupId, groupName);
  const data = { messageText: messageText, groupId: groupId };

  axios
    .post("http://localhost:5000/sendMessage", data, config)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
  document.getElementById("messageText").value = "";
});

//getMessage
async function getMessage(groupId, groupName) {
  document.querySelector(".message-container").textContent = "";
  let oldMessages = JSON.parse(localStorage.getItem(`messages${groupId}`));
  if (oldMessages == undefined || oldMessages.length == 0) {
    lastMessageId = 0;
  } else {
    lastMessageId = oldMessages[oldMessages.length - 1].id;
  }

  const res = await axios.get(
    `http://localhost:5000/getMessage?lastMessageId=${lastMessageId}&groupId=${groupId}`,
    config
  );
  console.log(res);
  let newMessages = res.data.data.messages;

  if (oldMessages) {
    chatArray = oldMessages.concat(newMessages);
  } else {
    chatArray = chatArray.concat(newMessages);
  }
  // if (chatArray.length > 10) {
  //   chatArray = chatArray.slice(chatArray.length - 10);
  // }

  localStorage.setItem(`messages${groupId}`, JSON.stringify(chatArray));
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
  checkbox.setAttribute("name", "users");
  checkbox.setAttribute("value", data.name);

  listItem.appendChild(checkbox);
  listItem.appendChild(label);

  userListDiv.appendChild(listItem);
}

const groupModal = document.getElementById("createGroupModal");
//create group
document
  .getElementById("btnCreateGroupInModal")
  .addEventListener("click", createGroup);
function createGroup() {
  const groupName = document.getElementById("groupName").value;
  if (groupName.length < 5) {
    console.log("group name should be above 5 words ");
  } else {
    const checkboxes = document.getElementsByName("users");
    const selectedValues = [];
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const checkedData = {
          id: checkbox.id,
          value: checkbox.value,
        };
        selectedValues.push(checkedData);
      }
    });
    const data = { groupName: groupName, members: selectedValues };

    axios
      .post("http://localhost:5000/createGroup", data, config)
      .then((res) => {
        console.log(res);
        document.getElementById("groupName").value = "";
        document.getElementById("user-list-modal").innerHTML = "";
        $(groupModal).modal("hide");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
//to remove userlist from modal when modal dismiss
groupModal.addEventListener("hidden.bs.modal", () => {
  document.getElementById("user-list-modal").innerHTML = "";
});
