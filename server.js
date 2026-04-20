const express = require('express')
const cors = require('cors')
const db = require('./database')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// ── GET /designs ───────────────────────────────────────────────────────────
app.get('/designs', (req, res) => {
  const sort = req.query.sort === 'recent' ? 'createdAt DESC' : 'likes DESC'
  db.all(`SELECT * FROM designs ORDER BY ${sort}`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
})

// ── GET /designs/:id ───────────────────────────────────────────────────────
app.get('/designs/:id', (req, res) => {
  db.get('SELECT * FROM designs WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message })
    if (!row) return res.status(404).json({ error: 'Not found' })
    res.json(row)
  })
})

// ── POST /designs ──────────────────────────────────────────────────────────
app.post('/designs', (req, res) => {
  const {
    name, author = 'Anonymous',
    color, size, shape,
    trail, trailCount, trailEffect,
    clickEffect,
    hoverColor, hoverSize, hoverShape,
    selectColor, selectSize, selectShape,
    designData,  // full engine JSON blob
  } = req.body

  if (!name || !color || !shape) {
    return res.status(400).json({ error: 'name, color, and shape are required' })
  }

  // store designData as JSON string if it's an object
  const designDataStr = designData
    ? (typeof designData === 'string' ? designData : JSON.stringify(designData))
    : null

  db.run(`
    INSERT INTO designs (name, author, color, size, shape, trail, trailCount, trailEffect, clickEffect, hoverColor, hoverSize, hoverShape, selectColor, selectSize, selectShape, designData)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    name, author, color, size || 14, shape,
    trail ? 1 : 0, trailCount || 20, trailEffect || 'disperse',
    clickEffect || 'ripple',
    hoverColor || '#ff3cac', hoverSize || 24, hoverShape || 'ring',
    selectColor || '#ffe600', selectSize || 20, selectShape || 'crosshair',
    designDataStr,
  ],
  function (err) {
    if (err) return res.status(500).json({ error: err.message })
    db.get('SELECT * FROM designs WHERE id = ?', [this.lastID], (err, row) => {
      if (err) return res.status(500).json({ error: err.message })
      res.status(201).json(row)
    })
  })
})

// ── POST /designs/:id/like ─────────────────────────────────────────────────
app.post('/designs/:id/like', (req, res) => {
  db.run('UPDATE designs SET likes = likes + 1 WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message })
    db.get('SELECT likes FROM designs WHERE id = ?', [req.params.id], (err, row) => {
      if (!row) return res.status(404).json({ error: 'Not found' })
      res.json({ likes: row.likes })
    })
  })
})

// ── POST /designs/:id/download ─────────────────────────────────────────────
app.post('/designs/:id/download', (req, res) => {
  db.run('UPDATE designs SET downloads = downloads + 1 WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message })
    db.get('SELECT downloads FROM designs WHERE id = ?', [req.params.id], (err, row) => {
      if (!row) return res.status(404).json({ error: 'Not found' })
      res.json({ downloads: row.downloads })
    })
  })
})

// ── DELETE /designs/:id ────────────────────────────────────────────────────
app.delete('/designs/:id', (req, res) => {
  db.run('DELETE FROM designs WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ success: true })
  })
})

app.listen(PORT, () => {
  console.log(`Cursor API running on http://localhost:${PORT}`)
})