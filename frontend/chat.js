//messageForm
const msgForm = document.getElementById("messageForm");
const btnSend = document.getElementById("sendBtn");

//all chat
const userListDiv = document.getElementById("mychat-list-container");

//reciever

let recieverName = 0;
let recieverId = 0;

const token = localStorage.getItem("token");
const config = {
  headers: {
    Authorization: token,
  },
};

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
    })
    .catch((err) => {
      console.log(err);
    });
}

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
  startMessageInterval(recieverName, recieverId);
}

//send Message
msgForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const messageText = document.getElementById("messageText").value;
  const recipientId = document.querySelector(".chat-header").id;
  console.log(recipientId);
  const data = { messageText: messageText, recipientId: recipientId };

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

function startMessageInterval(recieverName, receiverId) {
  // Call getMessage initially
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
      }
    })
    .catch((err) => {
      console.log(err);
    });
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
