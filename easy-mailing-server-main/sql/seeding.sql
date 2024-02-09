BEGIN;

SET CLIENT_ENCODING TO 'UTF-8';

TRUNCATE "user", "campaign" RESTART IDENTITY;

INSERT INTO "user" ("email", "lastname", "firstname", "password", "createdDate")
VALUES ('admin1@admin.com', 'Mélody', 'Legrand', '$2b$10$ba2iLjcnp3ujUKHoZC7tZewWRw3jDf.F2e/oas.uQwh2HKSZ6gxEe', CURRENT_TIMESTAMP),
('admin2@admin.com', 'Admin', 'Admin', '$2b$10$ba2iLjcnp3ujUKHoZC7tZewWRw3jDf.F2e/oas.uQwh2HKSZ6gxEe', CURRENT_TIMESTAMP),
('admin3@admin.com', 'Admin', 'Admin', '$2b$10$ba2iLjcnp3ujUKHoZC7tZewWRw3jDf.F2e/oas.uQwh2HKSZ6gxEe', CURRENT_TIMESTAMP);

-- INSERT INTO "campaign" ("nameCampaign", "subjectCampaign", "startCampaign", "endCampaign", "creatorEmail", "nbrContact")
-- VALUES ('Soldes 2024', 'Les soldes arrivent !', 'Sat Jan 06 2024 16:00:17 GMT+0100', 'Tue Jan 09 2024 16:00:17 GMT+0100', 'admin1@admin.com', 0),
-- ('Promotions', 'promotions de janvier !', 'Thu Jan 11 2024 16:00:17 GMT+0100 ', 'Fri Jan 26 2024 16:00:17 GMT+0100', 'admin1@admin.com', 0),
-- ('Nouveautés', 'Découvrez nos nouveautés !', 'Sun Jan 14 2024 16:00:17 GMT+0100', 'Thu Jan 25 2024 16:00:17 GMT+0100 ', 'admin1@admin.com', 0),
-- ('Nouveautés', 'Découvrez nos nouveautés !', 'Sun Jan 14 2024 16:00:17 GMT+0100', 'Thu Jan 25 2024 16:00:17 GMT+0100 ', 'admin1@admin.com', 0),
-- ('Nouveautés', 'Découvrez nos nouveautés !', 'Sun Jan 14 2024 16:00:17 GMT+0100', 'Thu Jan 25 2024 16:00:17 GMT+0100 ', 'admin1@admin.com', 0),
-- ('Nouveautés', 'Découvrez nos nouveautés !', 'Sun Jan 14 2024 16:00:17 GMT+0100', 'Thu Jan 25 2024 16:00:17 GMT+0100 ', 'admin1@admin.com', 0),
-- ('Nouveautés', 'Découvrez nos nouveautés !', 'Sun Jan 14 2024 16:00:17 GMT+0100', 'Thu Jan 25 2024 16:00:17 GMT+0100 ', 'admin1@admin.com', 0),
-- ('Nouveautés', 'Découvrez nos nouveautés !', 'Sun Jan 14 2024 16:00:17 GMT+0100', 'Thu Jan 25 2024 16:00:17 GMT+0100 ', 'admin1@admin.com', 0),
-- ('Nouveautés', 'Découvrez nos nouveautés !', 'Sun Jan 14 2024 16:00:17 GMT+0100', 'Thu Jan 25 2024 16:00:17 GMT+0100 ', 'admin1@admin.com', 0),
-- ('Nouveautés', 'Découvrez nos nouveautés !', 'Sun Jan 14 2024 16:00:17 GMT+0100', 'Thu Jan 25 2024 16:00:17 GMT+0100 ', 'admin1@admin.com', 0),
-- ('Nouveautés', 'Découvrez nos nouveautés !', 'Sun Jan 14 2024 16:00:17 GMT+0100', 'Thu Jan 25 2024 16:00:17 GMT+0100 ', 'admin1@admin.com', 0),
-- ('Nouveautés', 'Découvrez nos nouveautés !', 'Sun Jan 14 2024 16:00:17 GMT+0100', 'Thu Jan 25 2024 16:00:17 GMT+0100 ', 'admin1@admin.com', 0),
-- ('Newsletter janvier', 'Newsletter de janvier !', 'Tue Jan 09 2024 16:00:17 GMT+0100', 'Sat Jan 13 2024 16:00:17 GMT+0100', 'admin1@admin.com', 0),
-- ('Newsletter février', 'Newsletter de février !', 'Wed Jan 31 2024 16:00:17 GMT+0100', '	Mon Feb 05 2024 16:00:17 GMT+0100', 'admin1@admin.com', 0);



COMMIT;
