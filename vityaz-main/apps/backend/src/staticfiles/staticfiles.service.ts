/* eslint-disable indent */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CryptoProvider } from '@/shared/crypto.provider';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { Response } from 'express';

@Injectable()
export class StaticService {
    private readonly staticDirectory: string;
    private readonly staticPath: string;

    constructor(
        @Inject(CryptoProvider)
        private readonly cryptoProvider: CryptoProvider,
        @Inject(ConfigService)
        private readonly configService: ConfigService,
    ) {
        this.staticDirectory = join(__dirname, '../../static/');
        this.staticPath = this.configService.getOrThrow('STATIC_PATH');
    }

    public async uploadFile(file: Express.Multer.File, filename?: string) {
        const uploadPath = join(this.staticDirectory);

        if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
        }

        filename = filename
            ? filename
            : this.cryptoProvider.generateUuid({
                  segments: 2,
                  split: false,
              }) + extname(file.originalname);

        await writeFile(join(uploadPath, filename), file.buffer);

        return {
            path: this.getServerUrl(filename),
        };
    }

    private getServerUrl(filename: string) {
        return `${this.getUrl()}/api/static/${filename}`;
    }

    public getFile(response: Response, filename: string): void {
        const path = this.getFilePath(this.staticDirectory, filename);
        return response.sendFile(path);
    }

    private getFilePath(root: string, filename: string): string {
        const path = join(root, filename);

        if (!existsSync(path)) {
            throw new NotFoundException(`File not found`);
        }

        return path;
    }

    public getUrl(): string {
        return `http://${this.configService.getOrThrow(
            'HOST',
        )}:${this.configService.getOrThrow('BACKEND_PORT')}`;
    }
}
