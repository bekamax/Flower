// navbar btn
const signUpTriger = document.querySelector("#signUpTriger");
const logInTriger = document.querySelector("#logInTriger");
const logOutTriger = document.querySelector("#logOutTriger");
const addProductTriger = document.querySelector("#addProductTriger");
const username = document.querySelector("#name");
const searchInp = document.querySelector("#searchInp");
//modal
const modal = document.querySelector(".modal");
const overlov = document.querySelector(".overlov");
const singUp = document.querySelector(".singUp");
const logIn = document.querySelector(".logIn");
const addProductModal = document.querySelector(".addProductModal");
const form = document.querySelector(".form");
const addForm = document.querySelector(".addForm");
//! signUp
const nameInpReg = document.querySelector("#nameInpReg");
const surNameInpReg = document.querySelector("#surNameInpReg");
const emailInpReg = document.querySelector("#emailInpReg");
const singUpPass = document.querySelector("#singUpPass");
const singUpConPass = document.querySelector("#singUpConPass");
const singUpBtn = document.querySelector("#singUpBtn");
//! logIn
const logInEmail = document.querySelector("#logInEmail");
const logInPassword = document.querySelector("#logInPassword");
const logInForm = document.querySelector(".logInForm");
//!addProdukt
const addProduckBtn = document.querySelector("#addProduckBtn");
const addNameBouInp = document.querySelector("#nameBouInp");
const addPriseBouInp = document.querySelector("#priseBouInp");
const addTypeBouInp = document.querySelector("#typeBouInp");
const addQuanBouInp = document.querySelector("#quanBouInp");
const addFotoBouInp = document.querySelector("#fotoBouInp");
//! eddMOdal
const eddForm = document.querySelector(".eddForm");
const eddNameBouInp = document.querySelector("#eddNameBouInp");
const eddpriseBouInp = document.querySelector("#eddpriseBouInp");
const eddquanBouInp = document.querySelector("#eddquanBouInp");
const eddfotoBouInp = document.querySelector("#eddfotoBouInp");
const eddProduckBtn = document.querySelector("#eddProduckBtn");
const eddtypeBouInp = document.querySelector("#eddtypeBouInp");
//!card
const container = document.querySelector(".card_container");
const deleteBtn = document.querySelector(".delet_btn");

//modalLogic
signUpTriger.addEventListener("click", (e) => {
  e.preventDefault();
  singUp.style.display = "flex";
  overlov.style.display = "flex";
});

overlov.addEventListener("click", closeModal);

//?logIn
logInTriger.addEventListener("click", (e) => {
  e.preventDefault();
  logIn.style.display = "flex";
  overlov.style.display = "flex";
});
logOutTriger.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("user");
});

addProductTriger.addEventListener("click", () => {
  addProductModal.style.display = "flex";
  overlov.style.display = "flex";
});
//close modal
function closeModal() {
  singUp.style.display = "none";
  overlov.style.display = "none";
  logIn.style.display = "none";
  addProductModal.style.display = "none";
  eddForm.style.display = "none";
}

//!regis logic
async function registration() {
  if (singUpPass.value.length < 6) {
    alert("Пароль дожен быть из 6 цифр");
    return;
  }

  if (singUpPass.value !== singUpConPass.value) {
    alert("Пароли не совподает");
    return;
  }

  let users = await getUsers();

  if (users.some((item) => item.email === emailInpReg.value)) {
    alert("Такой пользоветель уже есть");
    return;
  }

  let data = {
    username: nameInpReg.value,
    email: emailInpReg.value,
    password: singUpPass.value,
  };

  console.log(data);

  try {
    await fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error(error);
  }

  form.reset();
  closeModal();
}
async function getUsers() {
  const data = await getQuery("users");
  console.log(data);
  return data;
}

async function getQuery(e) {
  const res = await fetch(`http://localhost:8000/${e}`);
  const data = await res.json();
  return data;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await registration();
});

// logik logIN
logInForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await login();
  closeModal();
  console.log("www");
});

async function login() {
  if (!logInEmail.value.trim() || !logInPassword.value.trim()) {
    alert("Заполните поля!");
    return;
  }

  let users = await getUsers();

  const foundUser = users.find((user) => user.email === logInEmail.value);

  if (!foundUser) {
    alert("Нету такого пользователя");
    return;
  }

  if (foundUser.password !== logInPassword.value) {
    alert("Не верный пароль!");
    return;
  }

  localStorage.setItem(
    "user",
    JSON.stringify({ username: foundUser.username, email: foundUser.email })
  );
  getName();
  checkIsAdmin();
  render();
  logInForm.reset();
}
//get name
window.addEventListener("storage", getName);

function getName() {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    username.innerText = user.username;
  } else {
    username.innerText = "";
  }
}
getName();
//chech admin
function checkIsAdmin() {
  const email = JSON.parse(localStorage.getItem("user"))?.email;
  if (email !== "admin@gmail.com") {
    addProductTriger.style.display = "none";
    return false;
  } else {
    addProductTriger.style.display = "block";
    return true;
  }
}
checkIsAdmin();

//?modal add logic
addForm.addEventListener("submit", (e) => {
  e.preventDefault();
});
//! function get products from db
addProduckBtn.addEventListener("click", async () => {
  const newProduct = {
    image: addFotoBouInp.value,
    quantity: addQuanBouInp.value,
    type: addTypeBouInp.value,
    prise: addPriseBouInp.value,
    name: addNameBouInp.value,
  };
  try {
    const response = await fetch("http://localhost:8000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });
    console.log(response);
    addFotoBouInp.value = "";
    addQuanBouInp.value = "";
    addTypeBouInp.value = "";
    addPriseBouInp.value = "";
    addNameBouInp.value = "";
    closeModal();
    render();
  } catch (error) {}
});

let search = "";
let category = "";
let page = 1;
const limit = 2;

async function render() {
  let API = category;
  // ? `${PRODUCTS_API}?q=${search}&category=${category}&_page=${page}&_limit=${limit}`
  // : `${PRODUCTS_API}?q=${search}&_page=${page}&_limit=${limit}`;
  const res = await fetch("http://localhost:8000/products");
  const data = await res.json();
  container.innerText = "";
  data.forEach((product) => {
    container.innerHTML += `
    <div class="ProductCard">
          <div class="card">
            <img
              src="${product.image}"
              alt="Product image"
            />
            <div class="card_inner">
              <div>
                <h2 class="card_title_style">${product.name}</h2>
                <h2 class="card_title_style">${product.prise}$</h2>
              </div>
              <div>
                <h3 class="card_title_style2">${product.quantity}</h3>
                <h3 class="card_title_style2">${product.type}</h3>
              </div>
            </div>
            ${
              checkIsAdmin()
                ? `
                <div class="buttonsAdmin">
                <button id=${product.id} class="edit_btn  hover_btn">Edit</button>
                <button id=${product.id} class="delet_btn  hover_btn">Delete</button>
                </div>
                `
                : ""
            }
           
          </div>
        </div>
    `;
  });
}
render();
const PRODUCTS_API = "http://localhost:8000/products";

//! delete
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delet_btn")) {
    let answer = confirm("Are you sure?");
    if (!answer) {
      return;
    }
    await fetch(`http://localhost:8000/products/${e.target.id}`, {
      method: "DELETE",
    });

    render();
  }
});

//!Edit

let id = null;

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("edit_btn")) {
    const productId = e.target.id;
    eddForm.style.display = "flex";
    overlov.style.display = "block";
    const data = await getQuery(`products/${productId}`);
    eddNameBouInp.value = data.name;
    eddpriseBouInp.value = data.prise;
    eddquanBouInp.value = data.quantity;
    eddtypeBouInp.value = data.type;
    eddfotoBouInp.value = data.image;
    id = productId;
  }
});

eddForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (
    !eddNameBouInp.value.trim() ||
    !eddpriseBouInp.value.trim() ||
    !eddquanBouInp.value.trim() ||
    !eddtypeBouInp.value.trim() ||
    !eddfotoBouInp.value.trim()
  ) {
    alert("Some inputs are empty");
    return;
  }
  const editedObj = {
    name: eddNameBouInp.value,
    prise: eddpriseBouInp.value,
    type: eddtypeBouInp.value,
    image: eddfotoBouInp.value,
    quantity: eddquanBouInp.value,
  };
  await fetch(`${PRODUCTS_API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(editedObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  render();
  closeModal();
});

//!search
// searchInp.addEventListener("input", (e) => {
//   console.log(e.target.value);
//   if (product.name !== e.target.value) {
//     document
//   render();
// });
