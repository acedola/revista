require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs-extra");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const validator = require("validator");
const xss = require("xss");
const bcrypt = require("bcrypt");
const session = require("express-session");
const { Parser } = require("json2csv");

const app = express();
const PORT = process.env.PORT || 3000;

/* =======================
   SEGURIDAD
======================= */

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: [
          "'self'",
          "http://localhost:*",
          "ws://localhost:*"
        ],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"]
      }
    }
  })
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false // ⚠ cambiar a true en producción con HTTPS
    }
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  })
);

/* =======================
   ARCHIVOS Y CARPETAS
======================= */

const dataPath = path.join(__dirname, "data/registros.json");
const backupDir = path.join(__dirname, "data/backups");

fs.ensureDirSync("uploads");
fs.ensureDirSync("data");
fs.ensureDirSync(backupDir);

if (!fs.existsSync(dataPath)) {
  fs.writeJsonSync(dataPath, []);
}

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

/* =======================
   BACKUP AUTOMÁTICO
======================= */

async function backupJSON() {
  const timestamp = new Date().toISOString().replace(/:/g, "-");
  const backupPath = path.join(backupDir, `backup-${timestamp}.json`);
  await fs.copy(dataPath, backupPath);
}

/* =======================
   MULTER
======================= */

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Solo se permiten PDFs"));
  }
});

/* =======================
   MIDDLEWARE AUTH
======================= */

function auth(req, res, next) {
  if (!req.session.auth) {
    return res.redirect("/login.html");
  }
  next();
}

/* =======================
   FORMULARIO
======================= */

app.post("/submit", upload.single("adjunto"), async (req, res) => {
  try {
    const body = {};
    for (let key in req.body) {
      body[key] = xss(req.body[key]);
    }

    if (!validator.isEmail(body.correo)) {
      return res.status(400).json({ error: "Correo inválido" });
    }

    const registro = {
      ...body,
      archivo: req.file ? req.file.filename : null,
      fecha: new Date().toISOString()
    };

    const registros = await fs.readJson(dataPath);
    registros.push(registro);
    await fs.writeJson(dataPath, registros, { spaces: 2 });

    await backupJSON();

    console.log("Nuevo formulario recibido:", body.nombre, body.apellido);

    res.json({ message: "Enviado correctamente" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =======================
   LOGIN ADMIN
======================= */

app.post("/admin/login", async (req, res) => {
  const { user, pass } = req.body;

  if (user !== process.env.ADMIN_USER) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const valid = await bcrypt.compare(pass, process.env.ADMIN_PASS_HASH);

  if (!valid) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  req.session.auth = true;
  res.json({ message: "Login correcto" });
});

/* =======================
   LOGOUT
======================= */

// app.get("/admin/logout", (req, res) => {
//   req.session.destroy(() => {
//     res.redirect("/login.html");
//   });
// });
app.post("/admin/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logout correcto" });
  });
});
/* =======================
   PANEL ADMIN PROTEGIDO
======================= */

app.get("/admin", auth, (req, res) => {
  res.sendFile(path.join(__dirname, "views/admin.html"));
});

app.get("/admin/data", auth, async (req, res) => {
  const registros = await fs.readJson(dataPath);
  res.json(registros);
});

app.get("/admin/export", auth, async (req, res) => {
  const registros = await fs.readJson(dataPath);

  if (!registros.length) {
    return res.status(400).json({ error: "No hay datos para exportar" });
  }

  const parser = new Parser();
  const csv = parser.parse(registros);

  res.header("Content-Type", "text/csv");
  res.attachment("registros.csv");
  res.send(csv);
});

/* =======================
   INICIO SERVIDOR
======================= */

app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});