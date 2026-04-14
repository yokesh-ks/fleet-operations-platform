import createHttpError, { HttpError } from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import vesselsRouter from './routes/vessels';
import voyageTelemetryRouter from './modules/voyage-telemetry/voyage-telemetry.routes';
import fuelReportsRouter from './modules/fuel-reports/fuel-reports.routes';
import portBenchmarksRouter from './modules/port-benchmarks/port-benchmarks.routes';

const app = express();

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/vessels', vesselsRouter);
app.use('/api/voyage-telemetry', voyageTelemetryRouter);
app.use('/api/fuel-reports', fuelReportsRouter);
app.use('/api/port-benchmarks', portBenchmarksRouter);

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createHttpError(404));
});

// error handler
app.use(function(err: HttpError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // return JSON error response
  res.status(err.status || 500);
  res.json({
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { error: err })
  });
});

export default app;
