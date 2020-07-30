exports.register = function(jsonApi) {
    jsonApi.define('company', {
        id: '',
        name: '',
        urlName: '',
        branches: {
            jsonApi: 'hasMany',
            type: 'branch'
        }
    });
}
