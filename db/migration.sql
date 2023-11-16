CREATE TABLE users {
    user_id SERIAL PRIMARY KEYNOT NULL,
    username VARCHAR(32) NOT NULL,
    password VARCHAR(255) NOT NULL
}

CREATE TABLE games {
    game_id SERIAL PRIMARY KEYNOT NULL,
    game_name VARCHAR(32) NOT NULL
}

CREATE TABLE quests {
    quest_id SERIAL PRIMARY KEYNOT NULL,
    quest_title VARCHAR(32) NOT NULL,
    description TEXT,
    game_id INT NOT NULL,
    FOREIGN KEY (game_id) REFERENCES games(game_id)
}
