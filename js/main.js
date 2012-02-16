$(function() {
    var $board = $('#board'),
        $container = $('#container'),
        fields = [],
        pieces = [],
        currentPlayerId = 0,
        currentPieceId,
        movesLeft = 2,
        passesLeft = 1,
        
        t = {
            helper: {
                piece: '<div class="piece helper"><div></div></div>',
                ball: '<div class="ball helper"><div></div></div>'
            }
        };

    function initBoard() {
        var i, j, y, html = '';

        for (i = 0; i < 7; i++) {
            fields.push([]);

            for (j = 0; j < 7; j++) {
                fields[i].push({
                    occupied: false
                });

                html += '<div class="field" id="field' + i + j + '"></div>';
            }
        }

        for (i = 0; i < 2; i++) {
            y = i === 0 ? 6 : 0;

            pieces.push([]);

            for (j = 0; j < 7; j++) {
                pieces[i].push({
                    x: j,
                    y: y,
                    carrier: j === 3
                });
                
                fields[y][j].occupied = i;

                html += '<div class="piece p' + i + '" id="piece' + i + j + '" style="left: ' + (j * 64) + 'px; top: ' + (y * 64) + 'px;"><div></div></div>';
            }

            html += '<div class="ball p' + i + '" id="ball' + i + '" style="left: 192px; top: ' + (y * 64) + 'px;"><div></div></div>';
        }

        $board
            .html(html)
            .bind('contextmenu', function() {
                return false;
            })
            .mouseup(function(e) {
                if (e.which === 3) {
                    hideHelpers();
                    return false;
                }
            });

        $('.piece').mouseup(startMove);
        $('.helper').live('mouseup', doMove);
        $('#endturn').click(endTurn);
    }

    function startMove() {
        var playerId = parseInt(this.id.substr(-2, 1));

        if (playerId !== currentPlayerId) {
            return true;
        }

        currentPieceId = parseInt(this.id.substr(-1, 1));

        showHelpers(playerId, currentPieceId);
    }
    
    function doMove() {
        var $helper = $(this), $piece,
            piece, x, y, moves;

        hideHelpers();
        
        $piece = $('#piece' + currentPlayerId + currentPieceId)
            .removeClass('active');
        
        piece = pieces[currentPlayerId][currentPieceId];
        x = parseInt($helper.css('left')) / 64;
        y = parseInt($helper.css('top')) / 64;
        
        if ($helper.hasClass('ball')) {
            piece.carrier = false;
            pieces[currentPlayerId][parseInt($helper.attr('data-id'))].carrier = true;
            
            $('#ball' + currentPlayerId).animate({
                left: x * 64,
                top: y * 64
            }, {
                duration: 300,
                complete: function() {
                    if ((currentPlayerId === 0 && y === 0) || (currentPlayerId === 1 && y === 6)) {
                        endGame();
                        return false;
                    }
                
                    passesLeft--;
                    updateTurnData({passes: passesLeft});
                    checkTurnOver();
                }
            });
        } else {
            moves = Math.abs(x - piece.x) + Math.abs(y - piece.y);

            fields[piece.y][piece.x].occupied = false;
            
            piece.x = x;
            piece.y = y;

            fields[piece.y][piece.x].occupied = currentPlayerId;
            
            $piece.animate({
                left: x * 64,
                top: y * 64
            }, {
                duration: 300,
                complete: function() {
                    movesLeft -= moves;
                    updateTurnData({moves: movesLeft});
                    checkTurnOver();
                }
            });
        }
    }
    
    function showHelpers(playerId, pieceId) {
        var piece = pieces[playerId][pieceId],
            i, j, diffx, diffy, x, y;
        
        hideHelpers();

        if (piece.carrier) {
            if (!passesLeft) {
                return false;
            }
            
            $('#ball' + currentPlayerId).addClass('active');
            
            $.each(pieces[playerId], function(id, p) {
                if (id !== pieceId) {
                    diffx = Math.abs(p.x - piece.x);
                    diffy = Math.abs(p.y - piece.y);
                    
                    if (diffx === diffy || diffx === 0 || diffy === 0) {
                        for (i = p.x - piece.x, j = p.y - piece.y; i !== 0 || j !== 0;) {
                            if (fields[j + piece.y][i + piece.x].occupied === (currentPlayerId === 0 ? 1 : 0)) {
                                return true;
                            }
                            
                            if (i !== 0) {
                                i < 0 ? i++ : i--;
                            }
                            
                            if (j !== 0) {
                                j < 0 ? j++ : j--;
                            }
                        }
                        
                        $(t.helper.ball)
                            .css({
                                left: p.x * 64,
                                top: p.y * 64
                            })
                            .attr('data-id', id)
                            .appendTo($board);
                    }
                }
            });
        } else {
            if (!movesLeft) {
                return false;
            }
            
            $('#piece' + currentPlayerId + currentPieceId).addClass('active');

            function checkFields(x, y, stepsToGo) {
		var i, j;

                for (j = y - 1; j <= y + 1; j++) {
                    for (i = x - 1; i <= x + 1; i++) {
                        // Allow only horizontal and vertical movement
                        if (Math.abs(y - j) === Math.abs(x - i) || (i === x && j === y)) {
                            continue;
                        }

                        if (!fields[j] || !fields[j][i] || fields[j][i].occupied !== false) {
                            continue;
                        }

                        $(t.helper.piece).css({
                            left: i * 64,
                            top: j * 64
                        }).appendTo($board);

                        if (stepsToGo) {
                            checkFields(i, j, stepsToGo - 1);
                        }
                    }
                }
            }

            checkFields(piece.x, piece.y, movesLeft - 1);
        }
    }
    
    function hideHelpers() {
        $('.piece, .ball').removeClass('active');
        $('.helper').remove();
    }

    function updateTurnData(values) {
        $.each(values, function(name, value) {
            $('.turn.p' + currentPlayerId + ' .' + name).text(value);
        });
    }
    
    function checkTurnOver() {
        if (movesLeft === 0 && passesLeft === 0) {
            endTurn();
        }
    }
    
    function endTurn() {
        hideHelpers();

        $container.toggleClass('p0 p1');

        updateTurnData({passes: 0, moves: 0});

        currentPlayerId = currentPlayerId ? 0 : 1;

        movesLeft = 2;
        passesLeft = 1;
        updateTurnData({passes: passesLeft, moves: movesLeft});
    }
    
    function endGame() {
        var winner = currentPlayerId ? 'BLACK' : 'WHITE';
        
        console.log(winner + ' WINS!');
        
        $container.removeClass('p0 p1');
        currentPlayerId = -1;
    }

    initBoard();
});
