const socket = io();

socket.on("realtimeproducts",data => {
    let contenidoHTML= "";

    data.forEach(item => {
        contenidoHTML+= ` <div class="col-md-3 mb-4">
            <div class="card" style="width: 18rem;">
                <img src="${item.thumbnails[0]}" class="card-img-top" alt="${item.title}">
                <div class="card-body">
                    <p><strong>${item.title}</strong></p>
                    <p class="card-text">Precio: ${{price}}</p>
                </div>
            </div>
        </div>`;
    });
})