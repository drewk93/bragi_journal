
$(document).ready(function() {

    const $getGames = $('#getGames');
    const $results = $('#results');
    const $questDescription = $('#questDescription');
    const $objectiveScroll = $('#objectiveScroll')
    const $questTitle = $('#questTitle');
    const $acceptQuest = $('#acceptQuest');
    $getGames.on('click', getGamesFunc);


    // const domain = "https://bragi-journal-web-service.onrender.com"
    const domain =  "http://localhost:3000"






    $submitLogin = $('#submitLogin')
    $submitLogin.on('click', loginFunc)
    const logins = {}


    // LOGIN

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
                    const user_id = data.user_id
                    logins.user_id = user_id;
                    logins.username = userbody.username;
                    logins.login = true;
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

    // LIST GAMES

    function getGamesFunc() {
        $results.empty();
        const url = domain + '/games';

        try {
            $.ajax({
                url,
                type: "GET",
                success: function(data) {
                    data.forEach((item, index) => {
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

    // LIST QUESTS
    $results.on('click', '#gameListItem', loadQuestList);
    function loadQuestList() {
        const gameListItem = $(this).text().trim();
        const encodedGameListItem = encodeURIComponent(gameListItem);
        loadQuestListFunc(encodedGameListItem);
    }
    
    function loadQuestListFunc(encodedGameListItem){
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



    // LIST QUESTS AND OBJECTIVES

    $results.on('click', '#questListItem', function(){
        const questItemTitle = $(this).find('#questItemTitle').text().trim();
        const encodedQuestTitle = encodeURIComponent(questItemTitle);
        console.log(encodedQuestTitle)
        checkAssignmentAndLoadQuest(encodedQuestTitle)
    })

    function checkAssignmentAndLoadQuest(quest_title) {
        let user_id;
        if (Object.keys(logins).length > 0) {
            user_id = logins.user_id
        }     
        const url = domain + `/check_assignment/${user_id}/${quest_title}`;
        console.log(user_id)
        console.log(quest_title)
        try {
            $.ajax({
                url,
                type: 'GET',
                success: function (data) {
                    const exists = data[0].exists;
                    console.log(exists)
                    if (data.length > 0 && data[0].exists === true) {
                        let assigned = true;
                        loadQuestEntryFunc(quest_title, assigned);
                    } else {
                        console.log(data)
                        let assigned = false;
                        loadQuestEntryFunc(quest_title, assigned);
                        // Handle the case where the assignment does not exist
                    }
                },
                error: function (error) {
                    console.error('Error checking assignment:', error);
                },
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function loadQuestEntryFunc(encodedQuestTitle, assigned){
        console.log(assigned)
        $questDescription.empty()
        $objectiveScroll.empty();
        $questTitle.empty();

        if(assigned){
            $acceptQuest.hide()
        } else {
            $acceptQuest.show();
        }


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
                    })
                }
            })
        }catch (error){
            console.error('Error fetching quests:', error)
        }
    }


    

    $acceptQuest.on('click', function() {
        if (Object.keys(logins).length > 0) {
           const user_id = logins.user_id
           acceptQuestFunc(user_id);
        }
    });
    
    function acceptQuestFunc(user_id){
       const url = domain + '/quests/assigned_quests'
       const newQuest = {
            user_id: user_id,
            quest_title: $questTitle.text(),
       }
       try {
            $.ajax({
                url,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(newQuest),
                success: function(response){
                }
            })
        }catch(error){
            console.error('Error adding quest:', error)
            console.error(newQuest)
        }
    }
});