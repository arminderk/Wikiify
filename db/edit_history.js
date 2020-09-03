class EditHistory {
    constructor(connection) {
        this.connection = connection;
    }

    createTable() {
        const sql = `
          CREATE TABLE IF NOT EXISTS edit_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT,
            original_body LONGTEXT,
            new_body LONGTEXT,
            pageId INTEGER,
            edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT edit_history_pageId FOREIGN KEY (pageId)
                REFERENCES pages(id) ON UPDATE CASCADE ON DELETE CASCADE)`;

        return this.connection.run(sql)
    }

    getByID(id) {
        return this.connection.get(`SELECT * FROM edit_history WHERE id = ?`, [id]);
    }

    create(description, originalBody, newBody, pageId) {
        return this.connection.run(
          `INSERT INTO edit_history (description, original_body, new_body, pageId)
            VALUES (?, ?, ?, ?)`,
          [description, originalBody, newBody, pageId])
    }
}

module.exports = EditHistory;