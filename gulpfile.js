// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
// Importing all the Gulp-related packages we want to use

const browserSync = require('browser-sync');
const server = browserSync.create();
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const terser = require('gulp-terser');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const replace = require('gulp-replace');
const imagemin = require('gulp-imagemin');
 

// File paths
const files = { 
    scssPath: 'app/scss/**/*.scss',
    jsPath: 'app/js/**/*.js',
    imagePath: 'app/images/**/*',
    fontPath: 'app/fonts/**/*',
    htmlPath: '*.html'
}

const clean = () => del(['dist']);


function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: './'
    }
  });
  done();
}

// Sass task: compiles the style.scss file into style.css
function scssTask(){    
    return src(files.scssPath)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass()) // compile SCSS to CSS
        .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(dest('dist/css')
    ); // put final CSS in dist folder
}

// JS task: concatenates and uglifies JS files to script.js
function jsTask(){
    return src([
        files.jsPath
        //,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
        ])
  //      .pipe(concat('all.js'))
  //      .pipe(terser())
        .pipe(dest('dist/js')
    );
}

function imageTask() {
    return src(files.imagePath)
    .pipe(imagemin())
    .pipe(dest('dist/images'))
}


function fontTask() {
    return src(files.fontPath)
            .pipe(dest('dist/fonts'));
}

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask(){
    watch([files.scssPath, files.jsPath, files.imagePath, files.fontPath, files.htmlPath], 
        series(
            series(clean, scssTask, jsTask, imageTask, fontTask, reload)            
        )
    );    
}


// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task
exports.default = series(
    clean,
    parallel(scssTask, jsTask, imageTask, fontTask), 
    serve,
    watchTask
);

