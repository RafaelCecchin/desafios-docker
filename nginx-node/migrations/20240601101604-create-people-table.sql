USE nodedb;

-- +-------+--------------+------+-----+---------+----------------+
-- | Field | Type         | Null | Key | Default | Extra          |
-- +-------+--------------+------+-----+---------+----------------+
-- | id    | bigint(20)   | NO   | PRI | NULL    | auto_increment |
-- | name  | varchar(150) | NO   |     | NULL    |                |
-- +-------+--------------+------+-----+---------+----------------+

CREATE TABLE people (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL
)