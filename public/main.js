
$(document).ready(function() {

    const $getGames = $('#getGames');
    const $resultsContainer = $('#resultsContainer'); // Corrected the selector
    $getGames.on('click', getGamesFunc);

    function getGamesFunc() {
        $resultsContainer.empty();
        const url = "http://localhost:3000/games";

        try {
            $.ajax({
                url,
                type: "GET",
                success: function(data) {
                    data.forEach((item, index) => {
                        console.log(item);
                        $resultsContainer.append(`<li class="game_item"><b>ID:</b> ${item.id} <b>Game Title:</b> ${item.game_name}</li>`); // Corrected the HTML structure
                    });
                }
            });
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    }

});