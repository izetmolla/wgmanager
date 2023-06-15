void define_routes()
{
    crow::App<AuthorizationMiddleweare> app;
    crow::mustache::set_global_base("./public_html");

    // // Home page
    CROW_ROUTE(app, "/").methods("GET"_method)(GeneralController::index);
    CROW_ROUTE(app, "/api/login").methods("POST"_method)(AuthorizationController::login);
    CROW_ROUTE(app, "/api/refresh_token").methods("POST"_method)(AuthorizationController::refreshToken);
    CROW_ROUTE(app, "/api/clients").methods("POST"_method).CROW_MIDDLEWARES(app, AuthorizationMiddleweare)(ClientController::clientsList);
    CROW_ROUTE(app, "/api/clients/getqrcode").methods("POST"_method).CROW_MIDDLEWARES(app, AuthorizationMiddleweare)(ClientController::getClientQrcode);
    CROW_ROUTE(app, "/api/clients/single").methods("POST"_method).CROW_MIDDLEWARES(app, AuthorizationMiddleweare)(ClientController::singleClient);
    CROW_ROUTE(app, "/api/clients/newclientdata").methods("POST"_method).CROW_MIDDLEWARES(app, AuthorizationMiddleweare)(ClientController::newClientData);
    CROW_ROUTE(app, "/api/clients/update").methods("POST"_method).CROW_MIDDLEWARES(app, AuthorizationMiddleweare)(ClientController::updateSingleClient);
    CROW_ROUTE(app, "/api/clients/create").methods("POST"_method).CROW_MIDDLEWARES(app, AuthorizationMiddleweare)(ClientController::newCLient);
    CROW_ROUTE(app, "/api/clients/delete").methods("POST"_method).CROW_MIDDLEWARES(app, AuthorizationMiddleweare)(ClientController::deleteClient);
    CROW_ROUTE(app, "/api/users").methods("POST"_method).CROW_MIDDLEWARES(app, AuthorizationMiddleweare)(UserController::usersList);
    CROW_ROUTE(app, "/api/users/adduser").methods("POST"_method).CROW_MIDDLEWARES(app, AuthorizationMiddleweare)(UserController::addUser);
    CROW_ROUTE(app, "/api/users/delete").methods("POST"_method).CROW_MIDDLEWARES(app, AuthorizationMiddleweare)(UserController::deleteUser);
    CROW_ROUTE(app, "/api/settings").methods("POST"_method).CROW_MIDDLEWARES(app, AuthorizationMiddleweare)(GeneralController::getSettings);
    CROW_ROUTE(app, "/api/settings/update").methods("POST"_method).CROW_MIDDLEWARES(app, AuthorizationMiddleweare)(GeneralController::updateSettings);
    CROW_ROUTE(app, "/api/settings/generatenewkeys").methods("POST"_method).CROW_MIDDLEWARES(app, AuthorizationMiddleweare)(GeneralController::generateNewKeys);


    CROW_ROUTE(app, "/api/get.php").methods("GET"_method).CROW_MIDDLEWARES(app, AuthorizationMiddleweare)(GeneralController::createDownloadToken);
    CROW_ROUTE(app, "/api/download.php").methods("GET"_method)(GeneralController::downloadWgClientConfig);


    app.port(configEnv.port).multithreaded().run();
}
