const socket = io();

function joinRoom() {
  const name = document.getElementById("name").value;
  const room = document.getElementById("room").value;

  if (!name || !room) {
    alert("أدخل الاسم و Room ID");
    return;
  }

  socket.emit("joinRoom", { name, room });

  document.getElementById("login").style.display = "none";
  document.getElementById("waiting").style.display = "block";

  window.currentRoom = room;
}

socket.on("playersList", players => {
  const list = document.getElementById("players");
  list.innerHTML = "";

  players.forEach(p => {
    let li = document.createElement("li");
    li.innerText = p;
    list.appendChild(li);
  });
});

function startGame() {
  socket.emit("startGame", window.currentRoom);
}

socket.on("yourRole", role => {
  document.getElementById("waiting").style.display = "none";
  document.getElementById("roleBox").style.display = "block";

  const roleDiv = document.getElementById("role");
  roleDiv.innerText = role;

  if (role === "خائن") roleDiv.style.background = "#c0392b";
  if (role === "جاسوس") roleDiv.style.background = "#2980b9";
  if (role === "مواطن") roleDiv.style.background = "#27ae60";
});
