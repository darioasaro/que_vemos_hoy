const database = require("../lib/conexionbd");
//Metodo que devuelve las peliculas solicitadas de acuerdo a los filtros
exports.movies = (req, res) => {
  //PARAMETROS
  var sql = "SELECT * FROM pelicula"; //SQL base para las consultas
  var sqlCount = "SELECT COUNT(*) as total FROM pelicula"; //SQL base para la cantidad de datos
  var total = 0; //Total de registros devueltos por la base de datos
  var offset = 0; //OFFSET para la paginacion
  var filter = " "; //Filtro de peliculas
  var order = " "; //Orden que requiere el user
  var queryParameters = []; //Contenedor de los parametros que llevara la query
  const {
    pagina,
    titulo,
    genero,
    anio,
    cantidad,
    columna_orden,
    tipo_orden
  } = req.query; //Parametros de la url

  //de acuerdo a los filtros pasados por request se genera parte de la query
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
    filter += ` WHERE ${queryParameters.shift()}`;

    if (queryParameters.length > 0) {
      queryParameters.map(filtro => {
        filter += " AND " + filtro;
      });
    }
  }

  //Se genera el orden que ejecutara la query
  switch (columna_orden) {
    case "titulo":
      order = " ORDER BY titulo ASC";
      break;
    case "anio":
      order = " ORDER BY anio DESC";
      break;
    case "puntuacion":
      order = " ORDER BY puntuacion DESC";
  }
  //se suma a la query base los filtros y el orden
  sql += filter + order;

  //se genera la query para obtener el total de registros solicitados
  sqlCount += filter;
  

  //Se toma la cantiad de resultados solicitados de acuerdo a que pagina es requerida
  if (cantidad) {
    if (pagina > 1) {
      offset += 52 * (pagina - 1);
    }
    sql += ` LIMIT ${offset},${cantidad} `;
  }

  //---------Llamadas a la BD
  
  //Consulta que retorna la cantidad total de registros obtenidos
  database.query(sqlCount, (err, rows) => {
    if (err)throw err //res.status(500).send("Internal Server Error");
    else {
      total = rows[0].total;
    }
  });
  //Consulta que retorna los registros a enviar con la cantidad solicitada y su offset correspondiente
  database.query(sql, (err, rows) => {
    if (err) {res.status(500).send("Internal Server Error");}
    else {
      res.json({ result: "ok", peliculas: rows, total: total });
    }
  });
};

//Metodo para retornar los generos al frontend
exports.generos = (req, res) => {
  database.query(`SELECT * FROM genero`, (err, rows) => {
    if (err) res.status(500).send("Internal Server Error");
    else {
      res.json({ result: "ok", generos: rows });
    }
  });
};
//Metodo para retornar los datos de la pelicula y sus actores

exports.getMovie = (req, res) => {
  const id = req.params.id
  console.log(id)
 if(id){
  database.query(
      `SELECT p.titulo,p.duracion,p.director,p.anio,
      p.fecha_lanzamiento,p.puntuacion,p.poster,p.trama,g.nombre AS genero,a.nombre AS actor FROM pelicula AS p
      INNER JOIN genero AS g ON p.genero_id = g.id
      INNER JOIN actor_pelicula as ap on ap.pelicula_id = p.id
      INNER JOIN actor as a on a.id = ap.actor_id 
      WHERE p.id = ? `,
      [id],
      (err, rows) => {
        if(err)res.status(500).send("Internal Server Error")
        else{
           const peli = {
                titulo : rows[0].titulo,
                duracion : rows[0].duracion,
                director : rows[0].director,
                anio: rows[0].anio,
                fecha_lanzamiento : rows[0].fecha_lanzamiento,
                puntuacion : rows[0].puntuacion,
                poster : rows[0].poster,
                trama : rows[0].trama,
                nombre : rows[0].genero
            }
            const actores = []
          rows.map(registros=>actores.push({nombre:registros.actor}))
          res.json({pelicula:peli,actores:actores})
        }
      }
    );
 }
 else{

   res.send("Bad request")
 }

};
