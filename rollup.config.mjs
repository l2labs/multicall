import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'

const config = [
  {
    external: ['ethers'],
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.esm.js',
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({
        compilerOptions: {
          module: 'ES2020',
        },
      }),
    ],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
]

export default config
