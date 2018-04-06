module.exports = {
  use: [
    ['@neutrinojs/react',
      {
        host: 'edelbucks.biz',
        html: {
          baseHref: '/',
          title: 'FlatWorld',
          links: [
            'https://fonts.googleapis.com/icon?family=Material+Icons'
            , "https://fonts.googleapis.com/css?family=Roboto"
          ]
        },
        devServer: {
          disableHostCheck: true
        }
      }
    ],
    ['@neutrinojs/jest', {verbose: false}]
  ]
};
