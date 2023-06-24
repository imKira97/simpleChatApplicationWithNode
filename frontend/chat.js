<<<<<<< HEAD
//messageForm
const msgForm = document.getElementById("messageForm");
const btnSend = document.getElementById("sendBtn");

//all chat
const userListDiv = document.getElementById("mychat-list-container");

//reciever

let recieverName = 0;
let recieverId = 0;

const token = localStorage.getItem("token");
=======
const msgForm = document.getElementById("messageForm");
const btnSend = document.getElementById("sendBtn");
const createGroupBtn = document.getElementById("createGroupBtn");
const token = localStorage.getItem("token");
let loginUserId;
let lastMessageId = localStorage.getItem("lastMessageId") || 0;
let groupName;

let chatArray = [];
let groupId;
>>>>>>> settingGroup
const config = {
  headers: {
    Authorization: token,
  },
};

<<<<<<< HEAD
// //show login users
// window.addEventListener("DOMContentLoaded", () => {
//   axios
//     .get("http:localhost:5000/user/getUser", config)
//     .then((res) => {
//       const userList = res.data.userList;
//       const loginUserName = res.data.loginUser;
//       document.getElementById("show_login_user_name").innerHTML = loginUserName;

//       for (let i = 0; i < userList.length; i++) {
//         toCreateListItem(res.data.userList[i]);
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

//search will happen on keyup and btn click also
const searchBtn = document.getElementById("searchGroupBtn");
searchBtn.addEventListener("click", searchFun);

document.getElementById("searchText").addEventListener("keyup", searchFun);

//searchContainer
const searchResultsContainer = document.getElementById(
  "searchResultsContainer"
);
// Add event listener to the document object
document.addEventListener("click", function (event) {
  const searchInput = document.getElementById("searchText");
  const searchResultsContainer = document.getElementById(
    "searchResultsContainer"
  );

  // Check if the clicked element is outside the search input and the result container
  if (event.target !== searchInput && event.target !== searchResultsContainer) {
    // Hide the search result container
    searchResultsContainer.style.display = "none";
  }
});

//searching
function searchFun() {
  const searchName = document.getElementById("searchText").value;
  searchResultsContainer.innerHTML = "";

  axios
    .get(`http://localhost:5000/searchUser?search=${searchName}`, config)
    .then((res) => {
      const searchResults = res.data.user;

      searchResults.forEach((result) => {
        const resultItem = document.createElement("div");
        resultItem.classList.add("search-result");

        const title = document.createElement("h3");
        title.classList.add("search-result-title");
        title.textContent = result.name;

        resultItem.appendChild(title);

        // Add a click event listener to each search result item
        resultItem.addEventListener("click", () => {
          // Retrieve the user ID or any other identifier associated with the clicked result item
          recieverName = result.name;
          recieverId = result.id;

          // Perform desired action with the retrieved identifier
          openChatWindow(recieverName, recieverId); // Replace this with your desired action
        });

        searchResultsContainer.appendChild(resultItem);
      });
      // Show or hide the search results container based on the search text
      if (searchName.length > 0 && searchResults.length > 0) {
        searchResultsContainer.style.display = "block";
      } else {
        searchResultsContainer.style.display = "none";
      }
=======
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

      if (userIsAdmin === "true") {
        createGroupOptions(true);
      } else {
        createGroupOptions(false);
      }
      chatArray = [];
      getMessage(groupId, groupName);
>>>>>>> settingGroup
    })
    .catch((err) => {
      console.log(err);
    });
}

<<<<<<< HEAD
//open chat window
function openChatWindow(userName, userId) {
  const messageContainer = document.querySelector(".message-container");
  messageContainer.innerHTML = "";

  // Create chat window elements
  const chatWindow = document.createElement("div");
  chatWindow.classList.add("chat-window");

  const chatHeader = document.createElement("div");
  chatHeader.classList.add("chat-header");
  chatHeader.id = `${userId}`;
  chatHeader.textContent = userName;

  // Append chat window elements to the message container
  chatWindow.appendChild(chatHeader);

  messageContainer.appendChild(chatWindow);
  lastMessageId = 0;
  recieverName = userName;
  recieverId = userId;
  startMessageInterval(recieverName, recieverId);
}

//send Message
msgForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const messageText = document.getElementById("messageText").value;
  const recipientId = document.querySelector(".chat-header").id;
  console.log(recipientId);
  const data = { messageText: messageText, recipientId: recipientId };
=======
function createGroupOptions(isAdmin) {
  const groupOptionMenuItems = document.getElementById("optionsMenuItems");
  groupOptionMenuItems.innerHTML = "";

  if (isAdmin) {
    const addUser = createMenuItem(
      "Add User",
      "addUser",
      "#addUserModal",
      addUserToGroup
    );

    groupOptionMenuItems.appendChild(addUser);
  }
  const showAllUser = createMenuItem(
    "Show All User",
    "displayAllUser",
    "#showAllUserModal",
    displayAllUser
  );
  const exitGroup = createMenuItem(
    "Exit Group ",
    "exitGroup",
    null,
    exitFromGroup
  );

  groupOptionMenuItems.appendChild(showAllUser);
  groupOptionMenuItems.appendChild(exitGroup);
}
function createMenuItem(label, id, target, callback) {
  const menuItem = document.createElement("button");
  menuItem.classList.add("dropdown-item");
  menuItem.type = "button";
  menuItem.innerText = label;
  menuItem.id = id;
  if (target) {
    menuItem.setAttribute("data-bs-toggle", "modal");
    menuItem.setAttribute("data-bs-target", target);
  }
  menuItem.addEventListener("click", callback);

  return menuItem;
}
//all function
function addUserToGroup() {
  axios
    .get(`http://localhost:5000/usersNotInGroup?groupId=${groupId}`, config)
    .then((res) => {
      document.getElementById("new-user-list-modal").innerHTML = "";
      const newUsers = res.data.data;
      console.log(newUsers);
      newUsers.forEach((users) => {
        showNewUserList(users);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
function showNewUserList(data) {
  const userListDiv = document.getElementById("new-user-list-modal");
  const listItem = document.createElement("div");
  listItem.classList.add("list-group-item");
  listItem.style.fontWeight = "bold";
  const label = document.createElement("label");
  label.setAttribute("for", data.id);
  label.textContent = data.name;

  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", data.id);
  checkbox.setAttribute("name", "newUsers");
  checkbox.setAttribute("value", data.name);

  listItem.appendChild(checkbox);
  listItem.appendChild(label);

  userListDiv.appendChild(listItem);
}

//add new user
function addNewUsersInGroup() {
  console.log("group " + groupId);
  const checkboxes = document.getElementsByName("newUsers");
  const selectedValues = [];
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const checkedData = {
        id: checkbox.id,
        name: checkbox.value,
      };
      selectedValues.push(checkedData);
    }
  });
  const newUserData = { groupId: groupId, newMembers: selectedValues };
  axios
    .post(`http://localhost:5000/addNewUser`, newUserData, config)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

function exitFromGroup() {
  console.log("exit");
  axios
    .post(
      "http://localhost:5000/exitUserFromGroup",
      { groupId: groupId },
      config
    )
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}
function displayAllUser() {
  axios
    .get(`http://localhost:5000/getAllUserFromGroup?groupId=${groupId}`, config)
    .then((res) => {
      const users = res.data.data;
      console.log(users);

      const groupUserList = document.getElementById("userListInGroup");
      groupUserList.innerHTML = "";
      users.forEach((user) => {
        const listItem = document.createElement("li");
        listItem.textContent = user.name;
        listItem.id = user.id;
        if (user.isAdmin) {
          listItem.style.color = "red";
        }
        if (!user.isAdmin) {
          const makeAdminButton = document.createElement("button");
          makeAdminButton.textContent = "Make Admin";
          makeAdminButton.classList.add(
            "btn",
            "btn-outline-secondary",
            "btn-sm"
          );
          makeAdminButton.style.marginLeft = "5px";

          makeAdminButton.addEventListener("click", () => {
            makeAdmin(user.id); // Call the makeAdmin function passing the user id
          });

          const removeUserBtn = document.createElement("button");
          removeUserBtn.textContent = "Remove User";
          removeUserBtn.classList.add("btn", "btn-outline-secondary", "btn-sm");
          removeUserBtn.style.marginLeft = "5px";

          removeUserBtn.addEventListener("click", () => {
            removeUser(user.id);
          });
          listItem.appendChild(makeAdminButton);
          listItem.appendChild(removeUserBtn);
        }

        // Append the "Make Admin" button to the list item

        groupUserList.appendChild(listItem);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function makeAdmin(userId) {
  const data = { userId: userId, groupId: groupId, groupName: groupName };
  axios
    .put("http://localhost:5000/makeUserAdmin", data, config)
    .then((res) => {
      console.log(res);
      $("#showAllUserModal").modal("hide");
    })
    .catch((err) => {
      console.log(err);
    });
}
function removeUser(userId) {
  const data = { userId: userId, groupId: groupId };
  axios
    .put("http://localhost:5000/removeUser", data, config)
    .then((res) => {
      console.log(res);
      $("#showAllUserModal").modal("hide");
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
>>>>>>> settingGroup

  axios
    .post("http://localhost:5000/sendMessage", data, config)
    .then((res) => {
      console.log(res);
<<<<<<< HEAD
      getMessage(res.data.recUser, res.data.recId);
    })
    .catch((err) => {
      console.log(`err`);
=======
    })
    .catch((err) => {
      console.log(err);
>>>>>>> settingGroup
    });
  document.getElementById("messageText").value = "";
});

<<<<<<< HEAD
function startMessageInterval(recieverName, receiverId) {
  getMessage(recieverName, receiverId);
  // Call getMessage every 1 second
  setInterval(() => {
    getMessage(recieverName, receiverId);
  }, 1000);
}

//get Message

let lastMessageId = 0;
function getMessage(recieverName, receiverId) {
  const reciever = recieverName;
  axios
    .get(`http://localhost:5000/getMessage?reciever=${reciever}`, config)
    .then((res) => {
      const senderName = res.data.chatData.senderName;
      const recieverName = res.data.chatData.recieverName;
      const messages = res.data.chatData.messageData;

      for (let i = 0; i < messages.length; i++) {
        if (messages[i].id > lastMessageId) {
          toCreateMessageDiv(messages[i], receiverId, recieverName, senderName);
        }
      }
      if (messages.length > 0) {
        lastMessageId = messages[messages.length - 1].id;
=======
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
>>>>>>> settingGroup
      }
    })
    .catch((err) => {
      console.log(err);
    });
<<<<<<< HEAD
}

function toCreateMessageDiv(chatData, userId, recieverName, senderName) {
  const messageContainer = document.querySelector(".message-container");
  const chatDiv = document.createElement("div");
  if (chatData.recieverId === userId) {
    chatDiv.className = "message right";
    chatDiv.innerHTML = `${senderName}: ${chatData.chat}`;
  } else {
    chatDiv.className = "message left";
    chatDiv.innerHTML = `${recieverName}: ${chatData.chat}`;
  }
  messageContainer.appendChild(chatDiv);
}

function toCreateListItem(data) {
  const listUser = document.createElement("button");
  listUser.type = "button";
  listUser.className = "list-group-item list-group-item-action";
  listUser.id = `${data.id}`;
  listUser.appendChild(document.createTextNode(`${data.name}`));
  userListDiv.appendChild(listUser);
}
=======
});

function toCreateUserListItem(data) {
  const userListDiv = document.getElementById("user-list-modal");
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
>>>>>>> settingGroup
