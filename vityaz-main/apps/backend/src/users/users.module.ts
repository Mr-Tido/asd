import { UsersController } from '@/users/users.controller';
import { UsersService } from '@/users/users.service';
import { UserEntity } from '@/users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inject, Module } from '@nestjs/common';

const dynamicTypeormModule = TypeOrmModule.forFeature([UserEntity]);

@Module({
    imports: [dynamicTypeormModule],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [dynamicTypeormModule, UsersService],
})
export class UsersModule {
    constructor(@Inject(UsersService) usersService: UsersService) {
        usersService.createAdmin().then();
    }
}
