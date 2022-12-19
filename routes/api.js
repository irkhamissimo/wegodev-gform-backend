import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({title: `Hello ${req.query.nama}, umur ${req.body.umur}`})
})

router.post('/', (req, res) => {
  res.json({
    title: `Hello ${req.body.orang.nama}!, umur: ${req.body.orang.umur}`,
  });
});

export default router;