import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaClientService extends PrismaClient implements OnModuleInit {
    onModuleInit(): Promise<void>;
}
