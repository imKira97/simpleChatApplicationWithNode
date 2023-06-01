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
