exports.register = function(jsonApi) {
    jsonApi.define('person-origin', {
        name: '',
        createdDateTime: '',
        changedDateTime: '',
        removedDateTime: '',
        company: {
            jsonApi: 'one',
            type: 'companies'
        }
    });
}
