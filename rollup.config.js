import copy from 'rollup-plugin-copy'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/vp.js',
    format: 'umd',
    name: 'vp'
  },
  plugins: [
    copy({
      targets: [
        {
          src: 'src/video-player.css',
          dest: 'dist'
        }
      ]
    })
  ]
}