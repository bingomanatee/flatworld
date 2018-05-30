module.exports = {
  use: [
    ['@neutrinojs/react',
      {
        host: 'edelbucks.biz',
        html: {
          baseHref: '/',
          title: 'FlatWorld',
          scripts: [
            'https://code.createjs.com/1.0.0/createjs.min.js'
          ],
          links: [
            'https://fonts.googleapis.com/icon?family=Material+Icons'
            , "https://fonts.googleapis.com/css?family=Roboto"
            , '/static/webfonts/Kapra/Kapra.css'
            , '/static/css/react-md.teal-amber.min.css'
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
