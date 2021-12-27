const Directions = { 
    left: {
        move: (index) => index - 1,
        collision: (index) => 0 == index % 3
    },
    rigth: {
        move: (index) => index + 1,
        collision: (index) => 0 == (index + 1) % 3
    },
    up: {
        move: (index) => index - 3,
        collision: (index) => index <= 2
    },
    down: {
        move: (index) => index + 3,
        collision: (index) => index >= 6
    },
    upleft: {
        move: (index) => Directions.left.move(Directions.up.move(index)),
        collision: (index) => Directions.up.collision(index) || Directions.left.collision(index)
    },
    upright: {
        move: (index) => Directions.rigth.move(Directions.up.move(index)),
        collision: (index) => Directions.up.collision(index) || Directions.rigth.collision(index)
    },
    downleft: {
        move: (index) => Directions.left.move(Directions.down.move(index)),
        collision: (index) => Directions.down.collision(index) || Directions.left.collision(index)
    },
    downright: {
        move: (index) => Directions.rigth.move(Directions.down.move(index)),
        collision: (index) => Directions.down.collision(index) || Directions.rigth.collision(index)
    }
};

function getCurrentTeam($td) {
    const $table = $td.parents('table');
    if ($table.hasClass('cross-pending'))
        return 'cross';

    if ($table.hasClass('circle-pending'))
        return 'circle';

    console.error('Team "' + team + '" unknown');
}

function markTd($td, team) {
    const $table = $td.parents('table');
    $td.removeClass('empty').addClass(team);
    switch (team) {
        case 'cross':
            $table.removeClass('cross-pending').addClass('circle-pending');
            break;

        case 'circle':
            $table.removeClass('circle-pending').addClass('cross-pending');
            break;
        default:
            console.error('Team "' + team + '" unknown');
    }
}

function score(index, direction, team) {
    if (!$('td[data-index="' + index + '"]').hasClass(team))
        return 0;

    if (direction.collision(index))
        return 1;
    
    return 1 + score(direction.move(index), direction, team);
}

function tdClick(e) {
    const $td = $(e.target);
    const index = $td.data('index');
    const team = getCurrentTeam($td);
    
    markTd($td, team);
    $td.off('click', tdClick);

    // Calcul score
    const isWinner = 3 == Math.max(...[
        score(index, Directions.left, team) + score(index, Directions.rigth, team) - 1,
        score(index, Directions.up, team) + score(index, Directions.down, team) - 1,
        score(index, Directions.upleft, team) + score(index, Directions.downright, team) - 1,
        score(index, Directions.upright, team) + score(index, Directions.downleft, team) -1
    ]);

    const isOver = isWinner || 0 == $('td.empty').length;
    if (isOver) {
        if (isWinner)
            alert(team + ' wins !');
        
        alert('Game over');
        $('td.empty').removeClass('empty').off('click', tdClick);
    }
}

function displayIndex() {
    $('td').each((i, td) => {
        const $td = $(td);
        $td.text($td.data('index'));
    })
}

$(document).ready(() => {
    $('td').on('click', tdClick);
});