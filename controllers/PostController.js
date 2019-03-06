// importing Post model
const Post = require("../models/Post");
// importing express router for post routes creation
const router = require("express").Router();
// importing multer for handling upload of images
const multer = require("multer");
const gcsSharp = require("multer-sharp");
// importing path for grabbing the file extension
const path = require("path");

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_KEY,
  accessKeyId: process.env.AWS_ACCESS_ID_KEY,
  region: "us-east-2"
});

const storage = gcsSharp({
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
  bucket: "ccblogposts",
  projectId: "647756367460",
  acls: "publicRead",
  size: {
    width: 1200,
    height: 800
  },
  max: true
});

const upload = multer({ storage: storage });

/**
 * this route will deliver all posts to the user
 * @returns {object} posts
 */
router.get("/all", (req, res) => {
  // find all posts and return them
  Post.find({}, (err, posts) => {
    if (err) {
      res.status(500).send({
        err,
        success: false,
        message:
          "an error occured when trying to retrieve all posts please try again"
      });
    } else {
      if (posts) {
        res.status(200).send({
          post: posts,
          success: true,
          message: "here are all the posts"
        });
      } else {
        res.status(400).send({
          success: false,
          message: "failed retrieving posts. Please try again"
        });
      }
    }
  }).sort({ createdOn: -1 });
});

/**
 * this route gets one single post to the user
 * @param {string} id
 * @returns {object} post
 */

router.get("/single/:id", (req, res) => {
  // if id params does not exist do something
  if (!req.params.id) {
    res.status(400).send({
      success: false,
      message: "A post id is necessary to return a post"
    });
  } else {
    // if id params exist go on and find it and return it
    Post.findOne({ _id: req.params.id }, (err, post) => {
      if (err) {
        res.status(400).send({
          err,
          success: false,
          message: "That post is not in our database"
        });
      } else {
        if (post) {
          res.status(200).send({
            post,
            success: true,
            message: "we found the post you requested :)"
          });
        }
      }
    });
  }
});

/**
 * This route is for saving each post that will be created
 * @param {string} title
 * @param {string} image
 * @param {string} body
 * @returns {object} error | json
 */
router.post("/add", upload.single("image"), (req, res) => {
  // if title does not exist on the req body do something
  if (!req.body.title) {
    res.status(400).send({
      success: false,
      message: "title is required"
    });
  } else {
    // if file image does not exist on the req file do something
    if (!req.file) {
      res.status(400).send({
        success: false,
        message: "image is required"
      });
    } else {
      // if body does not exist on the req body do something
      if (!req.body.body) {
        res.status(400).send({
          success: false,
          message: "body is required"
        });
      } else {
        // if we have all params create the post
        Post.create(
          {
            title: req.body.title,
            image: req.file.Location,
            body: req.body.body,
            email: req.body.email,
            creator: req.body.name
          },
          (err, post) => {
            if (err) {
              res.status(400).send({
                err,
                success: false,
                message: "Post was not saved. Please try again."
              });
            } else {
              if (post) {
                res.status(200).send({
                  post,
                  success: true,
                  message: "Your Post saved successfully"
                });
              }
            }
          }
        );
      }
    }
  }
});

/**
 * this route deletes one post
 * @param {string} id
 * @returns {object}
 */
router.delete("/delete/:id", (req, res) => {
  // if id params does not exist do something
  if (!req.params.id) {
    res.status(400).send({
      success: false,
      message: "We need an id in order to delete a post"
    });
  } else {
    // if id params exist go ahead the delete
    Post.deleteOne({ _id: req.params.id }, err => {
      if (err) {
        res.status(400).send({
          success: false,
          message: "We did not find a post with that id"
        });
      } else {
        res.status(200).send({
          success: true,
          message: "Post deleted with success"
        });
      }
    });
  }
});

/**
 * this route updates one post
 * @param {string} id
 * @param {string} title
 * @param {string | object} image
 * @param {string} body
 * @param {string} lastUpdated
 * @returns {object}
 */

router.put("/update/:id", upload.single("image"), (req, res) => {
  // if id params does not exist do something
  if (!req.params.id) {
    res.status(400).send({
      success: false,
      message: "We need an id to update a post"
    });
  } else {
    // if req file is undefined or null or empty
    const aImage = !req.file ? req.body.image : `${req.file.Location}`;
    // we have all params go ahead and update the post
    Post.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          image: aImage,
          body: req.body.body,
          lastUpdated: req.body.lastUpdated
        }
      },
      err => {
        if (err) {
          res.status(400).send({
            success: false,
            message: "The post you requested to update is not in our database"
          });
        } else {
          res.status(200).send({
            success: true,
            message: "Your post has been updated successfully"
          });
        }
      }
    );
  }
});

module.exports = router;
