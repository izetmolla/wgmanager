namespace utils
{
    std::string randomString(int n = 10)
    {
        static const char alphabet[] =
            "0123456789"
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            "abcdefghijklmnopqrstuvwxyz";

        const int alphabetSize = sizeof(alphabet) - 1;

        std::string randomString(n, 0);

        srand(time(nullptr)); // Seed the random number generator with the current time

        for (int i = 0; i < n; ++i)
        {
            randomString[i] = alphabet[rand() % alphabetSize];
        }

        return randomString;
    }

    std::string exec(const char *cmd)
    {
        char buffer[128];
        std::string result = "";
        FILE *pipe = popen(cmd, "r");
        if (!pipe)
            throw std::runtime_error("popen() failed!");
        try
        {
            while (fgets(buffer, sizeof buffer, pipe) != nullptr)
            {
                result += buffer;
            }
        }
        catch (...)
        {
            pclose(pipe);
            throw;
        }
        pclose(pipe);
        return result;
    }

    std::vector<std::string> jsonArrayToVector(const std::string &jsonArrayString)
    {
        std::vector<std::string> result;

        // Remove whitespace characters from the JSON array string
        std::string jsonString = jsonArrayString;
        jsonString.erase(std::remove_if(jsonString.begin(), jsonString.end(), [](unsigned char c)
                                        { return std::isspace(c); }),
                         jsonString.end());

        // Check if the string starts with '[' and ends with ']'
        if (jsonString.front() != '[' || jsonString.back() != ']')
        {
            std::cerr << "Invalid JSON array string" << std::endl;
            return result;
        }

        // Extract the individual elements from the JSON array
        std::stringstream ss(jsonString.substr(1, jsonString.length() - 2));
        std::string element;
        while (std::getline(ss, element, ','))
        {
            element = element.substr(1, element.length() - 2);
            result.push_back(element);
        }

        return result;
    }
    bool isAdmin(const std::vector<std::string> arr)
    {
        bool res = false;
        for (std::string ii : arr)
        {
            if (ii == "admin")
            {
                res = true;
                // break;
            }
        }

        return res;
    }

    Pagination getPagination(json data)
    {
        Pagination p;
        // p.page = data["page"].is_null() ? 1 : data["page"].get<int>();

        return p;
    }
    std::string stringReplace(std::string text, std::string oldtext, std::string newtext)
    {
        std::string s(text);
        std::string::size_type pos = s.find(oldtext);
        int oldtextleng = oldtext.length();
        if (pos != std::string::npos)
        {
            s.replace(pos, oldtextleng, newtext); // 5 = length( $name )
        }
        return s;
    }
    crow::response toJSON(json dataJson, int status = 200)
    {
        crow::response response;
        response.body = dataJson.dump();
        response.set_header("Content-Type", "application/json");
        return response;
    }

    std::string getToken(std::string tkn)
    {
        return stringReplace(tkn, "Bearer ", "");
    }
    std::string now()
    {
        std::chrono::system_clock::time_point now = std::chrono::system_clock::now();
        std::time_t unixTime = std::chrono::system_clock::to_time_t(now);
        return std::to_string(unixTime);
    }
    json getBody(std::string body)
    {
        json data = nullptr;
        if (body.empty())
        {
            return data;
        }
        return json::parse(body);
    }
    std::string jsonArrayToString(json arrayObj)
    {
        if (arrayObj.size() == 0)
            return "";
        std::string result;
        for (auto &element : arrayObj)
        {
            result += element.get<std::string>() + ",";
        }
        result.pop_back();
        return result;
    }
    std::vector<WgStatistics> wgPeersStatus()
    {
        std::vector<WgStatistics> peers = {};
        std::string dump = exec("sudo wg show wg0 dump");

        std::istringstream iss(dump);
        std::string line;

        while (std::getline(iss, line))
        {
            std::vector<std::string> t;
            std::istringstream issLine(line);
            std::string token;
            while (std::getline(issLine, token, '\t'))
            {
                t.push_back(token);
            }
            if (t.size() > 4)
            {
                peers.push_back({t[0], t[1], t[2], t[3], std::stoi(sizeof(t[4]) ? t[4] : "0"), std::stoi(sizeof(t[5]) ? t[5] : "0"), std::stoi(sizeof(t[6]) ? t[6] : "0"), 0, 0});
            }
        }

        return peers;
    }
    WgStatistics findWgInterfaceStatusByKey(const std::vector<WgStatistics> &statusVec, const std::string &publicKey)
    {
        for (const auto &status : statusVec)
        {
            if (status.public_key == publicKey)
            {
                return status;
            }
        }
        // return a default-constructed object if the key is not found
        return WgStatistics();
    }
    bool isEmail(const std::string &email)
    {
        std::regex pattern("(\\w+)(\\.|_)?(\\w*)@(\\w+)(\\.(\\w+))+");
        return std::regex_match(email, pattern);
    }
    bool isValidIPv4(std::string ip)
    {
        std::vector<std::string> parts;
        std::string part = "";
        for (char c : ip)
        {
            if (c == '.')
            {
                if (part.empty())
                {
                    return false;
                }
                parts.push_back(part);
                part = "";
            }
            else if (isdigit(c))
            {
                part += c;
            }
            else
            {
                return false;
            }
        }
        if (part.empty() || parts.size() != 3)
        {
            return false;
        }
        parts.push_back(part);
        for (std::string part : parts)
        {
            int num = std::stoi(part);
            if (num < 0 || num > 255 || (part.size() > 1 && part[0] == '0'))
            {
                return false;
            }
        }
        return true;
    }
    bool isValidIPv6(std::string ip)
    {
        std::vector<std::string> parts;
        std::string part = "";
        for (char c : ip)
        {
            if (c == ':')
            {
                if (part.empty())
                {
                    return false;
                }
                parts.push_back(part);
                part = "";
            }
            else if (isxdigit(c))
            {
                part += c;
            }
            else
            {
                return false;
            }
        }
        if (part.empty() || parts.size() != 7)
        {
            return false;
        }
        parts.push_back(part);
        for (std::string part : parts)
        {
            if (part.size() > 4)
            {
                return false;
            }
        }
        return true;
    }
    bool isValidIP(std::string ip)
    {
        size_t slashIndex = ip.find("/");
        if (slashIndex != std::string::npos)
        {
            std::string prefix = ip.substr(slashIndex + 1);
            if (!isdigit(prefix[0]))
            {
                return false;
            }
            int prefixLen = std::stoi(prefix);
            if (prefixLen < 0 || prefixLen > 32)
            {
                return false;
            }
            ip = ip.substr(0, slashIndex);
        }
        return isValidIPv4(ip) || isValidIPv6(ip);
    }
    std::vector<ColumnDbObject> dbColumnItem(std::vector<ColumnDbObject> items = {})
    {
        std::vector<ColumnDbObject> current = {{"id", "INTEGER PRIMARY KEY AUTOINCREMENT", ""}};
        for (auto item : items)
        {
            current.push_back(item);
        }
        current.push_back({"created_at", "TEXT", "CURRENT_TIMESTAMP"});
        current.push_back({"updated_at", "TEXT", "CURRENT_TIMESTAMP"});
        return current;
    }
    void setConfigEnvVar(std::string key, std::string value)
    {
        ConfigEnv *e = &configEnv;
        if (key == "PORT")
            e->port = std::stoi(value);
        if (key == "HOST")
            e->host = value;
        if (key == "DB_PATH")
            e->db_path = value;
    }
    void loadEnvFromFile()
    {
        std::ifstream file(".env");
        std::string str;
        while (std::getline(file, str))
        {
            std::istringstream is_line(str);
            std::string key;
            if (std::getline(is_line, key, '='))
            {
                std::string value;
                if (std::getline(is_line, value))
                {
                    setenv(key.c_str(), value.c_str(), 1);
                    setConfigEnvVar(key, value);
                }
            }
        }
    }
    std::string getEnv(std::string key)
    {
        return std::getenv(key.c_str());
    }
    std::string strVectorToString(std::vector<std::string> vec)
    {
        if (vec.size() == 0)
            return "";
        std::string result = "";
        for (std::string element : vec)
        {
            result += element + ",";
        }
        result.pop_back();
        return result;
    }
    std::string jsonToSqliteInsert(std::string table_name, std::vector<std::pair<std::string, std::string>> content)
    {
        std::string query = "INSERT INTO " + table_name + " (";
        std::string values = "VALUES (";
        for (const auto &item : content)
        {
            query += item.first + ",";
            values += "'" + item.second + "',";
        }
        query.pop_back(); // Remove the trailing comma
        values.pop_back();
        query += ") ";
        values += ");";
        query += values;
        return query;
    }
    std::string jsonToSqliteMigration(std::string table_name, std::vector<ColumnDbObject> columns)
    {
        std::string query = "CREATE TABLE IF NOT EXISTS " + table_name + " (";
        for (const auto &column : columns)
        {
            query += column.name + " " + column.type + (column.defaultValue != "" ? " DEFAULT " + column.defaultValue : "") + ",";
        }
        query.pop_back(); // Remove the trailing comma
        query += ");";
        // std::cout << query << std::endl;
        return query;
    }
    std::string jsonToSqliteUpdate(std::string table_name, std::vector<std::pair<std::string, std::string>> content, std::vector<DbConditionObject> conditions = {})
    {
        std::stringstream query;

        query << "UPDATE " << table_name << " SET ";

        for (size_t i = 0; i < content.size(); ++i)
        {
            std::string ctt = content[i].second;
            (ctt == "") ? (query << content[i].first << " = NULL") : (query << content[i].first << " = '" << ctt << "'");

            if (i != content.size() - 1)
            {
                query << ", ";
            }
        }

        if (!conditions.empty())
        {
            query << " WHERE ";
            for (size_t i = 0; i < conditions.size(); ++i)
            {
                std::string aaaa = conditions[i].atrValue;
                (aaaa == "") ? (query << conditions[i].attribute << " " << conditions[i].condition) : (query << conditions[i].attribute << " " << conditions[i].condition << " '" << aaaa << "'");

                if (i != conditions.size() - 1)
                {
                    (conditions[i].operatorType != "") ? (query << " " + conditions[i].operatorType + " ") : (query << " AND ");
                }
            }
        }

        return query.str();
    }

    std::string createDeleteSqlQuery(std::string table, const std::vector<DbConditionObject> conditions, std::string end_query = "")
    {
        std::stringstream query;
        query << "DELETE FROM " << table << "";

        if (!conditions.empty())
        {
            query << " WHERE ";
            for (size_t i = 0; i < conditions.size(); ++i)
            {
                std::string aaaa = conditions[i].atrValue;
                (aaaa == "") ? (query << conditions[i].attribute << " " << conditions[i].condition) : (query << conditions[i].attribute << " " << conditions[i].condition << " '" << aaaa << "'");

                if (i != conditions.size() - 1)
                {
                    (conditions[i].operatorType != "") ? (query << " " + conditions[i].operatorType + " ") : (query << " AND ");
                }
            }
        }
        query << " " + end_query;
        return query.str();
    }
    std::string createSelectSqlQuery(std::string table, const std::vector<DbConditionObject> conditions, std::string attributes = "*", std::string end_query = "", std::string joinQuery = "")
    {
        std::stringstream query;
        query << "SELECT " << attributes << " FROM " << table << " " << joinQuery << " ";

        if (!conditions.empty())
        {

            query << " WHERE ";
            for (size_t i = 0; i < conditions.size(); ++i)
            {
                std::string aaaa = conditions[i].atrValue;
                (aaaa == "") ? (query << conditions[i].attribute << " " << conditions[i].condition) : (query << conditions[i].attribute << " " << conditions[i].condition << " '" << aaaa << "'");

                if (i != conditions.size() - 1)
                {
                    (conditions[i].operatorType != "") ? (query << " " + conditions[i].operatorType + " ") : (query << " AND ");
                }
            }
        }
        query << " " + end_query;
        return query.str();
    }

    std::string createCountSqlQuery(std::string table, const std::vector<DbConditionObject> conditions, std::string attributes = "id", std::string end_query = "")
    {
        std::stringstream query;
        query << "SELECT count(" << attributes << ") as count_nr FROM " << table << "";
        if (!conditions.empty())
        {

            query << " WHERE ";
            for (size_t i = 0; i < conditions.size(); ++i)
            {
                std::string aaaa = conditions[i].atrValue;
                (aaaa == "") ? (query << conditions[i].attribute << " " << conditions[i].condition) : (query << conditions[i].attribute << " " << conditions[i].condition << " '" << aaaa << "'");

                if (i != conditions.size() - 1)
                {
                    (conditions[i].operatorType != "") ? (query << " " + conditions[i].operatorType + " ") : (query << " AND ");
                }
            }
        }
        query << " " + end_query;
        return query.str();
    }

    std::vector<std::string> parseIPtoOctets(std::string ip)
    {
        std::vector<std::string> octets;
        if (ip.find(":") != std::string::npos)
        {
            // IPv6 address
            size_t start = 0, end = 0;
            while (end != std::string::npos)
            {
                end = ip.find(":", start);
                std::string octet = ip.substr(start, end - start);
                octets.push_back(octet);
                start = end + 1;
            }
        }
        else
        {
            // IPv4 address
            size_t start = 0, end = 0;
            while (end != std::string::npos)
            {
                end = ip.find(".", start);
                std::string octet = ip.substr(start, end - start);
                octets.push_back(octet);
                start = end + 1;
            }
        }
        return octets;
    }

    std::string incrementIpv4(const std::string &last_ip)
    {
        std::stringstream ss(last_ip);
        std::string octet;
        int octets[4];
        int i = 0;

        while (getline(ss, octet, '.'))
        {
            octets[i] = stoi(octet);
            i++;
        }

        octets[3]++; // increment last octet

        if (octets[3] > 255)
        {
            octets[3] = 0; // reset last octet to 0
            octets[2]++;   // increment third octet

            if (octets[2] > 255)
            {
                octets[2] = 0; // reset third octet to 0
                octets[1]++;   // increment second octet

                if (octets[1] > 255)
                {
                    octets[1] = 0; // reset second octet to 0
                    octets[0]++;   // increment first octet

                    if (octets[0] > 255)
                    {
                        std::cout << "Error: invalid IP address" << std::endl;
                        return "Error: invalid IP address";
                    }
                }
            }
        }

        std::stringstream new_ip;
        new_ip << octets[0] << "." << octets[1] << "." << octets[2] << "." << octets[3];
        return new_ip.str();
    }

    ParsedIp parseIP(std::string input)
    {
        ParsedIp ipObj;
        json res = nullptr;
        std::string ip = "";
        size_t slashIndex = input.find("/");
        if (slashIndex != std::string::npos)
        {
            ip = input.substr(0, slashIndex);
        }
        else
        {
            ip = input;
        }
        if (isValidIP(ip))
        {
            std::vector<std::string> octets = parseIPtoOctets(ip);
            for (size_t i = 0; i < octets.size(); ++i)
            {
                if (i == 0)
                    ipObj.octet0 = octets[i];
                if (i == 1)
                    ipObj.octet1 = octets[i];
                if (i == 2)
                    ipObj.octet2 = octets[i];
                if (i == 3)
                    ipObj.octet3 = octets[i];
            }
            ipObj.ip = ip;
            ipObj.cidr = input.substr(slashIndex + 1);
            return ipObj;
        }
        return ipObj;
    }
    json jsonError(std::string message, std::string path = "")
    {
        return {{"status", "error"}, {"error", {{"message", message}, {"path", path}}}, {"data", json::object()}};
    }
    crow::response jsonErrorResponse(std::string message, std::string path = "")
    {
        crow::response response;
        json error = jsonError(message, path);
        response.body = error.dump();
        response.set_header("Content-Type", "application/json");
        return response;
    }
    json jsonSuccess(json data)
    {
        return {{"status", "success"}, {"error", json::object()}, {"data", data}};
    }
    crow::response jsonSuccessResponse(json data)
    {
        crow::response response;
        json content = jsonSuccess(data);
        response.body = content.dump();
        response.set_header("Content-Type", "application/json");
        return response;
    }
    std::string createMd5Hash(const std::string &password)
    {
        unsigned char hashed[SHA256_DIGEST_LENGTH];
        SHA256((const unsigned char *)password.c_str(), password.length(), hashed);
        std::string result;
        char hexBuffer[3];

        for (int i = 0; i < SHA256_DIGEST_LENGTH; i++)
        {
            sprintf(hexBuffer, "%02x", hashed[i]);
            result += hexBuffer;
        }
        return result;
    }
    bool validateMd5Hash(const std::string &password, const std::string &hashedPassword)
    {
        std::string hashed = createMd5Hash(password);
        return hashed == hashedPassword;
    }

    ValidationResponse bodyValidation(const json &body, const std::vector<ValidationSchema> &rules)
    {
        ValidationResponse response;
        for (const auto &rule : rules)
        {
            const auto &key = rule.key;
            const auto &value = body[key];

            if (!value.is_null() && !value.is_object() && !value.is_array() && !value.is_string() && !value.is_number() && !value.is_boolean())
            {
                response.message = "Field " + key + " must be an object or an array or an string or an boolean or an number";
                response.path = key;
            }

            for (const auto &r : rule.rules)
            {
                const auto &optionName = r.first;
                const auto &optionVal = r.second;

                if (optionName == "required" && optionVal == "1" && (value.is_null() || value.empty() || value == ""))
                {
                    response.path = key;
                    response.message = "Field " + key + " is required";
                }

                if (optionName == "type")
                {
                    if (optionVal == "string" && !value.is_string())
                    {
                        response.path = key;
                        response.message = "Field " + key + " must be a string";
                    }
                    else if (optionVal == "number" && !value.is_number())
                    {
                        response.path = key;
                        response.message = "Field " + key + " must be a number";
                    }
                    else if (optionVal == "boolean" && !value.is_boolean())
                    {
                        response.path = key;
                        response.message = "Field " + key + " must be a boolean";
                    }
                    else if (optionVal == "array" && !value.is_array())
                    {
                        response.path = key;
                        response.message = "Field " + key + " must be an array";
                    }
                    else if (optionVal == "object" && !value.is_object())
                    {
                        response.path = key;
                        response.message = "Field " + key + " must be an object";
                    }
                    else if (optionVal == "email" && !isEmail(value.get<std::string>()))
                    {
                        response.path = key;
                        response.message = "Field " + key + " must be an email";
                    }
                    else if (optionVal == "ip" && !isValidIP(value.get<std::string>()))
                    {
                        response.path = key;
                        response.message = "Field " + key + " must be an ip address";
                    }

                    else if (optionVal == "arrayips" && !value.is_array())
                    {
                        response.path = key;
                        response.message = "Field " + key + " must be an array";
                    }
                    else if (optionVal == "arrayips" && value.is_array())
                    {
                        for (const auto &ip : value)
                        {
                            if (!isValidIP(ip.get<std::string>()))
                            {
                                response.path = key;
                                response.message = "Value " + ip.get<std::string>() + " must be an ip addresses";
                            }
                        }
                    }
                }
                if (optionName == "min" && value.is_string())
                {
                    if (value.get<std::string>().length() < std::stoi(optionVal))
                    {
                        response.path = key;
                        response.message = "Field " + key + " must be at least " + optionVal + " characters";
                    }
                }
                if (optionName == "max" && value.is_string())
                {
                    if (value.get<std::string>().length() > std::stoi(optionVal))
                    {
                        response.path = key;
                        response.message = "Field " + key + " must be at most " + optionVal + " characters";
                    }
                }
            }
        }
        if (response.message != "")
        {
            response.status = true;
        }
        return response;
    }

    std::string getOption(std::string opt)
    {
        return opt;
    }

    KeyGenerator generateKeys()
    {
        json keys;
        std::string privateKey = exec("wg genkey");
        privateKey.erase(std::remove(privateKey.begin(), privateKey.end(), '\n'), privateKey.end());
        std::string publicKeyCmd = "echo " + privateKey + " | wg pubkey";
        std::string publicKey = exec(publicKeyCmd.c_str());
        publicKey.erase(std::remove(publicKey.begin(), publicKey.end(), '\n'), publicKey.end());
        return {publicKey, privateKey};
    }
};