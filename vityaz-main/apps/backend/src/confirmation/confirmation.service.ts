import { ConfirmationEntity } from '@/confirmation/confirmation.entity';
import { ConfirmationDto } from '@/confirmation/confirmation.dto';
import { UsersService } from '@/users/users.service';
import { MailsService } from '@/mails/mails.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/users/user.entity';
import { Repository } from 'typeorm';
import {
    MethodNotAllowedException,
    BadRequestException,
    NotFoundException,
    Injectable,
    Inject,
} from '@nestjs/common';

@Injectable()
export class ConfirmationService {
    constructor(
        @InjectRepository(ConfirmationEntity)
        private readonly confirmationsRepository: Repository<ConfirmationEntity>,
        @Inject(UsersService)
        private readonly usersService: UsersService,
        @Inject(MailsService)
        private readonly mailsService: MailsService,
    ) {}

    public async createConfirmation(
        email: string,
        user?: UserEntity,
    ): Promise<ConfirmationEntity> {
        if (!user) {
            const nullableUser = await this.usersService.getUserByEmail(email);

            if (!nullableUser) {
                throw new NotFoundException('User not found');
            }

            user = nullableUser;
        }

        await this.confirmationsRepository.delete({ user: { id: user.id } });

        const code = Math.floor((1 + Math.random() * 9) * 10000000);

        const verification = await this.confirmationsRepository.create({
            email,
            user,
            code,
        });

        await this.sendConfirmation(user.email, code);
        return verification.save();
    }

    public async confirmCode(
        credentials: ConfirmationDto,
    ): Promise<UserEntity> {
        const confirmation = await this.confirmationsRepository.findOneBy({
            email: credentials.email,
        });

        if (!confirmation) {
            throw new MethodNotAllowedException(
                'User does not have confirmation mails',
            );
        }

        if (confirmation.code !== credentials.code) {
            throw new BadRequestException('Invalid confirmation code');
        }

        return (await confirmation.remove()).user;
    }

    public async sendConfirmation(
        receiver: string,
        code: number,
    ): Promise<void> {
        await this.mailsService.sendMail(
            receiver,
            'Код для входа',
            code.toString(),
        );
    }
}
