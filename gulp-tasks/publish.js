const gulp      = require('gulp');
const git       = require('gulp-git');
const del       = require('del');

/*
 Commit site to gh-pages branch
*/
const localDir  = '../pokemon-icons-gh-pages';

// const email = process.env.GH_EMAIL;
const email = 'hans@gerwitz.com';
// const token = process.env.GH_TOKEN;
const token = 'b640e8d93d7008ecce7e0d1cdfbddf85ea5fd6a1';

var message = 'Publishing';
if (process.env.TRAVIS_BUILD_NUMBER) {
    message = `Publishing Travis build ${process.env.TRAVIS_BUILD_NUMBER}`;
}

// Clone the gh-pages branch (no need to checkout)
gulp.task('pub-clone', function(cb) {
    git.clone(
        'https://github.com/TheArtificial/pokemon-icons',
        {args: `-b gh-pages --single-branch ${localDir}`},
        function(err) {
            if (err) { console.log('Uh oh', err); }
        }
    );
    cb();
});

// Delete everything in the local repo
gulp.task('pub-clean', function(cb) {
    cb();
});

// Copy our build into the repo
gulp.task('pub-stage', function(cb) {
    // first delete existing contents
    del.sync([
        `${localDir}/**/*`,
        `${localDir}/**/.*`,
        `!${localDir}/.git` // except git metadata
    ], {force: true});
    // then copy and git add
    gulp.src('_site/**/*', {base: '_site'})
        .pipe(gulp.dest(localDir))
        .pipe(git.add({cwd: localDir}));
    cb();
});

// Add everything and commit
gulp.task('pub-commit', function(cb) {
    gulp.src('**/*', {cwd: localDir})
        .pipe(git.commit(message,  {cwd: localDir}));
    cb();
});

// Push to GitHub
gulp.task('pub-push', function(cb) {
    git.push('origin', 'gh-pages', {cwd: localDir});
    cb();
});

// Do all the things
gulp.task('publish', gulp.series(
    'pub-clone',
    'pub-stage',
    'pub-commit',
    'pub-push'
));
