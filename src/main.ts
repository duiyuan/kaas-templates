import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { logger } from './logger/logger.middleware'
import * as express from 'express'
import * as session from 'express-session'
import { ValidationPipe } from '@nestjs/common'
import { TransformInterceptor } from './common/transform.interceptor'
import { HttpExceptionFilter } from './common/httpExceptionFilter.filter'
import * as Sentry from '@sentry/node'
import { SentryFilter } from './common/sentryFilter.filter'
import { ProfilingIntegration } from '@sentry/profiling-node'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

const isProduction = process.env.NODE_ENV === 'production'
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  Sentry.init({
    dsn: process.env.SENTRY_DNS,
    environment: process.env.SENTRY_ENV,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new ProfilingIntegration(),
      new Sentry.Integrations.Express({
        app: app.getHttpServer(),
      }),
    ],
    tracesSampleRate: 1.0,
  })
  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new SentryFilter(httpAdapter))
  app.use(Sentry.Handlers.requestHandler())
  app.use(Sentry.Handlers.tracingHandler())
  app.enableCors({
    origin: true,
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true,
  })
  app.use(
    session({
      secret: 'bitrexe sess',
      resave: false,
      saveUninitialized: false,
      proxy: !isProduction,
      cookie: {
        httpOnly: true,
      },
    }),
  )
  app.use(express.json())
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalPipes(new ValidationPipe())
  app.use(logger)

  // dev docs
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Bitrexe Service')
      .setDescription('Bitrexe API description')
      .setVersion('1.0')
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: { defaultModelsExpandDepth: -1 },
    })
  }
  await app.listen(process.env.PORT)
}
bootstrap()
