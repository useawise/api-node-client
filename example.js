const convessApi = require('./convess.js');

const login = 'myuser@email'
    password = 'mypassword'
    company = 'lbK4xr' //update with company id from the companies query
    branch = 'lbK4xr' //update with branch id from the companies query
    domain = 'https://api.convess.com';

async function main() {
    const convess = await convessApi({login,password,domain,company,branch});
    let companies = await convess.findAll('company');
    console.log("companies");
    console.log(JSON.stringify(companies,null,2));
    let products = await convess.findAll('product');
    console.log("products");
    console.log(JSON.stringify(products,null,2));

    let persons = await convess.findAll('persons');
    console.log("persons");
    console.log(JSON.stringify(persons,null,2));

    /*
    await jsonApi.update('product', {
          id: 1,
          name: 'Meu produto alterado pela api',
    });
    */
}

main();
