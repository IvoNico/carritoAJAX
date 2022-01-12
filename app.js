let carritoDeCompras = [] //se crea un array que es donde va a estar los elementos agregador al carrito

let stockProductos = [] //el array que usabamos para llamar al stock ahora lo dejamos vacio
const contenedorProductos = document.getElementById('contenedor-productos')
const contenedorCarrito = document.getElementById('carrito-contenedor')

const contadorCarrito = document.getElementById('contadorCarrito')
const precioTotal = document.getElementById('precioTotal')

const botonTerminar = document.getElementById('terminar')

// FUNCION PARA MOSTRAR LOS PRODUCTOS A LOS CIENTES ---------------------------------------------------------------------------------------------

$.getJSON('stock.json', function (data){
    data.forEach(elemento => stockProductos.push(elemento))

    mostrarProductos(stockProductos)
})


function mostrarProductos(array){
    array.forEach(productos => {
        let divProductos = document.createElement('div')
        divProductos.classList.add('productos')
        divProductos.innerHTML +=`
            <div class="row">
                <div class="col s12 m7">
                    <div class="card">
                        <div class="card-image">
                        <img class="img" src= ${productos.img}>
                        <span class="product-title   white "> ${productos.nombre}</span>
                    </div>
                    <div class="card-content">
                        <p>${productos.descrip}</p>
                        <p>Talle: ${productos.talle}</p>
                        <p>Precio: $${productos.precio}</p>
                    </div>
                    <div class="card-action">
                        <a href="#">NICOLAI</a>
                        <p class="precioproducto" >Precio: $${productos.precio}</p>
                        <a id="boton${productos.id}" class="btn-floating halfway-fab waves-light black"><i class="fas fa-cart-plus"></i></a>
                    </div>
                </div>
            </div>
        </div>
        `
        contenedorProductos.appendChild(divProductos)

        let botonAgregar = document.getElementById(`boton${productos.id}`)
        botonAgregar.addEventListener('click', () =>{
            agregarAlCarrito(productos.id)
            Toastify({
                text: "Producto agregado",
                className: "info",
                style: {
                    background: "green",
                }
            }).showToast();
        })
    });
}
//--------------------------------------------------------------------------------------------------------------------------------------//

//FUNCION PARA AGREGAR LOS PRODUCTOS AL CARRITO------------------------------------------------------------------------------------------//
function agregarAlCarrito(id){
    let verificar = carritoDeCompras.find(elemento => elemento.id == id) //esto se realiza cuando se agrega mas de un mismo producto al carrito
    if(verificar){
        verificar.cantidad = verificar.cantidad + 1
        document.getElementById(`cantidad${verificar.id}`).innerHTML = `<p id="cantidad${verificar.id}">Cantidad:${verificar.cantidad}</p>`
        ActualizarCarrito()
    }else{
        let productoAgregar = stockProductos.find(productos => productos.id == id)//busca un solo elemnto del array

    carritoDeCompras.push(productoAgregar)

    ActualizarCarrito()
    let div = document.createElement('div')
    div.classList.add('productoEnCarrito')
    div.innerHTML += `
        <p>${productoAgregar.nombre}</p>
        <p>Precio: $${productoAgregar.precio}</p>
        <p id="cantidad${productoAgregar.id}">Cantidad: ${productoAgregar.cantidad}</p>
        <button class="boton-eliminar" id='eliminar${productoAgregar.id}'><i class="btneliminar fas fa-trash-alt"></i></button>
    `
    contenedorCarrito.appendChild(div)

    let botonEliminar = document.getElementById(`eliminar${productoAgregar.id}`)

    botonEliminar.addEventListener('click', ()=>{
        if(productoAgregar.cantidad == 1){
            botonEliminar.parentElement.remove()//elimina el elemtno HTML
            carritoDeCompras = carritoDeCompras.filter(elemento => elemento.id != productoAgregar.id)//trae un array nuevo con los id diferentes al boton eliminar que se esta seleccionando
            ActualizarCarrito()
        }else{
            productoAgregar.cantidad = productoAgregar.cantidad - 1
            document.getElementById(`cantidad${productoAgregar.id}`).innerHTML = `<p id="cantidad${productoAgregar.id}">Cantidad:${productoAgregar.cantidad}</p>`
            ActualizarCarrito()
        }
        
    })
    }
}
//-------------------------------------------------------------------------------------------------------------------------------------------//
//FUNCION PARA ACTUALIZAR EL CARRITO---------------------------------------------------------------------------------------------------------//
function ActualizarCarrito(){
    contadorCarrito.innerText = carritoDeCompras.reduce((acumulador, elemento) => acumulador + elemento.cantidad, 0)
    precioTotal.innerText = carritoDeCompras.reduce((acumulador, elemento)=> acumulador + (elemento.precio * elemento.cantidad), 0)
}

//finalizar compra

botonTerminar.innerHTML= '<a id="finalizar" class="waves-effect waves-light btn modal-trigger" href="#modal1">Checkout</a>'


    $('#finalizar').on('click',()=>{
        $.post("https://jsonplaceholder.typicode.com/posts", JSON.stringify(carritoDeCompras), function(data, estado){
        console.log(data, estado)
        if(estado){
            $('#carrito-contenedor').empty()//vacia el elemento
            $('#carrito-contenedor').append('<h5>Su pedido fue procesado exitosamente</h5>')
            carritoDeCompras = []
            localStorage.clear()//vaciar el localStorage
            ActualizarCarrito()
        }
    })
})
