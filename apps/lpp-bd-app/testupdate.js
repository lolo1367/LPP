const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function runTest() {
  const db = await open({
    filename: path.join(__dirname, 'bd/ww-diet.db'),
    driver: sqlite3.Database
  });

  const result = await db.run('UPDATE categorie SET nom = ? WHERE id = ?', ['TestCat', 1]);
  console.log('Résultat complet :', result); // 👈 doit afficher un objet
  await db.close();
}

runTest().catch(console.error);
