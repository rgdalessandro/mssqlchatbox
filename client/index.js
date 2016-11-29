$(document).ready(function(){
    const name = sessionStorage.name;

    if (name) window.location.replace("/chat");

    $("#nameButton").click(function(e){
        e.preventDefault();
        const value = $('#input').val();
        sessionStorage.name = value;
        window.location.replace("/chat");
    });
});