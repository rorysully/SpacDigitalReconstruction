const http = require('http'),
      fs   = require('fs'),
      port = 3000

const SOURCE = './source/';

const server = http.createServer( function( request,response ) {
  switch( request.url ) {
    case '/':
      sendFile( response, SOURCE + 'js/main.jsx' )
      break
    case '/index.html':
      sendFile( response, SOURCE + 'js/main.jsx' )
      break
    default:
      response.end( '404 Error: File Not Found' )
  }
})

server.listen( process.env.PORT || port )

const sendFile = function( response, filename ) {
   fs.readFile( filename, function( err, content ) {
     file = content
     response.end( content, 'utf-8' )
   })
}
