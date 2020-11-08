window.addEventListener('load', async function() {
    
    // Retrieve temporary and current user stored in storage
    let user = 'User';
    const response = await fetch("../temp-storage.json");
    if (response.ok) {
        const json_obj = await response.json();
        user = json_obj['user'];
    }

    // Welcome message to logged in user
    document.getElementById('welcome').innerText = 'Welcome ' + user + '!';

    // Functionality when create a character button is clicked in modal
    $('#create-char').click(async function() {
        const name = document.getElementById('new-char-name').value;

        // Character name needs to be letters and numbers
        if (name.match(/[A-Za-z0-9 ]+/)) {
            const data = { user: user, char: name };
            // New request for character
            const add_resp = await fetch("http://localhost:8080/manage-sheets-add", {
                method: 'post',
                body: JSON.stringify(data)
            });
            
            if (add_resp.ok) {
                // New character is generated in gallery
                createNewCharInGallery(name);
                const body = await add_resp.json();
                alert("New character recieved" + JSON.stringify(body));

                // Modal is hiden
                $('#create-modal').modal('hide');
            } else {
                alert("Something went wrong..");
            }
        } else {
            alert("Invalid character name");
        }
    });

    // Whenever delete button is clicked
    // TODO: Confirmation message
    document.getElementById('delete').addEventListener('click', async function() {
        const char = getSelectedCharacter().value;
        const data = { user: user, char: char };
        
        const delete_resp = await fetch('http://localhost:8080/manage-sheets-delete', {
            method: 'post',
            body: JSON.stringify(data)
        });

        if (delete_resp.ok) {
            const body = await delete_resp.json();
            alert("Chacter deleted request recieved" + JSON.stringify(body));

            deleteCharInGallery();
        }
    });

    // Whenever play button is clicked
    document.getElementById('play-btn').addEventListener('click', async function() {
        const char = getSelectedCharacter().value;
        const data = { user: user, char: char };

        const get_resp = await fetch('http://localhost:8080/manage-sheets-get', {
            method: 'post',
            body: JSON.stringify(data)
        });

        if (get_resp.ok) {
            const body = await get_resp.json();
            alert("Get character request recieved" + JSON.stringify(body));
            window.location.href = "../character-sheet/character-sheet.html";
        }
    });

    // Whenever log out is clicked
    document.getElementById('logout').addEventListener('click', async function() {
        const logout_resp = await fetch('http://localhost:8080/logout-attempt', {
            method: 'post',
            body: JSON.stringify({ user: user})
        });

        if (logout_resp.ok) {
            const body = await logout_resp.json();
            alert("User logged out request recieved" + JSON.stringify(body));
            window.location.href = "/";
        }
    });
});

// Whenever different characters are selected
// TODO: New characters cannot be selected
$('input[name="charselect"]').change( function(e) {
    // Current radio button value
    let curr_char = $(this).val();
    console.log(document.getElementsByName('charselect'));
    document.getElementById('curr-selected-text').innerText = 'Current Character Selected: ' + curr_char;
});

function createNewCharInGallery(name) {
    // Parent
    const parent = document.getElementById('char-gallery');

    // New div for row created underneath
    const newRow = document.createElement('div');
    newRow.className = 'row mt-2';
    parent.appendChild(newRow);
    
    // New div for col created underneath
    const newCol = document.createElement('div');
    $(newCol).attr({
        'class': 'col mx-3 btn-group btn-group-toggle',
        'data-toggle': 'buttons'
    });
    newRow.appendChild(newCol);
    
    // New label for button design created underneath
    const newLabel = document.createElement('label');
    newLabel.className = 'btn btn-secondary';
    newLabel.innerText = name;
    newCol.appendChild(newLabel);
    
    // New input underneath
    const newInput = document.createElement('input');
    const numChar = document.getElementsByClassName('radio-char').length + 1;
    $(newInput).attr({
        class: 'radio-char',
        type: 'radio',
        name: 'charselect',
        autocomplete: 'off',
        id: 'char' + numChar.toString(),
        value: name
    });
    newLabel.appendChild(newInput);
}

function getSelectedCharacter() {
    let char_list = document.getElementsByName('charselect');
    char_list = Array.from(char_list);
    return char_list.filter(char => char.checked)[0];
}

// TODO: Update character selected
function deleteCharInGallery() {
    const id = getSelectedCharacter().id;
    document.getElementById(id).parentElement.parentElement.parentElement.remove();

}