import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    UseGuards,
    Render
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { RolesGuard } from '../role/roles.guard';
import { Roles } from '../role/roles.decorator';
import { Role } from '../role/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Roles(Role.Admin)
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findOne(id);
    }

    @Roles(Role.Admin)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.userService.update(id, updateUserDto);
    }

    @Roles(Role.Admin)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.userService.remove(id);
    }

    @Get('create')
    @Render('create-user')
    createUserForm() {
        return { title: 'Create User' };
    }

    @Post('create')
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }
}

