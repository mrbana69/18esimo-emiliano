document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previene il comportamento predefinito del form

    const password = document.getElementById('password').value;
    const correctPassword = 'mrbana1010'; // Sostituisci con la password corretta

    if (password === correctPassword) {
        window.location.href = 'seconda-parte_home/home.html'; // Sostituisci con la pagina successiva
    } else {
        document.getElementById('errorMessage').style.display = 'block';
        setTimeout(() => {
            document.getElementById('errorMessage').style.display = 'none';
            location.reload(); // Ricarica la pagina dopo 3 secondi
        }, 3000); // Nasconde il messaggio di errore dopo 3 secondi
    }
});
