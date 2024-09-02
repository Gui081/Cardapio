const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItensContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checKoutBtn= document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCount = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];


//ABRIR O MODAL DO CARRINHO
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = 'flex'
   
})

//FECHAR O MODAL DO CARRRINHO CLICAR NO BOTAO FECHAR
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = 'none'
})

//FECHAR O MODAL QUANDO CLICAR FORA
cartModal.addEventListener("click", function(envent){
    if(envent.target === cartModal){
        cartModal.style.display = 'none'
    }
    
})

menu.addEventListener("click", function(event){
    //console.log(event.target) //classe sempre comeca com ponto e id com #
    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
       

        //Adiconar no carrinho

    }
})
//OBS:Arrey é lista de itens

//Funcao para adiconar no carrinho
//find ele e um metodo do js que vai percorrer a lista
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)
    //Se o item existe aumenta a quantidade
    if(existingItem){
    existingItem.quantity +=1;
}else{
   
    //push é adicionar
    cart.push({
        name,
        price,
        quantity: 1,
    })
    
}
updateCartModal()
}



//Atualizar o carrinho 

function updateCartModal(){
   cartItensContainer.innerHTML = "";
   let total = 0;
//forEach ele vai baiscamente percorrer toda a nossa lista tipo um loop
   cart.forEach(item => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col" )
    //acessando a nova div que acabou de criar
    cartItemElement.innerHTML = `
    <div class ="flex justify-between "itens-center">
      <div>
    <p class ="font-medium mb-2">${item.name}</p> 
    <p class ="font-medium, mb-2">R$ ${item.price.toFixed(2)}</p>
    <p class = "font-medium">Quantidade: ${item.quantity}</p>
    </div>
    
       <button class= "remove-from-cart-btn" data-name ="${item.name}">
       Remover
    </button>
 </div>
    `
//toFixed adiconar 2 casas decimal

 total += item.price * item.quantity;
 //+= pegar o valor que ja e somar

//appendChild ou seja vou colocar um item dentro
cartItensContainer.appendChild(cartItemElement)
   })

 cartTotal.textContent = total.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL"
 });

 cartCount.innerHTML = cart.length;
 //length ele acessar a quantidade de itens na lista

}


//Remover item do carrinho
cartItensContainer.addEventListener("click", function(event){
 if(event.target.classList.contains("remove-from-cart-btn")){
    const name = event.target.getAttribute("data-name")
    /*getAttribute pegar o atributo que voce mandou dentro do
    data-name ou seja o nome do item que voce selecionou*/

    removeItemsCart(name);
   
 }
})

function removeItemsCart(name){

    const index = cart.findIndex(item => item.name === name);

//if(item.quantity > 1): Verifica se a quantidade do item é maior que 1.
//item.quantity -= 1;: Se a quantidade for maior que 1, diminui a quantidade do item em 1.
/* updateCartModal();: Após a quantidade ser diminuída, 
essa função é chamada para atualizar a interface do carrinho*/

    if(index != -1){
      const item = cart[index];
    if(item.quantity > 1){
        item.quantity -=1;
    updateCartModal();
    return;

  }

  cart.splice(index, 1);
  //splice ele pega a posicao que a gente esta mandando e remove esse item
  updateCartModal();


    }
}
//esse event dentro do function e para manipular ele
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")
    
    }


})

//Finalizar pedido
checKoutBtn.addEventListener("click", function(){

const isOpen = checkRestauranteOpen();
  if(!isOpen){// ! quer dizer negacao

 
Toastify({
    text: "Ops o restaurante esta fechado",
    duration: 3000,
    close: true,// quer dizer que pode fechar ele
    gravity: "top", // ele sempre vai esta no topo
    position: "right", // a posicao aonde o aviso/alert vai ficar
    stopOnFocus: true, // e para quando passar o mouse o aviso nao saia
    style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    onClick: function(){} // Callback after click
    }).showToast();//exibir o Toast


  return;
  }
    if(cart.length === 0) return;

    if(addressInput.value === ""){
    addressWarn.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
    return;
 }

//Enviar pedido para api Whats

const cartItems = cart.map((item) =>{
    const formattedPrice = item.price.toFixed(2)
    return(
        `${item.name} Quantidade: (${item.quantity}) Preco: R$${item.price} |`
    )
  }).join("")

  const message = encodeURIComponent(cartItems)
  const phone = "5581984885092"

/*carregar uma nova URL no navegador,abrir uma nova janela ou aba no navegador 
para iniciar uma conversa no WhatsApp usando uma URL com um número de telefone.*/
  window.open(`https://wa.me/${phone}?text=${message} Endereco: ${addressInput.value}`, "_black") //aqui a gente quer usar uma vairavel ao inves de "" usa ``
   //esse _black e para abrir em uma guia nova do navegador

   //limpar carrinho, passando um arrey vazio
   cart = [];
   updateCartModal();
})

//verificar a hora e manipular o card do horario
function checkRestauranteOpen(){
    const data = new Date();//o new date do js vai gera a data de hoje
    const hora = data.getHours(); //getHours vai devolver a hora que a gente esta
    return hora >= 19 && hora < 23; //true o restaurante esta aberto

}

const spanItem = document.getElementById("data-span")
const isOpen = checkRestauranteOpen();//esta pegando o checkRestauranteOpen

if(isOpen){ //se estiver aberto ele tira o vermelho e ficar o verde
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-gree-600")
}else{ //se estiver fechado ele tira o verde e ficar o vermelho
    spanItem.classList.remove("bg-gree-600")
    spanItem.classList.add("bg-red-500")
}





