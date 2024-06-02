USE nodedb;
ALTER DATABASE nodedb CHARACTER SET utf8 COLLATE utf8_general_ci;

-- +-------+--------------+------+-----+---------+----------------+
-- | Field | Type         | Null | Key | Default | Extra          |
-- +-------+--------------+------+-----+---------+----------------+
-- | id    | bigint(20)   | NO   | PRI | NULL    | auto_increment |
-- | name  | varchar(150) | NO   |     | NULL    |                |
-- +-------+--------------+------+-----+---------+----------------+

CREATE TABLE IF NOT EXISTS people (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;