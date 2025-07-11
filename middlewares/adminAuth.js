function adminAuth(req, res, next) {
  if (req.user && req.user.cargo === "admin") {
    return next();
  } else {
    return res.status(403).json({ erro: "Acesso permitido apenas para administradores." });
  }
}

module.exports = adminAuth;