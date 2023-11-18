
$(document).ready(function() {

    const $getGames = $('#getGames');
    const $results = $('#results');
    const $questDescription = $('#questDescription');
    const $objectiveScroll = $('#objectiveScroll')
    const $questTitle = $('#questTitle');

    $getGames.on('click', getGamesFunc);


    const domain = "https://bragi-journal-web-service.onrender.com"
    // const domain =  "http://localhost:3000"


    $results.on('click', '#gameListItem', loadQuest);
    $results.on('click', '#questListItem', function(){
        const questItemTitle = $(this).find('#questItemTitle').text().trim();
        const encodedQuestTitle = encodeURIComponent(questItemTitle);
        console.log(encodedQuestTitle)
        loadQuestEntryFunc(encodedQuestTitle)
    })



    $submitLogin = $('#submitLogin')
    $submitLogin.on('click', loginFunc)
    const logins = [];



    // $("#loginContainer").hide()

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
                    logins.push({username: userbody.username, login: true})
                    console.log(logins)
                },
                error: function (error) {
                    console.log('LOGIN FAILED');
                },
            });
        } catch (error) {
            console.error('Error:', error);
            console.error('Failed to login', userbody);
        }
    }



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
        $questDescription.empty()
        $objectiveScroll.empty();
        $questTitle.empty();
        const url = domain + `/quests/${encodedQuestTitle}`
        try {
            $.ajax({
                url, 
                type: "GET",
                success: function(data){
                    $questTitle.append(`${data[0].quest_title}`)
                    const quest_description = data[0].quest_description
                    $questDescription.append(`
                    <h2>Quest Description</h2>
                    <div id="descriptionBody" class="container">
                        <p>${quest_description}</p>
                    </div>
                    `)
                    data.forEach((item, index)=>{
                        $objectiveScroll.append(
                        `<div id=objectiveItem class="container">
                        <h3>${item.objective_title}</h3>
                        <li>${item.objective_description}</li>
                        </div>`
                        )
                        console.log(item)
                    })
                }
            })
        }catch (error){
            console.error('Error fetching quests:', error)
        }
    }

    $addQuest = $('#addQuest');

    $addQuest.on('click', function() {
        let isEmpty = true;
        logins.forEach((item) => {
            if (item.username && item.login === true) {
                isEmpty = false;
                addQuestFunc(item.username)
            }
        });
        
        if (isEmpty) {
            console.log('Logins Empty');
        } else {
            console.log('Logins Present')
        }
    });
    
    function addQuestFunc(username){
       console.log(username)
       console.log($questTitle.text());
       const url = domain + '/quests/assigned_quests'
       const newQuest = {
            username: username,
            quest_title: $questTitle.text(),
       }
       try {
            $.ajax({
                url,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(newQuest),
                success: function(response){
                    const newAssignedQuestId  = response.assigned_quest_id
                    console.log('Quest Added:', newAssignedQuestId);
                }
            })
        }catch(error){
            console.error('Error adding quest:', error)
            console.error(newQuest)
        }
    }
});