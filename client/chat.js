const username = sessionStorage.name;
let messages = [], editting = null;

$(document).ready(function(){
    $('#editButton').hide();
    if (username) {
        $('#name').html(`${username}:`);
        getMessages();
        setInterval(getMessages, 500);
    }
    else window.location.replace("/");

    // Manage enter keypress on #input
    $('#input').keypress(function(e) {
        if (e.which == 13 && !!editting) {
            e.preventDefault();
            handleEdit(e);
        } else if (e.which == 13 && !editting) {
            e.preventDefault();
            handleSend(e);
        }
    });

    // Send button listener
    $("#sendButton").click(handleSend);

    // Edit button listener
    $("#editButton").click(handleEdit);
});

const handleSend = (e) => {
    e.preventDefault();
    const message = $('#input').val();
    if (message) $.post("/messages", { username, message });
    $('#input').val('');
};

const getMessages = () => {
   $.get("/messages", function(data, status) {
       messages = data.sort((a, b) => a.mid - b.mid);
       renderMessages();
   });
};

const renderMessages = () => {
    $('#chat-area').empty();
    if (messages.length) messages.forEach((message) => {
        const timestamp = moment(message.updated_at).fromNow();
        const deletable = message.username === username ? `<span class="pull-right buttons"><i class="material-icons edit-button ${message.mid}">edit</i><i class="material-icons delete-button ${message.mid}">delete</i></span>` : '<span class="placeholder pull-right">&nbsp;</span>';
        $('#chat-area').append(`<div id="${message.mid}" class="message"><strong><span class="bold">${message.username}:</span></strong> ${message.message}${deletable}<span class="pull-right time">${timestamp}</span></div>`);

        // Trash icon listener
       $(`.delete-button.${message.mid}`).click(deleteMessage.bind(null, message.mid));

        // Pencil icon listener
        $(`.edit-button.${message.mid}`).click(editMessage.bind(null, message.mid, message.message));
    });
};

const deleteMessage = (mid, e) => {
    $.ajax({
        url: '/messages',
        type: 'DELETE',
        contentType: 'application/JSON',
        data: JSON.stringify({ mid })
    });
};

const editMessage = (mid, message, e) => {
    $('#sendButton').hide();
    $('#editButton').show();
    editting = mid;
    $('#input').val(message);
};

const handleEdit = (e) => {
    e.preventDefault();
    const message = $('#input').val();
    $.ajax({
        url: '/messages',
        type: 'PUT',
        contentType: 'application/JSON',
        data: JSON.stringify({ mid: editting, message }),
        success: function() {$('#input').val('');}
    });
    editting = null;
    $('#editButton').hide();
    $('#sendButton').show();
};