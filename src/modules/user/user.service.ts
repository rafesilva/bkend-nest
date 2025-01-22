import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { username, password, role } = createUserDto;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({
            username,
            password: hashedPassword,
            role,
        });

        return this.userRepository.save(user);
    }

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);

        // If password is being updated, re-hash it
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        Object.assign(user, updateUserDto);
        return this.userRepository.save(user);
    }

    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        await this.userRepository.remove(user);
    }

    async findByUsername(username: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { username } });
    }
}