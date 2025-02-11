const socket= io();

socket.on ("realtimeproducts", data=> {
let contenidoHTML= "<ul>";

data.forEach(item => {
contenidoHTML += "<li>" + item.title + "<li>";
    
});
contenidoHTML+= "<ul>";
document.getElementById("content").innerHTML = contenidoHTML;
})
