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
window.addEventListener("DOMContentLoaded", () => {
  axios
    .get("http://localhost:5000/getMessage", config)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
});
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
});
