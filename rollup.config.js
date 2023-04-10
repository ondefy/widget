import typescript from 'rollup-plugin-typescript2'
import del from 'rollup-plugin-delete'
// import url from '@rollup/plugin-url'
// import image from '@rollup/plugin-image'
// import postcss from 'rollup-plugin-postcss'
// import bundleSize from 'rollup-plugin-bundle-size'
// import svgr from '@svgr/rollup'
// import copy from 'rollup-plugin-copy'
// const pkg = require('./package.json');
import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'index.js',
    output: [
      // {
      //   file: pkg.main,
      //   format: 'cjs',
      //   sourcemap: true
      // },
      // {
      //   file: pkg.module,
      //   format: 'es',
      //   sourcemap: true
      // },
      {
        file: 'dist/ondefy-widget.js',
        format: 'iife',
        sourcemap: true
      }
    ],
    plugins: [
      terser(),
      // url({
      //   // by default, rollup-plugin-url will not handle font files
      //   include: [
      //     '**/*.woff',
      //     '**/*.woff2',
      //     '**/*.eot',
      //     '**/*.ttf',
      //     '**/*.svg'
      //   ]
      // }),
      // postcss({
      //   extensions: ['.css']
      // }),
      //
      // // https://react-svgr.com/docs/rollup/#using-with-rollupplugin-url
      // svgr({
      //   icon: true,
      //   svgoConfig: {
      //     // to skip adding prefixIds
      //     plugins: []
      //   }
      // }),
      // image(),
      typescript(),
      // bundleSize(),
      del({ targets: ['dist/*'] }),
      // copy({
      //   targets: [
      //     {
      //       src: 'public/assets', dest: 'dist'
      //     }
      //   ]
      // })
    ],
    // external: Object.keys(pkg.peerDependencies || {}),
    // treeshake: {
    //   moduleSideEffects: ['no-treeshake']
    // }
  }
]
