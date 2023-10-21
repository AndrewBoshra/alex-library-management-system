import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';
import { CommonModule } from './common/common.module';
import databaseConfig from './config/database.config';
import { BorrowingModule } from '@borrowing/borrowing.module';
import { AuthorsModule } from '@author/authors.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...config.get('database'),
        autoLoadEntities: true,
      }),
    }),
    CommonModule,
    AuthorsModule,
    BooksModule,
    BorrowingModule,
  ],
})
export class AppModule {}
