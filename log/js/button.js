const LogUploadBtn = document.getElementById("LogUploadBtn");
const LogUploadDialog = document.getElementById("LogUploadDialog");
let parsed = false;

LogUploadBtn.addEventListener("click", () => {
  LogUploadDialog.style.display = "block";
});

const closeBtns = document.getElementsByClassName("closeBtn");

function closeClosestDialog(element) {
  const dialog = element.closest(".dialog");
  dialog.style.display = "none";
}

Array.from(closeBtns).forEach((btn) => {
  btn.addEventListener("click", () => {
    closeClosestDialog(btn);
  });
});

const ShowLobbyChatBtn = document.getElementById("ShowLobbyChatBtn");
ShowLobbyChatBtn.addEventListener("click", () => {
  loadChatFromRoom("로비", lobbyChat);
});

const LogConfirmBtn = document.getElementById("LogConfirmBtn");
LogConfirmBtn.addEventListener("click", () => {
  if (parsed) location.reload();

  const FileInput = document.getElementById("FileInput");
  const file = FileInput.files[0];
  const roomListTitle = document.querySelector(".RoomListTitle");
  roomListTitle.innerText = `Log | 방 목록 (${file.name})`;

  if (file) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const logContent = event.target.result;
      setLogContent(logContent);
    };

    reader.readAsText(file);

    closeClosestDialog(LogConfirmBtn);

    setTimeout(() => {
      parseLog();
      parsed = true;
    }, 100);
  } else {
    alert("파일을 선택하세요.");
  }
});
