const project = require('./_project.js');
const gulp    = require('gulp');
const svgSprite	= require('gulp-svg-sprite');

/*
 Build a sprite sheet out of our SVGs
*/

config					= {
    mode				: {
        symbol			: {
            dest        : '', // don't nest
            sprite      : 'all-icon-symbols.svg'
        }
    },
    shape               : {
        dimension       : {
            precision   : 4 // not sure this is being honored
        }
    }
};

gulp.task('spritesheet', function() {
  return gulp.src('**/*.svg', {cwd: project.buildSrc + '/_icons'})
      .pipe(svgSprite(config))
      .on('error', function(error) {
        console.log('oh no!');
      })
      .pipe(gulp.dest('assets'));
});
