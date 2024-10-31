const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory storage
let courts = [];

// Get all courts
router.get('/', (req, res) => {
  res.json(courts);
});

// Get single court
router.get('/:id', (req, res) => {
  const court = courts.find(c => c.id === req.params.id);
  if (!court) return res.status(404).json({ message: 'Court not found' });
  res.json(court);
});

// Create court (admin only)
router.post('/', (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const { name, type, pricePerHour } = req.body;
  
  if (!name || !type || !pricePerHour) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const court = {
    id: uuidv4(),
    name,
    type,
    pricePerHour,
    isAvailable: true
  };

  courts.push(court);
  res.status(201).json(court);
});

// Update court (admin only)
router.put('/:id', (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const index = courts.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Court not found' });

  const updatedCourt = {
    ...courts[index],
    ...req.body,
    id: courts[index].id
  };

  courts[index] = updatedCourt;
  res.json(updatedCourt);
});

// Delete court (admin only)
router.delete('/:id', (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const index = courts.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Court not found' });

  courts.splice(index, 1);
  res.status(204).send();
});

module.exports = router;