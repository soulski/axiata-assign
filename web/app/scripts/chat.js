$(document).ready(() => {
  const URL = 'http://127.0.0.1:9000';
  const name = Cookies.get('name');

  if (!name || _.isEmpty(name)) {
    window.location.replace('/');
  }

  $('#send-msg-button').click(() => {
    const msgInput = $('#msg-input');
    const msg = msgInput.val();

    if (msg) {
      fetch(`${URL}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: name,
          content: msg
        })
      })
      .then(() => msgInput.val(''));
    }
  });

  const source   = $('#message-template').html();
  const messageTmpl = Handlebars.compile(source);
  const now = new Date();

  const convertMessage = messages => messages.map((msg) => {
    const createTime = moment(msg.createDate, moment.ISO_8601).valueOf();

    msg.elapse = elapseTime(now.getTime(), createTime);
    msg.isOwner = msg.sender === name;

    return msg;
  })

  const scrollChatToBottom = () => {
    $('#message-body').animate({ scrollTop: $('#message-body')[0].scrollHeight}, 1000);
  };

  const loadMessage = (startDate) => {
    let query = '';

    if (startDate) {
      query = '?startDate=' + startDate;
    }

    return fetch(`${URL}/message${query}`)
      .then(res => res.json())
      .then(convertMessage)
  }

  const pullNewMessage = (startDate) => {
    setTimeout(() => {
      loadMessage(startDate)
        .then((newMessages) => {
          $('#message-body')
            .append(messageTmpl(newMessages))
            .animate({ scrollTop: $('#message-body')[0].scrollHeight}, 1000);

          return !_.isEmpty(newMessages)
            ? newMessages[newMessages.length - 1].createDate
            : startDate;
        })
        .then(pullNewMessage);
    }, 1000);
  }

  loadMessage()
    .then((messages) => {
      $('#message-body')
        .html(messageTmpl(messages))
        .animate({ scrollTop: $('#message-body')[0].scrollHeight}, 1000);

      return !_.isEmpty(messages) 
        ? messages[messages.length - 1].createDate
        : now.toISOString();
    })
    .then(pullNewMessage);

});
