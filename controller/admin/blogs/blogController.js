const con = require("../../../database/dbConnection");

// inser blog
const inserBlog = (con, data, res) => {
  //   console.log(typeof JSON.stringify(data.tags));
  const sql = `INSERT INTO blogs( title, creatorID, description, creatorName, image, tags) VALUES (${JSON.stringify(
    data.title
  )},${data.creatorID}, ${JSON.stringify(data.description)}, ${JSON.stringify(
    data.creatorName
  )}, ${JSON.stringify(data.image)}, ${JSON.stringify(data.tags)} )`;

  con.query(sql, (err) => {
    if (err) {
      console.log(err);
      res.status(500).json("Internal server errors!");
    } else {
      res.status(200).json("Blog add successfull");
    }
  });
};

// add blog
async function addBlog(req, res, next) {
  const { title, description, tags, file } = req.body;
  if (req.user) {
    const data = {
      title,
      description,
      tags,
      image: "",
      creatorID: req.user.id,
      creatorName: req.user.firstName + " " + req.user.lastName,
    };

    inserBlog(con, data, res);
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
// module exports
module.exports = { addBlog, getBlogs, getSingleBlog };
