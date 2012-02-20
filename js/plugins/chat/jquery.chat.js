(function($) {
    
    $.fn.chat = function(opts) {

        var defaults = {
                height: 120,
                width: 454
            },
            currentDate,
            $chat = $('<div></div>').appendTo(this),
            $input = $('<input type="text" />').appendTo(this);
        
        this.addClass('chat');
        
        $input.val('Click to chat')
            .click(function() {
                if (this.value === 'Click to chat') {
                    this.value = '';
                }
            })
            .keyup(function(e) {
                if (e.which === 13) {
                    $chat = $chat || $(this).prev();
    
                    var message = $chat.html(),
                        d = new Date();
    
                    if (d.getDate() !== currentDate) {
                        message += '--- Messages on ' + getDate(d) + ' ---<br />';
                        currentDate = d.getDate();
                    }
    
                    message += '[' + getTime(d) + '] <strong>You: </strong>' + escape(this.value) + '<br />';
    
                    $chat
                        .html(message)
                        .scrollTop($chat.height());
    
                    this.value = '';
                }
            });

        function getTime(d) {
            return padWithZeroes(d.getHours()) + ':' +
                padWithZeroes(d.getMinutes()) + ':' +
                padWithZeroes(d.getSeconds());
        }

        function getDate(d) {
            return padWithZeroes(d.getDate()) + '.' +
                padWithZeroes(d.getMonth() + 1) + '.' +
                d.getFullYear();
        }

        function padWithZeroes(str) {
            str += '';

            while (str.length < 2) {
                str = '0' + str;
            }

            return str;
        }

        function escape(str) {
            return str
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
        
    };
})(jQuery);
