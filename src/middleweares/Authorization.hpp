struct AuthorizationMiddleweare : crow::ILocalMiddleware
{
    struct context
    {
    };

    void before_handle(crow::request &req, crow::response &res, context & /*ctx*/)
    {
        JWT jwt;
        VerifyToken auth = jwt.verifyToken(utils::getToken(req.get_header_value("Authorization")));
        if (auth.status != 200)
        {
            if (auth.message == "Handle Token expired exception here")
            {
                res.code = 200;
            }
            else
            {
                res.code = 401;
            }
            json body = {{"status", auth.status}, {"message", auth.message}};
            res.body = body.dump();
            res.set_header("Content-Type", "application/json");
            res.end();
        }
        else
        {
            req.add_header("user_id", std::to_string(auth.id));
            req.add_header("roles", auth.roles);
        }
    }

    void after_handle(crow::request & /*req*/, crow::response & /*res*/, context & /*ctx*/)
    {
    }
};