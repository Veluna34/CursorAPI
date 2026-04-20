const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const db = new sqlite3.Database(path.join(__dirname, 'designs.db'))

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS designs (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      name      TEXT NOT NULL,
      author    TEXT NOT NULL DEFAULT 'Anonymous',
      likes     INTEGER NOT NULL DEFAULT 0,
      downloads INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      color     TEXT NOT NULL DEFAULT '#00f0ff',
      size      INTEGER NOT NULL DEFAULT 14,
      shape     TEXT NOT NULL DEFAULT 'circle',
      trail     INTEGER NOT NULL DEFAULT 1,
      trailCount  INTEGER NOT NULL DEFAULT 20,
      trailEffect TEXT NOT NULL DEFAULT 'disperse',
      clickEffect TEXT NOT NULL DEFAULT 'ripple',
      hoverColor  TEXT NOT NULL DEFAULT '#ff3cac',
      hoverSize   INTEGER NOT NULL DEFAULT 24,
      hoverShape  TEXT NOT NULL DEFAULT 'ring',
      selectColor TEXT NOT NULL DEFAULT '#ffe600',
      selectSize  INTEGER NOT NULL DEFAULT 20,
      selectShape TEXT NOT NULL DEFAULT 'crosshair',
      designData  TEXT
    )
  `, () => {
    // Add designData column if it doesn't exist (for existing databases)
    db.run(`ALTER TABLE designs ADD COLUMN designData TEXT`, () => {})

    // Seed starter designs if empty
    db.get('SELECT COUNT(*) as c FROM designs', (err, row) => {
      if (row.c > 0) return
      const insert = db.prepare(`
        INSERT INTO designs (name, author, likes, downloads, color, size, shape, trail, trailCount, trailEffect, clickEffect, hoverColor, hoverSize, hoverShape, selectColor, selectSize, selectShape)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      const seeds = [
        ['Cyber Neon', 'Aiden', 42, 128, '#00f0ff', 14, 'circle', 1, 30, 'sparkle', 'ripple', '#ff3cac', 24, 'ring', '#ffe600', 20, 'crosshair'],
        ['Blood Moon', 'Aiden', 38, 95, '#ff2244', 16, 'ring', 1, 25, 'comet', 'burst', '#ff6600', 28, 'circle', '#ffaa00', 18, 'ring'],
        ['Ghost', 'Aiden', 27, 74, '#ffffff', 10, 'dot', 1, 40, 'follow', 'ripple', '#cccccc', 20, 'ring', '#aaaaaa', 14, 'dot'],
        ['Matrix', 'Aiden', 55, 201, '#00ff41', 12, 'crosshair', 1, 20, 'disperse', 'burst', '#00cc33', 22, 'crosshair', '#88ff44', 16, 'crosshair'],
      ]
      seeds.forEach(s => insert.run(s))
      insert.finalize()
    })
  })
})

module.exports = db