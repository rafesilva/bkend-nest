import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './modules/user/user.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const userService = app.get(UserService);

    const adminUser = {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
    };

    try {
        await userService.create(adminUser);
        console.log('Admin user created successfully!');
    } catch (error) {
        console.error('Error creating admin user:', error.message);
    } finally {
        await app.close();
    }
}

bootstrap();
