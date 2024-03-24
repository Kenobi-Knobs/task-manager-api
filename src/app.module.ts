import * as fs from 'fs';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';

const config = JSON.parse(fs.readFileSync('appconfig.json', 'utf8').toString());

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: config.mongoUri,
      }),
    }),
    UserModule,
    AuthModule,
    TaskModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
