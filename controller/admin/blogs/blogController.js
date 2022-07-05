const con = require("../../../database/dbConnection");

// inser blog
const inserBlog = (con, data, res) => {
  const sql = `INSERT INTO blogs( title, creatorID, description, creatorName, thumbnail, tags) VALUES (${JSON.stringify(
    data.title
  )},${data.creatorID}, ${JSON.stringify(data.description)}, ${JSON.stringify(
    data.creatorName
  )}, ${JSON.stringify(data.thumnel)}, ${JSON.stringify(data.tags)} )`;

  con.query(sql, (err) => {
    if (err) {
      res.status(400).json("Internal server errors!");
    } else {
      res.status(200).json("Blog add successfull");
    }
  });
};

// update blog query
const updateBlog = (con, data, res) => {
  const sql = `UPDATE blogs SET departmentID=null,thumbnail = ${JSON.stringify(
    data.thumnel
  )},title=${JSON.stringify(
    data.title
  )},date=null,timeToRead=null,description=${JSON.stringify(
    data.description
  )},tags=${JSON.stringify(data.tags)} WHERE id = ${data.id}`;

  con.query(sql, (err) => {
    if (err) {
      // console.log(err);
      res.status(400).json("Internal server errors!");
    } else {
      res.status(200).json("Blog update successfull");
    }
  });
};

// add blog
async function addBlog(req, res, next) {
  const { title, description, tags } = req.body;
  if (req.user) {
    if (req.files && req.files.length > 0) {
      const data = {
        title,
        description,
        tags,
        creatorID: req.user.id,
        creatorName: req.user.firstName + " " + req.user.lastName,
        thumnel: req.files[0].path,
      };

      inserBlog(con, data, res);
    } else {
      res.status(500).json({
        errors: {
          image: {
            msg: "Blog thumnul image is require!",
          },
        },
      });
    }
  } else {
    res.status(400).json({
      errors: {
        common: {
          msg: "Authentication failure!",
        },
      },
    });
  }
}

//get blogs
async function getBlogs(req, res, next) {
  if (req.user) {
    const sql = `SELECT * FROM blogs`;
    con.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json("Internal server error");
      } else {
        res.status(200).json(rows);
      }
    });
  } else {
    res.status(400).json({
      errors: {
        common: {
          msg: "Authentication failure!",
        },
      },
    });
  }
}

// get single blog
async function getSingleBlog(req, res, next) {
  const id = req.params.id;
  if (req.user) {
    const sql = `SELECT * FROM blogs WHERE id= ${id}`;
    con.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json("Internal server error");
      } else {
        res.status(200).json(rows[0]);
      }
    });
  } else {
    res.status(400).json({
      errors: {
        common: {
          msg: "Authentication failure!",
        },
      },
    });
  }
}

// update blog
async function updateSingleBlog(req, res, next) {
  const { title, description, tags } = req.body;
  if (req.user) {
    const id = req.params.id;
    con.query(`SELECT * FROM blogs WHERE id=${id}`, (err, rows) => {
      if (err) {
        res.status(400).json({
          errors: {
            common: "Internal server errors",
          },
        });
      } else {
        const data = {
          id,
          title,
          description,
          tags,
          creatorID: req.user.id,
          creatorName: req.user.firstName + " " + req.user.lastName,
          thumnel: req.files.length > 0 ? req.files[0].path : rows[0].thumbnail,
        };

        updateBlog(con, data, res);
      }
    });
  } else {
    res.status(400).json({
      errors: {
        common: {
          msg: "Authentication failure!",
        },
      },
    });
  }
}
// module exports
module.exports = { addBlog, getBlogs, getSingleBlog, updateSingleBlog };
