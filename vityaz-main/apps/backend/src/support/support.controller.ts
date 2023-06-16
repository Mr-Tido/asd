import { SupportService } from '@/support/support.service';
import { SupportRequestDto } from '@/support/support.dto';
import {
    HttpStatus,
    Controller,
    HttpCode,
    Inject,
    Body,
    Post,
} from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiOperation,
    ApiBody,
    ApiTags,
} from '@nestjs/swagger';

@Controller('/')
export class SupportController {
    constructor(
        @Inject(SupportService)
        private readonly supportService: SupportService,
    ) {}

    @ApiTags('Поддержка')
    @ApiBody({ type: SupportRequestDto, description: 'Данные заявки' })
    @ApiOperation({ summary: 'Отправка заявки на поддержку' })
    @ApiCreatedResponse({ description: 'Заявка успешно отправлена' })
    @HttpCode(HttpStatus.CREATED)
    @Post('/support/')
    public sendSupportRequest(
        @Body() credentials: SupportRequestDto,
    ): Promise<void> {
        return this.supportService.sendSupportRequest(credentials);
    }

    @ApiTags('Отзывы')
    @ApiBody({ type: SupportRequestDto, description: 'Данные отзыва' })
    @ApiOperation({ summary: 'Отправка отзыва' })
    @ApiCreatedResponse({ description: 'Отзыв успешно отправлена' })
    @HttpCode(HttpStatus.CREATED)
    @Post('/feedback/')
    public sendFeedback(@Body() credentials: SupportRequestDto): Promise<void> {
        return this.supportService.sendFeedback(credentials);
    }
}
