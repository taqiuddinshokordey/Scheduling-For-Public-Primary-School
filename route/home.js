const path = require("path");

const home = (req, res) => {
  return res.sendFile(path.join(`${__dirname}/../views/admin_content/testing_upload`));
};

module.exports = {
  getHome: home
};