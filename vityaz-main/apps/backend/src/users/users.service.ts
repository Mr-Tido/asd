import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from '@/users/dto/update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/users/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from '@/auth/dto/register.dto';
import { Roles } from 'types/Roles';
import { CryptoProvider } from '@/shared/crypto.provider';

@Injectable()
export class UsersService {
    private readonly cryptoProvider = CryptoProvider;

    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
    ) {}

    public async updateUserInformation(
        user: UserEntity,
        updateUserDto: UpdateUserDto,
    ): Promise<void> {
        if (
            updateUserDto.email &&
            (await this.usersRepository.findOneBy({
                email: updateUserDto.email,
            }))
        ) {
            throw new ConflictException('Email exists');
        }

        await this.usersRepository.update({ id: user.id }, updateUserDto);
    }

    public getUserInformation(user: UserEntity): UserEntity {
        return user;
    }

    public async getUserByEmail(email: string): Promise<UserEntity> {
        const user = await this.usersRepository.findOneBy({ email });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    public userExistsByEmail(email: string): Promise<boolean> {
        return this.usersRepository.exist({ where: { email } });
    }

    public createUser(credentials: RegisterDto): Promise<UserEntity> {
        return this.usersRepository
            .create({ ...credentials, role: Roles.CLIENT })
            .save();
    }

    public async createAdmin(): Promise<void> {
        if (
            await this.usersRepository.exist({
                where: { email: 'shop.vityaz@yandex.ru' },
            })
        ) {
            return;
        }

        await this.usersRepository
            .create({
                email: 'shop.vityaz@yandex.ru',
                password:
                    this.cryptoProvider.generateHashFromPassword(
                        'vityaz_admin',
                    ),
                role: Roles.ADMIN,
            })
            .save();
    }

    public async getUserByLoginAndRefresh(email: string, refreshToken: string) {
        const user = await this.usersRepository.findOneBy({
            refresh: refreshToken,
            email,
        });

        if (!user) throw new NotFoundException('User not found');
        return user;
    }
}
