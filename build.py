#!/usr/bin/env python
"""Build system for GS libirary
"""

import os
import sys

from pake import main
from pake import target
from pake import variables
from pake import virtual
from pake import ifind
from pake import which
from pake import targets

if sys.platform == 'win32':
    variables.NPM = 'npm.cmd'
    variables.GRUNT = 'grunt.cmd'
    variables.JSDOC = 'jsdoc.cmd'
    variables.PYTHON = 'python.exe'
    variables.JAVA = 'java.exe'
    variables.BOWER = 'bower.cmd'
    variables.GIT = 'git.exe'
    variables.GJSLINT = 'gjslint.exe'
    variables.BUILDER = 'bower_components/closure-library/closure/bin/build/closurebuilder.py'
    variables.DEPSWRITER = 'bower_components/closure-library/closure/bin/build/depswriter.py'
    variables.CLOSURE_JAR = 'resources/compiler.jar'
    variables.CASPERJS = 'casperjs.exe'
else:
    variables.GRUNT = 'grunt'
    variables.NPM = 'npm'
    variables.JSDOC = 'jsdoc'
    variables.BOWER = 'bower'
    variables.PYTHON = 'python'
    variables.JAVA = 'java'
    variables.GIT = 'git'
    variables.GJSLINT = 'gjslint'
    variables.BUILDER = \
        'bower_components/closure-library/closure/bin/build/closurebuilder.py'
    variables.DEPSWRITER = \
        'bower_components/closure-library/closure/bin/build/depswriter.py'
    variables.CLOSURE_JAR = 'resources/compiler.jar'
    variables.CASPERJS = 'casperjs'

EXECUTABLES = [variables.JSDOC, variables.PYTHON, variables.JAVA,
               variables.GIT, variables.GJSLINT, variables.CASPERJS]

# NOTE: omit workers directory
SRC = [path for path in ifind('src/gs') if path.endswith('.js') and
       not path.startswith('src/gs/worker')]

TEST_SRC = [path for path in ifind('test/specs') if path.endswith('.js')]
WORKERS_SRC = [path for path in ifind('src/gs/worker') if path.endswith('.js')]
WORKERS_BUILD = [path for path in ifind('build/workers')
                 if path.endswith('.js')]
EXAMPLES_SRC = [path for path in ifind('examples/stable/') if path.endswith('.html')]
EXAMPLES_SRC_JS = [path for path in ifind('examples/stable/') if path.endswith('.js')]
EXAMPLES_SANDBOX_SRC = [path for path in ifind('examples/sandbox/') if path.endswith('.html')]
EXAMPLES_SANDBOX_SRC_JS = [path for path in ifind('examples/sandbox/') if path.endswith('.js')]
JSDOC_SRC = [path for path in ifind('src/') if path.endswith('.jsdoc')]
EXPORTS = [path for path in ifind('src')
           if path.endswith('.exports')]


COMPILED = 'build/lib/gs.js'
COMPILED_ADVANCED = 'build/lib/gs-advanced.js'
COMPILED_SIMPLE = 'build/lib/gs-simple.js'
BUILDS = [COMPILED, COMPILED_SIMPLE, COMPILED_ADVANCED]
APIDOC = 'build/doc/apidoc'
DOC = 'build/doc/'

PLOVR_CFG = 'cfg/full.json'
PLOVR_JAR = 'bower_components/openlayers3/build/plovr-81ed862.jar'
PLOVR_JAR_MD5 = '1c752daaf11ad6220b298e7d2ee2b87d'



def writedeps(t):
    t.run('%(PYTHON)s', '%(DEPSWRITER)s',
        "--root_with_prefix=src/gs src/gs",
        '--output_file=build/gs-deps.js')

@target(os.path.join(APIDOC,'index.html'),SRC,'build/src/exports.js', 'build/src/typedefs.js')
def build_apidoc(t):
    t.run('%(JSDOC)s', '-c', 'doc/conf.json', 'src', 'bower_components/openlayers3/src/', 'doc/index.md',
          '-d', APIDOC);
    #t.touch()

@target('test_apidoc',SRC,TEST_SRC)
def test_apidoc(t):
    "!! Currently not used !!"
    t.run('%(JSDOC)s', '-c', 'doc/conf.json', 'src', 'doc/index.md',
          '-T');

@target('build/test_lib', SRC, TEST_SRC, COMPILED)
def test_lib(t):
    """ Running casperjs tests
    """

    includes = "build/lib/gs.js,bower_components/closure-library/closure/goog/base.js,"
    includes += ",".join(WORKERS_BUILD)

    t.run('%(CASPERJS)s',
          'test',
          '--includes=' + includes,
          TEST_SRC)

@target(COMPILED, SRC, 'build/src/typedefs.js', 'build/src/exports.js', PLOVR_JAR)
def compile_lib(trgt):
    trgt.makedirs('build/cfg')
    trgt.cp('cfg/base.json', os.path.join('build','cfg','base.json'))
    trgt.cp('cfg/full.json', os.path.join('build','cfg'))
    trgt.output('%(JAVA)s',
            '-client', '-XX:+TieredCompilation',
            '-jar', PLOVR_JAR, 'build',
            os.path.join('build', 'cfg/full.json'))


@target(COMPILED_SIMPLE, SRC, 'build/src/typedefs.js', 'build/src/exports.js', PLOVR_JAR)
def compile_lib_simple(trgt):
    trgt.makedirs('build/cfg')
    trgt.cp('cfg/base.json',os.path.join('build','cfg','base.json'))
    trgt.cp('cfg/full-simple.json', os.path.join('build','cfg'))
    trgt.output('%(JAVA)s',
            '-client', '-XX:+TieredCompilation',
            '-jar', PLOVR_JAR, 'build',
            os.path.join('build', 'cfg/full-simple.json'))

@target(COMPILED_ADVANCED, SRC, 'build/src/typedefs.js', 'build/src/exports.js', PLOVR_JAR)
def compile_lib_simple(trgt):
    trgt.makedirs('build/cfg')
    trgt.cp('cfg/base.json',os.path.join('build','cfg','base.json'))
    trgt.cp('cfg/full-advanced.json', os.path.join('build','cfg'))
    trgt.output('%(JAVA)s',
            '-client', '-XX:+TieredCompilation',
            '-jar', PLOVR_JAR, 'build',
            os.path.join('build', 'cfg/full-advanced.json'))


@target('build/workers/time_stamp', 'cfg/workers.json', WORKERS_SRC)
def compile_workers(trgt):
    """Compile workers"""
    trgt.makedirs('build/workers')

    for worker_src in WORKERS_SRC:
        worker_name = worker_src.replace('src/gs/worker/', '')
        worker_cfg = os.path.join('build/cfgworkers/', worker_name)
        worker_build = os.path.join('build/workers/', worker_name)


        @target(worker_build, 'cfg/workers.json', worker_src)
        def compile_worker(mytrgt):
            """Compile worker"""
            mytrgt.output('%(JAVA)s',
                '-client', '-XX:+TieredCompilation',
                '-jar', PLOVR_JAR, 'build',
                worker_cfg)
        tar = targets.get(worker_build)
        tar.build()

    WORKERS_BUILD = [path for path in ifind('build/workers') if path.endswith('.js')]
    trgt.touch()


@target(PLOVR_JAR)
def download_plovr(t):
    t.info('downloading %r', t.name)
    t.download('https://plovr.googlecode.com/files/' +
               os.path.basename(PLOVR_JAR), md5=PLOVR_JAR_MD5)
    t.info('downloaded %r', t.name)


@target('serve',PLOVR_JAR)
def run_plovr_server(t):
    t.output('%(JAVA)s', '-jar', PLOVR_JAR, 'serve', os.path.join('build',PLOVR_CFG))


@target('cleanBuild')
def clean_build(t):
    t.rm_rf('build/')

@target('clean_bower')
def clean_bower(t):
    t.rm_rf('bower_components')

@target('clean_ol3')
def clean_ol3(t):
    if os.path.isdir('bower_components/openlayers3'):
        os.chdir('bower_components/openlayers3/')
        t.run('%(PYTHON)s', 'build.py', 'clean')
        os.chdir('../../')

@target('build/doc')
def mk_docdir(trgt):
    """Make doc directory
    """
    trgt.makedirs('build/doc')

@target('build/fix-stamp', SRC, TEST_SRC, EXAMPLES_SRC_JS)
def build_fix_src_timestamp(t):
    t.run('fixjsstyle',
        '--jslint_error=all',
        '--strict',
        t.newer(t.dependencies))

@target('build/lint-stamp', SRC, TEST_SRC, EXAMPLES_SRC_JS)
def build_lint_src_timestamp(t):
    t.run('%(GJSLINT)s',
        '--jslint_error=all',
        '--strict',
        t.newer(t.dependencies))
    #t.touch()


@target('retag')
def retag(t):
    if sys.platform == 'win32':
        t.run('bin\deletetag.cmd')
    else:
        t.run('sh', 'bin/deletetag.sh')
    t.run('%(GIT)s', 'fetch', '-p')

@target('updateBower', 'cleanBuild', 'clean_ol3')
def bower(t):
    t.run('%(BOWER)s', 'install')
    t.run('%(BOWER)s', 'update')

    os.chdir('bower_components/openlayers3/')
    t.run('%(PYTHON)s', 'build.py', 'build')
    os.chdir('../../')

    #os.chdir('bower_components/bootstrap/')
    #t.run('%(NPM)s', 'install')
    #t.run('%(GRUNT)s', 'dist')
    #os.chdir('../../')

@target('build/src/typedefs.js', JSDOC_SRC, SRC)
def create_typedefs_file(t):
    t.output('%(PYTHON)s','bin/generate-exports.py','--typedef', JSDOC_SRC)

@target('build/src/exports.js', EXPORTS, SRC)
def create_typedefs_file(t):
    t.output('%(PYTHON)s', 'bin/generate-exports.py', '--exports', EXPORTS)


@target('build/cfgexamples/time_stamp',
        EXAMPLES_SRC, 'cfg/examples.json', 'cfg/base.json')
def make_examples_cfg(trgt):
    """generate examples configuration files
    """
    trgt.makedirs( os.path.join('build', 'cfgexamples'))
    trgt.cp('cfg/base.json', os.path.join('build', 'cfgexamples', 'base.json'))

    template = open(os.path.join('cfg', 'examples.json')).read()
    for htmlf in EXAMPLES_SRC:
        (html_path, htmlf_name) = os.path.split(htmlf)
        idf = htmlf_name.replace('.html', '')
        cfg = os.path.join('build', 'cfgexamples', idf + '.js')
        cfg_out = open(cfg, 'w')
        cfg_out.write(template % {'ID': idf})

    trgt.touch()

@target('build/cfgtests/time_stamp',
        TEST_SRC, 'cfg/base.json')
def make_tests_cfg(trgt):
    """generate examples configuration files
    """
    # TODO Add plovr build and casperjs run
    trgt.makedirs(os.path.join('build', 'cfgtests'))
    trgt.cp('cfg/base.json',
             os.path.join('build', 'cfgtests', 'base.json'))

    template = open(os.path.join('cfg', 'tests-advanced.json')).read()
    for jsf in TEST_SRC:
        (path, jsf_name) = os.path.split(jsf)
        idf = jsf_name.replace('.js', '')
        cfg = os.path.join('build', 'cfgtests', idf + '.json')
        cfg_out = open(cfg, 'w')
        # FIXME need to add also paths in subdirectories (e.g. source/unip.js)
        cfg_out.write(template % {'ID': idf.replace(".","_"), 'file': jsf_name})

    trgt.touch()


@target('build/cfgworkers/time_stamp', WORKERS_SRC,
        'cfg/examples.json', 'cfg/base.json')
def make_workers_cfg(trgt):
    """generate workers configuration files
    """
    trgt.makedirs(os.path.join('build', 'cfgworkers'))
    trgt.cp('cfg/base.json',os.path.join('build','cfgworkers','base.json'))

    template = open(os.path.join('cfg','workers.json')).read()
    for worker in WORKERS_SRC:
        (path, name) = os.path.split(worker)
        idf = name.replace('.js', '')
        cfg = os.path.join('build', 'cfgworkers', idf + '.js')
        cfg_out = open(cfg,'w')
        cfg_out.write(template % {'ID':idf})

    trgt.touch()

@target('runExampleServer',PLOVR_JAR,'build/cfgworkers/time_stamp',
        'build/cfgexamples/time_stamp')
def run_plovr_example_server(t):
    EXAMPLES_CONFIG = [path for path in ifind('build/cfgexamples/') if path.endswith('.js')]
    WORKERS_CONFIG = [path for path in ifind('build/cfgworkers/') if path.endswith('.js')]
    t.output('%(JAVA)s', '-jar', PLOVR_JAR, 'serve', EXAMPLES_CONFIG, WORKERS_CONFIG)

@target('checkdeps')
def check_dependencies(t):
    for exe in EXECUTABLES:
        status = 'present' if which(exe) else 'MISSING'
        print 'Program "%s" seems to be %s.' % (exe, status)
    print 'For certain targets all above programs need to be present.'





@target('build/examples/loader.js',
        'build/src/typedefs.js',
        'build/src/exports.js',
        'build/cfgexamples/time_stamp',
        EXAMPLES_SRC,
        EXAMPLES_SRC_JS)
def compile_example_javascripts(t):
    """compile examples into single files
    """
    t.rm_rf('build/examples')
    t.makedirs('build/examples')
    t.cp_r('examples/stable/css', 'build/examples/css')
    t.cp_r('examples/stable/img', 'build/examples/img')
    t.cp_r('examples/stable/data', 'build/examples/data')
    t.cp_r('examples/stable/lang', 'build/examples/lang')
    t.cp('examples/stable/loader-static.js', 'build/examples/loader.js')
    EXAMPLES_CONFIG = [path for path in ifind('build/cfgexamples/') if path.endswith('.js')]
    for f in EXAMPLES_CONFIG:
        (f_path, f_name) = os.path.split(f)
        htmlf = f_name.replace('.js', '.html');
        t.cp('examples/stable/' + htmlf, 'build/examples/' + htmlf)
        example_build = 'build/examples/' + f.replace('build/cfgexamples/', '')

        @target(example_build, f)
        def compile_example(mytrgt):
            """Compile example"""
            mytrgt.output('%(JAVA)s',
                    '-client', '-XX:+TieredCompilation',
                    '-jar', PLOVR_JAR, 'build', f)

        tar = targets.get(example_build)
        tar.build()

    t.touch()

@target('sandbox',
        'build/examples/loader.js',
        EXAMPLES_SANDBOX_SRC,
        EXAMPLES_SANDBOX_SRC_JS)
def compile_example_javascripts(t):
    """compile sandboxs examples into single files
    """
    EXAMPLES_CONFIG = [path for path in ifind('build/cfgsandbox/') if path.endswith('.js')]
    for f in EXAMPLES_CONFIG:
        (f_path, f_name) = os.path.split(f)
        htmlf = f_name.replace('.js', '.html');
        t.cp('examples/sandbox/' + htmlf, 'build/examples/' + htmlf)
        example_build = 'build/examples/' + f.replace('build/cfgexamples/', '')

        @target(example_build, f)
        def compile_example(mytrgt):
            """Compile example"""
            mytrgt.output('%(JAVA)s',
                    '-client', '-XX:+TieredCompilation',
                    '-jar', PLOVR_JAR, 'build', f)

        tar = targets.get(example_build)
        tar.build()


virtual('tests', 'test')
virtual('check', 'test')
virtual('test', 'build/test_lib')
virtual('testfull', 'relib', 'workers', 'test')
virtual('test_doc', 'test_apidoc')
virtual('doc', 'userdoc', 'apidoc')
virtual('apidoc', os.path.join(APIDOC, 'index.html'))
virtual('userdoc', DOC)
virtual('lint', 'build/lint-stamp')
virtual('fix', 'build/fix-stamp')
virtual('workers', 'build/cfgworkers/time_stamp', 'build/workers/time_stamp')
virtual('lib', 'fix', 'lint', COMPILED, COMPILED_ADVANCED, COMPILED_SIMPLE, 'workers')
virtual('librigid', 'lint', COMPILED, COMPILED_ADVANCED, COMPILED_SIMPLE, 'workers')
virtual('build', 'ol3', 'lib', 'doc', 'buildexamples')
virtual('ol3', 'updateBower')
virtual('buildexamples', 'build/src/typedefs.js', 'build/cfg/exports.js',
        'build/cfgworkers/time_stamp', 'build/cfgexamples/time_stamp',
        'build/workers/time_stamp', 'build/examples/loader.js')
virtual('compileexamples', 'buildexamples', 'build/examples/loader.js')
virtual('examples', 'buildexamples', 'runExampleServer')
virtual('clean', 'cleanBuild', 'clean_bower')
virtual('relib', 'cleanBuild', 'lib', 'buildexamples')
virtual('jenkinsbuild', 'clean', 'ol3', 'librigid', 'buildexamples')
virtual('all', 'clean', 'build', 'test_doc', 'test')


@target('help')
def print_help(trgt):
    """Print help short help message and exit
    """

    print """
    Pmake build system for GeoSense mapping library

    help    - this help message
    all     - For everything: lib, doc, test,
    clean   - Delete build/ content
    serve   - Run plovr server
    ol3     - Build OpenLayers 3

    doc     - API documentation and User documentation
        apidoc  - API documentation
        userdoc - User documentation

    test    - Run test suite
        build/test_lib - Test library
        build/test_doc - Test doc strings

    lib   - Build the library
        build/deps              - Build deps file

    relib - Delete build and Build the library and examples

    examples    - Build config files for examples and run the server
    compileexampels - Build javascripts with examples

    checkdeps   - Checks whether all required development software is
                     installed on your machine.

    updateBower - Pulling repository OL3, Closure, ..., rebuild

    Needed executables:
        jsdoc, casperjs, jar, java, python, git

    """
main()
