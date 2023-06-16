import { registerAs } from '@nestjs/config';
import * as process from 'process';

interface JwtConfigWorkspaceType {
    keys: {
        public: string;
        private: string;
    };
}

export const JwtConfigWorkspace = registerAs('jwt', () => {
    return {
        keys: {
            public: process.env.JWT_PUBLIC_KEY,
            private: process.env.JWT_PRIVATE_KEY,
        },
    } as JwtConfigWorkspaceType;
});
