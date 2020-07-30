exports.register = function(jsonApi) {
    jsonApi.define('person-address', {
        addressType: '',
        street: '',
        number: '',
        complement: '',
        district: '',
        cep: '',
        cityName: '',
        state: '',
        municipio: '',
        uf: {
            jsonApi: 'one',
            type: 'ufs'
        }
    });
}

