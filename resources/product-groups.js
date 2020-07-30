exports.register = function(jsonApi) {
    jsonApi.define('product-groups', {
        name: '',
        createdDateTime: '',
        changedDateTime: '',
        removedDateTime: '',
        parentGroup: {
            jsonApi: 'one',
            type: 'product-groups'
        }
    });
}
