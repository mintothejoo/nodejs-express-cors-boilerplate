export const init = (req, res, next) => {
  console.log('HIHI');
  return res.json({ message: 'hi'  });
};
