class ClientController
{
public:
    static crow::response clientsList(const crow::request &req)
    {
        json body = utils::getBody(req.body);
        ClientController cc;

        return utils::jsonSuccessResponse(cc.getClientsList(utils::getPagination(body)));
    }
    static crow::response singleClient(const crow::request &req)
    {
        json body = utils::getBody(req.body);
        if (body == nullptr)
            return utils::jsonErrorResponse("body is requires");
        ValidationResponse error = utils::bodyValidation(body, {{"id", {{"type", "string"}, {"required", "1"}}}});
        if (error.status)
            return utils::jsonErrorResponse(error.message, error.path);

        ClientController ct;
        Client clientModel;
        std::string user_id = req.get_header_value("user_id");

        auto c = clientModel.where<Client>({{"id", "=", body["id"].get<std::string>()}}, {"id", "name", "(SELECT json_group_array(b.ip) from ip_addresses b where b.type='3' AND b.client_id=clients.id) as ipAllocation", "(SELECT json_group_array(b.ip) from ip_addresses b where b.type='4' AND b.client_id=clients.id) as dnsServerIps", "(SELECT json_group_array(b.ip) from ip_addresses b where b.type='5' AND b.client_id=clients.id) as allowedIps"});

        if (c.size() == 0)
            return utils::jsonErrorResponse("Client not exist!", "404");
        Client client = c[0];

        return utils::jsonSuccessResponse({{"client", {{"id", client.id}, {"user_id", client.user_id}, {"name", client.name}, {"public_key", client.public_key}, {"private_key", client.private_key}, {"preshared_key", client.preshared_key}, {"ipAllocation", json::parse(client.ipAllocation)}, {"dnsServerIps", json::parse(client.dnsServerIps)}, {"allowedIps", json::parse(client.allowedIps)}, {"qrcode", ct.generateClientQrCode(client.id)}}}});
    }
    static crow::response updateSingleClient(const crow::request &req)
    {
        json body = utils::getBody(req.body);
        if (body == nullptr)
            return utils::jsonErrorResponse("Name is required");
        ClientController cc;
        std::string user_id = req.get_header_value("user_id");

        Client clientModel;
        Client client = clientModel.find<Client>(std::stoi(body["id"].get<std::string>()));
        if (client.id == 0)
            return utils::jsonErrorResponse("Client not exist");
        return utils::jsonSuccessResponse(cc.updateSingleClientJSON(body, std::stoi(user_id)));
    }
    static crow::response newClientData()
    {
        std::string allocationIp;
        IpAddress ipModel;

        IpAddress ipData = database.select_record<IpAddress>("ip_addresses", {{"type", "=", "3"}}, {"id", "ip"}, "order by ip_addresses.created_at DESC");
        if (ipData.id == 0)
        {
            IpAddress ipAllocation = database.select_record<IpAddress>("ip_addresses", {{"type", "=", "1"}}, {"ip"});
            allocationIp = utils::incrementIpv4(ipAllocation.ip);
        }
        else
        {
            allocationIp = utils::incrementIpv4(ipData.ip);
        }

        return utils::jsonSuccessResponse({{"ipAllocation", json::array({allocationIp + "/24"})}, {"dnsServerIps", json::array({"1.1.1.1"})}, {"allowedIps", json::array({"0.0.0.0/0"})}});
    }
    static crow::response newCLient(const crow::request &req)
    {
        json body = utils::getBody(req.body);
        if (body == nullptr)
            return utils::jsonErrorResponse("Name is required");
        ValidationResponse error = utils::bodyValidation(body, {{"name", {{"type", "string"}, {"min", "2"}, {"max", "30"}}}, {"allowedIps", {{"type", "arrayips"}, {"required", "1"}}}, {"dnsServerIps", {{"type", "arrayips"}, {"required", "1"}}}, {"ipAllocation", {{"type", "arrayips"}, {"required", "1"}}}});
        if (error.status)
            return utils::jsonErrorResponse(error.message, error.path);
        Client clientModel;
        IpAddress ipModel;
        ClientController ct;
        std::string user_id = req.get_header_value("user_id");
        KeyGenerator keys = utils::generateKeys();

        std::cout << "USER ID: " << user_id << std::endl;
        int client_id = clientModel.insert({{"name", body["name"].get<std::string>()}, {"user_id", user_id}, {"public_key", keys.public_key}, {"private_key", keys.private_key}, {"created_at", utils::now()}});
        std::vector<IpAddress> oldIps = ipModel.where<IpAddress>({{"client_id", "=", std::to_string(client_id)}});
        for (IpAddress ip : oldIps)
            ipModel.deleteByID(ip.id);

        for (json ipa : body["ipAllocation"])
        {
            IpAddress::insertIp(ipa, 3, client_id);
        }
        for (json ipb : body["dnsServerIps"])
        {
            IpAddress::insertIp(ipb, 4, client_id);
        }
        for (json ipc : body["allowedIps"])
        {
            IpAddress::insertIp(ipc, 5, client_id);
        }

        Client c = clientModel.where<Client>({{"id", "=", std::to_string(client_id)}}, {"id", "name", "(SELECT json_group_array(b.ip) from ip_addresses b where b.type='3' AND b.client_id=clients.id) as ipAllocation", "(SELECT json_group_array(b.ip) from ip_addresses b where b.type='4' AND b.client_id=clients.id) as dnsServerIps", "(SELECT json_group_array(b.ip) from ip_addresses b where b.type='5' AND b.client_id=clients.id) as allowedIps"})[0];

        ct.generateServerFile();
        return utils::jsonSuccessResponse({{"client_id", client_id}, {"client", {{"id", c.id}, {"user_id", c.user_id}, {"name", c.name}, {"public_key", c.public_key}, {"private_key", c.private_key}, {"preshared_key", c.preshared_key}, {"ipAllocation", json::parse(c.ipAllocation)}, {"dnsServerIps", json::parse(c.dnsServerIps)}, {"allowedIps", json::parse(c.allowedIps)}, {"qrcode", ClientController::generateClientQrCode(c.id)}}}});
    }
    static crow::response deleteClient(const crow::request &req)
    {
        json body = utils::getBody(req.body);
        ValidationResponse error = utils::bodyValidation(body, {{"id", {{"type", "string"}, {"required", "1"}}}});
        if (error.status)
            return utils::jsonErrorResponse(error.message, error.path);
        Client clientModel;
        if (clientModel.deleteByID(std::stoi(body["id"].get<std::string>())))
        {
            return utils::jsonSuccessResponse({{"id", body["id"].get<std::string>()}, {"message", "Client deleted successfully"}});
        }
        else
        {
            return utils::jsonErrorResponse("Client not found");
        }
    }
    static crow::response getClientQrcode(const crow::request &req)
    {
        json body = utils::getBody(req.body);
        if (body == nullptr)
            return utils::jsonErrorResponse("body is requires");
        ValidationResponse error = utils::bodyValidation(body, {{"id", {{"type", "string"}, {"required", "1"}}}});
        if (error.status)
            return utils::jsonErrorResponse(error.message, error.path);

        Client clientModel;
        std::string user_id = req.get_header_value("user_id");
        Client client = clientModel.find<Client>(std::stoi(body["id"].get<std::string>()), {"id", "user_id"});
        if (client.id == 0)
            return utils::jsonErrorResponse("Client not found");
        if (client.user_id != std::stoi(user_id) && !utils::isAdmin(utils::jsonArrayToVector(req.get_header_value("roles"))))
            return utils::jsonErrorResponse("You are not owner of this Client");

        std::string qrcode = generateClientQrCode(client.id);
        return utils::jsonSuccessResponse({{"qrcode", qrcode}});
    }
    static void generateServerFile()
    {
        ClientController ct;
        Client clientModel;
        std::vector<WgStatistics> wgstatistics = utils::wgPeersStatus();
        utils::exec("sudo wg-quick down wg0");
        // Clearing wg0.conf file
        std::ofstream ofs(configEnv.WG_PATH, std::ofstream::out | std::ofstream::trunc);
        ofs.close();

        std::string address = database.select_record<IpAddress>("ip_addresses", {{"type", "=", "1"}}, {"json_group_array(ip) as ips"}).ips;

        // Apend to file
        std::ofstream confFile;
        confFile.open(configEnv.WG_PATH, std::ios::app);
        if (confFile.is_open())
        {
            confFile << ct.serverInterface(utils::jsonArrayToString(json::parse(address)));
            for (Client client : database.select_records<Client>("clients", {}, {"id", "name", "public_key", "private_key"}))
            {
                WgStatistics wgClient = utils::findWgInterfaceStatusByKey(wgstatistics, client.public_key);

                std::cout << "Client: " << client.id << " -  Local: " << wgClient.transferRx << " - DB: " << client.tRx << std::endl;

                if (wgClient.public_key != "")
                {
                    clientModel.update(client.id, {{"tTx", std::to_string(client.tTx + wgClient.transferTx)}, {"tRx", std::to_string(client.tRx + wgClient.transferRx)}, {"transferRx", "0"}, {"transferTx", "0"}, {"lastHandshakeTime", std::to_string(wgClient.lastHandshakeTime)}});
                }
                std::string clientIpDb = database.select_record<IpAddress>("ip_addresses", {{"type", "=", "3"}, {"client_id", "=", std::to_string(client.id)}}, {"json_group_array(octet0 || '.' ||octet1 || '.' || octet2 || '.' || octet3 ||  '/' || '32') as ips"}).ips;
                confFile << ct.serverPeer(client.id, client.public_key, utils::jsonArrayToString(json::parse(clientIpDb)));
            }
            // Close the file
            confFile.close();
            utils::exec("sudo wg-quick up wg0");
        }
        else
        {
            std::cout << "Unable to open " << configEnv.WG_PATH << " for appending." << std::endl;
        }
    }
    static std::string generateClientQrCode(int client_id)
    {
        ClientController ct;
        Client clientModel;
        std::vector<std::string> IP_ADDRESSES_STR = {};
        std::vector<std::string> IP_DNS_STR = {};
        std::vector<std::string> IP_ALLOWED_STR = {};

        Client client = clientModel.find<Client>(client_id, {"id", "private_key"});
        auto ips = database.select_records<IpAddress>("ip_addresses", {{"client_id", "=", std::to_string(client_id)}}, {"id,type,ip"});
        for (IpAddress ip : ips)
        {
            if (ip.type == 5)
                IP_ALLOWED_STR.push_back(ip.ip);
            if (ip.type == 4)
                IP_DNS_STR.push_back(ip.ip);
            if (ip.type == 3)
                IP_ADDRESSES_STR.push_back(ip.ip);
        }

        std::string clientConf = ct.clientConfigTemplate(client.private_key, utils::strVectorToString(IP_ADDRESSES_STR), utils::strVectorToString(IP_DNS_STR), utils::strVectorToString(IP_ALLOWED_STR));

        // std::string config_text = "Conf file here";
        std::string cmd = "qrencode -o - '" + clientConf + "' | base64";
        std::string qrcode = utils::exec(cmd.c_str());
        qrcode.erase(std::remove(qrcode.begin(), qrcode.end(), '\n'), qrcode.end());
        return "data:image/png;base64," + qrcode;
    }
    static std::string generateClient(int client_id)
    {
        ClientController ct;
        Client clientModel;
        std::vector<std::string> IP_ADDRESSES_STR = {};
        std::vector<std::string> IP_DNS_STR = {};
        std::vector<std::string> IP_ALLOWED_STR = {};

        Client client = clientModel.find<Client>(client_id, {"id", "private_key"});
        auto ips = database.select_records<IpAddress>("ip_addresses", {{"client_id", "=", std::to_string(client_id)}}, {"id,type,ip"});
        for (IpAddress ip : ips)
        {
            if (ip.type == 5)
                IP_ALLOWED_STR.push_back(ip.ip);
            if (ip.type == 4)
                IP_DNS_STR.push_back(ip.ip);
            if (ip.type == 3)
                IP_ADDRESSES_STR.push_back(ip.ip);
        }

        return ct.clientConfigTemplate(client.private_key, utils::strVectorToString(IP_ADDRESSES_STR), utils::strVectorToString(IP_DNS_STR), utils::strVectorToString(IP_ALLOWED_STR));
    }
    json getClientsList(Pagination pagination)
    {
        json clientsJson = json::array();
        Client clientModel;
        for (Client c : clientModel.where<Client>({}, {"id", "name", "(SELECT json_group_array(b.ip) from ip_addresses b where b.type='3' AND b.client_id=clients.id) as ipAllocation", "(SELECT json_group_array(b.ip) from ip_addresses b where b.type='4' AND b.client_id=clients.id) as dnsServerIps", "(SELECT json_group_array(b.ip) from ip_addresses b where b.type='5' AND b.client_id=clients.id) as allowedIps", "lastHandshakeTime", "transferRx", "transferTx", "tRx", "tTx"}, "order by clients.created_at DESC"))
        {
            clientsJson.push_back({{"id", c.id}, {"user_id", c.user_id}, {"name", c.name}, {"public_key", c.public_key}, {"private_key", c.private_key}, {"preshared_key", c.preshared_key}, {"ipAllocation", json::parse(c.ipAllocation)}, {"dnsServerIps", json::parse(c.dnsServerIps)}, {"allowedIps", json::parse(c.allowedIps)}, {"lastHandshakeTime", c.lastHandshakeTime}, {"transferRx", c.tRx}, {"transferTx", c.tTx}});
        }
        return {{"content", clientsJson}, {"total", 100}};
    }
    std::string serverInterface(std::string address)
    {
        std::string ct = "";
        ct += "[Interface]\n";
        ct += "PrivateKey = " + configEnv.WG_PRIVATE_KEY + "\n";
        ct += "Address = " + address + "\n";
        ct += "ListenPort = " + configEnv.WG_PORT + "\n";
        if (Option::get("WG_POST_UP") != "")
            ct += "PostUp = " + Option::get("WG_POST_UP") + "\n";
        if (Option::get("WG_POST_DOWN") != "")
            ct += "PostDown = " + Option::get("WG_POST_DOWN") + "\n";
        ct += "\n";
        return ct;
    }
    std::string serverPeer(int client_id, std::string public_key, std::string allowed_ips)
    {
        std::string ct = "";
        ct += "[Peer]\n";
        ct += "#client_id = " + std::to_string(client_id) + "\n";
        ct += "PublicKey = " + public_key + "\n";
        ct += "AllowedIPs = " + allowed_ips + "\n";
        ct += "\n";
        return ct;
    }
    std::string clientConfigTemplate(std::string client_private_key, std::string adresses, std::string dns, std::string allowedips)
    {
        std::string ct = "";
        ct += "[Interface]\n";
        ct += "Address = " + adresses + "\n";
        ct += "PrivateKey = " + client_private_key + "\n";
        ct += "DNS = " + dns + " \n\n";

        ct += "[Peer]\n";
        ct += "PublicKey = " + configEnv.WG_PUBLIC_KEY + "\n";
        ct += "AllowedIPs = " + allowedips + "\n";
        ct += "Endpoint = " + configEnv.WG_ENDPOINT + ":" + configEnv.WG_PORT + "\n";
        ct += "PersistentKeepalive = " + configEnv.WG_PERSISTENT_KEEPALIVE + "\n";

        return ct;
    }
    json updateSingleClientJSON(json body, int user_id)
    {
        Client clientModel;
        Client client = clientModel.find<Client>(std::stoi(body["id"].get<std::string>()));
        if (client.id == 0)
            return utils::jsonError("Client not exist");

        ValidationResponse ipres = inserOrUpdateCLientIPS(client.id, body["ipAllocation"], body["dnsServerIps"], body["allowedIps"]);
        if (!ipres.status)
            return utils::jsonError(ipres.message, ipres.path);

        if (clientModel.update(client.id, {{"name", body["name"].get<std::string>()}}))
        {
            ClientController::generateServerFile();
            return utils::jsonSuccess({});
        }
        else
        {
            return utils::jsonError("Client not Updated. Server Error");
        }
    }

private:
    std::string type;
    ValidationResponse inserOrUpdateCLientIPS(int client_id, json ips, json dns, json allowed)
    {
        IpAddress ipModel;
        ValidationResponse response = {true, "", ""};
        for (json ip : ips)
        {
            ValidationResponse check = isFreeIp(ip, client_id, 3, "ipAllocation");
            if (!check.status)
                response = check;
            else
                IpAddress::insertIp(ip, 3, client_id);
        }

        for (json ipb : dns)
            IpAddress::insertIp(ipb, 4, client_id);

        for (json ipc : allowed)
            IpAddress::insertIp(ipc, 5, client_id);

        return response;
    }
    ValidationResponse isFreeIp(std::string ip, int client_id = 0, int type = 3, std::string path = "")
    {
        IpAddress ipModel;
        if (ipModel.exist<IpAddress>({{"ip", "=", ip}, {"type", "=", std::to_string(type)}, {"client_id", "NOT LIKE", std::to_string(client_id)}}))
        {
            return {false, "Ip address " + ip + " exist to another client", path};
        }
        else
        {
            return {true};
        }
    }
};
