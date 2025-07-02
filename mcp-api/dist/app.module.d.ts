import { OnModuleInit } from '@nestjs/common';
import { SeedService } from './database/seed.service';
export declare class AppModule implements OnModuleInit {
    private readonly seeder;
    constructor(seeder: SeedService);
    onModuleInit(): Promise<void>;
}
