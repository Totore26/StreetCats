

export function errorHandler(err, req, res, next) {
  console.log(err.stack);
  res.status(err.status || 500).json({
    code: err.status || 500,
    description: "🚨 ERRORE: " + err.message + " 🚨" || "🚨 Si è verificato un errore sconosciuto 🚨"
  });
}
