var request = require('request');
var queryApiClause = require('config.json')('./config/autoQueryApi.json');
var fs = require('fs');

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

//var requestUri = '{0}/{1}/{2}'.format(queryApiClause.requestUrl,queryApiClause.EsSearchCode, queryApiClause.PageNo);

function AutomationAPITest() {

        let apiMethod = queryApiClause.ApiMethods;
        let jsonObj = {};
        let requestUri = {};
        apiMethod.forEach(function(element,index){
           
           switch(element.APIMethod){
               case "ESByKeyword":
               requestUri = '{0}/{1}/{2}'.format(element.RequestUrl, element.EsSearchCode, element.PageNo);
               jsonObj = { "QueryKeyword": element.QueryKeyword, "FilterKeyword": element.FilterKeyword,"SortKeyword":element.SortKeyword };
               break;
               case "ElasticSearchByKeyword":
               requestUri = '{0}/{1}/{2}'.format(element.RequestUrl, element.EsSearchCode, element.PageNo);
               jsonObj = { "Email": element.Email,"APIAccess": element.APIAccess,"QueryKeyword": element.QueryKeyword, "FilterKeyword": element.FilterKeyword,"SortKeyword":element.SortKeyword };
               break;
               default:
               jsonObj = {};
               requestUri = {};
           }
           
           request({
               uri: requestUri,
               method: 'POST',
               json: true,
               body: jsonObj
           }, function(error, response, body) {
               var str_json = JSON.stringify(body);    
               var fileName = '{0}result.json'.format(element.APIMethod);
               fs.exists(fileName, function(exists){
                   if(exists){
                        fs.unlink(fileName, function(){
                            //console.log('delete success') ;
                            }) ;
                    }

                    fs.writeFile(fileName, str_json, 'utf8', function(){
    
                        let apiGenerateDesc = 'API Method {0} Generate {1} file in current directory'.format(element.APIMethod,fileName);
                        console.log(apiGenerateDesc);
                    });
               });
           });
        });
}

AutomationAPITest();