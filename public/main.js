
$(document).ready(function() {

    const $getGames = $('#getGames');
    const $resultsContainer = $('#resultsContainer'); // Corrected the selector
    $getGames.on('click', getGamesFunc);


    const domain = "https://bragi-journal-web-service.onrender.com"
    // const domain =  "http://localhost:3000"



  

    function getGamesFunc() {
        $resultsContainer.empty();
        const url = domain + '/games';

        try {
            $.ajax({
                url,
                type: "GET",
                success: function(data) {
                    data.forEach((item, index) => {
                        console.log(item);
                        $resultsContainer.append(`<li class="game_item"><b>ID:</b> ${item.game_id} <b>Game Title:</b> ${item.game_name}</li>`); // Corrected the HTML structure
                    });
                }
            });
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    }
    
    $submitLogin = $('#submitLogin')

    $submitLogin.on('click', loginFunc)
    
    function loginFunc() {
        const url = domain + '/login';
        const userbody = {
            username: $('#username').val(),
            password: $('#password').val(),
        };
    
        try {
            $.ajax({
                url,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(userbody),
                success: function (data, textStatus, jgXHR) {
                    console.log('Status Code', jgXHR.status);
                    $("#loginContainer").hide("slow", function(){

                    })
                },
                error: function (error) {
                    console.log('LOGIN FAILED');
                    $resultsContainer.empty()
                },
            });
        } catch (error) {
            console.error('Error:', error);
            console.error('Failed to login', userbody);
        }
    }
});