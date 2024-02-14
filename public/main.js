$(document).ready(function () {

    // DOMAIN URL ROOTS

    // const domain = "https://bragi-journal-web-service.onrender.com";
    const domain = "http://localhost:3000";




    const $getGames = $('#getGames');
    const $results = $('#results');
    const $questDescription = $('#questDescription');
    const $objectiveScroll = $('#objectiveScroll');
    const $questTitle = $('#questTitle');
    const $acceptQuest = $('#acceptQuest');
    $acceptQuest.hide();
    const $dropQuest = $('#dropQuest');
    $dropQuest.hide();
    const $journalBody = $('#journalBody');
    $getGames.on('click', getGamesFunc);
    const $rowContainer = $('#rowContainer');
    const $navBar = $('#navbar');
    const $loginContainer = $('#loginContainer');
    $rowContainer.hide();
    $navBar.hide()
    const $logout = $('#logout')
    const $gameTitleContainer = $('#gameTitleContainer');
    let logins = {};
    let currentJournal = {};
    let currentObjectives = {}
  
    // LOGIN
    $submitLogin = $('#submitLogin');
    $submitLogin.on('click', loginFunc);
    async function loginFunc() {
      const url = domain + '/login';
      const userbody = {
        username: $('#username').val(),
        password: $('#password').val(),
      };
  
      try {
        const data = await $.ajax({
          url,
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(userbody),
        });
        console.log('Status Code', data.status);
        const user_id = data.user_id;
        logins.user_id = user_id;
        logins.username = userbody.username;
        logins.login = true;
        displayStatusMessage('Login Successful!',3000);
        $loginContainer.hide('slow');
        $rowContainer.show(2000);
        $navBar.show(2000);
        $('#username').val('');
        $('#password').val('');
        console.log(logins);
      } catch (error) {
        console.error('Error:', error);
        console.error('Failed to login', userbody);
        displayStatusMessage('Login Failed!!!', 1500)
      }
    }

    $logout.on('click', logoutFunc)
    async function logoutFunc(){
      logins = {};
      $rowContainer.hide('slow');
      $navBar.hide('slow')
      $loginContainer.show(1500);
    }

    $submitRegister = $('#submitRegister');
    $submitRegister.on('click', registerUser);
      async function registerUser() {
      let usernameLength = $('#username').val().length;
      let passwordLength = $('#password').val().length;
      if(usernameLength === 0 || passwordLength === 0){
        displayStatusMessage('Invalid Registration: Username cannot be empty and Password must be longer than 8 characters!', 5000)
        return;
      }
    

      const url = domain + '/register';
      const userbody = {
        username: $('#username').val(),
        password: $('#password').val(),
      };
  
      try {
        const data = await $.ajax({
          url,
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(userbody),
        });
        displayStatusMessage('Registration Successful!', 1500);
      } catch (error) {
        console.error('Error:', error);
        displayStatusMessage('Registration Error!', 1500);
      }
    }

    function displayStatusMessage(message, duration) {
      $loginStatus = $('#loginStatus')
      $loginStatus.append(`<p id='loginStatusMsg'>${message}</p>`)
      
      // Set a timeout to remove the message after a specified duration
      setTimeout(function() {
        $loginStatus.empty();
      }, duration);
  }
  
  
    // LIST GAMES
  
    function getGamesFunc() {
      $results.empty();
      const url = domain + '/games';
  
      try {
        $.ajax({
          url,
          type: "GET",
          success: function (data) {
            data.forEach((item, index) => {
              $results.append(
                `<div id="gameListItem" class="btn container">
                  <h2>${item.game_name}</h2>
                </div>`
              );
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
      console.log(encodedGameListItem);
    }
      async function loadQuestListFunc(encodedGameListItem) {
      $gameTitleContainer.empty();
      $results.empty()
      const url = domain + `/games/${encodedGameListItem}`;
      console.log(url);
      try {
        const data = await $.ajax({
          url,
          type: "GET",
        });
        $gameTitleContainer.append(`<h1>"${data[0].game_name}"</h1>`)
        data.forEach((item, index) => {
          $results.append(
            `<div id= "questListItem" class="btn container">
              <h2 id="questItemTitle">"${item.quest_title}"</h2>
            </div>`
          );
        });
      } catch (error) {
        console.error('Error fetching quests:', error);
      }
    }
  
    // LIST QUESTS AND OBJECTIVES
  
    // CHECK ASSIGNMENT FIRST
  
    $results.on('click', '#questListItem', function () {
      const questItemTitle = $(this).find('#questItemTitle').text().trim().replace(/^"(.*)"$/, '$1');
      const encodedQuestTitle = encodeURIComponent(questItemTitle);
      console.log(encodedQuestTitle);
      checkAssignmentAndLoadQuest(encodedQuestTitle);
    })
      async function checkAssignmentAndLoadQuest(quest_title) {
      let user_id;
      if (Object.keys(logins).length > 0) {
        user_id = logins.user_id
      }
      const url = domain + `/check_assignment/${user_id}/${quest_title}`;
      console.log(user_id);
      console.log(quest_title);
      try {
        const data = await $.ajax({
          url,
          type: 'GET',
        });
        const exists = data.exists;
        const assigned_quest_id = data.assigned_quest_id
        const user_id = data.user_id
        console.log(exists)
        if (exists) {
          let assigned = true;
          console.log
          await loadQuestEntryFunc(quest_title, assigned, assigned_quest_id, user_id);
          console.log(data)
        } else {
          console.log(data)
          let assigned = false;
          await loadQuestEntryFunc(quest_title, assigned);
  
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  
    // Load Quest Entry Func
  
    async function loadQuestEntryFunc(quest_title, assigned, assigned_quest_id, user_id) {
      $questDescription.empty()
      $objectiveScroll.empty();
      $questTitle.empty();
      $journalBody.empty();  
      if (assigned) {
        $acceptQuest.hide()
        $dropQuest.show()
        await loadJournal(assigned_quest_id, user_id)
        await loadQuestObjectives(assigned_quest_id)
      } else {
        $acceptQuest.show();
        $dropQuest.hide();
      }
  
      const url = domain + `/quests/${quest_title}`
      try {
        const data = await $.ajax({
          url,
          type: "GET",
        });
        $questTitle.append(`"${data[0].quest_title}"`)
        const quest_description = data[0].quest_description
        $questDescription.append(`
          <div id="descriptionBody" class="container">
            <p>${quest_description}</p>
          </div>
        `)
      
      } catch (error) {
        console.error('Error fetching quests:', error);
      }
    }
  
    // ACCEPT QUEST
  
    $acceptQuest.on('click', async function () {
      if (Object.keys(logins).length > 0) {
        const user_id = logins.user_id
        await acceptQuestFunc(user_id);
      }
    });
      async function acceptQuestFunc(user_id) {
      const url = domain + '/quests/assigned_quests'
      const newQuest = {
        user_id: user_id,
        quest_title: $questTitle.text().trim().replace(/^"(.*)"$/, '$1')
      }
      try {
        const data = await $.ajax({
          url,
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(newQuest),
        });
        $acceptQuest.hide();
        $dropQuest.show();
        const assigned_quest_id = data.assigned_quest_id;
        const user_id = data.user_id;
        await loadJournal(assigned_quest_id, user_id)
        await loadQuestObjectives(assigned_quest_id)
        console.log(data);
      } catch (error) {
        console.error('Error adding quest:', error);
        console.error(newQuest);
      }
    }
  
    async function loadJournal(assigned_quest_id, user_id) {
      const url = domain + `/journal/${user_id}/${assigned_quest_id}`;
      try {
        const data = await $.ajax({
          url,
          type: 'GET',
        });
        currentJournal = {
          post_id: data[0].post_id,
          content: data[0].content,
          user_id: data[0].user_id,
          assigned_quest_id: data[0].assigned_quest_id
        };
        let initialContent = data[0].content
        if (initialContent === null){
          initialContent = ''
        }

        $journalBody.append(`
          <div id="journalHeader" class="container">
            <button id ="editJournal" class="btn" type="submit">Edit</button>
            <button id="saveJournal" class="btn" type="submit">Post</button>
          </div>
          <form id="journal">
            <textarea id="journalContent" name="journal-content" rows="6" cols="50">${initialContent}</textarea>
          </form>
          <div id="journalDisplay" class="container">${initialContent}</div>
        `);
        $saveJournal = $('#saveJournal')
        $saveJournal.hide()
       
      } catch (error) {
        console.error('Error loading journal:', error);
      }
    }

    $journalBody.on('click', '#editJournal', function() {
        $saveJournal.show();
        $editJournal = $('#editJournal')
        $editJournal.hide();
        const $journalDisplay = $('#journalDisplay')
        const $journal = $('#journal');
        $journalDisplay.css('display', 'none')
        $journal.css('display', 'flex')
    })


    $journalBody.on('click', '#saveJournal', function() {
        $editJournal.show();
        $editJournal = $('#editJournal')
        $saveJournal.hide();
        const $journalDisplay = $('#journalDisplay')
        $journalDisplay.css('display', 'flex')
        const $journal = $('#journal');
        $journal.css('display', 'hide')
        const $journalContent = $('#journalContent');
        const journalContentText = $journalContent.val();
        saveJournal(journalContentText)
    });


    async function saveJournal(journalContent){
        const post_id = currentJournal.post_id
        const url = domain + `/journal/${post_id}`
        try {
            const data = await $.ajax({
                url,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({ content: journalContent})
            })
            $journalBody.empty();
            loadJournal(currentJournal.assigned_quest_id, currentJournal.user_id)
        } catch (error){
            console.error('Error saving journal', error)
        }
    }

    async function loadQuestObjectives(assigned_quest_id){
        currentObjectives = {}
        const url = domain + `/assigned_objectives/${assigned_quest_id}`
        try {
            const data = await $.ajax({
                url,
                type: 'GET'
            })
            data.forEach((item, index) => {
                const buttonText = item.completed ? 'Complete' : 'Incomplete';
                const buttonClass = item.completed ? 'status-complete' : 'status-incomplete';
                $objectiveScroll.append(
                  `<div class="objectiveItem">
                    <h3 id = objectiveTitle">${item.objective_title}</h3>
                    <li id="objectiveDescription">${item.objective_description}</li>
                    <button id="objectiveComplete" class="btn ${buttonClass}">${buttonText}</button>
                  </div>`
                )

            currentObjectives[item.quest_objective_id] = {
                    quest_objective_id: item.quest_objective_id,
                    objective_title: item.objective_title,
                    objective_description: item.objective_description,
                    quest_id: item.quest_id,
                    assigned_quest_objective_id: item.assigned_quest_objective_id,
                    completed: item.completed,
                    assigned_quest_id: item.assigned_quest_id,
            }
            })
            console.log(currentObjectives)
            
        }catch(error){
            console.error('Error Loading Quest Objectives', error)
        }
    }

    $objectiveScroll.on('click', '#objectiveComplete', function () {
               
        // Find the closest parent div with class "objectiveItem"
        const $parentDiv = $(this).closest('.objectiveItem');
        const $objectiveTitle = $parentDiv.find('h3');
        const objectiveTitleText = $objectiveTitle.text();
            const matchingObjective = Object.values(currentObjectives).find(
            (objective) => objective.objective_title === objectiveTitleText
        );
        if (matchingObjective) {
            // Matching objective found
            const assigned_quest_objective_id = matchingObjective.assigned_quest_objective_id;
            const assigned_quest_id = matchingObjective.assigned_quest_id;
            objectiveToggleFunc(assigned_quest_objective_id, assigned_quest_id) 
        }

    });

  async function objectiveToggleFunc(assigned_quest_objective_id, assigned_quest_id) {
    const url = domain + `/assigned_objectives/${assigned_quest_objective_id}`;
    try {
        const data = await $.ajax({
            url,
            type: 'PUT',
            contentType: 'application/json'
        });
        console.log('Objective Updated Successfully', data);
        $objectiveScroll.empty();
        loadQuestObjectives(assigned_quest_id);
    } catch (error) {
        console.error('Error Updating Objective', error);
    }

    // Select the #objectiveComplete element
    const $objectiveComplete = $('#objectiveComplete');

    // Check the text content and add the appropriate class for color
    if ($objectiveComplete.text().trim() === 'Incomplete') {
        $objectiveComplete.removeClass('status-complete'); // Remove the 'status-complete' class if it exists
        $objectiveComplete.addClass('status-incomplete'); // Add the 'status-incomplete' class
    } else if ($objectiveComplete.text().trim() === 'Complete') {
        $objectiveComplete.removeClass('status-incomplete'); // Remove the 'status-incomplete' class if it exists
        $objectiveComplete.addClass('status-complete'); // Add the 'status-complete' class
    }
}



  
    $dropQuest.on('click', dropQuestFunc)
      async function dropQuestFunc() {
        console.log('working')
        let questToDrop = currentJournal.assigned_quest_id;
        console.log(questToDrop)
        const url = domain + `/quests/assigned_quests/${questToDrop}`
    
        try {
            const data = await $.ajax({
            url,
            type: 'DELETE',
            });
            console.log('Quest Dropped', data)
            $journalBody.empty();
            $objectiveScroll.empty();
            $dropQuest.hide();
            $acceptQuest.show();
        } catch (error) {
            console.error('Error Dropping Quest:', error);
        }
    }


  
  });
