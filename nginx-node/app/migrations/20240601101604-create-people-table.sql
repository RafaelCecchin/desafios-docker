-- +-------+--------------+------+-----+---------+----------------+
-- | Field | Type         | Null | Key | Default | Extra          |
-- +-------+--------------+------+-----+---------+----------------+
-- | id    | bigint(20)   | NO   | PRI | NULL    | auto_increment |
-- | name  | varchar(150) | NO   |     | NULL    |                |
-- +-------+--------------+------+-----+---------+----------------+

CREATE TABLE IF NOT EXISTS people (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;