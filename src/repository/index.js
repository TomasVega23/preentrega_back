import { UserReposiroty } from "./users.repository.js";
import { Users } from '../dao/dbManagers/userManagerSB.js';
import { CartReposiry } from "./cart.repository.js";
import { ProductRepository } from "./product.repository.js";
import DbTicketRepository from "./ticket.repository.js";

import { Carts } from '../dao/dbManagers/cartManagerSB.js';
import { Products } from '../dao/dbManagers/productManagerSB.js';

export const userService = new UserReposiroty(Users)

export const cartService = new CartReposiry(Carts)

export const productService = new ProductRepository(Products)

export const ticketService = new DbTicketRepository()