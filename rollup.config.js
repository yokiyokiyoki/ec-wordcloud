import typescript from "rollup-plugin-typescript2";
//commonjs规范使用
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'


export default {
  input: "src/index.ts",
  output: [
    {
      name: "ECWordcloud",
      file: "dist/ec-wordcloud.js",
      format: "umd"
    }
  ],
  plugins: [typescript(),commonjs(),resolve()]
};
