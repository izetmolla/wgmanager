class AuthorizationController
{
public:
    static crow::response login(const crow::request &req)
    {
        json body = utils::getBody(req.body);
        if (body == nullptr)
            return utils::jsonErrorResponse("Username or password is empty");
        ValidationResponse error = utils::bodyValidation(body, {{"username", {{"type", "string"}, {"min", "2"}, {"max", "20"}}}, {"password", {{"type", "string"}, {"min", "2"}}}});
        if (error.status)
            return utils::jsonErrorResponse(error.message, error.path);
        AuthorizationController authorization;
        return authorization.loginUser(body["username"].get<std::string>(), body["password"].get<std::string>());
    }

    crow::response loginUser(std::string username, std::string password)
    {
        User user = User::getUserByUsername<User>(username);
        if (user.id == 0)
            return utils::jsonErrorResponse("User not found", "username");
        if (utils::validateMd5Hash(password.c_str(), user.password.c_str()) == false)
            return utils::jsonErrorResponse("Password is wrong", "password");
        return utils::jsonSuccessResponse(authenticate(user));
    }

    static crow::response refreshToken(const crow::request &req)
    {
        std::string token = utils::getToken(req.get_header_value("Authorization"));
        if (token.size() == 0)
        {
            return crow::response(401);
        }
        JWT jwt;
        VerifyToken auth = jwt.verifyToken(token, "refresh");
        if (auth.status != 200)
        {
            return crow::response(401);
        }
        RefreshToken refreshTokenModel;
        RefreshToken rt = refreshTokenModel.getItemByToken<RefreshToken>(token);

        if (rt.id == 0)
        {
            return crow::response(401);
        }
        std::string roles = database.select_record<Role>("roles", {{"user_id", "=", "1"}}, {"json_group_array(role) as role"}).role;
        std::string result = jwt.createAccessToken(rt.user_id, "", json::parse(roles));
        return utils::toJSON(result);
    }

    // authenticate user
    json authenticate(User user)
    {
        Tokens tokens = JWT::getTokens(user.id, user.username, "", json::array({"admin"}));
        json userJson = json::object({{"id", user.id}, {"username", user.username}, {"email", user.email}, {"fullname", user.fullname}});
        database.insert_record("refresh_tokens", {{"token", tokens.refresh_token}, {"user_id", std::to_string(user.id)}});
        return {{"user", userJson}, {"tokens", {{"access_token", tokens.access_token}, {"refresh_token", tokens.refresh_token}}}};
    }
};
