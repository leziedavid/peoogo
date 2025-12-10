const fs = require("fs");
const path = require("path");

// Fonction pour parcourir récursivement les dossiers
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (stats.isFile() && fullPath.endsWith(".tsx")) {
      callback(fullPath);
    }
  });
}

// Fonction pour remplacer les props legacy de next/image
function updateImageProps(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let updated = content;

  // Exemple : layout="responsive" => remove
  updated = updated.replace(/layout\s*=\s*["']responsive["']/g, "");
  // objectFit="cover" => replace par style={{ objectFit: 'cover' }} si nécessaire
  updated = updated.replace(/objectFit\s*=\s*["']cover["']/g, "");

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, "utf8");
    console.log("Updated:", filePath);
  }
}

// Répertoire à parcourir
const targetDir = path.join(__dirname, "components");

// Lancer la migration
walkDir(targetDir, updateImageProps);

console.log("✅ Migration des images legacy terminée.");
