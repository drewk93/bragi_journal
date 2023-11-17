
$(document).ready(function() {

    const $getGames = $('#getGames');
    const $results = $('#results');
    const $questDescription = $('#questDescription');
    const $questObjectives = $('#questObjectives');
    $getGames.on('click', getGamesFunc);


    // const domain = "https://bragi-journal-web-service.onrender.com"
    const domain =  "http://localhost:3000"


    $results.on('click', '#gameListItem', loadQuest);
    $results.on('click', '#questListItem', function(){
          const questItemTitle = $(this).find('#questItemTitle').text().trim();
        const encodedQuestTitle = encodeURIComponent(questItemTitle);
        console.log(encodedQuestTitle)
        loadQuestEntryFunc(encodedQuestTitle)
    })

    function getGamesFunc() {
        $results.empty();
        const url = domain + '/games';

        try {
            $.ajax({
                url,
                type: "GET",
                success: function(data) {
                    data.forEach((item, index) => {
                        console.log(item);
                        $results.append(
                            `<div id="gameListItem" class="container">
                                <h2>${item.game_name}</h2>
                            </div>`                         
                        ); // Corrected the HTML structure
                    });
                }
            });
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    }
    
    function getQuestFunc(encodedGameListItem){
        $results.empty()
        const url = domain + `/games/${encodedGameListItem}`
        console.log(url)
        try {
            $.ajax({
                url,
                type: "GET",
                success: function(data){
                    data.forEach((item, index)=>{
                        // console.log(item)
                        $results.append(
                            `<div id= "questListItem" class="container">
                                <h4>${item.game_name}</h4>
                                <h2 id="questItemTitle">${item.quest_title}</h2>
                            </div>`);
                    })
                }
            })
        }catch (error){
            console.error('Error fetching quests:', error)
        }
    }

    function loadQuest() {
        const gameListItem = $(this).text().trim();
        const encodedGameListItem = encodeURIComponent(gameListItem);
        console.log(encodedGameListItem)
        getQuestFunc(encodedGameListItem);
    }

    function loadQuestEntryFunc(encodedQuestTitle){
        $questDescription.empty();
        $questObjectives.empty();
        const url = domain + `/quests/${encodedQuestTitle}`
        try {
            $.ajax({
                url, 
                type: "GET",
                success: function(data){
                    
                    console.log(data)
                    // $questDescription.append(`
                    // <h2>Quest Description</h2>
                    // <div id="descriptionBody" class="container">
                    //     <p>${data.quest_description}</p>
                    // </div>
                    // `)

                    // data.forEach((item, index)=>{
                       
                    //     `
                        
                    //     `
                    //     console.log(item)
                    // })
                }
            })
        }catch (error){
            console.error('Error fetching quests:', error)
        }
    }



    $submitLogin = $('#submitLogin')

    $submitLogin.on('click', loginFunc)



    $("#loginContainer").hide()

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
                success: function (data, textStatus, XHR) {
                    console.log('Status Code', XHR.status);
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