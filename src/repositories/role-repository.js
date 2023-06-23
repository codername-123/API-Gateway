const CrudRepository = require("./crud-repository");
const { Role } = require("../models");
class RoleRepsitory extends CrudRepository {
  constructor() {
    super(Role);
  }

  async getRoleByName(name) {
    const role = await Role.findOne({ where: { name: name } });
    return role;
  }
}

module.exports = RoleRepsitory;
