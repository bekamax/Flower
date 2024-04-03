// navbar btn
const signUpTriger = document.querySelector("#signUpTriger");
const logInTriger = document.querySelector("#logInTriger");
const logOutTriger = document.querySelector("#logOutTriger");
addProductTriger = document.querySelector("#addProductTriger");
//modal
const modal = document.querySelector(".modal");
const overlov = document.querySelector(".overlov");
const singUp = document.querySelector(".singUp");
const logIn = document.querySelector(".logIn");
const addProductModal = document.querySelector(".addProductModal");
const form = document.querySelector(".form");
//! signUp
const nameInpReg = document.querySelector("#nameInpReg");
const surNameInpReg = document.querySelector("#surNameInpReg");
const emailInpReg = document.querySelector("#emailInpReg");
const singUpPass = document.querySelector("#singUpPass");
const singUpConPass = document.querySelector("#singUpConPass");
const singUpBtn = document.querySelector("#singUpBtn");

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

if ((signUpTriger.style.display = "flex")) {
  logOutTriger.style.display = "none";
}
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
}

//!regis logic
async function registration() {
  if (singUpPass.value.length < 6) {
    console.error("Password must be more than 6 characters!");
    return;
  }

  if (singUpPass.value !== singUpConPass.value) {
    console.error("Password and its confirmation don't match!");
    return;
  }

  let users = await getUsers();

  if (users.some((item) => item.email === emailInpReg.value)) {
    alert("This email is already taken!");
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
async function getQuery(endpoint) {
  const res = await fetch(`http://localhost:8000/${endpoint}`);
  const data = await res.json();
  return data;
}

singUpBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  await registration();
});
