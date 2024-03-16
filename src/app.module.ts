import * as fs from 'fs';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

const config = JSON.parse(fs.readFileSync('appconfig.json', 'utf8').toString());

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: config.mongoUri,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
