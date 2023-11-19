-- Inserting data into the "users" table
INSERT INTO users (username, password) VALUES
    ('drewk93', '$2b$10$/hMwl79gx9MsTMC4Z2tbcuRowTisfHAd3TXjsgBYhRx4I5l8a3P3q');

-- Inserting data into the "games" table
INSERT INTO games (game_name) VALUES
    ('Claymore'),
    ('Star Hammer Beyond'),
    ('Hell Force: Cerberus');

-- CLAYMORE

INSERT INTO quests (quest_title, quest_description, game_id) VALUES 
    ('All Good Things...',
    'Search for an ancient relic hidden within in a haunted forest.', 
    1
    ),
    ('The Goblin Menace',
    'The peaceful village of Greenhaven is under attack by a horde of goblins. Rally a group of heroes to defend it.', 
    1
    ),
    ('Riddles',
    'A strange sphinx showed up at the edge of town. What does it want?',
    1
    ),
    ('The Cursed Amulet of Sha-Harath',
    'A strange woman asks for help removing a cursed amulet.',
    1
    );

INSERT INTO quest_objectives (objective_title, objective_description, quest_id) VALUES
    ('Escape the town of Blackhall',
    'The town is under siege, find the safest route out.',
    1),
    ('Hide from the scouts',
    'The Dragon Army is searching for you. Hide',
    1),
    ('Find Zel Mandus',
    'Search the town of Neverworth for clues of the wizard Zel''s Whereabouts',
    1),
    ('Rent a room at the Buckleberry Inn',
    'Talk to Will the Innkeeper',
    1);

-- STAR HAMMER BEYOND

INSERT INTO quests (quest_title, quest_description, game_id) VALUES 
    ('Recover Lost Technology',
    'Embark on a mission to recover advanced alien technology on the planet.',
    2
    ),
    ('The Cosmic Anomaly',
    'Investigate a mysterious cosmic anomaly on the outskirts of the galaxy.',
    2
    ),
    ('The Enigmatic Guardians',
    'Uncover the secrets of an ancient race of cosmic guardians.',
    2
    ),
    ('The Celestial Nexus',
    'Embark on a journey to the legendary Celestial Nexus hidden in the cosmic expanse.',
    2
    );

INSERT INTO quest_objectives (objective_title, objective_description, quest_id) VALUES
    ('Locate the Abandoned Facility',
    'Find the abandoned research facility rumored to hold the technology.',
    5
    ),
    ('Bypass Security Measures',
    'Overcome the security systems guarding the facility.',
    5
    ),
    ('Retrieve Alien Technology',
    'Secure the advanced alien technology hidden within the facility.',
    5
    ),
    ('Escape with the Loot',
    'Make a daring escape from the facility while evading pursuers.',
    5
    );

-- HELL FORCE: CERBERUS

INSERT INTO quests (quest_title, quest_description, game_id) VALUES 
    ('Dark Abyss Resurgence',
    'Face the resurgence of an ancient evil from the depths of the abyss.',
    3
    ),
    ('The Infernal Portal',
    'Close a portal to the infernal realm that threatens to engulf the world.',
    3
    ),
    ('Shadow Overlord Awakening',
    'Prevent the awakening of a powerful shadow overlord threatening to plunge the realm into darkness.',
    3
    ),
    ('Rise of the Infernal Legion',
    'Halt the rise of an infernal legion threatening to overrun the mortal world.',
    3
    );

INSERT INTO quest_objectives (objective_title, objective_description, quest_id) VALUES 
    ('Investigate Ominous Signs',
    'Respond to ominous signs and disturbances in the land.',
    9
    ),
    ('Unearth Abyssal Threat',
    'Discover the source of the abyssal resurgence and its threat.',
    9
    ),
    ('Gather a Fellowship',
    'Assemble a fellowship of heroes to confront the abyssal evil.',
    9
    ),
    ('Banish the Abyssal Entity',
    'Engage in a climactic battle to banish the abyssal entity back to the depths.',
    9
    ),
    ('Locate the Infernal Portal',
    'Track down the infernal portal''s location before it''s too late.',
    10
    ),
    ('Gather Elemental Seals',
    'Collect elemental seals required to close the portal.',
    10
    ),
    ('Confront Infernal Guardians',
    'Face the infernal guardians defending the portal.',
    10
    ),
    ('Seal the Portal',
    'Use the gathered seals to seal the infernal portal and save the world.',
    10
    ),
    ('Investigate Eerie Phenomena',
    'Respond to eerie phenomena hinting at the shadow overlord''s awakening.',
    11
    ),
    ('Retrieve Relics of Light',
    'Retrieve ancient relics of light to counter the shadow overlord.',
    11
    ),
    ('Face the Shadow Minions',
    'Confront the shadow minions sent by the overlord to thwart your efforts.',
    11
    ),
    ('Defeat the Shadow Overlord',
    'Engage in an epic battle against the awakened shadow overlord to save the realm.',
    11
    ),
    ('Gather Intel on  Legion',
    'Collect information about the infernal legion''s leaders and plans.',
    12
    ),
    ('Form an Alliance',
    'Forge alliances with other factions to unite against the infernal legion.',
    12
    ),
    ('Battlefront Defense',
    'Defend key battlefronts against waves of infernal legion forces.',
    12
    ),
    ('Strike at the Legion''s Heart',
    'Launch a decisive assault to cripple the infernal legion''s leadership.',
    12
    );