exports.register = function(jsonApi) {
    jsonApi.define('product', {
        name: '',
        code: '',
        group: {
            jsonApi: 'one',
            type: 'product-groups'
        },
        unit: '',
        minimumStock: '',
        price: '',
        service: '',
        barCode: '',
        ncm: '',
        cest: '',
        netWeight: '',
        grossWeight: '',
        purpose: '',
        observation: '',
        createdDateTime: '',
        changedDateTime: '',
        removedDateTime: '',
    });
}
