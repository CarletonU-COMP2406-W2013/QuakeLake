(function () {
	window.Chatting = {
		socket : null,

		initialize : function(socketURL) {
			this.socket = io.connect(socketURL);

			$('#send').click(function() {
				Chatting.send();
			});

			this.socket.on('newMessage', this.add);
		},

		add : function(data) {
			if (data.name !== "") {			
				var name = data.name;
			} else {
				var name = 'Anonymous Coward';
			}
			var msg = $('<div class="msg"></div>').append('<span class="name">'+ name + '</span>: ').
				append('<span class="text">'+ data.msg + '</span>');

			$('#messages').append(msg).animate({scrollTop: $('#messages').prop('scrollHeight')}, 0);
		},

		send : function() {
			this.socket.emit('message', {
				name: $('#name').val(),
				msg : $('#message').val()
			});		

			$('#message').val('');
		}
	};
}());
