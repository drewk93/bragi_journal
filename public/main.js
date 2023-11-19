
$(document).ready(function() {

    const $getGames = $('#getGames');
    const $results = $('#results');
    const $questDescription = $('#questDescription');
    const $objectiveScroll = $('#objectiveScroll')
    const $questTitle = $('#questTitle');
    const $acceptQuest = $('#acceptQuest');
    $acceptQuest.hide();
    const $dropQuest = $('#dropQuest');
    $dropQuest.hide();
    const $journalBody = $('#journalBody')
    $getGames.on('click', getGamesFunc);


    // const domain = "https://bragi-journal-web-service.onrender.com"
    const domain =  "http://localhost:3000"






    $submitLogin = $('#submitLogin')
    $submitLogin.on('click', loginFunc)
    const logins = {};
    let currentJournal = {};

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

    $submitRegister = $('#submitRegister');
    $submitRegister.on('click', registerUser)

    function registerUser() {
        const url = domain + '/register';
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
                    if (XHR.status === 201) {
                        console.log('Registration successful'); // Registration was successful
                    } else {
                        console.log('Registration Failed');
                    }
                },
                error: function (error) {
                    console.error('Error:', error);
                },
            });
        } catch (error) {
            console.error('Error:', error);
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
        console.log(encodedGameListItem)
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
                    const exists = data.exists;
                    const assigned_quest_id = data.assigned_quest_id
                    const user_id = data.user_id
                    console.log(exists)
                    if (exists) {
                        let assigned = true;
                        console.log
                        loadQuestEntryFunc(quest_title, assigned, assigned_quest_id, user_id);
                        console.log(data)
                    } else {
                        console.log(data)
                        let assigned = false;
                        loadQuestEntryFunc(quest_title, assigned);
                        
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

    function loadQuestEntryFunc(quest_title, assigned, assigned_quest_id, user_id){
        $questDescription.empty()
        $objectiveScroll.empty();
        $questTitle.empty();
        $journalBody.empty();
       
        if(assigned){
            $acceptQuest.hide()
            $dropQuest.show()
            loadJournal(assigned_quest_id, user_id)
        } else {
            $acceptQuest.show();
            $dropQuest.hide()
        }


        const url = domain + `/quests/${quest_title}`
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


    // ACCEPT QUEST

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
                success: function(data){
                    $acceptQuest.hide();
                    $dropQuest.show();
                    const assigned_quest_id = data.assigned_quest_id;
                    const user_id = data.user_id;
                    loadJournal(assigned_quest_id, user_id)
                    console.log(data)
                    
                }
            })
        }catch(error){
            console.error('Error adding quest:', error)
            console.error(newQuest)
        }
    }

    function loadJournal(assigned_quest_id, user_id){

        const url = domain + `/journal/${user_id}/${assigned_quest_id}`
        try {
            $.ajax({
                url,
                type: 'GET',
                success: function (data) {
                    currentJournal = {
                        post_id: data[0].post_id,
                        content: data[0].content,
                        user_id: data[0].user_id,
                        assigned_quest_id: data[0].assigned_quest_id
                    }
                console.log(currentJournal)
                $journalBody.append(`
                <div id="journalHeader" class="container">
                <button type="submit">Edit</button>
                <button type="submit">Post</button>
                </div>

                <form id = "journal">
                    <textarea id="journalContent" name="journal-content" rows="6" cols="50">${data.content}</textarea>
                </form>
                <div id="journalDisplay" class="container">
                </div>
                `
                )
                } 
            })
        } catch(error){
            console.error('Error loading journal:', error)
        }
    }

    $dropQuest.on('click', dropQuestFunc)

    function dropQuestFunc(){
        console.log('working')
        let questToDrop = currentJournal.assigned_quest_id;
        console.log(questToDrop)
        const url = domain + `/quests/assigned_quests/${questToDrop}`

        try {
            $.ajax({
                url,
                type: 'DELETE',
                success: function (data) {
                    console.log('Quest Dropped', data)
                    $journalBody.empty();
                    $dropQuest.hide();
                    $acceptQuest.show();
                }
            })
        } catch(error){
            console.error('Error Dropping Quest:', error)
        }
    }


});


const $editJournal = $('#editJournal')
const $postJournal = $('#postJournal')