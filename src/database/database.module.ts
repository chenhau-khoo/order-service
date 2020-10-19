import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from './database.service';

@Module({
  imports: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule { }
