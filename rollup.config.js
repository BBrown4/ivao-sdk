import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/index.cjs.js',
                format: 'cjs',
            },
            {
                file: 'dist/index.esm.js',
                format: 'esm',
            },
        ],
        plugins: [typescript(), json(), nodeResolve(), commonjs()],
    },
];
