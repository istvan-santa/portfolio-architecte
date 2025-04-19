document.getElementById('login-form').addEventListener('submit', async(event) => {
    event.preventDefault();


    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;


    await loginUser(email, password);
});

async function loginUser(email, password) {
    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
        });

        if (response.ok) {
            const data = await response.json();


            localStorage.setItem('authToken', data.token);

            window.location.href = 'index.html';
        } else {

            displayErrorMessage('Identifiants incorrects. Veuillez réessayer.');
        }
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        displayErrorMessage('Une erreur est survenue. Veuillez réessayer plus tard.');
    }
}

function displayErrorMessage(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
}