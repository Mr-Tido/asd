import { Controller, Inject, Param, Get, Res } from '@nestjs/common';
import { StaticService } from '@/staticfiles/staticfiles.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Статика')
@Controller('/static/')
export class StaticController {
    constructor(
        @Inject(StaticService)
        private readonly staticService: StaticService,
    ) {}

    @ApiOperation({ summary: 'Получение статики с сервера' })
    @ApiOkResponse({
        description: 'Файл был успешно получен',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @Get('/:filename/')
    public getFile(
        @Res() response: Response,
        @Param('filename') filename: string,
    ) {
        this.staticService.getFile(response, filename);
    }
}
