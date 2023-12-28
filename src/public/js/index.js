const socket = io();


let username;
Swal.fire({
    title : "identificate",
    input :"text",
    text : "ingresa tu nombre de usuario",
    inputValidator : (value)=>{
        return !value && " es obligatorio ingresar un nombre de usuario"
    },
    allowOutsideClick : false,
}).then((result) => {
    username = result.value;
    socket.emit("neew-user", username);
    console.log(username)
})

const chatInput = document.getElementById("chat-input");

chatInput.addEventListener("keyup", (ev)=>{
    if(ev.key === "Enter"){
        const inputMessage = chatInput.value;
        if(inputMessage.trim().length > 0){
            socket.emit("chat-message", {username,message : inputMessage});
            chatInput.value = "";
        }
    }
})

const messagesPanel = document.getElementById("messages-panel");

socket.on("messages", (data)=>{
    let messages = "";

    data.forEach((m)=>{
        messages += `<b>${m.username}</b>${m.message}</br>`;
    })
    messagesPanel.innerHTML = messages;
})

socket.on("new-user", (username)=>{
    Swal.fire({
        title :`${username} se unio al chat`,
        toast : true,
        position : "top-end"
    });
})