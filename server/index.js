import express from 'express';

const PORT = process.env.PORT || 3030;
const app = express();

app.get('/', (req, res) => {
  res.send('Server is live');
});

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));

export default app;
