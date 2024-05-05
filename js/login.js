function validaLogin() {
    const usuario = document.querySelector("#username").value;
    const senha = document.querySelector("#pass").value;

    if (usuario == "senac" && senha == "123456") {
        window.location.href = "dashboard.html";
    } else {

    }
}

function logout() {
    window.location.href = "index.html";
}