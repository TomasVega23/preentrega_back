import { CreateUserDto, GetUserDto } from "../dao/dto/user.dto.js";


export class UserReposiroty {
    constructor(dao) {
        this.dao = dao;
    }

    async getUser(){
        const user = await this.dao.get()
        return user;
    }
    async CreateUser(user){
        const userDto = new CreateUserDto(user);
        const useCreated = await this.dao.post(userDto);
        const userDtoFront = new GetUserDto(useCreated);
        return userDtoFront;   
    }
}