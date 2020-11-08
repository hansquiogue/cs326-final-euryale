// Sends POST Request when Sign In button is clicked
document.getElementById('sign-in').addEventListener("click", async function() {
    const user = document.getElementById('user-input').value;
    const pass = document.getElementById('pass-input').value;
    
    // TODO: Validate code server side
    // Checks if there are entries for all fields
    if (user.length === 0 || pass.length === 0) {
        alert("All field entries must be completed");
        return;
    } 

    const data = { user: user, pass: pass };
    const response = await fetch("http://localhost:8080/login-attempt", {
        method: 'post',
        body: JSON.stringify(data),
    });

    // Everything went okay
    if (response.ok) {
        const body = await response.json();
        alert("Credentials Recieved" + JSON.stringify(body));
        window.location.href = "selector.html";
    // Response error
    } else {
        alert(response.statusText);
        return;
    }
});