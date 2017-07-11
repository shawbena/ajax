require.config({
    baseUrl: '/dist'
});

require(['app'], function(app){
    app.bootstrap();
});