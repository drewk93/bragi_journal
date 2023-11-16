-- Inserting data into the "users" table
INSERT INTO users (username, password) VALUES
    ('drewk93', 'password');

-- Inserting data into the "games" table
INSERT INTO games (game_name) VALUES
    ('Super Dragon'),
    ('Planet of Battletrade'),
    ('War of the Grapes');

-- Inserting data into the "quests" table
INSERT INTO quests (quest_title, description, game_id) VALUES
    (
    'All Good Things...',
    'Embark on a perilous journey to recover a long-lost artifact that holds the key to ancient mysteries. Face treacherous challenges and uncover the secrets of a forgotten civilization.',
    1
    ),
    (
    'The Goblin Menace',
    'The peaceful village of Greenhaven is under attack by a horde of goblins. Rally a group of heroes to defend the village and put an end to the goblin menace once and for all.',
    1
    ),
    (
    'Riddles of the Enchanted Forest',
    'Venture deep into the heart of the Enchanted Forest, where mystical creatures guard ancient knowledge. Solve riddles, make allies, and unlock the wisdom hidden within.',
    2
    ),
    (
    'The Cursed Amulet',
    'A cursed amulet has brought misfortune to the land, causing crops to wither and darkness to spread. Your quest is to find the amulet''s origin and break the curse before it''s too late.',
    3
    );

-- Inserting data into the "quest_objectives" table
INSERT INTO quest_objectives (objective_title, description, quest_id) VALUES
    ('Find the Artifact',
    'Locate the hidden artifact by following a series of cryptic clues and unraveling ancient puzzles.',
    1
    ),
    ('Defeat the Goblin Chief',
    'Confront the powerful Goblin Chief and defeat him to end the goblin menace once and for all.',
    2
    ),
    ('Solve the Enchanted Riddles',
    'Navigate through the Enchanted Forest and solve the mystical riddles set by the guardian creatures.',
    3
    ),
    ('Break the Curse',
    'Investigate the origin of the cursed amulet, find a way to break the curse, and restore prosperity to the land.',
    4
    ),
    ('Collect Dragon Scales',
    'Embark on a perilous journey to collect rare dragon scales needed for a powerful enchantment.',
    1
    ),
    ('Rescue Captive Villagers',
    'Save the villagers captured by the goblins and bring them back to safety.',
    2
    ),
    ('Befriend the Forest Spirits',
    'Gain the trust and friendship of the mystical forest spirits to unlock their hidden wisdom.',
    3
    ),
    ('Seek the Wise Seer',
    'Find the Wise Seer who possesses knowledge about the origins of the cursed amulet.',
    4
    );
    