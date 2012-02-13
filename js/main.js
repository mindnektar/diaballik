$(function() {
    var $board = $('#board'),
        fields = [],
        players = [],
        currentPlayer = 0;

    function initBoard() {
        var i, j, top, html = '';

        for (i = 0; i < 7; i++) {
            fields.push([]);

            for (j = 0; j < 7; j++) {
                fields[i].push({
                    occupied: false,
                    $elem: null
                });

                html += '<div class="field" id="field' + i + j + '"></div>';
            }
        }

        for (i = 0; i < 2; i++) {
            top = i === 0 ? 192 : 0;

            players.push([]);

            for (j = 0; j < 7; j++) {
                players[i].push({
                    carrier: j === 3
                });

                html += '<div class="player p' + i + '" id="player' + i + j + '" style="left: ' + (j * 32) + 'px; top: ' + top + 'px;"><div></div></div>';
            }

            html += '<div class="ball p' + i + '" id="ball' + i + '" style="left: 96px; top: ' + top + 'px;"><div></div></div>';
        }

        $board.html(html);

        $('.player').click(startMove);
    }

    function startMove() {

    }

    initBoard();
});
