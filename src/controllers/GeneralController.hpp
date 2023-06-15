class GeneralController
{
private:
    /* data */
public:
    static crow::response index(const crow::request &req)
    {
        auto page = crow::mustache::load("index.html");
        crow::mustache::context ctx({});
        return page.render(ctx);
    }

    static crow::response getSettings(const crow::request &req)
    {
        IpAddress ipModel;
        json WG_IPV4_NETWORK = json::array();
        json WG_DNS_IP = json::array();
        for (IpAddress ip : ipModel.where<IpAddress>({{"type", "=", "1", "OR"}, {"type", "=", "2"}}))
        {
            if (ip.type == 1)
            {
                WG_IPV4_NETWORK.push_back(ip.ip);
            }
            else if (ip.type == 2)
            {
                WG_DNS_IP.push_back(ip.ip);
            }
        }

        return utils::jsonSuccessResponse({
            {"WG_PUBLIC_KEY", Option::get("WG_PUBLIC_KEY")},
            {"WG_PRIVATE_KEY", Option::get("WG_PRIVATE_KEY")},
            {"WG_ENDPOINT", Option::get("WG_ENDPOINT")},
            {"WG_PERSISTENT_KEEPALIVE", Option::get("WG_PERSISTENT_KEEPALIVE")},
            {"WG_MTU", Option::get("WG_MTU")},
            {"WG_IPV4_NETWORK", WG_IPV4_NETWORK},
            {"WG_DNS_IP", WG_DNS_IP},
            {"WG_PORT", Option::get("WG_PORT")},
            {"WG_POST_UP", Option::get("WG_POST_UP")},
            {"WG_POST_DOWN", Option::get("WG_POST_DOWN")},
        });
    }

    static crow::response updateSettings(const crow::request &req)
    {
        GeneralController gc;
        json body = utils::getBody(req.body);
        if (body == nullptr)
            return utils::jsonErrorResponse("Body is required");
        ValidationResponse error = utils::bodyValidation(body, {{"WG_ENDPOINT", {{"type", "ip"}, {"required", "1"}}}, {"WG_IPV4_NETWORK", {{"type", "arrayips"}, {"required", "1"}}}, {"WG_DNS_IP", {{"type", "arrayips"}, {"required", "1"}}}, {"WG_PORT", {{"type", "string"}, {"required", "1"}}}, {"WG_PERSISTENT_KEEPALIVE", {{"type", "string"}, {"required", "1"}}}});
        if (error.status)
            return utils::jsonErrorResponse(error.message, error.path);
        return utils::jsonSuccessResponse(gc.updateSettingsDataJSON(body));
    }

    static std::string setOption(std::string name, std::string option)
    {
        // LoadENV::update(name, option);
        if (option == "")
        {
            database.query_delete("DELETE from options where name LIKE '" + name + "'");
            return "";
        }
        else
        {
            Option optModel;
            if (optModel.count<Option>({{"name", "=", name}}) == 0)
                database.insert_record("options", {{"name", name}, {"option", option}, {"created_at", utils::now()}, {"updated_at", utils::now()}});
            else
                database.update_record("options", {{"option", option}, {"updated_at", utils::now()}}, {{"name", "=", name}});

            configEnv.setEnv(name, option);
            return option;
        }
    }

    json updateSettingsDataJSON(json body)
    {

        database.query_delete("DELETE FROM ip_addresses WHERE (type = 1 OR type = 2) AND client_id = 0;");
        for (size_t i = 0; i < body["WG_IPV4_NETWORK"].size(); i++)
        {
            int aaa = IpAddress::insertIp(body["WG_IPV4_NETWORK"][i], 1, 0);
        }
        for (size_t i = 0; i < body["WG_DNS_IP"].size(); i++)
        {
            IpAddress::insertIp(body["WG_DNS_IP"][i], 2, 0);
        }

        GeneralController::setOption("WG_ENDPOINT", body["WG_ENDPOINT"].get<std::string>());
        GeneralController::setOption("WG_PERSISTENT_KEEPALIVE", body["WG_PERSISTENT_KEEPALIVE"].get<std::string>());
        GeneralController::setOption("WG_MTU", body["WG_MTU"].get<std::string>());
        GeneralController::setOption("WG_PORT", body["WG_PORT"].get<std::string>());
        GeneralController::setOption("WG_POST_UP", body["WG_POST_UP"].get<std::string>());
        GeneralController::setOption("WG_POST_DOWN", body["WG_POST_DOWN"].get<std::string>());
        ClientController::generateServerFile();
        return {};
    }

    static crow::response generateNewKeys(const crow::request &req)
    {
        KeyGenerator keys = utils::generateKeys();
        GeneralController::setOption("WG_PUBLIC_KEY", keys.public_key);
        GeneralController::setOption("WG_PRIVATE_KEY", keys.private_key);
        GeneralController::setOption("WG_PRESHARED_KEY", keys.preshared_key);
        ClientController::generateServerFile();
        return utils::jsonSuccessResponse({{"WG_PUBLIC_KEY", keys.public_key}, {"WG_PRIVATE_KEY", keys.private_key}});
    }

    static crow::response createDownloadToken(const crow::request &req)
    {
        json result;
        std::string id = (req.url_params.get("id") == nullptr ? "" : req.url_params.get("id"));
        std::string user_id = req.get_header_value("user_id");
        Client client = database.select_record<Client>("clients", {{"id", "=", id}, {"user_id", "=", user_id}});

        if (client.id == 0)
            return utils::jsonErrorResponse("Client Not exist");
        else
        {
            std::string token = utils::randomString(25);
            int token_id = database.insert_record("session_tokens", {{"token", token}, {"user_id", user_id}, {"object_id", std::to_string(client.id)}});
            return utils::jsonSuccessResponse({{"token", token}});
        }
    }

    static crow::response downloadWgClientConfig(const crow::request &req)
    {
        Client clientModel;
        SessionToken sessionTokenModel;
        crow::response response;
        std::stringstream stream;
        std::string token = (req.url_params.get("token") == nullptr ? "" : req.url_params.get("token"));
        SessionToken st = SessionToken::findByToken<SessionToken>(token);

        if (st.id == 0)
        {
            response.body = "401";
            return response;
        }

        Client client = database.select_record<Client>("clients", {{"id", "=", st.object_id}});
        sessionTokenModel.deleteByID(st.id);
        if (client.id == 0)
        {
            response.body = "404";
            return response;
        }
        else
        {

            stream << ClientController::generateClient(client.id);
            // // Set the response headers
            response.set_header("Content-Type", "text/plain");
            response.set_header("Content-Disposition", "attachment; filename=" + client.name + ".conf");
            response.set_header("Content-Length", std::to_string(stream.str().size()));
            // // Send the string
            response.body = stream.str();
            return response;
        }
    }
};
