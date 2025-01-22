import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, pass: string): Promise<User> {
        const user = await this.userService.findByUsername(username);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

    async login(user: User) {
        const payload = {
            sub: user.id,
            username: user.username,
            role: user.role,
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}