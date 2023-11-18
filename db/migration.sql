DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS quests;
DROP TABLE IF EXISTS quest_objectives;
DROP TABLE IF EXISTS assigned_quests;
DROP TABLE IF EXISTS journal;
DROP TABLE IF EXISTS assigned_objectives;


CREATE TABLE users (
    user_id SERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(32) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE games (
    game_id SERIAL PRIMARY KEY NOT NULL,
    game_name VARCHAR(32) NOT NULL
);

CREATE TABLE quests (
    quest_id SERIAL PRIMARY KEY NOT NULL,
    quest_title VARCHAR(32) NOT NULL,
    quest_description TEXT,
    game_id INT NOT NULL,
    FOREIGN KEY (game_id) REFERENCES games(game_id)
);

CREATE TABLE quest_objectives (
    quest_objective_id SERIAL PRIMARY KEY NOT NULL,
    objective_title VARCHAR(32) NOT NULL,
    objective_description TEXT,
    quest_id INT NOT NULL,
    FOREIGN KEY (quest_id) REFERENCES quests(quest_id)
);

CREATE TABLE assigned_quests (
    assigned_quest_id SERIAL PRIMARY KEY,
    completed BOOLEAN DEFAULT FALSE,
    user_id INT NOT NULL,
    quest_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (quest_id) REFERENCES quests(quest_id)
    CONSTRAINT unique_assignment UNIQUE (user_id, quest_id
);

ALTER TABLE assigned_quests
ADD CONSTRAINT unique_assignment
UNIQUE (user_id, quest_id);

CREATE TABLE journal (
    post_id SERIAL PRIMARY KEY NOT NULL,
    content TEXT,
    user_id INTEGER NOT NULL,
    assigned_quest_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (assigned_quest_id) REFERENCES assigned_quests(assigned_quest_id)
);

CREATE TABLE assigned_objectives (
    assigned_quest_objective_id SERIAL PRIMARY KEY,
    completed BOOLEAN DEFAULT FALSE,
    assigned_quest_id INT NOT NULL,
    quest_objective_id INT NOT NULL,
    FOREIGN KEY (assigned_quest_id) REFERENCES assigned_quests(assigned_quest_id),
    FOREIGN KEY (quest_objective_id) REFERENCES quest_objectives(quest_objective_id)
);
