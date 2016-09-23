import gulp from 'gulp';
import rimraf from 'rimraf';

const tasks = require('./gulptasks');

// Public Tasks
gulp.task('clean:server', cb => rimraf('./build', cb));
gulp.task('clean:client', cb => rimraf('./public/build', cb));
gulp.task('clean', gulp.parallel('clean:server', 'clean:client'));

gulp.task('dev:server', gulp.series('clean:server', tasks.devServerBuild));
gulp.task('dev', gulp.series('clean', tasks.devServerBuild,
    gulp.parallel(
      tasks.devServerWatch,
      tasks.devServerReload
    )
  ));

gulp.task('prod:server', gulp.series('clean:server', tasks.prodServerBuild));
gulp.task('prod:client', gulp.series('clean:client', tasks.prodClientBuild));

gulp.task('prod', gulp.series('clean', gulp.parallel(tasks.prodServerBuild, tasks.prodClientBuild)));