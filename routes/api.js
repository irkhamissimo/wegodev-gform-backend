import express from 'express';
import AuthController from '../controllers/AuthController.js'

const router = express.Router();

router.get('/', (req, res) => {
  res.json({title: `Hello ${req.query.nama}, umur ${req.body.umur}`})
})

router.post('/', (req, res) => {
  res.json({
    title: `Hello ${req.body.orang.nama}!, umur: ${req.body.orang.umur}`,
  });
});

router.post('/register', AuthController.register)

export default router;