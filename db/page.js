class Page {
    constructor(connection) {
        this.connection = connection;
    }

    createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS pages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            body TEXT)`;
        return this.connection.run(sql);
    }

    createFTS()
    {
        const sql = `
            CREATE VIRTUAL TABLE IF NOT EXISTS pages_fts
            USING fts5(title, body, content=pages, content_rowid=id)`;
        return this.connection.run(sql);
    }

    createFTSTriggers() {
        const sql = `
            CREATE TRIGGER IF NOT EXISTS tbl_ai AFTER INSERT ON pages BEGIN
                INSERT INTO pages_fts(rowid, title, body) VALUES (new.id, new.title, new.body);
            END;
            CREATE TRIGGER IF NOT EXISTS tbl_au AFTER INSERT ON pages BEGIN
                INSERT INTO pages_fts(pages_fts, rowid, title, body) VALUES ('delete', old.id, old.title, old.body);
                INSERT INTO pages_fts(rowid, title, body) VALUES (new.id, new.title, new.body);
            END;`;
        return this.connection.run(sql);
    }

    initializeMainPage() {
        this.create('Main_Page', 'This is the main page of the wiki!');
    }

    getAll() {
        return this.connection.all(`SELECT * FROM pages`);
    }

    getByID(id) {
        return this.connection.get(`SELECT * FROM pages WHERE id = ?`, [id]);
    }

    getByTitle(title) {
        return this.connection.get(`SELECT * FROM pages WHERE title = ?`, [title]);
    }

    getEditHistory(pageId) {
        return this.connection.all(`SELECT * FROM edit_history WHERE pageId = ?`, [pageId]);
    }

    getFTS(query) {
        return this.connection.all(
            `SELECT * FROM pages WHERE id IN
                (SELECT rowid FROM pages_fts WHERE pages_fts MATCH ?)`, [query]);
    }

    create(title, body) {
        return this.connection.run(`INSERT INTO pages (title, body) VALUES (?, ?)`, [title, body]);
    }

    update(id, title, body) {
        return this.connection.run(
            `UPDATE pages SET title = ?, body = ? WHERE id = ?`,
            [title, body, id]
        )
    }
}

module.exports = Page;