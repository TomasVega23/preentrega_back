import { UserReposiroty } from "./users.repository.js";
import { Users } from '../dao/dbManagers/userManagerSB.js';

export const userService = new UserReposiroty(Users)