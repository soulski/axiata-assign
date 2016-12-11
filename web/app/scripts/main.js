$(document).ready(() => {

  $('#join-button').click(() => {
    const name = $('#name-input').val();

    Cookies.set('name', name);

    window.location.replace('/chat.html');
  });  

});
