const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

async function getConfig(configName) {
  const { getCommConfig } = await import(
    '../../keyserver/dist/lib/utils/comm-config.js'
  );
  return await getCommConfig(configName);
}

const sharedPlugins = [
  new webpack.optimize.LimitChunkCountPlugin({
    maxChunks: 1,
  }),
];

const cssLoader = {
  loader: 'css-loader',
  options: {
    modules: {
      mode: 'local',
      localIdentName: '[path][name]__[local]--[contenthash:base64:5]',
    },
  },
};
const cssExtractLoader = {
  loader: MiniCssExtractPlugin.loader,
};
const styleLoader = {
  loader: 'style-loader',
};

function getBabelRule(babelConfig) {
  return {
    test: /\.js$/,
    exclude: /node_modules\/(?!lib)/,
    loader: 'babel-loader',
    options: babelConfig,
  };
}
function getBrowserBabelRule(babelConfig) {
  const babelRule = getBabelRule(babelConfig);
  return {
    ...babelRule,
    options: {
      ...babelRule.options,
      presets: [
        ...babelRule.options.presets,
        [
          '@babel/preset-env',
          {
            targets: 'defaults',
            useBuiltIns: 'usage',
            corejs: '3.6',
          },
        ],
      ],
    },
  };
}

const imageRule = {
  test: /\.(png|svg)$/,
  type: 'asset/inline',
};

const typographyRule = {
  test: /\.(woff2|woff)$/,
  type: 'asset/inline',
};

function createBaseBrowserConfig(baseConfig) {
  return {
    ...baseConfig,
    name: 'browser',
    optimization: {
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    },
    plugins: [
      ...(baseConfig.plugins ?? []),
      ...sharedPlugins,
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [],
      }),
    ],
    node: {
      global: true,
    },
  };
}

async function getConfigs() {
  const [alchemySecret, walletConnectSecret, neynarSecret] = await Promise.all([
    getConfig({ folder: 'secrets', name: 'alchemy' }),
    getConfig({ folder: 'secrets', name: 'walletconnect' }),
    getConfig({ folder: 'secrets', name: 'neynar' }),
  ]);
  const alchemyKey = alchemySecret?.key;
  const walletConnectKey = walletConnectSecret?.key;
  const neynarKey = neynarSecret?.key;
  return { alchemyKey, walletConnectKey, neynarKey };
}

async function createProdBrowserConfig(baseConfig, babelConfig, envVars) {
  const browserConfig = createBaseBrowserConfig(baseConfig);
  const babelRule = getBrowserBabelRule(babelConfig);
  const { alchemyKey, walletConnectKey, neynarKey } = await getConfigs();
  return {
    ...browserConfig,
    mode: 'production',
    plugins: [
      ...browserConfig.plugins,
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
          BROWSER: true,
          COMM_ALCHEMY_KEY: JSON.stringify(alchemyKey),
          COMM_WALLETCONNECT_KEY: JSON.stringify(walletConnectKey),
          COMM_NEYNAR_KEY: JSON.stringify(neynarKey),
          ...envVars,
        },
      }),
      new MiniCssExtractPlugin({
        filename: 'prod.[contenthash:12].build.css',
      }),
    ],
    module: {
      rules: [
        {
          ...babelRule,
          options: {
            ...babelRule.options,
            plugins: [
              ...babelRule.options.plugins,
              '@babel/plugin-transform-react-constant-elements',
              ['transform-remove-console', { exclude: ['error', 'warn'] }],
            ],
          },
        },
        {
          test: /\.css$/,
          exclude: /node_modules\/.*\.css$/,
          use: [
            cssExtractLoader,
            {
              ...cssLoader,
              options: {
                ...cssLoader.options,
                url: false,
              },
            },
          ],
        },
        {
          test: /node_modules\/.*\.css$/,
          sideEffects: true,
          use: [
            cssExtractLoader,
            {
              ...cssLoader,
              options: {
                ...cssLoader.options,
                url: false,
                modules: false,
              },
            },
          ],
        },
      ],
    },
  };
}

async function createDevBrowserConfig(baseConfig, babelConfig, envVars) {
  const browserConfig = createBaseBrowserConfig(baseConfig);
  const babelRule = getBrowserBabelRule(babelConfig);
  const { alchemyKey, walletConnectKey, neynarKey } = await getConfigs();
  return {
    ...browserConfig,
    mode: 'development',
    plugins: [
      ...browserConfig.plugins,
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development'),
          BROWSER: true,
          COMM_ALCHEMY_KEY: JSON.stringify(alchemyKey),
          COMM_WALLETCONNECT_KEY: JSON.stringify(walletConnectKey),
          COMM_NEYNAR_KEY: JSON.stringify(neynarKey),
          ...envVars,
        },
      }),
      new ReactRefreshWebpackPlugin(),
    ],
    module: {
      rules: [
        {
          ...babelRule,
          options: {
            ...babelRule.options,
            plugins: [
              require.resolve('react-refresh/babel'),
              ...babelRule.options.plugins,
            ],
          },
        },
        imageRule,
        typographyRule,
        {
          test: /\.css$/,
          exclude: /node_modules\/.*\.css$/,
          use: [styleLoader, cssLoader],
        },
        {
          test: /node_modules\/.*\.css$/,
          sideEffects: true,
          use: [
            styleLoader,
            {
              ...cssLoader,
              options: {
                ...cssLoader.options,
                modules: false,
              },
            },
          ],
        },
      ],
    },
    devtool: 'eval-cheap-module-source-map',
  };
}

async function createNodeServerRenderingConfig(baseConfig, babelConfig) {
  const { alchemyKey, walletConnectKey, neynarKey } = await getConfigs();
  return {
    ...baseConfig,
    name: 'server',
    target: 'node',
    module: {
      rules: [
        getBabelRule(babelConfig),
        {
          test: /\.css$/,
          use: {
            ...cssLoader,
            options: {
              ...cssLoader.options,
              modules: {
                ...cssLoader.options.modules,
                exportOnlyLocals: true,
              },
            },
          },
        },
      ],
    },
    plugins: [
      ...sharedPlugins,
      new webpack.DefinePlugin({
        'process.env': {
          COMM_ALCHEMY_KEY: JSON.stringify(alchemyKey),
          COMM_WALLETCONNECT_KEY: JSON.stringify(walletConnectKey),
          COMM_NEYNAR_KEY: JSON.stringify(neynarKey),
        },
      }),
    ],
  };
}

function createWebWorkersConfig(env, baseConfig, babelConfig) {
  return {
    ...baseConfig,
    name: 'webworkers',
    target: 'webworker',
    mode: env.prod ? 'production' : 'development',
    module: {
      rules: [getBrowserBabelRule(babelConfig)],
    },
    plugins: [
      ...sharedPlugins,
      ...baseConfig.plugins,
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(env.prod ? 'production' : 'development'),
          BROWSER: true,
        },
      }),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  };
}

module.exports = {
  createProdBrowserConfig,
  createDevBrowserConfig,
  createNodeServerRenderingConfig,
  createWebWorkersConfig,
};
