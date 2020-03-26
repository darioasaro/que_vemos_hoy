const database = require("../lib/conexionbd");

exports.movies = (req, res) => {
  var sql = "SELECT * FROM pelicula";
  const {
    pagina,
    titulo,
    genero,
    anio,
    cantidad,
    columna_orden,
    tipo_orden
  } = req.query;
  var queryParameters = [];

  if (anio) {
    queryParameters.push("anio = " + anio);
  }
  if (titulo) {
    queryParameters.push("titulo LIKE " + `'%${titulo}%'`);
  }
  if (genero) {
    queryParameters.push("genero_id = " + genero);
  }
  if (queryParameters.length > 0) {
    sql += ` WHERE ${queryParameters.shift()}`;

    if (queryParameters.length > 0) {

      queryParameters.map(filtro => {
        sql += " AND " + filtro;
      });
    }
  }
  var order = " ";
  switch(columna_orden){
      case "titulo":
          order = " ORDER BY titulo ASC"
          break;
      case "anio" : 
           order = " ORDER BY anio DESC"
           break;
      case "puntuacion":
          order = " ORDER BY puntuacion DESC"
  }
  sql+=order
  
  console.log("consulta", sql);

  database.query(sql, (err, rows) => {
    if (err) res.status(500).send("Internal Server Error");
    else {
      res.json({ result: "ok", peliculas: rows });
    }
  });

};

exports.generos = (req, res) => {
  database.query(`SELECT * FROM genero`, (err, rows) => {
    if (err) res.status(500).send("Internal Server Error");
    else {
      res.json({ result: "ok", generos: rows });
    }
  });
};
