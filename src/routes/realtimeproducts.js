const socket = io();

socket.on("realtimeproducts", data => {
let contenidoHTML = "";
const productId = document.getElementById("product_id");
const productsList = document.getElementById("productsList");

data.forEach(item => {
    contenidoHTML += `
    <div class="col-md-3 mb-4">
        <div class="card" style="width: 18rem;">
        <img src="${item.thumbnails[0]}" class="card-img-top" alt="${item.title}">
        <div class="card-body">
            <p><strong>${item.title}</strong></p>
            <p class="card-text">Precio: $${item.price}</p>
        </div>
        </div>
    </div>`;

    let option = document.createElement("option");
    option.value = item.id;
    option.innerHTML = "Producto #" + item.id;
    productId.appendChild(option);
});


productsList.innerHTML = contenidoHTML;
});

const agregarProducto = (event) => {
event.preventDefault();  

const nombre = document.getElementById("title").value;
const descripcion = document.getElementById("description").value;
const code = document.getElementById("code").value;
const price = document.getElementById("price").value;
const category = document.getElementById("category").value;
const image = document.getElementById("image").value;

const producto = { 
    title: nombre, 
    description: descripcion, 
    code, 
    price, 
    category, 
    thumbnails: [image]  
};

socket.emit("nuevoProducto", producto);  
};

const eliminarProducto = () => {
const productId = document.getElementById("product_id").value;

if (productId) {
    socket.emit("eliminarProducto", { id: productId });  
} else {
    alert("Por favor selecciona un producto.");
}
};

document.getElementById("addProductForm").addEventListener("submit", agregarProducto);
document.getElementById("deleteProductButton").addEventListener("click", eliminarProducto);
