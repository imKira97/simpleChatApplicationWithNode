//messageForm
const msgForm = document.getElementById("messageForm");
const btnSend = document.getElementById("sendBtn");

const token = localStorage.getItem("token");
const config = {
  headers: {
    Authorization: token,
  },
};
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
