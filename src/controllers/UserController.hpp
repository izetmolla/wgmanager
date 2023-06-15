class UserController
{
public:
    static crow::response usersList(const crow::request &req)
    {
        if (!utils::isAdmin(utils::jsonArrayToVector(req.get_header_value("roles"))))
            return utils::jsonErrorResponse("You are not Allowed to see this list!");
        json body = utils::getBody(req.body);
        UserController uc;

        return utils::jsonSuccessResponse(uc.getUsersList(utils::getPagination(body)));
    }
    static crow::response deleteUser(const crow::request &req)
    {
        json body = utils::getBody(req.body);
        if (body == nullptr)
            return utils::jsonErrorResponse("Username or password is empty");
        ValidationResponse error = utils::bodyValidation(body, {{"id", {{"type", "string"}, {"min", "1"}, {"max", "15"}}}});
        if (error.status)
            return utils::jsonErrorResponse(error.message, error.path);
        if (!utils::isAdmin(utils::jsonArrayToVector(req.get_header_value("roles"))))
            return utils::jsonErrorResponse("You are not Allowed to do this action");

        User userModel;
        User user = userModel.find<User>(std::stoi(body["id"].get<std::string>()));
        if (user.id == 0)
        {
            return utils::jsonErrorResponse("User not found");
        }
        if (userModel.deleteByID(std::stoi(body["id"].get<std::string>())))
        {
            ClientController cc;
            Role roleModel;
            Client clientModel;
            roleModel.deleteBy({{"user_id", "=", std::to_string(user.id)}});
            clientModel.deleteBy({{"user_id", "=", std::to_string(user.id)}});
            cc.generateServerFile();
            return utils::jsonSuccessResponse({{"message", "User deleted"}, {"id", body["id"].get<std::string>()}});
        }
        else
        {
            return utils::jsonErrorResponse("User not deleted", "id");
        }
    }
    static crow::response addUser(const crow::request &req)
    {
        json body = utils::getBody(req.body);
        if (body == nullptr)
            return utils::jsonErrorResponse("Username or password is empty");
        ValidationResponse error = utils::bodyValidation(body, {{"username", {{"type", "string"}, {"min", "2"}, {"max", "20"}}}, {"password", {{"type", "string"}, {"min", "2"}}}, {"email", {{"type", "email"}, {"min", "2"}}}, {"fullname", {{"type", "string"}, {"min", "2"}}}, {"role", {{"type", "string"}, {"min", "2"}}}});
        if (error.status)
            return utils::jsonErrorResponse(error.message, error.path);
        if (!utils::isAdmin(utils::jsonArrayToVector(req.get_header_value("roles"))))
            return utils::jsonErrorResponse("You are not Allowed to do this action");

        User userModel;
        if (userModel.exist<User>({{"username", "=", body["username"].get<std::string>()}}))
        {
            return utils::jsonErrorResponse("Username already exists", "username");
        }

        int user_id = database.insert_record("users", {{"username", body["username"].get<std::string>()}, {"password", utils::createMd5Hash(body["password"].get<std::string>())}, {"email", body["email"].get<std::string>()}, {"fullname", body["fullname"].get<std::string>()}, {"status", "1"}, {"created_at", utils::now()}, {"updated_at", utils::now()}});
        database.insert_record("roles", {{"user_id", std::to_string(user_id)}, {"role", body["role"].get<std::string>()}, {"created_at", utils::now()}, {"updated_at", utils::now()}});
        return utils::jsonSuccessResponse({{"message", "User added"}, {"user_id", std::to_string(user_id)}});
    }

    json getUsersList(Pagination pagination)
    {
        json usersJson = json::array();
        User userModel;

        for (User user : database.select_records<User>("users", {}, {"users.*, (select count(clients.id) from clients where clients.user_id=users.id) as clients"}))
        {
            usersJson.push_back({{"id", user.id}, {"username", user.username}, {"fullname", user.fullname}, {"email", user.email}, {"status", user.status}, {"roles", json::parse(user.roles)}, {"connections", user.connections}, {"clients", user.clients}, {"created_at", user.created_at}});
        }

        return {{"content", usersJson}, {"total", 100}};
    }

private:
    std::string type;
};
